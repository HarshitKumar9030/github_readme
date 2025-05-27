'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';

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

const AnimatedProgressWidget: React.FC<AnimatedProgressWidgetProps> = ({
  config,
  onConfigChange
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Memoize the progressConfig to prevent unnecessary re-creation
  const progressConfig: AnimatedProgressWidgetConfig = useMemo(() => ({
    ...config,
    skills: config.skills || [],
    animationDuration: config.animationDuration || 2000,
    showProgressText: config.showProgressText ?? true,
    progressBarHeight: config.progressBarHeight || 20
  }), [config]);

  // Use direct config properties for better dependency tracking
  const generateSvgContent = useCallback(async () => {
    const skills = config.skills || [];
    const showProgressText = config.showProgressText ?? true;
    
    if (!skills || skills.length === 0) {
      setSvgContent('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const skillsParam = skills
        .map((skill: Skill) => `${encodeURIComponent(skill.name)}:${skill.level}`)
        .join(',');

      const params = new URLSearchParams({
        skills: skillsParam,
        animated: 'true',
        show_progress_text: showProgressText.toString(),
        theme: 'default',
        width: '400',
        height: '300'
      });

      const url = `${window.location.origin}/api/animated-progress?${params.toString()}`;
      console.log('Fetching animated progress from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const svgText = await response.text();
      setSvgContent(svgText);
      console.log('SVG content loaded successfully');
    } catch (err) {
      console.error('Error loading animated progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load animated progress');
      setSvgContent('');
    } finally {
      setIsLoading(false);
    }
  }, [config.skills, config.showProgressText]);
  useEffect(() => {
    generateSvgContent();
  }, [generateSvgContent]);

  const handleConfigChange = (updates: Partial<AnimatedProgressWidgetConfig>) => {
    const newConfig = {
      ...config,
      ...updates
    };
    if (onConfigChange) {
      onConfigChange(newConfig);
    }  };
  
  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        
        {(progressConfig.skills?.length || 0) === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Add skills to see the animated progress preview
          </div>
        ) : isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading animated progress...
          </div>        ) : error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            Error: {error}
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
  );
};

// Add MarkdownExportable interface to the component
(AnimatedProgressWidget as any).generateMarkdown = (config: AnimatedProgressWidgetConfig): string => {
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
    height: '300'
  });

  // Use the deployed domain or localhost for development
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000';
  const url = `${baseUrl}/api/animated-progress?${params.toString()}`;
  
  return `![Animated Progress](${url})`;
};

export default AnimatedProgressWidget as React.FC<AnimatedProgressWidgetProps> & MarkdownExportable;
