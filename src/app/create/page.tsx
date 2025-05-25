"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

// Components
import MobileWarning from "@/components/MobileWarning";
import ReadmePreview from "./README-Preview";
import HeaderBar from "./components/HeaderBar";
import BuilderSidebar from "./components/BuilderSidebar";
import BuilderArea from "./components/BuilderArea";
import PropertiesPanel from "./components/PropertiesPanel";
import FooterBar from "./components/FooterBar";

// Services
import LocalStorageService from "@/services/LocalStorageService";

// Types and Interfaces
import {
  Block,
  ContentBlock,
  TemplateBlock,
  WidgetBlock,
} from "@/interfaces/BlockTypes";
import { Socials } from "@/interfaces/Socials";
import { WidgetConfig } from "@/interfaces/WidgetConfig";
import { AutoSaveData, ReadmeProject } from "@/interfaces/ProjectInterfaces";

export default function CreatePage() {
  // Define available blocks
  const availableBlocks: Block[] = [
    {
      id: "template-1",
      type: "template",
      label: "Classic Template",
      templateId: "classic",
    },
    {
      id: "template-2",
      type: "template",
      label: "Minimal Template",
      templateId: "minimal",
    },
    {
      id: "widget-1",
      type: "widget",
      label: "GitHub Stats",
      widgetId: "github-stats",
    },
    {
      id: "widget-2",
      type: "widget",
      label: "Top Languages",
      widgetId: "top-languages",
    },    {
      id: "widget-3",
      type: "widget",
      label: "Social Stats",
      widgetId: "social-stats",
    },
    {
      id: "widget-4",
      type: "widget",
      label: "Contribution Graph",
      widgetId: "contribution-graph",
    },
    {
      id: "block-1",
      type: "content",
      label: "About Me",
      content: "About me content",
    },
    {
      id: "block-2",
      type: "content",
      label: "Skills",
      content: "Skills content",
    },
    {
      id: "block-3",
      type: "content",
      label: "Projects",
      content: "Projects content",
    },
  ];

  // State
  const [builderBlocks, setBuilderBlocks] = useState<Block[]>([]);  // Undo/Redo state management
  const [history, setHistory] = useState<Block[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Timeout for debouncing content updates in history
  const contentUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

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
    theme: "light",
    showIcons: true,
    includePrivate: false,
    layout: "compact",
    includeAllCommits: true,
  });
  // Interface state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showMobileWarning, setShowMobileWarning] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "blocks" | "templates" | "social" | "settings"
  >("blocks");
  const [projectName, setProjectName] = useState<string>("My README");
  const [username, setUsername] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [projects, setProjects] = useState<ReadmeProject[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [livePreviewMode, setLivePreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [markdownCache, setMarkdownCache] = useState<Record<string, string>>(
    {}
  );

  // Handle markdown generation from widget components
  const handleWidgetMarkdownGenerated = (blockId: string, markdown: string) => {
    setMarkdownCache((prev) => ({
      ...prev,
      [blockId]: markdown,
    }));
  };

  // Load saved data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = LocalStorageService.load<AutoSaveData | null>(
        AUTOSAVE_KEY,
        null
      );

      if (savedData) {
        setBuilderBlocks(savedData.blocks || []);
        setProjectName(savedData.projectName || "My README");
        setUsername(savedData.githubUsername || "");
        setSocials(
          savedData.socials || {
            github: "",
            instagram: "",
            twitter: "",
            linkedin: "",
          }
        );
        setWidgetConfig(
          savedData.widgetConfig || {
            theme: "light",
            showIcons: true,
            includePrivate: false,
            layout: "compact",
            includeAllCommits: true,
          }
        );
      }
    }
  }, []);

  // Initialize history when builderBlocks changes from loading saved data
  useEffect(() => {
    if (builderBlocks.length > 0 && history.length === 1 && history[0].length === 0) {
      // Only initialize history if it's empty and we have blocks (from saved data)
      setHistory([builderBlocks]);
      setHistoryIndex(0);
    }
  }, [builderBlocks, history]);

  const generatePreview = useCallback(() => {
    try {
      let markdown = "";

      // Header with project name and optional user badge
      const sanitizedProjectName = projectName?.trim() || "My Awesome Project";
      markdown += `# ${sanitizedProjectName}\n\n`;

      // Add user profile badge if username is provided
      if (username?.trim()) {
        markdown += `<div align="center">\n\n`;
        markdown += `[![Profile Badge](https://img.shields.io/badge/Profile-${username}-blue?style=for-the-badge&logo=github)](https://github.com/${username})\n\n`;
        markdown += `</div>\n\n`;
        markdown += `> Created by **[${username}](https://github.com/${username})**\n\n`;
      }

      // Add table of contents if there are multiple sections
      if (builderBlocks.length > 1) {
        markdown += `## 📋 Table of Contents\n\n`;
        builderBlocks.forEach((block, index) => {
          if (block.type === "widget") {
            const widgetName =
              block.widgetId === "github-stats"
                ? "GitHub Stats"
                : block.widgetId === "top-languages"
                ? "Top Languages"
                : block.widgetId === "social-stats"
                ? "Connect With Me"
                : "Widget";
            markdown += `- [${widgetName}](#${widgetName
              .toLowerCase()
              .replace(/\s+/g, "-")})\n`;
          } else if (block.type === "template") {
            const templateName =
              (block as TemplateBlock).templateId === "classic"
                ? "About Me"
                : "Profile";
            markdown += `- [${templateName}](#${templateName
              .toLowerCase()
              .replace(/\s+/g, "-")})\n`;
          } else if (block.type === "content") {
            const contentTitle = `Section ${index + 1}`;
            markdown += `- [${contentTitle}](#${contentTitle
              .toLowerCase()
              .replace(/\s+/g, "-")})\n`;
          }
        });
        markdown += `\n`;
      }

      // Generate markdown for each block with enhanced styling
      builderBlocks.forEach((block, index) => {
        if (block.type === "widget") {
          // Use cached markdown for widgets if available
          const cachedMarkdown = markdownCache[block.id];
          if (cachedMarkdown) {
            markdown += cachedMarkdown;
          } else {
            // Enhanced fallback for widgets without cached markdown
            if (block.widgetId === "github-stats" && username?.trim()) {
              markdown += `\n## 📊 GitHub Stats\n\n`;
              markdown += `<div align="center">\n\n`;

              const statsUrl = `/api/github-stats-svg?username=${username}&theme=${
                widgetConfig.theme || "light"
              }&hideBorder=${widgetConfig.hideBorder || false}&hideTitle=${
                widgetConfig.hideTitle || false
              }&layout=${widgetConfig.layoutCompact ? "compact" : "default"}`;

              markdown += `<img src="${statsUrl}" alt="${username}'s GitHub Stats" width="400" />\n\n`;
              markdown += `</div>\n\n`;
            } else if (block.widgetId === "top-languages" && username?.trim()) {
              markdown += `\n## 🚀 Top Languages\n\n`;
              markdown += `<div align="center">\n\n`;
              markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${
                widgetConfig.theme || "light"
              }&hide_border=${widgetConfig.hideBorder || false})\n\n`;
              markdown += `</div>\n\n`;
            } else if (block.widgetId === "social-stats") {
              markdown += `\n## 🌐 Connect With Me\n\n`;
              markdown += `<div align="center">\n\n`;

              const socialLinks = [];
              if (socials.github?.trim()) {
                socialLinks.push(
                  `[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${socials.github})`
                );
              }
              if (socials.linkedin?.trim()) {
                socialLinks.push(
                  `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`
                );
              }
              if (socials.twitter?.trim()) {
                socialLinks.push(
                  `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${socials.twitter})`
                );
              }
              if (socials.instagram?.trim()) {
                socialLinks.push(
                  `[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/${socials.instagram})`
                );
              }

              if (socialLinks.length > 0) {
                markdown += socialLinks.join(" ") + "\n\n";
              } else {
                markdown += `*Social links will appear here once you add them in the Social tab.*\n\n`;
              }
              markdown += `</div>\n\n`;
            }
          }
        } else if (block.type === "content") {
          // Enhanced content blocks with better formatting
          const contentBlock = block as ContentBlock;
          const content = contentBlock.content?.trim();
          if (content) {
            markdown += `\n${content}\n\n`;
          }
        } else if (block.type === "template") {
          // Enhanced templates with better styling
          const templateId = (block as TemplateBlock).templateId;
          if (templateId === "classic") {
            markdown += `\n## 👨‍💻 About Me\n\n`;
            markdown += `<div align="center">\n\n`;
            markdown += `🚀 **Passionate Developer** | 💡 **Problem Solver** | 🌟 **Technology Enthusiast**\n\n`;
            markdown += `</div>\n\n`;
            markdown += `I'm a dedicated developer who loves creating elegant solutions to complex problems. With a focus on clean code and user experience, I strive to build applications that make a difference.\n\n`;

            markdown += `## 🛠️ Tech Stack & Skills\n\n`;
            markdown += `<div align="center">\n\n`;
            markdown += `![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)\n`;
            markdown += `![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)\n`;
            markdown += `![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)\n`;
            markdown += `![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)\n\n`;
            markdown += `</div>\n\n`;

            markdown += `## 🎯 Current Focus\n\n`;
            markdown += `- 🔭 Working on exciting open-source projects\n`;
            markdown += `- 🌱 Learning cutting-edge technologies\n`;
            markdown += `- 👯 Looking to collaborate on innovative solutions\n`;
            markdown += `- 💬 Ask me about web development and software architecture\n\n`;
          } else if (templateId === "minimal") {
            markdown += `\n## 👋 Hello, I'm ${username || "a Developer"}!\n\n`;
            markdown += `<div align="center">\n\n`;
            markdown += `*Building the future, one commit at a time* ✨\n\n`;
            markdown += `</div>\n\n`;
            markdown += `Currently working on interesting projects and always eager to learn new technologies.\n\n`;
            markdown += `### 📫 How to reach me\n\n`;
            if (username) {
              markdown += `- 💼 GitHub: [@${username}](https://github.com/${username})\n`;
            }
            markdown += `- 📧 Email: your.email@example.com\n`;
            markdown += `- 💭 Let's connect and build something amazing together!\n\n`;
          }
        }
      });

      // Enhanced footer with better styling
      if (builderBlocks.length === 0) {
        markdown += `## 🚀 Getting Started\n\n`;
        markdown += `Welcome to your new README! Start by adding some blocks from the sidebar to customize your profile.\n\n`;
        markdown += `### Quick Tips:\n`;
        markdown += `- Add your GitHub username in the settings\n`;
        markdown += `- Use widgets to show your GitHub stats\n`;
        markdown += `- Add social links to connect with others\n`;
        markdown += `- Use templates for quick setup\n\n`;
      }

      markdown += `---\n\n`;
      markdown += `<div align="center">\n\n`;
      markdown += `### 💝 Made with ❤️ using [GitHub README Generator](https://github.com/username/readme-generator)\n\n`;
      markdown += `*Last updated: ${new Date().toLocaleDateString()}*\n\n`;
      markdown += `</div>\n`;

      return markdown;
    } catch (error) {
      console.error("Error generating preview:", error);
      return `# ${
        projectName || "My Project"
      }\n\n**Error generating preview. Please check your configuration and try again.**\n\n---\n\n*Generated with GitHub README Generator*`;
    }
  }, [
    builderBlocks,
    projectName,
    username,
    socials,
    widgetConfig,
    markdownCache,
  ]);

  // Live preview update effect
  useEffect(() => {
    if (livePreviewMode || showPreview) {
      const newContent = generatePreview();
      setPreviewContent(newContent);
    }
  }, [
    builderBlocks,
    projectName,
    username,
    socials,
    widgetConfig,
    markdownCache,
    livePreviewMode,
    showPreview,
    generatePreview,
  ]);

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
          theme: (theme as "light" | "dark" | "auto") || "light",
        },
      };

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem("readme-projects", JSON.stringify(updatedProjects));
      setShowExportModal(false);

      // Show success feedback
      alert("Project saved successfully!");
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Please try again.");
    }
  };

  // Load a previously saved project
  const loadProject = (project: ReadmeProject) => {
    setBuilderBlocks(project.blocks);
    setProjectName(project.name);
    setUsername(project.settings?.username ?? "");
    setTheme(project.settings?.theme ?? "light");
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
          theme: (theme as "light" | "dark" | "auto") || "light",
        },
      };

      const dataStr = JSON.stringify(projectData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `${projectName
        .toLowerCase()
        .replace(/\s+/g, "-")}-readme.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error("Failed to export project:", error);
      alert("Failed to export project. Please try again.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === "string") {
          const projectData: ReadmeProject = JSON.parse(content);
          setBuilderBlocks(projectData.blocks);
          setProjectName(projectData.name);
          if (projectData.settings) {
            setUsername(projectData.settings.username || "");
            setTheme(projectData.settings.theme || "light");
          }
          setShowImportModal(false);
          alert("Project imported successfully!");
        }
      } catch (error) {
        console.error("Failed to parse project file:", error);
        alert("Failed to import project. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleDragStart = (block: Block) => setDraggedBlock(block);
  const handleDragEnd = () => setDraggedBlock(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (draggedBlock) {
      updateBuilderBlocksWithHistory([
        ...builderBlocks,
        { ...draggedBlock, id: `${draggedBlock.id}-${Date.now()}` },
      ]);
      setDraggedBlock(null);
    }
  };

  const handleBlockSelect = (id: string): void => {
    setSelectedBlockId(id === selectedBlockId ? null : id);
  };
  const handleRemoveBlock = (id: string): void => {
    updateBuilderBlocksWithHistory(builderBlocks.filter((block) => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };
  const handleMoveBlockUp = (id: string): void => {
    const index = builderBlocks.findIndex((block) => block.id === id);
    if (index > 0) {
      const newBlocks = [...builderBlocks];
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
      updateBuilderBlocksWithHistory(newBlocks);
    }
  };

  const handleMoveBlockDown = (id: string): void => {
    const index = builderBlocks.findIndex((block) => block.id === id);
    if (index !== -1 && index < builderBlocks.length - 1) {
      const newBlocks = [...builderBlocks];
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
      updateBuilderBlocksWithHistory(newBlocks);
    }
  };

  // Undo/Redo functionality
  const updateBuilderBlocksWithHistory = (newBlocks: Block[]): void => {
    // Remove any future history when making a new change
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newBlocks]);
    
    // Limit history to prevent memory issues (keep last 50 states)
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
    setBuilderBlocks(newBlocks);
  };
  const handleUndo = useCallback((): void => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBuilderBlocks([...history[newIndex]]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback((): void => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBuilderBlocks([...history[newIndex]]);
    }
  }, [historyIndex, history]);

  // Check if undo/redo is available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  function loadTemplate(templateType: string): void {
    let newBlocks: Block[] = [];

    switch (templateType) {
      case "classic":
        newBlocks = [
          {
            id: `template-classic-${Date.now()}`,
            type: "template",
            label: "Classic Template",
            templateId: "classic",
          },
          {
            id: `block-about-${Date.now()}`,
            type: "content",
            label: "About Me",
            content:
              "## About Me\n\nA passionate developer focused on creating elegant solutions.",
          },
          {
            id: `block-projects-${Date.now()}`,
            type: "content",
            label: "Projects",
            content:
              "## Projects\n\n- Project 1: Description\n- Project 2: Description",
          },
          {
            id: `widget-stats-${Date.now()}`,
            type: "widget",
            label: "GitHub Stats",
            widgetId: "github-stats",
          },
        ];
        break;

      case "minimal":
        newBlocks = [
          {
            id: `template-minimal-${Date.now()}`,
            type: "template",
            label: "Minimal Template",
            templateId: "minimal",
          },
          {
            id: `block-intro-${Date.now()}`,
            type: "content",
            label: "Introduction",
            content: `## ${
              username || "Developer"
            }\n\nCurrently working on interesting projects.`,
          },
          {
            id: `widget-languages-${Date.now()}`,
            type: "widget",
            label: "Top Languages",
            widgetId: "top-languages",
          },
        ];
        break;

      case "social":
        newBlocks = [
          {
            id: `widget-social-${Date.now()}`,
            type: "widget",
            label: "Social Stats",
            widgetId: "social-stats",
          },
          {
            id: `block-intro-${Date.now()}`,
            type: "content",
            label: "Introduction",
            content: `# Hi there! I'm ${
              username || "[Your Name]"
            }\n\nWelcome to my GitHub profile!`,
          },
        ];
        break;

      default:
        setToastMessage(`Unknown template type: ${templateType}`);
        setShowToast(true);
        return;
    }

    updateBuilderBlocksWithHistory(newBlocks);

    setToastMessage(
      `${
        templateType.charAt(0).toUpperCase() + templateType.slice(1)
      } template loaded successfully!`
    );
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }  function updateBlockContent(id: string, content: string): void {
    const newBlocks = builderBlocks.map((block) =>
      block.id === id && block.type === "content"
        ? { ...block, content }
        : block
    );
    setBuilderBlocks(newBlocks);
    
    // Debounce history updates for content to avoid too many history entries
    if (contentUpdateTimeout.current) {
      clearTimeout(contentUpdateTimeout.current);
    }
    contentUpdateTimeout.current = setTimeout(() => {
      updateBuilderBlocksWithHistory(newBlocks);
    }, 1000);
  }
  function updateWidgetProperty<K extends keyof WidgetBlock>(
    id: string,
    property: K,
    value: WidgetBlock[K]
  ): void {
    const newBlocks = builderBlocks.map((block) =>
      block.id === id && block.type === "widget"
        ? { ...block, [property]: value }
        : block
    );
    updateBuilderBlocksWithHistory(newBlocks);
  }
  // Add this function to fix the error
  function updateTemplateProperty<K extends keyof TemplateBlock>(
    id: string,
    property: K,
    value: TemplateBlock[K]
  ): void {
    const newBlocks = builderBlocks.map((block) =>
      block.id === id && block.type === "template"
        ? { ...block, [property]: value }
        : block
    );
    updateBuilderBlocksWithHistory(newBlocks);
  }  function updateBlockLayout(
    id: string,
    layout: "grid" | "flow" | "inline"
  ): void {
    const newBlocks = builderBlocks.map((block) =>
      block.id === id ? { ...block, layout } : block
    );
    updateBuilderBlocksWithHistory(newBlocks);
  }

  function updateBlockContainerLayout(
    id: string,
    blockLayout: "default" | "side-by-side" | "grid"
  ): void {
    const newBlocks = builderBlocks.map((block) =>
      block.id === id ? { ...block, blockLayout } : block
    );
    updateBuilderBlocksWithHistory(newBlocks);
  }

  const AUTOSAVE_KEY = "readme-generator-autosave";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = LocalStorageService.load<AutoSaveData | null>(
        AUTOSAVE_KEY,
        null
      );

      if (savedData) {
        setBuilderBlocks(savedData.blocks || []);
        setProjectName(savedData.projectName || "My README");
        setUsername(savedData.githubUsername || "");
        setSocials(
          savedData.socials || {
            github: "",
            instagram: "",
            twitter: "",
            linkedin: "",
          }
        );
        setWidgetConfig(
          savedData.widgetConfig || {
            theme: "light",
            showIcons: true,
            includePrivate: false,
            layout: "compact",
            includeAllCommits: true,
          }
        );
      }
    }
  }, []);

  // Setup autosave
  const getCurrentData = useCallback(() => {
    const data: AutoSaveData = {
      blocks: builderBlocks,
      projectName: projectName,
      githubUsername: username,
      socials: socials,
      widgetConfig: widgetConfig,
      timestamp: Date.now(),
    };
    return data;
  }, [builderBlocks, projectName, username, socials, widgetConfig]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cleanup = LocalStorageService.setupAutoSave<AutoSaveData>(
        AUTOSAVE_KEY,
        getCurrentData,
        1000 // Save every second when changes occur
      );

      return cleanup;
    }
  }, [
    builderBlocks,
    projectName,
    username,
    socials,
    widgetConfig,
    getCurrentData,
  ]);

  // Keyboard shortcuts
  useEffect(() => {    const handleKeyDown = (event: KeyboardEvent) => {
      // Preview: Ctrl+P (or Cmd+P on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setShowPreview(true);
      }

      // Save: Ctrl+S (or Cmd+S on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveProject();
      }

      // Undo: Ctrl+Z (or Cmd+Z on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z (or Cmd+Y or Cmd+Shift+Z on Mac)
      if (((event.ctrlKey || event.metaKey) && event.key === "y") || 
          ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "Z")) {
        event.preventDefault();
        handleRedo();
      }

      // Close preview: Escape
      if (event.key === "Escape" && showPreview) {
        setShowPreview(false);
      }
    };    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showPreview, saveProject, handleUndo, handleRedo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      {/* Mobile warning popup */}
      {showMobileWarning && (
        <MobileWarning onDismiss={() => setShowMobileWarning(false)} />
      )}

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
            Choose a template and customize it to create your perfect GitHub
            profile README
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
              availableBlocks={availableBlocks}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              socials={socials}
              setSocials={setSocials}
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
              loadTemplate={loadTemplate}
            />
            {/* No idea why there were two prope panels here fixed it  */}
            {/* <PropertiesPanel 
              selectedBlock={builderBlocks.find(block => block.id === selectedBlockId) || null}
              selectedBlockId={selectedBlockId}
              setSelectedBlockId={setSelectedBlockId}
              updateBlockContent={updateBlockContent}
              updateBlockLayout={updateBlockLayout}
              updateTemplateProperty={updateTemplateProperty}
              updateWidgetProperty={updateWidgetProperty}
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
              username={username}
            /> */}
            {/* Main Builder Area */}{" "}            <BuilderArea
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
              widgetConfig={widgetConfig}
              username={username}
              socials={socials}
              handleWidgetMarkdownGenerated={handleWidgetMarkdownGenerated}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
            {/* Right Sidebar - Properties */}
            <PropertiesPanel
              selectedBlock={builderBlocks.find(
                (block) => block.id === selectedBlockId
              )}
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
        {/* Preview Modal */}{" "}
        {showPreview && (
          <ReadmePreview
            content={previewContent || generatePreview()}
            onClose={() => setShowPreview(false)}
            liveMode={livePreviewMode}
            onLiveModeToggle={setLivePreviewMode}
            onCopy={() => {
              const contentToCopy = previewContent || generatePreview();
              navigator.clipboard
                .writeText(contentToCopy)
                .then(() => {
                  setToastMessage("Markdown copied to clipboard!");
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                })
                .catch((err) => {
                  console.error("Failed to copy: ", err);
                  setToastMessage("Failed to copy to clipboard");
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                });
            }}
          />
        )}
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {toastMessage}
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Import Project
                </h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload a previously exported README project file (.json)
                </p>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    id="file-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                      Click to upload file
                    </span>
                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      or drag and drop
                    </span>
                  </label>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Toast notifications would go here */}
      </div>
    </div>
  );
}
