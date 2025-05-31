"use client";

import React, { useState, useEffect, useMemo, useCallback, useReducer } from "react";
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

// GitHub stats fetching service with caching and rate limiting
const fetchGitHubStats = async (username: string, cache: React.MutableRefObject<{ [key: string]: { data: any; timestamp: number } }>): Promise<EnhancedSocialStats['github']> => {
  // Check cache (5 minutes expiry)
  const cached = cache.current[username];
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  try {
    // Create headers with GitHub token if available
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-README-Generator'
    };
    
    if (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user profile with retry logic
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userResponse.ok) {
      if (userResponse.status === 429) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error('Failed to fetch GitHub user');
    }
    const userData = await userResponse.json();

    // Add delay between API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));    // Fetch user events for additional stats
    const eventsResponse = await fetch(`https://api.github.com/users/${username}/events`, { headers });
    const eventsData = eventsResponse.ok ? await eventsResponse.json() : [];

    // Calculate stats from events
    const commits = eventsData.filter((event: any) => event.type === 'PushEvent').length;
    const issues = eventsData.filter((event: any) => event.type === 'IssuesEvent').length;
    const pullRequests = eventsData.filter((event: any) => event.type === 'PullRequestEvent').length;

    // Add delay before final API call
    await new Promise(resolve => setTimeout(resolve, 100));    // Fetch repositories to calculate total stars
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    const reposData = reposResponse.ok ? await reposResponse.json() : [];
    const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);

    const result = {
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

    // Cache the result
    cache.current[username] = {
      data: result,
      timestamp: Date.now()
    };

    return result;
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
};

// Widget state reducer to batch updates and prevent flickering
interface WidgetState {
  stats: EnhancedSocialStats;
  loading: boolean;
  error: string | null;
  svgUrl: string;
  viewMode: "card" | "svg";
}

type WidgetAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { stats: EnhancedSocialStats; svgUrl: string } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'TOGGLE_VIEW_MODE' }
  | { type: 'RESET' };

const widgetReducer = (state: WidgetState, action: WidgetAction): WidgetState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        error: null, 
        stats: action.payload.stats, 
        svgUrl: action.payload.svgUrl 
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload, stats: {}, svgUrl: "" };
    case 'TOGGLE_VIEW_MODE':
      return { ...state, viewMode: state.viewMode === "card" ? "svg" : "card" };
    case 'RESET':
      return { stats: {}, loading: false, error: null, svgUrl: "", viewMode: "card" };
    default:
      return state;
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

function EnhancedSocialStatsWidget({
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
}: EnhancedSocialStatsWidgetProps) {  // Use reducer for batched state updates to prevent flickering
  const [state, dispatch] = useReducer(widgetReducer, {
    stats: {},
    loading: false,
    error: null,
    svgUrl: "",
    viewMode: "card"
  });

  // Add caching and debouncing refs
  const apiCallTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastFetchedUsernameRef = React.useRef<string>("");
  const githubDataCacheRef = React.useRef<{ [key: string]: { data: any; timestamp: number } }>({});

  // Memoize theme configuration to prevent recreation
  const themeConfig = useMemo(() => getThemeConfig(theme), [theme]);

  // Memoize hideStats to prevent infinite re-renders
  const memoizedHideStats = useMemo(() => hideStats || [], [hideStats]);

  // Memoize animation configurations to prevent Framer Motion re-initialization
  const animationConfig = useMemo(() => {
    if (!enableAnimations) {
      return {
        initial: undefined,
        animate: undefined,
        transition: undefined
      };
    }
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    };
  }, [enableAnimations]);

  const itemAnimationConfig = useMemo(() => {
    if (!enableAnimations) {
      return {
        initial: undefined,
        animate: undefined,
        transition: undefined
      };
    }
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 }
    };
  }, [enableAnimations]);

  // Border radius classes
  const borderRadiusClass = useMemo(() => ({
    none: "rounded-none",
    small: "rounded-lg",
    medium: "rounded-xl",
    large: "rounded-2xl",
  }[borderRadius]), [borderRadius]);  // Use useEffect to handle fetching with proper dependencies instead of useCallback
  useEffect(() => {
    // Clear any pending API calls
    if (apiCallTimeoutRef.current) {
      clearTimeout(apiCallTimeoutRef.current);
    }

    const fetchData = async () => {
      if (!socials.github) {
        dispatch({ type: 'RESET' });
        lastFetchedUsernameRef.current = "";
        return;
      }

      // Prevent duplicate calls for the same username
      if (lastFetchedUsernameRef.current === socials.github) {
        return;
      }

      dispatch({ type: 'FETCH_START' });
      lastFetchedUsernameRef.current = socials.github;

      try {
        const githubStats = await fetchGitHubStats(socials.github, githubDataCacheRef);
        
        // Generate SVG URL
        const apiPath = `/api/github-stats-svg?username=${encodeURIComponent(socials.github)}&theme=${theme}&layout=${layout}&showAvatar=${showAvatar}&showBio=${showBio}&hideStats=${memoizedHideStats.join(',')}&borderRadius=${borderRadius}&showBorder=${showBorder}`;
        const svgUrl = createAbsoluteUrl(apiPath);

        // Batch update to prevent multiple re-renders
        dispatch({ 
          type: 'FETCH_SUCCESS', 
          payload: { 
            stats: { github: githubStats }, 
            svgUrl 
          } 
        });
      } catch (err) {
        dispatch({ 
          type: 'FETCH_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to fetch stats' 
        });
      }
    };

    // Debounce API calls by 500ms
    apiCallTimeoutRef.current = setTimeout(fetchData, 500);

    return () => {
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
    };
  }, [socials.github, theme, layout, showAvatar, showBio, memoizedHideStats, borderRadius, showBorder]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (apiCallTimeoutRef.current) {
        clearTimeout(apiCallTimeoutRef.current);
      }
    };
  }, []);

  // Stable toggle function
  const toggleViewMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_VIEW_MODE' });
  }, []);

  // Stable copy function
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  // Generate markdown - memoized to prevent recreation
  const markdown = useMemo(() => {
    if (!state.svgUrl || !socials.github) return "";
    return `![GitHub Stats for @${socials.github}](${state.svgUrl})`;
  }, [state.svgUrl, socials.github]);
  // Call onMarkdownGenerated when markdown changes - stabilized to prevent infinite loops
  useEffect(() => {
    if (onMarkdownGenerated && markdown) {
      onMarkdownGenerated(markdown);
    }
  }, [onMarkdownGenerated, markdown]);
  // Render loading state
  if (state.loading) {
    return (
      <motion.div
        className={`${themeConfig.background} ${themeConfig.text} ${borderRadiusClass} ${showBorder ? `border ${themeConfig.border}` : ''} shadow-lg overflow-hidden`}
        {...animationConfig}
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
  if (state.error) {
    return (
      <motion.div
        className={`${themeConfig.background} ${themeConfig.text} ${borderRadiusClass} ${showBorder ? `border ${themeConfig.border}` : ''} shadow-lg overflow-hidden`}
        {...animationConfig}
      >
        <div className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <div className={`${themeConfig.secondaryText} text-sm`}>
                Error: {state.error}
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
      {...animationConfig}
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
          
          {socials.github && state.stats.github && (
            <div className="flex gap-2">
              <button
                onClick={toggleViewMode}
                className={`px-3 py-1 text-xs ${themeConfig.statsBg} ${themeConfig.text} rounded-lg hover:opacity-80 transition-all`}
              >
                {state.viewMode === "card" ? "📊 SVG" : "🃏 Card"}
              </button>
              
              {state.viewMode === "svg" && state.svgUrl && (
                <button
                  onClick={() => copyToClipboard(markdown)}
                  className={`px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all`}
                >
                  📋 Copy MD
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {state.viewMode === "card" ? (
          <div className="space-y-6">
            {/* GitHub Stats */}
            {state.stats.github && (
              <div className="space-y-4">
                {/* Profile section */}
                {(showAvatar || showBio) && (
                  <div className="flex items-start gap-4">
                    {showAvatar && state.stats.github.avatar && (
                      <motion.div
                        className="shrink-0"
                        initial={enableAnimations ? { scale: 0 } : undefined}
                        animate={enableAnimations ? { scale: 1 } : undefined}
                        transition={enableAnimations ? { delay: 0.2, type: "spring", stiffness: 200 } : undefined}
                      >
                        <Image
                          src={state.stats.github.avatar}
                          alt={`${socials.github} avatar`}
                          width={layout === "compact" ? 48 : 64}
                          height={layout === "compact" ? 48 : 64}
                          className={`${layout === "compact" ? "w-12 h-12" : "w-16 h-16"} rounded-full border-2 ${themeConfig.border} shadow-lg`}
                          key={`avatar-${socials.github}`}
                        />
                      </motion.div>
                    )}
                    
                    {showBio && (
                      <div className="flex-1 min-w-0">
                        {state.stats.github.name && (
                          <h4 className={`font-semibold ${themeConfig.text} truncate`}>
                            {state.stats.github.name}
                          </h4>
                        )}
                        {state.stats.github.bio && (
                          <p className={`text-sm ${themeConfig.secondaryText} mt-1 line-clamp-2`}>
                            {state.stats.github.bio}
                          </p>
                        )}
                        <div className={`flex items-center gap-3 mt-2 text-xs ${themeConfig.secondaryText}`}>
                          {state.stats.github.company && (
                            <span className="flex items-center gap-1">
                              🏢 {state.stats.github.company}
                            </span>
                          )}
                          {state.stats.github.location && (
                            <span className="flex items-center gap-1">
                              📍 {state.stats.github.location}
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
                      {...itemAnimationConfig}
                      transition={enableAnimations ? { delay: 0.3 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {state.stats.github.followers.toLocaleString()}
                      </div>
                      <div className={`text-sm ${themeConfig.secondaryText}`}>Followers</div>
                    </motion.div>
                  )}

                  {!hideStats.includes('repositories') && (
                    <motion.div
                      className={`${themeConfig.statsBg} p-4 ${borderRadiusClass}`}
                      {...itemAnimationConfig}
                      transition={enableAnimations ? { delay: 0.4 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {state.stats.github.repositories.toLocaleString()}
                      </div>
                      <div className={`text-sm ${themeConfig.secondaryText}`}>Repositories</div>
                    </motion.div>
                  )}

                  {!hideStats.includes('stars') && (
                    <motion.div
                      className={`${themeConfig.statsBg} p-4 ${borderRadiusClass}`}
                      {...itemAnimationConfig}
                      transition={enableAnimations ? { delay: 0.5 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {state.stats.github.stars.toLocaleString()}
                      </div>
                      <div className={`text-sm ${themeConfig.secondaryText}`}>Total Stars</div>
                    </motion.div>
                  )}

                  {!hideStats.includes('following') && (
                    <motion.div
                      className={`${themeConfig.statsBg} p-4 ${borderRadiusClass}`}
                      {...itemAnimationConfig}
                      transition={enableAnimations ? { delay: 0.6 } : undefined}
                    >
                      <div className={`text-2xl font-bold ${themeConfig.accent}`}>
                        {state.stats.github.following.toLocaleString()}
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
                        {state.stats.github.commits}
                      </div>
                      <div className={`text-xs ${themeConfig.secondaryText}`}>Recent Commits</div>
                    </div>
                    <div className={`${themeConfig.statsBg} p-3 ${borderRadiusClass} text-center`}>
                      <div className={`text-lg font-semibold ${themeConfig.accent}`}>
                        {state.stats.github.issues}
                      </div>
                      <div className={`text-xs ${themeConfig.secondaryText}`}>Issues</div>
                    </div>
                    <div className={`${themeConfig.statsBg} p-3 ${borderRadiusClass} text-center`}>
                      <div className={`text-lg font-semibold ${themeConfig.accent}`}>
                        {state.stats.github.pullRequests}
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
          <div className="space-y-4">
            {state.svgUrl && (
              <div className="bg-white rounded-lg p-4">
                <Image
                  src={state.svgUrl}
                  alt={`GitHub stats for ${socials.github}`}
                  width={495}
                  height={250}
                  className="w-full h-auto"
                  unoptimized
                  key={`svg-${socials.github}-${theme}`}
                />
              </div>
            )}
            
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => copyToClipboard(state.svgUrl)}
                className={`flex-1 px-3 py-2 ${themeConfig.statsBg} ${themeConfig.text} rounded-lg hover:opacity-80 transition-all`}
              >
                📋 Copy SVG URL
              </button>
              <button
                onClick={() => copyToClipboard(markdown)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                📝 Copy Markdown
              </button>
            </div>
          </div>
        )}      </div>
    </motion.div>
  );
}

// Memoized export to prevent unnecessary re-renders
export default React.memo(EnhancedSocialStatsWidget);