'use client';

import React from 'react';

interface InlineLayoutSelectorProps {
  onChange: (layout: 'flow' | 'inline' | 'grid') => void;
  currentLayout: 'flow' | 'inline' | 'grid';
}

const InlineLayoutSelector: React.FC<InlineLayoutSelectorProps> = ({ 
  onChange, 
  currentLayout 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Content Layout
      </label>
      <div className="flex space-x-2">
        <button
          onClick={() => onChange('flow')}
          className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
            currentLayout === 'flow'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Standard vertical flow (default)"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Flow
        </button>
        <button
          onClick={() => onChange('inline')}
          className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
            currentLayout === 'inline'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Side-by-side layout (elements arranged horizontally)"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
          title="Grid layout (for GitHub widgets and stats)"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Grid
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {currentLayout === 'inline' && (
          <div>
            <p>
              Side-by-side layout uses GitHub-compatible HTML to arrange elements horizontally. 
              Perfect for placing stats side-by-side or creating multi-column sections.
            </p>
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs">
              <code>
                &lt;div align=&quot;center&quot;&gt;<br/>
                &nbsp;&nbsp;&lt;div align=&quot;left&quot; width=&quot;48%&quot;&gt;Content 1&lt;/div&gt;<br/>
                &nbsp;&nbsp;&lt;div align=&quot;left&quot; width=&quot;48%&quot;&gt;Content 2&lt;/div&gt;<br/>
                &lt;/div&gt;
              </code>
            </div>
          </div>
        )}
        {currentLayout === 'grid' && (
          <div>
            <p>
              Grid layout works best for GitHub stats widgets and creates a responsive grid.
            </p>
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs">
              <code>
                | Column 1 | Column 2 |<br/>
                |:---:|:---:|<br/>
                | Content 1 | Content 2 |
              </code>
            </div>
          </div>
        )}
        {currentLayout === 'flow' && (
          <p>
            Standard layout arranges elements vertically in a flowing sequence.
          </p>
        )}
      </div>
    </div>
  );
};

export default InlineLayoutSelector;
