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
          }));          // Generate SVG URL for the stats
          // Using static SVG for now until API issues are resolved
          // const generatedSvgUrl = `/api/github-stats-svg?username=${encodeURIComponent(socials.github)}&followers=${githubData.followers}&following=${githubData.following}&repos=${githubData.public_repos}&theme=${theme}`;
          const generatedSvgUrl = `/github-stats-example.svg`;
          setSvgUrl(generatedSvgUrl);
          
          setError(false);
        } catch (err) {
          console.error("Error fetching GitHub stats:", err);
          setError(true);
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
  // Helper to generate SVG export

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
    
    // Create absolute URL for the SVG
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const absoluteSvgUrl = `${baseUrl}${svgUrl}`;
    
    return `![GitHub Stats](${absoluteSvgUrl})`;
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
              <button 
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(generateMarkdown());
                    alert('Markdown copied to clipboard!');
                  }
                }}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Copy Markdown
              </button>
            </div>
          )}
        </div>

        {/* GitHub Stats Section */}
        {socials.github ? (
          <div className="rounded-lg overflow-hidden">
            {/* Username display */}
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <h4 className="font-semibold text-base">GitHub (@{socials.github})</h4>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : error ? (
              <p className="text-sm text-red-500 py-2">Failed to load GitHub stats</p>
            ) : stats.github ? (
              <>
                {viewMode === "card" ? (
                  <div className="space-y-4">
                    {/* Main GitHub Stats as cards */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="px-3 py-2 bg-gray-100/60 dark:bg-gray-800/60 rounded-lg text-center">
                        <div className="font-bold">{stats.github.repositories}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Repositories</div>
                      </div>
                      <div className="px-3 py-2 bg-gray-100/60 dark:bg-gray-800/60 rounded-lg text-center">
                        <div className="font-bold">{stats.github.followers}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                      </div>
                      <div className="px-3 py-2 bg-gray-100/60 dark:bg-gray-800/60 rounded-lg text-center">
                        <div className="font-bold">{stats.github.following}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                      Click &quot;Show SVG&quot; to preview the standalone SVG card for Markdown export
                    </div>
                  </div>
                ) : (                  <div className="rounded-md overflow-hidden bg-white p-2">
                    <div className="flex justify-center">
                      {/* Use img tag instead of Next.js Image for SVGs */}
                      <img 
                        src={svgUrl} 
                        alt="GitHub Stats SVG" 
                        width={400}
                        height={200}
                        style={{ maxWidth: '100%' }}
                      />
                    </div>
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                      This SVG image will be used when exporting to Markdown
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        ) : (
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
              No GitHub account connected yet.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Add your GitHub username above to display stats.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
