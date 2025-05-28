'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';

// Image cache to prevent re-loading of GitHub API images
const imageCache = new Map<string, string>();
const imageCacheTimestamps = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Custom hook for stable image URLs with caching
function useStableImageUrl(url: string, cacheKey: string) {
  const [cachedUrl, setCachedUrl] = useState<string>(() => {
    const cached = imageCache.get(cacheKey);
    const timestamp = imageCacheTimestamps.get(cacheKey);
    
    // Check if cache is still valid
    if (cached && timestamp && Date.now() - timestamp < CACHE_DURATION) {
      return cached;
    }
    
    return url;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!url) return;

    const cached = imageCache.get(cacheKey);
    const timestamp = imageCacheTimestamps.get(cacheKey);
    
    // If we have a valid cached version, use it
    if (cached && timestamp && Date.now() - timestamp < CACHE_DURATION) {
      setCachedUrl(cached);
      return;
    }

    setIsLoading(true);
    setError('');

    // Preload the image to ensure it's cached
    const img = new globalThis.Image();
    
    img.onload = () => {
      imageCache.set(cacheKey, url);
      imageCacheTimestamps.set(cacheKey, Date.now());
      setCachedUrl(url);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };
    
    img.src = url;
  }, [url, cacheKey]);

  return { cachedUrl, isLoading, error };
}

// Stable Image Component to prevent re-renders
const StableImage: React.FC<{
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  cacheKey: string;
}> = React.memo(({ src, alt, width, height, className, style, cacheKey }) => {
  const { cachedUrl, isLoading, error } = useStableImageUrl(src, cacheKey);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className || ''}`}
        style={{ width, height, ...style }}
      >
        <span className="text-red-500 text-sm">Failed to load</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse ${className || ''}`}
        style={{ width, height, ...style }}
      >
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <Image 
      src={cachedUrl} 
      alt={alt} 
      width={width} 
      height={height} 
      unoptimized 
      className={className}
      style={style}
      key={cacheKey} // Use cache key to prevent re-renders
      priority={false}
      loading="lazy"
    />
  );
});

StableImage.displayName = 'StableImage';

export interface GitHubStatsWidgetConfig extends BaseWidgetConfig {
  username: string;
  showIcons?: boolean;
  includePrivate?: boolean;
  includeAllCommits?: boolean;
  hideBorder?: boolean;
  hideTitle?: boolean;
  layoutType: 'stats' | 'languages' | 'combined' | 'trophies' | 'streaks' | 'full';
  layoutStyle: 'side-by-side' | 'grid' | 'vertical';
  compactMode?: boolean;
  showTrophies?: boolean;
  showStreaks?: boolean;
  showLanguages?: boolean;
  showStats?: boolean;
  hideRank?: boolean;
  customTitle?: string;
  trophyTheme?: 'flat' | 'onedark' | 'gruvbox' | 'dracula' | 'monokai' | 'chalk' | 'nord' | 'alduin' | 'darkhub' | 'juicyfresh' | 'buddhism' | 'oldie' | 'radical' | 'onestar' | 'discord' | 'algolia' | 'gitdimmed' | 'tokyonight';
  streakTheme?: string;
  hideIssues?: boolean;
  hidePRs?: boolean;
}

interface GitHubStatsWidgetProps extends BaseWidgetProps {
  config: GitHubStatsWidgetConfig;
  onConfigChange?: (config: GitHubStatsWidgetConfig) => void;
  onMarkdownGenerated?: (markdown: string) => void;
}

// Helper function to generate stable URLs
function generateUrlsForConfig(config: GitHubStatsWidgetConfig) {
  const effectiveConfig = {
    layoutType: config.layoutType || 'stats',
    layoutStyle: config.layoutStyle || 'side-by-side',
    showTrophies: config.showTrophies ?? (config.layoutType === 'trophies' || config.layoutType === 'full'),
    showStreaks: config.showStreaks ?? (config.layoutType === 'streaks' || config.layoutType === 'full'),
    showStats: config.showStats ?? (['stats', 'combined', 'full'].includes(config.layoutType || ''))
  };

  if (!config.username) {
    return { statsUrl: '', trophyUrl: '', streakUrl: '', effectiveConfig };
  }

  // Generate stats URL
  const statsParams = new URLSearchParams({
    username: config.username,
    theme: config.theme || 'default'
  });
  if (config.hideBorder) statsParams.append('hide_border', 'true');
  if (config.hideTitle) statsParams.append('hide_title', 'true');
  if (config.compactMode) statsParams.append('layout', 'compact');
  if (config.showIcons) statsParams.append('show_icons', 'true');
  if (config.includePrivate) statsParams.append('count_private', 'true');
  if (config.includeAllCommits) statsParams.append('include_all_commits', 'true');
  
  const statsUrl = effectiveConfig.showStats 
    ? `https://github-readme-stats.vercel.app/api?${statsParams.toString()}`
    : '';

  // Generate trophy URL
  const trophyUrl = effectiveConfig.showTrophies
    ? `https://github-profile-trophy.vercel.app/?username=${config.username}&theme=${config.trophyTheme || 'flat'}&margin-w=10&margin-h=10`
    : '';

  // Generate streak URL
  const streakUrl = effectiveConfig.showStreaks
    ? `https://github-readme-streak-stats.herokuapp.com/?user=${config.username}&theme=${config.streakTheme || config.theme || 'default'}&hide_border=${config.hideBorder ? 'true' : 'false'}`
    : '';

  return { statsUrl, trophyUrl, streakUrl, effectiveConfig };
}

// Helper function to generate markdown with config
function generateMarkdownForConfig(config: GitHubStatsWidgetConfig): string {
  if (!config.username) return '';
  
  const { statsUrl, trophyUrl, streakUrl, effectiveConfig } = generateUrlsForConfig(config);
  
  let md = '';
  
  if (!config.hideTitle && config.customTitle) {
    md += `## ${config.customTitle}\n\n`;
  } else if (!config.hideTitle) {
    md += `## GitHub Stats\n\n`;
  }

  if (effectiveConfig.layoutStyle === 'side-by-side') {
    md += `<div align="center">\n\n`;
    md += `<table border="0" cellspacing="10" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n<tr>\n`;
    
    if (effectiveConfig.showStats && statsUrl) {
      md += `<td align="center" valign="top" style="padding: 5px;">\n`;
      md += `<img src="${statsUrl}" alt="GitHub Stats" width="420" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }
    
    if (trophyUrl && effectiveConfig.showTrophies) {
      md += `<td align="center" valign="top" style="padding: 5px;">\n`;
      md += `<img src="${trophyUrl}" alt="GitHub Trophies" width="420" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }
    
    if (streakUrl && effectiveConfig.showStreaks) {
      md += `<td align="center" valign="top" style="padding: 5px;">\n`;
      md += `<img src="${streakUrl}" alt="GitHub Streak" width="420" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }
    
    md += `</tr>\n</table>\n\n</div>\n\n`;
    
  } else if (effectiveConfig.layoutStyle === 'grid') {
    md += `<div align="center">\n\n`;
    md += `<table border="0" cellspacing="20" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n`;
    
    md += `<tr>\n`;
    if (effectiveConfig.showStats && statsUrl) {
      md += `<td align="center" valign="top" style="padding: 10px;">\n`;
      md += `<img src="${statsUrl}" alt="GitHub Stats" width="400" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }
    if (trophyUrl && effectiveConfig.showTrophies) {
      md += `<td align="center" valign="top" style="padding: 10px;">\n`;
      md += `<img src="${trophyUrl}" alt="GitHub Trophies" width="400" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }
    md += `</tr>\n`;
    
    // Second row - Streak spanning full width
    if (streakUrl && effectiveConfig.showStreaks) {
      md += `<tr>\n`;
      const colSpan = (effectiveConfig.showStats && effectiveConfig.showTrophies) ? '2' : '1';
      md += `<td colspan="${colSpan}" align="center" style="padding: 10px;">\n`;
      md += `<img src="${streakUrl}" alt="GitHub Streak" width="800" height="180" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
      md += `</tr>\n`;
    }
    
    md += `</table>\n\n</div>\n\n`;
    
  } else {
    md += `<div align="center">\n\n`;
    
    if (effectiveConfig.showStats && statsUrl) {
      md += `<img src="${statsUrl}" alt="GitHub Stats" width="500" height="195" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
    }
    
    if (trophyUrl && effectiveConfig.showTrophies) {
      md += `<img src="${trophyUrl}" alt="GitHub Trophies" width="500" height="160" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
    }
    
    if (streakUrl && effectiveConfig.showStreaks) {
      md += `<img src="${streakUrl}" alt="GitHub Streak" width="500" height="180" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
    }
    
    md += `</div>\n\n`;
  }
  
  return md;
}

const GitHubStatsWidget: React.FC<GitHubStatsWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [githubData, setGithubData] = useState<any>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoize URLs to prevent unnecessary re-calculations
  const urlsAndConfig = useMemo(() => 
    generateUrlsForConfig(config), [config]);
  
  // Extract values with safe defaults
  const { statsUrl, trophyUrl, streakUrl, effectiveConfig } = urlsAndConfig;

  // Generate stable markdown
  const stableMarkdown = useMemo(() => 
    generateMarkdownForConfig(config), [config]
  );

  // Notify parent of markdown changes with debouncing
  useEffect(() => {
    if (onMarkdownGenerated && stableMarkdown) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        onMarkdownGenerated(stableMarkdown);
      }, 100);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [stableMarkdown, onMarkdownGenerated]);

  // Fetch GitHub data for validation (optional)
  useEffect(() => {
    let isMounted = true;

    const fetchGithubData = async () => {
      if (!config.username) return;
      
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`https://api.github.com/users/${config.username}`);
        if (!response.ok) {
          throw new Error(`GitHub user not found: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (isMounted) {
          setGithubData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchGithubData();

    return () => {
      isMounted = false;
    };
  }, [config.username]);

  const getThemeStyles = () => {
    switch (config.theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 text-white';
      case 'radical':
        return 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white';
      case 'tokyonight':
        return 'bg-gradient-to-r from-blue-800 to-indigo-800 border-blue-600 text-white';
      case 'merko':
        return 'bg-gradient-to-r from-green-800 to-green-600 border-green-700 text-white';
      case 'gruvbox':
        return 'bg-gradient-to-r from-amber-700 to-amber-600 border-amber-500 text-white';
      default: // light
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  // Generate cache keys for stable image loading
  const statsCacheKey = useMemo(() => `stats-${config.username}-${config.theme}-${JSON.stringify(effectiveConfig)}`, [config.username, config.theme, effectiveConfig]);
  const trophyCacheKey = useMemo(() => `trophy-${config.username}-${config.trophyTheme}`, [config.username, config.trophyTheme]);
  const streakCacheKey = useMemo(() => `streak-${config.username}-${config.streakTheme || config.theme}`, [config.username, config.streakTheme, config.theme]);

  return (
    <div className={`github-stats-widget rounded-lg border overflow-hidden ${getThemeStyles()}`}>
      <div className="p-4">
        {!config.hideTitle && (
          <h3 className="text-lg font-medium mb-4 text-center">
            {config.customTitle || 'GitHub Stats'}
          </h3>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <div className="w-full">
            {effectiveConfig.layoutStyle === 'side-by-side' && (
              <div className="flex flex-col xl:flex-row gap-6 justify-center items-center">
                {effectiveConfig.showStats && statsUrl && (
                  <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                    <StableImage 
                      src={statsUrl} 
                      alt="GitHub Stats" 
                      width={420} 
                      height={195} 
                      cacheKey={statsCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                      style={{ maxWidth: '420px', height: 'auto' }}
                    />
                  </div>
                )}
                {trophyUrl && effectiveConfig.showTrophies && (
                  <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                    <StableImage 
                      src={trophyUrl} 
                      alt="GitHub Trophies" 
                      width={420} 
                      height={195} 
                      cacheKey={trophyCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                      style={{ maxWidth: '420px', height: 'auto' }}
                    />
                  </div>
                )}
                {streakUrl && effectiveConfig.showStreaks && (
                  <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                    <StableImage 
                      src={streakUrl} 
                      alt="GitHub Streak" 
                      width={420} 
                      height={195} 
                      cacheKey={streakCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                      style={{ maxWidth: '420px', height: 'auto' }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {effectiveConfig.layoutStyle === 'grid' && (
              <div className="space-y-6">
                {/* First row - Stats and Trophies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {effectiveConfig.showStats && statsUrl && (
                    <div className="flex justify-center">
                      <StableImage 
                        src={statsUrl} 
                        alt="GitHub Stats" 
                        width={400} 
                        height={195} 
                        cacheKey={statsCacheKey}
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                        style={{ maxWidth: '400px', height: 'auto' }}
                      />
                    </div>
                  )}
                  {trophyUrl && effectiveConfig.showTrophies && (
                    <div className="flex justify-center">
                      <StableImage 
                        src={trophyUrl} 
                        alt="GitHub Trophies" 
                        width={400} 
                        height={195} 
                        cacheKey={trophyCacheKey}
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                        style={{ maxWidth: '400px', height: 'auto' }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Second row - Streak spanning full width */}
                {streakUrl && effectiveConfig.showStreaks && (
                  <div className="flex justify-center">
                    <StableImage 
                      src={streakUrl} 
                      alt="GitHub Streak" 
                      width={800} 
                      height={180} 
                      cacheKey={streakCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                      style={{ maxWidth: '800px', height: 'auto' }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {effectiveConfig.layoutStyle === 'vertical' && (
              <div className="flex flex-col gap-6 items-center">
                {effectiveConfig.showStats && statsUrl && (
                  <div className="w-full max-w-lg">
                    <StableImage 
                      src={statsUrl} 
                      alt="GitHub Stats" 
                      width={500} 
                      height={195} 
                      cacheKey={statsCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                    />
                  </div>
                )}
                {trophyUrl && effectiveConfig.showTrophies && (
                  <div className="w-full max-w-lg">
                    <StableImage 
                      src={trophyUrl} 
                      alt="GitHub Trophies" 
                      width={500} 
                      height={160} 
                      cacheKey={trophyCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                    />
                  </div>
                )}
                {streakUrl && effectiveConfig.showStreaks && (
                  <div className="w-full max-w-lg">
                    <StableImage 
                      src={streakUrl} 
                      alt="GitHub Streak" 
                      width={500} 
                      height={180} 
                      cacheKey={streakCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500">
          {effectiveConfig.layoutStyle} layout
        </div>
        <div className="text-xs text-gray-500">
          {config.username ? `@${config.username}` : 'No username set'}
        </div>
      </div>
    </div>
  );
};

// Attach the static markdown generation function to the component
GitHubStatsWidget.generateMarkdown = function() {
  // Return a default markdown when no config is available
  return '## GitHub Stats\n\n<!-- GitHub stats will appear here -->';
};

export default GitHubStatsWidget;