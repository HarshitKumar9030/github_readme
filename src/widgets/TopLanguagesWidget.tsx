import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';

export interface TopLanguagesWidgetConfig extends BaseWidgetConfig {
  username: string;
  hideBorder?: boolean;
  hideTitle?: boolean;
  layout?: 'compact' | 'default';
  theme?: 'light' | 'dark' | 'radical' | 'tokyonight' | 'merko' | 'gruvbox';
  customTitle?: string;
  excludeRepos?: string;
  excludeLangs?: string;
  cardWidth?: number;
}

interface TopLanguagesWidgetProps extends BaseWidgetProps {
  config: TopLanguagesWidgetConfig;
  onConfigChange?: (config: TopLanguagesWidgetConfig) => void;
}

const TopLanguagesWidget: React.FC<TopLanguagesWidgetProps> & MarkdownExportable = ({
  config,
  onMarkdownGenerated
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');
  // Generate the image URL
  const generateUrl = () => {
    if (!config.username) return '';
    const params = new URLSearchParams();
    if (config.theme) params.append('theme', config.theme);
    if (config.layout) params.append('layout', config.layout);
    if (config.hideBorder) params.append('hide_border', 'true');
    if (config.excludeRepos) params.append('exclude_repo', config.excludeRepos);
    if (config.excludeLangs) params.append('hide', config.excludeLangs);
    if (config.cardWidth) params.append('card_width', config.cardWidth.toString());
    
    return `https://github-readme-stats.vercel.app/api/top-langs/?username=${config.username}&${params.toString()}`;
  };

  // Generate markdown
  const generateMarkdown = () => {
    if (!config.username) return '<!-- Add a GitHub username to display Top Languages stats -->';
    let md = '';
    if (!config.hideTitle && config.customTitle) {
      md += `## ${config.customTitle}\n\n`;
    } else if (!config.hideTitle) {
      md += `## Top Languages\n\n`;
    }
    md += `![Top Languages](${generateUrl()})\n\n`;
    return md;
  };

  // Notify parent on markdown change
  useEffect(() => {
    if (onMarkdownGenerated) onMarkdownGenerated(generateMarkdown());
    // eslint-disable-next-line
  }, [config]);
  return (
    <div className="rounded-lg border p-4">
      {viewMode === 'preview' ? (
        <>
          {!config.hideTitle && <h3 className="text-lg font-medium">{config.customTitle || 'Top Languages'}</h3>}
          {config.username ? (
            <div className="relative w-full h-auto mt-2" style={{ minHeight: 150 }}>              <Image 
                src={generateUrl()} 
                alt="Top Languages" 
                width={config.cardWidth || 495} 
                height={195} 
                priority 
                unoptimized // GitHub API SVGs need to remain unoptimized to render correctly
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <div className="text-amber-600">Please enter a GitHub username.</div>
          )}
        </>
      ) : (
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs whitespace-pre-wrap">{generateMarkdown()}</pre>
      )}
      <div className="flex justify-end mt-2">
        <button
          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setViewMode(viewMode === 'preview' ? 'markdown' : 'preview')}
        >
          {viewMode === 'preview' ? 'View Markdown' : 'View Preview'}
        </button>
      </div>
    </div>
  );
};

TopLanguagesWidget.generateMarkdown = () => '';

export default TopLanguagesWidget;
