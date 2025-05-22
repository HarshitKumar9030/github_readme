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
  }, [config.username, config.theme, config.layoutType, config.layoutStyle, config.showTrophies, config.showStreaks, config.showStats, config.hideBorder, config.hideTitle, config.compactMode, config.showIcons, config.includePrivate, config.includeAllCommits, config.trophyTheme, config.streakTheme]);

  // Markdown generation for different layouts
  const generateMarkdown = () => {
    if (!config.username) return '';
    let md = '';
    // Title
    if (!config.hideTitle && config.customTitle) {
      md += `## ${config.customTitle}\n\n`;
    } else if (!config.hideTitle) {
      md += `## GitHub Stats\n\n`;
    }
    // Layouts
    if (effectiveConfig.layoutStyle === 'side-by-side') {
      md += `<div align="center">\n\n<table>\n<tr>\n<td>\n\n`;
      md += `![GitHub Stats](${svgUrl})\n\n`;
      md += `</td>\n`;
      if (trophyUrl) {
        md += `<td>\n\n![Trophies](${trophyUrl})\n\n</td>\n`;
      } else if (streakUrl) {
        md += `<td>\n\n![Streak](${streakUrl})\n\n</td>\n`;
      }
      md += `</tr>\n</table>\n\n</div>\n`;
    } else if (effectiveConfig.layoutStyle === 'grid') {
      md += `<div align="center">\n\n<table>\n<tr>\n<td>\n\n`;
      md += `![GitHub Stats](${svgUrl})\n\n`;
      md += `</td>\n`;
      if (trophyUrl) {
        md += `<td>\n\n![Trophies](${trophyUrl})\n\n</td>\n`;
      }
      md += `</tr>\n<tr>\n`;
      if (streakUrl) {
        md += `<td colspan=2>\n\n![Streak](${streakUrl})\n\n</td>\n`;
      }
      md += `</tr>\n</table>\n\n</div>\n`;
    } else {
      // vertical or fallback
      md += `<div align="center">\n\n`;
      md += `![GitHub Stats](${svgUrl})\n\n`;
      if (trophyUrl) md += `![Trophies](${trophyUrl})\n\n`;
      if (streakUrl) md += `![Streak](${streakUrl})\n\n`;
      md += `</div>\n`;
    }
    return md;
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
      {viewMode === 'preview' ? (
        <div className="flex flex-col items-center w-full">
          {!config.hideTitle && <h3 className="text-lg font-medium mb-2">{config.customTitle || 'GitHub Stats'}</h3>}
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              {effectiveConfig.layoutStyle === 'side-by-side' && (
                <div className="flex flex-row gap-4 justify-center items-start w-full">
                  <Image src={svgUrl} alt="GitHub Stats" width={400} height={200} unoptimized className="max-w-xs w-full" />
                  {trophyUrl ? (
                    <Image src={trophyUrl} alt="Trophies" width={400} height={200} unoptimized className="max-w-xs w-full" />
                  ) : streakUrl ? (
                    <Image src={streakUrl} alt="Streak" width={400} height={200} unoptimized className="max-w-xs w-full" />
                  ) : null}
                </div>
              )}
              {effectiveConfig.layoutStyle === 'grid' && (
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Image src={svgUrl} alt="GitHub Stats" width={400} height={200} unoptimized className="w-full" />
                  {trophyUrl && <Image src={trophyUrl} alt="Trophies" width={400} height={200} unoptimized className="w-full" />}
                  {streakUrl && <Image src={streakUrl} alt="Streak" width={800} height={200} unoptimized className="col-span-2 w-full" />}
                </div>
              )}
              {effectiveConfig.layoutStyle === 'vertical' && (
                <div className="flex flex-col gap-4 items-center w-full">
                  <Image src={svgUrl} alt="GitHub Stats" width={600} height={200} unoptimized className="w-full max-w-lg" />
                  {trophyUrl && <Image src={trophyUrl} alt="Trophies" width={600} height={200} unoptimized className="w-full max-w-lg" />}
                  {streakUrl && <Image src={streakUrl} alt="Streak" width={600} height={200} unoptimized className="w-full max-w-lg" />}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs whitespace-pre-wrap w-full">{generateMarkdown()}</pre>
      )}
      <div className="flex justify-end mt-2">
        <button
          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
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
