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
}) => {  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(50);  // Memoize the progressConfig to prevent unnecessary re-creation
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
    }
  };
  const addSkill = () => {
    const skills = progressConfig.skills || [];
    if (newSkillName.trim() && !skills.some(skill => skill.name === newSkillName.trim())) {
      const updatedSkills = [...skills, { name: newSkillName.trim(), level: newSkillLevel }];
      handleConfigChange({ skills: updatedSkills });
      setNewSkillName('');
      setNewSkillLevel(50);
    }
  };
  const removeSkill = (index: number) => {
    const skills = progressConfig.skills || [];
    const updatedSkills = skills.filter((_, i) => i !== index);
    handleConfigChange({ skills: updatedSkills });
  };
  const updateSkillLevel = (index: number, level: number) => {
    const skills = progressConfig.skills || [];
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], level };
    handleConfigChange({ skills: updatedSkills });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      {/* Configuration Panel */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold mb-3">Animated Progress Configuration</h3>
        
        {/* Skills Management */}
        <div>
          <label className="block text-sm font-medium mb-2">Skills</label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter skill name"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                min="0"
                max="100"
                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />              <button
                onClick={addSkill}
                disabled={!newSkillName.trim() || (progressConfig.skills || []).some(skill => skill.name === newSkillName.trim())}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            
            {(progressConfig.skills?.length || 0) > 0 && (
              <div className="space-y-2">
                {(progressConfig.skills || []).map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateSkillLevel(index, Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="w-12 text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Animation Duration */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Animation Duration: {progressConfig.animationDuration}ms
          </label>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={progressConfig.animationDuration}
            onChange={(e) => handleConfigChange({ animationDuration: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>500ms</span>
            <span>5000ms</span>
          </div>
        </div>

        {/* Progress Bar Height */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Progress Bar Height: {progressConfig.progressBarHeight}px
          </label>
          <input
            type="range"
            min="10"
            max="50"
            step="2"
            value={progressConfig.progressBarHeight}
            onChange={(e) => handleConfigChange({ progressBarHeight: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>10px</span>
            <span>50px</span>
          </div>
        </div>

        {/* Show Progress Text Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showProgressText"
            checked={progressConfig.showProgressText}
            onChange={(e) => handleConfigChange({ showProgressText: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="showProgressText" className="text-sm font-medium">
            Show Progress Text
          </label>
        </div>
      </div>

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
