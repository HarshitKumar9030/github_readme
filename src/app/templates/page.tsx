'use client';

import React, { useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Template categories and preview data  // Template data with actual examples
  const templateData = [
    {
      id: 'classic-dev',
      category: 'developer',
      name: 'Classic Developer',
      description: 'Traditional layout with clean sections for skills, projects, and stats',
      preview: '/template-previews/classic-dev.png',
      tags: ['Stats', 'Skills', 'Projects'],
      difficulty: 'Beginner',
      useCount: 1247
    },
    {
      id: 'animated-stats',
      category: 'animated', 
      name: 'Animated Statistics',
      description: 'Dynamic charts and animated progress bars for your GitHub stats',
      preview: '/template-previews/animated-stats.png',
      tags: ['Animation', 'Charts', 'Interactive'],
      difficulty: 'Intermediate',
      useCount: 892
    },
    {
      id: 'minimal-focus',
      category: 'minimal',
      name: 'Minimal Focus',
      description: 'Clean, distraction-free design that highlights your best work',
      preview: '/template-previews/minimal-focus.png', 
      tags: ['Clean', 'Simple', 'Professional'],
      difficulty: 'Beginner',
      useCount: 1456
    },
    {
      id: 'creative-portfolio',
      category: 'portfolio',
      name: 'Creative Portfolio',
      description: 'Artistic layout perfect for designers and creative professionals',
      preview: '/template-previews/creative-portfolio.png',
      tags: ['Creative', 'Portfolio', 'Visual'],
      difficulty: 'Advanced',
      useCount: 634
    },
    {
      id: 'student-showcase',
      category: 'student', 
      name: 'Student Showcase',
      description: 'Perfect for students to highlight learning journey and projects',
      preview: '/template-previews/student-showcase.png',
      tags: ['Learning', 'Projects', 'Growth'],
      difficulty: 'Beginner',
      useCount: 789
    },
    {
      id: 'gaming-profile',
      category: 'gaming',
      name: 'Gaming Profile', 
      description: 'Fun, game-inspired design for game developers and enthusiasts',
      preview: '/template-previews/gaming-profile.png',
      tags: ['Gaming', 'Fun', 'Creative'],
      difficulty: 'Intermediate',
      useCount: 423
    }
  ];

  const templateCategories = [
    {
      id: 'developer',
      name: 'Developer Profiles',
      icon: '💻',
      description: 'Perfect for showcasing your coding skills and projects',
      count: templateData.filter(t => t.category === 'developer').length,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      darkBgGradient: 'from-blue-900/20 to-cyan-900/20'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Showcases',
      icon: '🎨',
      description: 'Creative layouts for designers and artists',
      count: templateData.filter(t => t.category === 'portfolio').length,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBgGradient: 'from-purple-900/20 to-pink-900/20'
    },
    {
      id: 'minimal',
      name: 'Clean & Minimal',
      icon: '✨',
      description: 'Simple, elegant designs that let your work speak',
      count: templateData.filter(t => t.category === 'minimal').length,
      gradient: 'from-gray-500 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100',
      darkBgGradient: 'from-gray-800/20 to-gray-900/20'
    },
    {
      id: 'animated',
      name: 'Dynamic & Animated',
      icon: '🚀',
      description: 'Eye-catching templates with cool animations',
      count: templateData.filter(t => t.category === 'animated').length,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      darkBgGradient: 'from-orange-900/20 to-red-900/20'
    },
    {    id: 'student',
    name: 'Student & Learner',
    icon: '📚',
    description: 'Great for students and bootcamp graduates',
    count: templateData.filter(t => t.category === 'student').length,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    darkBgGradient: 'from-green-900/20 to-emerald-900/20'
  },
  {
    id: 'gaming',
    name: 'Gaming & Creative',
    icon: '🎮',
    description: 'Fun templates for game developers and creators',
    count: templateData.filter(t => t.category === 'gaming').length,
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
    darkBgGradient: 'from-indigo-900/20 to-purple-900/20'
  }
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { scrollY } = useScroll();
  
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '100%']);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return templateCategories;
    return templateCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
              style={{
                left: `${(i * 20) % 100}%`,
                top: `${(i * 30) % 100}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ opacity: headerOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mr-3 text-lg"
            >
              🎨
            </motion.span>
            Template Library Coming Soon
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            README Templates
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Beautiful, ready-to-use templates that I&apos;m crafting to help you create stunning GitHub profiles. Each template is designed with love and attention to detail.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="max-w-md mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>      {/* Main Content */}
      <main className="flex-grow">
        {/* Template Categories Grid */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Template Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              I&apos;m building a diverse collection of templates for every type of developer and project. Each category is thoughtfully designed to help you stand out.
            </p>
          </motion.div>

          {/* Category Filter Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Templates
            </button>
            {templateCategories.slice(0, 4).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </motion.div>

          {/* Template Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Card */}
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.bgGradient} dark:${category.darkBgGradient} backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-8 h-full transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20`}>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <motion.div 
                    className="text-5xl mb-6"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  >
                    {category.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${category.gradient} text-white text-sm font-medium`}>
                        <span className="mr-2">🎯</span>
                        {category.count}+ templates
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        Coming Soon
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Templates Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Here&apos;s a preview of the beautiful templates I&apos;m crafting. Each one is designed to help you make a great first impression.
            </p>
          </motion.div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {templateData
              .filter(template => selectedCategory === 'all' || template.category === selectedCategory)
              .filter(template => 
                !searchTerm || 
                template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((template, index) => (
                <motion.div
                  key={template.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                    {/* Preview Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="text-center z-10">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Preview Coming Soon</div>
                      </div>
                      
                      {/* Difficulty Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          template.difficulty === 'Beginner' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : template.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {template.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {template.name}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="mr-1">👤</span>
                          {template.useCount}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                        {template.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href="/create"
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-center transform hover:scale-105"
                        >
                          Coming Soon
                        </Link>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* No results message */}
          {templateData
            .filter(template => selectedCategory === 'all' || template.category === selectedCategory)
            .filter(template => 
              !searchTerm || 
              template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            ).length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No templates found</h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your search terms or browse all categories.</p>
            </motion.div>
          )}
        </section>

        {/* Why Templates Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why I&apos;m Building Templates
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Creating a great README shouldn&apos;t take hours. These templates will help you get started quickly while still allowing full customization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Quick Start",
                  description: "Get a professional README in minutes, not hours. Perfect for hackathons and quick projects.",
                  gradient: "from-yellow-400 to-orange-500"
                },
                {
                  icon: "🎨",
                  title: "Fully Customizable",
                  description: "Every template is a starting point. Modify colors, content, and layout to match your style.",
                  gradient: "from-purple-400 to-pink-500"
                },
                {
                  icon: "💡",
                  title: "Best Practices",
                  description: "Each template follows GitHub README best practices and includes all the sections you need.",
                  gradient: "from-blue-400 to-cyan-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
                style={{
                  left: `${(i * 40) % 120}%`,
                  top: `${(i * 30) % 100}%`,
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Want to Be Notified?
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                I&apos;m working hard on these templates! Get notified when they&apos;re ready, or start creating your own README right now.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/create"
                  className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-3">🚀</span>
                  Start Creating Now
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.div>
                </Link>
                
                <button className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full text-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="mr-3">📧</span>
                  Notify Me
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
