'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

export interface RepositoryShowcaseWidgetConfig extends BaseWidgetConfig {
  username: string;
  showcaseRepos?: string[];
  repoLayout?: 'single' | 'grid-2x1' | 'grid-2x2' | 'grid-3x1' | 'list';
  sortBy?: 'stars' | 'forks' | 'updated' | 'name' | 'created';
  repoLimit?: number;
  showStats?: boolean;
  showLanguage?: boolean;
  showDescription?: boolean;
  showTopics?: boolean;
  showLastUpdated?: boolean;
  repoCardWidth?: number;
  repoCardHeight?: number;
  hideBorder?: boolean;
  hideTitle?: boolean;
  customTitle?: string;
}

interface RepositoryShowcaseWidgetProps extends BaseWidgetProps {
  config: RepositoryShowcaseWidgetConfig;
  onConfigChange?: (config: RepositoryShowcaseWidgetConfig) => void;
}

// Helper function to generate markdown for a specific config
const generateMarkdownForConfig = (config: RepositoryShowcaseWidgetConfig): string => {
  if (!config || !config.showcaseRepos?.length) {
    return '![Repository Showcase](https://your-domain.com/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)';
  }

  // Convert repository names to owner/repo format if needed
  const formattedRepos = config.showcaseRepos.map(repo => {
    if (repo.includes('/')) {
      return repo; // Already in owner/repo format
    } else if (config.username?.trim()) {
      return `${config.username}/${repo}`; // Add username as owner
    }
    return repo;
  }).filter(repo => repo.includes('/')); // Only keep valid owner/repo pairs

  if (formattedRepos.length === 0) {
    return '![Repository Showcase](https://your-domain.com/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)';
  }

  const params = new URLSearchParams({
    repos: formattedRepos.join(','),
    theme: config.theme || 'default',
    layout: config.repoLayout || 'single',
    sortBy: config.sortBy || 'stars',
    repoLimit: (config.repoLimit || 6).toString(),
    cardWidth: (config.repoCardWidth || 400).toString(),
    cardHeight: (config.repoCardHeight || 200).toString()
  });

  if (config.showStats !== undefined) {
    params.set('showStats', config.showStats.toString());
  }
  if (config.showLanguage !== undefined) {
    params.set('showLanguage', config.showLanguage.toString());
  }
  if (config.showDescription !== undefined) {
    params.set('showDescription', config.showDescription.toString());
  }
  if (config.showTopics !== undefined) {
    params.set('showTopics', config.showTopics.toString());
  }
  if (config.showLastUpdated !== undefined) {
    params.set('showLastUpdated', config.showLastUpdated.toString());
  }

  return `![Repository Showcase](https://your-domain.com/api/repo-showcase?${params.toString()})`;
};

const RepositoryShowcaseWidget: React.FC<RepositoryShowcaseWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateSvgUrl = useCallback(() => {
    if (!config.showcaseRepos?.length) {
      setSvgUrl('');
      return;
    }

    // Convert repository names to owner/repo format if needed
    const formattedRepos = config.showcaseRepos.map(repo => {
      if (repo.includes('/')) {
        return repo; // Already in owner/repo format
      } else if (config.username?.trim()) {
        return `${config.username}/${repo}`; // Add username as owner
      }
      return repo;
    }).filter(repo => repo.includes('/')); // Only keep valid owner/repo pairs

    if (formattedRepos.length === 0) {
      setSvgUrl('');
      return;
    }

    const params = new URLSearchParams({
      repos: formattedRepos.join(','),
      theme: config.theme || 'default',
      layout: config.repoLayout || 'single',
      sortBy: config.sortBy || 'stars',
      repoLimit: (config.repoLimit || 6).toString(),
      cardWidth: (config.repoCardWidth || 400).toString(),
      cardHeight: (config.repoCardHeight || 200).toString()
    });

    if (config.showStats !== undefined) {
      params.set('showStats', config.showStats.toString());
    }
    if (config.showLanguage !== undefined) {
      params.set('showLanguage', config.showLanguage.toString());
    }
    if (config.showDescription !== undefined) {
      params.set('showDescription', config.showDescription.toString());
    }
    if (config.showTopics !== undefined) {
      params.set('showTopics', config.showTopics.toString());
    }
    if (config.showLastUpdated !== undefined) {
      params.set('showLastUpdated', config.showLastUpdated.toString());
    }

    const url = createAbsoluteUrl(`/api/repo-showcase?${params.toString()}`);
    setSvgUrl(url);
  }, [
    config.username,
    config.showcaseRepos,
    config.theme,
    config.repoLayout,
    config.sortBy,
    config.repoLimit,
    config.repoCardWidth,
    config.repoCardHeight,
    config.showStats,
    config.showLanguage,
    config.showDescription,
    config.showTopics,
    config.showLastUpdated
  ]);

  const loadPreview = useCallback(async () => {
    if (!svgUrl) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(svgUrl);
      if (!response.ok) {
        throw new Error('Failed to generate repository showcase');
      }
        if (onMarkdownGenerated) {
        const markdown = generateMarkdownForConfig(config);
        onMarkdownGenerated(markdown);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [svgUrl, onMarkdownGenerated, config]);

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

  // Calculate display dimensions for different layouts
  const getDisplayDimensions = () => {
    const cardWidth = config.repoCardWidth || 400;
    const cardHeight = config.repoCardHeight || 200;
    const layout = config.repoLayout || 'single';
    
    let displayWidth = cardWidth;
    let displayHeight = cardHeight;
    
    switch (layout) {
      case 'grid-2x1':
        displayWidth = cardWidth * 2 + 10;
        break;
      case 'grid-2x2':
        displayWidth = cardWidth * 2 + 10;
        displayHeight = cardHeight * 2 + 10;
        break;
      case 'grid-3x1':
        displayWidth = cardWidth * 3 + 20;
        break;
      case 'list':
        displayHeight = cardHeight * Math.min(config.showcaseRepos?.length || 1, config.repoLimit || 6) + (Math.min(config.showcaseRepos?.length || 1, config.repoLimit || 6) - 1) * 10;
        break;
    }
    
    return { width: displayWidth, height: displayHeight };
  };

  const displayDimensions = getDisplayDimensions();

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        
        {!config.showcaseRepos?.length ? (
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
              width={displayDimensions.width}
              height={displayDimensions.height}
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
  return '![Repository Showcase](https://your-domain.com/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)';
};

export default RepositoryShowcaseWidget;
