'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Block type definitions
export type BlockType = "template" | "widget" | "content";

export interface BlockBase {
  id: string;
  type: BlockType;
  label: string;
}

export interface TemplateBlock extends BlockBase {
  type: "template";
  templateId: string;
}

export interface WidgetBlock extends BlockBase {
  type: "widget";
  widgetId: string;
}

export interface ContentBlock extends BlockBase {
  type: "content";
  content: string;
}

export type Block = TemplateBlock | WidgetBlock | ContentBlock;

// Define the README Project Type for saving/loading
interface ReadmeProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  blocks: Block[];
  settings: {
    username: string;
    theme: 'light' | 'dark' | 'auto';
  }
}

export default function CreatePage() {
  // Step 1: Drag-and-drop state
  const availableBlocks: Block[] = [
    { id: "template-1", type: "template", label: "Classic Template", templateId: "classic" },
    { id: "template-2", type: "template", label: "Minimal Template", templateId: "minimal" },
    { id: "widget-1", type: "widget", label: "GitHub Stats", widgetId: "github-stats" },
    { id: "widget-2", type: "widget", label: "Top Languages", widgetId: "top-languages" },
    { id: "block-1", type: "content", label: "About Me", content: "About me content" },
    { id: "block-2", type: "content", label: "Skills", content: "Skills content" },
    { id: "block-3", type: "content", label: "Projects", content: "Projects content" },
  ];
  const [builderBlocks, setBuilderBlocks] = useState<Block[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Find the currently selected block
  const selectedBlock = builderBlocks.find(block => block.id === selectedBlockId);

  // Block operations
  const handleBlockSelect = (id: string) => {
    setSelectedBlockId(id);
  };

  const handleRemoveBlock = (id: string) => {
    setBuilderBlocks(blocks => blocks.filter(block => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleMoveBlockUp = (id: string) => {
    const index = builderBlocks.findIndex(block => block.id === id);
    if (index > 0) {
      const newBlocks = [...builderBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;
      setBuilderBlocks(newBlocks);
    }
  };

  const handleMoveBlockDown = (id: string) => {
    const index = builderBlocks.findIndex(block => block.id === id);
    if (index < builderBlocks.length - 1) {
      const newBlocks = [...builderBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;
      setBuilderBlocks(newBlocks);
    }
  };

  // Import/Export state
  const [projectName, setProjectName] = useState<string>('My README');
  const [username, setUsername] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [projects, setProjects] = useState<ReadmeProject[]>([]);

  // Load saved projects from localStorage
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('readme-projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error('Failed to load saved projects:', error);
    }
  }, []);

  // Save current state as a project
  const saveProject = () => {
    try {
      const newProject: ReadmeProject = {
        id: `project-${Date.now()}`,
        name: projectName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        blocks: builderBlocks,
        settings: {
          username,
          theme,
        }
      };
      
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem('readme-projects', JSON.stringify(updatedProjects));
      setShowExportModal(false);
      
      // Show success feedback
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  // Load a previously saved project
  const loadProject = (project: ReadmeProject) => {
    setBuilderBlocks(project.blocks);
    setProjectName(project.name);
    setUsername(project.settings.username);
    setTheme(project.settings.theme);
    setShowImportModal(false);
  };

  // Export project as JSON file
  const exportToFile = () => {
    try {
      const projectData: ReadmeProject = {
        id: `project-${Date.now()}`,
        name: projectName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        blocks: builderBlocks,
        settings: {
          username,
          theme,
        }
      };
      
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-readme.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Failed to export project:', error);
      alert('Failed to export project. Please try again.');
    }
  };

  // Import project from JSON file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const projectData: ReadmeProject = JSON.parse(content);
          setBuilderBlocks(projectData.blocks);
          setProjectName(projectData.name);
          if (projectData.settings) {
            setUsername(projectData.settings.username || '');
            setTheme(projectData.settings.theme || 'light');
          }
          setShowImportModal(false);
          alert('Project imported successfully!');
        }
      } catch (error) {
        console.error('Failed to parse project file:', error);
        alert('Failed to import project. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  // Drag handlers
  const handleDragStart = (block: Block) => setDraggedBlock(block);
  const handleDragEnd = () => setDraggedBlock(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (draggedBlock) {
      setBuilderBlocks([...builderBlocks, { ...draggedBlock, id: `${draggedBlock.id}-${Date.now()}` }]);
      setDraggedBlock(null);
    }
  };

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
                  {availableBlocks.filter(b => b.type === "template").map(block => (
                    <div
                      key={block.id}
                      className="cursor-move bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                      draggable
                      onDragStart={() => handleDragStart(block)}
                      onDragEnd={handleDragEnd}
                    >
                      {block.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">GitHub Widgets</h3>
                <div className="space-y-2">
                  {availableBlocks.filter(b => b.type === "widget").map(block => (
                    <div
                      key={block.id}
                      className="cursor-move bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                      draggable
                      onDragStart={() => handleDragStart(block)}
                      onDragEnd={handleDragEnd}
                    >
                      {block.label}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Content Blocks</h3>
                <div className="space-y-2">
                  {availableBlocks.filter(b => b.type === "content").map(block => (
                    <div
                      key={block.id}
                      className="cursor-move bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                      draggable
                      onDragStart={() => handleDragStart(block)}
                      onDragEnd={handleDragEnd}
                    >
                      {block.label}
                    </div>
                  ))}
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
              
              <div
                className={`border border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-[500px] p-6 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 transition ${dragOver ? 'ring-2 ring-blue-400' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {builderBlocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 select-none">
                    <span className="text-2xl mb-2">🧩</span>
                    <span>Drag blocks from the sidebar to start building your README</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {builderBlocks.map((block) => (
                      <div
                        key={block.id}
                        className={`bg-white dark:bg-gray-700 rounded px-4 py-3 shadow border border-gray-200 dark:border-gray-600 flex items-center gap-3 ${selectedBlockId === block.id ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={() => handleBlockSelect(block.id)}
                      >
                        <span className="text-lg">{block.label}</span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ml-auto">{block.type}</span>
                      </div>
                    ))}
                  </div>
                )}
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
                  <button 
                    className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setShowExportModal(true)}
                  >
                    Save Progress
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar - Properties */}
            <div className="lg:col-span-3 border-l border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Properties</h3>
              
              {selectedBlock ? (
                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Selected Block</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {selectedBlock.label} ({selectedBlock.type})
                  </p>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleRemoveBlock(selectedBlock.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      onClick={() => handleMoveBlockUp(selectedBlock.id)}
                    >
                      Move Up
                    </button>
                    <button
                      className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      onClick={() => handleMoveBlockDown(selectedBlock.id)}
                    >
                      Move Down
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select an element in the builder to edit its properties
                  </p>
                </div>
              )}
              
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Widget Theme
                      </label>
                      <div className="flex space-x-2">
                        <button 
                          className={`px-2 py-1 text-xs rounded-md ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                          onClick={() => setTheme('light')}
                        >
                          Light
                        </button>
                        <button 
                          className={`px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                          onClick={() => setTheme('dark')}
                        >
                          Dark
                        </button>
                        <button 
                          className={`px-2 py-1 text-xs rounded-md ${theme === 'auto' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                          onClick={() => setTheme('auto')}
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button 
                  className="w-full py-2 px-3 flex justify-center items-center text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={exportToFile}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  Export Markdown
                </button>
                <button 
                  className="w-full py-2 px-3 flex justify-center items-center text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  onClick={() => setShowImportModal(true)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Import Project
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

        {/* Save/Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-gray-800/50 dark:bg-black/70 flex items-center justify-center z-50">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-lg w-full mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Save Your Project</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1" htmlFor="project-name">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="My Awesome README"
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setShowExportModal(false)}
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={saveProject}
                    >
                      Save to Browser
                    </button>
                    <button
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                      onClick={exportToFile}
                    >
                      Download as File
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Import/Load Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-gray-800/50 dark:bg-black/70 flex items-center justify-center z-50">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-lg w-full mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Import or Load Project</h3>
              
              {projects.length > 0 && (
                <>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Saved Projects</h4>
                  <div className="max-h-48 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-700 rounded-md">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {projects.map(project => (
                        <li 
                          key={project.id}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => loadProject(project)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{project.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {project.blocks.length} blocks
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Import from File</h4>
              <label className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition text-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Choose JSON file</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}