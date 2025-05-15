'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ConfigOption {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'color' | 'text';
  defaultValue: any;
  options?: { value: string; label: string }[];
}

export interface WidgetConfig {
  theme: 'light' | 'dark' | 'radical' | 'tokyonight' | 'merko' | 'gruvbox';
  showIcons: boolean;
  includePrivate: boolean;
  layout: 'default' | 'compact';
  locale: string;
  includeAllCommits: boolean;
  showTrophies: boolean;
  showStreak: boolean;
}

interface ConfigPanelProps {
  config: Partial<WidgetConfig>;
  onChange: (config: Partial<WidgetConfig>) => void;
  title?: string;
  widgetType?: 'github-stats' | 'social-stats' | 'top-languages';
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  config, 
  onChange, 
  title = 'Widget Configuration', 
  widgetType = 'github-stats'
}) => {
  // Common options for all widget types
  const commonOptions: ConfigOption[] = [
    {
      id: 'theme',
      label: 'Theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'radical', label: 'Radical' },
        { value: 'tokyonight', label: 'Tokyo Night' },
        { value: 'merko', label: 'Merko' },
        { value: 'gruvbox', label: 'Gruvbox' }
      ]
    }
  ];

  // GitHub stats specific options
  const githubStatsOptions: ConfigOption[] = [
    {
      id: 'showIcons',
      label: 'Show Icons',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'includePrivate',
      label: 'Include Private Contributions',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'includeAllCommits',
      label: 'Include All Commits',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showTrophies',
      label: 'Show GitHub Trophies',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showStreak',
      label: 'Show GitHub Streak',
      type: 'toggle',
      defaultValue: true
    }
  ];

  // Top languages specific options
  const topLanguagesOptions: ConfigOption[] = [
    {
      id: 'layout',
      label: 'Layout',
      type: 'select',
      defaultValue: 'compact',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'compact', label: 'Compact' }
      ]
    },
    {
      id: 'includePrivate',
      label: 'Include Private Repos',
      type: 'toggle',
      defaultValue: false
    }
  ];

  // Social stats specific options
  const socialStatsOptions: ConfigOption[] = [
    {
      id: 'showTrophies',
      label: 'Show GitHub Trophies',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showStreak',
      label: 'Show GitHub Streak',
      type: 'toggle',
      defaultValue: true
    }
  ];

  // Get options based on widget type
  const getOptionsForWidgetType = () => {
    switch (widgetType) {
      case 'github-stats':
        return [...commonOptions, ...githubStatsOptions];
      case 'top-languages':
        return [...commonOptions, ...topLanguagesOptions];
      case 'social-stats':
        return [...commonOptions, ...socialStatsOptions];
      default:
        return commonOptions;
    }
  };

  const options = getOptionsForWidgetType();

  const handleChange = (id: string, value: any) => {
    onChange({
      ...config,
      [id]: value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {option.label}
            </label>
            
            {option.type === 'toggle' && (
              <div className="flex items-center">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={config[option.id as keyof WidgetConfig] !== undefined ? 
                      config[option.id as keyof WidgetConfig] as boolean : option.defaultValue}
                    onChange={(e) => handleChange(option.id, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            )}
            
            {option.type === 'select' && option.options && (
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={config[option.id as keyof WidgetConfig] !== undefined ?
                  config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                onChange={(e) => handleChange(option.id, e.target.value)}
              >
                {option.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            
            {option.type === 'color' && (
              <input
                type="color"
                className="h-10 px-2 rounded border border-gray-300 dark:border-gray-600"
                value={config[option.id as keyof WidgetConfig] !== undefined ? 
                  config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                onChange={(e) => handleChange(option.id, e.target.value)}
              />
            )}
            
            {option.type === 'text' && (
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={config[option.id as keyof WidgetConfig] !== undefined ? 
                  config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                onChange={(e) => handleChange(option.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigPanel;
