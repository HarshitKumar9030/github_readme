'use client';

import React from 'react';
import { BaseWidgetConfig, BaseWidgetProps, MarkdownExportable } from '@/interfaces/MarkdownExportable';
import WidgetContainer from '@/components/WidgetContainer';
import { Skill } from '@/stores/animatedProgressStore';

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

const DisabledAnimatedProgressWidget: React.FC<AnimatedProgressWidgetProps> = ({
  config,
  onMarkdownGenerated
}) => {
  // Always provide some markdown to keep the functionality working
  React.useEffect(() => {
    if (onMarkdownGenerated) {
      const markdown = `<!-- Animated Progress Widget is temporarily disabled -->`;
      onMarkdownGenerated(markdown);
    }
  }, [onMarkdownGenerated]);

  return (
    <WidgetContainer 
      widgetId="animated-progress" 
      className="min-h-[200px]"
    >
      <div className="flex flex-col items-center justify-center p-4 h-full">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-amber-700 w-full">
          <p className="font-medium">Animated Progress Widget Temporarily Disabled</p>
          <p className="text-sm mt-1">This widget has been temporarily disabled to resolve hydration issues.</p>
        </div>
        
        {config.skills && config.skills.length > 0 && (
          <div className="text-sm text-gray-600 text-center mt-2">
            <p>{config.skills.length} skill{config.skills.length !== 1 ? 's' : ''} configured but not displayed</p>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
};

// Add generateMarkdown method
const DisabledAnimatedProgressWidgetWithMarkdown = DisabledAnimatedProgressWidget as React.FC<AnimatedProgressWidgetProps> & MarkdownExportable;

DisabledAnimatedProgressWidgetWithMarkdown.generateMarkdown = function(): string {
  return `<!-- Animated Progress Widget is temporarily disabled -->`;
};

export default DisabledAnimatedProgressWidgetWithMarkdown;
export type { Skill };
