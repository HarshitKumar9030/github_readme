import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import StableImage from '@/components/StableImage';

export interface TopLanguagesWidgetConfig extends BaseWidgetConfig {
  username: string;
  hideBorder?: boolean;
  hideTitle?: boolean;
  layout?: 'compact' | 'default';
  layoutStyle?: 'center' | 'left' | 'right';
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
  
  // Create stable reference for the callback
  const onMarkdownGeneratedRef = useRef(onMarkdownGenerated);
  
  // Update ref when callback changes
  useEffect(() => {
    onMarkdownGeneratedRef.current = onMarkdownGenerated;
  }, [onMarkdownGenerated]);
    // Memoized URL generation for stability
  const imageUrl = useMemo(() => {
    if (!config.username) return '';
    const params = new URLSearchParams();
    if (config.theme) params.append('theme', config.theme);
    if (config.layout) params.append('layout', config.layout);
    if (config.hideBorder) params.append('hide_border', 'true');
    if (config.excludeRepos) params.append('exclude_repo', config.excludeRepos);
    if (config.excludeLangs) params.append('hide', config.excludeLangs);
    if (config.cardWidth) params.append('card_width', config.cardWidth.toString());
    
    return `https://github-readme-stats.vercel.app/api/top-langs/?username=${config.username}&${params.toString()}`;
  }, [config]);

  const cacheKey = useMemo(() => `top-langs-${config.username}-${config.theme}-${config.layout}-${JSON.stringify(config)}`, [config]);// Generate markdown
  const generateMarkdown = () => {
    if (!config.username) return '<!-- Add a GitHub username to display Top Languages stats -->';
    let md = '';
    if (!config.hideTitle && config.customTitle) {
      md += `## ${config.customTitle}\n\n`;
    } else if (!config.hideTitle) {
      md += `## Top Languages\n\n`;
    }

    // Apply layout style if specified
    const layoutStyle = config.layoutStyle || 'center';
    
    if (layoutStyle === 'center') {
      md += `<div align="center">\n\n`;
      md += `<img src="${imageUrl}" alt="Top Languages" width="${config.cardWidth || 495}" />\n\n`;
      md += `</div>\n\n`;
    } else if (layoutStyle === 'left') {
      md += `<div align="left">\n\n`;
      md += `<img src="${imageUrl}" alt="Top Languages" width="${config.cardWidth || 495}" />\n\n`;
      md += `</div>\n\n`;
    } else if (layoutStyle === 'right') {
      md += `<div align="right">\n\n`;
      md += `<img src="${imageUrl}" alt="Top Languages" width="${config.cardWidth || 495}" />\n\n`;
      md += `</div>\n\n`;
    } else {
      // Fallback to simple markdown image
      md += `![Top Languages](${imageUrl})\n\n`;
    }
    
    return md;
  };
  // Notify parent on markdown change with stable ref
  useEffect(() => {
    if (onMarkdownGeneratedRef.current) {
      onMarkdownGeneratedRef.current(generateMarkdown());
    }
  }, [
    config.username,
    config.theme,
    config.layout,
    config.layoutStyle,
    config.hideTitle,
    config.customTitle,
    config.cardWidth,
    config.hideBorder,
    config.excludeRepos,
    config.excludeLangs,
    imageUrl
  ]);return (
    <div className="rounded-lg border p-4">
      {viewMode === 'preview' ? (
        <>
          {!config.hideTitle && <h3 className="text-lg font-medium">{config.customTitle || 'Top Languages'}</h3>}
          {config.username ? (
            <div className="relative w-full h-auto mt-2" style={{ minHeight: 150 }}>
              <StableImage 
                src={imageUrl} 
                alt="Top Languages" 
                width={config.cardWidth || 495} 
                height={195} 
                cacheKey={cacheKey}
                priority={false}
                unoptimized={true} // GitHub API SVGs need to remain unoptimized to render correctly
                style={{ width: '100%', height: 'auto' }}
                fallbackText="Top Languages unavailable"
                loadingText="Loading languages..."
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
