'use client';

/**
 * Get the absolute base URL for the application.
 * Uses NEXT_PUBLIC_APP_URL environment variable if available,
 * otherwise falls back to window.location.origin
 * 
 * @returns The base URL for the application
 */


export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Fall back to window.location.origin if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // fallback for rendering without APP_URL
  return 'http://localhost:3000';
}

/**
 * Create an absolute URL by combining the app base URL with a relative path
 * 
 * @param relativePath The relative path to append to the base URL
 * @returns A complete absolute URL
 */


import { getBaseUrl } from "@/utils/env";

export function createAbsoluteUrl(relativePath: string): string {
  const baseUrl = getBaseUrl();
  
  const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Combine them ensuring no double slashes
  const absoluteUrl = `${normalizedBaseUrl}${normalizedPath}`;
  
  try {
    // Validate URL construction
    const url = new URL(absoluteUrl);
    return url.toString();
  } catch (error) {
    console.error(`Failed to create absolute URL from ${baseUrl} and ${relativePath}:`, error);
    // Return a fallback URL that's still usable
    return `${normalizedBaseUrl}${normalizedPath}`;
  }
}
