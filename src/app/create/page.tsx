"use client";

import React, { useState, useEffect, useCallback } from "react";
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
    },
    {
      id: "widget-3",
      type: "widget",
      label: "Social Stats",
      widgetId: "social-stats",
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

  const generatePreview = () => {
    let markdown = "";

    markdown += `# ${projectName}\n\n`;

    if (username) {
      markdown += `> Created by [${username}](https://github.com/${username})\n\n`;
    }

    // Generate markdown for each block
    builderBlocks.forEach((block) => {
      if (block.type === "widget") {
        // Use cached markdown for widgets if available
        const cachedMarkdown = markdownCache[block.id];
        if (cachedMarkdown) {
          markdown += cachedMarkdown;
        } else {
          // Fallback for widgets without cached markdown
          if (block.widgetId === "github-stats") {
            const statsUrl = `/api/github-stats-svg?username=${username}&theme=${
              widgetConfig.theme || "light"
            }&hideBorder=${widgetConfig.hideBorder || false}&hideTitle=${
              widgetConfig.hideTitle || false
            }&layout=${widgetConfig.layoutCompact ? "compact" : "default"}`;
            markdown += `\n## GitHub Stats\n\n`;
            markdown += `<img src="${statsUrl}" alt="GitHub Stats" />\n\n`;
          } else if (block.widgetId === "top-languages") {
            markdown += `\n## Top Languages\n\n`;
            markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${
              widgetConfig.theme || "light"
            })\n\n`;
          } else if (block.widgetId === "social-stats") {
            markdown += `\n## Connect With Me\n\n`;
            if (socials.github)
              markdown += `- [GitHub](https://github.com/${socials.github})\n`;
            if (socials.twitter)
              markdown += `- [Twitter](https://twitter.com/${socials.twitter})\n`;
            if (socials.linkedin)
              markdown += `- [LinkedIn](https://linkedin.com/in/${socials.linkedin})\n`;
            if (socials.instagram)
              markdown += `- [Instagram](https://instagram.com/${socials.instagram})\n\n`;
          }
        }
      } else if (block.type === "content") {
        // Content blocks just add their content directly
        markdown += `\n${(block as ContentBlock).content}\n\n`;
      } else if (block.type === "template") {
        // Handle templates
        const templateId = (block as TemplateBlock).templateId;
        if (templateId === "classic") {
          markdown += `\n## About Me\n\nA passionate developer focused on creating elegant solutions.\n\n`;
          markdown += `## Projects\n\n- Project 1: Description\n- Project 2: Description\n\n`;
          markdown += `## Skills\n\n- Skill 1\n- Skill 2\n- Skill 3\n\n`;
        } else if (templateId === "minimal") {
          markdown += `\n## ${username || "Developer"}\n\n`;
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
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (draggedBlock) {
      setBuilderBlocks([
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
    setBuilderBlocks(builderBlocks.filter((block) => block.id !== id));
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
      setBuilderBlocks(newBlocks);
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
      setBuilderBlocks(newBlocks);
    }
  };

  function loadTemplate(templateType: string): void {
    setBuilderBlocks([]);

    switch (templateType) {
      case "classic":
        setBuilderBlocks([
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
        ]);
        break;

      case "minimal":
        setBuilderBlocks([
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
        ]);
        break;

      case "social":
        setBuilderBlocks([
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
        ]);
        break;

      default:
        setToastMessage(`Unknown template type: ${templateType}`);
        setShowToast(true);
        return;
    }

    setToastMessage(
      `${
        templateType.charAt(0).toUpperCase() + templateType.slice(1)
      } template loaded successfully!`
    );
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  function updateBlockContent(id: string, content: string): void {
    setBuilderBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id && block.type === "content"
          ? { ...block, content }
          : block
      )
    );
  }

  function updateWidgetProperty<K extends keyof WidgetBlock>(
    id: string,
    property: K,
    value: WidgetBlock[K]
  ): void {
    setBuilderBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id && block.type === "widget"
          ? { ...block, [property]: value }
          : block
      )
    );
  }

  // Add this function to fix the error
  function updateTemplateProperty<K extends keyof TemplateBlock>(
    id: string,
    property: K,
    value: TemplateBlock[K]
  ): void {
    setBuilderBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id && block.type === "template"
          ? { ...block, [property]: value }
          : block
      )
    );
  }
  function updateBlockLayout(
    id: string,
    layout: "grid" | "flow" | "inline"
  ): void {
    setBuilderBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, layout } : block
      )
    );
  }

  function updateBlockContainerLayout(
    id: string,
    blockLayout: "default" | "side-by-side" | "grid"
  ): void {
    setBuilderBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, blockLayout } : block
      )
    );
  }

  // Add autosave functionality
  const AUTOSAVE_KEY = "readme-generator-autosave";

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
            {/* Main Builder Area */}{" "}
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

        {/* Preview Modal */}
        {showPreview && (
          <ReadmePreview
            content={generatePreview()}
            onClose={() => setShowPreview(false)}
            onCopy={() => {
              navigator.clipboard
                .writeText(generatePreview())
                .then(() => {
                  alert("Markdown copied to clipboard!");
                })
                .catch((err) => {
                  console.error("Failed to copy: ", err);
                });
            }}
          />
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
