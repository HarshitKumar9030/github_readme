'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { createAbsoluteUrl } from '@/utils/urlHelpers';
import { useLanguageChartStore } from '@/stores/languageChartStore';

export interface LanguageChartWidgetConfig extends BaseWidgetConfig {
  username: string;
  showPercentages?: boolean;
  size?: number;
  minPercentage?: number;
  maxLanguages?: number;
  hideBorder?: boolean;
  hideTitle?: boolean;
  customTitle?: string;
  chartType?: 'donut' | 'pie' | 'bar'; 
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
  // Zustand store hooks
  const { 
    svgUrl, 
    loading, 
    error, 
    mounted,
    setMounted,
    generateLanguageChart,
    resetState 
  } = useLanguageChartStore();

  const effectiveConfig = useMemo(() => ({
    username: config.username || '',
    theme: config.theme || 'dark',
    size: config.size || 400,
    chartType: config.chartType || 'donut',
    maxLanguages: config.maxLanguages || 8,
    minPercentage: config.minPercentage,
    hideBorder: config.hideBorder,
    hideTitle: config.hideTitle,
    customTitle: config.customTitle,
    showPercentages: config.showPercentages
  }), [config]);

  const generateMarkdown = useCallback((): string => {
    if (!effectiveConfig.username?.trim()) {
      return '<!-- Language Chart: Please configure username -->';
    }
    
    const params = new URLSearchParams({
      username: effectiveConfig.username,
      theme: effectiveConfig.theme,
      size: effectiveConfig.size.toString(),
      chartType: effectiveConfig.chartType,
      maxLanguages: Math.min(effectiveConfig.maxLanguages, 8).toString()
    });

    if (effectiveConfig.minPercentage) {
      params.set('minPercentage', effectiveConfig.minPercentage.toString());
    }

    const url = createAbsoluteUrl(`/api/language-chart?${params.toString()}`);
    const chartTypeEmoji = effectiveConfig.chartType === 'pie' ? '🥧' : effectiveConfig.chartType === 'bar' ? '📊' : '🍩';
    return `![${chartTypeEmoji} ${effectiveConfig.username}'s Language Chart](${url})`;
  }, [effectiveConfig]);

  useEffect(() => {
    setMounted(true);
    return () => {
      resetState();
    };
  }, [setMounted, resetState]);

  useEffect(() => {
    if (!mounted) return;

    generateLanguageChart(effectiveConfig);
  }, [
    mounted,
    generateLanguageChart,
    effectiveConfig.username,
    effectiveConfig.theme,
    effectiveConfig.size,
    effectiveConfig.chartType,
    effectiveConfig.maxLanguages,
    effectiveConfig.minPercentage
  ]);

  useEffect(() => {
    if (svgUrl && onMarkdownGenerated) {
      const timeoutId = setTimeout(() => {
        onMarkdownGenerated(generateMarkdown());
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [svgUrl, onMarkdownGenerated, generateMarkdown]);

  const handleConfigChange = useCallback((updates: Partial<LanguageChartWidgetConfig>) => {
    if (onConfigChange) {
      const newConfig = { ...config, ...updates };
      onConfigChange(newConfig);
    }
  }, [config, onConfigChange]);  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Preview</h3>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Processing...
            </div>
          )}
        </div>
        
        {!effectiveConfig.username?.trim() ? (
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
              {error.includes('404') || error.includes('not found') ? 'User not found' : 
               error.includes('403') || error.includes('rate limit') ? 'Rate limit exceeded' : 
               'Chart generation failed'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {error.includes('404') || error.includes('not found') ? `Username "${effectiveConfig.username}" doesn't exist on GitHub` :
               error.includes('403') || error.includes('rate limit') ? 'GitHub API rate limit exceeded. Please try again in a few minutes.' :
               error}
            </div>
            <button
              onClick={() => generateLanguageChart(effectiveConfig)}
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
                  alt={`${effectiveConfig.username}'s Language Chart`}
                  width={effectiveConfig.size}
                  height={effectiveConfig.size}
                  className="max-w-full h-auto rounded-lg shadow-lg transition-transform group-hover:scale-105"
                  onError={() => generateLanguageChart(effectiveConfig)}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
              </div>
            </div>
            
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
  
  const url = createAbsoluteUrl(`/api/language-chart?${params.toString()}`);
  const chartTypeEmoji = config.chartType === 'pie' ? '🥧' : config.chartType === 'bar' ? '📊' : '🍩';
  return `![${chartTypeEmoji} ${config.username}'s Language Chart](${url})`;
};

export default LanguageChartWidget as React.FC<LanguageChartWidgetProps> & MarkdownExportable;
