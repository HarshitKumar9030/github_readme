'use client';

import React, { useState, useEffect, useRef } from "react";
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { getGithubStats } from "@/services/socialStats";
import { Socials } from "@/interfaces/Socials";
import ConfigPanel from "@/components/ConfigPanel";

// Social stats interface
export interface SocialStats {
  github?: {
    followers: number;
    following: number;
    repositories: number;
    name?: string;
    bio?: string;
  };
}

export interface SocialStatsWidgetConfig extends BaseWidgetConfig {
  socials: Socials;
  displayLayout: 'grid' | 'horizontal' | 'inline';
  showDetails: boolean;
  hideTitle?: boolean;
  hideFollowers?: boolean;
  hideFollowing?: boolean;
  hideRepos?: boolean;
  customTitle?: string;
  badgeStyle?: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
  gridColumns?: 2 | 3 | 4;
}

interface SocialStatsWidgetProps extends BaseWidgetProps {
  config: SocialStatsWidgetConfig;
  onConfigChange?: (config: SocialStatsWidgetConfig) => void;
}

// Generate social icons for markdown
const generateSocialIcons = (socials: Socials, displayLayout: string, badgeStyle: string = 'for-the-badge', gridColumns?: number) => {
  const icons: string[] = [];
  
  // GitHub
  if (socials?.github) {
    icons.push(`[![GitHub](https://img.shields.io/badge/GitHub-100000?style=${badgeStyle}&logo=github&logoColor=white)](https://github.com/${socials.github})`);
  }
  
  // Twitter/X
  if (socials?.twitter) {
    icons.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=${badgeStyle}&logo=twitter&logoColor=white)](https://twitter.com/${socials.twitter})`);
  }
  
  // LinkedIn
  if (socials?.linkedin) {
    icons.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=${badgeStyle}&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`);
  }
  
  // Instagram
  if (socials?.instagram) {
    icons.push(`[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=${badgeStyle}&logo=instagram&logoColor=white)](https://instagram.com/${socials.instagram})`);
  }
  
  // YouTube
  if (socials?.youtube) {
    icons.push(`[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=${badgeStyle}&logo=youtube&logoColor=white)](https://youtube.com/c/${socials.youtube})`);
  }

  // Medium
  if (socials?.medium) {
    icons.push(`[![Medium](https://img.shields.io/badge/Medium-12100E?style=${badgeStyle}&logo=medium&logoColor=white)](https://medium.com/@${socials.medium})`);
  }

  // Dev.to
  if (socials?.dev) {
    icons.push(`[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=${badgeStyle}&logo=devdotto&logoColor=white)](https://dev.to/${socials.dev})`);
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
  
  result += '<div align="center">\n\n';
  
  // Use standard markdown table for better GitHub compatibility
  result += '| GitHub Stats | Value |\n| --- | --- |\n';
  if (!config.hideFollowers) result += `| Followers | ${github.followers} |\n`;
  if (!config.hideFollowing) result += `| Following | ${github.following} |\n`;
  if (!config.hideRepos) result += `| Repositories | ${github.repositories} |\n`;
  
  result += '</div>\n\n';
  return result;
};

const generateMarkdown = (config: SocialStatsWidgetConfig, stats: SocialStats) => {
  let markdown = '';
  const badgeStyle = config.badgeStyle || 'for-the-badge';
  const icons = generateSocialIcons(config.socials, config.displayLayout, badgeStyle, config.gridColumns);
  
  // Header
  markdown += '## Connect with Me\n\n';
  
  // Icons
  if (icons.length > 0) {
    if (config.displayLayout === 'grid') {
      const gridColumns = config.gridColumns || 3;
      
      markdown += '<div align="center">\n\n';
      
      if (gridColumns === 2) {
        for (let i = 0; i < icons.length; i += 2) {
          if (i + 1 < icons.length) {
            markdown += `${icons[i]} ${icons[i + 1]}\n\n`;
          } else {
            markdown += `${icons[i]}\n\n`;
          }
        }
      } else if (gridColumns === 3) {
        for (let i = 0; i < icons.length; i += 3) {
          let rowMarkdown = '';
          
          rowMarkdown += icons[i];
          if (i + 1 < icons.length) {
            rowMarkdown += ` ${icons[i + 1]}`;
          }
          if (i + 2 < icons.length) {
            rowMarkdown += ` ${icons[i + 2]}`;
          }
          
          markdown += `${rowMarkdown}\n\n`;
        }
      } else if (gridColumns === 4) {
        for (let i = 0; i < icons.length; i += 4) {
          let rowMarkdown = '';
          
          rowMarkdown += icons[i];
          if (i + 1 < icons.length) {
            rowMarkdown += ` ${icons[i + 1]}`;
          }
          if (i + 2 < icons.length) {
            rowMarkdown += ` ${icons[i + 2]}`;
          }
          if (i + 3 < icons.length) {
            rowMarkdown += ` ${icons[i + 3]}`;
          }
          
          markdown += `${rowMarkdown}\n\n`;
        }
      }
      
      markdown += '</div>\n\n';
    } else if (config.displayLayout === 'horizontal') {
      markdown += '<div align="center">\n\n';
      markdown += icons.join(' ');
      markdown += '\n\n</div>\n\n';
    } else {
      markdown += icons.join('\n\n');
      markdown += '\n\n';
    }
  }
  
  if (config.showDetails && stats.github) {
    markdown += generateGitHubStats(stats, config);
  }
  
  return markdown;
};

/**
 * Simplified Social Stats Widget - Markdown Only (No Preview)
 */
const SocialStatsWidget: React.FC<SocialStatsWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [stats, setStats] = useState<SocialStats>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const apiCallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedUsernameRef = useRef<string>('');
  const githubDataCacheRef = useRef<{ [key: string]: { data: any; timestamp: number } }>({});

  // Fetch GitHub stats when username changes
  useEffect(() => {
    async function fetchData() {
      if (!config.socials?.github) {
        setStats(prev => ({ ...prev, github: undefined }));
        setError(null);
        return;
      }

      // Prevent duplicate calls for the same username
      if (lastFetchedUsernameRef.current === config.socials.github) {
        return;
      }

      // Check cache first (5-minute cache)
      const cached = githubDataCacheRef.current[config.socials.github];
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        setStats(prev => ({
          ...prev,
          github: cached.data
        }));
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchedUsernameRef.current = config.socials.github;
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const githubStats = await getGithubStats(config.socials.github);
          const githubData = {
            followers: githubStats.followers,
            following: githubStats.following,
            repositories: githubStats.public_repos,
            name: githubStats.name,
            bio: githubStats.bio
          };

          // Cache the data
          githubDataCacheRef.current[config.socials.github] = {
            data: githubData,
            timestamp: Date.now()
          };

          setStats(prev => ({
            ...prev,
            github: githubData
          }));
          
          setError(null);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub stats';
          
          // Handle 429 rate limit errors specifically
          if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
            setError('GitHub API rate limit exceeded. Consider adding a GitHub token to increase limits.');
          } else {
            setError('Failed to fetch GitHub stats');
          }
          
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 500); 
    }

    fetchData();
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [config.socials?.github]);

  // Generate markdown for the widget and notify parent
  useEffect(() => {
    if (onMarkdownGenerated) {
      const markdown = generateMarkdown(config, stats);
      onMarkdownGenerated(markdown);
    }
  }, [config, stats, onMarkdownGenerated]);
  // Cleanup effect for timeouts
  useEffect(() => {
    const debounceTimer = debounceTimerRef.current;
    const apiCallTimer = apiCallTimeoutRef.current;
    
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (apiCallTimer) {
        clearTimeout(apiCallTimer);
      }
    };
  }, []);

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Render configuration panel
   */
  const renderConfigPanel = () => {
    if (!showConfig) return null;

    return (
      <ConfigPanel
        config={config}
        onChange={(newConfig) => {
          if (onConfigChange) {
            const updatedConfig = {
              ...config,
              ...newConfig,
              gridColumns: (newConfig as any).gridColumns ?? config.gridColumns
            } as SocialStatsWidgetConfig;
            
            onConfigChange(updatedConfig);
          }
        }}
        widgetType="social-stats"
        title="Social Stats Widget Configuration"
      />
    );
  };

  return (
    <div className="social-stats-widget">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Stats</h3>
        <div className="flex gap-2">
          {/* Display grid columns selector only when grid layout is selected */}
          {config.displayLayout === 'grid' && (
            <div className="flex items-center mr-3">
              <label className="text-xs text-gray-600 dark:text-gray-400 mr-2">Columns:</label>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md p-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={config.gridColumns || 3}
                onChange={(e) => onConfigChange && onConfigChange({
                  ...config,
                  gridColumns: parseInt(e.target.value) as 2 | 3 | 4
                })}
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          )}
          <button
            className={`px-2.5 py-1.5 text-xs font-medium rounded flex items-center gap-1 ${showConfig ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            onClick={() => setShowConfig(!showConfig)}
            title="Widget Configuration"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Config
          </button>
        </div>
      </div>

      {renderConfigPanel()}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => copyToClipboard(generateMarkdown(config, stats))}
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
            <pre className="whitespace-pre-wrap">{generateMarkdown(config, stats)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Generate markdown implementation for MarkdownExportable
SocialStatsWidget.generateMarkdown = function(config?: SocialStatsWidgetConfig) {
  if (!config) {
    return '## Connect with Me\n\n<!-- Social links will appear here -->';
  }

  // Create a basic stats object with empty values to prevent errors
  const stats: SocialStats = {
    github: config.socials?.github ? {
      followers: 0,
      following: 0,
      repositories: 0,
      name: config.customTitle ? config.customTitle.replace("'s GitHub Stats", "") : "GitHub User",
      bio: "",
    } : undefined
  };
  
  // Use the same generateMarkdown function as the component
  return generateMarkdown(config, stats);
};

export default SocialStatsWidget;
