'use client';

import React, { useState, useEffect } from 'react';
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
    waveColor: config.waveColor || '#4F46E5',
    waveSecondaryColor: config.waveSecondaryColor || '#7C3AED',
    waveSpeed: config.waveSpeed || 'medium',
    waveCount: config.waveCount || 3,
    width: config.width || 800,
    height: config.height || 200,
    theme: config.theme || 'light',
    ...config
  };

  // Generate SVG URL when config changes
  useEffect(() => {
    const generateSvgUrl = () => {
      setLoading(true);
      setError(null);

      try {
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
    };

    generateSvgUrl();
  }, [
    effectiveConfig.waveColor,
    effectiveConfig.waveSecondaryColor,
    effectiveConfig.waveSpeed,
    effectiveConfig.waveCount,
    effectiveConfig.width,
    effectiveConfig.height,
    effectiveConfig.theme
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
      )}

      {/* Wave Animation Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {svgUrl && (
          <img
            src={svgUrl}
            alt="Wave Animation"
            width={effectiveConfig.width}
            height={effectiveConfig.height}
            className="w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </div>

      {/* Configuration Panel */}
      {onConfigChange && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Animation Settings</h4>
          
          {/* Wave Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                value={effectiveConfig.waveColor}
                onChange={(e) => onConfigChange({ ...config, waveColor: e.target.value })}
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Secondary Color
              </label>
              <input
                type="color"
                value={effectiveConfig.waveSecondaryColor}
                onChange={(e) => onConfigChange({ ...config, waveSecondaryColor: e.target.value })}
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
          </div>

          {/* Wave Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Speed
              </label>
              <select
                value={effectiveConfig.waveSpeed}
                onChange={(e) => onConfigChange({ ...config, waveSpeed: e.target.value as 'slow' | 'medium' | 'fast' })}
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              >
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wave Count
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={effectiveConfig.waveCount}
                onChange={(e) => onConfigChange({ ...config, waveCount: parseInt(e.target.value) })}
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height
              </label>
              <input
                type="number"
                min="100"
                max="400"
                step="50"
                value={effectiveConfig.height}
                onChange={(e) => onConfigChange({ ...config, height: parseInt(e.target.value) })}
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      )}
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
