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
import AIEnhancementModal from "@/components/AIEnhancementModal";

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

// Constants
const AUTOSAVE_KEY = "readme-generator-autosave";

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
    },
    {
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
      id: "widget-5",
      type: "widget",
      label: "Wave Animation",
      widgetId: "wave-animation",
    },
    {
      id: "widget-6",
      type: "widget",
      label: "Language Chart",
      widgetId: "language-chart",
    },
    {
      id: "widget-7",
      type: "widget",
      label: "Repository Showcase",
      widgetId: "repo-showcase",
    },
    {
      id: "widget-8",
      type: "widget",
      label: "Animated Progress",
      widgetId: "animated-progress",
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
  const [builderBlocks, setBuilderBlocks] = useState<Block[]>([]); // Undo/Redo state management
  const [history, setHistory] = useState<Block[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const contentUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Ref to track if history  been initialized to prevent infinite loops
  const historyInitialized = useRef(false);

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
  const [username, setUsername] = useState<string>("octocat"); // Default GitHub username for demo
  const { theme, setTheme } = useTheme();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAIEnhanceModal, setShowAIEnhanceModal] = useState(false);
  const [projects, setProjects] = useState<ReadmeProject[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [livePreviewMode, setLivePreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [markdownCache, setMarkdownCache] = useState<Record<string, string>>(
    {}
  ); // Function to parse enhanced markdown back into builder blocks
  const parseMarkdownToBlocks = useCallback((markdown: string): Block[] => {
    const blocks: Block[] = [];
    const lines = markdown.split("\n");
    let currentContent = "";
    let insideCodeBlock = false;
    let blockCounter = 1;

    const createContentBlock = (content: string): ContentBlock => {
      const trimmedContent = content.trim();
      let label = `Content Block ${blockCounter++}`;

      const firstLine = trimmedContent.split("\n")[0];
      if (firstLine.startsWith("#")) {
        label = firstLine.replace(/^#+\s*/, "").trim() || label;
      } else if (firstLine.length > 0 && firstLine.length < 50) {
        label = firstLine.trim() || label;
      }

      return {
        id: `content-${Date.now()}-${Math.random()}`,
        type: "content",
        label,
        content: trimmedContent,
      };
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle code blocks
      if (line.startsWith("```")) {
        if (!insideCodeBlock) {
          // Starting a code block
          insideCodeBlock = true;
          if (currentContent.trim()) {
            blocks.push(createContentBlock(currentContent));
            currentContent = "";
          }
          currentContent = line + "\n";
        } else {
          insideCodeBlock = false;
          currentContent += line + "\n";
          blocks.push(createContentBlock(currentContent));
          currentContent = "";
        }
        continue;
      }

      if (insideCodeBlock) {
        currentContent += line + "\n";
        continue;
      }

      if (line.startsWith("#")) {
        if (currentContent.trim()) {
          blocks.push(createContentBlock(currentContent));
          currentContent = "";
        }
        currentContent = line + "\n";
      } else if (line.trim() === "" && currentContent.endsWith("\n\n")) {
        continue;
      } else {
        currentContent += line + "\n";
      }
    }

    // Add remaining content
    if (currentContent.trim()) {
      blocks.push(createContentBlock(currentContent));
    }

    return blocks;
  }, []);

  const handleAIEnhancement = useCallback(
    (enhancedContent: string) => {
      try {
        const newBlocks = parseMarkdownToBlocks(enhancedContent);

        setBuilderBlocks(newBlocks);

        setPreviewContent("");

        setShowAIEnhanceModal(false);

        setShowPreview(true);

        setToastMessage(
          `README enhanced successfully! Generated ${newBlocks.length} content blocks from enhanced content.`
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);

        // Clear markdown cache to force regeneration
        setMarkdownCache({});
      } catch (error) {
        console.error("Error parsing enhanced content:", error);

        // Fallback: just update preview content
        setPreviewContent(enhancedContent);
        setShowAIEnhanceModal(false);
        setShowPreview(true);

        setToastMessage(
          "README enhanced successfully! Note: Content is displayed in preview mode only."
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    },
    [parseMarkdownToBlocks]
  );
  const handleWidgetMarkdownGenerated = useCallback((blockId: string, markdown: string) => {
    setMarkdownCache((prev) => ({
      ...prev,
      [blockId]: markdown,
    }));
  }, []);
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

        // Initialize history after loading saved data
        setHistory([savedData.blocks || []]);
        setHistoryIndex(0);
        historyInitialized.current = true;
      } else {
        // Initialize history with empty state if no saved data
        setHistory([[]]);
        setHistoryIndex(0);
        historyInitialized.current = true;
      }
    }
  }, []);
  const generatePreview = useCallback(() => {
    try {
      let markdown = "";

      const sanitizedProjectName = projectName?.trim() || "My Awesome Project";
      markdown += `# ${sanitizedProjectName}\n\n`; // Add user profile badge if username is provided
      if (username?.trim()) {
        markdown += `<div align="center">\n\n`;
        markdown += `[![Profile Badge](https://img.shields.io/badge/Profile-${encodeURIComponent(
          username
        )}-blue?style=for-the-badge&logo=github)](https://github.com/${username})\n\n`;
        markdown += `</div>\n\n`;
        markdown += `> Created by **[${username}](https://github.com/${username})**\n\n`;
      }
      builderBlocks.forEach((block, index) => {
        if (block.type === "widget") {
          const cachedMarkdown = markdownCache[block.id];
          if (cachedMarkdown) {
            markdown += cachedMarkdown;
          } else {
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
  ]);  // Live preview update effect
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
    // Note: generatePreview is removed to prevent infinite loops
    // The function will always have the latest values due to closure
  ]);
  // Save current state as a project
  const saveProject = useCallback(() => {
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
  }, [projectName, builderBlocks, username, theme, projects]);

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
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
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
    updateBuilderBlocksWithHistory(
      builderBlocks.filter((block) => block.id !== id)
    );
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

  const loadTemplate = useCallback(
    (templateType: string): void => {
      // Use deterministic ID generation to prevent hydration mismatches
      const baseId = `template-${templateType}`;
      let counter = 0;
      const generateId = () => `${baseId}-${++counter}`;

      let newBlocks: Block[] = [];

      switch (templateType) {
        case "classic":
          newBlocks = [
            {
              id: generateId(),
              type: "template",
              label: "Classic Template",
              templateId: "classic",
            },
            // Enhanced header
            {
              id: generateId(),
              type: "content",
              label: "Dynamic Header",
              content: `# Welcome to My GitHub Profile! 👋`,
            },
            // About section with more detail
            {
              id: generateId(),
              type: "content",
              label: "About Me",
              content: `## 👨‍💻 About Me\n\n🔥 **Passionate Developer** | 💡 **Problem Solver** | 🌟 **Innovation Enthusiast**\n\nI'm a dedicated software developer who loves creating elegant solutions to complex problems. With a focus on clean code, user experience, and continuous learning, I strive to build applications that make a real difference.\n\n### What I Do:\n- 🚀 Full-stack web development\n- 📱 Mobile application development\n- 🤖 AI/ML integration\n- 🔧 DevOps and automation\n- 🎨 UI/UX design\n\n### Current Focus:\n- 🔭 Working on innovative open-source projects\n- 🌱 Learning cutting-edge technologies\n- 👯 Looking to collaborate on meaningful solutions\n- 💬 Ask me about web development, React, Node.js, and Python`,
            },
            // GitHub statistics
            {
              id: generateId(),
              type: "widget",
              label: "GitHub Statistics",
              widgetId: "github-stats",
            },
            // Language breakdown
            {
              id: generateId(),
              type: "widget",
              label: "Programming Languages",
              widgetId: "top-languages",
            },
            // Projects showcase
            {
              id: generateId(),
              type: "content",
              label: "Featured Projects",
              content: `## 🚀 Featured Projects\n\n### 🌟 Project Highlights\n\nHere are some of my recent projects that showcase my skills and interests:\n\n| Project | Description | Tech Stack | Links |\n|---------|-------------|------------|-------|\n| **Project Alpha** | Revolutionary web application for productivity | React, Node.js, MongoDB | [Demo](https://demo.link) • [Code](https://github.com/link) |\n| **Project Beta** | AI-powered data analysis tool | Python, TensorFlow, Flask | [Demo](https://demo.link) • [Code](https://github.com/link) |\n| **Project Gamma** | Mobile app for social networking | React Native, Firebase | [App Store](https://app.link) • [Code](https://github.com/link) |\n\n### 💡 What Makes These Special:\n- ✨ Clean, maintainable code architecture\n- 🎯 User-centered design principles\n- 🔧 Comprehensive testing coverage\n- 📚 Detailed documentation\n- 🚀 Optimized performance`,
            },
            // Repository showcase widget
            {
              id: generateId(),
              type: "widget",
              label: "Repository Showcase",
              widgetId: "repo-showcase",
            },
          ];
          break;

        case "minimal":
          newBlocks = [
            {
              id: generateId(),
              type: "template",
              label: "Minimal Template",
              templateId: "minimal",
            },
            // Clean header
            {
              id: generateId(),
              type: "content",
              label: "Introduction",
              content: `# ${
                username || "Developer"
              } 👋\n\n**Building the future, one commit at a time** ✨\n\n---\n\n## What I Do\n\nCurrently working on interesting projects and always eager to learn new technologies.\n\n**Focus Areas:**\n- 💻 Software Development\n- 🌐 Web Technologies  \n- 📱 Mobile Applications\n- 🔧 Developer Tools\n\n---\n\n## Quick Stats`,
            },
            // Essential language stats
            {
              id: generateId(),
              type: "widget",
              label: "Top Languages",
              widgetId: "top-languages",
            },
            // Basic GitHub stats
            {
              id: generateId(),
              type: "widget",
              label: "GitHub Activity",
              widgetId: "github-stats",
            },
            // Contact section
            {
              id: generateId(),
              type: "content",
              label: "Get In Touch",
              content: `---\n\n## 📫 Let's Connect\n\n${
                username
                  ? `- 💼 GitHub: [@${username}](https://github.com/${username})`
                  : "- 💼 GitHub: @your-username"
              }\n- 📧 Email: your.email@example.com\n- 💭 Always open to interesting conversations and collaboration opportunities!\n\n---\n\n*"Code is poetry written in logic"* 💭`,
            },
          ];
          break;

        case "social":
          newBlocks = [
            {
              id: generateId(),
              type: "template",
              label: "Social Template",
              templateId: "social",
            },
            // Welcome message
            {
              id: generateId(),
              type: "content",
              label: "Dynamic Greeting",
              content: `# Hello World! 👋 Welcome to My Profile`,
            },
            // Wave decoration
            {
              id: generateId(),
              type: "widget",
              label: "Wave Animation",
              widgetId: "wave-animation",
            },
            // Enhanced introduction
            {
              id: generateId(),
              type: "content",
              label: "Introduction",
              content: `## 🌟 Welcome to My Digital Universe!\n\n**${
                username || "Digital Creator"
              }** | **Community Builder** | **Tech Enthusiast**\n\n> *"Connecting people through technology and building communities that matter"*\n\n### 🚀 What I'm About:\n\n- 🎯 **Mission**: Creating meaningful connections in the digital space\n- 💡 **Passion**: Building tools that bring people together\n- 🌍 **Community**: Active contributor to open-source projects\n- 📚 **Learning**: Always exploring new technologies and methodologies\n- 🤝 **Collaboration**: Open to partnerships and interesting projects\n\n### 🎭 Fun Facts:\n- ☕ Coffee enthusiast (powered by caffeine and curiosity)\n- 🎮 Gaming in my free time\n- 📸 Capturing moments through photography\n- 🎵 Music lover (coding playlist essential!)\n- 🌱 Always learning something new`,
            },
            // Social connections showcase
            {
              id: generateId(),
              type: "widget",
              label: "Social Connections",
              widgetId: "social-stats",
            },
            // Community engagement
            {
              id: generateId(),
              type: "content",
              label: "Community & Engagement",
              content: `## 🤝 Let's Connect & Collaborate!\n\n### 🌐 Find Me Around the Web:\n\n| Platform | What You'll Find | Link |\n|----------|------------------|------|\n| 💼 **LinkedIn** | Professional updates & career highlights | [Connect with me](https://linkedin.com/in/${
                username || "your-profile"
              }) |\n| 🐦 **Twitter** | Tech thoughts, quick updates & community | [Follow @${
                username || "your-handle"
              }](https://twitter.com/${
                username || "your-handle"
              }) |\n| 📷 **Instagram** | Behind the scenes & personal moments | [@${
                username || "your-handle"
              }](https://instagram.com/${
                username || "your-handle"
              }) |\n| 🎥 **YouTube** | Tech tutorials & project showcases | [Subscribe](https://youtube.com/@${
                username || "your-channel"
              }) |\n| 💬 **Discord** | Real-time chat & community discussions | ${
                username || "YourHandle"
              }#1234 |\n\n### 🤝 Let's Build Something Amazing Together!\n\nI'm always excited to:\n- 🚀 **Collaborate** on interesting projects\n- 💬 **Discuss** new technologies and ideas\n- 🤝 **Connect** with fellow developers and creators\n- 🌟 **Contribute** to meaningful open-source projects\n- 📚 **Share** knowledge and learn from others\n\n**Reach out if you want to chat about tech, collaborate on a project, or just say hi!** 👋`,
            },
            // GitHub activity summary
            {
              id: generateId(),
              type: "widget",
              label: "GitHub Activity",
              widgetId: "contribution-graph",
            },
          ];
          break;

        case "personal":
          newBlocks = [
            {
              id: generateId(),
              type: "template",
              label: "Personal Template",
              templateId: "personal",
            },
            // Header content
            {
              id: generateId(),
              type: "content",
              label: "Profile Header",
              content: `# Hi there! 👋 I'm ${username || "a Developer"}`,
            },
            // Wave decoration
            {
              id: generateId(),
              type: "widget",
              label: "Wave Animation",
              widgetId: "wave-animation",
            },
            // About section
            {
              id: generateId(),
              type: "content",
              label: "About Me",
              content: `## 👨‍💻 About Me\n\n🔭 I'm currently working on exciting projects\n🌱 I'm currently learning new technologies\n👯 I'm looking to collaborate on open source projects\n💬 Ask me about anything tech-related\n📫 How to reach me: [Contact Info]\n⚡ Fun fact: I love coding and solving problems!`,
            },
            // Comprehensive GitHub stats
            {
              id: generateId(),
              type: "widget",
              label: "GitHub Stats",
              widgetId: "github-stats",
            },
            // Language breakdown
            {
              id: generateId(),
              type: "widget",
              label: "Top Languages",
              widgetId: "top-languages",
            },
            // Language chart visualization
            {
              id: generateId(),
              type: "widget",
              label: "Language Chart",
              widgetId: "language-chart",
            },
            // Skills progress bars
            {
              id: generateId(),
              type: "widget",
              label: "Skills & Technologies",
              widgetId: "animated-progress",
            },
            // Contribution activity
            {
              id: generateId(),
              type: "widget",
              label: "Contribution Graph",
              widgetId: "contribution-graph",
            },
            // Connect section
            {
              id: generateId(),
              type: "content",
              label: "Let's Connect",
              content: `## 🤝 Let's Connect\n\nI'm always interested in connecting with fellow developers and collaborating on exciting projects!`,
            },
            // Social connections
            {
              id: generateId(),
              type: "widget",
              label: "Social Stats",
              widgetId: "social-stats",
            },
          ];
          break;

        case "showcase":
          newBlocks = [
            {
              id: generateId(),
              type: "template",
              label: "Showcase Template",
              templateId: "showcase",
            },
            // Profile header
            {
              id: generateId(),
              type: "content",
              label: "Dynamic Header",
              content: `# 🚀 Complete Developer Profile Showcase`,
            },
            // Wave decoration
            {
              id: generateId(),
              type: "widget",
              label: "Wave Animation",
              widgetId: "wave-animation",
            },
            // Introduction
            {
              id: generateId(),
              type: "content",
              label: "Introduction",
              content: `## 🎯 Complete Developer Showcase\n\n**Welcome to my comprehensive GitHub profile!** This template demonstrates all available widgets and features of the GitHub README Generator.\n\n> *"Showcasing the full power of modern GitHub profile customization"*\n\n### 🚀 What You'll Find Here:\n- 📊 **Comprehensive GitHub Statistics**\n- 🎨 **Language & Technology Breakdowns**  \n- 📈 **Activity & Contribution Patterns**\n- 🛠️ **Skills & Technologies Visualization**\n- 🌐 **Social Media Integration**\n- 🏆 **Repository Highlights**\n- ✨ **Dynamic Visual Elements**`,
            },
            // GitHub statistics
            {
              id: generateId(),
              type: "widget",
              label: "GitHub Statistics",
              widgetId: "github-stats",
            },
            // Language statistics
            {
              id: generateId(),
              type: "widget",
              label: "Top Languages",
              widgetId: "top-languages",
            },
            // Language chart visualization
            {
              id: generateId(),
              type: "widget",
              label: "Language Distribution Chart",
              widgetId: "language-chart",
            },
            // Skills and technologies
            {
              id: generateId(),
              type: "content",
              label: "Skills & Technologies",
              content: `## 🛠️ Technical Skills & Expertise\n\n### Programming Languages & Frameworks\n\nHere's a comprehensive view of my technical skills and the technologies I work with regularly:`,
            },
            // Animated progress bars for skills
            {
              id: generateId(),
              type: "widget",
              label: "Skills Progress",
              widgetId: "animated-progress",
            },
            // Contribution activity
            {
              id: generateId(),
              type: "widget",
              label: "Contribution Activity",
              widgetId: "contribution-graph",
            },
            // Repository showcase
            {
              id: generateId(),
              type: "widget",
              label: "Featured Repositories",
              widgetId: "repo-showcase",
            },
            // Social connections
            {
              id: generateId(),
              type: "content",
              label: "Connect With Me",
              content: `## 🌐 Let's Connect!\n\nI'm always excited to connect with fellow developers, collaborate on projects, and share knowledge within the tech community.`,
            },
            // Social stats widget
            {
              id: generateId(),
              type: "widget",
              label: "Social Media Presence",
              widgetId: "social-stats",
            },
            // Comprehensive footer
            {
              id: generateId(),
              type: "content",
              label: "Profile Footer",
              content: `---\n\n## 📈 Profile Analytics\n\n${
                username
                  ? `![Profile Views](https://komarev.com/ghpvc/?username=${username}&label=Profile%20views&color=0e75b6&style=flat)`
                  : "![Profile Views](https://komarev.com/ghpvc/?username=your-username&label=Profile%20views&color=0e75b6&style=flat)"
              }\n${
                username
                  ? `![GitHub followers](https://img.shields.io/github/followers/${username}?label=Followers&style=social)`
                  : "![GitHub followers](https://img.shields.io/github/followers/your-username?label=Followers&style=social)"
              }\n\n### 🎯 Quick Facts:\n- 💻 **Currently Working On**: Revolutionary open-source projects\n- 🌱 **Learning**: Latest web technologies and AI/ML concepts\n- 👯 **Open to Collaborate**: Innovative projects and meaningful contributions\n- 💬 **Ask Me About**: Web development, React, Node.js, Python, DevOps\n- 📫 **Reach Me**: Available through any of the social platforms above\n- ⚡ **Fun Fact**: I debug code better with coffee ☕\n\n---\n\n<div align="center">\n\n**💝 Thank you for visiting my profile!**\n\n*If you found this interesting, consider giving it a ⭐*\n\n**Happy Coding!** 🚀\n\n</div>`,
            },
          ];
          break;

        case "project":
          newBlocks = [
            {
              id: generateId(),
              type: "template",
              label: "Project Template",
              templateId: "project",
            },
            // Project header
            {
              id: generateId(),
              type: "content",
              label: "Project Header",
              content: `# 🚀 ${
                username ? `${username}'s Project` : "Project Name"
              }\n\n> A comprehensive and feature-rich project built with modern technologies\n\n[![GitHub stars](https://img.shields.io/github/stars/${
                username || "username"
              }/project-name?style=social)](https://github.com/${
                username || "username"
              }/project-name/stargazers)\n[![GitHub forks](https://img.shields.io/github/forks/${
                username || "username"
              }/project-name?style=social)](https://github.com/${
                username || "username"
              }/project-name/network)\n[![GitHub issues](https://img.shields.io/github/issues/${
                username || "username"
              }/project-name)](https://github.com/${
                username || "username"
              }/project-name/issues)\n[![GitHub license](https://img.shields.io/github/license/${
                username || "username"
              }/project-name)](https://github.com/${
                username || "username"
              }/project-name/blob/main/LICENSE)`,
            },
            // Description and features
            {
              id: generateId(),
              type: "content",
              label: "Description & Features",
              content: `## 📋 Description\n\nProvide a detailed description of your project here. Explain what it does, why it's useful, and what problems it solves.\n\n## ✨ Features\n\n- 🎯 **Feature 1**: Description of the first key feature\n- 🔧 **Feature 2**: Description of the second key feature  \n- 🚀 **Feature 3**: Description of the third key feature\n- 💡 **Feature 4**: Description of the fourth key feature\n- 🔒 **Feature 5**: Description of the fifth key feature`,
            },
            // Tech stack visualization
            {
              id: generateId(),
              type: "widget",
              label: "Technology Stack",
              widgetId: "animated-progress",
            },
            // Language distribution
            {
              id: generateId(),
              type: "widget",
              label: "Language Distribution",
              widgetId: "language-chart",
            },
            // Installation and usage
            {
              id: generateId(),
              type: "content",
              label: "Installation & Usage",
              content: `## 🛠️ Installation\n\n### Prerequisites\n\n- Node.js (v16.0.0 or higher)\n- npm or yarn\n- Git\n\n### Quick Start\n\n\`\`\`bash\n# Clone the repository\ngit clone https://github.com/${
                username || "username"
              }/project-name.git\n\n# Navigate to project directory\ncd project-name\n\n# Install dependencies\nnpm install\n\n# Start development server\nnpm run dev\n\`\`\`\n\n## 📖 Usage\n\nProvide clear examples of how to use your project:\n\n\`\`\`javascript\n// Example usage code\nimport { ProjectName } from './project-name';\n\nconst example = new ProjectName({\n  option1: 'value1',\n  option2: 'value2'\n});\n\nexample.run();\n\`\`\``,
            },
            // Repository showcase
            {
              id: generateId(),
              type: "widget",
              label: "Related Projects",
              widgetId: "repo-showcase",
            },
            // Contributing and support
            {
              id: generateId(),
              type: "content",
              label: "Contributing & Support",
              content: `## 🤝 Contributing\n\nContributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.\n\n1. Fork the Project\n2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)\n3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)\n4. Push to the Branch (\`git push origin feature/AmazingFeature\`)\n5. Open a Pull Request\n\n## 📝 License\n\nDistributed under the MIT License. See \`LICENSE\` for more information.\n\n## 💬 Support\n\nIf you have any questions or need help, feel free to reach out:\n\n- 📧 Email: [your-email@example.com]\n- 💬 Issues: [GitHub Issues](https://github.com/${
                username || "username"
              }/project-name/issues)\n- 🐦 Twitter: [@${
                username || "username"
              }](https://twitter.com/${username || "username"})`,
            },
            // Maintainer info
            {
              id: generateId(),
              type: "widget",
              label: "Maintainer Stats",
              widgetId: "github-stats",
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
    },
    [username, updateBuilderBlocksWithHistory, setToastMessage, setShowToast]
  );

  function updateBlockContent(id: string, content: string): void {
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
  }
  function updateBlockLayout(
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
  }, [getCurrentData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z (or Cmd+Y or Cmd+Shift+Z on Mac)
      if (
        ((event.ctrlKey || event.metaKey) && event.key === "y") ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "Z")
      ) {
        event.preventDefault();
        handleRedo();
      }

      // Close preview: Escape
      if (event.key === "Escape" && showPreview) {
        setShowPreview(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showPreview, saveProject, handleUndo, handleRedo]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Mobile warning popup */}
      {showMobileWarning && (
        <MobileWarning onDismiss={() => setShowMobileWarning(false)} />
      )}

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 lg:mb-8 group transition-all duration-300 text-sm font-medium"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight">
            Create Your README
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Design stunning GitHub profile READMEs with my intuitive
            drag-and-drop builder
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time preview • Auto-save enabled</span>
            </div>
          </div>
        </div>{" "}
        {/* README Generator Builder Interface */}
        <div className="relative">
          {/* Glass container with enhanced styling */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:shadow-3xl">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

            <div className="relative z-10">
              {/* Top Header Bar with Project Name and GitHub Username */}
              <HeaderBar
                projectName={projectName}
                setProjectName={setProjectName}
                username={username}
                setUsername={setUsername}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px] lg:min-h-[800px]">
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
            </div>
          </div>{" "}
          {/* Footer Actions */}
          <FooterBar
            setShowPreview={setShowPreview}
            setShowImportModal={setShowImportModal}
            exportToFile={exportToFile}
            saveProject={saveProject}
            onAIEnhanceClick={() => setShowAIEnhanceModal(true)}
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
        {/* AI Enhancement Modal */}
        {showAIEnhanceModal && (
          <AIEnhancementModal
            isOpen={showAIEnhanceModal}
            onClose={() => setShowAIEnhanceModal(false)}
            content={previewContent || generatePreview()}
            onApplyEnhancement={handleAIEnhancement}
            username={username}
            socials={socials}
          />
        )}
        {/* Toast notifications would go here */}
      </div>
    </div>
  );
}
