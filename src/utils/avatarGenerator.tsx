'use client';

/**
 * SVG Avatar Generator Utility
 * Creates colorful SVG avatars as fallbacks when user avatars fail to load
 */

export interface AvatarConfig {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: 'circle' | 'square' | 'rounded';
}

const DEFAULT_COLORS = [
  { bg: '#FF6B6B', text: '#FFFFFF' }, // Red
  { bg: '#4ECDC4', text: '#FFFFFF' }, // Teal
  { bg: '#45B7D1', text: '#FFFFFF' }, // Blue
  { bg: '#96CEB4', text: '#FFFFFF' }, // Green
  { bg: '#FFEAA7', text: '#2D3436' }, // Yellow
  { bg: '#DDA0DD', text: '#FFFFFF' }, // Plum
  { bg: '#FFB74D', text: '#FFFFFF' }, // Orange
  { bg: '#81C784', text: '#FFFFFF' }, // Light Green
  { bg: '#64B5F6', text: '#FFFFFF' }, // Light Blue
  { bg: '#F06292', text: '#FFFFFF' }, // Pink
];

/**
 * Get initials from a name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get a consistent color for a name (deterministic based on name hash)
 */

function getColorForName(name: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DEFAULT_COLORS.length;
  return DEFAULT_COLORS[index];
}

/**
 * Generate SVG avatar as a data URL
 */

export function generateSVGAvatar(config: AvatarConfig): string {
  const {
    name,
    size = 100,
    style = 'circle'
  } = config;

  const colors = config.backgroundColor && config.textColor
    ? { bg: config.backgroundColor, text: config.textColor }
    : getColorForName(name);

  const initials = getInitials(name);
  const fontSize = Math.max(12, size * 0.4);
  
  let shapeElement: string;
  
  switch (style) {
    case 'circle':
      shapeElement = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${colors.bg}" />`;
      break;
    case 'square':
      shapeElement = `<rect width="${size}" height="${size}" fill="${colors.bg}" />`;
      break;
    case 'rounded':
      shapeElement = `<rect width="${size}" height="${size}" rx="${size * 0.12}" ry="${size * 0.12}" fill="${colors.bg}" />`;
      break;
    default:
      shapeElement = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${colors.bg}" />`;
  }

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${shapeElement}
      <text 
        x="${size / 2}" 
        y="${size / 2}" 
        font-family="'Segoe UI', Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="600" 
        fill="${colors.text}" 
        text-anchor="middle" 
        dominant-baseline="central"
      >
        ${initials}
      </text>
    </svg>
  `;

  // Convert SVG to data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  return dataUrl;
}

/**
 * Generate multiple diverse avatars for testimonials
 */
export function generateTestimonialAvatars(): string[] {
  const testimonialNames = [
    'Sarah Chen',
    'James Wilson', 
    'Priya Sharma'
  ];

  return testimonialNames.map(name => generateSVGAvatar({
    name,
    size: 100,
    style: 'circle'
  }));
}

/**
 * React component for avatar with fallback
 */
interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  name: string;
  width: number;
  height: number;
  className?: string;
  style?: 'circle' | 'square' | 'rounded';
}

export function AvatarWithFallback({
  src,
  alt,
  name,
  width,
  height,
  className = '',
  style = 'circle'
}: AvatarWithFallbackProps) {
  const [hasError, setHasError] = React.useState(false);

  const fallbackSrc = generateSVGAvatar({
    name,
    size: Math.max(width, height),
    style
  });
  if (hasError) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={() => setHasError(true)}
    />
  );
}

import React from 'react';
import Image from 'next/image';
