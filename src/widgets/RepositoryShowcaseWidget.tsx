'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { useRepositoryShowcaseStore } from '@/stores/repositoryShowcaseStore';
import { getBaseUrl } from '@/utils/env';

export interface RepositoryShowcaseWidgetConfig extends BaseWidgetConfig {
  username?: string; // Optional - will be provided by parent component
  showcaseRepos?: string[];
  repoLayout?: 'single' | 'compact-grid' | 'horizontal' | 'vertical';
  sortBy?: 'stars' | 'forks' | 'updated' | 'name' | 'created';
  maxRepos?: number;
  cardSize?: 'small' | 'medium' | 'large';
  cardSpacing?: 'tight' | 'normal' | 'loose';
  showStats?: boolean;
  showLanguage?: boolean;
  showDescription?: boolean;
  showTopics?: boolean;
  showLastUpdated?: boolean;
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
  // Ensure showcaseRepos is an array and has content, limit to max 4
  const showcaseRepos = Array.isArray(config?.showcaseRepos) ? 
    config.showcaseRepos.slice(0, config.maxRepos || 4) : [];
  const baseUrl = getBaseUrl();
  
  if (!config || showcaseRepos.length === 0) {
    return `![Repository Showcase](${baseUrl}/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)`;
  }
  
  // Convert repository names to owner/repo format if needed
  const formattedRepos = showcaseRepos.map(repo => {
    if (typeof repo !== 'string') return ''; // Skip invalid entries
    
    // Clean the repo name (remove whitespace, newlines)
    const cleanRepo = repo.trim().replace(/\n/g, '');
    if (!cleanRepo) return '';
    
    if (cleanRepo.includes('/')) {
      return cleanRepo; // Already in owner/repo format
    } else if (config.username?.trim()) {
      return `${config.username}/${cleanRepo}`; // Add username as owner
    }
    return cleanRepo;
  }).filter(repo => repo && repo.includes('/')); // Only keep valid owner/repo pairs

  if (formattedRepos.length === 0) {
    return `![Repository Showcase](${baseUrl}/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)`;
  }

  // Calculate optimal card dimensions based on layout and card size
  const getCardDimensions = () => {
    const sizeMap = {
      small: { width: 300, height: 150 },
      medium: { width: 350, height: 175 },
      large: { width: 400, height: 200 }
    };
    return sizeMap[config.cardSize || 'medium'];
  };

  const cardDims = getCardDimensions();
  const spacingMap = { tight: 5, normal: 10, loose: 15 };
  const spacing = spacingMap[config.cardSpacing || 'normal'];

  const params = new URLSearchParams({
    repos: formattedRepos.join(','),
    theme: config.theme || 'light',
    layout: config.repoLayout || 'compact-grid',
    sortBy: config.sortBy || 'stars',
    maxRepos: (config.maxRepos || 4).toString(),
    cardWidth: cardDims.width.toString(),
    cardHeight: cardDims.height.toString(),
    spacing: spacing.toString()
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

  return `![Repository Showcase](${baseUrl}/api/repo-showcase?${params.toString()})`;
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
    showcaseRepos: Array.isArray(config.showcaseRepos) ? 
      config.showcaseRepos.slice(0, config.maxRepos || 4) : [],
    theme: config.theme || 'light',
    repoLayout: config.repoLayout || 'compact-grid',
    sortBy: config.sortBy || 'stars',
    maxRepos: config.maxRepos || 4,
    cardSize: config.cardSize || 'medium',
    cardSpacing: config.cardSpacing || 'normal',
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
    effectiveConfig.maxRepos,
    effectiveConfig.cardSize,
    effectiveConfig.cardSpacing,
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
    // Get card dimensions based on size setting
    const sizeMap = {
      small: { width: 300, height: 150 },
      medium: { width: 350, height: 175 },
      large: { width: 400, height: 200 }
    };
    
    const cardDims = sizeMap[effectiveConfig.cardSize || 'medium'];
    const spacingMap = { tight: 5, normal: 10, loose: 15 };
    const spacing = spacingMap[effectiveConfig.cardSpacing || 'normal'];
    const layout = effectiveConfig.repoLayout || 'compact-grid';
    const repoCount = effectiveConfig.showcaseRepos?.length ?? 0;
    const maxRepos = Math.min(repoCount, effectiveConfig.maxRepos || 4);
    
    let displayWidth = cardDims.width;
    let displayHeight = cardDims.height;
    
    switch (layout) {
      case 'compact-grid':
        if (maxRepos === 1) {
          // Single card
          displayWidth = cardDims.width;
          displayHeight = cardDims.height;
        } else if (maxRepos === 2) {
          // 2 cards horizontally
          displayWidth = cardDims.width * 2 + spacing;
          displayHeight = cardDims.height;
        } else if (maxRepos <= 4) {
          // 2x2 grid for 3-4 repos
          displayWidth = cardDims.width * 2 + spacing;
          displayHeight = cardDims.height * 2 + spacing;
        }
        break;
      case 'horizontal':
        displayWidth = cardDims.width * Math.min(maxRepos, 4) + spacing * (Math.min(maxRepos, 4) - 1);
        displayHeight = cardDims.height;
        break;
      case 'vertical':
        displayWidth = cardDims.width;
        displayHeight = cardDims.height * maxRepos + spacing * (maxRepos - 1);
        break;
      case 'single':
      default:
        displayWidth = cardDims.width;
        displayHeight = cardDims.height;
        break;
    }
    
    return { width: displayWidth, height: displayHeight };
  }, [
    effectiveConfig.cardSize,
    effectiveConfig.cardSpacing,
    effectiveConfig.repoLayout,
    effectiveConfig.showcaseRepos?.length,
    effectiveConfig.maxRepos
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
  const baseUrl = getBaseUrl();
  return `![Repository Showcase](${baseUrl}/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)`;
};

export default RepositoryShowcaseWidget;
