"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Socials } from "./IntegrationMenu";
import { getGithubStats } from "@/services/socialStats";
import { createAbsoluteUrl } from "@/utils/urlHelpers";

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

interface SocialStatsWidgetProps {
  socials: Socials;
  theme?: "light" | "dark" | "radical" | "tokyonight" | "merko" | "gruvbox";
}

export default function SocialStatsWidget({
  socials,
  theme = "light",
}: SocialStatsWidgetProps) {
  const [stats, setStats] = useState<SocialStats>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [svgUrl, setSvgUrl] = useState<string>("");
  const [viewMode, setViewMode] = useState<"card" | "svg">("card");
  
  // Fetch GitHub stats when username changes
  useEffect(() => {
    async function fetchData() {
      if (socials.github) {
        setLoading(true);
        setError(false);
        setSvgUrl(""); // Clear previous SVG URL

        try {
          const githubData = await getGithubStats(socials.github);
          if (!githubData) {
            throw new Error("No data received from GitHub API");
          }
          
          // Set GitHub data with just the basic stats
          setStats((prevStats) => ({
            ...prevStats,
            github: {
              followers: githubData.followers,
              following: githubData.following,
              repositories: githubData.public_repos,
              avatar: githubData.avatar_url,
              name: githubData.name,
              bio: githubData.bio
            },
          }));
            // Generate SVG URL for the stats - the profile data is also fetched directly in the API
          const apiPath = `/api/github-stats-svg?username=${encodeURIComponent(socials.github)}&followers=${githubData.followers}&following=${githubData.following}&repos=${githubData.public_repos}&theme=${theme}`;
          const absoluteSvgUrl = createAbsoluteUrl(apiPath);
          setSvgUrl(absoluteSvgUrl);
          setError(false);
        } catch (err) {
          console.error("Error fetching GitHub stats:", err);
          setError(true);
          setSvgUrl(""); // Clear SVG URL on error
        } finally {
          setLoading(false);
        }
      } else {
        // Reset GitHub stats if username is cleared
        setStats((prevStats) => ({
          ...prevStats,
          github: undefined,
        }));
        setSvgUrl("");
      }
    }
    
    fetchData();
  }, [socials.github, theme]);

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

  // Function to generate markdown for GitHub stats
  const generateMarkdown = () => {
    if (!svgUrl) return "";
    return `![GitHub Stats for @${socials.github}](${svgUrl})`;
  };

  // Toggle between card view and SVG view
  const toggleViewMode = () => {
    setViewMode(viewMode === "card" ? "svg" : "card");
  };

  return (
    <motion.div
      className={`rounded-xl shadow-lg overflow-hidden border ${getThemeStyles()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">GitHub Statistics</h3>
          {socials.github && stats.github && !loading && !error && (
            <div className="flex gap-2">
              <button
                onClick={toggleViewMode}
                className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {viewMode === "card" ? "Show SVG" : "Show Card"}
              </button>
              {viewMode === "svg" && (
                <button
                  onClick={() => {
                    const markdown = generateMarkdown();
                    if (markdown && navigator.clipboard) {
                      navigator.clipboard.writeText(markdown)
                        .then(() => alert('Markdown copied to clipboard!'))
                        .catch((err) => {
                          console.error('Failed to copy markdown: ', err);
                          alert('Failed to copy markdown to clipboard');
                        });
                    } else {
                      alert('Your browser does not support clipboard operations');
                    }
                  }}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Copy Markdown
                </button>
              )}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4">
            Failed to load GitHub statistics. Please try again.
          </div>
        )}

        {!loading && !error && stats.github && (
          <>
            {viewMode === "card" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {stats.github.avatar && (
                    <Image
                      src={stats.github.avatar}
                      alt={`${socials.github}'s GitHub avatar`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{stats.github.name || socials.github}</div>
                    {stats.github.bio && (
                      <div className="text-sm text-gray-600 dark:text-gray-300">{stats.github.bio}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold">{stats.github.followers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Followers</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stats.github.following}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Following</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stats.github.repositories}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Repositories</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Click &quot;Show SVG&quot; to preview the standalone SVG card for Markdown export
                </p>
                {svgUrl && (
                  <div className="relative">                    <Image
                      src={svgUrl}
                      alt={`GitHub Stats for @${socials.github}`}
                      width={495}
                      height={250}
                      style={{
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                      unoptimized
                      priority
                    />
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                      This SVG image will be used when exporting to Markdown
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!socials.github && (
          <div className="text-center p-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Add your GitHub username above to display stats.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
