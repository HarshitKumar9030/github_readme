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

  const addRepository = () => {
    const repoName = prompt('Enter repository name:');
    if (repoName?.trim()) {
      const newRepos = [...(config.showcaseRepos || []), repoName.trim()];
      handleConfigChange({ showcaseRepos: newRepos });
    }
  };

  const removeRepository = (index: number) => {
    const newRepos = config.showcaseRepos?.filter((_, i) => i !== index) || [];
    handleConfigChange({ showcaseRepos: newRepos });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold mb-3">Repository Showcase Configuration</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">GitHub Username</label>
          <input
            type="text"
            value={config.username || ''}
            onChange={(e) => handleConfigChange({ username: e.target.value })}
            placeholder="Enter GitHub username"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Showcase Repositories</label>
          <div className="space-y-2">
            {config.showcaseRepos?.map((repo, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => {
                    const newRepos = [...(config.showcaseRepos || [])];
                    newRepos[index] = e.target.value;
                    handleConfigChange({ showcaseRepos: newRepos });
                  }}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => removeRepository(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addRepository}
              className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              + Add Repository
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showStars"
              checked={config.showStars !== false}
              onChange={(e) => handleConfigChange({ showStars: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="showStars" className="text-sm font-medium">
              Show Stars
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showForks"
              checked={config.showForks !== false}
              onChange={(e) => handleConfigChange({ showForks: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="showForks" className="text-sm font-medium">
              Show Forks
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showLanguage"
              checked={config.showLanguage !== false}
              onChange={(e) => handleConfigChange({ showLanguage: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="showLanguage" className="text-sm font-medium">
              Show Language
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showDescription"
              checked={config.showDescription !== false}
              onChange={(e) => handleConfigChange({ showDescription: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="showDescription" className="text-sm font-medium">
              Show Description
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Width</label>
            <input
              type="range"
              min="300"
              max="600"
              value={config.width || 400}
              onChange={(e) => handleConfigChange({ width: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.width || 400}px
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <input
              type="range"
              min="150"
              max="300"
              value={config.height || 200}
              onChange={(e) => handleConfigChange({ height: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.height || 200}px
            </div>
          </div>
        </div>
      </div>

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
