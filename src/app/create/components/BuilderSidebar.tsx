'use client';

import React from 'react';
import { Block } from '@/interfaces/BlockTypes';
import IntegrationMenu from '../IntegrationMenu';
import ConfigPanel from '@/components/ConfigPanel';
import { Socials } from '@/interfaces/Socials';
import { WidgetConfig } from '@/interfaces/WidgetConfig';

interface BuilderSidebarProps {
  activeTab: 'blocks' | 'templates' | 'social' | 'settings';
  setActiveTab: (tab: 'blocks' | 'templates' | 'social' | 'settings') => void;
  availableBlocks: Block[];
  handleDragStart: (block: Block) => void;
  handleDragEnd: () => void;
  socials: Socials;
  setSocials: (socials: Socials) => void;
  widgetConfig: Partial<WidgetConfig>;
  setWidgetConfig: (config: Partial<WidgetConfig>) => void;
  loadTemplate: (templateType: string) => void;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  activeTab,
  setActiveTab,
  availableBlocks,
  handleDragStart,
  handleDragEnd,
  socials,
  setSocials,
  widgetConfig,
  setWidgetConfig,
  loadTemplate
}) => {
  return (
    <div className="lg:col-span-3 flex flex-col border-r border-gray-200 dark:border-gray-700 h-full">
      {/* Modern Tabs */}
      <div className="flex flex-col sm:flex-row lg:flex-col border-b border-gray-200 dark:border-gray-700 p-1">
        <button 
          className={`flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'blocks' 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setActiveTab('blocks')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <span>Building Blocks</span>
        </button>
        <button 
          className={`flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'templates' 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setActiveTab('templates')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Templates</span>
        </button>
        <button 
          className={`flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'social' 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setActiveTab('social')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span>Connect Socials</span>
        </button>
        <button 
          className={`flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'settings' 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>
      </div>
      
      {/* Blocks Tab Content */}
      <div className={`p-4 overflow-y-auto flex-1 ${activeTab === 'blocks' ? 'block' : 'hidden'}`}>
        {/* GitHub Stats Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              GitHub Stats
            </h4>
          </div>
          <div className="space-y-2">
            {availableBlocks.filter(b => b.type === "widget" && b.widgetId?.includes('github')).map(block => (
              <div
                key={block.id}
                className="group flex items-center cursor-move bg-white dark:bg-gray-700 rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow"
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragEnd={handleDragEnd}
              >
                <span className="flex-1 font-medium">{block.label}</span>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Social Media
            </h4>
          </div>
          <div className="space-y-2">
            {availableBlocks.filter(b => b.type === "widget" && b.widgetId?.includes('social')).map(block => (
              <div
                key={block.id}
                className="group flex items-center cursor-move bg-white dark:bg-gray-700 rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow"
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragEnd={handleDragEnd}
              >
                <span className="flex-1 font-medium">{block.label}</span>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      
        {/* Content Sections */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Content Sections
            </h4>
          </div>
          <div className="space-y-2">
            {availableBlocks.filter(b => b.type === "content").map(block => (
              <div
                key={block.id}
                className="group flex items-center cursor-move bg-white dark:bg-gray-700 rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow"
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragEnd={handleDragEnd}
              >
                <span className="flex-1 font-medium">{block.label}</span>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Tab Content */}
      <div className={`p-4 overflow-y-auto flex-1 ${activeTab === 'templates' ? 'block' : 'hidden'}`}>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ready-Made Templates</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {/* Personal Profile */}
          <div 
            className="group bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer shadow-sm hover:shadow"
            onClick={() => loadTemplate('personal')}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-1">Personal Profile</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Showcase your skills, experience and projects</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Project Overview */}
          <div 
            className="group bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer shadow-sm hover:shadow"
            onClick={() => loadTemplate('project')}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-1">Project Overview</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Full documentation for a software project</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Additional templates */}
          <div 
            className="group bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer shadow-sm hover:shadow"
            onClick={() => loadTemplate('minimal')}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-1">Minimal</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Clean and simple design with essential elements</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Social Integration Tab Content */}
      <div className={`p-4 overflow-y-auto flex-1 ${activeTab === 'social' ? 'block' : 'hidden'}`}>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Connect Your Social Accounts</h4>
        </div>
        <div className="space-y-4">
          <IntegrationMenu socials={socials} onChange={setSocials} />
        </div>
      </div>
      
      {/* Settings Tab Content */}
      <div className={`p-4 overflow-y-auto flex-1 ${activeTab === 'settings' ? 'block' : 'hidden'}`}>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Widget Settings</h4>
        </div>
        <ConfigPanel 
          config={widgetConfig}
          onChange={setWidgetConfig}
          title="Global Widget Configuration"
          widgetType="github-stats"
        />
      </div>
    </div>
  );
};

export default BuilderSidebar;
