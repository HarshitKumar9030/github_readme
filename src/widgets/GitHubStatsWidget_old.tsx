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

interface GitHubStatsWidgetProps extends BaseWidgetProps {
  config: GitHubStatsWidgetConfig;
  onConfigChange?: (config: GitHubStatsWidgetConfig) => void;
  onMarkdownGenerated?: (markdown: string) => void;
}

/**
 * Optimized GitHub Stats Widget with unified rendering pattern and useWidget integration
 */
const GitHubStatsWidgetComponent = memo(
  ({ config, onConfigChange, onMarkdownGenerated }: GitHubStatsWidgetProps) => {
    const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');    // Memoize effective config to prevent unnecessary recalculations
    const effectiveConfig = useMemo(
      () => {
        const baseConfig = {
          ...config,
          layoutType: config.layoutType || 'stats',
          layoutStyle: config.layoutStyle || ('side-by-side' as 'side-by-side' | 'grid' | 'vertical'),
        };

        // Determine what to show based on layoutType and explicit settings
        const showTrophies = config.showTrophies ?? (config.layoutType === 'trophies' || config.layoutType === 'full');
        const showStreaks = config.showStreaks ?? (config.layoutType === 'streaks' || config.layoutType === 'full');
        const showStats = config.showStats ?? ['stats', 'combined', 'full'].includes(config.layoutType || 'stats');

        // If nothing is explicitly enabled, enable stats by default
        const finalConfig = {
          ...baseConfig,
          showTrophies,
          showStreaks,
          showStats: showStats || (!showTrophies && !showStreaks),
        };

        console.log('GitHubStatsWidget: Effective config calculated', {
          original: config,
          effective: finalConfig
        });

        return finalConfig;
      },
      [config]
    );// Use the unified widget hook for consistent state management
    const {
      content: urlsContent,
      isLoading,
      error,
      refresh
    } = useWidget(
      useCallback(async () => {
        console.log('GitHubStatsWidget: useWidget callback called', { 
          username: config.username, 
          effectiveConfig,
          showStats: effectiveConfig.showStats,
          showTrophies: effectiveConfig.showTrophies,
          showStreaks: effectiveConfig.showStreaks
        });
        
        if (!config.username || config.username.trim() === '') {
          console.log('GitHubStatsWidget: No username provided, username:', config.username);
          throw new Error('GitHub username is required');
        }

        const trimmedUsername = config.username.trim();
        
        // Validate username format (basic GitHub username validation)
        if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(trimmedUsername)) {
          throw new Error('Invalid GitHub username format');
        }

        try {
          const statsUrl = effectiveConfig.showStats
            ? createGitHubStatsUrl(trimmedUsername, effectiveConfig)
            : '';
          const trophiesUrl = effectiveConfig.showTrophies
            ? createTrophyUrl(trimmedUsername, effectiveConfig)
            : '';
          const streakUrl = effectiveConfig.showStreaks
            ? createStreakUrl(trimmedUsername, effectiveConfig)
            : '';

          console.log('GitHubStatsWidget: Generated URLs', { statsUrl, trophiesUrl, streakUrl });

          return JSON.stringify({
            stats: statsUrl,
            trophies: trophiesUrl,
            streak: streakUrl,
          });
        } catch (urlError) {
          console.error('GitHubStatsWidget: Error generating URLs', urlError);
          throw new Error('Failed to generate GitHub stats URLs');
        }
      }, [config.username, effectiveConfig]),
      [config.username, effectiveConfig],
      { debounceMs: 300 }
    );

    // Parse URLs from content
    const urls = useMemo(() => {
      try {
        const parsedUrls = urlsContent ? JSON.parse(urlsContent) : { stats: '', trophies: '', streak: '' };
        console.log('GitHubStatsWidget: Parsed URLs', parsedUrls);
        return parsedUrls;
      } catch (err) {
        console.error('GitHubStatsWidget: Failed to parse URLs', err);
        return { stats: '', trophies: '', streak: '' };
      }
    }, [urlsContent]);

    // Markdown generation for different layouts
    const generateMarkdown = useCallback((): string => {
      if (!config.username || config.username.trim() === '') {
        return '<!-- GitHub username is required to generate stats -->\n';
      }
      
      if (!urls || ((!urls.stats || urls.stats.trim() === '') && 
                    (!urls.trophies || urls.trophies.trim() === '') && 
                    (!urls.streak || urls.streak.trim() === ''))) {
        return '<!-- No GitHub stats URLs available -->\n';
      }
      
      let md = '';      if (!config.hideTitle && config.customTitle) {
        md += `## ${config.customTitle}\n\n`;
      } else if (!config.hideTitle) {
        md += `## GitHub Stats\n\n`;
      }

      if (effectiveConfig.layoutStyle === 'side-by-side') {
        md += `<div align="center">\n\n`;
        md += `<table border="0" cellspacing="10" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n<tr>\n`;

        if (effectiveConfig.showStats && urls.stats && urls.stats.trim() !== '') {
          md += `<td align="center" valign="top" style="padding: 5px;">\n`;
          md += `<img src="${urls.stats}" alt="GitHub Stats" width="420" height="195" style="border-radius: 8px;" />\n`;
          md += `</td>\n`;
        }

        if (urls.trophies && urls.trophies.trim() !== '' && effectiveConfig.showTrophies) {
          md += `<td align="center" valign="top" style="padding: 5px;">\n`;
          md += `<img src="${urls.trophies}" alt="GitHub Trophies" width="420" height="195" style="border-radius: 8px;" />\n`;
          md += `</td>\n`;
        }

        if (urls.streak && urls.streak.trim() !== '' && effectiveConfig.showStreaks) {
          md += `<td align="center" valign="top" style="padding: 5px;">\n`;
          md += `<img src="${urls.streak}" alt="GitHub Streak" width="420" height="195" style="border-radius: 8px;" />\n`;
          md += `</td>\n`;
        }

        md += `</tr>\n</table>\n\n</div>\n\n`;
      } else if (effectiveConfig.layoutStyle === 'grid') {
        md += `<div align="center">\n\n`;
        md += `<table border="0" cellspacing="20" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n`;
        md += `<tr>\n`;
        
        if (effectiveConfig.showStats && urls.stats && urls.stats.trim() !== '') {
          md += `<td align="center" valign="top" style="padding: 10px;">\n`;
          md += `<img src="${urls.stats}" alt="GitHub Stats" width="400" height="195" style="border-radius: 8px;" />\n`;
          md += `</td>\n`;
        }
        if (urls.trophies && urls.trophies.trim() !== '' && effectiveConfig.showTrophies) {
          md += `<td align="center" valign="top" style="padding: 10px;">\n`;
          md += `<img src="${urls.trophies}" alt="GitHub Trophies" width="400" height="195" style="border-radius: 8px;" />\n`;
          md += `</td>\n`;
        }
        md += `</tr>\n`;

        if (urls.streak && urls.streak.trim() !== '' && effectiveConfig.showStreaks) {
          md += `<tr>\n`;
          const colSpan = effectiveConfig.showStats && effectiveConfig.showTrophies ? '2' : '1';
          md += `<td colspan="${colSpan}" align="center" style="padding: 10px;">\n`;
          md += `<img src="${urls.streak}" alt="GitHub Streak" width="800" height="180" style="border-radius: 8px;" />\n`;
          md += `</td>\n`;
          md += `</tr>\n`;
        }

        md += `</table>\n\n</div>\n\n`;
      } else {
        md += `<div align="center">\n\n`;

        if (effectiveConfig.showStats && urls.stats && urls.stats.trim() !== '') {
          md += `<img src="${urls.stats}" alt="GitHub Stats" width="500" height="195" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
        }

        if (urls.trophies && urls.trophies.trim() !== '' && effectiveConfig.showTrophies) {
          md += `<img src="${urls.trophies}" alt="GitHub Trophies" width="500" height="160" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
        }

        if (urls.streak && urls.streak.trim() !== '' && effectiveConfig.showStreaks) {
          md += `<img src="${urls.streak}" alt="GitHub Streak" width="500" height="180" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
        }

        md += `</div>\n\n`;
      }

      return md;
    }, [
      config.username,
      config.hideTitle,
      config.customTitle,
      effectiveConfig.layoutStyle,
      effectiveConfig.showStats,
      effectiveConfig.showTrophies,
      effectiveConfig.showStreaks,
      urls,
    ]);

    useEffect(() => {
      if (onMarkdownGenerated && !isLoading && !error && urls) {
        const markdown = generateMarkdown();
        onMarkdownGenerated(markdown);
      }
    }, [generateMarkdown, onMarkdownGenerated, isLoading, error, urls]);

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
        default:
          return 'bg-white border-gray-200 text-gray-900';
      }
    };

    return (
      <WidgetContainer
        widgetId={`github-stats-${config.username}`}
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        className={`github-stats-widget rounded-lg border overflow-hidden ${getThemeStyles()}`}
      >
        {viewMode === 'preview' ? (
          <div className="p-4">
            {!config.hideTitle && (
              <h3 className="text-lg font-medium mb-4 text-center">
                {config.customTitle || 'GitHub Stats'}
              </h3>
            )}
            
            <div className="w-full">
              {(() => {
                console.log('GitHubStatsWidget: Rendering layout', {
                  layoutStyle: effectiveConfig.layoutStyle,
                  showStats: effectiveConfig.showStats,
                  hasStats: Boolean(urls?.stats && urls.stats.trim() !== ''),
                  showTrophies: effectiveConfig.showTrophies,
                  hasTrophies: Boolean(urls?.trophies && urls.trophies.trim() !== ''),
                  showStreaks: effectiveConfig.showStreaks,
                  hasStreaks: Boolean(urls?.streak && urls.streak.trim() !== ''),
                  username: config.username
                });
                return null;
              })()}
                {/* If nothing to show, display a message */}
              {(!urls?.stats || urls.stats.trim() === '') && 
               (!urls?.trophies || urls.trophies.trim() === '') && 
               (!urls?.streak || urls.streak.trim() === '') && (
                <div className="text-center py-8 text-gray-500">
                  {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      <h4 className="font-medium mb-2">Configuration Error</h4>
                      <p className="text-sm">{error}</p>                      {config.username && (
                        <p className="text-xs mt-2 text-gray-600">
                          Current username: &quot;{config.username}&quot;
                        </p>
                      )}
                    </div>
                  ) : !config.username || config.username.trim() === '' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                      <h4 className="font-medium mb-2">Username Required</h4>
                      <p className="text-sm">Please enter your GitHub username to display stats.</p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
                      <h4 className="font-medium mb-2">Loading GitHub Stats...</h4>
                      <p className="text-sm">Username: {config.username}</p>
                    </div>
                  )}
                </div>
              )}
              {effectiveConfig.layoutStyle === 'side-by-side' && (
                <>
                  {console.log('GitHubStatsWidget: Rendering side-by-side layout', { 
                    showStats: effectiveConfig.showStats,
                    hasStats: Boolean(urls?.stats && urls.stats.trim() !== ''),
                    showTrophies: effectiveConfig.showTrophies,
                    hasTrophies: Boolean(urls?.trophies && urls.trophies.trim() !== ''),
                    showStreaks: effectiveConfig.showStreaks,
                    hasStreaks: Boolean(urls?.streak && urls.streak.trim() !== ''),
                    urls
                  })}
                  <div className="flex flex-col xl:flex-row gap-6 justify-center items-center">                    {effectiveConfig.showStats && urls?.stats && urls.stats.trim() !== '' && (
                      <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                        <Image
                          src={urls.stats}
                          alt="GitHub Stats"
                          width={420}
                          height={195}
                          unoptimized
                          priority={false}
                          className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                          style={{ maxWidth: '420px', height: 'auto' }}
                          onError={(e) => {
                            console.error('Failed to load GitHub stats image:', urls.stats);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    {urls?.trophies && urls.trophies.trim() !== '' && effectiveConfig.showTrophies && (
                      <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                        <Image
                          src={urls.trophies}
                          alt="GitHub Trophies"
                          width={420}
                          height={195}
                          unoptimized
                          className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                          style={{ maxWidth: '420px', height: 'auto' }}
                        />
                      </div>
                    )}                    {urls?.streak && urls.streak.trim() !== '' && effectiveConfig.showStreaks && (
                      <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                        <Image
                          src={urls.streak}
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
                </>
              )}

              {effectiveConfig.layoutStyle === 'grid' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {effectiveConfig.showStats && urls?.stats && urls.stats.trim() !== '' && (
                      <div className="flex justify-center">
                        <Image
                          src={urls.stats}
                          alt="GitHub Stats"
                          width={400}
                          height={195}
                          unoptimized
                          className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                          style={{ maxWidth: '400px', height: 'auto' }}
                        />
                      </div>
                    )}
                    {urls?.trophies && urls.trophies.trim() !== '' && effectiveConfig.showTrophies && (
                      <div className="flex justify-center">
                        <Image
                          src={urls.trophies}
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
                  {urls?.streak && urls.streak.trim() !== '' && effectiveConfig.showStreaks && (
                    <div className="flex justify-center">
                      <Image
                        src={urls.streak}
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
                  {effectiveConfig.showStats && urls?.stats && urls.stats.trim() !== '' && (
                    <div className="w-full max-w-lg">
                      <Image
                        src={urls.stats}
                        alt="GitHub Stats"
                        width={500}
                        height={195}
                        unoptimized
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                  {urls?.trophies && urls.trophies.trim() !== '' && effectiveConfig.showTrophies && (
                    <div className="w-full max-w-lg">
                      <Image
                        src={urls.trophies}
                        alt="GitHub Trophies"
                        width={500}
                        height={160}
                        unoptimized
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                  {urls?.streak && urls.streak.trim() !== '' && effectiveConfig.showStreaks && (
                    <div className="w-full max-w-lg">
                      <Image
                        src={urls.streak}
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
          </div>
        ) : (
          <div className="p-4">
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs whitespace-pre-wrap w-full overflow-x-auto">
              {generateMarkdown()}
            </pre>
          </div>
        )}

        <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500">{effectiveConfig.layoutStyle} layout</div>
          <button
            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => setViewMode(viewMode === 'preview' ? 'markdown' : 'preview')}
          >
            {viewMode === 'preview' ? 'View Markdown' : 'View Preview'}
          </button>
        </div>
      </WidgetContainer>
    );
  }
);

GitHubStatsWidgetComponent.displayName = 'GitHubStatsWidget';

const GitHubStatsWidget = GitHubStatsWidgetComponent as unknown as React.FC<GitHubStatsWidgetProps> & MarkdownExportable;

GitHubStatsWidget.generateMarkdown = function() {
  return ''
};

export default GitHubStatsWidget;
