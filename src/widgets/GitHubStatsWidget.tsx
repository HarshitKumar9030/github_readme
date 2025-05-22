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
  const [languagesSvgUrl, setLanguagesSvgUrl] = useState<string>('');  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');
  
  // Set default configuration values
  const effectiveConfig = {
    ...config,
    layoutType: config.layoutType || 'stats',
    layoutStyle: config.layoutStyle || 'side-by-side',
    showTrophies: config.showTrophies ?? (config.layoutType === 'trophies' || config.layoutType === 'full'),
    showStreaks: config.showStreaks ?? (config.layoutType === 'streaks' || config.layoutType === 'full'),
    showLanguages: config.showLanguages ?? (['languages', 'combined', 'full'].includes(config.layoutType || '')),
    showStats: config.showStats ?? (['stats', 'combined', 'full'].includes(config.layoutType || ''))
  };

  // Fetch GitHub stats when username changes
  useEffect(() => {
    async function fetchData() {
      if (!config.username) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api.github.com/users/${config.username}`);
        
        if (!response.ok) {
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
          // Generate SVG URL for stats card with all needed parameters
        const statsParams = new URLSearchParams({
          username: config.username,
          followers: data.followers.toString(),
          following: data.following.toString(),
          repos: data.public_repos.toString(),
          theme: config.theme || 'light'
        });

        if (config.hideBorder) statsParams.append('hideBorder', 'true');
        if (config.hideTitle) statsParams.append('hideTitle', 'true');
        if (config.compactMode) statsParams.append('layout', 'compact');

        const statsApiPath = `/api/github-stats-svg?${statsParams.toString()}`;
        const absoluteStatsUrl = createAbsoluteUrl(statsApiPath);
        setSvgUrl(absoluteStatsUrl);
        
        // Also prepare languages URL if needed
        const languagesUrl = generateLanguagesUrl();
        setLanguagesSvgUrl(languagesUrl);
        
        // Notify parent with markdown when data is fetched
        if (onMarkdownGenerated) {
          setTimeout(() => {
            onMarkdownGenerated(generateMarkdown());
          }, 100);
        }
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [config.username, config.theme]);

  // Generate GitHub Stats URL with parameters for external service
  const generateStatsUrl = () => {
    const params = new URLSearchParams();
    
    if (config.theme) params.append('theme', config.theme);
    if (config.showIcons !== undefined) params.append('show_icons', config.showIcons.toString());
    if (config.includePrivate !== undefined) params.append('count_private', config.includePrivate.toString());
    if (config.includeAllCommits !== undefined) params.append('include_all_commits', config.includeAllCommits.toString());
    if (config.hideBorder !== undefined) params.append('hide_border', config.hideBorder.toString());
    
    return `https://github-readme-stats.vercel.app/api?username=${config.username}&${params.toString()}`;
  };
    // Generate Top Languages URL with parameters
  const generateLanguagesUrl = () => {
    const params = new URLSearchParams();
    
    if (config.theme) params.append('theme', config.theme);
    if (config.hideBorder !== undefined) params.append('hide_border', config.hideBorder.toString());
    if (config.compactMode) params.append('layout', 'compact');
    
    return `https://github-readme-stats.vercel.app/api/top-langs/?username=${config.username}&${params.toString()}`;
  };
  
  // Generate GitHub Trophy URL with parameters
  const generateTrophyUrl = () => {
    const params = new URLSearchParams();
    
    if (config.trophyTheme) params.append('theme', config.trophyTheme);
    if (config.hideBorder !== undefined) params.append('no-frame', config.hideBorder.toString());
    
    return `https://github-profile-trophy.vercel.app/?username=${config.username}&${params.toString()}`;
  };
  
  // Generate GitHub Streak Stats URL with parameters
  const generateStreakUrl = () => {
    const params = new URLSearchParams();
    
    if (config.theme) params.append('theme', config.theme);
    if (config.hideBorder !== undefined) params.append('hide_border', config.hideBorder.toString());
    
    return `https://github-readme-streak-stats.herokuapp.com/?user=${config.username}&${params.toString()}`;
  };
  // Generate markdown for the widget based on layout type
  const generateMarkdown = (): string => {
    // If we don't have a username yet, return empty string
    if (!config.username) return '';
    
    const customCardUrl = svgUrl;
    const statsUrl = generateStatsUrl();
    const languagesUrl = generateLanguagesUrl();
    const trophiesUrl = generateTrophyUrl();
    const streaksUrl = generateStreakUrl();
    
    // Helper function to wrap content in a centered div if needed
    const centerContent = (content: string): string => {
      return `<div align="center">\n\n${content}\n\n</div>`;
    };
    
    switch (config.layoutType) {
      case 'stats':
        return `![GitHub Stats](${customCardUrl || statsUrl})`;
      
      case 'languages':
        return `![Top Languages](${languagesUrl})`;
        
      case 'trophies':
        return `![GitHub Trophies](${trophiesUrl})`;
        
      case 'streaks':
        return `![GitHub Streaks](${streaksUrl})`;
      
      case 'combined':
        if (config.layoutStyle === 'side-by-side') {
          return centerContent(`<table>
<tr>
<td>

![Github Stats](${customCardUrl || statsUrl})

</td>
<td>

![Top Languages](${languagesUrl})

</td>
</tr>
</table>`);
        } else if (config.layoutStyle === 'grid') {
          return centerContent(`<table>
<tr>
<td>

![Github Stats](${customCardUrl || statsUrl})

</td>
<td>

![Top Languages](${languagesUrl})

</td>
</tr>
<tr>
<td colspan="2">

![GitHub Trophies](${trophiesUrl})

</td>
</tr>
<tr>
<td colspan="2">

![GitHub Streaks](${streaksUrl})

</td>
</tr>
</table>`);
        } else {
          // Vertical layout
          return `![GitHub Stats](${customCardUrl || statsUrl})\n\n![Top Languages](${languagesUrl})`;
        }
        
      case 'full':
        return centerContent(`## My GitHub Stats

![GitHub Stats](${customCardUrl || statsUrl})

## My GitHub Streaks

![GitHub Streaks](${streaksUrl})

## My GitHub Trophies

![GitHub Trophies](${trophiesUrl})

## My Most Used Languages

![Top Languages](${languagesUrl})`);
      
      default:
        return `![GitHub Stats](${customCardUrl || statsUrl})`;
    }
  };
  
  // Helper to get theme-based styles
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
  
  // Copy markdown to clipboard
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
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-600 dark:text-red-400">
          Error: {error}. Please check the GitHub username.
        </div>
      ) : !config.username ? (
        <div className="p-4 text-amber-600 dark:text-amber-400">
          Please enter a GitHub username to display stats.
        </div>
      ) : statsData ? (
        <>
            {viewMode === 'preview' ? (
              <div className="space-y-4 p-4">
                {/* User Profile Section */}
                <div className="flex items-center gap-4">
                  {statsData.avatar_url && (
                    <Image
                      src={statsData.avatar_url}
                      alt={`${config.username}'s GitHub avatar`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{statsData.name || config.username}</div>
                    {statsData.bio && (
                      <div className="text-sm opacity-80">{statsData.bio}</div>
                    )}
                  </div>
                </div>
                
                {/* Basic Stats - Always shown */}
                {effectiveConfig.showStats && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">GitHub Stats</h3>
                    <div className="grid grid-cols-3 gap-4 text-center pt-2">
                      <div className="bg-black/10 rounded-lg p-3">
                        <div className="text-xl font-bold">{statsData.repositories}</div>
                        <div className="text-sm opacity-80">Repositories</div>
                      </div>
                      <div className="bg-black/10 rounded-lg p-3">
                        <div className="text-xl font-bold">{statsData.followers}</div>
                        <div className="text-sm opacity-80">Followers</div>
                      </div>
                      <div className="bg-black/10 rounded-lg p-3">
                        <div className="text-xl font-bold">{statsData.following}</div>
                        <div className="text-sm opacity-80">Following</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Layout Preview section */}
                {svgUrl && (effectiveConfig.layoutType === 'combined' || effectiveConfig.layoutType === 'full') && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium mb-2">Widget Preview</h3>
                    
                    {/* Grid Layout */}
                    <div className={`
                      ${effectiveConfig.layoutStyle === 'side-by-side' ? 'flex flex-wrap' : 
                        effectiveConfig.layoutStyle === 'grid' ? 'grid grid-cols-2' : 
                        'flex flex-col'} 
                      gap-4
                    `}>
                      {/* GitHub Stats Card */}
                      {effectiveConfig.showStats && (
                        <div className={`${effectiveConfig.layoutStyle === 'side-by-side' || effectiveConfig.layoutStyle === 'grid' ? 'flex-1 min-w-[45%]' : 'w-full'}`}>
                          <div className="relative overflow-hidden">
                            <div className="text-xs mb-1 opacity-80 font-medium">GitHub Stats</div>
                            <div className="bg-black/5 rounded overflow-hidden">
                              <Image 
                                src={svgUrl}
                                alt="GitHub Stats"
                                width={450} 
                                height={200}
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Top Languages Card */}
                      {effectiveConfig.showLanguages && (
                        <div className={`${effectiveConfig.layoutStyle === 'side-by-side' || effectiveConfig.layoutStyle === 'grid' ? 'flex-1 min-w-[45%]' : 'w-full'}`}>
                          <div className="relative overflow-hidden">
                            <div className="text-xs mb-1 opacity-80 font-medium">Top Languages</div>
                            <div className="bg-black/5 rounded overflow-hidden">
                              <Image 
                                src={languagesSvgUrl || generateLanguagesUrl()}
                                alt="Top Languages"
                                width={450} 
                                height={200}
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Trophies Section */}
                    {effectiveConfig.showTrophies && (
                      <div className="mt-4">
                        <div className="text-xs mb-1 opacity-80 font-medium">GitHub Trophies</div>
                        <div className="bg-black/5 rounded overflow-hidden">
                          <img 
                            src={generateTrophyUrl()}
                            alt="GitHub Trophies"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Streaks Section */}
                    {effectiveConfig.showStreaks && (
                      <div className="mt-4">
                        <div className="text-xs mb-1 opacity-80 font-medium">GitHub Streaks</div>
                        <div className="bg-black/5 rounded overflow-hidden">
                          <img 
                            src={generateStreakUrl()}
                            alt="GitHub Streaks"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800/80 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="whitespace-pre-wrap">{generateMarkdown()}</pre>
                </div>
              </div>
            )}
            
            {/* View toggle button */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {viewMode === 'preview' ? 'Widget Preview' : 'Markdown View'}
              </span>
              <button
                onClick={toggleViewMode}
                className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {viewMode === 'preview' ? 'View Markdown' : 'View Preview'}
              </button>
            </div>
        </>
      ) : null}
    </div>
  );
};

// Attach the markdown generation function to the component
GitHubStatsWidget.generateMarkdown = function() {
  // This is a placeholder - the actual component instance will generate markdown
  return '';
};

export default GitHubStatsWidget;
