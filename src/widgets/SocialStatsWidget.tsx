'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createAbsoluteUrl } from "@/utils/urlHelpers";
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { getGithubStats } from "@/services/socialStats";
import { Socials } from "@/interfaces/Socials";

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
  displayLayout: 'grid' | 'horizontal' | 'inline';
  showDetails: boolean;
  showImages: boolean;
  compactMode?: boolean;
  hideTitle?: boolean;
  hideBorder?: boolean;
  hideFollowers?: boolean;
  hideFollowing?: boolean;
  hideRepos?: boolean;
  customTitle?: string;
  badgeStyle?: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
}

interface SocialStatsWidgetProps extends BaseWidgetProps {
  config: SocialStatsWidgetConfig;
  onConfigChange?: (config: SocialStatsWidgetConfig) => void;
}

// Move markdown helpers outside the component to avoid re-creation on every render
const generateSocialIcons = (socials: Socials, displayLayout: string) => {
  const icons: string[] = [];
  
  // GitHub
  if (socials?.github) {
    icons.push(`[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${socials.github})`);
  }
  
  // Twitter/X
  if (socials?.twitter) {
    icons.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${socials.twitter})`);
  }
  
  // LinkedIn
  if (socials?.linkedin) {
    icons.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`);
  }
  
  // Instagram
  if (socials?.instagram) {
    icons.push(`[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/${socials.instagram})`);
  }
  
  // YouTube
  if (socials?.youtube) {
    icons.push(`[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/c/${socials.youtube})`);
  }

  // Medium
  if (socials?.medium) {
    icons.push(`[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@${socials.medium})`);
  }

  // Dev.to
  if (socials?.dev) {
    icons.push(`[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](https://dev.to/${socials.dev})`);
  }
  
  return icons;
};

const generateGitHubStats = (stats: SocialStats, config: SocialStatsWidgetConfig) => {
  if (!stats.github) return '';
  
  const { github } = stats;
  let result = '';
  
  if (github.name && !config.hideTitle) {
    const title = config.customTitle || `${github.name}'s GitHub Stats`;
    result += `### ${title}\n\n`;
  }
  
  if (github.bio) {
    result += `${github.bio}\n\n`;
  }
  
  // For compact mode, use badges instead of table
  if (config.compactMode) {
    if (!config.hideFollowers) {
      result += `![GitHub followers](https://img.shields.io/github/followers/${config.socials.github}?style=${config.badgeStyle || 'for-the-badge'}&label=Followers&color=007ec6) `;
    }
    if (!config.hideFollowing) {
      result += `![GitHub following](https://img.shields.io/github/following/${config.socials.github}?style=${config.badgeStyle || 'for-the-badge'}&label=Following&color=2ea44f) `;
    }
    if (!config.hideRepos) {
      result += `![GitHub repositories](https://img.shields.io/badge/Repositories-${github.repositories}-orange?style=${config.badgeStyle || 'for-the-badge'}&logo=github) `;
    }
    result += '\n\n';
  } else {
    // Use table for detailed view
    const border = config.hideBorder ? 'no-border' : '';
    
    result += `<div class="github-stats ${border}">\n\n`;
    result += '| GitHub Stats | Value |\n| --- | --- |\n';
    if (!config.hideFollowers) result += `| Followers | ${github.followers} |\n`;
    if (!config.hideFollowing) result += `| Following | ${github.following} |\n`;
    if (!config.hideRepos) result += `| Repositories | ${github.repositories} |\n`;
    result += '\n</div>\n\n';
  }
  
  return result;
};

const generateMarkdown = (config: SocialStatsWidgetConfig, stats: SocialStats) => {
  let markdown = '';
  const icons = generateSocialIcons(config.socials, config.displayLayout);
  
  // Header
  markdown += '## Connect with Me\n\n';
  
  // Icons
  if (icons.length > 0) {
    if (config.displayLayout === 'grid') {
      markdown += '<div align="center">\n\n';
      for (let i = 0; i < icons.length; i++) {
        markdown += icons[i] + '\n';
        if ((i + 1) % 3 === 0 && i !== icons.length - 1) {
          markdown += '\n';
        }
      }
      markdown += '\n</div>\n\n';
    } else if (config.displayLayout === 'horizontal') {
      markdown += icons.join(' ');
      markdown += '\n\n';
    } else {
      markdown += icons.join('\n\n');
      markdown += '\n\n';
    }
  }
  
  // GitHub Stats
  if (config.showDetails && stats.github) {
    markdown += generateGitHubStats(stats, config);
  }
  
  return markdown;
};

/**
 * Social Stats Widget that displays stats from different social platforms
 */
const SocialStatsWidget: React.FC<SocialStatsWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [stats, setStats] = useState<SocialStats>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');

  // Fetch GitHub stats when username changes
  useEffect(() => {
    async function fetchData() {
      if (config.socials?.github) {
        setLoading(true);
        setError(null);
        try {          const githubStats = await getGithubStats(config.socials.github);
          setStats(prev => ({
            ...prev,
            github: {
              followers: githubStats.followers,
              following: githubStats.following,
              repositories: githubStats.public_repos,
              avatar: githubStats.avatar_url,
              name: githubStats.name,
              bio: githubStats.bio
            }
          }));
        } catch (err) {
          setError('Failed to fetch GitHub stats');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [config.socials?.github]);  // Generate markdown for the widget and notify parent
  useEffect(() => {
    if (onMarkdownGenerated) {
      const markdown = generateMarkdown(config, stats);
      onMarkdownGenerated(markdown);
    }
    // Only depend on config, stats, and onMarkdownGenerated
  }, [config, stats, onMarkdownGenerated]);

  /**
   * Render social icons for preview
   */
  const renderSocialIcons = () => {
    const { socials } = config;
    return (
      <div className={`flex ${config.displayLayout === 'grid' ? 'flex-wrap gap-3 justify-center' : 'flex-col sm:flex-row gap-4'}`}>
        {socials?.github && (
          <a href={`https://github.com/${socials.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium bg-black text-white rounded-md px-3 py-1.5 hover:bg-gray-800 transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        )}
        {socials?.twitter && (
          <a href={`https://twitter.com/${socials.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium bg-blue-500 text-white rounded-md px-3 py-1.5 hover:bg-blue-600 transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
            Twitter
          </a>
        )}
        {socials?.linkedin && (
          <a href={`https://linkedin.com/in/${socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium bg-blue-700 text-white rounded-md px-3 py-1.5 hover:bg-blue-800 transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        )}
        {/* Other social icons can be added here */}
      </div>
    );
  };
  /**
   * Render GitHub stats for preview
   */
  const renderGitHubStats = () => {
    if (!stats.github) return null;
    
    const displayTitle = config.hideTitle ? null : (config.customTitle || `${stats.github.name || 'GitHub'} Stats`);
    
    return (
      <div className={`mt-6 p-4 rounded-lg ${config.hideBorder ? '' : 'border border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}>
        {displayTitle && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{displayTitle}</h3>
        )}
        
        <div className="flex items-start gap-4">
          {config.showImages && typeof stats.github.avatar === 'string' && stats.github.avatar.length > 0 ? (
            <div className="flex-shrink-0">
              <Image 
                src={stats.github.avatar}
                alt={stats.github.name || 'GitHub User'}
                width={64}
                height={64}
                className="rounded-full border-2 border-gray-200 dark:border-gray-600"
              />
            </div>
          ) : null}
          <div className="flex-grow">
            {stats.github.name && !config.hideTitle && (
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">{stats.github.name}</h4>
            )}
            {stats.github.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stats.github.bio}</p>
            )}
            
            {config.compactMode ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {!config.hideFollowers && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 9C7.433 9 9 7.433 9 5.5S7.433 2 5.5 2 2 3.567 2 5.5 3.567 9 5.5 9zm0 2C3.014 11 1 13.014 1 15.5 1 16.5 1 18 5.5 18s4.5-1.5 4.5-2.5c0-2.486-2.014-4.5-4.5-4.5zm9-2c1.933 0 3.5-1.567 3.5-3.5S16.433 2 14.5 2 11 3.567 11 5.5s1.567 3.5 3.5 3.5zm0 2c-2.486 0-4.5 2.014-4.5 4.5 0 1 0 2.5 4.5 2.5s4.5-1.5 4.5-2.5c0-2.486-2.014-4.5-4.5-4.5z" />
                    </svg>
                    {stats.github.followers} Followers
                  </span>
                )}
                
                {!config.hideFollowing && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M14.5 9c1.933 0 3.5-1.567 3.5-3.5S16.433 2 14.5 2 11 3.567 11 5.5s1.567 3.5 3.5 3.5zm0 2c-2.486 0-4.5 2.014-4.5 4.5 0 1 0 2.5 4.5 2.5s4.5-1.5 4.5-2.5c0-2.486-2.014-4.5-4.5-4.5z" />
                      <path d="M5.5 9C7.433 9 9 7.433 9 5.5S7.433 2 5.5 2 2 3.567 2 5.5 3.567 9 5.5 9zm0 2C3.014 11 1 13.014 1 15.5 1 16.5 1 18 5.5 18s4.5-1.5 4.5-2.5c0-2.486-2.014-4.5-4.5-4.5z" />
                    </svg>
                    {stats.github.following} Following
                  </span>
                )}
                
                {!config.hideRepos && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                    <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    {stats.github.repositories} Repositories
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                {!config.hideFollowers && (
                  <div className="flex flex-col items-center p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">{stats.github.followers}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
                  </div>
                )}
                
                {!config.hideFollowing && (
                  <div className="flex flex-col items-center p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">{stats.github.following}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
                  </div>
                )}
                
                {!config.hideRepos && (
                  <div className="flex flex-col items-center p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">{stats.github.repositories}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Repos</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="social-stats-widget">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Stats</h3>
        <div className="flex gap-2">
          <button
            className={`px-2.5 py-1.5 text-xs font-medium rounded ${viewMode === 'preview' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setViewMode('preview')}
          >
            Preview
          </button>
          <button
            className={`px-2.5 py-1.5 text-xs font-medium rounded ${viewMode === 'markdown' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setViewMode('markdown')}
          >
            Markdown
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      ) : viewMode === 'preview' ? (
        <div className="space-y-6">
          {renderSocialIcons()}
          {config.showDetails && renderGitHubStats()}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
          <pre className="whitespace-pre-wrap">{generateMarkdown(config, stats)}</pre>
        </div>
      )}
    </div>
  );
};

// Generate markdown implementation for MarkdownExportable
SocialStatsWidget.generateMarkdown = function() {
  // This is just a stub, the actual implementation is inside the component
  return '## Connect with Me\n\n<!-- Social links will appear here -->';
};

export default SocialStatsWidget;
