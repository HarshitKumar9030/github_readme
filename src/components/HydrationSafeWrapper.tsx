'use client';

import React, { useState, useEffect } from 'react';

interface HydrationSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A wrapper component that prevents hydration mismatches by delaying
 * rendering of children until after client-side hydration is complete.
 * 
 * This is particularly useful for widgets that may have different
 * server and client rendering behavior.
 */

const HydrationSafeWrapper: React.FC<HydrationSafeWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!isHydrated) {
    return (
      <div className="hydration-safe-loading">
        {fallback || (
          <div className="p-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-md animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default HydrationSafeWrapper;
