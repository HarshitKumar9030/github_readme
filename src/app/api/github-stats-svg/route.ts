import { NextRequest, NextResponse } from 'next/server';
import { getGithubStats } from '@/services/socialStats';

export const runtime = 'edge';

interface GitHubStatsParams {
  username: string;
  followers: number;
  following: number;
  repos: number;
  totalStars: number;
  commits: number;
  issues: number;
  prs: number;
  theme: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
  hideBorder?: boolean;
  hideTitle?: boolean;
  layout?: 'default' | 'compact' | 'minimal' | 'detailed';
  showAvatar?: boolean;
  customTitle?: string;
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
    case 'github':
      return {
        bg: 'linear-gradient(135deg, #161b22 0%, #21262d 100%)',
        text: '#7d8590',
        title: '#f0f6fc',
        border: '#30363d',
        accent: '#58a6ff',
        statBg: 'rgba(48, 54, 61, 0.8)'
      };
    case 'discord':
      return {
        bg: 'linear-gradient(135deg, #5865f2 0%, #404eed 100%)',
        text: '#b9bbbe',
        title: '#ffffff',
        border: '#4752c4',
        accent: '#ffffff',
        statBg: 'rgba(71, 82, 196, 0.6)'
      };
    case 'ocean':
      return {
        bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        text: '#e0f7fa',
        title: '#ffffff',
        border: '#0369a1',
        accent: '#7dd3fc',
        statBg: 'rgba(3, 105, 161, 0.6)'
      };
    case 'sunset':
      return {
        bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        text: '#fed7aa',
        title: '#ffffff',
        border: '#c2410c',
        accent: '#fdba74',
        statBg: 'rgba(194, 65, 12, 0.6)'
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

/**
 * Enhanced GitHub stats fetcher with additional metrics
 */
async function fetchEnhancedGitHubStats(username: string) {
  const baseData = await getGithubStats(username);
  
  // Fetch additional metrics (stars, commits, issues, PRs)
  let totalStars = 0;
  let commits = 0;
  let issues = 0;
  let prs = 0;
  
  try {
    // Get repositories to calculate total stars
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
    }
    
    // Get search results for user activity (approximate values)
    const [commitsRes, issuesRes, prsRes] = await Promise.allSettled([
      fetch(`https://api.github.com/search/commits?q=author:${username}&per_page=1`),
      fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue&per_page=1`),
      fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr&per_page=1`)
    ]);
    
    if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
      const data = await commitsRes.value.json();
      commits = Math.min(data.total_count || 0, 9999); // Cap at reasonable number
    }
    
    if (issuesRes.status === 'fulfilled' && issuesRes.value.ok) {
      const data = await issuesRes.value.json();
      issues = Math.min(data.total_count || 0, 9999);
    }
    
    if (prsRes.status === 'fulfilled' && prsRes.value.ok) {
      const data = await prsRes.value.json();
      prs = Math.min(data.total_count || 0, 9999);
    }
  } catch (error) {
    // Fallback to basic stats if enhanced fetching fails
    console.warn('Enhanced stats fetch failed:', error);
  }
  
  return {
    ...baseData,
    totalStars,
    commits,
    issues,
    prs
  };
}

/**
 * Generates SVG for GitHub stats
 * Returns clean, modern design with configurable options
 */
function generateStatsSvg({ 
  username, 
  followers, 
  following, 
  repos, 
  totalStars,
  commits,
  issues,
  prs,
  theme, 
  avatarUrl, 
  name, 
  bio, 
  hideBorder = false, 
  hideTitle = false,
  layout = 'default',
  showAvatar = true,
  customTitle 
}: GitHubStatsParams) {
  const colors = getThemeColors(theme);
  
  // Configure dimensions based on layout
  const isCompact = layout === 'compact';
  const isMinimal = layout === 'minimal';
  const isDetailed = layout === 'detailed';
  
  let cardWidth: number, cardHeight: number;
  
  if (isMinimal) {
    cardWidth = 350;
    cardHeight = 120;
  } else if (isCompact) {
    cardWidth = 400;
    cardHeight = 160;
  } else if (isDetailed) {
    cardWidth = 600;
    cardHeight = 280;
  } else {
    cardWidth = 500;
    cardHeight = 200;
  }
  
  // Create components for SVG
  const components = {
    // Handle gradient backgrounds properly
    background: () => {
      if (colors.bg.startsWith('linear')) {
        const colorStops = colors.bg.match(/rgba?\(.*?\)|#[0-9a-f]{3,8}/gi) || [];
        return `<defs>
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colorStops[0]}"/>
            <stop offset="100%" stop-color="${colorStops[1] || colorStops[0]}"/>
          </linearGradient>
        </defs>
        <rect width="${cardWidth}" height="${cardHeight}" fill="url(#bg-grad)" rx="12" />`;
      }
      return `<rect width="${cardWidth}" height="${cardHeight}" fill="${colors.bg}" rx="12" />`;
    },
    
    // Shadow effect for cards
    shadowFilter: () => theme !== 'dark' ? `
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
        </filter>
      </defs>` : '',
    
    // Border for cards
    border: () => !hideBorder ? `
      <rect stroke="${colors.border}" stroke-width="1" width="${cardWidth-2}" height="${cardHeight-2}" 
        fill="none" rx="12" x="1" y="1" filter="${theme !== 'dark' ? 'url(#shadow)' : 'none'}" />` : '',
    
    // Avatar with clip path
    avatar: () => (avatarUrl && showAvatar) ? `
      <defs>
        <clipPath id="avatar-clip">
          <circle cx="${isCompact ? '40' : '50'}" cy="${isCompact ? '40' : '50'}" r="${isCompact ? '30' : '35'}" />
        </clipPath>
      </defs>
      <image x="${isCompact ? '10' : '15'}" y="${isCompact ? '10' : '15'}" 
        width="${isCompact ? '60' : '70'}" height="${isCompact ? '60' : '70'}" 
        href="${avatarUrl}" clip-path="url(#avatar-clip)" />` : '',
    
    // User info section
    userInfo: () => {
      if (hideTitle) return '';
      const displayName = customTitle || name || username;
      const avatarOffset = (avatarUrl && showAvatar) ? (isCompact ? '80' : '100') : (isCompact ? '15' : '25');
      return `
        <text x="${avatarOffset}" y="${isCompact ? '30' : '40'}" 
          font-family="'Segoe UI', Arial, sans-serif" font-size="${isCompact ? '18' : '20'}" 
          font-weight="600" fill="${colors.title}">${displayName}</text>
        <text x="${avatarOffset}" y="${isCompact ? '48' : '60'}" 
          font-family="'Segoe UI', Arial, sans-serif" font-size="${isCompact ? '13' : '15'}" 
          fill="${colors.accent}">@${username}</text>`;
    },
    
    // Bio section with text handling
    bioSection: () => {
      if (!bio || isMinimal) return '';
      const avatarOffset = (avatarUrl && showAvatar) ? (isCompact ? '80' : '100') : (isCompact ? '15' : '25');
      return `<foreignObject x="${avatarOffset}" y="${isCompact ? '55' : '70'}" 
        width="${cardWidth - (isCompact ? 100 : 160)}" height="${isCompact ? '30' : '40'}">
        <div xmlns="http://www.w3.org/1999/xhtml" 
          style="font-family: 'Segoe UI', Arial, sans-serif; font-size: ${isCompact ? '12' : '13'}px; 
          color: ${colors.text}; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; 
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
          ${bio}
        </div>
      </foreignObject>`;
    },
    
    // GitHub logo in corner
    githubLogo: () => `
      <g transform="translate(${cardWidth - 75}, 30)">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" 
          fill="${colors.accent}" transform="scale(0.8)" />
      </g>`
  };

  // Configure statistics display based on layout
  let statsContent = '';
  
  if (isMinimal) {
    // Minimal layout - only show 2 stats
    const statSpacing = 90;
    const statCenterY = 80;
    const statRadius = 20;
    
    statsContent = `
      <circle cx="${statSpacing}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${repos}</text>
      <text x="${statSpacing}" y="${statCenterY + statRadius + 12}" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="${colors.text}" text-anchor="middle">Repos</text>
      
      <circle cx="${statSpacing*2.5}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*2.5}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${followers}</text>
      <text x="${statSpacing*2.5}" y="${statCenterY + statRadius + 12}" font-family="'Segoe UI', Arial, sans-serif" font-size="10" fill="${colors.text}" text-anchor="middle">Followers</text>
    `;
  } else if (isDetailed) {
    // Detailed layout - show all 7 stats in 2 rows
    const statSpacing = 85;
    const statRadius = 25;
    const row1Y = 150;
    const row2Y = 220;
    
    statsContent = `
      <!-- Row 1 -->
      <circle cx="${statSpacing}" cy="${row1Y}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing}" y="${row1Y}" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${repos}</text>
      <text x="${statSpacing}" y="${row1Y + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="${colors.text}" text-anchor="middle">Repos</text>
      
      <circle cx="${statSpacing*2.2}" cy="${row1Y}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*2.2}" y="${row1Y}" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${followers}</text>
      <text x="${statSpacing*2.2}" y="${row1Y + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="${colors.text}" text-anchor="middle">Followers</text>
      
      <circle cx="${statSpacing*3.4}" cy="${row1Y}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*3.4}" y="${row1Y}" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${following}</text>
      <text x="${statSpacing*3.4}" y="${row1Y + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="${colors.text}" text-anchor="middle">Following</text>
      
      <circle cx="${statSpacing*4.6}" cy="${row1Y}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*4.6}" y="${row1Y}" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${totalStars}</text>
      <text x="${statSpacing*4.6}" y="${row1Y + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="${colors.text}" text-anchor="middle">Stars</text>
      
      <!-- Row 2 -->
      <circle cx="${statSpacing*1.6}" cy="${row2Y}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*1.6}" y="${row2Y}" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${commits}</text>
      <text x="${statSpacing*1.6}" y="${row2Y + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="${colors.text}" text-anchor="middle">Commits</text>
      
      <circle cx="${statSpacing*2.8}" cy="${row2Y}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*2.8}" y="${row2Y}" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${issues}</text>
      <text x="${statSpacing*2.8}" y="${row2Y + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="${colors.text}" text-anchor="middle">Issues</text>
      
      <circle cx="${statSpacing*4}" cy="${row2Y}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*4}" y="${row2Y}" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${prs}</text>
      <text x="${statSpacing*4}" y="${row2Y + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="${colors.text}" text-anchor="middle">PRs</text>
    `;
  } else {
    // Default and compact layouts - show 4 main stats
    const statRadius = isCompact ? 24 : 30;
    const statSpacing = isCompact ? 80 : 100;
    const statCenterY = isCompact ? 125 : 150;
    
    statsContent = `
      <circle cx="${statSpacing}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${repos}</text>
      <text x="${statSpacing}" y="${statCenterY + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="${colors.text}" text-anchor="middle">Repos</text>
      
      <circle cx="${statSpacing*2.2}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*2.2}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${followers}</text>
      <text x="${statSpacing*2.2}" y="${statCenterY + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="${colors.text}" text-anchor="middle">Followers</text>
      
      <circle cx="${statSpacing*3.4}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*3.4}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${following}</text>
      <text x="${statSpacing*3.4}" y="${statCenterY + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="${colors.text}" text-anchor="middle">Following</text>
      
      <circle cx="${statSpacing*4.6}" cy="${statCenterY}" r="${statRadius}" fill="${colors.statBg}" />
      <text x="${statSpacing*4.6}" y="${statCenterY}" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="700" fill="${colors.title}" text-anchor="middle" dominant-baseline="central">${totalStars}</text>
      <text x="${statSpacing*4.6}" y="${statCenterY + statRadius + 15}" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="${colors.text}" text-anchor="middle">Stars</text>
    `;
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
    ${components.shadowFilter()}
    ${components.background()}
    ${components.border()}
    
    <g>
      ${components.avatar()}
      ${components.userInfo()}
      ${components.bioSection()}
    </g>
    
    ${components.githubLogo()}
    
    <g>
      ${statsContent}
    </g>
  </svg>`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username') || '';
    const theme = searchParams.get('theme') || 'light';
    const hideBorder = searchParams.get('hideBorder') === 'true';
    const hideTitle = searchParams.get('hideTitle') === 'true';
    const showAvatar = searchParams.get('showAvatar') !== 'false';
    const customTitle = searchParams.get('customTitle') || '';
    const layout = (searchParams.get('layout') as 'default' | 'compact' | 'minimal' | 'detailed') || 'default';

    if (!username) {
      return new NextResponse('Username is required', { status: 400 });
    }

    const validThemes = ['light', 'dark', 'radical', 'tokyonight', 'merko', 'gruvbox', 'github', 'discord', 'ocean', 'sunset'];
    if (!validThemes.includes(theme)) {
      return new NextResponse(`Invalid theme. Valid themes are: ${validThemes.join(', ')}`, { status: 400 });
    }

    let avatarUrl = '', name = '', bio = '', followers = 0, following = 0, repos = 0;
    let totalStars = 0, commits = 0, issues = 0, prs = 0;

    try {
      const data = await fetchEnhancedGitHubStats(username);
      name = data.name || '';
      bio = data.bio || '';
      followers = data.followers || 0;
      following = data.following || 0;
      repos = data.public_repos || 0;
      totalStars = data.totalStars || 0;
      commits = data.commits || 0;
      issues = data.issues || 0;
      prs = data.prs || 0;

      if (data.avatar_url) {
        try {
          const avatarRes = await fetch(data.avatar_url);
          const avatarBuffer = await avatarRes.arrayBuffer();
          const base64 = Buffer.from(avatarBuffer).toString('base64');
          avatarUrl = `data:image/png;base64,${base64}`;
        } catch {
          avatarUrl = data.avatar_url;
        }
      }
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      return new NextResponse('Failed to fetch GitHub user data', { status: 500 });
    }

    const svg = generateStatsSvg({
      username,
      followers,
      following,
      repos,
      totalStars,
      commits,
      issues,
      prs,
      theme,
      avatarUrl,
      name,
      bio,
      hideBorder,
      hideTitle,
      layout,
      showAvatar,
      customTitle
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
    console.error('Error generating SVG:', error);
    return new NextResponse('Error generating SVG', { status: 500 });
  }
}
