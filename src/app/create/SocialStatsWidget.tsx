"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Socials } from "./IntegrationMenu";
import { getGithubStats } from "@/services/socialStats";

// Social stats interface
export interface SocialStats {
  github?: {
    followers: number;
    following: number;
    repositories: number;
    avatar?: string;
    trophies?: string;
    streak?: string;
  };
  twitter?: {
    followers: number;
    following: number;
    tweets: number;
  };
  instagram?: {
    followers: number;
    following: number;
    posts: number;
  };
  linkedin?: {
    connections: number;
  };
}

interface SocialStatsWidgetProps {
  socials: Socials;
  theme?: "light" | "dark" | "radical" | "tokyonight" | "merko" | "gruvbox";
  config?: {
    showTrophies?: boolean;
    showStreak?: boolean;
  };
}

export default function SocialStatsWidget({
  socials,
  theme = "light",
  config = { showTrophies: true, showStreak: true },
}: SocialStatsWidgetProps) {
  const [stats, setStats] = useState<SocialStats>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    github: false,
    twitter: false,
    instagram: false,
    linkedin: false,
  });
  const [error, setError] = useState<{ [key: string]: boolean }>({
    github: false,
    twitter: false,
    instagram: false,
    linkedin: false,
  });

  // Fetch GitHub stats when username changes
  useEffect(() => {
    if (socials.github) {
      fetchGitHubStats(socials.github);
    } else {
      // Reset GitHub stats if username is cleared
      setStats((prevStats) => ({
        ...prevStats,
        github: undefined,
      }));
    }
  }, [socials.github, theme, config]); // Added theme and config as dependencies

  // For demo purposes, generate mock stats for other platforms
  useEffect(() => {
    if (socials.twitter) {
      fetchTwitterStats(socials.twitter);
    } else {
      setStats((prevStats) => ({
        ...prevStats,
        twitter: undefined,
      }));
    }
  }, [socials.twitter]);

  useEffect(() => {
    if (socials.instagram) {
      fetchInstagramStats(socials.instagram);
    } else {
      setStats((prevStats) => ({
        ...prevStats,
        instagram: undefined,
      }));
    }
  }, [socials.instagram]);

  useEffect(() => {
    if (socials.linkedin) {
      fetchLinkedInStats(socials.linkedin);
    } else {
      setStats((prevStats) => ({
        ...prevStats,
        linkedin: undefined,
      }));
    }
  }, [socials.linkedin]);  const fetchGitHubStats = async (username: string) => {
    setLoading((prev) => ({ ...prev, github: true }));
    setError((prev) => ({ ...prev, github: false }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const GithubData = await getGithubStats(username);
      if (!GithubData) {
        throw new Error("No data received from GitHub API");
      }
      
      // Set GitHub data with proper stats widgets
      setStats((prevStats) => ({
        ...prevStats,
        github: {
          followers: GithubData.followers,
          following: GithubData.following,
          repositories: GithubData.public_repos,
          avatar: GithubData.avatar_url,
          trophies: `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}`,
          streak: `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}`,
        },
      }));
      
      setError((prev) => ({ ...prev, github: false }));
    } catch (err) {
      console.error("Error fetching GitHub stats:", err);
      setError((prev) => ({ ...prev, github: true }));
    } finally {
      setLoading((prev) => ({ ...prev, github: false }));
    }
  };

  const fetchTwitterStats = async (username: string) => {
    setLoading((prev) => ({ ...prev, twitter: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Mock Twitter data
      const mockTwitterData = {
        followers: Math.floor(Math.random() * 2000) + 100,
        following: Math.floor(Math.random() * 500) + 50,
        tweets: Math.floor(Math.random() * 5000) + 100,
      };

      setStats((prevStats) => ({
        ...prevStats,
        twitter: mockTwitterData,
      }));
      setError((prev) => ({ ...prev, twitter: false }));
    } catch (err) {
      console.error("Error fetching Twitter stats:", err);
      setError((prev) => ({ ...prev, twitter: true }));
    } finally {
      setLoading((prev) => ({ ...prev, twitter: false }));
    }
  };

  const fetchInstagramStats = async (username: string) => {
    setLoading((prev) => ({ ...prev, instagram: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Mock Instagram data
      const mockInstagramData = {
        followers: Math.floor(Math.random() * 5000) + 200,
        following: Math.floor(Math.random() * 1000) + 100,
        posts: Math.floor(Math.random() * 500) + 20,
      };

      setStats((prevStats) => ({
        ...prevStats,
        instagram: mockInstagramData,
      }));
      setError((prev) => ({ ...prev, instagram: false }));
    } catch (err) {
      console.error("Error fetching Instagram stats:", err);
      setError((prev) => ({ ...prev, instagram: true }));
    } finally {
      setLoading((prev) => ({ ...prev, instagram: false }));
    }
  };

  const fetchLinkedInStats = async (username: string) => {
    setLoading((prev) => ({ ...prev, linkedin: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock LinkedIn data
      const mockLinkedInData = {
        connections: Math.floor(Math.random() * 500) + 100,
      };

      setStats((prevStats) => ({
        ...prevStats,
        linkedin: mockLinkedInData,
      }));
      setError((prev) => ({ ...prev, linkedin: false }));
    } catch (err) {
      console.error("Error fetching LinkedIn stats:", err);
      setError((prev) => ({ ...prev, linkedin: true }));
    } finally {
      setLoading((prev) => ({ ...prev, linkedin: false }));
    }
  };

  // Helper to get theme-based styles
  const getThemeStyles = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 border-gray-700 text-white";
      case "radical":
        return "bg-gradient-to-br from-pink-600 to-purple-800 border-pink-500 text-white";
      case "tokyonight":
        return "bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-700 text-white";
      case "merko":
        return "bg-gradient-to-r from-green-900 to-green-700 border-green-600 text-white";
      case "gruvbox":
        return "bg-amber-700 border-amber-600 text-white";
      default:
        return "bg-white border-gray-200 text-gray-900";
    }
  };

  return (
    <motion.div
      className={`rounded-xl shadow-lg overflow-hidden border ${getThemeStyles()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">Social Statistics</h3>

        {/* Consolidated Social Stats */}
        <div className="space-y-6">
          {/* GitHub Section */}
          {socials.github && (
            <div className={`rounded-lg overflow-hidden`}>
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <h4 className="font-semibold text-base">
                  GitHub (@{socials.github})
                </h4>
              </div>

              {loading.github ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : error.github ? (
                <p className="text-sm text-red-500 py-2">
                  Failed to load GitHub stats
                </p>
              ) : stats.github ? (
                <div className="space-y-4">
                  {/* Main GitHub Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="px-3 py-2 bg-gray-100/60 dark:bg-gray-800/60 rounded-lg text-center">
                      <div className="font-bold">
                        {stats.github.repositories}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Repositories
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-gray-100/60 dark:bg-gray-800/60 rounded-lg text-center">
                      <div className="font-bold">{stats.github.followers}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Followers
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-gray-100/60 dark:bg-gray-800/60 rounded-lg text-center">
                      <div className="font-bold">{stats.github.following}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Following
                      </div>
                    </div>
                  </div>

                  {/* GitHub Trophies */}
                  {stats.github.trophies && config?.showTrophies && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                        <span className="mr-1">🏆</span> GitHub Trophies
                      </h5>
                      <Image
                        src={stats.github.trophies}
                        alt="GitHub Trophies"
                        width={400}
                        height={100}
                        className="w-full rounded-md"
                        unoptimized={true}
                      />
                    </div>
                  )}

                  {/* GitHub Streak */}
                  {stats.github.streak && config?.showStreak && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                        <span className="mr-1">🔥</span> Contribution Streak
                      </h5>
                      <Image
                        src={stats.github.streak}
                        alt="GitHub Streak"
                        width={400}
                        height={100}
                        className="w-full rounded-md"
                        unoptimized={true}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Other Social Networks */}
          {(socials.twitter || socials.instagram || socials.linkedin) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-sm font-medium mb-3">
                Other Social Networks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Twitter Stats */}
                {socials.twitter && (
                  <div className="bg-gray-100/60 dark:bg-gray-800/60 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-4 h-4 mr-1 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <span className="text-sm font-medium">
                        @{socials.twitter}
                      </span>
                    </div>
                    {stats.twitter && (
                      <div className="grid grid-cols-3 gap-1 text-center text-xs">
                        <div>
                          <div className="font-semibold">
                            {stats.twitter.tweets}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Tweets
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {stats.twitter.followers}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Followers
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {stats.twitter.following}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Following
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Instagram Stats */}
                {socials.instagram && (
                  <div className="bg-gray-100/60 dark:bg-gray-800/60 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-4 h-4 mr-1 text-pink-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                      </svg>
                      <span className="text-sm font-medium">
                        @{socials.instagram}
                      </span>
                    </div>
                    {stats.instagram && (
                      <div className="grid grid-cols-3 gap-1 text-center text-xs">
                        <div>
                          <div className="font-semibold">
                            {stats.instagram.posts}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Posts
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {stats.instagram.followers}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Followers
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {stats.instagram.following}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Following
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* LinkedIn Stats */}
                {socials.linkedin && (
                  <div className="bg-gray-100/60 dark:bg-gray-800/60 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-4 h-4 mr-1 text-blue-700"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {socials.linkedin}
                      </span>
                    </div>
                    {stats.linkedin && (
                      <div className="text-center text-xs">
                        <div className="font-semibold">
                          {stats.linkedin.connections}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Connections
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Social Networks Connected */}
          {!socials.github &&
            !socials.twitter &&
            !socials.instagram &&
            !socials.linkedin && (
              <div className="py-8 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No social accounts connected yet.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Add your social media usernames above to display stats.
                </p>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}
