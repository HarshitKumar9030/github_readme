'use client';

import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderBarProps {
  projectName: string;
  setProjectName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  projectName,
  setProjectName,
  username,
  setUsername
}) => {
  return (
    <div className="bg-gradient-to-r from-white/95 via-blue-50/80 to-purple-50/80 dark:from-gray-800/95 dark:via-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border-b border-gradient border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Project Info Section */}
        <div className="flex-1 min-w-0 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-6">
          {/* Project Name Input */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name
            </label>
            <div className="relative group">
              <input
                type="text"
                className="block w-full rounded-xl border-0 py-3 pl-4 pr-12 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-700/80 ring-1 ring-inset ring-gray-300/50 dark:ring-gray-600/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 group-hover:shadow-md focus:shadow-lg backdrop-blur-sm sm:text-sm sm:leading-6"
                placeholder="My Awesome Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* GitHub Username Input */}
          <div className="w-full lg:w-auto lg:min-w-[280px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                id="github-username" 
                type="text" 
                className="w-full pl-12 pr-4 py-3 border-0 rounded-xl text-gray-900 dark:text-white bg-white/80 dark:bg-gray-700/80 ring-1 ring-inset ring-gray-300/50 dark:ring-gray-600/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 group-hover:shadow-md focus:shadow-lg backdrop-blur-sm sm:text-sm sm:leading-6"
                placeholder="your-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {username && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Stats Display */}
          <div className="hidden lg:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Building</span>
            </div>
            {username && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>GitHub Connected</span>
              </div>
            )}
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
