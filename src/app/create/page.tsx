'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Create Your README
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose a template and customize it to create your perfect GitHub profile README
          </p>
        </div>
          {/* README Generator Builder Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            {/* Left Sidebar - Components */}
            <div className="lg:col-span-3 border-r border-gray-200 dark:border-gray-700 p-4">
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Templates</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium text-sm">
                    Developer Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 text-sm">
                    Project Showcase
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 text-sm">
                    Data Scientist
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 text-sm">
                    Minimal
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">GitHub Widgets</h3>
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Stats Card</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Language Usage</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Contribution Graph</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Streak Stats</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Repository Card</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Trophies</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Content Blocks</h3>
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Heading</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Text Block</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Skills List</div>
                  </div>
                  <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 cursor-move">
                    <div className="w-5 h-5 mr-2 text-gray-400">≡</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Social Links</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Builder Area */}
            <div className="lg:col-span-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Builder</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Undo
                  </button>
                  <button className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Redo
                  </button>
                </div>
              </div>
              
              <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-[500px] p-6 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Start Building Your README</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    Drag elements from the sidebar and drop them here to build your GitHub profile README
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Preview
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Template Settings
                  </button>
                </div>
                <div>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                    Save Progress
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar - Properties */}
            <div className="lg:col-span-3 border-l border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Properties</h3>
              
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select an element in the builder to edit its properties
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">GitHub Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="github-username">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        id="github-username"
                        placeholder="e.g. octocat"
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Widget Theme
                      </label>
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 text-xs rounded-md bg-blue-600 text-white">Light</button>
                        <button className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Dark</button>
                        <button className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Auto</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button className="w-full py-2 px-3 flex justify-center items-center text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  Export Markdown
                </button>
                <button className="w-full py-2 px-3 flex justify-center items-center text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Update GitHub Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Note about development status */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is a preview of the upcoming README generator interface. Full functionality coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}