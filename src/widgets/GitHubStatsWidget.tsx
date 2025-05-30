"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  BaseWidgetConfig,
  BaseWidgetProps,
  MarkdownExportable,
} from "@/interfaces/MarkdownExportable";
import StableImage from "@/components/StableImage";
import { useGithubStatsStore, generateUrlsForConfig } from "@/stores/githubStatsStore";

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

const GitHubStatsWidget: React.FC<GitHubStatsWidgetProps> &
  MarkdownExportable = ({ config, onMarkdownGenerated }) => {
    const {
    isLoading,
    error,
    generateMarkdown
  } = useGithubStatsStore();

  // Track mounting state to prevent hydration mismatches
  const [mounted, setMounted] = useState(false);
  
  // Use ref to store callback and prevent re-renders
  const onMarkdownGeneratedRef = useRef(onMarkdownGenerated);
  
  // Update ref when callback changes but don't trigger re-renders
  useEffect(() => {
    onMarkdownGeneratedRef.current = onMarkdownGenerated;
  }, [onMarkdownGenerated]);

  // Mount effect - only runs once
  useEffect(() => {
    console.log('GitHubStatsWidget: Mounting');
    setMounted(true);
  }, []);

  // Generate URLs and effective config - memoized properly
  const { statsUrl, trophyUrl, streakUrl, effectiveConfig } = useMemo(() => {
    console.log('GitHubStatsWidget: Regenerating URLs for config:', config.username);
    return generateUrlsForConfig(config);
  }, [config]);

  // Generate cache keys for images
  const statsCacheKey = useMemo(
    () => `stats-${config.username}-${config.theme}-${config.layoutType}-${config.showIcons}-${config.hideBorder}`,
    [config.username, config.theme, config.layoutType, config.showIcons, config.hideBorder]
  );
  
  const trophyCacheKey = useMemo(
    () => `trophy-${config.username}-${config.trophyTheme}`,
    [config.username, config.trophyTheme]
  );
  
  const streakCacheKey = useMemo(
    () => `streak-${config.username}-${config.streakTheme || config.theme}`,
    [config.username, config.streakTheme, config.theme]
  );  // Fetch GitHub data when username changes - stabilized
  useEffect(() => {
    if (mounted && config.username && config.username.trim()) {
      console.log('GitHubStatsWidget: Fetching data for username:', config.username);
      // Call fetchGithubData directly from store to avoid dependency issues
      const { fetchGithubData: storeFetchGithubData } = useGithubStatsStore.getState();
      storeFetchGithubData(config.username);
    }
  }, [mounted, config.username]); // Remove fetchGithubData dependency// Generate and emit markdown when config changes - using ref to avoid dependencies
  useEffect(() => {
    if (mounted && onMarkdownGeneratedRef.current) {
      console.log('GitHubStatsWidget: Generating markdown');
      // Call generateMarkdown directly from store to avoid dependency issues
      const { generateMarkdown: storeGenerateMarkdown } = useGithubStatsStore.getState();
      const markdown = storeGenerateMarkdown(config);
      onMarkdownGeneratedRef.current(markdown);
    }
  }, [mounted, config]); // Remove generateMarkdown dependency

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
    }  };

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <div className={`github-stats-widget rounded-lg border overflow-hidden ${getThemeStyles()}`}>
        <div className="p-4">
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500">Loading...</div>
          <div className="text-xs text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`github-stats-widget rounded-lg border overflow-hidden ${getThemeStyles()}`}>
      <div className="p-4">
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
  return "## GitHub Stats\n\n<!-- GitHub stats will appear here -->";
};

export default GitHubStatsWidget;
