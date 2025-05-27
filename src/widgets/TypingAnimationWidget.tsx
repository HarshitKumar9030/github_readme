'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

export interface TypingAnimationWidgetConfig extends BaseWidgetConfig {
  text?: string;
  font?: string;
  size?: number;
  color?: string;
  duration?: number;
  loop?: boolean;
  cursor?: boolean;
  width?: number;
  height?: number;
  hideTitle?: boolean;
  customTitle?: string;
  hideBorder?: boolean;
}

interface TypingAnimationWidgetProps extends BaseWidgetProps {
  config: TypingAnimationWidgetConfig;
  onConfigChange?: (config: TypingAnimationWidgetConfig) => void;
}

const TypingAnimationWidget: React.FC<TypingAnimationWidgetProps> & MarkdownExportable = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {  const [svgUrl, setSvgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the effective config to prevent unnecessary re-calculations
  const effectiveConfig = useMemo(() => ({
    text: config.text || 'Hello, I am a developer!',
    theme: config.theme || 'default',
    fontFamily: config.font || 'monospace',
    fontSize: config.size || 20,
    color: config.color || '#0066cc',
    speed: config.duration ? Math.floor(config.duration / (config.text || 'Hello, I am a developer!').length) : 150,
    loop: config.loop !== false,
    cursor: config.cursor !== false,
    width: config.width || 600,
    height: config.height || 100
  }), [config]);

  // Generate SVG URL and load preview in a single effect to prevent render loops
  useEffect(() => {
    let isMounted = true;
    
    const generateAndLoadPreview = async () => {
      if (!isMounted) return;
        // Generate URL
      const params = new URLSearchParams({
        text: effectiveConfig.text,
        theme: effectiveConfig.theme,
        fontFamily: effectiveConfig.fontFamily,
        fontSize: effectiveConfig.fontSize.toString(),
        color: effectiveConfig.color,
        speed: effectiveConfig.speed.toString(),
        loop: effectiveConfig.loop.toString(),
        cursor: effectiveConfig.cursor.toString(),
        width: effectiveConfig.width.toString(),
        height: effectiveConfig.height.toString()
      });

      const url = createAbsoluteUrl(`/api/typing-animation?${params.toString()}`);
      
      if (!isMounted) return;
      setSvgUrl(url);
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(url);
        if (!isMounted) return;
        
        if (!response.ok) {
          throw new Error('Failed to generate typing animation');
        }        // Generate markdown with current config
        if (onMarkdownGenerated) {
          const markdown = TypingAnimationWidget.generateMarkdown({
            text: effectiveConfig.text,
            theme: effectiveConfig.theme,
            font: effectiveConfig.fontFamily,
            size: effectiveConfig.fontSize,
            color: effectiveConfig.color,
            duration: Math.floor(effectiveConfig.speed * effectiveConfig.text.length),
            loop: effectiveConfig.loop,
            cursor: effectiveConfig.cursor,
            width: effectiveConfig.width,
            height: effectiveConfig.height
          });
          onMarkdownGenerated(markdown);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generateAndLoadPreview();

    return () => {
      isMounted = false;
    };
  }, [effectiveConfig, onMarkdownGenerated]);  const handleConfigChange = useCallback((updates: Partial<TypingAnimationWidgetConfig>) => {
    if (onConfigChange) {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Set new timeout for debounced update
      debounceTimeoutRef.current = setTimeout(() => {
        const newConfig = { ...config, ...updates };
        onConfigChange(newConfig);
      }, 300); // 300ms debounce
    }
  }, [config, onConfigChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold mb-3">Typing Animation Configuration</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Text to Type</label>
          <textarea
            value={config.text || 'Hello, I am a developer!'}
            onChange={(e) => handleConfigChange({ text: e.target.value })}
            placeholder="Enter text to animate"
            rows={3}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Font</label>
            <select
              value={config.font || 'monospace'}
              onChange={(e) => handleConfigChange({ font: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="monospace">Monospace</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="cursive">Cursive</option>
              <option value="fantasy">Fantasy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <input
              type="range"
              min="12"
              max="40"
              value={config.size || 20}
              onChange={(e) => handleConfigChange({ size: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.size || 20}px
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Text Color</label>
          <input
            type="color"
            value={config.color || '#0066cc'}
            onChange={(e) => handleConfigChange({ color: e.target.value })}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Animation Duration</label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={config.duration || 3000}
            onChange={(e) => handleConfigChange({ duration: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {config.duration || 3000}ms
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="loop"
              checked={config.loop !== false}
              onChange={(e) => handleConfigChange({ loop: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="loop" className="text-sm font-medium">
              Loop Animation
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="cursor"
              checked={config.cursor !== false}
              onChange={(e) => handleConfigChange({ cursor: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="cursor" className="text-sm font-medium">
              Show Cursor
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Width</label>
            <input
              type="range"
              min="400"
              max="800"
              value={config.width || 600}
              onChange={(e) => handleConfigChange({ width: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.width || 600}px
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <input
              type="range"
              min="60"
              max="200"
              value={config.height || 100}
              onChange={(e) => handleConfigChange({ height: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {config.height || 100}px
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading typing animation...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            Error: {error}
          </div>
        ) : svgUrl ? (
          <div className="flex justify-center">
            <Image
              src={svgUrl}
              alt="Typing Animation"
              width={config.width || 600}
              height={config.height || 100}
              className="max-w-full h-auto"
              onError={() => setError('Failed to load typing animation image')}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

TypingAnimationWidget.generateMarkdown = function(config?: TypingAnimationWidgetConfig): string {
  const effectiveConfig = {
    text: config?.text || 'Hello, I am a developer!',
    theme: config?.theme || 'default',
    fontFamily: config?.font || 'monospace',
    fontSize: config?.size || 20,
    color: config?.color || '#0066cc',
    speed: config?.duration ? Math.floor(config.duration / (config.text || 'Hello, I am a developer!').length) : 150,
    loop: config?.loop !== false,
    cursor: config?.cursor !== false,
    width: config?.width || 600,
    height: config?.height || 100
  };

  const params = new URLSearchParams({
    text: effectiveConfig.text,
    theme: effectiveConfig.theme,
    fontFamily: effectiveConfig.fontFamily,
    fontSize: effectiveConfig.fontSize.toString(),
    color: effectiveConfig.color,
    speed: effectiveConfig.speed.toString(),
    loop: effectiveConfig.loop.toString(),
    cursor: effectiveConfig.cursor.toString(),
    width: effectiveConfig.width.toString(),
    height: effectiveConfig.height.toString()
  });

  const url = createAbsoluteUrl(`/api/typing-animation?${params.toString()}`);
  return `![Typing Animation](${url})`;
};

export default TypingAnimationWidget;
