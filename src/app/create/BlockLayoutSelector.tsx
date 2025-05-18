'use client';

import React from 'react';

interface BlockLayoutSelectorProps {
  onChange: (layout: 'default' | 'side-by-side' | 'grid') => void;
  currentLayout: 'default' | 'side-by-side' | 'grid';
  blockType?: 'content' | 'widget'; // Optional - to show specific help text based on block type
}

const BlockLayoutSelector: React.FC<BlockLayoutSelectorProps> = ({ 
  onChange, 
  currentLayout,
  blockType = 'content'
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Block Layout
      </label>
      <div className="flex space-x-2">
        <button
          onClick={() => onChange('default')}
          className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
            currentLayout === 'default'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Standard full-width layout"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Full Width
        </button>
        <button
          onClick={() => onChange('side-by-side')}
          className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
            currentLayout === 'side-by-side'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Side-by-side arrangement with another block"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Side-by-Side
        </button>
        <button
          onClick={() => onChange('grid')}
          className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
            currentLayout === 'grid'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Grid layout with multiple blocks"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Grid
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {currentLayout === 'side-by-side' && (
          <div>
            <p>
              Side-by-side layout places this block alongside the next block. Perfect for widgets like GitHub stats or related content sections.
            </p>
          </div>
        )}
        {currentLayout === 'grid' && (
          <div>
            <p>
              Grid layout places this block in a responsive grid with other blocks marked as grid items.
              {blockType === 'widget' && ' Ideal for presenting multiple GitHub stat widgets together.'}
            </p>
          </div>
        )}
        {currentLayout === 'default' && (
          <p>
            Standard layout displays this block at full width.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlockLayoutSelector;
