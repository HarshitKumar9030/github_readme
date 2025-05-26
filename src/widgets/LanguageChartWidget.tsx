'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  chartType?: 'donut' | 'pie' | 'bar'; // New chart types
}

interface LanguageChartWidgetProps extends BaseWidgetProps {
  config: LanguageChartWidgetConfig;
  onConfigChange?: (config: LanguageChartWidgetConfig) => void;
}

const LanguageChartWidget: React.FC<LanguageChartWidgetProps> = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // Memoize SVG URL to prevent unnecessary re-renders
  const svgUrl = useMemo(() => {
    if (!config.username?.trim()) {
      return '';
    }

    const params = new URLSearchParams({
      username: config.username,
      theme: config.theme || 'dark',
      size: (config.size || 400).toString(),
      chartType: config.chartType || 'donut',
      maxLanguages: Math.min(config.maxLanguages || 8, 8).toString()
    });

    if (config.minPercentage) {
      params.set('minPercentage', config.minPercentage.toString());
    }

    return createAbsoluteUrl(`/api/language-chart?${params.toString()}`);
  }, [config.username, config.theme, config.size, config.chartType, config.maxLanguages, config.minPercentage]);

  // Load preview with proper error handling and debouncing
  useEffect(() => {
    if (!svgUrl) {
      setError('');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(svgUrl);
        if (!response.ok) {
          throw new Error(`Failed to generate chart: ${response.status}`);
        }
        
        // Generate markdown when successful
        if (onMarkdownGenerated) {
          const markdown = (LanguageChartWidget as any).generateMarkdown(config);
          onMarkdownGenerated(markdown);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        console.warn('Language chart error:', errorMsg);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [svgUrl, onMarkdownGenerated, config]);

  const handleConfigChange = useCallback((updates: Partial<LanguageChartWidgetConfig>) => {
    if (onConfigChange) {
      const newConfig = { ...config, ...updates };
      onConfigChange(newConfig);
    }
  }, [config, onConfigChange]);
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          🌐 Language Chart Configuration
        </h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">GitHub Username</label>
          <input
            type="text"
            value={config.username || ''}
            onChange={(e) => handleConfigChange({ username: e.target.value })}
            placeholder="Enter GitHub username (e.g., octocat, torvalds)"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ⚡ Ultra-fast parallel processing with advanced caching
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chart Type</label>
            <select
              value={config.chartType || 'donut'}
              onChange={(e) => handleConfigChange({ chartType: e.target.value as 'donut' | 'pie' | 'bar' })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="donut">🍩 Donut Chart</option>
              <option value="pie">🥧 Pie Chart</option>
              <option value="bar">📊 Bar Chart</option>
            </select>
          </div>          <div>
            <label className="block text-sm font-medium mb-2">Max Languages</label>
            <select
              value={Math.min(config.maxLanguages || 8, 8)}
              onChange={(e) => handleConfigChange({ maxLanguages: Math.min(parseInt(e.target.value), 8) })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={8}>Top 8</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Chart Size: {config.size || 400}px
          </label>
          <input
            type="range"
            min="300"
            max="600"
            step="50"
            value={config.size || 400}
            onChange={(e) => handleConfigChange({ size: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>300px</span>
            <span>450px</span>
            <span>600px</span>
          </div>
        </div>

        {config.chartType !== 'bar' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Percentage: {config.minPercentage || 1}%
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={config.minPercentage || 1}
              onChange={(e) => handleConfigChange({ minPercentage: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Hide languages with less than {config.minPercentage || 1}% usage
            </div>
          </div>
        )}
      </div>      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Preview</h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Processing...
            </div>
          )}
        </div>
        
        {!config.username?.trim() ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">🚀</div>
            <div className="text-lg font-medium mb-2">Ultra-Fast Language Charts</div>
            <div className="mb-4">Enter a GitHub username to see lightning-fast chart generation</div>
            <div className="text-xs space-y-1">
              <div>✨ Parallel API processing</div>
              <div>🔄 Advanced caching system</div>
              <div>🎨 Beautiful modern UI</div>
            </div>
            <div className="mt-4 text-sm">
              <span className="font-medium">Try examples:</span> octocat, torvalds, defunkt
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⚠️</div>
            <div className="text-red-600 dark:text-red-400 font-medium mb-2">
              {error.includes('404') ? 'User not found' : 
               error.includes('403') ? 'Rate limit exceeded' : 
               'Chart generation failed'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {error.includes('404') ? `Username "${config.username}" doesn't exist on GitHub` :
               error.includes('403') ? 'GitHub API rate limit exceeded. Please try again in a few minutes.' :
               error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              🔄 Retry
            </button>
          </div>
        ) : svgUrl ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative group">
                <Image
                  src={svgUrl}
                  alt={`${config.username}'s Language Chart`}
                  width={config.size || 400}
                  height={config.size || 400}
                  className="max-w-full h-auto rounded-lg shadow-lg transition-transform group-hover:scale-105"
                  onError={() => setError('Failed to load chart. Please check the username.')}
                  onLoad={() => setError('')}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
              </div>
            </div>
            
            {/* Performance Info */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
                <span className="text-lg">⚡</span>
                <div>
                  <div className="font-medium">High-Performance Processing</div>
                  <div className="text-xs opacity-80">
                    Concurrent API calls • Smart caching • Real-time generation
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Add MarkdownExportable interface to the component
(LanguageChartWidget as any).generateMarkdown = (config: LanguageChartWidgetConfig): string => {
  if (!config.username?.trim()) {
    return '<!-- Language Chart: Please configure username -->';
  }
  const params = new URLSearchParams({
    username: config.username,
    theme: config.theme || 'dark',
    size: (config.size || 400).toString(),
    chartType: config.chartType || 'donut',
    maxLanguages: Math.min(config.maxLanguages || 8, 8).toString()
  });

  if (config.minPercentage) {
    params.set('minPercentage', config.minPercentage.toString());
  }

  // Use the deployed domain or localhost for development
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000';
  const url = `${baseUrl}/api/language-chart?${params.toString()}`;
  
  const chartTypeEmoji = config.chartType === 'pie' ? '🥧' : config.chartType === 'bar' ? '📊' : '🍩';
  return `![${chartTypeEmoji} ${config.username}'s Language Chart](${url})`;
};

export default LanguageChartWidget as React.FC<LanguageChartWidgetProps> & MarkdownExportable;
