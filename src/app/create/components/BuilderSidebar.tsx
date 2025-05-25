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
}) => {  return (
    <div className="lg:col-span-3 flex flex-col border-r border-gray-200/60 dark:border-gray-700/60 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      {/* Minimal Modern Tabs */}
      <div className="flex flex-col sm:flex-row lg:flex-col border-b border-gray-200/50 dark:border-gray-700/50 p-2 bg-gray-50/30 dark:bg-gray-800/30">
        <button 
          className={`group flex items-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'blocks' 
            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-blue-600 dark:hover:text-blue-400'}`}
          onClick={() => setActiveTab('blocks')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <span className="font-semibold">Building Blocks</span>
        </button>        <button 
          className={`group flex items-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'templates'
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
          onClick={() => setActiveTab('templates')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-semibold">Templates</span>
        </button>
        <button 
          className={`group flex items-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'social' 
            ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-pink-600 dark:hover:text-pink-400'}`}
          onClick={() => setActiveTab('social')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span className="font-semibold">Connect Socials</span>
        </button>
        <button 
          className={`group flex items-center justify-center py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'settings' 
            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-amber-600 dark:hover:text-amber-400'}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-semibold">Settings</span>
        </button>
      </div>
        {/* Clean Blocks Tab Content */}
      <div className={`p-5 overflow-y-auto flex-1 ${activeTab === 'blocks' ? 'block' : 'hidden'}`}>
        {/* GitHub Stats Section */}        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-4">
            <h4 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="truncate">GitHub Stats</span>
            </h4>
            <span className="text-xs font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex-shrink-0 self-start sm:self-auto">
              {availableBlocks.filter(b => b.type === "widget" && b.widgetId?.includes('github')).length}
            </span>
          </div>
          <div className="space-y-3">
            {availableBlocks.filter(b => b.type === "widget" && b.widgetId?.includes('github')).map(block => (
              <div
                key={block.id}
                className="group flex items-center cursor-move bg-white dark:bg-gray-800 rounded-xl p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:scale-[1.01]"
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragEnd={handleDragEnd}
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{block.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Drag to add to your README</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Section */}        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-4">
            <h4 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-pink-500 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <span className="truncate">Social Media</span>
            </h4>
            <span className="text-xs font-medium px-2 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full flex-shrink-0 self-start sm:self-auto">
              {availableBlocks.filter(b => b.type === "widget" && b.widgetId?.includes('social')).length}
            </span>
          </div>
          <div className="space-y-3">
            {availableBlocks.filter(b => b.type === "widget" && b.widgetId?.includes('social')).map(block => (
              <div
                key={block.id}
                className="group flex items-center cursor-move bg-white dark:bg-gray-800 rounded-xl p-4 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition-all duration-200 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:scale-[1.01]"
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragEnd={handleDragEnd}
              >
                <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h3a1 1 0 110 2h-1v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6H4a1 1 0 110-2h3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{block.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Drag to add to your README</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            ))}
          </div>        </div>

        {/* SVG Animations & Visual Elements */}
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-4">
            <h4 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="truncate">SVG Animations</span>
            </h4>
            <span className="text-xs font-medium px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex-shrink-0 self-start sm:self-auto">
              {availableBlocks.filter(b => b.type === "widget" && (b.widgetId?.includes('wave') || b.widgetId?.includes('language-chart') || b.widgetId?.includes('repo-showcase') || b.widgetId?.includes('animated-progress') || b.widgetId?.includes('typing-animation'))).length}
            </span>
          </div>
          <div className="space-y-3">
            {availableBlocks.filter(b => b.type === "widget" && (b.widgetId?.includes('wave') || b.widgetId?.includes('language-chart') || b.widgetId?.includes('repo-showcase') || b.widgetId?.includes('animated-progress') || b.widgetId?.includes('typing-animation'))).map(block => (
              <div
                key={block.id}
                className="group flex items-center cursor-move bg-white dark:bg-gray-800 rounded-xl p-4 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-200 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:scale-[1.01]"
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragEnd={handleDragEnd}
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{block.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Interactive SVG widgets</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      
        {/* Content Sections */}<div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-4">
            <h4 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="truncate">Content Sections</span>
            </h4>
            <span className="text-xs font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex-shrink-0 self-start sm:self-auto">
              {availableBlocks.filter(b => b.type === "content").length}
            </span>
          </div>
          <div className="space-y-3">
            {availableBlocks.filter(b => b.type === "content").map(block => (
              <div
                key={block.id}
                className="group flex items-center cursor-move bg-white dark:bg-gray-800 rounded-xl p-4 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all duration-200 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:scale-[1.01]"
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragEnd={handleDragEnd}
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{block.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Drag to add to your README</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Tab Content */}
      <div className={`p-5 overflow-y-auto flex-1 ${activeTab === 'templates' ? 'block' : 'hidden'}`}>
        <div className="mb-4">
          <h4 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            Ready-Made Templates
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-10">Choose a template to get started quickly</p>
        </div>
        <div className="space-y-4">
          {/* Personal Profile */}
          <div 
            className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200/60 dark:border-gray-700/60 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
            onClick={() => loadTemplate('personal')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Personal Profile</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Showcase your skills, experience and projects with a professional layout</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Project Overview */}
          <div 
            className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200/60 dark:border-gray-700/60 hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
            onClick={() => loadTemplate('project')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Project Overview</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Complete documentation template for software projects and repositories</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Minimal Template */}
          <div 
            className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200/60 dark:border-gray-700/60 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
            onClick={() => loadTemplate('minimal')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Minimal</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Clean and simple design with only the essential elements</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Social Integration Tab Content */}
      <div className={`p-5 overflow-y-auto flex-1 ${activeTab === 'social' ? 'block' : 'hidden'}`}>
        <div className="mb-4">
          <h4 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            <div className="w-7 h-7 rounded-lg bg-pink-500 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            Connect Your Social Accounts
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-10">Link your social media profiles for automatic integration</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm">
          <IntegrationMenu socials={socials} onChange={setSocials} />
        </div>
      </div>
      
      {/* Enhanced Settings Tab Content */}
      <div className={`p-5 overflow-y-auto flex-1 ${activeTab === 'settings' ? 'block' : 'hidden'}`}>
        <div className="mb-4">
          <h4 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Widget Settings
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-10">Configure global settings for your widgets</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm">
          <ConfigPanel 
            config={widgetConfig}
            onChange={setWidgetConfig}
            title="Global Widget Configuration"
            widgetType="github-stats"
          />
        </div>
      </div>
    </div>
  );
};

export default BuilderSidebar;
