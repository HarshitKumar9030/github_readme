'use client';

import React, { useCallback } from 'react';
import { TypingAnimationWidgetConfig } from '@/stores/typingAnimationStore';

interface TypingAnimationPropertiesPanelProps {
  config: TypingAnimationWidgetConfig;
  onConfigChange: (config: TypingAnimationWidgetConfig) => void;
}

const TypingAnimationPropertiesPanel: React.FC<TypingAnimationPropertiesPanelProps> = ({
  config,
  onConfigChange
}) => {
  const handleInputChange = useCallback((field: keyof TypingAnimationWidgetConfig, value: any) => {
    onConfigChange({ ...config, [field]: value });
  }, [config, onConfigChange]);

  const handleColorChange = useCallback((field: keyof TypingAnimationWidgetConfig, value: string) => {
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      handleInputChange(field, value);
    }
  }, [handleInputChange]);

  const handleNumberChange = useCallback((field: keyof TypingAnimationWidgetConfig, value: string, min: number, max: number) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      handleInputChange(field, numValue);
    }
  }, [handleInputChange]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Typing Animation Settings
        </h3>
      </div>

      {/* Text Configuration */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Text & Content</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text to Animate
          </label>
          <textarea
            value={config.text || ''}
            onChange={(e) => handleInputChange('text', e.target.value)}
            placeholder="Hello, I am a developer!"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            maxLength={500}
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">{(config.text || '').length}/500 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Title (for README)
          </label>
          <input
            type="text"
            value={config.customTitle || ''}
            onChange={(e) => handleInputChange('customTitle', e.target.value)}
            placeholder="Typing Animation"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hideTitle"
              checked={config.hideTitle === true}
              onChange={(e) => handleInputChange('hideTitle', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hideTitle" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Hide Title in README
            </label>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Appearance</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            value={config.theme || 'default'}
            onChange={(e) => handleInputChange('theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="matrix">Matrix</option>
            <option value="neon">Neon</option>
            <option value="terminal">Terminal</option>
            <option value="gradient">Gradient</option>
            <option value="ocean">Ocean</option>
            <option value="sunset">Sunset</option>
            <option value="forest">Forest</option>
            <option value="purple">Purple</option>
            <option value="minimal">Minimal</option>
            <option value="retro">Retro</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Family
            </label>
            <select
              value={config.font || 'monospace'}
              onChange={(e) => handleInputChange('font', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="monospace">Monospace</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="cursive">Cursive</option>
              <option value="fantasy">Fantasy</option>
              <option value="'Courier New'">Courier New</option>
              <option value="'Fira Code'">Fira Code</option>
              <option value="'JetBrains Mono'">JetBrains Mono</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Weight
            </label>
            <select
              value={config.fontWeight || 'normal'}
              onChange={(e) => handleInputChange('fontWeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="light">Light</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Size ({config.size || 24}px)
          </label>
          <input
            type="range"
            min="8"
            max="72"
            value={config.size || 24}
            onChange={(e) => handleNumberChange('size', e.target.value, 8, 72)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8px</span>
            <span>72px</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={config.color || '#3b82f6'}
                onChange={(e) => handleColorChange('color', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={config.color || '#3b82f6'}
                onChange={(e) => handleColorChange('color', e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cursor Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={config.cursorColor || config.color || '#3b82f6'}
                onChange={(e) => handleColorChange('cursorColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={config.cursorColor || config.color || '#3b82f6'}
                onChange={(e) => handleColorChange('cursorColor', e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Color
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={config.backgroundColor || '#transparent'}
              onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={config.backgroundColor || 'transparent'}
              onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              placeholder="transparent"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Gradient (comma-separated colors)
          </label>
          <input
            type="text"
            value={config.gradient || ''}
            onChange={(e) => handleInputChange('gradient', e.target.value)}
            placeholder="#ff0000, #00ff00, #0000ff"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty to use solid color</p>
        </div>
      </div>

      {/* Animation Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Animation</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Typing Speed ({config.speed || 150}ms per character)
          </label>
          <input
            type="range"
            min="50"
            max="2000"
            value={config.speed || 150}
            onChange={(e) => handleNumberChange('speed', e.target.value, 50, 2000)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Fast (50ms)</span>
            <span>Slow (2000ms)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pause After Animation ({config.pauseAfter || 2000}ms)
          </label>
          <input
            type="range"
            min="500"
            max="10000"
            value={config.pauseAfter || 2000}
            onChange={(e) => handleNumberChange('pauseAfter', e.target.value, 500, 10000)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5s</span>
            <span>10s</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cursor"
              checked={config.cursor !== false}
              onChange={(e) => handleInputChange('cursor', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="cursor" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Show Blinking Cursor
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="loop"
              checked={config.loop !== false}
              onChange={(e) => handleInputChange('loop', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="loop" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Loop Animation
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="centered"
              checked={config.centered === true}
              onChange={(e) => handleInputChange('centered', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="centered" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Center Text
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="shadow"
              checked={config.shadow === true}
              onChange={(e) => handleInputChange('shadow', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="shadow" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Add Text Shadow
            </label>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Dimensions</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Width ({config.width || 600}px)
            </label>
            <input
              type="range"
              min="100"
              max="1200"
              value={config.width || 600}
              onChange={(e) => handleNumberChange('width', e.target.value, 100, 1200)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100px</span>
              <span>1200px</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height ({config.height || 100}px)
            </label>
            <input
              type="range"
              min="50"
              max="400"
              value={config.height || 100}
              onChange={(e) => handleNumberChange('height', e.target.value, 50, 400)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50px</span>
              <span>400px</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Border Radius ({config.borderRadius || 0}px)
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={config.borderRadius || 0}
            onChange={(e) => handleNumberChange('borderRadius', e.target.value, 0, 50)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0px</span>
            <span>50px</span>
          </div>
        </div>
      </div>

      {/* Preset Actions */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Quick Presets</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onConfigChange({
              ...config,
              theme: 'minimal',
              font: 'sans-serif',
              size: 20,
              color: '#374151',
              speed: 120,
              centered: true
            })}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Minimal
          </button>
          
          <button
            onClick={() => onConfigChange({
              ...config,
              theme: 'matrix',
              font: 'monospace',
              size: 18,
              color: '#00ff00',
              backgroundColor: '#000000',
              speed: 100
            })}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Matrix
          </button>
          
          <button
            onClick={() => onConfigChange({
              ...config,
              theme: 'neon',
              font: 'monospace',
              size: 24,
              color: '#ff006e',
              backgroundColor: '#0a0a0a',
              shadow: true,
              speed: 150
            })}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Neon
          </button>
          
          <button
            onClick={() => onConfigChange({
              ...config,
              theme: 'gradient',
              font: 'sans-serif',
              size: 28,
              gradient: '#667eea, #764ba2',
              centered: true,
              speed: 180
            })}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Gradient
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypingAnimationPropertiesPanel;
