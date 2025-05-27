import { NextRequest, NextResponse } from 'next/server';

// Types
interface RepoData {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
  languages_url: string;
  primaryLanguage?: string;
  success: boolean;
  error?: string;
}

interface SVGOptions {
  cardWidth: number;
  cardHeight: number;
  theme: string;
  showStats: boolean;
  showLanguage: boolean;
  showDescription: boolean;
  showTopics: boolean;
  showLastUpdated: boolean;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract parameters
  const username = searchParams.get('username');
  const repo = searchParams.get('repo');
  const repos = searchParams.get('repos'); // Comma-separated list of username/repo pairs
  const cardWidth = parseInt(searchParams.get('cardWidth') || searchParams.get('width') || '400');
  const cardHeight = parseInt(searchParams.get('cardHeight') || searchParams.get('height') || '200');
  const theme = searchParams.get('theme') || 'default';
  const layout = searchParams.get('layout') || 'single';
  const sortBy = searchParams.get('sortBy') || 'stars';
  const repoLimit = parseInt(searchParams.get('repoLimit') || '6');
  const showStats = searchParams.get('showStats') !== 'false';
  const showLanguage = searchParams.get('showLanguage') !== 'false';
  const showDescription = searchParams.get('showDescription') !== 'false';
  const showTopics = searchParams.get('showTopics') === 'true';
  const showLastUpdated = searchParams.get('showLastUpdated') === 'true';
  
  // Support both single repo (legacy) and multiple repos
  let repositoriesToFetch: string[] = [];
  
  if (repos) {
    // Multiple repositories format: "owner1/repo1,owner2/repo2"
    repositoriesToFetch = repos.split(',').map(r => r.trim()).filter(r => r.includes('/'));
  } else if (username && repo) {
    // Legacy single repository format
    repositoriesToFetch = [`${username}/${repo}`];
  } else {
    return new NextResponse('Either repos parameter or username+repo parameters are required', { status: 400 });
  }
  
  if (repositoriesToFetch.length === 0) {
    return new NextResponse('No valid repositories specified', { status: 400 });
  }
  
  // Limit the number of repositories
  repositoriesToFetch = repositoriesToFetch.slice(0, Math.min(repoLimit, 6));

  try {
    // Fetch repository data for all repositories
    const repoDataPromises = repositoriesToFetch.map(async (repoPath) => {
      const [repoUsername, repoName] = repoPath.split('/');
      try {
        const repoResponse = await fetch(`https://api.github.com/repos/${repoUsername}/${repoName}`);
        if (!repoResponse.ok) {
          throw new Error(`Repository ${repoPath} not found`);
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
        
        // Fetch topics if needed
        let topics: string[] = [];
        if (showTopics && repoData.topics) {
          topics = repoData.topics.slice(0, 3); // Limit to 3 topics for space
        }
        
        return {
          ...repoData,
          primaryLanguage,
          topics,
          success: true
        } as RepoData;
      } catch (error) {
        console.error(`Error fetching repository ${repoPath}:`, error);
        return {
          name: repoPath.split('/')[1] || repoPath,
          full_name: repoPath,
          description: null,
          stargazers_count: 0,
          forks_count: 0,
          language: null,
          topics: [],
          updated_at: '',
          created_at: '',
          fork: false,
          languages_url: '',
          error: `Failed to fetch ${repoPath}`,
          success: false
        } as RepoData;
      }
    });
    
    const repositories = await Promise.all(repoDataPromises);
    const successfulRepos = repositories.filter(repo => repo.success);
    
    if (successfulRepos.length === 0) {
      throw new Error('No repositories could be fetched');
    }
    
    // Sort repositories based on sortBy parameter
    successfulRepos.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case 'forks':
          return (b.forks_count || 0) - (a.forks_count || 0);
        case 'updated':
          return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
        case 'created':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    // Generate SVG based on layout
    const options: SVGOptions = {
      cardWidth, cardHeight, theme, showStats, showLanguage, showDescription, showTopics, showLastUpdated
    };
    
    let svg: string;
    
    if (layout === 'single') {
      svg = generateSingleRepoSVG(successfulRepos[0], options);
    } else {
      svg = generateMultiRepoSVG(successfulRepos, layout, options);
    }
    
    return new NextResponse(svg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('Error generating repository showcase:', error);
    
    // Return error SVG
    const errorSvg = generateErrorSVG(cardWidth, cardHeight, 'Repository not found', 'Check repository names');
    
    return new NextResponse(errorSvg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}

// Helper functions
function getTheme(theme: string) {
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
  
  return themes[theme as keyof typeof themes] || themes.default;
}

function getLanguageColor(language: string): string {
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
  
  return languageColors[language] || '#586069';
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function generateSingleRepoSVG(repoData: RepoData, options: SVGOptions): string {
  const { cardWidth, cardHeight, theme, showStats, showLanguage, showDescription, showTopics, showLastUpdated } = options;
  const selectedTheme = getTheme(theme);
  const languageColor = getLanguageColor(repoData.primaryLanguage || repoData.language || 'Unknown');
  
  // Calculate layout
  const padding = 16;
  const titleY = padding + 20;
  const descY = showDescription ? titleY + 25 : titleY + 10;
  const topicsY = showTopics && repoData.topics && repoData.topics.length > 0 ? descY + 20 : descY;
  const statsY = cardHeight - padding - 5;
  const langY = showLanguage ? statsY - 20 : statsY;
  const updatedY = showLastUpdated ? langY - 15 : langY;
  
  // Truncate description
  const maxDescLength = Math.floor(cardWidth / 8);
  const description = repoData.description || 'No description available';
  const truncatedDesc = description.length > maxDescLength 
    ? description.substring(0, maxDescLength - 3) + '...' 
    : description;
  
  return `
    <svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" 
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
        <g transform="translate(${cardWidth - padding - 60}, ${padding + 2})">
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
      
      <!-- Topics -->
      ${showTopics && repoData.topics && repoData.topics.length > 0 ? `
        <g transform="translate(${padding}, ${topicsY})">
          ${repoData.topics.slice(0, 3).map((topic, index) => `
            <rect x="${index * 70}" y="-8" width="65" height="16" rx="8" fill="${selectedTheme.border}"/>
            <text x="${index * 70 + 8}" y="2" fill="${selectedTheme.textColor}" font-size="10" font-family="system-ui">
              ${topic.length > 8 ? topic.substring(0, 8) + '..' : topic}
            </text>
          `).join('')}
        </g>
      ` : ''}
      
      <!-- Last Updated -->
      ${showLastUpdated ? `
        <text x="${padding}" y="${updatedY}" fill="${selectedTheme.textColor}" 
              font-size="10" font-family="system-ui, -apple-system, sans-serif">
          Updated ${formatDate(repoData.updated_at)}
        </text>
      ` : ''}
      
      <!-- Language -->
      ${showLanguage && (repoData.primaryLanguage || repoData.language) && (repoData.primaryLanguage || repoData.language) !== 'Unknown' ? `
        <g transform="translate(${padding}, ${langY})">
          <circle cx="6" cy="0" r="6" fill="${languageColor}"/>
          <text x="18" y="4" fill="${selectedTheme.textColor}" 
                font-size="12" font-family="system-ui, -apple-system, sans-serif">
            ${repoData.primaryLanguage || repoData.language}
          </text>
        </g>
      ` : ''}
      
      <!-- Stats -->
      ${showStats ? `
        <g transform="translate(${cardWidth - padding - 120}, ${statsY})">
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
}

function generateMultiRepoSVG(repositories: RepoData[], layout: string, options: SVGOptions): string {
  const { cardWidth, cardHeight } = options;
  
  // Calculate grid dimensions
  let cols = 1, rows = 1;
  switch (layout) {
    case 'grid-2x1':
      cols = 2; rows = 1;
      break;
    case 'grid-2x2':
      cols = 2; rows = 2;
      break;
    case 'grid-3x1':
      cols = 3; rows = 1;
      break;
    case 'list':
      cols = 1; rows = repositories.length;
      break;
    default:
      cols = Math.ceil(Math.sqrt(repositories.length));
      rows = Math.ceil(repositories.length / cols);
  }
  
  const padding = 10;
  const totalWidth = cols * cardWidth + (cols - 1) * padding;
  const totalHeight = rows * cardHeight + (rows - 1) * padding;
  
  let svgContent = `
    <svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" 
         xmlns="http://www.w3.org/2000/svg">
  `;
  
  repositories.slice(0, cols * rows).forEach((repo, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = col * (cardWidth + padding);
    const y = row * (cardHeight + padding);
      const singleSVG = generateSingleRepoSVG(repo, options);
    const svgMatch = singleSVG.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
    
    if (svgMatch) {
      svgContent += `
        <g transform="translate(${x}, ${y})">
          ${svgMatch[1]}
        </g>
      `;
    }
  });
  
  svgContent += '</svg>';
  return svgContent;
}

function generateErrorSVG(width: number, height: number, title: string, subtitle: string): string {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
         xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa" stroke="#e1e4e8" rx="6"/>
      <text x="${width/2}" y="${height/2-10}" text-anchor="middle" fill="#d73a49" 
            font-size="14" font-family="system-ui" font-weight="600">
        ${title}
      </text>
      <text x="${width/2}" y="${height/2+10}" text-anchor="middle" fill="#586069" 
            font-size="12" font-family="system-ui">
        ${subtitle}
      </text>
    </svg>
  `;
}
