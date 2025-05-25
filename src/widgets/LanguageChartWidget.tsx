'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

export interface LanguageChartWidgetConfig extends BaseWidgetConfig {
  username: string;
  showPercentages?: boolean;
  size?: number;
  minPercentage?: number;
  maxLanguages?: number;
  hideBorder?: boolean;
  hideTitle?: boolean;
  customTitle?: string;
}

interface LanguageChartWidgetProps extends BaseWidgetProps {
  config: LanguageChartWidgetConfig;
  onConfigChange?: (config: LanguageChartWidgetConfig) => void;
}

const LanguageChartWidget: React.FC<LanguageChartWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateSvgUrl = useCallback(() => {
    if (!config.username?.trim()) {
      setSvgUrl('');
      return;
    }

    const params = new URLSearchParams({
      username: config.username,
      showPercentages: (config.showPercentages ?? true).toString(),
      theme: config.theme || 'default',
      size: (config.size || 300).toString()
    });

    if (config.minPercentage) {
      params.set('minPercentage', config.minPercentage.toString());
    }
    if (config.maxLanguages) {
      params.set('maxLanguages', config.maxLanguages.toString());
    }

    const url = createAbsoluteUrl(`/api/language-chart?${params.toString()}`);
    setSvgUrl(url);
  }, [config.username, config.showPercentages, config.theme, config.size, config.minPercentage, config.maxLanguages]);

  const loadPreview = useCallback(async () => {
    if (!svgUrl) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(svgUrl);
      if (!response.ok) {
        throw new Error('Failed to generate language chart');
      }
      
      if (onMarkdownGenerated) {
        const markdown = LanguageChartWidget.generateMarkdown();
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

  const handleConfigChange = (updates: Partial<LanguageChartWidgetConfig>) => {
    if (onConfigChange) {
      const newConfig = { ...config, ...updates };
      onConfigChange(newConfig);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold mb-3">Language Chart Configuration</h3>
        
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPercentages"
            checked={config.showPercentages ?? true}
            onChange={(e) => handleConfigChange({ showPercentages: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="showPercentages" className="text-sm font-medium">
            Show Percentages
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Chart Size</label>
          <input
            type="range"
            min="200"
            max="500"
            value={config.size || 300}
            onChange={(e) => handleConfigChange({ size: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {config.size || 300}px
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        
        {!config.username?.trim() ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Enter a GitHub username to see the language chart preview
          </div>
        ) : isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading language chart...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            Error: {error}
          </div>
        ) : svgUrl ? (
          <div className="flex justify-center">
            <Image
              src={svgUrl}
              alt="Language Chart"
              width={config.size || 300}
              height={config.size || 300}
              className="max-w-full h-auto"
              onError={() => setError('Failed to load language chart image')}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

LanguageChartWidget.generateMarkdown = (): string => {
  return '![Language Chart](https://your-domain.com/api/language-chart?username=yourusername&theme=github)';
};

export default LanguageChartWidget;
