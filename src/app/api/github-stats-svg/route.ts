import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface GitHubStatsParams {
  username: string;
  followers: number;
  following: number;
  repos: number;
  theme: string;
}

// Helper to get theme colors and styles
function getThemeColors(theme: string) {
  switch(theme) {
    case 'dark':
      return {
        bg: '#1e293b',
        text: '#f8fafc',
        title: '#f1f5f9',
        border: '#334155',
        accent: '#3b82f6',
        statBg: '#334155'
      };
    case 'radical':
      return {
        bg: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
        text: '#f8fafc',
        title: '#ffffff',
        border: '#c026d3',
        accent: '#f472b6',
        statBg: 'rgba(255,255,255,0.2)'
      };
    case 'tokyonight':
      return {
        bg: 'linear-gradient(90deg, #1a365d 0%, #2d3748 100%)',
        text: '#e2e8f0',
        title: '#ffffff',
        border: '#2c5282',
        accent: '#63b3ed',
        statBg: 'rgba(56, 74, 110, 0.6)'
      };
    case 'merko':
      return {
        bg: 'linear-gradient(90deg, #1b4332 0%, #2d6a4f 100%)',
        text: '#d1fae5',
        title: '#ecfdf5',
        border: '#065f46',
        accent: '#10b981',
        statBg: 'rgba(20, 83, 45, 0.6)'
      };
    case 'gruvbox':
      return {
        bg: '#b45309',
        text: '#fef3c7',
        title: '#fef9c3',
        border: '#92400e',
        accent: '#f59e0b',
        statBg: 'rgba(146, 64, 14, 0.6)'
      };
    default: // light
      return {
        bg: '#ffffff',
        text: '#334155',
        title: '#0f172a',
        border: '#e2e8f0',
        accent: '#3b82f6',
        statBg: '#f1f5f9'
      };
  }
}

// Generate SVG for GitHub stats
function generateStatsSvg({ username, followers, following, repos, theme }: GitHubStatsParams) {
  const colors = getThemeColors(theme);
  
  // SVG dimensions
  const width = 400;
  const height = 200;
  
  // Determine background style
  const bgStyle = colors.bg.startsWith('linear') 
    ? `<defs><linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${colors.bg.split(', ')[1].split(' ')[0]}"/><stop offset="100%" stop-color="${colors.bg.split(', ')[2].split(' ')[0]}"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#bg-grad)" rx="10" />`
    : `<rect width="${width}" height="${height}" fill="${colors.bg}" rx="10" />`;

  // Generate SVG
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${bgStyle}
    <rect stroke="${colors.border}" stroke-width="2" width="${width-2}" height="${height-2}" fill="none" rx="10" x="1" y="1" />
    
    <!-- Header -->
    <g transform="translate(20, 30)">
      <!-- GitHub Icon -->
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="${colors.accent}" transform="scale(0.9)" />
      
      <!-- Title -->
      <text x="30" y="16" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${colors.title}">GitHub Stats</text>
      <text x="135" y="16" font-family="'Segoe UI', Arial, sans-serif" font-size="14" fill="${colors.text}">@${username}</text>
    </g>
    
    <!-- Stats Boxes -->
    <g transform="translate(20, 70)">
      <!-- Repositories -->
      <rect x="0" y="0" width="110" height="70" rx="6" fill="${colors.statBg}" />
      <text x="55" y="30" font-family="'Segoe UI', Arial, sans-serif" font-size="24" font-weight="600" fill="${colors.title}" text-anchor="middle">${repos}</text>
      <text x="55" y="55" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="${colors.text}" text-anchor="middle">Repositories</text>
      
      <!-- Followers -->
      <rect x="125" y="0" width="110" height="70" rx="6" fill="${colors.statBg}" />
      <text x="180" y="30" font-family="'Segoe UI', Arial, sans-serif" font-size="24" font-weight="600" fill="${colors.title}" text-anchor="middle">${followers}</text>
      <text x="180" y="55" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="${colors.text}" text-anchor="middle">Followers</text>
      
      <!-- Following -->
      <rect x="250" y="0" width="110" height="70" rx="6" fill="${colors.statBg}" />
      <text x="305" y="30" font-family="'Segoe UI', Arial, sans-serif" font-size="24" font-weight="600" fill="${colors.title}" text-anchor="middle">${following}</text>
      <text x="305" y="55" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="${colors.text}" text-anchor="middle">Following</text>
    </g>
    
    <!-- Footer -->
    <text x="${width-20}" y="${height-15}" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="${colors.text}" text-anchor="end">Generated with GitHub README Generator</text>
  </svg>`;
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || '';
    const followers = Number(searchParams.get('followers')) || 0;
    const following = Number(searchParams.get('following')) || 0;
    const repos = Number(searchParams.get('repos')) || 0;
    const theme = searchParams.get('theme') || 'light';
    
    // Generate SVG
    const svg = generateStatsSvg({
      username,
      followers,
      following,
      repos,
      theme: theme as string
    });
    
    // Return SVG with correct headers
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=3600',
      }
    });
  } catch (error) {
    console.error('Error generating GitHub stats SVG:', error);
    return new NextResponse('Error generating SVG', { status: 500 });
  }
}
