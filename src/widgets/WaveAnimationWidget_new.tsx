'use client';

import React, { useEffect, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { useWaveAnimationStore } from '@/stores/waveAnimationStore';

export interface WaveAnimationWidgetConfig extends BaseWidgetConfig {
  waveColor?: string;
  waveSecondaryColor?: string;
  waveSpeed?: 'slow' | 'medium' | 'fast';
  waveCount?: number;
  width?: number;
  height?: number;
  hideTitle?: boolean;
  customTitle?: string;
}

interface WaveAnimationWidgetProps extends BaseWidgetProps {
  config: WaveAnimationWidgetConfig;
  onConfigChange?: (config: WaveAnimationWidgetConfig) => void;
}

/**
 * Wave Animation Widget that generates animated SVG waves
 */
const WaveAnimationWidget = memo<WaveAnimationWidgetProps>(({ 
  config, 
  onConfigChange,
  onMarkdownGenerated 
}) => {
  // Get state and actions from Zustand store
  const {
    svgUrl,
    loading,
    error,
    mounted,
    setMounted,
    generateWaveAnimation,
    resetState
  } = useWaveAnimationStore();

  // Memoize the effective configuration to prevent unnecessary re-calculations
  const effectiveConfig = useMemo<WaveAnimationWidgetConfig>(() => ({
    waveColor: config.waveColor || '#0099ff',
    waveSecondaryColor: config.waveSecondaryColor || '#00ccff',
    waveSpeed: config.waveSpeed || 'medium',
    waveCount: config.waveCount || 3,
    width: config.width || 800,
    height: config.height || 200,
    theme: config.theme || 'light',
    hideTitle: config.hideTitle || false,
    customTitle: config.customTitle || '',
    ...config
  }), [config]);

  // Memoize markdown generation function to prevent recreation
  const generateMarkdown = useCallback((): string => {
    if (!svgUrl) return '';

    let md = '';
    
    if (!effectiveConfig.hideTitle) {
      const title = effectiveConfig.customTitle || 'Wave Animation';
      md += `## ${title}\n\n`;
    }

    md += `<div align="center">\n\n`;
    md += `<img src="${window.location.origin}${svgUrl}" alt="Wave Animation" width="${effectiveConfig.width}" height="${effectiveConfig.height}" />\n\n`;
    md += `</div>\n\n`;

    return md;
  }, [svgUrl, effectiveConfig.hideTitle, effectiveConfig.customTitle, effectiveConfig.width, effectiveConfig.height]);

  // Mount effect
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, [setMounted]);

  // Generate wave animation when config changes
  useEffect(() => {
    if (!mounted) return;

    generateWaveAnimation(effectiveConfig);
  }, [mounted, generateWaveAnimation, effectiveConfig]);

  // Generate markdown when SVG URL changes
  useEffect(() => {
    if (onMarkdownGenerated && svgUrl && !loading && !error) {
      const markdown = generateMarkdown();
      onMarkdownGenerated(markdown);
    }
  }, [onMarkdownGenerated, svgUrl, loading, error, generateMarkdown]);

  // Handle config changes with proper debouncing
  const handleConfigChange = useCallback((updates: Partial<WaveAnimationWidgetConfig>) => {
    if (onConfigChange) {
      const newConfig = { ...config, ...updates };
      onConfigChange(newConfig);
    }
  }, [config, onConfigChange]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Generating wave animation...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-red-600 dark:text-red-400 text-sm">Error: {error}</p>
          <button
            onClick={() => generateWaveAnimation(effectiveConfig)}
            className="ml-4 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Widget Title */}
      {!effectiveConfig.hideTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {effectiveConfig.customTitle || 'Wave Animation'}
        </h3>
      )}

      {/* Wave Animation Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {svgUrl && (
          <Image
            src={svgUrl}
            alt="Wave Animation"
            width={effectiveConfig.width}
            height={effectiveConfig.height}
            className="w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
            priority={false}
            unoptimized={true}
          />
        )}
      </div>
    </div>
  );
});

WaveAnimationWidget.displayName = 'WaveAnimationWidget';

// Export the markdown generation function for static usage
const generateStaticMarkdown = function(): string {
  const effectiveConfig = {
    waveColor: '#4F46E5',
    waveSecondaryColor: '#7C3AED',
    waveSpeed: 'medium' as const,
    waveCount: 3,
    width: 800,
    height: 200,
    theme: 'light'
  };

  const params = new URLSearchParams({
    color: effectiveConfig.waveColor,
    secondaryColor: effectiveConfig.waveSecondaryColor,
    speed: '1.0',
    waves: effectiveConfig.waveCount.toString(),
    width: effectiveConfig.width.toString(),
    height: effectiveConfig.height.toString(),
    theme: effectiveConfig.theme
  });

  const url = `/api/wave-animation?${params.toString()}`;

  let md = '';
  
  const title = 'Wave Animation';
  md += `## ${title}\n\n`;

  md += `<div align="center">\n\n`;
  md += `<img src="${url}" alt="Wave Animation" width="${effectiveConfig.width}" height="${effectiveConfig.height}" />\n\n`;
  md += `</div>\n\n`;

  return md;
};

// Attach the static markdown generation function
(WaveAnimationWidget as any).generateMarkdown = generateStaticMarkdown;

export default WaveAnimationWidget as React.FC<WaveAnimationWidgetProps> & MarkdownExportable;
