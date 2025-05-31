"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { createAbsoluteUrl } from "@/utils/urlHelpers";
import {
  BaseWidgetConfig,
  BaseWidgetProps,
  MarkdownExportable,
} from "@/interfaces/MarkdownExportable";
import { Socials } from "@/interfaces/Socials";
import { useSocialStatsStore } from "@/stores/socialStatsStore";

// Social stats interface
export interface SocialStats {
  github?: {
    followers: number;
    following: number;
    repositories: number;
    avatar?: string;
    name?: string;
    bio?: string;
  };
}

export interface SocialStatsWidgetConfig extends BaseWidgetConfig {
  socials: Socials;
  displayLayout: "grid" | "horizontal" | "inline";
  showDetails: boolean;
  showImages: boolean;
  compactMode?: boolean;
  hideTitle?: boolean;
  hideBorder?: boolean;
  hideFollowers?: boolean;
  hideFollowing?: boolean;
  hideRepos?: boolean;
  customTitle?: string;
  badgeStyle?: "flat" | "flat-square" | "plastic" | "for-the-badge";
  cardLayout?: "default" | "compact";
  useSvgCard?: boolean;
  gridColumns?: 2 | 3 | 4;
}

interface SocialStatsWidgetProps extends BaseWidgetProps {
  config: SocialStatsWidgetConfig;
  onConfigChange?: (config: SocialStatsWidgetConfig) => void;
}

const generateSocialIcons = (
  socials: Socials,
  displayLayout: string,
  badgeStyle: string = "for-the-badge"
) => {
  const icons: string[] = [];

  if (socials?.twitter) {
    icons.push(
      `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=${badgeStyle}&logo=twitter&logoColor=white)](https://twitter.com/${socials.twitter})`
    );
  }

  if (socials?.linkedin) {
    icons.push(
      `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=${badgeStyle}&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`
    );
  }

  if (socials?.instagram) {
    icons.push(
      `[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=${badgeStyle}&logo=instagram&logoColor=white)](https://instagram.com/${socials.instagram})`
    );
  }

  if (socials?.youtube) {
    icons.push(
      `[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=${badgeStyle}&logo=youtube&logoColor=white)](https://youtube.com/c/${socials.youtube})`
    );
  }

  if (socials?.medium) {
    icons.push(
      `[![Medium](https://img.shields.io/badge/Medium-12100E?style=${badgeStyle}&logo=medium&logoColor=white)](https://medium.com/@${socials.medium})`
    );
  }

  if (socials?.dev) {
    icons.push(
      `[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=${badgeStyle}&logo=devdotto&logoColor=white)](https://dev.to/${socials.dev})`
    );
  }

  return icons;
};

const mapToValidGitHubTheme = (theme: string | undefined): string => {
  const validThemes = [
    "light",
    "dark",
    "radical",
    "tokyonight",
    "merko",
    "gruvbox",
    "github",
  ];

  if (theme && validThemes.includes(theme)) {
    return theme;
  }

  const themeMap: { [key: string]: string } = {
    default: "light",
    auto: "light",
    bright: "light",
    night: "dark",
    black: "dark",
    midnight: "dark",
    tokyo: "tokyonight",
    purple: "radical",
    green: "merko",
    orange: "gruvbox",
  };

  return themeMap[theme?.toLowerCase() || ""] || "light";
};

const generateGitHubStats = (config: SocialStatsWidgetConfig) => {
  if (!config.socials.github) return "";

  const svgParams = new URLSearchParams({
    username: config.socials.github,
    theme: mapToValidGitHubTheme(config.theme),
    layout: config.compactMode ? "compact" : "default",
  });

  if (config.hideBorder) svgParams.append("hideBorder", "true");
  if (config.hideTitle) svgParams.append("hideTitle", "true");
  if (config.customTitle) svgParams.append("customTitle", config.customTitle);

  const svgUrl = createAbsoluteUrl(
    `/api/github-stats-svg?${svgParams.toString()}`
  );

  return `<div align="center">\n\n![GitHub Stats](${svgUrl})\n\n</div>\n\n`;
};

const generateMarkdown = (config: SocialStatsWidgetConfig) => {
  let markdown = "";
  const badgeStyle = config.badgeStyle || "for-the-badge";
  const icons = generateSocialIcons(
    config.socials,
    config.displayLayout,
    badgeStyle
  );

  // Header
  markdown += "## 🌐 Connect with Me\n\n";

  if (icons.length > 0) {
    if (config.displayLayout === "grid") {
      const columns = config.gridColumns || 3;
      const rows = Math.ceil(icons.length / columns);

      markdown += '<div align="center">\n\n';
      for (let row = 0; row < rows; row++) {
        const rowIcons = icons.slice(row * columns, (row + 1) * columns);
        markdown += rowIcons.join(" ") + "\n\n";
      }
      markdown += "</div>\n\n";
    } else if (config.displayLayout === "horizontal") {
      markdown +=
        '<div align="center">\n\n' + icons.join(" ") + "\n\n</div>\n\n";
    } else {
      markdown += icons.join("\n") + "\n\n";
    }
  }

  // GitHub Stats
  if (config.socials.github) {
    markdown += generateGitHubStats(config);
  }

  return markdown;
};


const SocialStatsWidget: React.FC<SocialStatsWidgetProps> &
  MarkdownExportable = ({ config, onConfigChange, onMarkdownGenerated }) => {
  const {
    stats,
    loading,
    error,
    mounted,
    viewMode,
    copied,
    lastUsername,
    lastMarkdown,
    setMounted,
    setViewMode,
    setCopied,
    resetGithubStats,
    fetchGithubStats,
    setLastMarkdown,
  } = useSocialStatsStore();
  const configRef = useRef(config);
  const onMarkdownGeneratedRef = useRef(onMarkdownGenerated);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    onMarkdownGeneratedRef.current = onMarkdownGenerated;
  }, [onMarkdownGenerated]);

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  const githubUsername = config.socials?.github?.trim() || "";

  useEffect(() => {
    if (!mounted) return;

    if (!githubUsername) {
      resetGithubStats();
      return;
    }

    if (lastUsername === githubUsername) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchGithubStats(githubUsername);
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    mounted,
    githubUsername,
    lastUsername,
    resetGithubStats,
    fetchGithubStats,
  ]);

  const currentMarkdown = useMemo(() => {
    if (!mounted) return "";
    return generateMarkdown(config);
  }, [mounted, config]);

  useEffect(() => {
    if (!mounted || !onMarkdownGeneratedRef.current) return;

    if (lastMarkdown !== currentMarkdown) {
      setLastMarkdown(currentMarkdown);
      onMarkdownGeneratedRef.current(currentMarkdown);
    }
  }, [mounted, currentMarkdown, lastMarkdown, setLastMarkdown]);

  const githubStatsUrl = useMemo(() => {
    if (!mounted || !githubUsername) return "";

    const svgParams = new URLSearchParams({
      username: githubUsername,
      theme: mapToValidGitHubTheme(config.theme),
      layout: config.compactMode ? "compact" : "default",
    });

    if (config.hideBorder) svgParams.append("hideBorder", "true");
    if (config.hideTitle) svgParams.append("hideTitle", "true");
    if (config.customTitle) svgParams.append("customTitle", config.customTitle);

    return createAbsoluteUrl(`/api/github-stats-svg?${svgParams.toString()}`);
  }, [
    mounted,
    githubUsername,
    config.theme,
    config.compactMode,
    config.hideBorder,
    config.hideTitle,
    config.customTitle,
  ]); // Handlers
  const handleConfigChange = useCallback(
    (changes: Partial<SocialStatsWidgetConfig>) => {
      if (!onConfigChange) return;

      const newConfig = { ...configRef.current, ...changes };
      if (JSON.stringify(newConfig) !== JSON.stringify(configRef.current)) {
        onConfigChange(newConfig);
      }
    },
    [onConfigChange]
  );
  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        const timeoutId = setTimeout(() => {
          setCopied(false);
        }, 2000);

        copyTimeoutRef.current = timeoutId;
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    },
    [setCopied]
  );

  const handleViewModeToggle = useCallback(() => {
    setViewMode(viewMode === "preview" ? "markdown" : "preview");
  }, [viewMode, setViewMode]);

  // Cleanup
  useEffect(() => {
    return () => {
      const copyTimeout = copyTimeoutRef.current;
      const debounceTimeout = debounceTimerRef.current;

      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, []);
  // Loading state during hydration
  if (!mounted) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="p-6">
        {viewMode === "preview" ? (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                🌐 Social Links
                {Object.values(config.socials || {}).filter(Boolean).length >
                  0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {Object.values(config.socials || {}).filter(Boolean).length}
                  </span>
                )}
              </h4>

              {Object.values(config.socials || {}).filter(Boolean).length ===
              0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-4">🔗</div>
                  <p className="text-lg font-medium mb-2">
                    No social links configured
                  </p>
                  <p className="text-sm">
                    Add your social media usernames in the settings above
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      key: "github",
                      label: "GitHub",
                      color: "bg-gray-800 hover:bg-gray-700",
                      url: (username: string) =>
                        `https://github.com/${username}`,
                    },
                    {
                      key: "twitter",
                      label: "Twitter",
                      color: "bg-blue-400 hover:bg-blue-500",
                      url: (username: string) =>
                        `https://twitter.com/${username}`,
                    },
                    {
                      key: "linkedin",
                      label: "LinkedIn",
                      color: "bg-blue-600 hover:bg-blue-700",
                      url: (username: string) =>
                        `https://linkedin.com/in/${username}`,
                    },
                    {
                      key: "instagram",
                      label: "Instagram",
                      color: "bg-pink-500 hover:bg-pink-600",
                      url: (username: string) =>
                        `https://instagram.com/${username}`,
                    },
                    {
                      key: "youtube",
                      label: "YouTube",
                      color: "bg-red-500 hover:bg-red-600",
                      url: (username: string) =>
                        `https://youtube.com/c/${username}`,
                    },
                    {
                      key: "medium",
                      label: "Medium",
                      color: "bg-green-600 hover:bg-green-700",
                      url: (username: string) =>
                        `https://medium.com/@${username}`,
                    },
                    {
                      key: "dev",
                      label: "Dev.to",
                      color: "bg-gray-800 hover:bg-gray-900",
                      url: (username: string) => `https://dev.to/${username}`,
                    },
                  ].map(({ key, label, color, url }) => {
                    const username = (config.socials as any)?.[key];
                    if (!username) return null;

                    return (
                      <a
                        key={key}
                        href={url(username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors ${color}`}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* GitHub Stats Preview */}
            {config.socials?.github && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📊 GitHub Stats
                  {loading && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h4>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  {githubStatsUrl ? (
                    <div className="flex justify-center">
                      <Image
                        src={githubStatsUrl}
                        alt="GitHub Stats"
                        width={500}
                        height={200}
                        className="max-w-full h-auto rounded-md"
                        onError={() =>
                          console.error("Failed to load GitHub stats image")
                        }
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">📊</div>
                      <p>GitHub stats will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => copyToClipboard(currentMarkdown)}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  copied
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-auto max-h-96">
              <pre className="whitespace-pre-wrap">{currentMarkdown}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SocialStatsWidget.generateMarkdown = function (
  config?: SocialStatsWidgetConfig
) {
  if (!config) {
    return "## 🌐 Connect with Me\n\n<!-- Configure your social links in the widget settings -->";
  }

  return generateMarkdown(config);
};

export default SocialStatsWidget;