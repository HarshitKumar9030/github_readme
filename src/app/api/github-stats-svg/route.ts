import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface GitHubStatsParams {
  username: string;
  followers: number;
  following: number;
  repos: number;
  theme: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
}

// Helper to get theme colors and styles
function getThemeColors(theme: string) {
  switch(theme) {
    case 'dark':
      return {
        bg: '#0f172a',
        text: '#cbd5e1',
        title: '#f8fafc',
        border: '#1e293b',
        accent: '#38bdf8',
        statBg: '#1e293b'
      };
    case 'radical':
      return {
        bg: 'linear-gradient(135deg, #e879f9 0%, #8b5cf6 100%)',
        text: '#f5f3ff',
        title: '#ffffff',
        border: '#d946ef',
        accent: '#f0abfc',
        statBg: 'rgba(255,255,255,0.25)'
      };
    case 'tokyonight':
      return {
        bg: 'linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%)',
        text: '#e0f2fe',
        title: '#ffffff',
        border: '#1d4ed8',
        accent: '#60a5fa',
        statBg: 'rgba(30, 64, 175, 0.65)'
      };
    case 'merko':
      return {
        bg: 'linear-gradient(90deg, #064e3b 0%, #047857 100%)',
        text: '#d1fae5',
        title: '#ecfdf5',
        border: '#065f46',
        accent: '#34d399',
        statBg: 'rgba(6, 95, 70, 0.65)'
      };
    case 'gruvbox':
      return {
        bg: 'linear-gradient(90deg, #92400e 0%, #b45309 100%)',
        text: '#fef3c7',
        title: '#fef9c3',
        border: '#a16207',
        accent: '#fbbf24',
        statBg: 'rgba(146, 64, 14, 0.6)'
      };
    default: // light
      return {
        bg: '#ffffff',
        text: '#475569',
        title: '#0f172a',
        border: '#e2e8f0',
        accent: '#3b82f6',
        statBg: '#f8fafc'
      };
  }
}

function generateStatsSvg({ username, followers, following, repos, theme, avatarUrl, name, bio }: GitHubStatsParams) {
  const colors = getThemeColors(theme);
  const width = 500;
  const height = 200; 
  
  // Handle gradient backgrounds
  const bgStyle = colors.bg.startsWith('linear') 
    ? `<defs><linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${colors.bg.split(', ')[1].split(' ')[0]}"/><stop offset="100%" stop-color="${colors.bg.split(', ')[2].split(' ')[0]}"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#bg-grad)" rx="12" />`
    : `<rect width="${width}" height="${height}" fill="${colors.bg}" rx="12" />`;
  
  // Create container for drop shadow if not using a dark theme
  const shadowFilter = theme !== 'dark' ? `
    <defs>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
      </filter>
    </defs>` : '';
  
  // Format avatar with modern clip path
  const avatarSection = avatarUrl ? `
    <defs>
      <clipPath id="avatar-clip">
        <circle cx="50" cy="50" r="35" />
      </clipPath>
    </defs>
    <image x="15" y="15" width="70" height="70" href="${avatarUrl}" clip-path="url(#avatar-clip)" />
    ` : '';
  
  const displayName = name || username;
  
  // Format bio with better text handling
  const bioSection = bio ? `
    <foreignObject x="${avatarUrl ? '100' : '25'}" y="60" width="${width - 160}" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: ${colors.text}; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
        ${bio}
      </div>
    </foreignObject>` : '';

  // Prepare stat circles with consistent design
  const statRadius = 30;
  const statSpacing = 120;
  const statCenterY = 150;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${shadowFilter}
    ${bgStyle}
    <rect stroke="${colors.border}" stroke-width="1" width="${width-2}" height="${height-2}" fill="none" rx="12" x="1" y="1" filter="${theme !== 'dark' ? 'url(#shadow)' : 'none'}" />
    
    <g>
      ${avatarSection}
      <text x="${avatarUrl ? '100' : '25'}" y="40" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="600" fill="${colors.title}">${displayName}</text>
      <text x="${avatarUrl ? '100' : '25'}" y="60" font-family="'Segoe UI', Arial, sans-serif" font-size="15" fill="${colors.accent}">@${username}</text>
      ${bioSection}
    </g>
    
    <g transform="translate(${width - 75}, 30)">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="${colors.accent}" transform="scale(0.8)" />
    </g>
    
    <g>
      <circle cx="${statSpacing}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${repos}</text>
      <text x="${statSpacing}" y="${statCenterY + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="${colors.text}" text-anchor="middle">Repositories</text>
      
      <circle cx="${statSpacing*2}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*2}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${followers}</text>
      <text x="${statSpacing*2}" y="${statCenterY + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="${colors.text}" text-anchor="middle">Followers</text>
      
      <circle cx="${statSpacing*3}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*3}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${following}</text>
      <text x="${statSpacing*3}" y="${statCenterY + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="${colors.text}" text-anchor="middle">Following</text>
    </g>
    
]  </svg>`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username') || '';
    const followers = parseInt(searchParams.get('followers') || '0', 10);
    const following = parseInt(searchParams.get('following') || '0', 10);
    const repos = parseInt(searchParams.get('repos') || '0', 10);
    const theme = searchParams.get('theme') || 'light';

    // Validate required parameters
    if (!username) {
      return new NextResponse('Username is required', { status: 400 });
    }

    // Validate numeric parameters
    if (isNaN(followers) || isNaN(following) || isNaN(repos)) {
      return new NextResponse('Invalid numeric parameters', { status: 400 });
    }

    // Validate theme
    const validThemes = ['light', 'dark', 'radical', 'tokyonight', 'merko', 'gruvbox'];
    if (!validThemes.includes(theme)) {
      return new NextResponse(`Invalid theme. Valid themes are: ${validThemes.join(', ')}`, { status: 400 });
    }

    // Fetch user profile data from GitHub API
    let avatarUrl, name, bio;
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        avatarUrl = data.avatar_url;
        name = data.name;
        bio = data.bio;
      }
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
      // Continue without profile data if the fetch fails
    }

    // Generate SVG
    const svg = generateStatsSvg({
      username,
      followers,
      following,
      repos,
      theme,
      avatarUrl,
      name,
      bio
    });
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    });
  } catch (error) {
    console.error('Error generating GitHub stats SVG:', error);
    return new NextResponse('Error generating SVG', { status: 500 });
  }
}
