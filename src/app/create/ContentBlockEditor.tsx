'use client';

import React, { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { motion } from 'framer-motion';
import InlineLayoutSelector from './InlineLayoutSelector';
import GitHubStatsLayout from './GitHubStatsLayout';

interface ContentBlockEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  layout?: 'flow' | 'inline' | 'grid';
  onLayoutChange?: (layout: 'flow' | 'inline' | 'grid') => void;
  username?: string;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  initialContent,
  onChange,
  layout = 'flow',
  onLayoutChange,
  username = 'yourusername'
})=> {
  const [content, setContent] = useState(initialContent);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [currentLayout, setCurrentLayout] = useState<'flow' | 'inline' | 'grid'>(layout);
  const markdownTemplates = [
    {
      id: 'intro',
      name: 'Introduction',
      description: 'Add a project introduction with badges',
      template: `# Project Name

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/project-name.svg)](https://github.com/yourusername/project-name/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/project-name.svg)](https://github.com/yourusername/project-name/issues)

A brief description of your project, what it does, and why it's useful.`
    },
    {
      id: 'features',
      name: 'Features',
      description: 'List key features of your project',
      template: `## Features

- **Feature 1**: Description of feature 1
- **Feature 2**: Description of feature 2
- **Feature 3**: Description of feature 3
- **Feature 4**: Description of feature 4`
    },
    {
      id: 'side-by-side',
      name: 'Side by Side',
      description: 'Two column layout with content',
      template: `<div align="center">

<div align="left" width="48%" style="display: inline-block; vertical-align: top;">

## Left Column

Content for the left side. You can add:

- List items
- **Bold text**
- [Links](https://github.com)
- And more...

</div>

<div align="left" width="48%" style="display: inline-block; vertical-align: top;">

## Right Column 

Content for the right side:

1. First item
2. Second item
3. Third item

> You can also add blockquotes and other markdown elements

</div>

</div>`
    },
    {
      id: 'github-stats-basic',
      name: 'GitHub Stats Cards',
      description: 'Side-by-side GitHub stats cards',
      template: `<div align="center">

| ![GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=tokyonight&hide_border=true) | ![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=yourusername&layout=compact&theme=tokyonight&hide_border=true) |
|----------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| **My GitHub Statistics** | **My Top Languages** |

</div>`
    },
    {
      id: 'github-stats-full',
      name: 'GitHub Stats Complete',
      description: 'Complete profile stats layout',
      template: `<div align="center">

![Trophy](https://github-profile-trophy.vercel.app/?username=yourusername&theme=tokyonight&no-frame=true&margin-w=4)

| ![GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=tokyonight&hide_border=true) | ![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=yourusername&layout=compact&theme=tokyonight&hide_border=true) |
|----------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| ![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=yourusername&theme=tokyonight&hide_border=true) | ![Contributions](https://activity-graph.herokuapp.com/graph?username=yourusername&theme=tokyonight&hide_border=true) |

</div>`
    },
    {
      id: 'tech-badges',
      name: 'Tech Stack Badges',
      description: 'Display tech stack with badges',
      template: `<div align="center">

## 🛠️ My Tech Stack

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

### Backend & Databases
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Tools & Platforms
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

</div>`
    },
    {
      id: 'installation',
      name: 'Installation',
      description: 'Installation instructions',
      template: `## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/project-name.git

# Navigate to the project directory
cd project-name

# Install dependencies
npm install

# Start the application
npm start
\`\`\``
    },
    {
      id: 'usage',
      name: 'Usage',
      description: 'Usage examples',
      template: `## Usage

\`\`\`javascript
// Import the module
import { feature } from 'project-name';

// Use the feature
const result = feature('example');
console.log(result);
\`\`\`

For more examples, please refer to the [Documentation](https://example.com).`
    },
    {
      id: 'contributing',
      name: 'Contributing',
      description: 'Guidelines for contributors',
      template: `## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request`
    }
  ];

  const handleChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };
    const handleLayoutChange = (newLayout: 'flow' | 'inline' | 'grid') => {
    setCurrentLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
    
    // Apply layout formatting to selected content if layout is changed
    if (newLayout === 'inline' && content) {
      // Only apply layout if content doesn't already have HTML layout formatting
      if (!content.includes('<div align=')) {
        // Split content by double newlines to get paragraphs
        const paragraphs = content.split('\n\n').filter(p => p.trim());
        if (paragraphs.length > 1) {
          // Format first two paragraphs as side-by-side
          const sideByContent = `<div align="center">

<div align="left" style="display: inline-block; width: 48%;">

${paragraphs[0]}

</div>

<div align="left" style="display: inline-block; width: 48%;">

${paragraphs[1]}

</div>

</div>

${paragraphs.slice(2).join('\n\n')}`;
          
          handleChange(sideByContent);
        }
      }
    }
  };

  const insertTemplate = (template: string) => {
    // Append the template to existing content with a line break
    const newContent = content ? `${content}\n\n${template}` : template;
    handleChange(newContent);
  };
  return (
    <motion.div 
      className="space-y-4 markdown-editor-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Template selector */}      {/* Layout selector */}      <InlineLayoutSelector 
        onChange={handleLayoutChange}
        currentLayout={currentLayout}
      />
      
      {/* GitHub Stats Layout Generator - only show when inline layout is selected */}
      {currentLayout === 'inline' && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Add GitHub Stats Layout</h3>          <GitHubStatsLayout 
            username={username} 
            onGenerateMarkdown={(markdown) => {
              const newContent = content ? `${content}\n\n${markdown}` : markdown;
              handleChange(newContent);
            }}
          />
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Templates
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {markdownTemplates.map(template => (
            <div 
              key={template.id} 
              className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
              onClick={() => {
                setActiveTemplate(template.id);
                insertTemplate(template.template);
              }}
            >
              <h4 className="font-medium text-sm">{template.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Markdown Editor */}      <MarkdownEditor
        initialValue={content}
        onChange={handleChange}
        height="500px"
        showPreview={true}
        placeholder="Enter your markdown content here..."
        className="shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg"
      />
      
      {/* Markdown Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">README Best Practices</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <h5 className="font-medium mb-1">Essential Sections:</h5>
            <ul className="list-disc pl-5 space-y-1">
              <li>Project Name and Introduction</li>
              <li>Features List</li>
              <li>Installation Instructions</li>
              <li>Usage Examples</li>
              <li>License Information</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Pro Tips:</h5>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use descriptive badges at the top</li>
              <li>Include screenshots or GIFs</li>
              <li>Keep code examples concise</li>
              <li>Link to additional documentation</li>
              <li>Add contact information</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentBlockEditor;
