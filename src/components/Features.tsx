'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Tab interface
type FeatureTab = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  imageSrc: string;
  bulletPoints: string[];
};

const Features = () => {  // Feature tabs data
  const featureTabs: FeatureTab[] = [
    {
      id: 'templates',
      label: 'Template Library',
      icon: '/file.svg',
      title: 'Choose from Dozens of Professional Templates',
      description: 'Start with a beautiful template and customize it to fit your unique personality and showcase your skills.',
      imageSrc: '/template-screen.svg',
      bulletPoints: [
        'Over 50 professionally designed templates',
        'Categories for developers, data scientists, designers, and more',
        'One-click template application with preview',
        'Regular updates with new designs'
      ]
    },
    {
      id: 'customize',
      label: 'Customization',
      icon: '/globe.svg',
      title: 'Fully Customize Every Element',
      description: 'Make your README truly yours with our powerful yet intuitive customization tools.',
      imageSrc: '/customize-screen.svg',
      bulletPoints: [
        'Drag-and-drop section reordering',
        'Custom color schemes and themes',
        'Add personal badges and stats',
        'Integrated markdown editor for advanced users'
      ]
    },
    {
      id: 'preview',
      label: 'Live Preview',
      icon: '/window.svg',
      title: 'See Changes in Real-Time',
      description: 'Watch your README come to life as you edit with our instant live preview feature.',
      imageSrc: '/preview-screen.svg',
      bulletPoints: [
        'Instant visual feedback as you type',
        'Mobile and desktop preview modes',
        'Dark/light mode toggle',
        'Exact GitHub rendering preview'
      ]
    },
    {
      id: 'export',
      label: 'Easy Export',
      icon: '/file.svg',
      title: 'Export and Share Effortlessly',
      description: 'When your README is perfect, export it with a single click or connect directly to GitHub.',
      imageSrc: '/export-screen.svg',
      bulletPoints: [
        'One-click GitHub integration',
        'Copy markdown with formatting preserved',
        'Download as markdown or HTML',
        'Share preview links with collaborators'
      ]
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(featureTabs[0].id);
  
  // Get the currently active feature
  const activeFeature = featureTabs.find(tab => tab.id === activeTab) || featureTabs[0];

  // test test test

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/50 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-500/3 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-purple-500/3 to-transparent" />
      
      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Powerful Features for Perfect READMEs
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Everything you need to create stunning GitHub profiles that get you noticed
          </motion.p>
        </motion.div>

        {/* Feature tabs */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start mb-16">
          {/* Tab selection */}
          <motion.div 
            className="w-full lg:w-64 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >            {featureTabs.map((tab) => (              <motion.button
                key={tab.id}
                variants={itemVariants}
                className={`flex items-center p-4 rounded-xl min-w-40 lg:w-full text-left mb-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border-l-4 border-blue-500 shadow-sm'
                    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-800/20 dark:hover:to-gray-700/20 hover:shadow-sm'
                }`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="w-6 h-6 mr-3 relative">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className={`font-medium ${
                  activeTab === tab.id
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>          {/* Feature content */}
          <motion.div 
            className="flex-1 bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            }}
          >
            {/* Feature content header */}
            <div className="mb-8">              <motion.h3 
                className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {activeFeature.title}
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {activeFeature.description}
              </motion.p>
            </div>

            {/* Feature content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Feature image */}              <motion.div 
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden relative h-64 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={activeFeature.imageSrc}
                    alt={activeFeature.title}
                    width={400}
                    height={300}
                    className="object-contain p-4"
                  />
                </div>
              </motion.div>

              {/* Feature bullet points */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <ul className="space-y-4">
                  {activeFeature.bulletPoints.map((point, idx) => (
                    <motion.li 
                      key={idx}
                      variants={itemVariants}
                      className="flex items-start"
                    >
                      <motion.span
                        className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        ✓
                      </motion.span>
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>        {/* Call to action */}
        <motion.div 
          className="text-center bg-blue-500 text-white rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.h3 
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Ready to create your perfect README?
          </motion.h3>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Join thousands of developers who have improved their GitHub profiles
          </motion.p>          <motion.button
            className="px-8 py-4 rounded-lg bg-white text-blue-600 font-medium shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started for Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
