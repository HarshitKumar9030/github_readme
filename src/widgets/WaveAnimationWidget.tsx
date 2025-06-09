'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
const WaveAnimationWidgetComponent: React.FC<WaveAnimationWidgetProps> = React.memo(({ 
  config, 
  onConfigChange,
  onMarkdownGenerated 
}) => {
  const { 
    svgUrl, 
    loading, 
    error, 
    mounted,
    setMounted,
    generateWaveAnimation,
    resetState 
  } = useWaveAnimationStore();

  // Create stable references
  const onMarkdownGeneratedRef = useRef(onMarkdownGenerated);

  // Update ref when callback changes
  useEffect(() => {
    onMarkdownGeneratedRef.current = onMarkdownGenerated;
  }, [onMarkdownGenerated]);

  // Memoize effective config to prevent unnecessary recalculations
  const effectiveConfig = useMemo(() => ({
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

  // Memoize markdown generation function
  const generateMarkdown = useCallback((): string => {
    if (!svgUrl) return '';

    let md = '';
    
    if (!effectiveConfig.hideTitle) {
      const title = effectiveConfig.customTitle || 'Wave Animation';
      md += `## ${title}\n\n`;
    }

    md += `<div align="center">\n\n`;
    md += `<img src="${typeof window !== 'undefined' ? window.location.origin : ''}${svgUrl}" alt="Wave Animation" width="${effectiveConfig.width}" height="${effectiveConfig.height}" />\n\n`;
    md += `</div>\n\n`;

    return md;
  }, [svgUrl, effectiveConfig.hideTitle, effectiveConfig.customTitle, effectiveConfig.width, effectiveConfig.height]);

  // Mount effect
  useEffect(() => {
    setMounted(true);
    return () => {
      resetState();
    };
  }, [setMounted, resetState]);

  // Animation generation effect
  useEffect(() => {
    if (!mounted) return;

    generateWaveAnimation(effectiveConfig);
  }, [
    mounted,
    generateWaveAnimation,
    effectiveConfig.waveColor,
    effectiveConfig.waveSecondaryColor,
    effectiveConfig.waveSpeed,
    effectiveConfig.waveCount,
    effectiveConfig.width,
    effectiveConfig.height,
    effectiveConfig.theme
  ]);

  // Markdown generation effect with stable ref
  useEffect(() => {
    if (svgUrl && onMarkdownGeneratedRef.current) {
      const timeoutId = setTimeout(() => {
        onMarkdownGeneratedRef.current!(generateMarkdown());
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [svgUrl, generateMarkdown]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Generating wave animation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm mb-2">Error: {error}</p>
        <button
          onClick={() => generateWaveAnimation(effectiveConfig)}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
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
            unoptimized={true}
            priority={false}
          />
        )}
      </div>
    </div>
  );
});

WaveAnimationWidgetComponent.displayName = 'WaveAnimationWidget';

const WaveAnimationWidget = WaveAnimationWidgetComponent as React.FC<WaveAnimationWidgetProps> & MarkdownExportable;

WaveAnimationWidget.generateMarkdown = function(): string {
  const effectiveConfig = {
    waveColor: '#4F46E5',
    waveSecondaryColor: '#7C3AED',
    waveSpeed: 'medium' as const,
    waveCount: 3,
    width: 800,
    height: 200,
    theme: 'light'
  };

  const speedMap = {
    'slow': 0.5,
    'medium': 1.0,
    'fast': 2.0
  };

  const params = new URLSearchParams({
    color: effectiveConfig.waveColor,
    waves: effectiveConfig.waveCount.toString(),
    speed: speedMap[effectiveConfig.waveSpeed].toString(),
    width: effectiveConfig.width.toString(),
    height: effectiveConfig.height.toString(),
    theme: effectiveConfig.theme
  });

  // Add secondary color if provided and different from primary
  if (effectiveConfig.waveSecondaryColor && effectiveConfig.waveSecondaryColor !== effectiveConfig.waveColor) {
    params.set('secondaryColor', effectiveConfig.waveSecondaryColor);
  }

  const url = `/api/wave-animation?${params.toString()}`;

  let md = '';
  
  const title = 'Wave Animation';
  md += `## ${title}\n\n`;

  md += `<div align="center">\n\n`;
  md += `<img src="${url}" alt="Wave Animation" width="${effectiveConfig.width}" height="${effectiveConfig.height}" />\n\n`;
  md += `</div>\n\n`;

  return md;
};

export default WaveAnimationWidget;
