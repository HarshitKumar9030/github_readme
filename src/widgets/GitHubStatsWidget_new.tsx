'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createAbsoluteUrl } from '@/utils/urlHelpers';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';

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

interface StatsData {
  followers: number;
  following: number;
  repositories: number;
  avatar_url?: string;
  name?: string;
  bio?: string;
}

interface GitHubStatsWidgetProps extends BaseWidgetProps {
  config: GitHubStatsWidgetConfig;
  onConfigChange?: (config: GitHubStatsWidgetConfig) => void;
}

/**
 * GitHub Stats Widget that can export markdown for README files
 */
const GitHubStatsWidget: React.FC<GitHubStatsWidgetProps> & MarkdownExportable = ({ 
  config, 
  onConfigChange,
  onMarkdownGenerated 
}) => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [trophyUrl, setTrophyUrl] = useState<string>('');
  const [streakUrl, setStreakUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');

  // Set default configuration values (no top languages)
  const effectiveConfig = {
    ...config,
    layoutType: config.layoutType || 'stats',
    layoutStyle: config.layoutStyle || 'side-by-side',
    showTrophies: config.showTrophies ?? (config.layoutType === 'trophies' || config.layoutType === 'full'),
    showStreaks: config.showStreaks ?? (config.layoutType === 'streaks' || config.layoutType === 'full'),
    showStats: config.showStats ?? (['stats', 'combined', 'full'].includes(config.layoutType || ''))
  };

  // Fetch GitHub stats when username changes
  useEffect(() => {
    async function fetchData() {
      if (!config.username) return;
      setLoading(true);
      setError(null);      try {
        // Create headers with GitHub token if available
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-README-Generator'
        };
        
        if (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(`https://api.github.com/users/${config.username}`, { headers });
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(`GitHub API rate limit exceeded. Please try again later or add a GitHub token.`);
          }
          throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
        }
        const data = await response.json();
        setStatsData({
          followers: data.followers,
          following: data.following,
          repositories: data.public_repos,
          avatar_url: data.avatar_url,
          name: data.name,
          bio: data.bio
        });
        // Generate SVG URL for stats card
        const statsParams = new URLSearchParams({
          username: config.username,
          theme: config.theme || 'light'
        });
        if (config.hideBorder) statsParams.append('hide_border', 'true');
        if (config.hideTitle) statsParams.append('hide_title', 'true');
        if (config.compactMode) statsParams.append('layout', 'compact');
        if (config.showIcons) statsParams.append('show_icons', 'true');
        if (config.includePrivate) statsParams.append('count_private', 'true');
        if (config.includeAllCommits) statsParams.append('include_all_commits', 'true');
        setSvgUrl(`https://github-readme-stats.vercel.app/api?${statsParams.toString()}`);
        // Trophy URL
        if (effectiveConfig.showTrophies) {
          setTrophyUrl(`https://github-profile-trophy.vercel.app/?username=${config.username}&theme=${config.trophyTheme || 'flat'}&margin-w=10&margin-h=10`);
        } else {
          setTrophyUrl('');
        }
        // Streak URL
        if (effectiveConfig.showStreaks) {
          setStreakUrl(`https://github-readme-streak-stats.herokuapp.com/?user=${config.username}&theme=${config.streakTheme || config.theme || 'default'}&hide_border=${config.hideBorder ? 'true' : 'false'}`);
        } else {
          setStreakUrl('');
        }
        // Notify parent with markdown when data is fetched
        if (onMarkdownGenerated) {
          setTimeout(() => {
            onMarkdownGenerated(generateMarkdown());
          }, 100);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [config.username, config.theme, config.layoutType, config.layoutStyle, config.showTrophies, config.showStreaks, config.showStats, config.hideBorder, config.hideTitle, config.compactMode, config.showIcons, config.includePrivate, config.includeAllCommits, config.trophyTheme, config.streakTheme]);  // Markdown generation for different layouts
  const generateMarkdown = (): string => {
    if (!config.username) return '';
    let md = '';
    
    if (!config.hideTitle && config.customTitle) {
      md += `## ${config.customTitle}\n\n`;
    } else if (!config.hideTitle) {
      md += `## GitHub Stats\n\n`;
    }

    if (effectiveConfig.layoutStyle === 'side-by-side') {
      md += `<div align="center">\n\n`;
      
      md += `<table border="0" cellspacing="10" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n<tr>\n`;
      
      if (effectiveConfig.showStats && svgUrl) {
        md += `<td align="center" valign="top" style="padding: 5px;">\n`;
        md += `<img src="${svgUrl}" alt="GitHub Stats" width="420" height="195" style="border-radius: 8px;" />\n`;
        md += `</td>\n`;
      }
      
      if (trophyUrl && effectiveConfig.showTrophies) {
        md += `<td align="center" valign="top" style="padding: 5px;">\n`;
        md += `<img src="${trophyUrl}" alt="GitHub Trophies" width="420" height="195" style="border-radius: 8px;" />\n`;
        md += `</td>\n`;
      } else if (streakUrl && effectiveConfig.showStreaks) {
        md += `<td align="center" valign="top" style="padding: 5px;">\n`;
        md += `<img src="${streakUrl}" alt="GitHub Streak" width="420" height="195" style="border-radius: 8px;" />\n`;
        md += `</td>\n`;
      }
      
      md += `</tr>\n</table>\n\n</div>\n\n`;
      
    } else if (effectiveConfig.layoutStyle === 'grid') {
      md += `<div align="center">\n\n`;
      
      md += `<table border="0" cellspacing="20" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n`;
      
      md += `<tr>\n`;
      if (effectiveConfig.showStats && svgUrl) {
        md += `<td align="center" valign="top" style="padding: 10px;">\n`;
        md += `<img src="${svgUrl}" alt="GitHub Stats" width="400" height="195" style="border-radius: 8px;" />\n`;
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
      
      if (effectiveConfig.showStats && svgUrl) {
        md += `<img src="${svgUrl}" alt="GitHub Stats" width="500" height="195" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
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
  };

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
  
  // Toggle between preview and markdown view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'preview' ? 'markdown' : 'preview');
    
    if (viewMode === 'preview' && onMarkdownGenerated) {
      onMarkdownGenerated(generateMarkdown());
    }
  };
  
  const copyMarkdown = () => {
    const markdown = generateMarkdown();
    if (markdown && navigator.clipboard) {
      navigator.clipboard.writeText(markdown)
        .then(() => alert('Markdown copied to clipboard!'))
        .catch(err => {
          console.error('Failed to copy markdown:', err);
          alert('Failed to copy markdown');
        });
    }
  };
    return (
    <div className={`github-stats-widget rounded-lg border overflow-hidden ${getThemeStyles()}`}>
      {viewMode === 'preview' ? (
        <div className="p-4">
          {!config.hideTitle && (
            <h3 className="text-lg font-medium mb-4 text-center">
              {config.customTitle || 'GitHub Stats'}
            </h3>
          )}
          
          {loading ? (
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
                  {effectiveConfig.showStats && svgUrl && (
                    <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                      <Image 
                        src={svgUrl} 
                        alt="GitHub Stats" 
                        width={420} 
                        height={195} 
                        unoptimized 
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                        style={{ maxWidth: '420px', height: 'auto' }}
                      />
                    </div>
                  )}
                  {trophyUrl && effectiveConfig.showTrophies && (
                    <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                      <Image 
                        src={trophyUrl} 
                        alt="GitHub Trophies" 
                        width={420} 
                        height={195} 
                        unoptimized 
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                        style={{ maxWidth: '420px', height: 'auto' }}
                      />
                    </div>
                  )}
                  {!trophyUrl && streakUrl && effectiveConfig.showStreaks && (
                    <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                      <Image 
                        src={streakUrl} 
                        alt="GitHub Streak" 
                        width={420} 
                        height={195} 
                        unoptimized 
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
                    {effectiveConfig.showStats && svgUrl && (
                      <div className="flex justify-center">
                        <Image 
                          src={svgUrl} 
                          alt="GitHub Stats" 
                          width={400} 
                          height={195} 
                          unoptimized 
                          className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                          style={{ maxWidth: '400px', height: 'auto' }}
                        />
                      </div>
                    )}
                    {trophyUrl && effectiveConfig.showTrophies && (
                      <div className="flex justify-center">
                        <Image 
                          src={trophyUrl} 
                          alt="GitHub Trophies" 
                          width={400} 
                          height={195} 
                          unoptimized 
                          className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                          style={{ maxWidth: '400px', height: 'auto' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Second row - Streak spanning full width */}
                  {streakUrl && effectiveConfig.showStreaks && (
                    <div className="flex justify-center">
                      <Image 
                        src={streakUrl} 
                        alt="GitHub Streak" 
                        width={800} 
                        height={180} 
                        unoptimized 
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                        style={{ maxWidth: '800px', height: 'auto' }}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {effectiveConfig.layoutStyle === 'vertical' && (
                <div className="flex flex-col gap-6 items-center">
                  {effectiveConfig.showStats && svgUrl && (
                    <div className="w-full max-w-lg">
                      <Image 
                        src={svgUrl} 
                        alt="GitHub Stats" 
                        width={500} 
                        height={195} 
                        unoptimized 
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                      />
                    </div>
                  )}
                  {trophyUrl && effectiveConfig.showTrophies && (
                    <div className="w-full max-w-lg">
                      <Image 
                        src={trophyUrl} 
                        alt="GitHub Trophies" 
                        width={500} 
                        height={160} 
                        unoptimized 
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                      />
                    </div>
                  )}
                  {streakUrl && effectiveConfig.showStreaks && (
                    <div className="w-full max-w-lg">
                      <Image 
                        src={streakUrl} 
                        alt="GitHub Streak" 
                        width={500} 
                        height={180} 
                        unoptimized 
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs whitespace-pre-wrap w-full overflow-x-auto">
            {generateMarkdown()}
          </pre>
        </div>
      )}
      
      <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500">
          {effectiveConfig.layoutStyle} layout
        </div>
        <button
          className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => setViewMode(viewMode === 'preview' ? 'markdown' : 'preview')}
        >
          {viewMode === 'preview' ? 'View Markdown' : 'View Preview'}
        </button>
      </div>
    </div>
  );
};

// Attach the markdown generation function to the component
GitHubStatsWidget.generateMarkdown = function() {
  // This is a placeholder - the actual component instance will generate markdown
  return '';
};

export default GitHubStatsWidget;
