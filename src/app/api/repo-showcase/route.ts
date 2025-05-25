import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract parameters
  const username = searchParams.get('username');
  const repo = searchParams.get('repo');
  const width = parseInt(searchParams.get('width') || '400');
  const height = parseInt(searchParams.get('height') || '200');
  const theme = searchParams.get('theme') || 'default';
  const showStats = searchParams.get('showStats') !== 'false';
  const showLanguage = searchParams.get('showLanguage') !== 'false';
  const showDescription = searchParams.get('showDescription') !== 'false';
  
  if (!username || !repo) {
    return new NextResponse('Username and repo are required', { status: 400 });
  }
  
  try {
    // Fetch repository data
    const repoResponse = await fetch(`https://api.github.com/repos/${username}/${repo}`);
    if (!repoResponse.ok) {
      throw new Error('Repository not found');
    }
    
    const repoData = await repoResponse.json();
    
    // Fetch repository languages
    let primaryLanguage = repoData.language || 'Unknown';
    if (showLanguage) {
      try {
        const langResponse = await fetch(repoData.languages_url);
        if (langResponse.ok) {
          const languages = await langResponse.json();
          const sortedLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => (b as number) - (a as number));
          if (sortedLanguages.length > 0) {
            primaryLanguage = sortedLanguages[0][0];
          }
        }
      } catch (error) {
        // Use default language from repo data
      }
    }
    
    // Theme configurations
    const themes = {
      default: {
        background: '#ffffff',
        border: '#e1e4e8',
        titleColor: '#0366d6',
        textColor: '#586069',
        descriptionColor: '#24292e',
        statColor: '#586069',
        iconColor: '#959da5'
      },
      dark: {
        background: '#0d1117',
        border: '#30363d',
        titleColor: '#58a6ff',
        textColor: '#8b949e',
        descriptionColor: '#f0f6fc',
        statColor: '#8b949e',
        iconColor: '#6e7681'
      },
      github: {
        background: '#f6f8fa',
        border: '#d0d7de',
        titleColor: '#0969da',
        textColor: '#656d76',
        descriptionColor: '#1f2328',
        statColor: '#656d76',
        iconColor: '#656d76'
      },
      minimal: {
        background: '#fafbfc',
        border: '#e1e4e8',
        titleColor: '#24292e',
        textColor: '#586069',
        descriptionColor: '#24292e',
        statColor: '#586069',
        iconColor: '#959da5'
      }
    };
    
    const selectedTheme = themes[theme as keyof typeof themes] || themes.default;
    
    // Language color mapping (subset of GitHub's language colors)
    const languageColors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#fa7343',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#1572B6',
      Vue: '#41b883',
      React: '#61dafb',
      Angular: '#dd0031',
      Shell: '#89e051'
    };
    
    const languageColor = languageColors[primaryLanguage] || '#586069';
    
    // Format numbers
    const formatNumber = (num: number): string => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num.toString();
    };
    
    // Truncate description
    const maxDescLength = Math.floor(width / 8);
    const description = repoData.description || 'No description available';
    const truncatedDesc = description.length > maxDescLength 
      ? description.substring(0, maxDescLength - 3) + '...' 
      : description;
    
    // Calculate layout
    const padding = 16;
    const titleY = padding + 20;
    const descY = showDescription ? titleY + 25 : titleY + 10;
    const statsY = height - padding - 5;
    const langY = showLanguage ? statsY - 20 : statsY;
    
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fadeIn" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0)" stop-opacity="0">
              <animate attributeName="stop-opacity" values="0;1" dur="1s" fill="freeze"/>
            </stop>
            <stop offset="100%" stop-color="rgba(255,255,255,0)" stop-opacity="1">
              <animate attributeName="stop-opacity" values="0;1" dur="1s" fill="freeze"/>
            </stop>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="${selectedTheme.background}" 
              stroke="${selectedTheme.border}" stroke-width="1" rx="6"/>
        
        <!-- Repository Icon -->
        <g transform="translate(${padding}, ${padding + 2})">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="${selectedTheme.iconColor}">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
          </svg>
        </g>
        
        <!-- Repository Name -->
        <text x="${padding + 24}" y="${titleY}" fill="${selectedTheme.titleColor}" 
              font-size="16" font-weight="600" font-family="system-ui, -apple-system, sans-serif">
          ${repoData.name}
        </text>
        
        <!-- Fork indicator -->
        ${repoData.fork ? `
          <g transform="translate(${width - padding - 60}, ${padding + 2})">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="${selectedTheme.iconColor}">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
            </svg>
            <text x="20" y="12" fill="${selectedTheme.textColor}" font-size="10" font-family="system-ui">
              Forked
            </text>
          </g>
        ` : ''}
        
        <!-- Description -->
        ${showDescription ? `
          <text x="${padding}" y="${descY}" fill="${selectedTheme.descriptionColor}" 
                font-size="12" font-family="system-ui, -apple-system, sans-serif">
            ${truncatedDesc}
          </text>
        ` : ''}
        
        <!-- Language -->
        ${showLanguage && primaryLanguage !== 'Unknown' ? `
          <g transform="translate(${padding}, ${langY})">
            <circle cx="6" cy="0" r="6" fill="${languageColor}"/>
            <text x="18" y="4" fill="${selectedTheme.textColor}" 
                  font-size="12" font-family="system-ui, -apple-system, sans-serif">
              ${primaryLanguage}
            </text>
          </g>
        ` : ''}
        
        <!-- Stats -->
        ${showStats ? `
          <g transform="translate(${width - padding - 120}, ${statsY})">
            <!-- Stars -->
            <g>
              <svg x="0" y="-8" width="16" height="16" viewBox="0 0 16 16" fill="${selectedTheme.iconColor}">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
              </svg>
              <text x="20" y="4" fill="${selectedTheme.statColor}" 
                    font-size="12" font-family="system-ui, -apple-system, sans-serif">
                ${formatNumber(repoData.stargazers_count)}
              </text>
            </g>
            
            <!-- Forks -->
            <g transform="translate(60, 0)">
              <svg x="0" y="-8" width="16" height="16" viewBox="0 0 16 16" fill="${selectedTheme.iconColor}">
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
              </svg>
              <text x="20" y="4" fill="${selectedTheme.statColor}" 
                    font-size="12" font-family="system-ui, -apple-system, sans-serif">
                ${formatNumber(repoData.forks_count)}
              </text>
            </g>
          </g>
        ` : ''}
        
        <!-- Subtle animation -->
        <rect x="0" y="0" width="100%" height="100%" fill="url(#fadeIn)" opacity="0.1"/>
      </svg>
    `;
    
    return new NextResponse(svg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('Error generating repository showcase:', error);
    
    // Return error SVG
    const errorSvg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
           xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa" stroke="#e1e4e8" rx="6"/>
        <text x="${width/2}" y="${height/2-10}" text-anchor="middle" fill="#d73a49" 
              font-size="14" font-family="system-ui" font-weight="600">
          Repository not found
        </text>
        <text x="${width/2}" y="${height/2+10}" text-anchor="middle" fill="#586069" 
              font-size="12" font-family="system-ui">
          Check username and repository name
        </text>
      </svg>
    `;
    
    return new NextResponse(errorSvg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
