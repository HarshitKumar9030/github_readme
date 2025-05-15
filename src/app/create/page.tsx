'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import IntegrationMenu, { Socials } from "./IntegrationMenu";
import SocialStatsWidget from './SocialStatsWidget';
import ConfigPanel, { WidgetConfig } from '@/components/ConfigPanel';
import MarkdownEditor from '@/components/MarkdownEditor'; 
import { LocalStorageService } from '@/services/LocalStorageService';

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
  theme?: "light" | "dark" | "radical" | "tokyonight" | "merko" | "gruvbox";
  includePrivate?: boolean;
  size?: "small" | "medium" | "large";
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
    socials?: Socials;
    widgetConfig?: Partial<WidgetConfig>;
  }
}

// Define autosave data interface
interface AutoSaveData {
  blocks: Block[];
  settings: {
    username: string;
    theme: 'light' | 'dark' | 'auto';
    socials: Socials;
    widgetConfig: Partial<WidgetConfig>;
  }
}

export default function CreatePage() {
  // Step 1: Drag-and-drop state
  const availableBlocks: Block[] = [
    { id: "template-1", type: "template", label: "Classic Template", templateId: "classic" },
    { id: "template-2", type: "template", label: "Minimal Template", templateId: "minimal" },
    { id: "widget-1", type: "widget", label: "GitHub Stats", widgetId: "github-stats" },
    { id: "widget-2", type: "widget", label: "Top Languages", widgetId: "top-languages" },
    { id: "widget-3", type: "widget", label: "Social Stats", widgetId: "social-stats" },
    { id: "block-1", type: "content", label: "About Me", content: "About me content" },
    { id: "block-2", type: "content", label: "Skills", content: "Skills content" },
    { id: "block-3", type: "content", label: "Projects", content: "Projects content" },
  ];
  const [builderBlocks, setBuilderBlocks] = useState<Block[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [socials, setSocials] = useState<Socials>({
    github: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });

  // Advanced configuration state
  const [widgetConfig, setWidgetConfig] = useState<Partial<WidgetConfig>>({
    theme: 'light',
    showIcons: true,
    includePrivate: false,
    layout: 'compact',
    includeAllCommits: true,
    showTrophies: true,
    showStreak: true
  });

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

  // Block content editing functions
  const updateBlockContent = (id: string, content: string) => {
    setBuilderBlocks(blocks => 
      blocks.map(block => 
        block.id === id && block.type === 'content' 
          ? { ...block, content } 
          : block
      )
    );
  };

  const updateTemplateProperty = (id: string, property: keyof TemplateBlock, value: string) => {
    setBuilderBlocks(blocks => 
      blocks.map(block => 
        block.id === id && block.type === 'template'
          ? { ...block, [property]: value } 
          : block
      )
    );
  };

  const updateWidgetProperty = <K extends keyof WidgetBlock>(id: string, property: K, value: WidgetBlock[K]) => {
    setBuilderBlocks(blocks => 
      blocks.map(block => 
        block.id === id && block.type === 'widget'
          ? { ...block, [property]: value } 
          : block
      )
    );
  };

  // Import/Export state
  const [projectName, setProjectName] = useState<string>('My README');
  const [username, setUsername] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [projects, setProjects] = useState<ReadmeProject[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  // Auto-save project data
  useEffect(() => {
    if (builderBlocks.length === 0) return;
    
    const projectData: AutoSaveData = {
      blocks: builderBlocks,
      settings: {
        username,
        theme,
        socials,
        widgetConfig
      }
    };
    
    LocalStorageService.save('github-readme-autosave', projectData);
  }, [builderBlocks, username, theme, socials, widgetConfig]);

  // Sync GitHub username with socials.github
  useEffect(() => {
    if (socials.github && !username) {
      setUsername(socials.github);
    }
  }, [socials.github, username]);

  // Load autosaved data
  useEffect(() => {
    const savedData = LocalStorageService.load<AutoSaveData | null>('github-readme-autosave', null);
    if (savedData) {
      setBuilderBlocks(savedData.blocks || []);
      if (savedData.settings) {
        setUsername(savedData.settings.username || '');
        setTheme(savedData.settings.theme || 'light');
        if (savedData.settings.socials) {
          setSocials(savedData.settings.socials);
        }
        if (savedData.settings.widgetConfig) {
          setWidgetConfig(savedData.settings.widgetConfig);
        }
      }
    }
  }, []);

  // Generate markdown preview
  const generatePreview = (): string => {
    let markdown = '';
    
    // Add title
    markdown += `# ${projectName || 'My GitHub Profile'}\n\n`;
    
    // Process blocks
    builderBlocks.forEach(block => {
      switch (block.type) {
        case 'template':
          // Template blocks usually define the overall structure
          if (block.templateId === 'classic') {
            markdown += `## Hello there! 👋\n\n`;
            markdown += `I'm ${username || 'a developer'}, passionate about coding and building cool things.\n\n`;
          } else if (block.templateId === 'minimal') {
            markdown += `### ${username || 'Developer'}\n\n`;
            markdown += `> Building the future, one line of code at a time\n\n`;
          }
          break;
        
        case 'widget':
          // GitHub widgets
          if (block.widgetId === 'github-stats') {
            markdown += `## GitHub Stats\n\n`;
            if (username) {
              const themeParam = widgetConfig.theme || (theme === 'dark' ? 'radical' : 'default');
              const showIconsParam = widgetConfig.showIcons ? '&show_icons=true' : '';
              const privateParam = widgetConfig.includePrivate ? '&count_private=true' : '';
              const allCommitsParam = widgetConfig.includeAllCommits ? '&include_all_commits=true' : '';
              
              markdown += `![${username}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${username}${showIconsParam}${privateParam}${allCommitsParam}&theme=${themeParam})\n\n`;
              // Add GitHub Trophies if enabled
              if (widgetConfig.showTrophies) {
                markdown += `## 🏆 GitHub Trophies\n\n`;
                markdown += `![](https://github-profile-trophy.vercel.app/?username=${username}&theme=${themeParam}&no-frame=false&no-bg=false&margin-w=4)\n\n`;
              }
              // Add GitHub Streak Stats if enabled
              if (widgetConfig.showStreak) {
                markdown += `## 🔥 Streak Stats\n\n`;
                markdown += `![](https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${themeParam}&hide_border=false)\n\n`;
              }
            } else {
              markdown += `<!-- Add your GitHub username to see your stats -->\n\n`;
            }
          } else if (block.widgetId === 'top-languages') {
            markdown += `## Top Languages\n\n`;
            if (username) {
              const themeParam = widgetConfig.theme || (theme === 'dark' ? 'radical' : 'default');
              const layoutParam = widgetConfig.layout || 'compact';
              markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=${layoutParam}&theme=${themeParam})\n\n`;
            } else {
              markdown += `<!-- Add your GitHub username to see your top languages -->\n\n`;
            }
          } else if (block.widgetId === 'social-stats') {            markdown += `## Social Media\n\n`;
            
            // First, add GitHub trophies and streaks if GitHub is configured
            if (socials.github && widgetConfig.showTrophies) {
              const themeParam = widgetConfig.theme || (theme === 'dark' ? 'radical' : 'default');
              markdown += `### GitHub Profile Trophy\n\n`;
              markdown += `![](https://github-profile-trophy.vercel.app/?username=${socials.github}&theme=${themeParam}&no-frame=false&no-bg=false&margin-w=4)\n\n`;
            }
            
            if (socials.github && widgetConfig.showStreak) {
              const themeParam = widgetConfig.theme || (theme === 'dark' ? 'radical' : 'default');
              markdown += `### GitHub Streak Stats\n\n`;
              markdown += `![](https://github-readme-streak-stats.herokuapp.com/?user=${socials.github}&theme=${themeParam}&hide_border=false)\n\n`;
            }
            
            // Then add social media links
            markdown += `### Connect With Me\n\n`;
            if (socials.github) {
              markdown += `- GitHub: [@${socials.github}](https://github.com/${socials.github})\n`;
            }
            if (socials.twitter) {
              markdown += `- Twitter: [@${socials.twitter}](https://twitter.com/${socials.twitter})\n`;
            }
            if (socials.instagram) {
              markdown += `- Instagram: [@${socials.instagram}](https://instagram.com/${socials.instagram})\n`;
            }
            if (socials.linkedin) {
              markdown += `- LinkedIn: [${socials.linkedin}](https://linkedin.com/in/${socials.linkedin})\n`;
            }
            if (!socials.github && !socials.twitter && !socials.instagram && !socials.linkedin) {
              markdown += `<!-- Add your social media accounts in the Integration Menu -->\n`;
            }
            markdown += `\n`;
          }
          break;
        
        case 'content':
          // Content blocks
          if (block.label === 'About Me') {
            markdown += `## About Me\n\n${block.content || 'Add some information about yourself here.'}\n\n`;
          } else if (block.label === 'Skills') {
            markdown += `## Skills\n\n${block.content || '- Skill 1\n- Skill 2\n- Skill 3'}\n\n`;
          } else if (block.label === 'Projects') {
            markdown += `## Projects\n\n${block.content || '- Project 1: Description\n- Project 2: Description\n- Project 3: Description'}\n\n`;
          } else {
            markdown += `## ${block.label}\n\n${block.content || 'Add content here.'}\n\n`;
          }
          break;
      }
    });
    
    // Add footer
    markdown += `---\n\n`;
    markdown += `*This README was generated with ❤️ by [README Generator](https://github.com)*\n`;
    
    return markdown;
  };

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
                {/* Integration Menu moved into builder area */}              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start mb-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub Username
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Enter your GitHub username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="My GitHub README"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Theme
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Social Media Integration</h3>
                <IntegrationMenu socials={socials} onChange={setSocials} />
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-4 ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {builderBlocks.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Drag and drop blocks here to start building your README
                  </div>
                ) : (
                  <div className="space-y-4">
                    {builderBlocks.map(block => (
                      <div
                        key={block.id}
                        className={`bg-white dark:bg-gray-700 rounded p-4 shadow border ${selectedBlockId === block.id ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-600'} transition-all`}
                        onClick={() => handleBlockSelect(block.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{block.label}</span>
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{block.type}</span>
                          <div className="ml-auto flex items-center space-x-1">
                            <button 
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveBlockUp(block.id);
                              }}
                              disabled={builderBlocks.indexOf(block) === 0}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveBlockDown(block.id);
                              }}
                              disabled={builderBlocks.indexOf(block) === builderBlocks.length - 1}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveBlock(block.id);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>                        {/* Widget Block Content */}
                        {block.type === 'widget' && block.widgetId === 'github-stats' && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">GitHub Stats Widget</span>
                              {username && <span>for @{username}</span>}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {widgetConfig.showTrophies && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Trophies</span>
                              )}
                              {widgetConfig.showStreak && (
                                <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">Streak</span>
                              )}
                              {widgetConfig.includePrivate && (
                                <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">Private</span>
                              )}
                            </div>
                          </div>
                        )}
                        {block.type === 'widget' && block.widgetId === 'top-languages' && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Top Languages Widget</span>
                              {username && <span>for @{username}</span>}
                            </div>
                            <div className="text-xs mt-2">
                              Layout: <span className="font-medium">{widgetConfig.layout || 'compact'}</span>
                            </div>
                          </div>
                        )}                        {block.type === 'widget' && block.widgetId === 'social-stats' && (
                          <div className="text-sm mt-2">
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Social Stats Widget</span>
                                <div className="flex gap-2">
                                  {widgetConfig.showTrophies && (
                                    <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Trophies</span>
                                  )}
                                  {widgetConfig.showStreak && (
                                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">Streak</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <SocialStatsWidget 
                              socials={socials}
                              theme={widgetConfig.theme || (theme === 'dark' ? 'dark' : 'light')} 
                              config={{
                                showTrophies: widgetConfig.showTrophies,
                                showStreak: widgetConfig.showStreak
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
                <div className="mt-4 flex justify-between">
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={() => setShowPreview(true)}
                  >
                    Preview
                  </button>
                  <button 
                    className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={() => setShowImportModal(true)}
                  >
                    Import
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={exportToFile}
                  >
                    Export
                  </button>                  <button 
                    className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    onClick={saveProject}
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar - Properties */}
            <div className="lg:col-span-3 border-l border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Properties</h3>
              
              {!selectedBlock ? (
                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select an element in the builder to edit its properties
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      {selectedBlock.label} Properties
                    </h4>
                    
                    {/* Template Block Properties */}
                    {selectedBlock.type === 'template' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Template Style
                          </label>
                          <select 
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            value={(selectedBlock as TemplateBlock).templateId}
                            onChange={(e) => updateTemplateProperty(selectedBlock.id, 'templateId', e.target.value)}
                          >
                            <option value="classic">Classic</option>
                            <option value="minimal">Minimal</option>
                          </select>
                        </div>
                      </div>
                    )}
                      {/* Widget Block Properties */}
                    {selectedBlock.type === 'widget' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Widget Type
                          </label>
                          <select 
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            value={(selectedBlock as WidgetBlock).widgetId}
                            onChange={(e) => updateWidgetProperty(selectedBlock.id, 'widgetId', e.target.value)}
                          >
                            <option value="github-stats">GitHub Stats</option>
                            <option value="top-languages">Top Languages</option>
                            <option value="social-stats">Social Stats</option>
                          </select>
                        </div>
                        
                        {/* Widget Configuration Panel */}
                        <div className="mt-4">
                          <ConfigPanel 
                            config={widgetConfig}
                            onChange={setWidgetConfig}
                            title="Widget Configuration"
                            widgetType={(selectedBlock as WidgetBlock).widgetId as 'github-stats' | 'top-languages' | 'social-stats'}
                          />
                        </div>
                      </div>
                    )}
                      {/* Content Block Properties */}
                    {selectedBlock.type === 'content' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                            Edit {selectedBlock.label} Content
                          </label>
                          <div className="border border-blue-100 dark:border-blue-900 rounded-lg overflow-hidden">
                            <MarkdownEditor
                              initialValue={(selectedBlock as ContentBlock).content}
                              onChange={(value) => updateBlockContent(selectedBlock.id, value)}
                              height="350px"
                              showPreview={true}
                              placeholder="Enter your markdown content here..."
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Use Markdown to format your content. You can add headings, lists, links, and more.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-gray-800/50 dark:bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 my-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">README Preview</h3>
                <button 
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" 
                  onClick={() => setShowPreview(false)}
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex h-[70vh]">
                {/* Markdown Preview */}
                <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-auto p-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Markdown</h4>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto h-full font-mono whitespace-pre-wrap">
                    {generatePreview()}
                  </pre>
                </div>
                
                {/* Rendered Preview */}
                <div className="w-1/2 overflow-auto p-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Rendered</h4>
                  <div className="prose dark:prose-invert prose-sm max-w-none">                    {/* Use the ReactMarkdown component to render the markdown */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md h-full min-h-[400px] overflow-auto">
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                        >
                          {generatePreview()}
                        </ReactMarkdown>
                      </div>
                        {/* GitHub Stats Widget Preview (if applicable) */}
                      {username && builderBlocks.some(b => b.type === 'widget' && b.widgetId === 'github-stats') && (
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md my-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">GitHub Stats for @{username}</h4>
                          
                          <div className="space-y-4">
                            <div className="h-[150px] bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Stats Widget Preview</span>
                            </div>
                            
                            {widgetConfig.showTrophies && (
                              <div className="mt-4">
                                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">🏆 GitHub Trophies</h5>
                                <div className="h-[100px] bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Trophies Widget Preview</span>
                                </div>
                              </div>
                            )}
                            
                            {widgetConfig.showStreak && (
                              <div className="mt-4">
                                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">🔥 GitHub Streak Stats</h5>
                                <div className="h-[100px] bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Streak Stats Widget Preview</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}                      {/* Social Stats Widget Preview (if applicable) */}
                      {builderBlocks.some(b => b.type === 'widget' && b.widgetId === 'social-stats') && (
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md my-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Media Stats Preview</h4>
                            <div className="flex gap-2">
                              {widgetConfig.showTrophies && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Trophies</span>
                              )}
                              {widgetConfig.showStreak && (
                                <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">Streak</span>
                              )}
                            </div>
                          </div>
                          
                          <SocialStatsWidget 
                            socials={socials} 
                            theme={widgetConfig.theme || (theme === 'dark' ? 'dark' : 'light')} 
                            config={{
                              showTrophies: widgetConfig.showTrophies,
                              showStreak: widgetConfig.showStreak
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button 
                  className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white"
                  onClick={() => {
                    // Copy markdown to clipboard
                    navigator.clipboard.writeText(generatePreview())
                      .then(() => {
                        alert('Markdown copied to clipboard!');
                      })
                      .catch(err => {
                        console.error('Failed to copy: ', err);
                      });
                  }}
                >
                  Copy Markdown
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}