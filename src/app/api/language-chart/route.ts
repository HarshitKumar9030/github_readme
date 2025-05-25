import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract parameters
  const username = searchParams.get('username');
  const size = parseInt(searchParams.get('size') || '300');
  const theme = searchParams.get('theme') || 'default';
  const showLabels = searchParams.get('showLabels') !== 'false';
  const showPercentages = searchParams.get('showPercentages') !== 'false';
  const minPercentage = parseFloat(searchParams.get('minPercentage') || '1');
  const maxLanguages = parseInt(searchParams.get('maxLanguages') || '8');
  
  if (!username) {
    return new NextResponse('Username is required', { status: 400 });
  }
  
  try {
    // Fetch user's repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`);
    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    const repos = await reposResponse.json();
    const languageStats: { [key: string]: number } = {};
    
    // Fetch language data for each repository
    for (const repo of repos) {
      if (repo.fork) continue; // Skip forked repositories
      
      try {
        const langResponse = await fetch(repo.languages_url);
        if (langResponse.ok) {
          const languages = await langResponse.json();
          for (const [lang, bytes] of Object.entries(languages)) {
            languageStats[lang] = (languageStats[lang] || 0) + (bytes as number);
          }
        }
      } catch (error) {
        // Continue if individual repo fails
        continue;
      }
    }
    
    // Calculate percentages and filter
    const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0);
    const languagePercentages = Object.entries(languageStats)
      .map(([lang, bytes]) => ({
        name: lang,
        percentage: (bytes / totalBytes) * 100
      }))
      .filter(lang => lang.percentage >= minPercentage)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, maxLanguages);
    
    // Theme configurations
    const themes = {
      default: {
        background: '#ffffff',
        text: '#333333',
        colors: ['#0366d6', '#28a745', '#ffd33d', '#f66a0a', '#6f42c1', '#d73a49', '#0598d6', '#34d058']
      },
      dark: {
        background: '#0d1117',
        text: '#f0f6fc',
        colors: ['#58a6ff', '#56d364', '#f1e05a', '#fb8500', '#bc8cff', '#f85149', '#39d0d8', '#7ee787']
      },
      github: {
        background: '#f6f8fa',
        text: '#24292f',
        colors: ['#3178c6', '#f1e05a', '#e34c26', '#563d7c', '#89e051', '#f1502f', '#00d2b8', '#ff6b6b']
      },
      neon: {
        background: '#0f0f0f',
        text: '#00ff41',
        colors: ['#00ff41', '#ff0080', '#0080ff', '#ffff00', '#ff8000', '#8000ff', '#00ffff', '#ff4080']
      }
    };
    
    const selectedTheme = themes[theme as keyof typeof themes] || themes.default;
    
    // Generate pie chart
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = Math.min(size / 2 - 40, 120);
    
    let currentAngle = -Math.PI / 2; // Start at top
    const segments = languagePercentages.map((lang, index) => {
      const percentage = lang.percentage;
      const angle = (percentage / 100) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle = endAngle;
      
      // Calculate label position
      const labelAngle = startAngle + angle / 2;
      const labelX = centerX + (radius + 25) * Math.cos(labelAngle);
      const labelY = centerY + (radius + 25) * Math.sin(labelAngle);
      
      const color = selectedTheme.colors[index % selectedTheme.colors.length];
      
      return {
        path: pathData,
        color,
        percentage: percentage.toFixed(1),
        name: lang.name,
        labelX,
        labelY,
        textAnchor: labelX > centerX ? 'start' : 'end'
      };
    });
    
    // Generate legend if chart is large enough
    const showLegend = size >= 250 && languagePercentages.length <= 6;
    const legendItems = showLegend ? languagePercentages.map((lang, index) => {
      const color = selectedTheme.colors[index % selectedTheme.colors.length];
      return `
        <g transform="translate(${size - 150}, ${30 + index * 25})">
          <rect x="0" y="0" width="15" height="15" fill="${color}" rx="2"/>
          <text x="22" y="12" fill="${selectedTheme.text}" font-size="12" font-family="Arial, sans-serif">
            ${lang.name} ${showPercentages ? `(${lang.percentage.toFixed(1)}%)` : ''}
          </text>
        </g>`;
    }).join('') : '';
    
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="${selectedTheme.background}" rx="8"/>
        
        <text x="${centerX}" y="25" text-anchor="middle" fill="${selectedTheme.text}" 
              font-size="16" font-weight="bold" font-family="Arial, sans-serif">
          ${username}'s Languages
        </text>
        
        <g filter="url(#shadow)">
          ${segments.map(segment => `
            <path d="${segment.path}" fill="${segment.color}" opacity="0.9">
              <animate attributeName="opacity" values="0;0.9" dur="0.8s" fill="freeze"/>
            </path>
          `).join('')}
        </g>
        
        ${showLabels && !showLegend ? segments.map(segment => `
          <text x="${segment.labelX}" y="${segment.labelY}" 
                text-anchor="${segment.textAnchor}" fill="${selectedTheme.text}" 
                font-size="11" font-family="Arial, sans-serif" font-weight="500">
            ${segment.name}${showPercentages ? ` (${segment.percentage}%)` : ''}
          </text>
        `).join('') : ''}
        
        ${legendItems}
        
        ${languagePercentages.length === 0 ? `
          <text x="${centerX}" y="${centerY}" text-anchor="middle" fill="${selectedTheme.text}" 
                font-size="14" font-family="Arial, sans-serif">
            No language data available
          </text>
        ` : ''}
      </svg>
    `;
    
    return new NextResponse(svg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('Error generating language chart:', error);
    
    // Return error SVG
    const errorSvg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
           xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa" rx="8"/>
        <text x="${size/2}" y="${size/2-10}" text-anchor="middle" fill="#d73a49" 
              font-size="14" font-family="Arial, sans-serif" font-weight="bold">
          Error loading data
        </text>
        <text x="${size/2}" y="${size/2+10}" text-anchor="middle" fill="#586069" 
              font-size="12" font-family="Arial, sans-serif">
          Please check username
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
