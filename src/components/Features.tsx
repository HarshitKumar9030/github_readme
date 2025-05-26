'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type FeatureTab = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  imageSrc: string;
  bulletPoints: string[];
};

const Features = () => {
  const router = useRouter();

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
    <motion.section 
      className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced section header */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mr-2"
            >
              🚀
            </motion.span>
            Made for HackClub&apos;s Shipwrecked Event
          </motion.div>            <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Create Amazing READMEs for Your Projects
          </motion.h2>            <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Build your development portfolio with professional templates and powerful tools to make your projects stand out and showcase your skills effectively.
          </motion.p>
        </motion.div>

        {/* Enhanced Feature tabs */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start mb-16">
          {/* Tab selection with enhanced styling */}
          <motion.div 
            className="w-full lg:w-80 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featureTabs.map((tab) => (
              <motion.button
                key={tab.id}
                variants={itemVariants}
                className={`flex items-center p-6 rounded-2xl min-w-60 lg:w-full text-left transition-all duration-500 group ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl border border-blue-500'
                    : 'bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 dark:hover:from-blue-900/20 dark:hover:to-blue-800/10 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600'
                }`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
              >
                <motion.div 
                  className="w-8 h-8 mr-4 relative"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    fill
                    className={`object-contain transition-all duration-300 ${
                      activeTab === tab.id ? 'brightness-0 invert' : 'group-hover:brightness-75'
                    }`}
                  />
                </motion.div>
                <div>
                  <span className={`font-semibold text-lg block transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}>
                    {tab.label}
                  </span>
                  <span className={`text-sm block mt-1 transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300'
                  }`}>
                    Click to explore
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Feature content */}
          <motion.div 
            className="flex-1 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" 
            }}
          >
            <div className="mb-10">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {activeFeature.title}
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {activeFeature.description}
              </motion.p>
            </div>

            {/* Feature content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Enhanced Feature image */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl overflow-hidden relative h-80 border border-gray-200/50 dark:border-gray-600/30 shadow-inner"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <Image
                    src={activeFeature.imageSrc}
                    alt={activeFeature.title}
                    width={500}
                    height={400}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {activeFeature.bulletPoints.map((point, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-4 shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                    >
                      <span className="text-sm font-bold">✓</span>
                    </motion.div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="text-center bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-3xl p-10 md:p-16 shadow-2xl border border-blue-500/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-3xl blur-2xl"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.h3 
            className="text-3xl md:text-4xl font-bold mb-6 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Ready to create your perfect README?
          </motion.h3>
          
          <motion.p 
            className="text-xl mb-10 max-w-2xl mx-auto opacity-90 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Join thousands of developers who have improved their GitHub profiles with our powerful tools
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.button
              className="px-10 py-4 rounded-2xl bg-white text-blue-600 font-semibold shadow-xl hover:shadow-2xl transition-all text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/create')}
            >
              Get Started for Free
            </motion.button>
            <motion.button
              className="px-10 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 backdrop-blur-sm transition-all text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/templates')}
            >
              Browse Templates
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;
