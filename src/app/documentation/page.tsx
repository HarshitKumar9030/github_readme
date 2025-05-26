'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Types
interface DocSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  subsections: DocSubsection[];
}

interface DocSubsection {
  id: string;
  title: string;
  content: React.ReactNode;
  codeExample?: string;
  tips?: string[];
}

const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [activeSubsection, setActiveSubsection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  // Documentation content
  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      description: 'Learn the basics and get up and running quickly',
      subsections: [
        {
          id: 'introduction',
          title: 'Introduction',
          content: (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Welcome to the GitHub README Generator documentation! This comprehensive guide will help you create stunning, 
                professional README files for your GitHub repositories in minutes.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">What makes this tool special?</h4>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="flex items-start">
                    <span className="mr-2">✨</span>
                    Professional templates designed by developers for developers
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🎨</span>
                    Real-time preview with instant visual feedback
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">⚡</span>
                    Dynamic GitHub stats and widgets integration
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🔧</span>
                    Extensive customization options
                  </li>
                </ul>
              </div>
            </div>
          ),
          tips: [
            'Start with a template that matches your project type',
            'Use the preview feature to see changes in real-time',
            'Don\'t forget to add your GitHub username for stats integration'
          ]
        },
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { step: 1, title: 'Choose Template', desc: 'Browse our collection of professional templates', icon: '📋' },
                  { step: 2, title: 'Customize Content', desc: 'Add your project details and personal information', icon: '✏️' },
                  { step: 3, title: 'Preview & Export', desc: 'Review your README and copy the generated markdown', icon: '📤' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h4 className="font-semibold text-lg mb-2">Step {item.step}: {item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">🎯 Pro Tip</h4>
                <p className="text-green-700 dark:text-green-300">
                  For the best results, have your project information ready: project name, description, 
                  installation instructions, and usage examples. This will make the creation process much faster!
                </p>
              </div>
            </div>
          ),
          codeExample: `# Example README Structure
## Project Title
Brief description of your project

## Installation
\`\`\`bash
npm install your-project
\`\`\`

## Usage
\`\`\`javascript
import { YourProject } from 'your-project';
\`\`\``
        }
      ]
    },
    {
      id: 'features',
      title: 'Features & Capabilities',
      icon: '⚡',
      description: 'Explore all the powerful features available',
      subsections: [
        {
          id: 'templates',
          title: 'Template System',
          content: (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Our template system provides a solid foundation for your README files, with professionally designed 
                layouts for different types of projects.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Developer Portfolio', desc: 'Perfect for showcasing your skills and projects', color: 'blue' },
                  { name: 'Open Source Project', desc: 'Comprehensive layout for open source projects', color: 'green' },
                  { name: 'Library/Framework', desc: 'Focused on API documentation and examples', color: 'purple' },
                  { name: 'Personal Project', desc: 'Simple and clean for personal repositories', color: 'orange' }
                ].map((template, idx) => (
                  <div key={idx} className={`bg-${template.color}-50 dark:bg-${template.color}-900/20 border border-${template.color}-200 dark:border-${template.color}-800 rounded-xl p-6`}>
                    <h4 className={`font-semibold text-${template.color}-800 dark:text-${template.color}-300 mb-2`}>
                      {template.name}
                    </h4>
                    <p className={`text-${template.color}-700 dark:text-${template.color}-300`}>
                      {template.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ),
          tips: [
            'Choose a template that matches your project type',
            'All templates are fully customizable',
            'You can switch templates without losing your content'
          ]
        },
        {
          id: 'widgets',
          title: 'Dynamic Widgets',
          content: (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Enhance your README with dynamic widgets that automatically update with your latest GitHub activity.
              </p>
              <div className="space-y-4">
                {[
                  { name: 'GitHub Stats', desc: 'Display your contribution stats, top languages, and streak', icon: '📊' },
                  { name: 'Repository Showcase', desc: 'Highlight your best repositories with live data', icon: '🏆' },
                  { name: 'Contribution Graph', desc: 'Show your contribution activity over time', icon: '📈' },
                  { name: 'Language Chart', desc: 'Visual breakdown of your programming languages', icon: '🎨' },
                  { name: 'Social Links', desc: 'Professional social media and contact links', icon: '🔗' }
                ].map((widget, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-2xl">{widget.icon}</span>
                    <div>
                      <h4 className="font-semibold">{widget.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{widget.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ),
          codeExample: `<!-- GitHub Stats Widget -->
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=dark)

<!-- Top Languages -->
![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=yourusername&layout=compact&theme=dark)`
        }
      ]
    },
    {
      id: 'customization',
      title: 'Customization Guide',
      icon: '🎨',
      description: 'Learn how to customize every aspect of your README',
      subsections: [
        {
          id: 'styling',
          title: 'Styling Options',
          content: (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Customize the look and feel of your README with our extensive styling options.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Available Customizations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Visual Elements</h5>
                    <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                      <li>• Color schemes and themes</li>
                      <li>• Badge styles and colors</li>
                      <li>• Image layouts and sizing</li>
                      <li>• Section organization</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Content Structure</h5>
                    <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                      <li>• Section reordering</li>
                      <li>• Custom section creation</li>
                      <li>• Widget placement</li>
                      <li>• Content formatting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
          tips: [
            'Use consistent colors throughout your README',
            'Choose badge styles that match your project\'s theme',
            'Keep the layout clean and organized'
          ]
        }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: '🔌',
      description: 'Technical details for developers and integrations',
      subsections: [        {
          id: 'endpoints',
          title: 'API Endpoints',
          content: (
            <div className="space-y-8">
              <div>
                <p className="text-lg leading-relaxed mb-6">
                  Our public API provides programmatic access to generate dynamic SVG widgets and retrieve GitHub statistics. 
                  All endpoints return SVG content that can be embedded directly in markdown files or web applications.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    <strong>Base URL:</strong> <code>https://github-readme-harshit.vercel.app</code> - All endpoints are publicly accessible and CORS-enabled.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { 
                    method: 'GET', 
                    endpoint: '/api/github-stats-svg', 
                    desc: 'Generate customizable GitHub statistics cards with themes, layouts, and user data',
                    params: [
                      { name: 'username', type: 'string', required: true, desc: 'GitHub username' },
                      { name: 'theme', type: 'string', required: false, desc: 'Card theme (dark, radical, tokyonight, etc.)' },
                      { name: 'layout', type: 'string', required: false, desc: 'Layout style (default, compact, minimal, detailed)' },
                      { name: 'hideBorder', type: 'boolean', required: false, desc: 'Hide card border' },
                      { name: 'showAvatar', type: 'boolean', required: false, desc: 'Display user avatar' }
                    ]
                  },
                  { 
                    method: 'GET', 
                    endpoint: '/api/language-chart', 
                    desc: 'Create language distribution charts showing programming language usage statistics',
                    params: [
                      { name: 'username', type: 'string', required: true, desc: 'GitHub username' },
                      { name: 'theme', type: 'string', required: false, desc: 'Chart color theme' },
                      { name: 'layout', type: 'string', required: false, desc: 'Chart layout (compact, normal)' },
                      { name: 'langs_count', type: 'number', required: false, desc: 'Number of languages to show (default: 5)' }
                    ]
                  },
                  { 
                    method: 'GET', 
                    endpoint: '/api/repo-showcase', 
                    desc: 'Generate repository showcase cards with stats, description, and language information',
                    params: [
                      { name: 'username', type: 'string', required: true, desc: 'Repository owner username' },
                      { name: 'repo', type: 'string', required: true, desc: 'Repository name' },
                      { name: 'theme', type: 'string', required: false, desc: 'Card theme style' },
                      { name: 'showStats', type: 'boolean', required: false, desc: 'Show star/fork counts' },
                      { name: 'showLanguage', type: 'boolean', required: false, desc: 'Display primary language' }
                    ]
                  },
                  { 
                    method: 'GET', 
                    endpoint: '/api/animated-progress', 
                    desc: 'Create animated skill progress bars with customizable themes and animations',
                    params: [
                      { name: 'skills', type: 'string[]', required: true, desc: 'Comma-separated list of skill names' },
                      { name: 'values', type: 'number[]', required: true, desc: 'Comma-separated progress values (0-100)' },
                      { name: 'theme', type: 'string', required: false, desc: 'Visual theme (default, gradient, neon, minimal)' },
                      { name: 'animated', type: 'boolean', required: false, desc: 'Enable animations' },
                      { name: 'title', type: 'string', required: false, desc: 'Widget title' }
                    ]
                  },
                  { 
                    method: 'GET', 
                    endpoint: '/api/typing-animation', 
                    desc: 'Generate typing animation effects for dynamic text display in READMEs',
                    params: [
                      { name: 'text', type: 'string', required: true, desc: 'Text to animate' },
                      { name: 'fontSize', type: 'number', required: false, desc: 'Font size in pixels' },
                      { name: 'color', type: 'string', required: false, desc: 'Text color (hex code)' },
                      { name: 'speed', type: 'number', required: false, desc: 'Typing speed in milliseconds' },
                      { name: 'cursor', type: 'boolean', required: false, desc: 'Show typing cursor' }
                    ]
                  },
                  { 
                    method: 'GET', 
                    endpoint: '/api/wave-animation', 
                    desc: 'Create wave animations for visual appeal and section dividers',
                    params: [
                      { name: 'width', type: 'number', required: false, desc: 'Animation width in pixels' },
                      { name: 'height', type: 'number', required: false, desc: 'Animation height in pixels' },
                      { name: 'color', type: 'string', required: false, desc: 'Wave color (hex code)' },
                      { name: 'waves', type: 'number', required: false, desc: 'Number of wave layers' },
                      { name: 'speed', type: 'number', required: false, desc: 'Animation speed multiplier' }
                    ]
                  }
                ].map((api, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {api.method}
                      </span>
                      <code className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200">{api.endpoint}</code>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{api.desc}</p>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200">Parameters:</h5>
                      <div className="grid gap-2">
                        {api.params.map((param, pidx) => (
                          <div key={pidx} className="flex items-start space-x-3 text-sm">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <code className="font-mono text-blue-600 dark:text-blue-400">{param.name}</code>
                              <span className="text-gray-500 dark:text-gray-400">({param.type})</span>
                              {param.required && (
                                <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                                  required
                                </span>
                              )}
                            </div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{param.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
          codeExample: `// GitHub Stats Example
<img src="https://your-domain.com/api/github-stats-svg?username=octocat&theme=dark&layout=compact" />

// Language Chart Example  
<img src="https://your-domain.com/api/language-chart?username=octocat&langs_count=8" />

// Repository Showcase Example
<img src="https://your-domain.com/api/repo-showcase?username=octocat&repo=Hello-World&theme=radical" />

// Animated Progress Example
<img src="https://your-domain.com/api/animated-progress?skills=JavaScript,Python,React&values=90,85,80&theme=gradient" />

// Typing Animation Example
<img src="https://your-domain.com/api/typing-animation?text=Welcome to my profile!&fontSize=28&color=0066cc" />

// Wave Animation Example
<img src="https://your-domain.com/api/wave-animation?height=120&color=667eea&waves=4" />

// Fetch as SVG for manipulation
fetch('/api/github-stats-svg?username=octocat&theme=dark')
  .then(response => response.text())
  .then(svg => {
    document.getElementById('stats-container').innerHTML = svg;
  });`
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      description: 'Common issues and solutions',
      subsections: [
        {
          id: 'common-issues',
          title: 'Common Issues',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    issue: 'GitHub stats not loading',
                    solution: 'Check your username spelling and ensure your GitHub profile is public',
                    type: 'warning'
                  },
                  {
                    issue: 'Images not displaying in GitHub',
                    solution: 'Ensure image URLs are accessible and use absolute URLs when possible',
                    type: 'info'
                  },
                  {
                    issue: 'Markdown formatting issues',
                    solution: 'Use the preview feature to check formatting before copying to GitHub',
                    type: 'tip'
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`border-l-4 pl-4 py-3 ${
                    item.type === 'warning' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
                    item.type === 'info' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                    'border-green-400 bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <h4 className="font-semibold mb-1">{item.issue}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{item.solution}</p>
                  </div>
                ))}
              </div>
            </div>
          ),
          tips: [
            'Always test your README in GitHub after generating',
            'Keep a backup of your content before making major changes',
            'Use the browser developer tools to debug display issues'
          ]        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: '🔧',
      description: 'Master advanced features and integrations',
      subsections: [
        {
          id: 'widgets',
          title: 'Interactive Widgets',
          content: (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Take your README to the next level with interactive widgets that showcase your coding activity and skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    name: 'GitHub Stats', 
                    desc: 'Display your GitHub statistics with beautiful charts',
                    features: ['Commit history', 'Language distribution', 'Contribution graphs', 'Custom themes']
                  },
                  { 
                    name: 'Activity Tracker', 
                    desc: 'Show your coding activity and streaks',
                    features: ['Daily contributions', 'Streak counters', 'Activity heatmaps', 'Time zone support']
                  },
                  { 
                    name: 'Skill Showcase', 
                    desc: 'Highlight your technical skills and expertise',
                    features: ['Technology badges', 'Skill levels', 'Category grouping', 'Visual progress bars']
                  },
                  { 
                    name: 'Project Gallery', 
                    desc: 'Feature your best repositories and projects',
                    features: ['Auto-sync with GitHub', 'Custom descriptions', 'Live preview links', 'Star/fork counts']
                  }
                ].map((widget, idx) => (
                  <motion.div 
                    key={idx} 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -2 }}
                  >
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{widget.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{widget.desc}</p>
                    <ul className="space-y-1">
                      {widget.features.map((feature, fidx) => (
                        <li key={fidx} className="text-sm text-gray-500 dark:text-gray-500 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          ),
          codeExample: `<!-- GitHub Activity Widget -->
<img src="https://github-readme-activity-graph.vercel.app/graph?username=yourusername&theme=react-dark" />

<!-- Coding Stats -->
<img src="https://github-readme-stats.vercel.app/api/wakatime?username=yourusername&theme=dark" />`
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: '✨',
      description: 'Guidelines for creating exceptional READMEs',
      subsections: [
        {
          id: 'design-principles',
          title: 'Design Principles',
          content: (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Follow these design principles to create READMEs that are both beautiful and functional.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    principle: 'Clarity First',
                    description: 'Make information easy to find and understand',
                    icon: '🎯',
                    tips: ['Use clear headings', 'Write concise descriptions', 'Organize content logically']
                  },
                  {
                    principle: 'Visual Hierarchy',
                    description: 'Guide readers through your content naturally',
                    icon: '📋',
                    tips: ['Use proper heading levels', 'Add whitespace between sections', 'Highlight important information']
                  },
                  {
                    principle: 'Consistent Style',
                    description: 'Maintain uniformity throughout your README',
                    icon: '🎨',
                    tips: ['Choose a cohesive color scheme', 'Use consistent badge styles', 'Maintain formatting patterns']
                  },
                  {
                    principle: 'Mobile Friendly',
                    description: 'Ensure readability on all device sizes',
                    icon: '📱',
                    tips: ['Test on mobile devices', 'Use responsive images', 'Keep line lengths reasonable']
                  },
                  {
                    principle: 'Performance',
                    description: 'Optimize for fast loading and smooth experience',
                    icon: '⚡',
                    tips: ['Optimize image sizes', 'Use efficient widgets', 'Minimize external requests']
                  },
                  {
                    principle: 'Accessibility',
                    description: 'Make your README accessible to everyone',
                    icon: '♿',
                    tips: ['Add alt text to images', 'Use descriptive link text', 'Ensure good color contrast']
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -4, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{item.principle}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                    <ul className="space-y-1">
                      {item.tips.map((tip, tidx) => (
                        <li key={tidx} className="text-sm text-gray-500 dark:text-gray-500 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.subsections.some(sub =>
      sub.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const currentSection = docSections.find(section => section.id === activeSection);
  const currentSubsection = currentSection?.subsections.find(sub => sub.id === activeSubsection);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection, activeSubsection]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 m-2 md:m-4 rounded-xl to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mr-2"
                >
                  📚
                </motion.span>
                Complete Documentation
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Documentation Hub
              </h1>
              
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Everything you need to know about creating stunning GitHub README files
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'transform scale-105' : ''
                }`}>
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:bg-white/30"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-white/70">🔍</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="sticky top-24 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 px-3">
                  Navigation
                </h3>
                {(searchQuery ? filteredSections : docSections).map((section) => (
                  <div key={section.id} className="space-y-1">
                    <motion.button
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => {
                        setActiveSection(section.id);
                        setActiveSubsection(section.subsections[0]?.id);
                        toggleSectionExpansion(section.id);
                      }}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{section.icon}</span>
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs opacity-70">{section.description}</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSections.includes(section.id) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-6 space-y-1"
                        >
                          {section.subsections.map((subsection) => (
                            <motion.button
                              key={subsection.id}
                              className={`w-full text-left p-2 rounded-lg text-sm transition-all duration-200 ${
                                activeSubsection === subsection.id
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                              }`}
                              onClick={() => setActiveSubsection(subsection.id)}
                              whileHover={{ x: 2 }}
                            >
                              {subsection.title}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-0"
            >
              {currentSubsection && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span>{currentSection?.title}</span>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-gray-700 dark:text-gray-300">{currentSubsection.title}</span>
                  </div>

                  {/* Content Header */}
                  <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      {currentSubsection.title}
                    </h1>
                  </div>

                  <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                    {currentSubsection.content}
                  </div>

                  {currentSubsection.codeExample && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Code Example</h3>
                      <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 overflow-x-auto">
                        <pre className="text-sm text-gray-100">
                          <code>{currentSubsection.codeExample}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {currentSubsection.tips && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Pro Tips
                      </h3>
                      <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
                        {currentSubsection.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex space-x-4">
                      <motion.button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        Back to Top
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DocumentationPage;
