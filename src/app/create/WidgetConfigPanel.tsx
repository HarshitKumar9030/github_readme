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
  // Update configuration
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
      
      {/* GitHub stats specific options */}
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
              <span className="text-sm text-gray-700 dark:text-gray-300">Include Private Contributions</span>
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
          
          {/* Trophy and streak options removed */}
        </>
      )}
      
      {/* Top languages specific options */}
      {widgetType === 'top-languages' && (
        <>
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
              <option value="donut">Donut</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={config.hideBorder === true}
                onChange={(e) => updateConfig('hideBorder', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Hide Border</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox rounded border-gray-300 dark:border-gray-600"
                checked={config.hideTitle === true}
                onChange={(e) => updateConfig('hideTitle', e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Hide Title</span>
            </label>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Exclude Repos (comma separated)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={config.excludeRepos || ''}
              onChange={(e) => updateConfig('excludeRepos', e.target.value)}
              placeholder="repo1,repo2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Exclude Languages (comma separated)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={config.excludeLangs || ''}
              onChange={(e) => updateConfig('excludeLangs', e.target.value)}
              placeholder="language1,language2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Custom Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={config.customTitle || ''}
              onChange={(e) => updateConfig('customTitle', e.target.value)}
              placeholder="Top Languages"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Card Width (px)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={config.cardWidth || ''}
              onChange={(e) => updateConfig('cardWidth', Number(e.target.value))}
              placeholder="400"
            />
          </div>
        </>
      )}
      
      {/* Social stats specific options */}
      {widgetType === 'social-stats' && (
        <>
          {/* Trophy and streak options removed */}
        </>
      )}
    </div>
  );
};

export default WidgetConfigPanel;
