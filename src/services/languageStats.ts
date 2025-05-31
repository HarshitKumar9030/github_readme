import { NextResponse } from 'next/server';
import { cacheHelpers } from './cacheStats';

interface Repository {
  name: string;
  language: string | null;
  languages_url: string;
  size: number;
  stargazers_count: number;
  fork: boolean;
}

interface LanguageData {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
  repos: number;
}

// Fallback in-memory cache for ultra-fast access
const memoryCache = new Map<string, { data: LanguageData[], timestamp: number }>();
const MEMORY_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for memory cache

export async function GET(request: Request) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    const username = searchParams.get('username') || 'octocat';
    const theme = searchParams.get('theme') || 'dark';
    const size = parseInt(searchParams.get('size') || '400');
    const chartType = searchParams.get('chartType') || 'donut'; // donut, bar, pie
    const maxLanguages = Math.min(parseInt(searchParams.get('maxLanguages') || '8'), 8);
    const minPercentage = parseFloat(searchParams.get('minPercentage') || '0');
    const hideBorder = searchParams.get('hideBorder') === 'true';
    const hideTitle = searchParams.get('hideTitle') === 'true';
    const customTitle = searchParams.get('customTitle') || '';
    const showPercentages = searchParams.get('showPercentages') === 'true';
    const type = searchParams.get('type') || 'svg';
    
    // Create comprehensive cache key including all options
    const cacheKey = `${username}-${maxLanguages}-${minPercentage}`;
    
    // Check memory cache first (fastest)
    const memCached = memoryCache.get(cacheKey);
    if (memCached && (Date.now() - memCached.timestamp) < MEMORY_CACHE_DURATION) {
      console.log(`⚡ Memory cache hit for ${username}`);
      
      if (type === 'raw') {
        return NextResponse.json({
          username,
          languages: memCached.data,
          totalLanguages: memCached.data.length,
          processingTime: `${(performance.now() - startTime).toFixed(2)}ms`,
          cacheSource: 'memory'
        }, {
          headers: {
            'Cache-Control': 'public, max-age=120', // 2 minutes
            'X-Processing-Time': `${(performance.now() - startTime).toFixed(2)}ms`,
            'X-Cache-Source': 'memory'
          }
        });
      }
      
      const svg = generateEnhancedSVG(memCached.data, theme, size, chartType, performance.now() - startTime, {
        hideBorder,
        hideTitle,
        customTitle,
        showPercentages,
        minPercentage
      });
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=120', // 2 minutes
          'X-Processing-Time': `${(performance.now() - startTime).toFixed(2)}ms`,
          'X-Cache-Source': 'memory'
        }
      });
    }
      // Check MongoDB cache (fast)
    const mongoData = await cacheHelpers.getLanguageStats(username, maxLanguages);
    if (mongoData) {
      console.log(`🚀 MongoDB cache hit for ${username}`);
      // Store in memory cache for even faster future access
      memoryCache.set(cacheKey, { data: mongoData, timestamp: Date.now() });
      
      if (type === 'raw') {
        return NextResponse.json({
          username,
          languages: mongoData,
          totalLanguages: mongoData.length,
          processingTime: `${(performance.now() - startTime).toFixed(2)}ms`,
          cacheSource: 'mongodb'
        }, {
          headers: {
            'Cache-Control': 'public, max-age=600', // 10 minutes
            'X-Processing-Time': `${(performance.now() - startTime).toFixed(2)}ms`,
            'X-Cache-Source': 'mongodb'
          }
        });
      }
      
      const svg = generateEnhancedSVG(mongoData, theme, size, chartType, performance.now() - startTime, {
        hideBorder,
        hideTitle,
        customTitle,
        showPercentages,
        minPercentage
      });
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=600', // 10 minutes
          'X-Processing-Time': `${(performance.now() - startTime).toFixed(2)}ms`,
          'X-Cache-Source': 'mongodb'
        }
      });
    }    // Parallel fetch: Get user repos and user info simultaneously
    const githubToken = process.env.GITHUB_TOKEN;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-README-Generator',
      ...(githubToken && { 'Authorization': `token ${githubToken}` })
    };

    const [reposResponse, userResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`, {
        headers
      }),
      fetch(`https://api.github.com/users/${username}`, {
        headers
      })
    ]);

    if (!reposResponse.ok) {
      const errorMsg = reposResponse.status === 404 ? 'User not found' : 'Failed to fetch repositories';
      return NextResponse.json({ error: errorMsg }, { status: reposResponse.status });
    }

    const [repos, userInfo] = await Promise.all([
      reposResponse.json() as Promise<Repository[]>,
      userResponse.json()
    ]);

    // Filter out forks and get language data in parallel
    const ownRepos = repos.filter(repo => !repo.fork && repo.language);
      // Parallel language data fetching with concurrency control
    const languagePromises = ownRepos.map(async (repo) => {
      try {
        const response = await fetch(repo.languages_url, {
          headers
        });
        if (response.ok) {
          const languages = await response.json();
          return { repo: repo.name, languages };
        }
      } catch (error) {
        console.warn(`Failed to fetch languages for ${repo.name}:`, error);
      }
      return { repo: repo.name, languages: { [repo.language!]: repo.size } };
    });

    // Execute all language fetches concurrently with batching
    const batchSize = 10; // Process 10 repos at a time to avoid rate limiting
    const languageResults = [];
    
    for (let i = 0; i < languagePromises.length; i += batchSize) {
      const batch = languagePromises.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch);
      languageResults.push(...batchResults);
      
      // Small delay between batches to be respectful to GitHub API
      if (i + batchSize < languagePromises.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Aggregate language statistics with advanced processing
    const languageStats: Record<string, { bytes: number, repos: Set<string> }> = {};
    
    languageResults.forEach(({ repo, languages }) => {
      Object.entries(languages).forEach(([language, bytes]) => {
        if (!languageStats[language]) {
          languageStats[language] = { bytes: 0, repos: new Set() };
        }
        languageStats[language].bytes += bytes as number;
        languageStats[language].repos.add(repo);
      });
    });

    // Calculate total bytes for percentages
    const totalBytes = Object.values(languageStats).reduce((sum, stat) => sum + stat.bytes, 0);
      // Convert to structured data and sort
    const languageData: LanguageData[] = Object.entries(languageStats)
      .map(([name, stat]) => ({
        name,
        bytes: stat.bytes,
        percentage: (stat.bytes / totalBytes) * 100,
        color: getEnhancedColorForLanguage(name, theme),
        repos: stat.repos.size
      }))
      .filter(lang => lang.percentage >= minPercentage) // Apply minimum percentage filter
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, maxLanguages);// Cache the results in both MongoDB (long-term) and memory (short-term)
    await Promise.all([
      cacheHelpers.cacheLanguageStats(username, languageData, maxLanguages),
      // Also store in memory cache for ultra-fast access
      (() => { memoryCache.set(cacheKey, { data: languageData, timestamp: Date.now() }); })()
    ]);
      console.log(`💾 Cached language stats for ${username} (${languageData.length} languages)`);
    
    // Return raw JSON if requested
    if (type === 'raw') {
      return NextResponse.json({
        username,
        languages: languageData,
        totalLanguages: languageData.length,
        totalBytes,
        processingTime: `${(performance.now() - startTime).toFixed(2)}ms`,
        cacheSource: 'fresh'
      }, {
        headers: {
          'Cache-Control': 'public, max-age=600', // 10 minutes for fresh data
          'X-Processing-Time': `${(performance.now() - startTime).toFixed(2)}ms`,
          'X-Total-Languages': languageData.length.toString(),
          'X-Total-Bytes': totalBytes.toString(),
          'X-Cache-Source': 'fresh'
        }
      });
    }
    
    // Generate beautiful SVG
    const svg = generateEnhancedSVG(languageData, theme, size, chartType, performance.now() - startTime, {
      hideBorder,
      hideTitle,
      customTitle,
      showPercentages,
      minPercentage
    });
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=600', // 10 minutes for fresh data
        'X-Processing-Time': `${(performance.now() - startTime).toFixed(2)}ms`,
        'X-Total-Languages': languageData.length.toString(),
        'X-Total-Bytes': totalBytes.toString(),
        'X-Cache-Source': 'fresh'
      }
    });

  } catch (error) {
    console.error('Language stats error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getEnhancedColorForLanguage(language: string, theme: string): string {
  const colors: Record<string, string> = {
    // Popular languages with GitHub's official colors
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#239120',
    'C++': '#f34b7d',
    C: '#555555',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#0175C2',
    Scala: '#c22d40',
    R: '#198CE7',
    Perl: '#0298c3',
    Haskell: '#5e5086',
    Lua: '#000080',
    Shell: '#89e051',
    PowerShell: '#012456',
    HTML: '#e34c26',
    CSS: '#1572B6',
    SCSS: '#c6538c',
    Less: '#1d365d',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Angular: '#DD0031',
    Svelte: '#ff3e00',
    'Objective-C': '#438eff',
    'Objective-C++': '#6866fb',
    Assembly: '#6E4C13',
    Dockerfile: '#384d54',
    YAML: '#cb171e',
    JSON: '#292929',
    Markdown: '#083fa1',
    XML: '#0060ac',
    SQL: '#e38c00',
    PLSQL: '#dad8d8',
    MATLAB: '#e16737',
    Jupyter: '#DA5B0B',
    'Vim script': '#199f4b',
    Emacs: '#c065db',
    Makefile: '#427819',
    CMake: '#DA3434',
    Nix: '#7e7eff',
    Elixir: '#6e4a7e',
    Erlang: '#B83998',
    Clojure: '#db5855',
    F: '#b845fc',
    Julia: '#a270ba',
    Nim: '#ffc200',
    Crystal: '#000100',
    Zig: '#ec915c',
    V: '#4f87c4'
  };
  
  const baseColor = colors[language];
  if (baseColor) return baseColor;
  
  // Generate consistent color from language name hash
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  const saturation = theme === 'dark' ? 70 : 60;
  const lightness = theme === 'dark' ? 60 : 45;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function generateEnhancedSVG(
  languageData: LanguageData[], 
  theme: string, 
  size: number, 
  chartType: string,
  processingTime: number,
  options: {
    hideBorder?: boolean;
    hideTitle?: boolean;
    customTitle?: string;
    showPercentages?: boolean;
    minPercentage?: number;
  } = {}
): string {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0d1117' : '#ffffff';
  const textColor = isDark ? '#e6edf3' : '#24292f';
  const borderColor = isDark ? '#21262d' : '#d0d7de';
  const accentColor = isDark ? '#238636' : '#0969da';
    // Fixed dimensions for better layout control
  const padding = 25;
  const headerHeight = options.hideTitle ? 25 : 50;
  const footerHeight = 30;
  
  // Fixed legend width to prevent overflow
  const legendWidth = 280;
  
  // Ensure minimum chart size but limit maximum for better display
  const chartSize = Math.max(Math.min(size, 600), 400);
  
  // Calculate total width - chart + legend + spacing
  const totalWidth = chartSize + legendWidth + padding * 3;
  
  // Calculate height based on chart type
  let svgHeight = chartSize + headerHeight + footerHeight;
  if (chartType === 'bar') {
    const barHeight = 32;
    const minBarChartHeight = headerHeight + footerHeight + (languageData.length * barHeight) + (padding * 2) + 40;
    svgHeight = Math.max(svgHeight, minBarChartHeight);
  }
  
  let svgContent = `
    <svg width="${totalWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${svgHeight}">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${isDark ? '#161b22' : '#f6f8fa'};stop-opacity:1" />
        </linearGradient>
        
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="${isDark ? '#000000' : '#00000020'}" />
        </filter>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <style>
          .chart-title { font: bold 18px 'Segoe UI', system-ui, sans-serif; fill: ${textColor}; }
          .legend-text { font: 13px 'Segoe UI', system-ui, sans-serif; fill: ${textColor}; }
          .percentage-text { font: bold 12px 'Segoe UI', system-ui, sans-serif; fill: white; text-anchor: middle; }
          .stats-text { font: 11px 'Segoe UI', system-ui, sans-serif; fill: ${isDark ? '#7d8590' : '#656d76'}; }
          .hover-effect { transition: all 0.3s ease; cursor: pointer; }
          .hover-effect:hover { filter: brightness(1.1); transform: scale(1.02); }
          .language-name { font: bold 13px 'Segoe UI', system-ui, sans-serif; fill: ${textColor}; }
          .badge-text { font: bold 10px 'Segoe UI', system-ui, sans-serif; fill: white; text-anchor: middle; }
        </style>
      </defs>
        <!-- Background -->
      <rect width="${totalWidth}" height="${svgHeight}" fill="url(#bgGradient)" rx="15" ry="15" />
      ${!options.hideBorder ? `<rect width="${totalWidth}" height="${svgHeight}" fill="none" stroke="${borderColor}" stroke-width="1" rx="15" ry="15" />` : ''}
      
      <!-- Title -->
      ${!options.hideTitle ? `
      <text x="${padding}" y="40" class="chart-title">
        <tspan>${options.customTitle || '🌐 Top Programming Languages'}</tspan>
      </text>` : ''}
      
      <!-- Processing time badge -->
      <rect x="${totalWidth - 140}" y="20" width="120" height="25" fill="${accentColor}" rx="12" opacity="0.9" filter="url(#shadow)" />
      <text x="${totalWidth - 80}" y="37" class="badge-text">
        ⚡ ${processingTime.toFixed(1)}ms
      </text>
  `;  if (chartType === 'donut' || chartType === 'pie') {
    svgContent += generateResponsiveDonutChart(languageData, chartSize, padding, chartType === 'pie', headerHeight, options.showPercentages);
  } else {    svgContent += generateResponsiveBarChart(languageData, chartSize, svgHeight, padding, isDark, headerHeight, options.showPercentages);
  }
  
  // Generate responsive legend
  svgContent += generateResponsiveLegend(languageData, chartSize, legendWidth, textColor, svgHeight, padding);
  
  svgContent += '</svg>';
  
  return svgContent;
}

function generateResponsiveDonutChart(languageData: LanguageData[], size: number, padding: number, isPie: boolean, headerHeight: number, showPercentages: boolean = true): string {
  const centerX = size / 2;
  const centerY = (size + headerHeight) / 2;
  const maxRadius = Math.min(size - padding * 2, size - headerHeight - padding) / 2 - 20;
  const radius = Math.max(maxRadius, 120); // Ensure minimum radius
  const innerRadius = isPie ? 0 : radius * 0.45;
  
  let currentAngle = -90; // Start from top
  let paths = '';
  
  languageData.forEach((lang, index) => {
    const angle = (lang.percentage / 100) * 360;
    const startAngle = (currentAngle * Math.PI) / 180;
    const endAngle = ((currentAngle + angle) * Math.PI) / 180;
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = centerX + Math.cos(startAngle) * radius;
    const y1 = centerY + Math.sin(startAngle) * radius;
    const x2 = centerX + Math.cos(endAngle) * radius;
    const y2 = centerY + Math.sin(endAngle) * radius;
    
    const x1Inner = centerX + Math.cos(startAngle) * innerRadius;
    const y1Inner = centerY + Math.sin(startAngle) * innerRadius;
    const x2Inner = centerX + Math.cos(endAngle) * innerRadius;
    const y2Inner = centerY + Math.sin(endAngle) * innerRadius;
    
    let pathData;
    if (isPie) {
      pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    } else {
      pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner} Z`;
    }
    
    paths += `
      <path d="${pathData}" 
            fill="${lang.color}" 
            class="hover-effect"
            filter="url(#shadow)">
        <title>${lang.name}: ${lang.percentage.toFixed(1)}% (${lang.repos} repos)</title>
      </path>
    `;
      // Add percentage text for larger segments
    if (showPercentages && lang.percentage > 3) {
      const textAngle = currentAngle + angle / 2;
      const textRadius = isPie ? radius * 0.75 : (radius + innerRadius) / 2;
      const textX = centerX + Math.cos((textAngle * Math.PI) / 180) * textRadius;
      const textY = centerY + Math.sin((textAngle * Math.PI) / 180) * textRadius;
      
      paths += `
        <text x="${textX}" y="${textY}" class="percentage-text" filter="url(#glow)">
          ${lang.percentage.toFixed(1)}%
        </text>
      `;
    }
    
    currentAngle += angle;
  });
  
  // Add center information for donut chart
  if (!isPie) {
    const totalRepos = languageData.reduce((sum, lang) => sum + lang.repos, 0);
    paths += `
      <text x="${centerX}" y="${centerY - 10}" class="language-name" text-anchor="middle">
        ${totalRepos}
      </text>
      <text x="${centerX}" y="${centerY + 10}" class="stats-text" text-anchor="middle">
        repositories
      </text>
    `;
  }
  
  return paths;
}

function generateResponsiveBarChart(languageData: LanguageData[], size: number, svgHeight: number, padding: number, isDark: boolean, headerHeight: number, showPercentages: boolean = true): string {
  const chartHeight = svgHeight - headerHeight - padding * 2 - 20;
  const chartWidth = size - padding * 2;
  const barHeight = Math.max(25, Math.min(40, chartHeight / languageData.length - 8));
  const startY = headerHeight + 20;
  
  let bars = '';
  
  languageData.forEach((lang, index) => {
    const barWidth = (lang.percentage / 100) * chartWidth * 0.95; // Leave some margin
    const y = startY + index * (barHeight + 8);
    
    // Background bar
    bars += `
      <rect x="${padding}" y="${y}" 
            width="${chartWidth * 0.95}" height="${barHeight}" 
            fill="${isDark ? '#21262d' : '#f6f8fa'}" 
            rx="6" ry="6"
            stroke="${isDark ? '#30363d' : '#d0d7de'}" stroke-width="1" />
    `;
    
    // Progress bar with gradient
    bars += `
      <defs>
        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${lang.color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${lang.color};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      
      <rect x="${padding}" y="${y}" 
            width="${barWidth}" height="${barHeight}" 
            fill="url(#grad${index})" 
            class="hover-effect"
            filter="url(#shadow)"
            rx="6" ry="6">
        <title>${lang.name}: ${lang.percentage.toFixed(1)}% (${lang.repos} repos)</title>
        <animate attributeName="width" from="0" to="${barWidth}" dur="1.5s" fill="freeze" begin="${index * 0.2}s" />
      </rect>
        <text x="${padding + 12}" y="${y + barHeight / 2 + 5}" class="language-name" fill="white">
        ${lang.name}
      </text>
      
      ${showPercentages ? `
      <text x="${padding + chartWidth * 0.95 - 12}" y="${y + barHeight / 2 + 5}" class="percentage-text" text-anchor="end" fill="${lang.color}">
        ${lang.percentage.toFixed(1)}%
      </text>
      ` : ''}
    `;
  });
  
  return bars;
}

function generateResponsiveLegend(languageData: LanguageData[], size: number, legendWidth: number, textColor: string, svgHeight: number, padding: number): string {
  const startX = size + padding * 2;
  const startY = 80;
  
  // Ensure we only display max 8 languages and enforce consistent spacing
  const displayLanguages = languageData.slice(0, 8);
  const itemHeight = Math.max(30, Math.min(36, (svgHeight - 160) / Math.max(displayLanguages.length, 1)));
  
  let legend = `
    <text x="${startX}" y="40" class="chart-title">📊 Statistics</text>
    
    <!-- Legend background -->
    <rect x="${startX - 10}" y="60" width="${legendWidth - 20}" height="${displayLanguages.length * itemHeight + 80}" 
          fill="${textColor}05" stroke="${textColor}20" stroke-width="1" rx="10" ry="10" />
  `;
  
  displayLanguages.forEach((lang, index) => {
    const y = startY + index * itemHeight;
    
    // Truncate language name to prevent overflow - more conservative truncation
    const maxNameLength = 12;
    const displayName = lang.name.length > maxNameLength ? 
      lang.name.substring(0, maxNameLength) + '...' : lang.name;
    
    legend += `
      <g class="hover-effect" transform="translate(0,0)">
        <circle cx="${startX + 8}" cy="${y - 2}" r="8" fill="${lang.color}" filter="url(#shadow)" />
        
        <text x="${startX + 25}" y="${y + 2}" class="language-name" textLength="${Math.min(140, displayName.length * 8)}" lengthAdjust="spacingAndGlyphs">
          ${displayName}
        </text>
        
        <text x="${startX + legendWidth - 40}" y="${y + 2}" class="stats-text" text-anchor="end">
          ${lang.percentage.toFixed(1)}%
        </text>
        
        <text x="${startX + 25}" y="${y + 18}" class="stats-text">
          ${formatBytes(lang.bytes)} • ${lang.repos} ${lang.repos === 1 ? 'repo' : 'repos'}
        </text>
      </g>
    `;
  });
    // Add summary stats
  const totalRepos = displayLanguages.reduce((sum, lang) => sum + lang.repos, 0);
  const totalBytes = displayLanguages.reduce((sum, lang) => sum + lang.bytes, 0);
  const statsY = startY + displayLanguages.length * itemHeight + 25;
  
  legend += `
    <line x1="${startX}" y1="${statsY}" 
          x2="${startX + legendWidth - 50}" y2="${statsY}" 
          stroke="${textColor}" stroke-width="1" opacity="0.3" />
    
    <text x="${startX}" y="${statsY + 20}" class="stats-text">
      💾 Total: ${formatBytes(totalBytes)}
    </text>
    <text x="${startX}" y="${statsY + 35}" class="stats-text">
      📁 ${totalRepos} ${totalRepos === 1 ? 'Repository' : 'Repositories'}
    </text>
  `;
  
  return legend;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
