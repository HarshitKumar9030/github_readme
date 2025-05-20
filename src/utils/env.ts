/**
 * Get the base URL for the application
 * Process environment variables are injected at build time
 * Window location is used at runtime in the browser
 */


export function getBaseUrl(): string {
  // Use process.env.NEXT_PUBLIC_APP_URL if available (set in deployment)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // In browser, use window.location
  if (typeof window !== 'undefined') {
    const location = window.location;
    return `${location.protocol}//${location.host}`;
  }

  // Fallback for SSR
  return process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}` : 
    'http://localhost:3000';
}
