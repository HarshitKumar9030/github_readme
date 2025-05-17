'use client';

import React, { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { motion } from 'framer-motion';

interface ContentBlockEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  initialContent,
  onChange
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

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

  const insertTemplate = (template: string) => {
    // Append the template to existing content with a line break
    const newContent = content ? `${content}\n\n${template}` : template;
    handleChange(newContent);
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Template selector */}
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

      {/* Enhanced Markdown Editor */}
      <MarkdownEditor
        initialValue={content}
        onChange={handleChange}
        height="400px"
        showPreview={true}
        placeholder="Enter your markdown content here..."
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
