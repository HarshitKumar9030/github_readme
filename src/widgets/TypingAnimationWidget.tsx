'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { useTypingAnimationStore, TypingAnimationWidgetConfig } from '@/stores/typingAnimationStore';
import UnderConstruction from '@/components/UnderConstruction';

interface TypingAnimationWidgetProps extends BaseWidgetProps {
  config: TypingAnimationWidgetConfig;
  onConfigChange?: (config: TypingAnimationWidgetConfig) => void;
}

// Helper function to generate markdown with config
function generateMarkdownForConfig(config: TypingAnimationWidgetConfig): string {
  const effectiveConfig = {
    text: config.text || 'Hello, I am a developer!',
    theme: config.theme || 'default',
    fontFamily: config.font || 'monospace',
    fontSize: config.size || 24,
    color: config.color || '#3b82f6',
    speed: config.speed || 150,
    loop: config.loop !== false,
    cursor: config.cursor !== false,
    width: config.width || 600,
    height: config.height || 100,
    backgroundColor: config.backgroundColor || 'transparent',
    cursorColor: config.cursorColor || config.color || '#3b82f6',
    pauseAfter: config.pauseAfter || 2000
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
    height: effectiveConfig.height.toString(),
    backgroundColor: effectiveConfig.backgroundColor,
    cursorColor: effectiveConfig.cursorColor,
    pauseAfter: effectiveConfig.pauseAfter.toString()
  });

  const url = `/api/typing-animation?${params.toString()}`;

  let md = '';
  if (!config.hideTitle) {
    const title = config.customTitle || 'Typing Animation';
    md += `## ${title}\n\n`;
  }

  md += `<div align="center">\n\n`;
  md += `<img src="${url}" alt="Typing Animation" width="${effectiveConfig.width}" height="${effectiveConfig.height}" />\n\n`;
  md += `</div>\n\n`;

  return md;
}

const TypingAnimationWidgetComponent: React.FC<TypingAnimationWidgetProps> = React.memo(({ 
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
    generateTypingAnimation,
    resetState
  } = useTypingAnimationStore();

  // Memoize effective config to prevent unnecessary re-calculations
  const effectiveConfig = useMemo((): TypingAnimationWidgetConfig => ({
    text: config.text || 'Hello, I am a developer!',
    theme: config.theme || 'default',
    font: config.font || 'monospace',
    size: config.size || 24,
    color: config.color || '#3b82f6',
    speed: config.speed || 150,
    loop: config.loop !== false,
    cursor: config.cursor !== false,
    width: config.width || 600,
    height: config.height || 100,
    backgroundColor: config.backgroundColor || 'transparent',
    cursorColor: config.cursorColor || config.color || '#3b82f6',
    pauseAfter: config.pauseAfter || 2000,
    hideTitle: config.hideTitle,
    customTitle: config.customTitle,
    hideBorder: config.hideBorder,
    fontWeight: config.fontWeight,
    centered: config.centered,
    shadow: config.shadow,
    gradient: config.gradient,
    borderRadius: config.borderRadius
  }), [config]);

  // Generate markdown function
  const generateMarkdown = useCallback((): string => {
    return generateMarkdownForConfig(effectiveConfig);
  }, [effectiveConfig]);

  // Mount effect - simplified
  useEffect(() => {
    setMounted(true);
    return () => {
      resetState();
    };
  }, [setMounted, resetState]);
  // Animation generation effect - optimized to prevent infinite re-renders
  const configKey = useMemo(() => JSON.stringify(effectiveConfig), [effectiveConfig]);
  
  useEffect(() => {
    if (!mounted) return;
    generateTypingAnimation(effectiveConfig);
  }, [mounted, generateTypingAnimation, configKey, effectiveConfig]);

  // Markdown generation effect
  useEffect(() => {
    if (svgUrl && onMarkdownGenerated) {
      const timeoutId = setTimeout(() => {
        onMarkdownGenerated(generateMarkdown());
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [svgUrl, onMarkdownGenerated, generateMarkdown]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <UnderConstruction 
          title="Generating Animation" 
          message="Creating your typing animation..." 
          showHomeLink={false}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
        </div>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!svgUrl) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p>Configure your typing animation in the properties panel</p>
        </div>
      </div>
    );
  }

  // Only show the preview - no configuration panel
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center">
        <Image
          src={svgUrl}
          alt="Typing Animation"
          width={effectiveConfig.width || 600}
          height={effectiveConfig.height || 100}
          className="max-w-full h-auto rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          onError={(e) => {
            console.error('Failed to load typing animation image');
            // You could set an error state here if needed
          }}
          unoptimized // For SVG animations
        />
      </div>
        {/* Optional: Show basic info */}
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&ldquo;{effectiveConfig.text}&rdquo;</p>
        <p className="text-xs mt-1">
          {effectiveConfig.theme} theme • {effectiveConfig.size}px • {effectiveConfig.speed}ms speed
        </p>
      </div>
    </div>
  );
});

TypingAnimationWidgetComponent.displayName = 'TypingAnimationWidget';

// Export with MarkdownExportable functionality
const TypingAnimationWidget: React.FC<TypingAnimationWidgetProps> & MarkdownExportable = TypingAnimationWidgetComponent as any;

// Static markdown generation function
TypingAnimationWidget.generateMarkdown = function(): string {
  return generateMarkdownForConfig({
    text: 'Hello, I am a developer!',
    theme: 'default',
    font: 'monospace',
    size: 24,
    color: '#3b82f6',
    speed: 150,
    loop: true,
    cursor: true,
    width: 600,
    height: 100
  });
};

export default TypingAnimationWidget;
         