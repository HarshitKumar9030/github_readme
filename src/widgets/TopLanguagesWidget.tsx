import React, { useState, useEffect } from 'react';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';

export interface TopLanguagesWidgetConfig extends BaseWidgetConfig {
  username: string;
  hideBorder?: boolean;
  hideTitle?: boolean;
  layout?: 'compact' | 'default';
  theme?: 'light' | 'dark' | 'radical' | 'tokyonight' | 'merko' | 'gruvbox';
  customTitle?: string;
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
            <img src={generateUrl()} alt="Top Languages" className="w-full h-auto mt-2" />
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
