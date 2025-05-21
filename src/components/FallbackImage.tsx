'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false
}) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div 
        className={`rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`} 
        style={{ 
          width: width,
          height: height,
          maxWidth: '100%',
        }}
      >
        <div className="text-center p-4">
          <div className="text-red-500 text-sm mb-1">Failed to load image</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">{alt || src.split('/').pop() || 'Image'}</div>
        </div>
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
      style={{ 
        maxWidth: '100%',
        height: 'auto'
      }}
      onError={() => {
        console.warn(`Failed to load image: ${src}`);
        setHasError(true);
      }}
    />
  );
};

export default FallbackImage;
