"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { createAbsoluteUrl } from "@/utils/urlHelpers";

// Enhanced social platforms interface
export interface SocialPlatforms {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  discord?: string;
  twitch?: string;
  reddit?: string;
  stackoverflow?: string;
}

// Enhanced stats interface
export interface EnhancedSocialStats {
  github?: {
    followers: number;
    following: number;
    repositories: number;
    stars: number;
    commits: number;
    issues: number;
    pullRequests: number;
    avatar?: string;
    name?: string;
    bio?: string;
    company?: string;
    location?: string;
    blog?: string;
    joinedDate?: string;
  };
  linkedin?: {
    connections?: number;
    posts?: number;
  };
  twitter?: {
    followers?: number;
    following?: number;
    tweets?: number;
  };
  // Add more platforms as needed
}

interface EnhancedSocialStatsWidgetProps {
  socials: SocialPlatforms;
  theme?: "default" | "dark" | "radical" | "tokyonight" | "merko" | "gruvbox" | "github" | "discord" | "ocean" | "sunset";
  layout?: "default" | "compact" | "minimal" | "detailed";
  showAvatar?: boolean;
  showBio?: boolean;
  hideStats?: string[];
  customTitle?: string;
  enableAnimations?: boolean;
  borderRadius?: "none" | "small" | "medium" | "large";
  showBorder?: boolean;
  onMarkdownGenerated?: (markdown: string) => void;
}

// GitHub stats fetching service
const fetchGitHubStats = async (username: string): Promise<EnhancedSocialStats['github']> => {
  try {
    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error('Failed to fetch GitHub user');
    const userData = await userResponse.json();

    // Fetch user events for additional stats
    const eventsResponse = await fetch(`https://api.github.com/users/${username}/events`);
    const eventsData = eventsResponse.ok ? await eventsResponse.json() : [];

    // Calculate stats from events
    const commits = eventsData.filter((event: any) => event.type === 'PushEvent').length;
    const issues = eventsData.filter((event: any) => event.type === 'IssuesEvent').length;
    const pullRequests = eventsData.filter((event: any) => event.type === 'PullRequestEvent').length;

    // Fetch repositories to calculate total stars
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const reposData = reposResponse.ok ? await reposResponse.json() : [];
    const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);

    return {
      followers: userData.followers,
      following: userData.following,
      repositories: userData.public_repos,
      stars: totalStars,
      commits: commits,
      issues: issues,
      pullRequests: pullRequests,
      avatar: userData.avatar_url,
      name: userData.name,
      bio: userData.bio,
      company: userData.company,
      location: userData.location,
      blog: userData.blog,
      joinedDate: userData.created_at,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
};

// Theme configuration
const getThemeConfig = (theme: string) => {
  const themes = {
    default: {
      background: "bg-white",
      text: "text-gray-900",
      secondaryText: "text-gray-600",
      border: "border-gray-200",
      accent: "text-blue-600",
      statsBg: "bg-gray-50",
      gradient: "",
    },
    dark: {
      background: "bg-gray-900",
      text: "text-white",
      secondaryText: "text-gray-300",
      border: "border-gray-700",
      accent: "text-blue-400",
      statsBg: "bg-gray-800",
      gradient: "",
    },
    radical: {
      background: "bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700",
      text: "text-white",
      secondaryText: "text-pink-100",
      border: "border-pink-400",
      accent: "text-pink-200",
      statsBg: "bg-white/10 backdrop-blur-sm",
      gradient: "bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700",
    },
    tokyonight: {
      background: "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900",
      text: "text-white",
      secondaryText: "text-indigo-200",
      border: "border-indigo-500",
      accent: "text-cyan-300",
      statsBg: "bg-indigo-800/30 backdrop-blur-sm",
      gradient: "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900",
    },
    merko: {
      background: "bg-gradient-to-r from-green-800 to-blue-800",
      text: "text-white",
      secondaryText: "text-green-200",
      border: "border-green-400",
      accent: "text-green-300",
      statsBg: "bg-green-800/30 backdrop-blur-sm",
      gradient: "bg-gradient-to-r from-green-800 to-blue-800",
    },
    gruvbox: {
      background: "bg-gradient-to-r from-yellow-800 to-orange-800",
      text: "text-yellow-100",
      secondaryText: "text-yellow-200",
      border: "border-yellow-600",
      accent: "text-yellow-300",
      statsBg: "bg-yellow-800/30 backdrop-blur-sm",
      gradient: "bg-gradient-to-r from-yellow-800 to-orange-800",
    },
    github: {
      background: "bg-gray-50",
      text: "text-gray-900",
      secondaryText: "text-gray-600",
      border: "border-gray-300",
      accent: "text-gray-900",
      statsBg: "bg-white",
      gradient: "",
    },
    discord: {
      background: "bg-gradient-to-r from-indigo-600 to-purple-600",
      text: "text-white",
      secondaryText: "text-indigo-100",
      border: "border-indigo-400",
      accent: "text-indigo-200",
      statsBg: "bg-indigo-700/30 backdrop-blur-sm",
      gradient: "bg-gradient-to-r from-indigo-600 to-purple-600",
    },
    ocean: {
      background: "bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500",
      text: "text-white",
      secondaryText: "text-blue-100",
      border: "border-cyan-300",
      accent: "text-cyan-200",
      statsBg: "bg-cyan-600/20 backdrop-blur-sm",
      gradient: "bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500",
    },
    sunset: {
      background: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
      text: "text-white",
      secondaryText: "text-orange-100",
      border: "border-orange-300",
      accent: "text-orange-200",
      statsBg: "bg-orange-600/20 backdrop-blur-sm",
      gradient: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
    },
  };
  
  return themes[theme as keyof typeof themes] || themes.default;
};

export default function EnhancedSocialStatsWidget({
  socials,
  theme = "default",
  layout = "default",
  showAvatar = true,
  showBio = true,
  hideStats = [],
  customTitle,
  enableAnimations = true,
  borderRadius = "medium",
  showBorder = true,
  onMarkdownGenerated,
}: EnhancedSocialStatsWidgetProps) {
  const [stats, setStats] = useState<EnhancedSocialStats>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [svgUrl, setSvgUrl] = useState<string>("");
  const [viewMode, setViewMode] = useState<"card" | "svg">("card");
  const themeConfig = getThemeConfig(theme);

  // Memoize hideStats to prevent infinite re-renders
  const memoizedHideStats = useMemo(() => hideStats || [], [hideStats]);

  // Border radius classes
  const borderRadiusClass = {
    none: "rounded-none",
    small: "rounded-lg",
    medium: "rounded-xl",
    large: "rounded-2xl",
  }[borderRadius];

  // Fetch GitHub stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!socials.github) {
        setStats({});
        setSvgUrl("");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const githubStats = await fetchGitHubStats(socials.github);
        setStats({ github: githubStats });

        // Generate SVG URL
        const apiPath = `/api/github-stats-svg?username=${encodeURIComponent(socials.github)}&theme=${theme}&layout=${layout}&showAvatar=${showAvatar}&showBio=${showBio}&hideStats=${memoizedHideStats.join(',')}&borderRadius=${borderRadius}&showBorder=${showBorder}`;
        setSvgUrl(createAbsoluteUrl(apiPath));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        setStats({});
        setSvgUrl("");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [socials.github, theme, layout, showAvatar, showBio, memoizedHideStats, borderRadius, showBorder]);
    // Call onMarkdownGenerated when markdown changes (removed onMarkdownGenerated from deps to prevent infinite loop)
  useEffect(() => {
    if (onMarkdownGenerated && svgUrl && socials.github) {
      const markdown = `![GitHub Stats for @${socials.github}](${svgUrl})`;
      onMarkdownGenerated(markdown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgUrl, socials.github]); // Intentionally omitting onMarkdownGenerated to prevent infinite loops

  // Generate markdown
  const generateMarkdown = () => {
    if (!svgUrl || !socials.github) return "";
    return `![GitHub Stats for @${socials.github}](${svgUrl})`;
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <motion.div
        className={`${themeConfig.background} ${themeConfig.text} ${borderRadiusClass} ${showBorder ? `border ${themeConfig.border}` : ''} shadow-lg overflow-hidden`}
        initial={enableAnimations ? { opacity: 0, y: 20 } : undefined}
        animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
        transition={enableAnimations ? { duration: 0.5 } : undefined}
      >
        <div className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin opacity-20"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin" style={{ animationDelay: '-0.3s' }}></div>
            </div>
          </div>
          <div className={`text-center ${themeConfig.secondaryText} mt-4`}>
            Loading GitHub stats...
          </div>
        </div>
      </motion.div>
    );
  }

  // Render error state
  if (error) {
    return (
      <motion.div
        className={`${themeConfig.background} ${themeConfig.text} ${borderRadiusClass} ${showBorder ? `border ${themeConfig.border}` : ''} shadow-lg overflow-hidden`}
        initial={enableAnimations ? { opacity: 0, y: 20 } : undefined}
        animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
        transition={enableAnimations ? { duration: 0.5 } : undefined}
      >
        <div className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <div className={`${themeConfig.secondaryText} text-sm`}>
                Error: {error}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render main component
  return (
    <motion.div
      className={`${themeConfig.background} ${themeConfig.text} ${borderRadiusClass} ${showBorder ? `border ${themeConfig.border}` : ''} shadow-lg overflow-hidden relative`}
      initial={enableAnimations ? { opacity: 0, y: 20 } : undefined}
      animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
      transition={enableAnimations ? { duration: 0.5 } : undefined}
    >
      {/* Background gradient overlay for gradient themes */}
      {themeConfig.gradient && (
        <div className={`absolute inset-0 ${themeConfig.gradient} opacity-90`}></div>
      )}
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${themeConfig.text}`}>
            {customTitle || `${socials.github ? '@' + socials.github : 'Social'} Stats`}
          </h3>
          
          {socials.github && stats.github && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === "card" ? "svg" : "card")}
                className={`px-3 py-1 text-xs ${themeConfig.statsBg} ${themeConfig.text} rounded-lg hover:opacity-80 transition-all`}
              >
                {viewMode === "card" ? "📊 SVG" : "🃏 Card"}
              </button>
              
              {viewMode === "svg" && svgUrl && (
                <button
                  onClick={() => copyToClipboard(generateMarkdown())}
                  className={`px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all`}
                >
                  📋 Copy MD
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {viewMode === "card" ? (
          <div className="space-y-6">
            {/* GitHub Stats */}
            {stats.github && (
              <div className="space-y-4">
                {/* Profile section */}
                {(showAvatar || showBio) && (
                  <div className="flex items-start gap-4">
                    {showAvatar && stats.github.avatar && (
                      <motion.div
                        className="shrink-0"
                        initial={enableAnimations ? { scale: 0 } : undefined}
                        animate={enableAnimations ? { scale: 1 } : undefined}
                        transition={enableAnimations ? { delay: 0.2, type: "spring", stiffness: 200 } : undefined}
                      >
                        <Image
                          src={stats.github.avatar}
                          alt={`${socials.github} avatar`}
                          width={layout === "compact" ? 48 : 64}
                          height={layout === "compact" ? 48 : 64}
                          className={`${layout === "compact" ? "w-12 h-12" : "w-16 h-16"} rounded-full border-2 ${themeConfig.border} shadow-lg`}
                        />
                      </motion.div>
                    )}
                    
                    {showBio && (
                      <div className="flex-1 min-w-0">
                        {stats.github.name && (
                          <h4 className={`font-semibold ${themeConfig.text} truncate`}>
                            {stats.github.name}
                          </h4>
                        )}
                        {stats.github.bio && (
                          <p className={`text-sm ${themeConfig.secondaryText} mt-1 line-clamp-2`}>
                            {stats.github.bio}
                          </p>
                        )}
                        <div className={`flex items-center gap-3 mt-2 text-xs ${themeConfig.secondaryText}`}>
                          {stats.github.company && (
                            <span className="flex items-center gap-1">
                              🏢 {stats.github.company}
                            </span>
                          )}
                          {stats.github.location && (
                            <span className="flex items-center gap-1">
                              📍 {stats.github.location}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats grid */}
                <div className={`grid ${layout === "compact" ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4"} gap-4`}>
                  {!hideStats.includes('followers') && (
                    <motion.div
                      className={`${themeConfig.statsBg} p-4 ${borderRadiusClass}`}
                      initial={enableAnimations ? { opacity: 0, y: 10 } : undefined}
                      animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
                      transition={enableAnimations ? { delay: 0.3 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {stats.github.followers.toLocaleString()}
                      </div>
                      <div className={`text-sm ${themeConfig.secondaryText}`}>Followers</div>
                    </motion.div>
                  )}

                  {!hideStats.includes('repositories') && (
                    <motion.div
                      className={`${themeConfig.statsBg} p-4 ${borderRadiusClass}`}
                      initial={enableAnimations ? { opacity: 0, y: 10 } : undefined}
                      animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
                      transition={enableAnimations ? { delay: 0.4 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {stats.github.repositories.toLocaleString()}
                      </div>
                      <div className={`text-sm ${themeConfig.secondaryText}`}>Repositories</div>
                    </motion.div>
                  )}

                  {!hideStats.includes('stars') && (
                    <motion.div
                      className={`${themeConfig.statsBg} p-4 ${borderRadiusClass}`}
                      initial={enableAnimations ? { opacity: 0, y: 10 } : undefined}
                      animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
                      transition={enableAnimations ? { delay: 0.5 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {stats.github.stars.toLocaleString()}
                      </div>
                      <div className={`text-sm ${themeConfig.secondaryText}`}>Total Stars</div>
                    </motion.div>
                  )}

                  {!hideStats.includes('following') && (
                    <motion.div
                      className={`${themeConfig.statsBg} p-4 ${borderRadiusClass}`}
                      initial={enableAnimations ? { opacity: 0, y: 10 } : undefined}
                      animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
                      transition={enableAnimations ? { delay: 0.6 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {stats.github.following.toLocaleString()}
                      </div>
                      <div className={`text-sm ${themeConfig.secondaryText}`}>Following</div>
                    </motion.div>
                  )}
                </div>

                {/* Additional stats (if layout is detailed) */}
                {layout === "detailed" && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className={`${themeConfig.statsBg} p-3 ${borderRadiusClass} text-center`}>
                      <div className={`text-lg font-semibold ${themeConfig.accent}`}>
                        {stats.github.commits}
                      </div>
                      <div className={`text-xs ${themeConfig.secondaryText}`}>Recent Commits</div>
                    </div>
                    <div className={`${themeConfig.statsBg} p-3 ${borderRadiusClass} text-center`}>
                      <div className={`text-lg font-semibold ${themeConfig.accent}`}>
                        {stats.github.issues}
                      </div>
                      <div className={`text-xs ${themeConfig.secondaryText}`}>Issues</div>
                    </div>
                    <div className={`${themeConfig.statsBg} p-3 ${borderRadiusClass} text-center`}>
                      <div className={`text-lg font-semibold ${themeConfig.accent}`}>
                        {stats.github.pullRequests}
                      </div>
                      <div className={`text-xs ${themeConfig.secondaryText}`}>Pull Requests</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No data state */}
            {!socials.github && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <div className={`${themeConfig.secondaryText} text-sm`}>
                  Add your GitHub username to see stats
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SVG View */
          <div className="space-y-4">            {svgUrl && (
              <div className="bg-white rounded-lg p-4">
                <Image
                  src={svgUrl}
                  alt={`GitHub stats for ${socials.github}`}
                  width={495}
                  height={250}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
            )}
            
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => copyToClipboard(svgUrl)}
                className={`flex-1 px-3 py-2 ${themeConfig.statsBg} ${themeConfig.text} rounded-lg hover:opacity-80 transition-all`}
              >
                📋 Copy SVG URL
              </button>
              <button
                onClick={() => copyToClipboard(generateMarkdown())}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                📝 Copy Markdown
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
