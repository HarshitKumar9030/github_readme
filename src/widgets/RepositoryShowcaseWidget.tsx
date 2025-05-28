'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [mounted, setMounted] = useState<boolean>(false);

  // Ensure component is only interactive after mounting (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the effective config to prevent unnecessary re-calculations
  const effectiveConfig = useMemo(() => ({
    username: config.username || '',
    showcaseRepos: Array.isArray(config.showcaseRepos) ? config.showcaseRepos : [],
    theme: config.theme || 'default',
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

  // Single function to generate and load the repository showcase - similar to AnimatedProgressWidget
  const generateRepositoryShowcase = useCallback(async () => {
    // Don't generate URL until component is mounted to avoid hydration mismatch
    if (!mounted) {
      setSvgUrl('');
      return;
    }

    // Ensure showcaseRepos is an array and has content
    if (effectiveConfig.showcaseRepos.length === 0) {
      setSvgUrl('');
      return;
    }

    // Convert repository names to owner/repo format if needed
    const formattedRepos = effectiveConfig.showcaseRepos.map((repo: any) => {
      if (typeof repo !== 'string') return ''; // Skip invalid entries
      if (repo.includes('/')) {
        return repo; // Already in owner/repo format
      } else if (effectiveConfig.username?.trim()) {
        return `${effectiveConfig.username}/${repo}`; // Add username as owner
      }
      return repo;
    }).filter((repo: string) => repo && repo.includes('/')); // Only keep valid owner/repo pairs

    if (formattedRepos.length === 0) {
      setSvgUrl('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        repos: formattedRepos.join(','),
        theme: effectiveConfig.theme,
        layout: effectiveConfig.repoLayout,
        sortBy: effectiveConfig.sortBy,
        repoLimit: effectiveConfig.repoLimit.toString(),
        cardWidth: effectiveConfig.repoCardWidth.toString(),
        cardHeight: effectiveConfig.repoCardHeight.toString()
      });

      if (effectiveConfig.showStats !== undefined) {
        params.set('showStats', effectiveConfig.showStats.toString());
      }
      if (effectiveConfig.showLanguage !== undefined) {
        params.set('showLanguage', effectiveConfig.showLanguage.toString());
      }
      if (effectiveConfig.showDescription !== undefined) {
        params.set('showDescription', effectiveConfig.showDescription.toString());
      }
      if (effectiveConfig.showTopics !== undefined) {
        params.set('showTopics', effectiveConfig.showTopics.toString());
      }
      if (effectiveConfig.showLastUpdated !== undefined) {
        params.set('showLastUpdated', effectiveConfig.showLastUpdated.toString());
      }

      const url = createAbsoluteUrl(`/api/repo-showcase?${params.toString()}`);
      
      // Test the URL by making a request
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to generate repository showcase');
      }
      
      setSvgUrl(url);
      
      // Generate and emit markdown only after successful load
      if (onMarkdownGenerated) {
        const markdown = generateMarkdownForConfig(config);
        onMarkdownGenerated(markdown);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setSvgUrl('');
    } finally {
      setIsLoading(false);
    }
  }, [mounted, effectiveConfig, onMarkdownGenerated, config]);
  // Single useEffect with debouncing - similar to AnimatedProgressWidget pattern
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateRepositoryShowcase();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [generateRepositoryShowcase]);

  const handleConfigChange = (updates: Partial<RepositoryShowcaseWidgetConfig>) => {
    if (onConfigChange) {
      const newConfig = { ...config, ...updates };
      onConfigChange(newConfig);
    }
  };
  // Calculate display dimensions for different layouts
  const getDisplayDimensions = () => {
    const cardWidth = effectiveConfig.repoCardWidth;
    const cardHeight = effectiveConfig.repoCardHeight;
    const layout = effectiveConfig.repoLayout;
    
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
        const showcaseReposLength = effectiveConfig.showcaseRepos.length;
        displayHeight = cardHeight * Math.min(showcaseReposLength || 1, effectiveConfig.repoLimit) + 
                       (Math.min(showcaseReposLength || 1, effectiveConfig.repoLimit) - 1) * 10;
        break;
    }
    
    return { width: displayWidth, height: displayHeight };
  };
  const displayDimensions = getDisplayDimensions();

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
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        
        {effectiveConfig.showcaseRepos.length === 0 ? (
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
          <div className="flex justify-center">            <Image
              src={svgUrl}
              alt="Repository Showcase"
              width={displayDimensions.width}
              height={displayDimensions.height}
              className="max-w-full h-auto"
              unoptimized
              onError={() => setError('Failed to load repository showcase image')}
              onLoad={() => {
                setIsLoading(false);
                setError('');
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

RepositoryShowcaseWidget.generateMarkdown = (): string => {
  // This provides a default markdown template for repository showcase
  return '![Repository Showcase](https://your-domain.com/api/repo-showcase?repos=owner/repo1,owner/repo2&theme=github)';
};

export default RepositoryShowcaseWidget;
