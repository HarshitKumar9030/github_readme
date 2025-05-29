"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BaseWidgetConfig,
  BaseWidgetProps,
  MarkdownExportable,
} from "@/interfaces/MarkdownExportable";
import StableImage from "@/components/StableImage";

export interface GitHubStatsWidgetConfig extends BaseWidgetConfig {
  username: string;
  showIcons?: boolean;
  includePrivate?: boolean;
  includeAllCommits?: boolean;
  hideBorder?: boolean;
  hideTitle?: boolean;
  layoutType:
    | "stats"
    | "languages"
    | "combined"
    | "trophies"
    | "streaks"
    | "full";
  layoutStyle: "side-by-side" | "grid" | "vertical";
  compactMode?: boolean;
  showTrophies?: boolean;
  showStreaks?: boolean;
  showLanguages?: boolean;
  showStats?: boolean;
  hideRank?: boolean;
  customTitle?: string;
  trophyTheme?:
    | "flat"
    | "onedark"
    | "gruvbox"
    | "dracula"
    | "monokai"
    | "chalk"
    | "nord"
    | "alduin"
    | "darkhub"
    | "juicyfresh"
    | "buddhism"
    | "oldie"
    | "radical"
    | "onestar"
    | "discord"
    | "algolia"
    | "gitdimmed"
    | "tokyonight";
  streakTheme?: string;
  hideIssues?: boolean;
  hidePRs?: boolean;
}

interface GitHubStatsWidgetProps extends BaseWidgetProps {
  config: GitHubStatsWidgetConfig;
  onConfigChange?: (config: GitHubStatsWidgetConfig) => void;
  onMarkdownGenerated?: (markdown: string) => void;
}

function generateUrlsForConfig(config: GitHubStatsWidgetConfig) {
  const effectiveConfig = {
    layoutType: config.layoutType || "stats",
    layoutStyle: config.layoutStyle || "side-by-side",
    showTrophies:
      config.showTrophies ??
      (config.layoutType === "trophies" || config.layoutType === "full"),
    showStreaks:
      config.showStreaks ??
      (config.layoutType === "streaks" || config.layoutType === "full"),
    showStats:
      config.showStats ??
      ["stats", "combined", "full"].includes(config.layoutType || ""),
  };

  if (!config.username) {
    return { statsUrl: "", trophyUrl: "", streakUrl: "", effectiveConfig };
  }

  // stats
  const statsParams = new URLSearchParams({
    username: config.username,
    theme: config.theme || "default",
  });
  if (config.hideBorder) statsParams.append("hide_border", "true");
  if (config.hideTitle) statsParams.append("hide_title", "true");
  if (config.compactMode) statsParams.append("layout", "compact");
  if (config.showIcons) statsParams.append("show_icons", "true");
  if (config.includePrivate) statsParams.append("count_private", "true");
  if (config.includeAllCommits)
    statsParams.append("include_all_commits", "true");

  const statsUrl = effectiveConfig.showStats
    ? `https://github-readme-stats.vercel.app/api?${statsParams.toString()}`
    : "";

  const trophyUrl = effectiveConfig.showTrophies
    ? `https://github-profile-trophy.vercel.app/?username=${
        config.username
      }&theme=${config.trophyTheme || "flat"}&margin-w=10&margin-h=10`
    : "";

  const streakUrl = effectiveConfig.showStreaks
    ? `https://github-readme-streak-stats.herokuapp.com/?user=${
        config.username
      }&theme=${config.streakTheme || config.theme || "default"}&hide_border=${
        config.hideBorder ? "true" : "false"
      }`
    : "";

  return { statsUrl, trophyUrl, streakUrl, effectiveConfig };
}

// Helper function to generate markdown with config
function generateMarkdownForConfig(config: GitHubStatsWidgetConfig): string {
  if (!config.username) return "";

  const { statsUrl, trophyUrl, streakUrl, effectiveConfig } =
    generateUrlsForConfig(config);

  let md = "";

  if (!config.hideTitle && config.customTitle) {
    md += `## ${config.customTitle}\n\n`;
  } else if (!config.hideTitle) {
    md += `## GitHub Stats\n\n`;
  }

  if (effectiveConfig.layoutStyle === "side-by-side") {
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
  } else if (effectiveConfig.layoutStyle === "grid") {
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

    if (streakUrl && effectiveConfig.showStreaks) {
      md += `<tr>\n`;
      const colSpan =
        effectiveConfig.showStats && effectiveConfig.showTrophies ? "2" : "1";
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

const GitHubStatsWidget: React.FC<GitHubStatsWidgetProps> &
  MarkdownExportable = ({ config, onConfigChange, onMarkdownGenerated }) => {  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [githubData, setGithubData] = useState<any>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const apiCallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedUsernameRef = useRef<string>("");
  const githubDataCacheRef = useRef<{ [key: string]: { data: any; timestamp: number } }>({});

  // Create stable dependencies to prevent unnecessary re-renders
  const stableDeps = useMemo(() => ({
    username: config.username,
    theme: config.theme,
    layoutType: config.layoutType,
    layoutStyle: config.layoutStyle,
    showIcons: config.showIcons,
    includePrivate: config.includePrivate,
    includeAllCommits: config.includeAllCommits,
    hideBorder: config.hideBorder,
    hideTitle: config.hideTitle,
    compactMode: config.compactMode,
    showTrophies: config.showTrophies,
    showStreaks: config.showStreaks,
    showStats: config.showStats,
    hideRank: config.hideRank,
    customTitle: config.customTitle,
    trophyTheme: config.trophyTheme,
    streakTheme: config.streakTheme
  }), [
    config.username,
    config.theme,
    config.layoutType,
    config.layoutStyle,
    config.showIcons,
    config.includePrivate,
    config.includeAllCommits,
    config.hideBorder,
    config.hideTitle,
    config.compactMode,
    config.showTrophies,
    config.showStreaks,
    config.showStats,
    config.hideRank,
    config.customTitle,
    config.trophyTheme,
    config.streakTheme
  ]);

  // Memoize URLs to prevent unnecessary re-calculations
  const urlsAndConfig = useMemo(() => generateUrlsForConfig(stableDeps as GitHubStatsWidgetConfig), [stableDeps]);

  const { statsUrl, trophyUrl, streakUrl, effectiveConfig } = urlsAndConfig;

  // Generate stable markdown
  const stableMarkdown = useMemo(
    () => generateMarkdownForConfig(stableDeps as GitHubStatsWidgetConfig),
    [stableDeps]
  );

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
    };  }, [stableMarkdown, onMarkdownGenerated]);

  useEffect(() => {
    let isMounted = true;

    if (apiCallTimeoutRef.current) {
      clearTimeout(apiCallTimeoutRef.current);
    }

    const fetchGithubData = async () => {
      if (!stableDeps.username) {
        setGithubData(null);
        setError("");
        setIsLoading(false);
        return;
      }

      if (lastFetchedUsernameRef.current === stableDeps.username) {
        return;
      }

      const cached = githubDataCacheRef.current[stableDeps.username];
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        if (isMounted) {
          setGithubData(cached.data);
          setError("");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError("");
      lastFetchedUsernameRef.current = stableDeps.username;      try {
        // Create headers with GitHub token if available
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-README-Generator'
        };
        
        // Add authorization header if token is available (client-side won't have access to process.env)
        // This will primarily work in server-side contexts
        if (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(
          `https://api.github.com/users/${stableDeps.username}`,
          { headers }
        );
        if (!response.ok) {
          // Enhanced error handling for rate limiting
          if (response.status === 429) {
            throw new Error(`GitHub API rate limit exceeded. Please try again later or add a GitHub token.`);
          }
          throw new Error(`GitHub user not found: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache the result
        githubDataCacheRef.current[stableDeps.username] = {
          data,
          timestamp: Date.now()
        };

        if (isMounted) {
          setGithubData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch GitHub data"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    apiCallTimeoutRef.current = setTimeout(fetchGithubData, 500);

    return () => {
      isMounted = false;
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
    };
  }, [stableDeps.username]);

  const getThemeStyles = () => {
    switch (config.theme) {
      case "dark":
        return "bg-gray-800 border-gray-700 text-white";
      case "radical":
        return "bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white";
      case "tokyonight":
        return "bg-gradient-to-r from-blue-800 to-indigo-800 border-blue-600 text-white";
      case "merko":
        return "bg-gradient-to-r from-green-800 to-green-600 border-green-700 text-white";
      case "gruvbox":
        return "bg-gradient-to-r from-amber-700 to-amber-600 border-amber-500 text-white";
      default: // light
        return "bg-white border-gray-200 text-gray-900";
    }
  };
  const statsCacheKey = useMemo(
    () => `stats-${stableDeps.username}-${stableDeps.theme}-${stableDeps.layoutType}-${stableDeps.showIcons}-${stableDeps.hideBorder}`,
    [stableDeps.username, stableDeps.theme, stableDeps.layoutType, stableDeps.showIcons, stableDeps.hideBorder]
  );
  const trophyCacheKey = useMemo(
    () => `trophy-${stableDeps.username}-${stableDeps.trophyTheme}`,
    [stableDeps.username, stableDeps.trophyTheme]
  );
  const streakCacheKey = useMemo(
    () => `streak-${stableDeps.username}-${stableDeps.streakTheme || stableDeps.theme}`,
    [stableDeps.username, stableDeps.streakTheme, stableDeps.theme]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`github-stats-widget rounded-lg border overflow-hidden ${getThemeStyles()}`}
    >
      <div className="p-4">
        {!config.hideTitle && (
          <h3 className="text-lg font-medium mb-4 text-center">
            {config.customTitle || "GitHub Stats"}
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
            {effectiveConfig.layoutStyle === "side-by-side" && (
              <div className="flex flex-col xl:flex-row gap-6 justify-center items-center">
                {" "}
                {effectiveConfig.showStats && statsUrl && (
                  <div className="flex-shrink-0 w-full max-w-md xl:max-w-none">
                    <StableImage
                      src={statsUrl}
                      alt="GitHub Stats"
                      width={420}
                      height={195}
                      cacheKey={statsCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                      style={{ maxWidth: "420px", height: "auto" }}
                      fallbackText="Stats unavailable"
                      loadingText="Loading stats..."
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
                      style={{ maxWidth: "420px", height: "auto" }}
                      fallbackText="Trophies unavailable"
                      loadingText="Loading trophies..."
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
                      style={{ maxWidth: "420px", height: "auto" }}
                      fallbackText="Streak unavailable"
                      loadingText="Loading streak..."
                    />
                  </div>
                )}
              </div>
            )}

            {effectiveConfig.layoutStyle === "grid" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {" "}
                  {effectiveConfig.showStats && statsUrl && (
                    <div className="flex justify-center">
                      <StableImage
                        src={statsUrl}
                        alt="GitHub Stats"
                        width={400}
                        height={195}
                        cacheKey={statsCacheKey}
                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                        style={{ maxWidth: "400px", height: "auto" }}
                        fallbackText="Stats unavailable"
                        loadingText="Loading stats..."
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
                        style={{ maxWidth: "400px", height: "auto" }}
                        fallbackText="Trophies unavailable"
                        loadingText="Loading trophies..."
                      />
                    </div>
                  )}
                </div>

                {streakUrl && effectiveConfig.showStreaks && (
                  <div className="flex justify-center">
                    <StableImage
                      src={streakUrl}
                      alt="GitHub Streak"
                      width={800}
                      height={180}
                      cacheKey={streakCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                      style={{ maxWidth: "800px", height: "auto" }}
                      fallbackText="Streak unavailable"
                      loadingText="Loading streak..."
                    />
                  </div>
                )}
              </div>
            )}

            {effectiveConfig.layoutStyle === "vertical" && (
              <div className="flex flex-col gap-6 items-center">
                {" "}
                {effectiveConfig.showStats && statsUrl && (
                  <div className="w-full max-w-lg">
                    <StableImage
                      src={statsUrl}
                      alt="GitHub Stats"
                      width={500}
                      height={195}
                      cacheKey={statsCacheKey}
                      className="w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                      fallbackText="Stats unavailable"
                      loadingText="Loading stats..."
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
                      fallbackText="Trophies unavailable"
                      loadingText="Loading trophies..."
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
                      fallbackText="Streak unavailable"
                      loadingText="Loading streak..."
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
          {config.username ? `@${config.username}` : "No username set"}
        </div>
      </div>
    </div>
  );
};

GitHubStatsWidget.generateMarkdown = function () {
  // Return a default markdown when no config is available
  return "## GitHub Stats\n\n<!-- GitHub stats will appear here -->";
};

export default GitHubStatsWidget;
