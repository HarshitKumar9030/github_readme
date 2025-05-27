'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

export interface RepositoryShowcaseWidgetConfig extends BaseWidgetConfig {
  username: string;
  showcaseRepos?: string[];
  showStars?: boolean;
  showForks?: boolean;
  showLanguage?: boolean;
  showDescription?: boolean;
  width?: number;
  height?: number;
  hideBorder?: boolean;
  hideTitle?: boolean;
  customTitle?: string;
}

interface RepositoryShowcaseWidgetProps extends BaseWidgetProps {
  config: RepositoryShowcaseWidgetConfig;
  onConfigChange?: (config: RepositoryShowcaseWidgetConfig) => void;
}

const RepositoryShowcaseWidget: React.FC<RepositoryShowcaseWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateSvgUrl = useCallback(() => {
    if (!config.username?.trim() || !config.showcaseRepos?.length) {
      setSvgUrl('');
      return;
    }

    // For now, show the first repository in the showcase list
    const firstRepo = config.showcaseRepos[0];
    
    const params = new URLSearchParams({
      username: config.username,
      repo: firstRepo,
      theme: config.theme || 'default',
      width: (config.width || 400).toString(),
      height: (config.height || 200).toString()
    });

    if (config.showStars !== undefined) {
      params.set('showStats', config.showStars.toString());
    }
    if (config.showLanguage !== undefined) {
      params.set('showLanguage', config.showLanguage.toString());
    }
    if (config.showDescription !== undefined) {
      params.set('showDescription', config.showDescription.toString());
    }

    const url = createAbsoluteUrl(`/api/repo-showcase?${params.toString()}`);
    setSvgUrl(url);
  }, [
    config.username,
    config.showcaseRepos,
    config.theme,
    config.width,
    config.height,
    config.showStars,
    config.showLanguage,
    config.showDescription
  ]);

  const loadPreview = useCallback(async () => {
    if (!svgUrl) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(svgUrl);
      if (!response.ok) {
        throw new Error('Failed to generate repository showcase');      }
      
      if (onMarkdownGenerated) {
        const markdown = RepositoryShowcaseWidget.generateMarkdown();
        onMarkdownGenerated(markdown);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [svgUrl, onMarkdownGenerated]);

  useEffect(() => {
    generateSvgUrl();
  }, [generateSvgUrl]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);
  const handleConfigChange = (updates: Partial<RepositoryShowcaseWidgetConfig>) => {
    if (onConfigChange) {
      const newConfig = { ...config, ...updates };
      onConfigChange(newConfig);
    }
  };
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        
        {!config.username?.trim() ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Enter a GitHub username to see the repository showcase preview
          </div>
        ) : !config.showcaseRepos?.length ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Add repositories to showcase
          </div>
        ) : isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading repository showcase...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            Error: {error}
          </div>
        ) : svgUrl ? (
          <div className="flex justify-center">
            <Image
              src={svgUrl}
              alt="Repository Showcase"
              width={config.width || 400}
              height={config.height || 200}
              className="max-w-full h-auto"
              onError={() => setError('Failed to load repository showcase image')}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

RepositoryShowcaseWidget.generateMarkdown = (): string => {
  return '![Repository Showcase](https://your-domain.com/api/repo-showcase?username=yourusername&repo=yourrepo&theme=github)';
};

export default RepositoryShowcaseWidget;
