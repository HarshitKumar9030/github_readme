'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

// Components
import MobileWarning from '@/components/MobileWarning';
import ReadmePreview from './README-Preview';
import HeaderBar from './components/HeaderBar';
import BuilderSidebar from './components/BuilderSidebar';
import BuilderArea from './components/BuilderArea';
import PropertiesPanel from './components/PropertiesPanel';
import FooterBar from './components/FooterBar';

// Services
import LocalStorageService from '@/services/LocalStorageService';

// Types and Interfaces
import { Block, ContentBlock, TemplateBlock, WidgetBlock } from '@/interfaces/BlockTypes';
import { Socials } from '@/interfaces/Socials';
import { WidgetConfig } from '@/interfaces/WidgetConfig';
import { AutoSaveData, ReadmeProject } from '@/interfaces/ProjectInterfaces';

export default function CreatePage() {
  // Define available blocks
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

  // State
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
    includeAllCommits: true
  });
    // Interface state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showMobileWarning, setShowMobileWarning] = useState(true);
  const [activeTab, setActiveTab] = useState<'blocks' | 'templates' | 'social' | 'settings'>('blocks');
  const [projectName, setProjectName] = useState<string>('My README');
  const [username, setUsername] = useState<string>('');
  const { theme, setTheme } = useTheme();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [projects, setProjects] = useState<ReadmeProject[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [markdownCache, setMarkdownCache] = useState<Record<string, string>>({});

  // Handle markdown generation from widget components
  const handleWidgetMarkdownGenerated = (blockId: string, markdown: string) => {
    setMarkdownCache(prev => ({
      ...prev,
      [blockId]: markdown
    }));
  };

  // Generate complete markdown preview from all blocks
  const generatePreview = () => {
    let markdown = '';
    
    // Title section
    markdown += `# ${projectName}\n\n`;
    
    // GitHub username if available
    if (username) {
      markdown += `> Created by [${username}](https://github.com/${username})\n\n`;
    }
    
    // Generate markdown for each block
    builderBlocks.forEach(block => {
      if (block.type === 'widget') {
        // Use cached markdown for widgets if available
        const cachedMarkdown = markdownCache[block.id];
        if (cachedMarkdown) {
          markdown += cachedMarkdown;
        } else {
          // Fallback for widgets without cached markdown
          if (block.widgetId === 'github-stats') {
            const statsUrl = `/api/github-stats-svg?username=${username}&theme=${widgetConfig.theme || 'light'}&hideBorder=${widgetConfig.hideBorder || false}&hideTitle=${widgetConfig.hideTitle || false}&layout=${widgetConfig.layoutCompact ? 'compact' : 'default'}`;
            markdown += `\n## GitHub Stats\n\n`;
            markdown += `<img src="${statsUrl}" alt="GitHub Stats" />\n\n`;
          } else if (block.widgetId === 'top-languages') {
            markdown += `\n## Top Languages\n\n`;
            markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${widgetConfig.theme || 'light'})\n\n`;
          } else if (block.widgetId === 'social-stats') {
            markdown += `\n## Connect With Me\n\n`;
            if (socials.github) markdown += `- [GitHub](https://github.com/${socials.github})\n`;
            if (socials.twitter) markdown += `- [Twitter](https://twitter.com/${socials.twitter})\n`;
            if (socials.linkedin) markdown += `- [LinkedIn](https://linkedin.com/in/${socials.linkedin})\n`;
            if (socials.instagram) markdown += `- [Instagram](https://instagram.com/${socials.instagram})\n\n`;
          }
        }
      } else if (block.type === 'content') {
        // Content blocks just add their content directly
        markdown += `\n${(block as ContentBlock).content}\n\n`;
      } else if (block.type === 'template') {
        // Handle templates
        const templateId = (block as TemplateBlock).templateId;
        if (templateId === 'classic') {
          markdown += `\n## About Me\n\nA passionate developer focused on creating elegant solutions.\n\n`;
          markdown += `## Projects\n\n- Project 1: Description\n- Project 2: Description\n\n`;
          markdown += `## Skills\n\n- Skill 1\n- Skill 2\n- Skill 3\n\n`;
        } else if (templateId === 'minimal') {
          markdown += `\n## ${username || 'Developer'}\n\n`;
          markdown += `Currently working on interesting projects.\n\n`;
          markdown += `### Contact\n\n📧 Email: example@example.com\n\n`;
        }
      }
    });
    
    // Add footer
    markdown += `---\n`;
    markdown += `*This README was generated with ❤️ by [GitHub Readme Generator](https://github.com/username/readme-generator)*\n`;
    
    return markdown;
  };

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
          theme: (theme as 'light' | 'dark' | 'auto') || 'light',
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
    setUsername(project.settings?.username ?? '');
    setTheme(project.settings?.theme ?? 'light');
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
          theme: (theme as 'light' | 'dark' | 'auto') || 'light',
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

  const handleBlockSelect = (id: string): void => {
    setSelectedBlockId(id === selectedBlockId ? null : id);
  };

  // Block manipulation functions
  const handleRemoveBlock = (id: string): void => {
    setBuilderBlocks(builderBlocks.filter(block => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleMoveBlockUp = (id: string): void => {
    const index = builderBlocks.findIndex(block => block.id === id);
    if (index > 0) {
      const newBlocks = [...builderBlocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBuilderBlocks(newBlocks);
    }
  };

  const handleMoveBlockDown = (id: string): void => {
    const index = builderBlocks.findIndex(block => block.id === id);
    if (index !== -1 && index < builderBlocks.length - 1) {
      const newBlocks = [...builderBlocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setBuilderBlocks(newBlocks);
    }
  };

  function loadTemplate(templateType: string): void {
    setBuilderBlocks([]);
    
    switch (templateType) {
      case 'classic':
        setBuilderBlocks([
          { 
            id: `template-classic-${Date.now()}`, 
            type: "template", 
            label: "Classic Template", 
            templateId: "classic" 
          },
          {
            id: `block-about-${Date.now()}`,
            type: "content",
            label: "About Me",
            content: "## About Me\n\nA passionate developer focused on creating elegant solutions."
          },
          {
            id: `block-projects-${Date.now()}`,
            type: "content",
            label: "Projects",
            content: "## Projects\n\n- Project 1: Description\n- Project 2: Description"
          },
          {
            id: `widget-stats-${Date.now()}`,
            type: "widget",
            label: "GitHub Stats",
            widgetId: "github-stats"
          }
        ]);
        break;
        
      case 'minimal':
        setBuilderBlocks([
          { 
            id: `template-minimal-${Date.now()}`, 
            type: "template", 
            label: "Minimal Template", 
            templateId: "minimal" 
          },
          {
            id: `block-intro-${Date.now()}`,
            type: "content",
            label: "Introduction",
            content: `## ${username || 'Developer'}\n\nCurrently working on interesting projects.`
          },
          {
            id: `widget-languages-${Date.now()}`,
            type: "widget",
            label: "Top Languages",
            widgetId: "top-languages"
          }
        ]);
        break;
        
      case 'social':
        setBuilderBlocks([
          {
            id: `widget-social-${Date.now()}`,
            type: "widget",
            label: "Social Stats",
            widgetId: "social-stats"
          },
          {
            id: `block-intro-${Date.now()}`,
            type: "content",
            label: "Introduction",
            content: `# Hi there! I'm ${username || '[Your Name]'}\n\nWelcome to my GitHub profile!`
          }
        ]);
        break;
        
      default:
        setToastMessage(`Unknown template type: ${templateType}`);
        setShowToast(true);
        return;
    }
    
    // Show success message
    setToastMessage(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template loaded successfully!`);
    setShowToast(true);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  function updateBlockContent(id: string, content: string): void {
    setBuilderBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id && block.type === 'content'
          ? { ...block, content }
          : block
      )
    );
  }

  function updateWidgetProperty<K extends keyof WidgetBlock>(id: string, property: K, value: WidgetBlock[K]): void {
    setBuilderBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id && block.type === 'widget'
          ? { ...block, [property]: value }
          : block
      )
    );
  }

  // Add this function to fix the error
  function updateTemplateProperty<K extends keyof TemplateBlock>(id: string, property: K, value: TemplateBlock[K]): void {
    setBuilderBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id && block.type === 'template'
          ? { ...block, [property]: value }
          : block
      )
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      {/* Mobile warning popup */}
      {showMobileWarning && <MobileWarning onDismiss={() => setShowMobileWarning(false)} />}
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-12">
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
          <HeaderBar 
            projectName={projectName}
            setProjectName={setProjectName}
            username={username}
            setUsername={setUsername}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
            {/* Left sidebar with tabs */}
            <BuilderSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <PropertiesPanel 
              selectedBlock={builderBlocks.find(block => block.id === selectedBlockId) || null}
              selectedBlockId={selectedBlockId}
              setSelectedBlockId={setSelectedBlockId}
              updateBlockContent={updateBlockContent}
              updateBlockLayout={updateBlockLayout}
              updateBlockContainerLayout={updateBlockContainerLayout}
              updateTemplateProperty={updateTemplateProperty}
              updateWidgetProperty={updateWidgetProperty}
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
              username={username}
            />

            {/* Main Builder Area */}
            <BuilderArea 
              builderBlocks={builderBlocks}
              dragOver={dragOver}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              selectedBlockId={selectedBlockId}
              handleBlockSelect={handleBlockSelect}
              handleRemoveBlock={handleRemoveBlock}
              handleMoveBlockUp={handleMoveBlockUp}
              handleMoveBlockDown={handleMoveBlockDown}
              loadTemplate={loadTemplate}
            />

            {/* Right Sidebar - Properties */}
            <PropertiesPanel 
              selectedBlock={selectedBlock}
              selectedBlockId={selectedBlockId}
              setSelectedBlockId={setSelectedBlockId}
              updateBlockContent={updateBlockContent}
              updateBlockLayout={updateBlockLayout}
              updateBlockContainerLayout={updateBlockContainerLayout}
              updateTemplateProperty={updateTemplateProperty}
              updateWidgetProperty={updateWidgetProperty}
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
              username={username}
            />
          </div>

          {/* Footer Actions */}
          <FooterBar 
            setShowPreview={setShowPreview}
            setShowImportModal={setShowImportModal}
            exportToFile={exportToFile}
            saveProject={saveProject}
          />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <ReadmePreview 
            content={generatePreview()}
            onClose={() => setShowPreview(false)}
            onCopy={() => {
              navigator.clipboard.writeText(generatePreview())
                .then(() => {
                  alert('Markdown copied to clipboard!');
                })
                .catch(err => {
                  console.error('Failed to copy: ', err);
                });
            }}
          />
        )}

        {/* Import Modal would go here */}
        {/* Toast notifications would go here */}
      </div>
    </div>
  );
}
