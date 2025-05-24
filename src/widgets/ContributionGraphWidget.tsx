'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';

export interface ContributionGraphWidgetConfig extends Omit<BaseWidgetConfig, 'theme'> {
  username: string;
  hideBorder?: boolean;
  hideTitle?: boolean;
  customTitle?: string;
  theme?: 'default' | 'github' | 'minimal' | 'dark' | 'radical' | 'tokyonight' | 'merko' | 'gruvbox' | 'chartreuse-dark' | 'high-contrast' | 'tokyo-night' | 'ocean-dark' | 'city-lights' | 'github-compact' | 'dracula' | 'monokai' | 'vue' | 'vue-dark' | 'shades-of-purple' | 'nightowl' | 'buefy' | 'blue-green' | 'algolia' | 'great-gatsby' | 'darcula' | 'bear' | 'solarized-dark' | 'solarized-light' | 'chartreuse-light' | 'nord' | 'gotham' | 'material-palenight' | 'graywhite' | 'vision-friendly-dark' | 'ayu-mirage' | 'midnight-purple' | 'calm' | 'flag-india' | 'omni' | 'react' | 'jolly' | 'maroongold' | 'yeblu' | 'blueberry' | 'slateorange' | 'kacho_ga';
  showArea?: boolean;
  showDots?: boolean;
  height?: number;
  graphType?: 'line' | 'area' | 'compact';
}

interface ContributionGraphWidgetProps extends BaseWidgetProps {
  config: ContributionGraphWidgetConfig;
  onConfigChange?: (config: ContributionGraphWidgetConfig) => void;
}

/**
 * Contribution Graph Widget that displays GitHub contribution activity
 */

const ContributionGraphWidget: React.FC<ContributionGraphWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');

  const generateUrl = (): string => {
    if (!config.username) return '';
    
    const params = new URLSearchParams();
    
    if (config.theme && config.theme !== 'default') {
      params.append('theme', config.theme);
    }
    
    if (config.showArea !== false) params.append('area', 'true');
    if (config.hideBorder) params.append('hide_border', 'true');
    if (config.hideTitle) params.append('hide_title', 'true');
    if (config.height) params.append('height', config.height.toString());
    
    return `https://github-readme-activity-graph.vercel.app/graph?username=${config.username}&${params.toString()}`;
  };

  const generateMarkdown = (): string => {
    if (!config.username) return '<!-- Add a GitHub username to display Contribution Graph -->';
    
    let md = '';
    
    if (!config.hideTitle) {
      const title = config.customTitle || 'Contribution Activity';
      md += `## ${title}\n\n`;
    }
    
    const graphUrl = generateUrl();
    md += `<div align="center">\n\n`;
    md += `<img src="${graphUrl}" alt="Contribution Graph" width="100%" />\n\n`;
    md += `</div>\n\n`;
    
    return md;
  };

  useEffect(() => {
    if (onMarkdownGenerated) {
      onMarkdownGenerated(generateMarkdown());
    }
  }, [config, onMarkdownGenerated]);

  const getThemeStyles = () => {
    switch (config.theme) {
      case 'dark':
        return 'bg-gray-900 border-gray-700 text-white';
      case 'radical':
        return 'bg-gradient-to-r from-purple-900 to-pink-900 border-purple-500 text-white';
      case 'tokyonight':
        return 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-500 text-white';
      case 'merko':
        return 'bg-gradient-to-r from-green-900 to-teal-900 border-green-500 text-white';
      case 'gruvbox':
        return 'bg-gradient-to-r from-amber-700 to-amber-600 border-amber-500 text-white';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  const copyMarkdown = () => {
    const markdown = generateMarkdown();
    if (markdown && navigator.clipboard) {
      navigator.clipboard.writeText(markdown)
        .then(() => alert('Markdown copied to clipboard!'))
        .catch(err => {
          console.error('Failed to copy markdown:', err);
          alert('Failed to copy markdown');
        });
    }
  };

  return (
    <div className={`contribution-graph-widget rounded-lg border overflow-hidden ${getThemeStyles()}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {config.customTitle || 'Contribution Activity'}
          </h3>
          <div className="flex gap-2">
            <button
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setViewMode(viewMode === 'preview' ? 'markdown' : 'preview')}
            >
              {viewMode === 'preview' ? 'View Code' : 'View Preview'}
            </button>
            {viewMode === 'markdown' && (
              <button
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={copyMarkdown}
              >
                Copy
              </button>
            )}
          </div>
        </div>

        {viewMode === 'preview' ? (
          <div className="flex flex-col items-center w-full">
            {config.username ? (
              <div className="w-full">
                <Image 
                  src={generateUrl()} 
                  alt="Contribution Graph" 
                  width={800} 
                  height={400} 
                  unoptimized
                  className="w-full h-auto rounded-md"
                  onError={(e) => {
                    console.error('Failed to load contribution graph:', e);
                    setError('Failed to load contribution graph');
                  }}
                />
              </div>
            ) : (
              <div className="text-amber-600 text-center p-4">
                Please enter a GitHub username to display the contribution graph.
              </div>
            )}
          </div>
        ) : (
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs whitespace-pre-wrap overflow-x-auto">
            {generateMarkdown()}
          </pre>
        )}

        {error && (
          <div className="mt-2 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// Static method for markdown generation (used by template system)
ContributionGraphWidget.generateMarkdown = function(config?: ContributionGraphWidgetConfig) {
  if (!config || !config.username) {
    return '## Contribution Activity\n\n<!-- Add a GitHub username to display Contribution Graph -->';
  }

  let md = '';
  
  // Add title
  if (!config.hideTitle) {
    const title = config.customTitle || 'Contribution Activity';
    md += `## ${title}\n\n`;
  }
  
  // Generate URL with parameters
  const params = new URLSearchParams();
  if (config.theme && config.theme !== 'default') {
    params.append('theme', config.theme);
  }
  if (config.showArea !== false) params.append('area', 'true');
  if (config.hideBorder) params.append('hide_border', 'true');
  if (config.hideTitle) params.append('hide_title', 'true');
  if (config.height) params.append('height', config.height.toString());
  
  const graphUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${config.username}&${params.toString()}`;
  
  // Add contribution graph image
  md += `<div align="center">\n\n`;
  md += `<img src="${graphUrl}" alt="Contribution Graph" width="100%" />\n\n`;
  md += `</div>\n\n`;
  
  return md;
};

export default ContributionGraphWidget;
