/* eslint-disable @typescript-eslint/no-require-imports */
/*
    MongoDB-based caching service for GitHub stats and language data.
    Provides caching with TTL, compression, and performance monitoring.
*/

import { MongoClient, Db, Collection } from 'mongodb';

interface CacheEntry {
  _id?: string;
  key: string;
  data: any;
  compressedData?: string;
  isCompressed: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessedAt: Date;
  dataSize: number;
  compressionRatio?: number;
  tags: string[];
  metadata: {
    username?: string;
    type: 'language-stats' | 'github-stats' | 'social-stats' | 'repo-data';
    version: string;
  };
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalSize: number;
  compressionSavings: number;
  avgAccessTime: number;
}

class MongoDBCacheService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private cache: Collection<CacheEntry> | null = null;
  private stats: Collection<{ _id: string; [key: string]: any }> | null = null;
  private isConnected = false;
  private connectionRetries = 0;
  private maxRetries = 3;
  
  // Free tier limits
  private readonly MAX_DOCUMENT_SIZE = 16 * 1024 * 1024; 
  private readonly MAX_CACHE_SIZE = 500 * 1024 * 1024; 
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000;
  
  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
      
      if (!mongoUri) {
        console.warn('⚠️ MongoDB URI not found. Using in-memory cache fallback.');
        return;
      }

      this.client = new MongoClient(mongoUri, {
        maxPoolSize: 10, 
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxIdleTimeMS: 300000,
        retryWrites: true,
        retryReads: true,
      });

      await this.client.connect();
      this.db = this.client.db('github_readme_cache');
      this.cache = this.db.collection<CacheEntry>('cache_entries');
      this.stats = this.db.collection('cache_stats');

      await this.createIndexes();
      
      this.startCleanupRoutine();
      
      this.isConnected = true;
      console.log('✅ MongoDB cache service connected successfully');
      
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      this.connectionRetries++;
      
      if (this.connectionRetries < this.maxRetries) {
        console.log(`🔄 Retrying connection (${this.connectionRetries}/${this.maxRetries})...`);
        setTimeout(() => this.initializeConnection(), 5000);
      } else {
        console.warn('⚠️ Max retries reached. Using in-memory cache fallback.');
      }
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.cache) return;

    try {
      await this.cache.createIndex({ key: 1, expiresAt: 1 });
      
      await this.cache.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      
      await this.cache.createIndex({ 'metadata.username': 1, 'metadata.type': 1 });
      await this.cache.createIndex({ tags: 1 });
      await this.cache.createIndex({ lastAccessedAt: 1 });
      
      console.log('✅ Cache indexes created successfully');
    } catch (error) {
      console.warn('⚠️ Index creation failed:', error);
    }
  }

  private compressData(data: any): { compressed: string; ratio: number } {
    try {
      const jsonString = JSON.stringify(data);
      const originalSize = Buffer.byteLength(jsonString, 'utf8');
      
      // Simple compression using deflate
      const compressed = require('zlib').deflateSync(jsonString).toString('base64');
      const compressedSize = Buffer.byteLength(compressed, 'utf8');
      
      return {
        compressed,
        ratio: originalSize > 0 ? compressedSize / originalSize : 1
      };
    } catch (error) {
      console.warn('Compression failed:', error);
      return { compressed: JSON.stringify(data), ratio: 1 };
    }
  }

  private decompressData(compressed: string): any {
    try {
      const buffer = Buffer.from(compressed, 'base64');
      const decompressed = require('zlib').inflateSync(buffer).toString('utf8');
      return JSON.parse(decompressed);
    } catch (error) {
      console.warn('Decompression failed:', error);
      return null;
    }
  }

  async set(
    key: string, 
    data: any, 
    options: {
      ttl?: number;
      tags?: string[];
      username?: string;
      type?: CacheEntry['metadata']['type'];
      compress?: boolean;
    } = {}
  ): Promise<boolean> {
    if (!this.isConnected || !this.cache) {
      return this.setInMemory(key, data, options.ttl);
    }

    try {
      const now = new Date();
      const ttl = options.ttl || this.DEFAULT_TTL;
      const expiresAt = new Date(now.getTime() + ttl);
      
      let finalData = data;
      let compressedData: string | undefined;
      let isCompressed = false;
      let compressionRatio = 1;
      
      // Compress large data automatically
      const dataSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
      const shouldCompress = options.compress !== false && dataSize > 1024; // Compress if > 1KB
      
      if (shouldCompress) {
        const compression = this.compressData(data);
        compressedData = compression.compressed;
        compressionRatio = compression.ratio;
        isCompressed = true;
        finalData = undefined; // Don't store uncompressed data
      }

      const entry: CacheEntry = {
        key,
        data: finalData,
        compressedData,
        isCompressed,
        createdAt: now,
        updatedAt: now,
        expiresAt,
        accessCount: 0,
        lastAccessedAt: now,
        dataSize,
        compressionRatio,
        tags: options.tags || [],
        metadata: {
          username: options.username,
          type: options.type || 'github-stats',
          version: '1.0'
        }
      };

      if (dataSize > this.MAX_DOCUMENT_SIZE) {
        console.warn(`⚠️ Data too large for cache: ${dataSize} bytes`);
        return false;
      }

      await this.cache.replaceOne(
        { key },
        entry,
        { upsert: true }
      );

      await this.updateStats('set', dataSize);
      
      console.log(`✅ Cached: ${key} (${this.formatBytes(dataSize)}, compressed: ${isCompressed})`);
      return true;
      
    } catch (error) {
      console.error('Cache set error:', error);
      return this.setInMemory(key, data, options.ttl);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.cache) {
      return this.getInMemory<T>(key);
    }

    try {
      const entry = await this.cache.findOne({ key });
      
      if (!entry) {
        await this.updateStats('miss');
        return null;
      }

      // Check expiration
      if (entry.expiresAt < new Date()) {
        await this.cache.deleteOne({ key });
        await this.updateStats('miss');
        return null;
      }

      // Update access statistics
      await this.cache.updateOne(
        { key },
        {
          $inc: { accessCount: 1 },
          $set: { lastAccessedAt: new Date() }
        }
      );

      await this.updateStats('hit');

      // Return decompressed data if needed
      if (entry.isCompressed && entry.compressedData) {
        const decompressed = this.decompressData(entry.compressedData);
        return decompressed as T;
      }

      return entry.data as T;
      
    } catch (error) {
      console.error('Cache get error:', error);
      return this.getInMemory<T>(key);
    }
  }

  async invalidate(pattern: string | RegExp): Promise<number> {
    if (!this.isConnected || !this.cache) {
      return this.invalidateInMemory(pattern);
    }

    try {
      let filter: any;
      
      if (typeof pattern === 'string') {
        filter = { key: { $regex: pattern, $options: 'i' } };
      } else {
        filter = { key: { $regex: pattern.source, $options: pattern.flags } };
      }

      const result = await this.cache.deleteMany(filter);
      console.log(`🗑️ Invalidated ${result.deletedCount} cache entries`);
      
      return result.deletedCount || 0;
    } catch (error) {
      console.error('Cache invalidation error:', error);
      return 0;
    }
  }

  async invalidateByTag(tag: string): Promise<number> {
    if (!this.isConnected || !this.cache) {
      return 0;
    }

    try {
      const result = await this.cache.deleteMany({ tags: tag });
      console.log(`🗑️ Invalidated ${result.deletedCount} entries with tag: ${tag}`);
      
      return result.deletedCount || 0;
    } catch (error) {
      console.error('Tag invalidation error:', error);
      return 0;
    }
  }

  async getStats(): Promise<CacheStats> {
    if (!this.isConnected || !this.cache || !this.stats) {
      return {
        totalEntries: this.memoryCache.size,
        hitRate: this.memoryStats.hits / (this.memoryStats.hits + this.memoryStats.misses) || 0,
        totalSize: 0,
        compressionSavings: 0,
        avgAccessTime: 0
      };
    }

    try {
      const [totalEntries, statsDoc] = await Promise.all([
        this.cache.countDocuments(),
        this.stats.findOne({ _id: 'global' })
      ]);

      const aggregation = await this.cache.aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: '$dataSize' },
            avgCompressionRatio: { $avg: '$compressionRatio' },
            totalAccessCount: { $sum: '$accessCount' }
          }
        }
      ]).toArray();

      const agg = aggregation[0] || {};
      const stats = statsDoc || { hits: 0, misses: 0, totalResponseTime: 0 };

      return {
        totalEntries,
        hitRate: stats.hits / (stats.hits + stats.misses) || 0,
        totalSize: agg.totalSize || 0,
        compressionSavings: (1 - (agg.avgCompressionRatio || 1)) * 100,
        avgAccessTime: stats.totalResponseTime / (stats.hits || 1)
      };
    } catch (error) {
      console.error('Stats retrieval error:', error);
      return {
        totalEntries: 0,
        hitRate: 0,
        totalSize: 0,
        compressionSavings: 0,
        avgAccessTime: 0
      };
    }
  }

  private async updateStats(operation: 'hit' | 'miss' | 'set', dataSize?: number): Promise<void> {
    if (!this.stats) return;

    try {
      const update: any = {};
      
      if (operation === 'hit') {
        update.$inc = { hits: 1 };
      } else if (operation === 'miss') {
        update.$inc = { misses: 1 };
      } else if (operation === 'set' && dataSize) {
        update.$inc = { sets: 1, totalDataSize: dataSize };
      }

      await this.stats.updateOne(
        { _id: 'global' },
        update,
        { upsert: true }
      );
    } catch (error) {
      console.warn('Stats update failed:', error);
    }
  }

  private startCleanupRoutine(): void {
    // Clean up expired entries every hour
    setInterval(async () => {
      if (!this.cache) return;

      try {
        const result = await this.cache.deleteMany({
          expiresAt: { $lt: new Date() }
        });
        
        if (result.deletedCount && result.deletedCount > 0) {
          console.log(`🧹 Cleaned up ${result.deletedCount} expired cache entries`);
        }
      } catch (error) {
        console.warn('Cleanup routine error:', error);
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('📝 MongoDB cache connection closed');
    }
  }

  // Fallback in-memory cache
  private memoryCache = new Map<string, { data: any; expiresAt: number }>();
  private memoryStats = { hits: 0, misses: 0 };

  private setInMemory(key: string, data: any, ttl?: number): boolean {
    const expiresAt = Date.now() + (ttl || this.DEFAULT_TTL);
    this.memoryCache.set(key, { data, expiresAt });
    return true;
  }

  private getInMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) {
      this.memoryStats.misses++;
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.memoryCache.delete(key);
      this.memoryStats.misses++;
      return null;
    }

    this.memoryStats.hits++;
    return entry.data as T;
  }

  private invalidateInMemory(pattern: string | RegExp): number {
    let count = 0;
    for (const key of this.memoryCache.keys()) {
      const matches = typeof pattern === 'string' 
        ? key.includes(pattern)
        : pattern.test(key);
      
      if (matches) {
        this.memoryCache.delete(key);
        count++;
      }
    }
    return count;
  }
}

// Singleton instance
export const cacheService = new MongoDBCacheService();

// Helper functions for common caching patterns
export const cacheHelpers = {
  // Cache GitHub language stats with intelligent key generation
  async cacheLanguageStats(username: string, data: any, maxLanguages = 8): Promise<boolean> {
    const key = `lang_stats:${username}:${maxLanguages}:v2`;
    return cacheService.set(key, data, {
      ttl: 6 * 60 * 60 * 1000, // 6 hours
      tags: ['language-stats', `user:${username}`],
      username,
      type: 'language-stats',
      compress: true
    });
  },

  async getLanguageStats(username: string, maxLanguages = 8): Promise<any | null> {
    const key = `lang_stats:${username}:${maxLanguages}:v2`;
    return cacheService.get(key);
  },

  // Cache GitHub user stats
  async cacheUserStats(username: string, data: any): Promise<boolean> {
    const key = `user_stats:${username}:v2`;
    return cacheService.set(key, data, {
      ttl: 12 * 60 * 60 * 1000, // 12 hours
      tags: ['user-stats', `user:${username}`],
      username,
      type: 'github-stats',
      compress: true
    });
  },

  async getUserStats(username: string): Promise<any | null> {
    const key = `user_stats:${username}:v2`;
    return cacheService.get(key);
  },

  // Cache repository data
  async cacheRepoData(username: string, repoName: string, data: any): Promise<boolean> {
    const key = `repo:${username}:${repoName}:v2`;
    return cacheService.set(key, data, {
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      tags: ['repo-data', `user:${username}`, `repo:${repoName}`],
      username,
      type: 'repo-data'
    });
  },

  async getRepoData(username: string, repoName: string): Promise<any | null> {
    const key = `repo:${username}:${repoName}:v2`;
    return cacheService.get(key);
  },

  // Bulk invalidation helpers
  async invalidateUser(username: string): Promise<number> {
    return cacheService.invalidateByTag(`user:${username}`);
  },

  async invalidateLanguageStats(): Promise<number> {
    return cacheService.invalidateByTag('language-stats');
  }
};

export default cacheService;