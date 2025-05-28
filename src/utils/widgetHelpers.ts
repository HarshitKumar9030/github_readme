
// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Deep equal comparison for dependencies
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }
  
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  
  if (a.prototype !== b.prototype) return false;
  
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  
  return keys.every(k => deepEqual(a[k], b[k]));
};

// Safe JSON stringify with circular reference handling
export const safeStringify = (obj: any): string => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, val) => {
    if (val != null && typeof val === 'object') {
      if (seen.has(val)) {
        return '[Circular]';
      }
      seen.add(val);
    }
    return val;
  });
};

// Generate cache key from config
export const generateCacheKey = (widgetId: string, config: any): string => {
  try {
    const configString = safeStringify(config);
    // Use a fallback for SSR when btoa is not available
    const hash = typeof window !== 'undefined' && typeof btoa !== 'undefined'
      ? btoa(configString).slice(0, 32)
      : configString.slice(0, 32);
    return `${widgetId}-${hash}`;
  } catch {
    return `${widgetId}-${Date.now()}`;
  }
};

// Validate URL parameters
export const buildUrl = (baseUrl: string, params: Record<string, any>): string => {
  try {
    // For external URLs, use them directly instead of relative to current origin
    const url = baseUrl.startsWith('http') 
      ? new URL(baseUrl) 
      : typeof window !== 'undefined' 
        ? new URL(baseUrl, window.location.origin)
        : new URL(baseUrl, 'https://localhost:3000'); // fallback for SSR
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
    
    return url.toString();
  } catch (error) {
    console.error('Error building URL:', error);
    return baseUrl;
  }
};

// Error message formatter
export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

// Widget config validator
export const validateConfig = (config: any, requiredFields: string[]): string[] => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!config[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  return errors;
};

// Rate limiting utility
export class RateLimiter {
  private lastCall = 0;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(private minInterval: number = 1000) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      const delay = this.minInterval - timeSinceLastCall;
      await new Promise(resolve => {
        this.timeoutId = setTimeout(resolve, delay);
      });
    }
    
    this.lastCall = Date.now();
    return fn();
  }

  cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// Memoization utility for expensive computations
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : safeStringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  }) as T;
};

// Common widget URL generators
export const createGitHubStatsUrl = (username: string, config: any): string => {
  const params: Record<string, any> = {
    username,
  };
  
  // Only add parameters if they have valid values
  if (config.theme && config.theme !== 'default') {
    params.theme = config.theme;
  }
  
  if (config.showIcons !== false) {
    params.show_icons = 'true';
  }
  
  if (config.includeAllCommits) {
    params.include_all_commits = 'true';
  }
  
  if (config.includePrivate) {
    params.count_private = 'true';
  }
  
  if (config.hideBorder) {
    params.hide_border = 'true';
  }
  
  if (config.hideTitle) {
    params.hide_title = 'true';
  }
  
  if (config.hideRank) {
    params.hide_rank = 'true';
  }
  
  return buildUrl('https://github-readme-stats.vercel.app/api', params);
};

export const createLanguagesUrl = (username: string, config: any): string => {
  const params = {
    username,
    theme: config.theme || 'default',
    layout: config.layout || 'compact',
    hide_border: config.hideBorder || false,
    hide_title: config.hideTitle || false,
    exclude_repo: config.excludeRepos || '',
    langs_count: config.languagesCount || 8
  };
  
  return buildUrl('https://github-readme-stats.vercel.app/api/top-langs', params);
};

export const createStreakUrl = (username: string, config: any): string => {
  const params: Record<string, any> = {
    user: username,
  };
  
  if (config.streakTheme && config.streakTheme !== 'default') {
    params.theme = config.streakTheme;
  } else if (config.theme && config.theme !== 'default') {
    params.theme = config.theme;
  }
  
  if (config.hideBorder) {
    params.hide_border = 'true';
  }
  
  return buildUrl('https://github-readme-streak-stats.herokuapp.com', params);
};

export const createTrophyUrl = (username: string, config: any): string => {
  const params: Record<string, any> = {
    username,
  };
  
  if (config.trophyTheme && config.trophyTheme !== 'flat') {
    params.theme = config.trophyTheme;
  } else if (config.theme && config.theme !== 'default') {
    params.theme = config.theme;
  } else {
    params.theme = 'flat';
  }
  
  if (config.trophyColumns) {
    params.column = config.trophyColumns;
  }
  
  if (config.hideBorder) {
    params.no_frame = 'true';
  }
  
  return buildUrl('https://github-profile-trophy.vercel.app', params);
};
