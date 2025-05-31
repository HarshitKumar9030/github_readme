'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { useRepositoryShowcaseStore } from '@/stores/repositoryShowcaseStore';

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
  // Ensure showcaseRepos is an array and has content
  const showcaseRepos = Array.isArray(config?.showcaseRepos) ? config.showcaseRepos : [];
  if (!config || showcaseRepos.length === 0) {
    return '![Repository Showcase](https://your-domain.com/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)';
  }
  
  // Convert repository names to owner/repo format if needed
  const formattedRepos = showcaseRepos.map(repo => {
    if (typeof repo !== 'string') return ''; // Skip invalid entries
    if (repo.includes('/')) {
      return repo; // Already in owner/repo format
    } else if (config.username?.trim()) {
      return `${config.username}/${repo}`; // Add username as owner
    }
    return repo;
  }).filter(repo => repo && repo.includes('/')); // Only keep valid owner/repo pairs

  if (formattedRepos.length === 0) {
    return '![Repository Showcase](https://your-domain.com/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)';
  }
  const params = new URLSearchParams({
    repos: formattedRepos.join(','),
    theme: config.theme || 'light',
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

/**
 * Repository Showcase Widget that displays a showcase of repositories
 */
const RepositoryShowcaseWidgetComponent: React.FC<RepositoryShowcaseWidgetProps> = React.memo(({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  // Zustand store hooks
  const { 
    svgUrl, 
    loading, 
    error, 
    mounted,
    setMounted,
    generateRepositoryShowcase,
    resetState 
  } = useRepositoryShowcaseStore();  // Memoize effective config to prevent unnecessary recalculations
  const effectiveConfig = useMemo(() => ({
    username: config.username || '',
    showcaseRepos: Array.isArray(config.showcaseRepos) ? config.showcaseRepos : [],
    theme: config.theme || 'light',
    repoLayout: config.repoLayout || 'single',
    sortBy: config.sortBy || 'stars',
    repoLimit: config.repoLimit || 6,
    repoCardWidth: config.repoCardWidth || 400,
    repoCardHeight: config.repoCardHeight || 200,
    showStats: config.showStats !== false,
    showLanguage: config.showLanguage !== false,
    showDescription: config.showDescription !== false,
    showTopics: config.showTopics !== false,
    showLastUpdated: config.showLastUpdated !== false,
    hideBorder: config.hideBorder || false,
    hideTitle: config.hideTitle || false,
    customTitle: config.customTitle || ''
  }), [config]);

  // Memoize the repos string for stable comparison
  const showcaseReposString = useMemo(() => 
    JSON.stringify(effectiveConfig.showcaseRepos), 
    [effectiveConfig.showcaseRepos]
  );  // Memoize markdown generation function
  const generateMarkdown = useCallback((): string => {
    if (!svgUrl) return '';

    return generateMarkdownForConfig(effectiveConfig);
  }, [svgUrl, effectiveConfig]);

  // Mount effect
  useEffect(() => {
    setMounted(true);
    return () => {
      resetState();
    };
  }, [setMounted, resetState]);  // Repository showcase generation effect - using specific dependencies to prevent loops
  useEffect(() => {
    if (!mounted) return;

    generateRepositoryShowcase(effectiveConfig);
  }, [
    mounted,
    generateRepositoryShowcase,
    effectiveConfig.username,
    showcaseReposString, // Use memoized string instead of JSON.stringify
    effectiveConfig.theme,
    effectiveConfig.repoLayout,
    effectiveConfig.sortBy,
    effectiveConfig.repoLimit,
    effectiveConfig.repoCardWidth,
    effectiveConfig.repoCardHeight,
    effectiveConfig.showStats,
    effectiveConfig.showLanguage,
    effectiveConfig.showDescription,
    effectiveConfig.showTopics,
    effectiveConfig.showLastUpdated
  ]);
  // Markdown generation effect
  useEffect(() => {
    if (svgUrl && onMarkdownGenerated) {
      const timeoutId = setTimeout(() => {
        onMarkdownGenerated(generateMarkdown());
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [svgUrl, onMarkdownGenerated, generateMarkdown]);// Calculate display dimensions for different layouts - memoized for performance
  const displayDimensions = useMemo(() => {
    const cardWidth = effectiveConfig.repoCardWidth ?? 400;
    const cardHeight = effectiveConfig.repoCardHeight ?? 200;
    const layout = effectiveConfig.repoLayout ?? 'single';
    
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
        const showcaseReposLength = effectiveConfig.showcaseRepos?.length ?? 0;
        displayHeight = cardHeight * Math.min(showcaseReposLength || 1, effectiveConfig.repoLimit ?? 6) + 
                       (Math.min(showcaseReposLength || 1, effectiveConfig.repoLimit ?? 6) - 1) * 10;
        break;
    }
    
    return { width: displayWidth, height: displayHeight };
  }, [
    effectiveConfig.repoCardWidth,
    effectiveConfig.repoCardHeight,
    effectiveConfig.repoLayout,
    effectiveConfig.showcaseRepos?.length,
    effectiveConfig.repoLimit
  ]);

  // Show static version during SSR/hydration
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading repository showcase...
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Generating repository showcase...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm mb-2">Error: {error}</p>
            <button
              onClick={() => generateRepositoryShowcase(effectiveConfig)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        
        {(effectiveConfig.showcaseRepos?.length ?? 0) === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Add repositories to showcase
          </div>
        ) : svgUrl ? (
          <div className="flex justify-center">
            <Image
              src={svgUrl}
              alt="Repository Showcase"
              width={displayDimensions.width}
              height={displayDimensions.height}
              className="max-w-full h-auto"
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized={true}
              priority={false}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
});

RepositoryShowcaseWidgetComponent.displayName = 'RepositoryShowcaseWidget';

// Create the final component with MarkdownExportable
const RepositoryShowcaseWidget = RepositoryShowcaseWidgetComponent as React.FC<RepositoryShowcaseWidgetProps> & MarkdownExportable;

RepositoryShowcaseWidget.generateMarkdown = (): string => {
  // This provides a default markdown template for repository showcase
  return '![Repository Showcase](https://your-domain.com/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)';
};

export default RepositoryShowcaseWidget;
