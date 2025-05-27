'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';

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
const WaveAnimationWidget: React.FC<WaveAnimationWidgetProps> & MarkdownExportable = ({ 
  config, 
  onConfigChange,
  onMarkdownGenerated 
}) => {
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Set default configuration values
  const effectiveConfig = {
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
  };

  // Generate SVG URL when config changes
  useEffect(() => {
    const generateSvgUrl = () => {
      setLoading(true);
      setError(null);      try {
        // Convert speed string to numeric value
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
        setSvgUrl(url);

        // Generate markdown
        if (onMarkdownGenerated) {
          setTimeout(() => {
            onMarkdownGenerated(generateMarkdown());
          }, 100);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate wave animation');
      } finally {
        setLoading(false);
      }
    };    generateSvgUrl();
  }, [
    effectiveConfig.waveColor,
    effectiveConfig.waveSecondaryColor,
    effectiveConfig.waveSpeed,
    effectiveConfig.waveCount,
    effectiveConfig.width,
    effectiveConfig.height,
    effectiveConfig.theme,
    onMarkdownGenerated
  ]);

  // Generate markdown for the widget
  const generateMarkdown = (): string => {
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
  };

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
        <p className="text-red-600 dark:text-red-400 text-sm">Error: {error}</p>
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
      )}      {/* Wave Animation Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {svgUrl && (
          <Image
            src={svgUrl}
            alt="Wave Animation"
            width={effectiveConfig.width}
            height={effectiveConfig.height}
            className="w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </div>
    </div>
  );
};

// Export the markdown generation function
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

  const params = new URLSearchParams({
    color: effectiveConfig.waveColor,
    secondaryColor: effectiveConfig.waveSecondaryColor,
    speed: effectiveConfig.waveSpeed,
    count: effectiveConfig.waveCount.toString(),
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

export default WaveAnimationWidget;
