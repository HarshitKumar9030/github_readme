'use client';

import React from 'react';
import { WidgetConfig } from '@/components/ConfigPanel';

interface WidgetConfigPanelProps {
  widgetType: 'github-stats' | 'top-languages' | 'social-stats';
  config: Partial<WidgetConfig>;
  onChange: (config: Partial<WidgetConfig>) => void;
}

const WidgetConfigPanel: React.FC<WidgetConfigPanelProps> = ({
  widgetType,
  config,
  onChange
}) => {
  const showGithubTrophies = () => {
    return config.showTrophies !== false;
  };
  
  const showGithubStreak = () => {
    return config.showStreak !== false;
  };

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Widget Configuration</h4>
      
      {/* Common theme selection */}
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
          Theme
        </label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={config.theme || 'default'}
          onChange={(e) => updateConfig('theme', e.target.value)}
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
          <option value="radical">Radical</option>
          <option value="merko">Merko</option>
          <option value="gruvbox">Gruvbox</option>
          <option value="tokyonight">Tokyo Night</option>
        </select>
      </div>
      
      {/* GitHub Stats specific options */}
      {widgetType === 'github-stats' && (
        <>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={config.showIcons !== false}
                onChange={(e) => updateConfig('showIcons', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Icons</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={config.includePrivate === true}
                onChange={(e) => updateConfig('includePrivate', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include Private Repos</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={config.includeAllCommits !== false}
                onChange={(e) => updateConfig('includeAllCommits', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include All Commits</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={showGithubTrophies()}
                onChange={(e) => updateConfig('showTrophies', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show GitHub Trophies</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={showGithubStreak()}
                onChange={(e) => updateConfig('showStreak', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show GitHub Streak Stats</span>
            </label>
          </div>
        </>
      )}
      
      {/* Top languages specific options */}
      {widgetType === 'top-languages' && (
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            Layout
          </label>
          <select
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={config.layout || 'compact'}
            onChange={(e) => updateConfig('layout', e.target.value)}
          >
            <option value="default">Default</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      )}
      
      {/* Social stats specific options */}
      {widgetType === 'social-stats' && (
        <>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={showGithubTrophies()}
                onChange={(e) => updateConfig('showTrophies', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show GitHub Trophies</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={showGithubStreak()}
                onChange={(e) => updateConfig('showStreak', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show GitHub Streak Stats</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default WidgetConfigPanel;
