'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { useWidget } from '@/hooks/useWidget';
import WidgetContainer from '@/components/WidgetContainer';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

interface Skill {
  name: string;
  level: number;
  color?: string;
}

export interface AnimatedProgressWidgetConfig extends BaseWidgetConfig {
  skills?: Skill[];
  animationDuration?: number;
  showProgressText?: boolean;
  progressBarHeight?: number;
  hideTitle?: boolean;
  customTitle?: string;
  hideBorder?: boolean;
}

interface AnimatedProgressWidgetProps extends BaseWidgetProps {
  config: AnimatedProgressWidgetConfig;
  onConfigChange?: (config: AnimatedProgressWidgetConfig) => void;
}

const AnimatedProgressWidgetComponent = memo(({
  config,
  onConfigChange,
  onMarkdownGenerated
}: AnimatedProgressWidgetProps) => {
  // Memoize the effective config to prevent unnecessary re-creation
  const effectiveConfig = useMemo(() => ({
    ...config,
    skills: config.skills || [],
    animationDuration: config.animationDuration || 2000,
    showProgressText: config.showProgressText ?? true,
    progressBarHeight: config.progressBarHeight || 20
  }), [config]);

  // Use the unified widget hook for consistent state management
  const {
    content: svgContent,
    isLoading,
    error,
    refresh
  } = useWidget(
    useCallback(async () => {
      const skills = effectiveConfig.skills;
      
      if (!skills || skills.length === 0) {
        return '';
      }

      const skillsParam = skills
        .map((skill: Skill) => `${encodeURIComponent(skill.name)}:${skill.level}`)
        .join(',');

      const params = new URLSearchParams({
        skills: skillsParam,
        animated: 'true',
        show_progress_text: effectiveConfig.showProgressText.toString(),
        theme: 'default',
        width: '400',
        height: '300'
      });

      const url = `${window.location.origin}/api/animated-progress?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    }, [effectiveConfig]),
    [effectiveConfig.skills, effectiveConfig.showProgressText],
    { debounceMs: 300 }
  );
  // Generate markdown content function
  const generateMarkdownContent = useCallback((config: AnimatedProgressWidgetConfig): string => {
    const skills = config.skills || [];
    
    if (skills.length === 0) {
      return '<!-- Animated Progress: Please configure skills -->';
    }

    const skillsParam = skills
      .map((skill: Skill) => `${encodeURIComponent(skill.name)}:${skill.level}`)
      .join(',');

    const params = new URLSearchParams({
      skills: skillsParam,
      animated: 'true',
      show_progress_text: (config.showProgressText ?? true).toString(),
      theme: 'default',
      width: '400',
      height: '300'    });

    // Use the deployed domain or localhost for development
    const url = createAbsoluteUrl(`/api/animated-progress?${params.toString()}`);
    
    return `![Animated Progress](${url})`;
  }, []);

  // Generate markdown when config or data changes
  useEffect(() => {
    if (onMarkdownGenerated && !isLoading && !error) {
      const markdown = generateMarkdownContent(effectiveConfig);
      onMarkdownGenerated(markdown);
    }
  }, [effectiveConfig, onMarkdownGenerated, isLoading, error, generateMarkdownContent]);
  const handleConfigChange = (updates: Partial<AnimatedProgressWidgetConfig>) => {
    const newConfig = {
      ...config,
      ...updates
    };
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };
  
  return (
    <WidgetContainer
      widgetId={`animated-progress-${effectiveConfig.skills?.length || 0}`}
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      className="animated-progress-widget"
    >
      <div className="space-y-4">
        {/* Preview */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          
          {(effectiveConfig.skills?.length || 0) === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Add skills to see the animated progress preview
            </div>
          ) : svgContent ? (
            <div className="flex justify-center">
              <div 
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="max-w-full h-auto"
              />
            </div>
          ) : null}
        </div>
      </div>
    </WidgetContainer>
  );
});

AnimatedProgressWidgetComponent.displayName = 'AnimatedProgressWidget';

// Create the final component with MarkdownExportable interface
const AnimatedProgressWidget = AnimatedProgressWidgetComponent as unknown as React.FC<AnimatedProgressWidgetProps> & MarkdownExportable;

// Add MarkdownExportable interface to the component
AnimatedProgressWidget.generateMarkdown = function(): string {
  // This is a placeholder - the actual component instance will generate markdown
  return '';
};

export default AnimatedProgressWidget;
