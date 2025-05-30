'use client';

import React, { useEffect, useRef } from 'react';
import { WidgetTheme } from '@/utils/inlineStylesConverter';
import { useGithubStatsLayoutStore, WidgetArrangement } from '@/stores/githubStatsLayoutStore';

export interface GitHubStatsLayoutProps {
  username: string;
  onGenerateMarkdown: (markdown: string) => void;
}

// Widget Theme options - matches the theme options in inlineStylesConverter.ts
const themeOptions: WidgetTheme[] = [
  'light', 'dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 
  'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula'
];

const GitHubStatsLayout: React.FC<GitHubStatsLayoutProps> = ({ username, onGenerateMarkdown }) => {
  // Zustand store state
  const {
    arrangement,
    theme,
    showPrivate,
    compactLanguages,
    showIcons,
    lastMarkdown,
    setArrangement,
    setTheme,
    setShowPrivate,
    setCompactLanguages,
    setShowIcons,
    generateMarkdown
  } = useGithubStatsLayoutStore();

  // Refs for stable references
  const onGenerateMarkdownRef = useRef(onGenerateMarkdown);

  // Update ref when prop changes
  useEffect(() => {
    onGenerateMarkdownRef.current = onGenerateMarkdown;
  }, [onGenerateMarkdown]);
  // Generate markdown when username or settings change
  useEffect(() => {
    if (username) {
      // Use stable reference to avoid dependency issues
      const { generateMarkdown: storeGenerateMarkdown } = useGithubStatsLayoutStore.getState();
      const markdown = storeGenerateMarkdown(username);
      if (onGenerateMarkdownRef.current) {
        onGenerateMarkdownRef.current(markdown);
      }
    }
  }, [username, arrangement, theme, showPrivate, compactLanguages, showIcons]); // Remove generateMarkdown dependency

  // Handle generate button click
  const handleGenerate = () => {
    if (username) {
      // Use stable reference to avoid dependency issues
      const { generateMarkdown: storeGenerateMarkdown } = useGithubStatsLayoutStore.getState();
      const markdown = storeGenerateMarkdown(username);
      if (onGenerateMarkdownRef.current) {
        onGenerateMarkdownRef.current(markdown);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          GitHub Username
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Using: <span className="font-mono">{username || 'yourusername'}</span> 
          {!username && " (change this in integrations menu)"}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Widget Arrangement
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <button
            onClick={() => setArrangement('sideBySide')}
            className={`px-4 py-3 border rounded-md text-sm ${
              arrangement === 'sideBySide'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Stats & Languages Side by Side
          </button>          <button            onClick={() => setArrangement('statsLanguages')}
            className={`px-4 py-3 border rounded-md text-sm ${
              arrangement === 'statsLanguages'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Stats & Languages Details
          </button>
          <button
            onClick={() => setArrangement('allWidgets')}
            className={`px-4 py-3 border rounded-md text-sm ${
              arrangement === 'allWidgets'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Stats with Contributions
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Theme
        </label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as WidgetTheme)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {themeOptions.map(themeOption => (
            <option key={themeOption} value={themeOption}>
              {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="show-private"
            type="checkbox"
            checked={showPrivate}
            onChange={(e) => setShowPrivate(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
          />
          <label htmlFor="show-private" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Include private repositories
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="compact-languages"
            type="checkbox"
            checked={compactLanguages}
            onChange={(e) => setCompactLanguages(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
          />
          <label htmlFor="compact-languages" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Compact language card
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="show-icons"
            type="checkbox"
            checked={showIcons}
            onChange={(e) => setShowIcons(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
          />
          <label htmlFor="show-icons" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Show icons in stats
          </label>
        </div>
      </div>
        <div className="pt-4">
        <button
          onClick={handleGenerate}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Insert GitHub Stats Layout
        </button>
      </div>
      
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">        <p className="text-xs text-gray-500 dark:text-gray-400">
          These widgets use services like github-readme-stats. The markdown generated uses GitHub-compatible HTML and table layouts.
        </p>
      </div>
    </div>
  );
};

export default GitHubStatsLayout;
