'use client';

import React from 'react';
import { Block, ContentBlock, TemplateBlock, WidgetBlock } from '@/interfaces/BlockTypes';
import BlockLayoutSelector from '../BlockLayoutSelector';
import ConfigPanel from '@/components/ConfigPanel';
import ContentBlockEditor from '../ContentBlockEditor';

interface PropertiesPanelProps {
  selectedBlock: Block | undefined;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  updateBlockContent: (id: string, content: string) => void;
  updateBlockLayout: (id: string, layout: 'flow' | 'inline' | 'grid') => void;
  updateBlockContainerLayout: (id: string, blockLayout: 'default' | 'side-by-side' | 'grid') => void;
  updateTemplateProperty: (id: string, property: keyof TemplateBlock, value: string) => void;
  updateWidgetProperty: <K extends keyof WidgetBlock>(id: string, property: K, value: WidgetBlock[K]) => void;
  widgetConfig: any;
  setWidgetConfig: (config: any) => void;
  username: string;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  selectedBlockId,
  setSelectedBlockId,
  updateBlockContent,
  updateBlockLayout,
  updateBlockContainerLayout,
  updateTemplateProperty,
  updateWidgetProperty,
  widgetConfig,
  setWidgetConfig,
  username
}) => {
  return (
    <div className="lg:col-span-3 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white">Block Properties</h3>
          {selectedBlock && (
            <span className="text-xs font-medium py-1 px-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              {selectedBlock.label}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedBlock ? (
          <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-6 text-center">
            <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h4 className="mt-2 font-medium text-gray-900 dark:text-white">No Block Selected</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a block in the builder to edit its properties
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Block Type Indicator */}                    
            <div className="flex items-center gap-2 mb-4">
              {selectedBlock.type === 'content' ? (
                <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
              ) : selectedBlock.type === 'widget' ? (
                <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedBlock.label}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Edit properties below</p>
              </div>
            </div>            {/* Block Layout Controls */}
            <div className="space-y-4 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Block Layout
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateBlockContainerLayout(selectedBlock.id, 'default')}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
                      (selectedBlock.blockLayout || 'default') === 'default'
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
                    onClick={() => updateBlockContainerLayout(selectedBlock.id, 'side-by-side')}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
                      (selectedBlock.blockLayout || 'default') === 'side-by-side'
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
                    onClick={() => updateBlockContainerLayout(selectedBlock.id, 'grid')}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm ${
                      (selectedBlock.blockLayout || 'default') === 'grid'
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
                  {(selectedBlock.blockLayout || 'default') === 'side-by-side' && (
                    <div>
                      <p>
                        Side-by-side layout places this block alongside the next block. Perfect for widgets like GitHub stats or related content sections.
                      </p>
                    </div>
                  )}
                  {(selectedBlock.blockLayout || 'default') === 'grid' && (
                    <div>
                      <p>
                        Grid layout places this block in a responsive grid with other blocks marked as grid items.
                        {selectedBlock.type === 'widget' && ' Ideal for presenting multiple GitHub stat widgets together.'}
                      </p>
                    </div>
                  )}
                  {(selectedBlock.blockLayout || 'default') === 'default' && (
                    <p>
                      Standard layout displays this block at full width.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Template Block Properties */}
            {selectedBlock.type === 'template' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Style
                  </label>
                  <select 
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    value={(selectedBlock as TemplateBlock).templateId}
                    onChange={(e) => updateTemplateProperty(selectedBlock.id, 'templateId', e.target.value)}
                  >
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply Template
                  </button>
                </div>
              </div>
            )}
            
            {/* Widget Block Properties */}
            {selectedBlock.type === 'widget' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Widget Type
                  </label>
                  <select 
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    value={(selectedBlock as WidgetBlock).widgetId}
                    onChange={(e) => updateWidgetProperty(selectedBlock.id, 'widgetId', e.target.value)}
                  >                    <option value="github-stats">GitHub Stats</option>
                    <option value="top-languages">Top Languages</option>
                    <option value="contribution-graph">Contribution Graph</option>
                    <option value="social-stats">Social Stats</option>
                  </select>
                </div>
                
                {/* Widget Configuration Panel */}
                <div className="pt-2">
                  <ConfigPanel 
                    config={widgetConfig}
                    onChange={setWidgetConfig}
                    title="Widget Settings"
                    widgetType={(selectedBlock as WidgetBlock).widgetId as 'github-stats' | 'top-languages' | 'contribution-graph' | 'social-stats'}
                  />
                </div>
              </div>
            )}
              {/* Content Block Properties */}
            {selectedBlock.type === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                    <span>Content Editor</span>
                    <button
                      type="button"
                      className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30"
                      title="Toggle preview"
                    >
                      Preview
                    </button>
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">                         
                    <ContentBlockEditor
                      initialContent={(selectedBlock as ContentBlock).content}
                      onChange={(value) => updateBlockContent(selectedBlock.id, value)}
                      layout={(selectedBlock as ContentBlock).layout || 'flow'}
                      onLayoutChange={(layout) => updateBlockLayout(selectedBlock.id, layout)}
                      username={username}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer actions */}
      {selectedBlock && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={() => setSelectedBlockId(null)}
            >
              Close
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
