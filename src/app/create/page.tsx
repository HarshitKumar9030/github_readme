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

  // State for toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Tab state for sidebar
  const [activeTab, setActiveTab] = useState<'blocks' | 'templates'>('blocks');

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

  // Function to load template presets
  const loadTemplate = (templateType: string) => {
    // Create template-based blocks based on the template type
    let newBlocks: Block[] = [];

    switch(templateType) {
      case 'personal':
        // Personal profile template
        newBlocks = [
          { 
            id: `content-${Date.now()}-1`, 
            type: "content", 
            label: "Introduction", 
            content: `# Hi 👋, I'm ${username || '[Your Name]'}\n\nA passionate developer from [Your Location]` 
          },
          { 
            id: `widget-${Date.now()}-1`, 
            type: "widget", 
            label: "GitHub Stats", 
            widgetId: "github-stats",
            theme: widgetConfig.theme
          },
          { 
            id: `content-${Date.now()}-2`, 
            type: "content", 
            label: "Skills", 
            content: `## Skills\n\n- Programming Languages: TypeScript, JavaScript, Python\n- Frontend: React, Next.js, HTML, CSS\n- Backend: Node.js, Express\n- Database: MongoDB, PostgreSQL\n- Tools: Git, Docker, VS Code` 
          },
          { 
            id: `widget-${Date.now()}-2`, 
            type: "widget", 
            label: "Social Stats", 
            widgetId: "social-stats",
            theme: widgetConfig.theme
          }
        ];
        break;
      
      case 'project':
        // Project overview template
        newBlocks = [
          { 
            id: `content-${Date.now()}-1`, 
            type: "content", 
            label: "Project Introduction", 
            content: `# Project Name\n\n[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)\n[![GitHub Stars](https://img.shields.io/github/stars/${username || 'yourusername'}/project-name.svg)](https://github.com/${username || 'yourusername'}/project-name/stargazers)\n\nA brief description of your project, what it does and why it's useful.` 
          },
          { 
            id: `content-${Date.now()}-2`, 
            type: "content", 
            label: "Features", 
            content: `## Features\n\n- **Feature 1**: Description of feature 1\n- **Feature 2**: Description of feature 2\n- **Feature 3**: Description of feature 3` 
          },
          { 
            id: `content-${Date.now()}-3`, 
            type: "content", 
            label: "Installation", 
            content: `## Installation\n\n\`\`\`bash\n# Clone the repository\ngit clone https://github.com/${username || 'yourusername'}/project-name.git\n\n# Navigate to the project directory\ncd project-name\n\n# Install dependencies\nnpm install\n\n# Start the application\nnpm start\n\`\`\`` 
          },
          { 
            id: `widget-${Date.now()}-1`, 
            type: "widget", 
            label: "Top Languages", 
            widgetId: "top-languages",
            theme: widgetConfig.theme
          }
        ];
        break;
      
      case 'minimal':
        // Minimal template
        newBlocks = [
          { 
            id: `content-${Date.now()}-1`, 
            type: "content", 
            label: "Introduction", 
            content: `# ${username || 'Username'}\n\n> Simple. Clean. Effective.` 
          },
          { 
            id: `widget-${Date.now()}-1`, 
            type: "widget", 
            label: "GitHub Stats", 
            widgetId: "github-stats",
            theme: widgetConfig.theme
          },
          { 
            id: `content-${Date.now()}-2`, 
            type: "content", 
            label: "Current Work", 
            content: `## Currently working on\n\n- [Project 1](https://github.com/${username || 'username'}/project-1)\n- [Project 2](https://github.com/${username || 'username'}/project-2)` 
          }
        ];
        break;
      
      case 'portfolio':
        // Portfolio template
        newBlocks = [
          { 
            id: `content-${Date.now()}-1`, 
            type: "content", 
            label: "Portfolio Header", 
            content: `<div align="center">\n  <img src="https://your-profile-image-url.jpg" alt="Profile" width="200" style="border-radius:50%;">\n  <h1>${username || 'Your Name'}</h1>\n  <p>Full-stack Developer | UI/UX Enthusiast | Open Source Contributor</p>\n</div>` 
          },
          { 
            id: `widget-${Date.now()}-1`, 
            type: "widget", 
            label: "Social Stats", 
            widgetId: "social-stats",
            theme: widgetConfig.theme
          },
          { 
            id: `content-${Date.now()}-2`, 
            type: "content", 
            label: "Portfolio Projects", 
            content: `## Portfolio\n\n<table>\n  <tr>\n    <td width="50%">\n      <h3 align="center">Project 1</h3>\n      <p align="center">\n        <img src="https://project-1-screenshot.jpg" alt="Project 1" width="100%">\n      </p>\n      <p align="center">\n        <a href="https://github.com/${username || 'yourusername'}/project-1">Source Code</a> | \n        <a href="https://project-1-demo.com">Live Demo</a>\n      </p>\n    </td>\n    <td width="50%">\n      <h3 align="center">Project 2</h3>\n      <p align="center">\n        <img src="https://project-2-screenshot.jpg" alt="Project 2" width="100%">\n      </p>\n      <p align="center">\n        <a href="https://github.com/${username || 'yourusername'}/project-2">Source Code</a> | \n        <a href="https://project-2-demo.com">Live Demo</a>\n      </p>\n    </td>\n  </tr>\n</table>` 
          },
          { 
            id: `widget-${Date.now()}-2`, 
            type: "widget", 
            label: "Top Languages", 
            widgetId: "top-languages",
            theme: widgetConfig.theme
          }
        ];
        break;
      
      default:
        // Empty template as fallback
        newBlocks = [
          { 
            id: `content-${Date.now()}-1`, 
            type: "content", 
            label: "Content", 
            content: `# ${username || 'Your Name'}\n\nAdd your content here...` 
          }
        ];
    }
    
    // Set the new blocks
    setBuilderBlocks(newBlocks);
    
    // Show confirmation toast
    setToastMessage(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template applied successfully!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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
  };  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Top Header Bar with Project Name and GitHub Username */}
          <div className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-2 pl-4 pr-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-700 sm:text-sm sm:leading-6"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-md shadow-sm w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <input 
                  id="github-username" 
                  type="text" 
                  className="w-full sm:w-56 pl-9 pr-3 py-2 border-0 rounded-md text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-700 sm:text-sm sm:leading-6"
                  placeholder="GitHub Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  className="rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-700 sm:text-sm"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            {/* Left sidebar with modern tabs */}
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
                  
                  {/* Minimal */}
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
                  
                  {/* Portfolio */}
                  <div 
                    className="group bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer shadow-sm hover:shadow"
                    onClick={() => loadTemplate('portfolio')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Portfolio</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Showcase your work with visuals and descriptions</p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>              {/* Main Builder Area */}
            <div className="lg:col-span-6 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  README Builder
                </h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center hover:bg-gray-200 dark:hover:bg-gray-600">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Undo
                  </button>
                  <button className="px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center hover:bg-gray-200 dark:hover:bg-gray-600">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Redo
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-auto">
                <div 
                  className={`border-2 border-dashed rounded-lg ${dragOver 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-4 ring-blue-500/20' 
                    : 'border-gray-200 dark:border-gray-700'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="p-4">
                    {builderBlocks.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No blocks yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Drag and drop blocks from the sidebar to start building your README
                        </p>
                        <div className="mt-6 flex justify-center">
                          <button
                            type="button"
                            onClick={() => loadTemplate('personal')}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Start with a template
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                        {builderBlocks.map((block, index) => (
                          <div
                            key={block.id}
                            className={`pt-4 ${index > 0 ? 'pt-4' : ''}`}
                          >
                            <div 
                              className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border ${
                                selectedBlockId === block.id 
                                  ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-800' 
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900'
                              } transition-all cursor-pointer`}
                              onClick={() => handleBlockSelect(block.id)}
                            >
                              <div className="flex items-center gap-3">
                                {block.type === 'content' ? (
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                  </svg>
                                ) : block.type === 'widget' ? (
                                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                                <span className="font-medium text-gray-900 dark:text-white">{block.label}</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{block.type}</span>
                                <div className="ml-auto flex items-center space-x-1">
                                  <button 
                                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveBlockUp(block.id);
                                    }}
                                    disabled={builderBlocks.indexOf(block) === 0}
                                    title="Move up"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                  </button>
                                  <button 
                                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveBlockDown(block.id);
                                    }}
                                    disabled={builderBlocks.indexOf(block) === builderBlocks.length - 1}
                                    title="Move down"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                  </button>
                                  <button 
                                    className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveBlock(block.id);
                                    }}
                                    title="Remove block"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Widget Block Content */}
                              {block.type === 'widget' && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                  {block.widgetId === 'github-stats' && (
                                    <div className="flex flex-col">
                                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <span className="font-medium">GitHub Stats</span>
                                        {username && <span>@{username}</span>}
                                      </div>
                                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 flex items-center justify-center">
                                        <div className="grid grid-cols-3 gap-3 w-full">
                                          <div className={`flex items-center gap-2 ${widgetConfig.showIcons ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="text-xs font-medium">Show Icons</span>
                                          </div>
                                          <div className={`flex items-center gap-2 ${widgetConfig.showTrophies ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                            <span className="text-xs font-medium">Trophies</span>
                                          </div>
                                          <div className={`flex items-center gap-2 ${widgetConfig.showStreak ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                            <span className="text-xs font-medium">Streak Stats</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {block.widgetId === 'top-languages' && (
                                    <div className="flex flex-col">
                                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <span className="font-medium">Top Languages</span>
                                        {username && <span>@{username}</span>}
                                      </div>
                                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 flex flex-col items-center justify-center">
                                        <div className="flex items-center mb-3">
                                          <span className="text-xs font-medium mr-2">Layout:</span>
                                          <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                            {widgetConfig.layout || 'compact'}
                                          </span>
                                        </div>
                                        <div className="flex gap-2 w-full justify-center">
                                          <div className="h-4 w-20 rounded-full bg-blue-400 dark:bg-blue-600"></div>
                                          <div className="h-4 w-16 rounded-full bg-green-400 dark:bg-green-600"></div>
                                          <div className="h-4 w-12 rounded-full bg-yellow-400 dark:bg-yellow-600"></div>
                                          <div className="h-4 w-8 rounded-full bg-purple-400 dark:bg-purple-600"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {block.widgetId === 'social-stats' && (
                                    <div className="flex flex-col">
                                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <span className="font-medium">Social Stats</span>
                                        <div className="flex gap-2">
                                          {widgetConfig.showTrophies && (
                                            <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">Trophies</span>
                                          )}
                                          {widgetConfig.showStreak && (
                                            <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded">Streak</span>
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
                              )}
                              
                              {/* Content Block Preview */}
                              {block.type === 'content' && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 max-h-40 overflow-hidden relative">
                                    <div className="prose dark:prose-invert prose-sm max-w-none line-clamp-3">
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {(block as ContentBlock).content || 'No content yet. Click to edit.'}
                                      </ReactMarkdown>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-50 dark:from-gray-900/50 to-transparent pointer-events-none"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                <div className="flex flex-wrap gap-2 justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-1"
                      onClick={() => setShowPreview(true)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </button>
                    <button 
                      className="px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-1"
                      onClick={() => setShowImportModal(true)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Import
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-1"
                      onClick={exportToFile}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export
                    </button>
                    <button 
                      className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center gap-1"
                      onClick={saveProject}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Project
                    </button>
                  </div>
                </div>
              </div>
            </div>            {/* Right Sidebar - Properties */}
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
                          >
                            <option value="github-stats">GitHub Stats</option>
                            <option value="top-languages">Top Languages</option>
                            <option value="social-stats">Social Stats</option>
                          </select>
                        </div>
                        
                        {/* Widget Configuration Panel */}
                        <div className="pt-2">
                          <ConfigPanel 
                            config={widgetConfig}
                            onChange={setWidgetConfig}
                            title="Widget Settings"
                            widgetType={(selectedBlock as WidgetBlock).widgetId as 'github-stats' | 'top-languages' | 'social-stats'}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Content Block Properties */}
                    {selectedBlock.type === 'content' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
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
                            <MarkdownEditor
                              initialValue={(selectedBlock as ContentBlock).content}
                              onChange={(value) => updateBlockContent(selectedBlock.id, value)}
                              height="400px"
                              showPreview={true}
                              placeholder="Enter your markdown content here..."
                            />
                          </div>
                          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Use Markdown to format your content</span>
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