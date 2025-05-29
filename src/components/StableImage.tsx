'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const imageCache = new Map<string, string>();
const imageCacheTimestamps = new Map<string, number>();
const CACHE_DURATION = 10 * 60 * 1000; 

function useStableImageUrl(url: string, cacheKey: string) {
  const [cachedUrl, setCachedUrl] = useState<string>(() => {
    const cached = imageCache.get(cacheKey);
    const timestamp = imageCacheTimestamps.get(cacheKey);
    
    if (cached && timestamp && Date.now() - timestamp < CACHE_DURATION) {
      return cached;
    }
    
    return url;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!url) return;

    const cached = imageCache.get(cacheKey);
    const timestamp = imageCacheTimestamps.get(cacheKey);
    
    if (cached && timestamp && Date.now() - timestamp < CACHE_DURATION) {
      setCachedUrl(cached);
      return;
    }

    setIsLoading(true);
    setError('');

    const img = new globalThis.Image();
    
    img.onload = () => {
      imageCache.set(cacheKey, url);
      imageCacheTimestamps.set(cacheKey, Date.now());
      setCachedUrl(url);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };
    
    img.src = url;
  }, [url, cacheKey]);

  return { cachedUrl, isLoading, error };
}

export interface StableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  cacheKey?: string;
  fallbackText?: string;
  loadingText?: string;
  priority?: boolean;
  unoptimized?: boolean;
}

/**
 * StableImage - Prevents image flickering with caching
 */



const StableImage: React.FC<StableImageProps> = React.memo(({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  cacheKey,
  fallbackText = 'Failed to load image',
  loadingText = 'Loading...',
  priority = false,
  unoptimized = true
}) => {
  // Generate cache key if not provided
  const effectiveCacheKey = cacheKey || `${src}-${width}x${height}`;
  
  const { cachedUrl, isLoading, error } = useStableImageUrl(src, effectiveCacheKey);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-red-500 text-sm font-medium px-2 text-center">
          {fallbackText}
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse border border-gray-200 dark:border-gray-700 ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {loadingText}
        </span>
      </div>
    );
  }

  return (
    <Image 
      src={cachedUrl} 
      alt={alt} 
      width={width} 
      height={height} 
      unoptimized={unoptimized}
      priority={priority}
      className={className}
      style={style}
      key={effectiveCacheKey}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
});

StableImage.displayName = 'StableImage';

export default StableImage;

export const clearImageCache = () => {
  imageCache.clear();
  imageCacheTimestamps.clear();
};

export const getImageCacheStats = () => {
  return {
    cacheSize: imageCache.size,
    totalCached: imageCacheTimestamps.size,
    cacheKeys: Array.from(imageCache.keys())
  };
};
