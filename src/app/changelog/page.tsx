'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDownIcon, ChevronRightIcon, ClockIcon, TagIcon, BugAntIcon, SparklesIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default function ChangelogPage() {
  const [expandedVersions, setExpandedVersions] = useState<string[]>(['1.2.0']);  const toggleVersion = (version: string) => {
    setExpandedVersions(prev =>
      prev.includes(version)
        ? prev.filter(v => v !== version)
        : [...prev, version]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Bug Fixes':
        return <BugAntIcon className="w-5 h-5" />;
      case 'New Features':
        return <SparklesIcon className="w-5 h-5" />;
      case 'Performance Improvements':
        return <div className="w-5 h-5 flex items-center justify-center text-lg">⚡</div>;
      case 'Technical Improvements':
        return <WrenchScrewdriverIcon className="w-5 h-5" />;
      case 'Initial Release':
        return <div className="w-5 h-5 flex items-center justify-center text-lg">🎉</div>;
      default:
        return <TagIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Bug Fixes':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'New Features':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'Performance Improvements':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'Technical Improvements':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'Initial Release':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const versions = [
    {
      version: '1.2.0',
      date: 'May 27, 2025',
      status: 'Latest',
      description: 'Major fixes for typing animation widget and performance improvements',
      changes: [
        {
          type: 'Bug Fixes',
          icon: '🐛',
          color: 'green',
          items: [
            {
              title: 'Typing Animation Widget Rendering',
              description: 'Fixed critical rendering issues where only half the image was visible by completely rewriting the SVG animation engine',
              technical: 'Switched from mask-based approach to character-by-character animation with proper viewport calculations'
            },
            {
              title: 'Infinite Re-rendering Loop',
              description: 'Resolved performance issues caused by constant component re-renders in typing animation widget',
              technical: 'Consolidated multiple useEffect hooks into a single properly managed effect with cleanup'
            },
            {
              title: 'Configuration Controls',
              description: 'Fixed configuration controls not responding to user input changes',
              technical: 'Added proper parameter mapping between widget and API (font→fontFamily, size→fontSize, duration→speed)'
            }
          ]
        },
        {
          type: 'Performance Improvements',
          icon: '⚡',
          color: 'blue',
          items: [
            {
              title: 'Widget Optimization',
              description: 'Added proper memoization to prevent unnecessary re-calculations',
              technical: 'Implemented useMemo for effectiveConfig and useCallback for event handlers'
            },
            {
              title: 'Debounced Input',
              description: 'Implemented 300ms debouncing for configuration changes to improve responsiveness',
              technical: 'Added useRef-based timeout management with proper cleanup on unmount'
            },
            {
              title: 'Memory Management',
              description: 'Added cleanup flags to prevent state updates on unmounted components',
              technical: 'Introduced isMounted flag and comprehensive timeout cleanup'
            }
          ]
        },
        {
          type: 'Technical Improvements',
          icon: '🔧',
          color: 'purple',
          items: [
            {
              title: 'SVG Animation Engine',
              description: 'Completely rewrote the typing animation to use character-by-character reveal',
              technical: 'New animation approach with proper character escaping and width calculations'
            },
            {
              title: 'Better Error Handling',
              description: 'Added comprehensive error handling and loading states',
              technical: 'Enhanced error boundaries and user-friendly error messages'
            },
            {
              title: 'Code Architecture',
              description: 'Consolidated multiple useEffect hooks into a single, properly managed effect',
              technical: 'Improved component lifecycle management and effect dependencies'
            }
          ]
        }
      ]
    },
    {
      version: '1.1.0',
      date: 'May 15, 2025',
      status: 'Stable',
      description: 'Introduction of typing animation widget and theme system',
      changes: [
        {
          type: 'New Features',
          icon: '✨',
          color: 'emerald',
          items: [
            {
              title: 'Typing Animation Widget',
              description: 'Added customizable typing animation with multiple themes and fonts',
              technical: 'SVG-based animation system with configurable speed, colors, and text content'
            },
            {
              title: 'Animation Themes',
              description: 'Introduced multiple animation themes (dark, matrix, neon, terminal, etc.)',
              technical: 'Theme system with CSS variable-based color management'
            },
            {
              title: 'Cursor Options',
              description: 'Added cursor blinking and loop options for animations',
              technical: 'Configurable cursor animation with CSS keyframes'
            }
          ]
        }
      ]
    },
    {
      version: '1.0.0',
      date: 'May 1, 2025',
      status: 'Foundation',
      description: 'Initial release with core functionality',
      changes: [
        {
          type: 'Initial Release',
          icon: '🎉',
          color: 'indigo',
          items: [
            {
              title: 'GitHub README Generator',
              description: 'Core platform with multiple widget support and real-time preview',
              technical: 'Next.js 14 application with TypeScript and Tailwind CSS'
            },
            {
              title: 'Widget System',
              description: 'GitHub Stats, Language Chart, and Repository Showcase widgets',
              technical: 'Modular widget architecture with configurable parameters'
            },
            {
              title: 'Export Functionality',
              description: 'Real-time preview and Markdown export functionality',
              technical: 'Client-side Markdown generation with clipboard integration'
            },
            {
              title: 'Theme Support',
              description: 'Dark/Light theme support with system preference detection',
              technical: 'CSS custom properties with localStorage persistence'
            }
          ]
        }
      ]
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white/90 border border-white/30 mb-8"
            >
              <ClockIcon className="w-4 h-4 mr-2" />
              Version History & Updates
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Changelog
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Follow the journey of GitHub README Generator with detailed release notes, 
              improvements, and exciting new features
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { label: 'Total Releases', value: '3', icon: '🚀', gradient: 'from-blue-500 to-blue-600' },
            { label: 'Bug Fixes', value: '8', icon: '🐛', gradient: 'from-green-500 to-green-600' },
            { label: 'New Features', value: '12', icon: '✨', gradient: 'from-purple-500 to-purple-600' },
            { label: 'Improvements', value: '15', icon: '⚡', gradient: 'from-amber-500 to-amber-600' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              whileHover={{ y: -4, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + idx * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`text-2xl bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Version Timeline */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          {versions.map((versionData, versionIdx) => {
            const isExpanded = expandedVersions.includes(versionData.version);
            
            return (
              <motion.div
                key={versionData.version}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + versionIdx * 0.2, duration: 0.6 }}
                whileHover={{ y: -2 }}
              >
                {/* Version Header */}
                <motion.div
                  className="p-8 cursor-pointer bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => toggleVersion(versionData.version)}
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-shrink-0"
                      >
                        <ChevronRightIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </motion.div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            v{versionData.version}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            versionData.status === 'Latest' 
                              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300'
                              : versionData.status === 'Stable'
                              ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-300'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-900/30 dark:to-gray-800/30 dark:text-gray-300'
                          }`}>
                            {versionData.status}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-3xl">
                          {versionData.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-2">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{versionData.date}</span>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Released</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Expandable Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="space-y-8">
                          {versionData.changes.map((changeCategory, categoryIdx) => (
                            <motion.div
                              key={categoryIdx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + categoryIdx * 0.1, duration: 0.5 }}
                              className="space-y-6"
                            >
                              <div className={`flex items-center space-x-4 p-4 rounded-xl border ${getTypeColor(changeCategory.type)}`}>
                                <div className="flex-shrink-0">
                                  {getTypeIcon(changeCategory.type)}
                                </div>
                                <h3 className="text-xl font-bold">
                                  {changeCategory.type}
                                </h3>
                              </div>
                              
                              <div className="grid gap-4">
                                {changeCategory.items.map((item, itemIdx) => (
                                  <motion.div
                                    key={itemIdx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + categoryIdx * 0.1 + itemIdx * 0.05, duration: 0.4 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
                                  >
                                    <div className="space-y-4">
                                      <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                        {item.title}
                                      </h4>
                                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {item.description}
                                      </p>
                                      {item.technical && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                                          <p className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
                                            <span className="font-bold text-blue-700 dark:text-blue-300">Technical Details: </span>
                                            {item.technical}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Support Section */}
        <motion.div 
          className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Troubleshooting */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-2xl">🛠️</div>
                <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                  Troubleshooting
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Widget Issues?
                  </h4>
                  <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-sm leading-relaxed">
                    <li>• Refresh the page and try again</li>
                    <li>• Verify your GitHub username is public</li>
                    <li>• Clear browser cache if widgets won&apos;t load</li>
                    <li>• Check your internet connection</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Performance Tips
                  </h4>
                  <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-sm leading-relaxed">
                    <li>• Use fewer widgets for better performance</li>
                    <li>• Optimize image dimensions</li>
                    <li>• Reduce animation loops if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-2xl">💬</div>
                <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  Get Support
                </h3>
              </div>              <p className="text-blue-700 dark:text-blue-300 mb-6 leading-relaxed">
                Found a bug or have suggestions? We&apos;d love to hear from you!
              </p>
              <div className="space-y-3">
                <a 
                  href="https://github.com/yourusername/github-readme-gen/issues" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Report an Issue</span>
                  <motion.span 
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </a>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  GitHub Issues • Feature Requests • Bug Reports
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
