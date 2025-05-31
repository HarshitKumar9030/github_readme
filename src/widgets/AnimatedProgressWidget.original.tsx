'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import { useAnimatedProgressStore, Skill, AnimatedProgressConfig } from '@/stores/animatedProgressStore';
import WidgetContainer from '@/components/WidgetContainer';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

export interface AnimatedProgressWidgetConfig extends BaseWidgetConfig {
  skills?: Skill[];
  animationDuration?: number;
  showProgressText?: boolean;
  progressBarHeight?: number;
  hideTitle?: boolean;
  customTitle?: string;
  hideBorder?: boolean;
  width?: number;
  height?: number;
}

interface AnimatedProgressWidgetProps extends BaseWidgetProps {
  config: AnimatedProgressWidgetConfig;
  onConfigChange?: (config: AnimatedProgressWidgetConfig) => void;
}

const AnimatedProgressWidget: React.FC<AnimatedProgressWidgetProps> = ({
  config,
  onConfigChange,
  onMarkdownGenerated
}) => {
  const { svgUrl, loading, error, generateSvg } = useAnimatedProgressStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);  // Merge configuration with memoization
  const finalConfig = useMemo(() => {
    const defaultConfig: AnimatedProgressWidgetConfig = {
      skills: [
        { name: 'JavaScript', level: 90, color: '#F1E05A' },
        { name: 'TypeScript', level: 85, color: '#3178C6' },
        { name: 'React', level: 80, color: '#61DAFB' }
      ],
      animationDuration: 2000,
      showProgressText: true,
      progressBarHeight: 20,
      hideTitle: false,
      customTitle: 'Skills & Technologies',
      hideBorder: false,
      width: 400,
      height: 300,
      theme: 'light'
    };

    return {
      ...defaultConfig,
      ...config
    };
  }, [config]);

  // Generate API URL function
  const generateApiUrl = useCallback((cfg: AnimatedProgressConfig) => {
    const params = new URLSearchParams();
    
    if (cfg.skills && cfg.skills.length > 0) {
      const skillsParam = cfg.skills
        .map(skill => `${encodeURIComponent(skill.name)}:${skill.level}${skill.color ? `:${skill.color}` : ''}`)
        .join(',');
      params.set('skills', skillsParam);
    }

    params.set('animated', 'true');
    params.set('showPercentage', (cfg.showProgressText ?? true).toString());
    params.set('theme', cfg.theme || 'default');
    params.set('width', (cfg.width || 400).toString());
    params.set('height', (cfg.height || 300).toString());
    params.set('title', cfg.customTitle || 'Skills');
    
    if (cfg.animationDuration) {
      params.set('animationDuration', cfg.animationDuration.toString());
    }
    
    if (cfg.progressBarHeight) {
      params.set('barHeight', cfg.progressBarHeight.toString());
    }
    
    if (cfg.hideTitle) {
      params.set('hideTitle', 'true');
    }
    
    if (cfg.hideBorder) {
      params.set('hideBorder', 'true');
    }

    return `/api/animated-progress?${params.toString()}`;
  }, []);

  // Generate SVG when mounted or config changes
  useEffect(() => {
    if (!mounted) return;

    const progressConfig: AnimatedProgressConfig = {
      skills: finalConfig.skills || [],
      animationDuration: finalConfig.animationDuration,
      showProgressText: finalConfig.showProgressText,
      progressBarHeight: finalConfig.progressBarHeight,
      hideTitle: finalConfig.hideTitle,
      customTitle: finalConfig.customTitle,
      hideBorder: finalConfig.hideBorder,
      width: finalConfig.width,
      height: finalConfig.height,
      theme: finalConfig.theme
    };

    generateSvg(progressConfig);

    // Generate markdown
    if (onMarkdownGenerated) {
      const apiUrl = generateApiUrl(progressConfig);
      const absoluteUrl = createAbsoluteUrl(apiUrl);
      const markdown = `![${finalConfig.customTitle || 'Skills & Technologies'}](${absoluteUrl})`;
      onMarkdownGenerated(markdown);
    }
  }, [mounted, finalConfig, generateSvg, onMarkdownGenerated, generateApiUrl]);
  if (!mounted) {
    return (
      <WidgetContainer 
        widgetId="animated-progress" 
        isLoading={true}
        className="min-h-[200px]"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer 
      widgetId="animated-progress" 
      isLoading={loading} 
      error={error}
      className="min-h-[200px]"
    >
      <div className="flex flex-col items-center justify-center space-y-4 p-4">
        {svgUrl && !loading && !error ? (
          <div className="relative">
            <Image
              src={svgUrl}
              alt={finalConfig.customTitle || 'Skills & Technologies'}
              width={finalConfig.width || 400}
              height={finalConfig.height || 300}
              className="rounded-lg"
              priority
            />
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            <span className="ml-2 text-gray-600">Generating progress chart...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p>Failed to generate progress chart</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>Configure skills to see animated progress</p>
          </div>
        )}
        
        {finalConfig.skills && finalConfig.skills.length > 0 && (
          <div className="text-sm text-gray-600 text-center">
            <p>{finalConfig.skills.length} skill{finalConfig.skills.length !== 1 ? 's' : ''} configured</p>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
};

// Add generateMarkdown method
const AnimatedProgressWidgetWithMarkdown = AnimatedProgressWidget as React.FC<AnimatedProgressWidgetProps> & MarkdownExportable;

AnimatedProgressWidgetWithMarkdown.generateMarkdown = function(config?: AnimatedProgressWidgetConfig): string {
  const finalConfig = {
    skills: [
      { name: 'JavaScript', level: 90, color: '#F1E05A' },
      { name: 'TypeScript', level: 85, color: '#3178C6' },
      { name: 'React', level: 80, color: '#61DAFB' }
    ],
    animationDuration: 2000,
    showProgressText: true,
    customTitle: 'Skills & Technologies',
    width: 400,
    height: 300,
    theme: 'light',
    ...config
  };

  const params = new URLSearchParams();
  
  if (finalConfig.skills && finalConfig.skills.length > 0) {
    const skillsParam = finalConfig.skills
      .map(skill => `${encodeURIComponent(skill.name)}:${skill.level}${skill.color ? `:${skill.color}` : ''}`)
      .join(',');
    params.set('skills', skillsParam);
  }

  params.set('animated', 'true');
  params.set('showPercentage', (finalConfig.showProgressText ?? true).toString());
  params.set('theme', finalConfig.theme || 'default');
  params.set('width', (finalConfig.width || 400).toString());
  params.set('height', (finalConfig.height || 300).toString());
  params.set('title', finalConfig.customTitle || 'Skills');

  const apiUrl = `/api/animated-progress?${params.toString()}`;
  const absoluteUrl = createAbsoluteUrl(apiUrl);
  
  return `![${finalConfig.customTitle || 'Skills & Technologies'}](${absoluteUrl})`;
};

export default AnimatedProgressWidgetWithMarkdown;
export type { Skill };
