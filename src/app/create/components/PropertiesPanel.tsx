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
}) => {  return (
    <div className="lg:col-span-3 border-l border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm">      <div className="p-4 md:p-6 border-b border-gray-200/30 dark:border-gray-700/30 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">Block Properties</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">Customize your selected block</p>
            </div>
          </div>
          {selectedBlock && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center text-xs md:text-sm font-semibold py-2 px-3 md:px-4 bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 max-w-full truncate">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="truncate">{selectedBlock.label}</span>
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5">
        {!selectedBlock ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Block Selected</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Select a block in the builder to edit its properties and customize its appearance
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Block Type Indicator */}                    
            <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {selectedBlock.type === 'content' ? (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                ) : selectedBlock.type === 'widget' ? (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBlock.label}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {selectedBlock.type === 'content' && 'Content Block'}
                    {selectedBlock.type === 'widget' && 'Widget Block'}
                    {selectedBlock.type === 'template' && 'Template Block'}
                  </p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                  {selectedBlock.type}
                </div>
              </div>
            </div>

            {/* Enhanced Block Layout Controls */}
            <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Block Layout
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Choose how this block appears in your README</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => updateBlockContainerLayout(selectedBlock.id, 'default')}
                  className={`group flex items-center justify-between p-4 rounded-xl text-sm transition-all duration-200 ${
                    (selectedBlock.blockLayout || 'default') === 'default'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <div className="text-left">
                      <div className="font-medium">Full Width</div>
                      <div className="text-xs opacity-80">Standard full-width layout</div>
                    </div>
                  </div>
                  {(selectedBlock.blockLayout || 'default') === 'default' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => updateBlockContainerLayout(selectedBlock.id, 'side-by-side')}
                  className={`group flex items-center justify-between p-4 rounded-xl text-sm transition-all duration-200 ${
                    (selectedBlock.blockLayout || 'default') === 'side-by-side'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div className="text-left">
                      <div className="font-medium">Side-by-Side</div>
                      <div className="text-xs opacity-80">Arrange with another block</div>
                    </div>
                  </div>
                  {(selectedBlock.blockLayout || 'default') === 'side-by-side' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => updateBlockContainerLayout(selectedBlock.id, 'grid')}
                  className={`group flex items-center justify-between p-4 rounded-xl text-sm transition-all duration-200 ${
                    (selectedBlock.blockLayout || 'default') === 'grid'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <div className="text-left">
                      <div className="font-medium">Grid</div>
                      <div className="text-xs opacity-80">Responsive grid layout</div>
                    </div>
                  </div>
                  {(selectedBlock.blockLayout || 'default') === 'grid' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
                
              <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {(selectedBlock.blockLayout || 'default') === 'side-by-side' && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Side-by-side layout places this block alongside the next block. Perfect for widgets like GitHub stats or related content sections.</p>
                    </div>
                  )}
                  {(selectedBlock.blockLayout || 'default') === 'grid' && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Grid layout creates a responsive grid with other blocks marked as grid items{selectedBlock.type === 'widget' ? '. Ideal for presenting multiple GitHub stat widgets together.' : '.'}</p>
                    </div>
                  )}
                  {(selectedBlock.blockLayout || 'default') === 'default' && (
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Standard layout displays this block at full width with proper spacing.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced Template Block Properties */}
            {selectedBlock.type === 'template' && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Template Configuration
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Select a template style for this block</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Template Style
                    </label>                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'classic', label: 'Classic', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                        { value: 'minimal', label: 'Minimal', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                        { value: 'portfolio', label: 'Portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                        { value: 'project', label: 'Project', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' }
                      ].map((template) => (
                        <button
                          key={template.value}
                          onClick={() => updateTemplateProperty(selectedBlock.id, 'templateId', template.value)}
                          className={`p-3 rounded-xl text-sm transition-all duration-200 ${
                            (selectedBlock as TemplateBlock).templateId === template.value
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-700'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <svg className="w-5 h-5 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={template.icon} />
                            </svg>
                            <span className="font-medium">{template.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Apply Template
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Widget Block Properties */}
            {selectedBlock.type === 'widget' && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Widget Configuration
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Customize your widget settings and appearance</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Widget Type
                    </label>                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { value: 'github-stats', label: 'GitHub Stats', desc: 'Profile statistics and activity' },
                        { value: 'top-languages', label: 'Top Languages', desc: 'Most used programming languages' },
                        { value: 'contribution-graph', label: 'Contribution Graph', desc: 'GitHub contribution activity' },
                        { value: 'social-stats', label: 'Social Stats', desc: 'Social media metrics' }
                      ].map((widget) => (
                        <button
                          key={widget.value}
                          onClick={() => updateWidgetProperty(selectedBlock.id, 'widgetId', widget.value)}
                          className={`flex items-center justify-between p-3 rounded-xl text-sm transition-all duration-200 ${
                            (selectedBlock as WidgetBlock).widgetId === widget.value
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium">{widget.label}</div>
                            <div className="text-xs opacity-80">{widget.desc}</div>
                          </div>
                          {(selectedBlock as WidgetBlock).widgetId === widget.value && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Enhanced Widget Configuration Panel */}
                  <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="bg-gray-50/70 dark:bg-gray-700/70 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                      <ConfigPanel 
                        config={widgetConfig}
                        onChange={setWidgetConfig}
                        title="Widget Settings"
                        widgetType={(selectedBlock as WidgetBlock).widgetId as 'github-stats' | 'top-languages' | 'contribution-graph' | 'social-stats'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Content Block Properties */}
            {selectedBlock.type === 'content' && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Content Editor
                    </div>
                    <button
                      type="button"
                      className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800/30 transition-all duration-200 font-medium"
                      title="Toggle preview"
                    >
                      <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </button>
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Edit your content with markdown support</p>
                </div>

                <div className="border border-gray-200/60 dark:border-gray-600/60 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800">                         
                  <ContentBlockEditor
                    initialContent={(selectedBlock as ContentBlock).content}
                    onChange={(value) => updateBlockContent(selectedBlock.id, value)}
                    layout={(selectedBlock as ContentBlock).layout || 'flow'}
                    onLayoutChange={(layout) => updateBlockLayout(selectedBlock.id, layout)}
                    username={username}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>     
      {selectedBlock && (
        <div className="p-4 md:p-5 border-t border-gray-200/30 dark:border-gray-700/30 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Changes apply automatically</span>
              <span className="sm:hidden">Auto-save enabled</span>
            </div>            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 order-1 sm:order-2">
              <button
                type="button"
                className="px-4 py-2.5 sm:px-3 sm:py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-2"
                onClick={() => setSelectedBlockId(null)}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">Close Panel</span>
                <span className="sm:hidden">Close</span>
              </button>
              <button
                type="button"
                className="px-4 py-2.5 sm:px-3 sm:py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
