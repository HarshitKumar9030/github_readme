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
  layoutType: 'stats' | 'languages' | 'combined';
  compactMode?: boolean;
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
  const [languagesSvgUrl, setLanguagesSvgUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');

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

  // Generate markdown for the widget based on layout type
  const generateMarkdown = (): string => {
    // If we don't have a username yet, return empty string
    if (!config.username) return '';
    
    const customCardUrl = svgUrl;
    const statsUrl = generateStatsUrl();
    const languagesUrl = generateLanguagesUrl();
    
    switch (config.layoutType) {
      case 'stats':
        return `![GitHub Stats](${customCardUrl || statsUrl})`;
      
      case 'languages':
        return `![Top Languages](${languagesUrl})`;
      
      case 'combined':
        return `<div align="center">

<table>
<tr>
<td>

![Github Stats](${customCardUrl || statsUrl})

</td>
<td>

![Top Languages](${languagesUrl})

</td>
</tr>
</table>

</div>`;
      
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
    <div className={`rounded-xl shadow-lg overflow-hidden border ${getThemeStyles()}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">GitHub Statistics</h3>
          <div className="flex gap-2">
            <button
              onClick={toggleViewMode}
              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {viewMode === 'preview' ? 'Show Markdown' : 'Show Preview'}
            </button>
            {viewMode === 'markdown' && (
              <button
                onClick={copyMarkdown}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Copy Markdown
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4">
            {error}
          </div>
        )}

        {!loading && !error && statsData && (
          <>
            {viewMode === 'preview' ? (
              <div className="space-y-4">
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
                
                {config.layoutType === 'combined' && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm mb-2">Layout Preview: Combined Stats & Languages</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <div className="text-xs mb-1 opacity-80">GitHub Stats</div>
                        <div className="bg-black/10 h-24 rounded flex items-center justify-center">
                          Preview Stats
                        </div>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <div className="text-xs mb-1 opacity-80">Top Languages</div>
                        <div className="bg-black/10 h-24 rounded flex items-center justify-center">
                          Preview Languages
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-black/5 p-3 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs"><code>{generateMarkdown()}</code></pre>
                </div>
                
                {svgUrl && (
                  <div>
                    <p className="text-xs mb-2 opacity-80">Preview:</p>
                    {config.layoutType === 'stats' && (
                      <Image
                        src={svgUrl}
                        alt="GitHub Stats"
                        width={495}
                        height={195}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        unoptimized
                        priority
                        className="rounded-md border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    
                    {config.layoutType === 'languages' && languagesSvgUrl && (
                      <Image
                        src={languagesSvgUrl}
                        alt="Top Languages"
                        width={350}
                        height={165}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        unoptimized
                        priority
                        className="rounded-md border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    
                    {config.layoutType === 'combined' && (
                      <div className="space-y-2">
                        <Image
                          src={svgUrl}
                          alt="GitHub Stats"
                          width={495}
                          height={195}
                          style={{ maxWidth: '100%', height: 'auto' }}
                          unoptimized
                          priority
                          className="rounded-md border border-gray-200 dark:border-gray-700"
                        />
                        <Image
                          src={languagesSvgUrl}
                          alt="Top Languages"
                          width={350}
                          height={165}
                          style={{ maxWidth: '100%', height: 'auto' }}
                          unoptimized
                          priority
                          className="rounded-md border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!config.username && (
          <div className="text-center p-8">
            <p className="text-sm opacity-70">
              Enter a GitHub username in settings to display stats
            </p>
          </div>
        )}
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
