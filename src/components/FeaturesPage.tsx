'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Feature card interface
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
  link?: string;
}

const FeaturesPage: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  
  // Track which section is visible as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const id = section.getAttribute('data-section');
        
        if (rect.top <= 300 && rect.bottom >= 300) {
          setVisibleSection(id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Run once on mount to set initial visible section
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Feature cards data
  const features: FeatureCard[] = [
    {
      id: 'templates',
      title: 'Ready-to-Use Templates',
      description: 'Choose from a variety of professionally designed README templates to showcase your profile or project.',
      icon: '/template-screen.svg',
      link: '/templates'
    },
    {
      id: 'github-stats',
      title: 'GitHub Stats Integration',
      description: 'Automatically display your GitHub statistics with beautiful, customizable cards.',
      icon: '/github-stats-example.svg',
    },
    {
      id: 'markdown',
      title: 'Advanced Markdown Editor',
      description: 'Create and edit your README content with our powerful yet easy-to-use markdown editor.',
      icon: '/customize-screen.svg',
    },
    {
      id: 'drag-drop',
      title: 'Drag & Drop Builder',
      description: 'Build your perfect README by easily arranging and customizing content blocks.',
      icon: '/window.svg',
    },
    {
      id: 'themes',
      title: 'Custom Themes',
      description: 'Choose from a variety of color themes to match your personal style or project branding.',
      icon: '/customize-screen.svg',
      comingSoon: true,
    },
    {
      id: 'export',
      title: 'Multiple Export Options',
      description: 'Export your README as markdown, HTML, or directly to your GitHub repository.',
      icon: '/export-screen.svg',
      comingSoon: true,
    },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
    hover: {
      y: -10,
      transition: { type: 'spring', stiffness: 300 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black px-4 py-16">
      {/* Header section */}
      <motion.div 
        className="max-w-4xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:text-5xl">
          Powerful Features for Your GitHub Profile
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Create stunning GitHub profile READMEs with our easy-to-use tools. Stand out from the crowd and showcase your work like never before.
        </p>
      </motion.div>
      
      {/* Features grid */}
      <div className="max-w-6xl mx-auto" data-section="features">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden relative"
            >
              {feature.comingSoon && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  Coming Soon
                </div>
              )}
              
              <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={400}
                  height={225}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
                
                {feature.link && !feature.comingSoon && (
                  <div className="mt-6">
                    <Link
                      href={feature.link}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      Explore
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* How it works section */}
      <div className="max-w-4xl mx-auto mt-24" data-section="how-it-works">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create your perfect GitHub README in three simple steps
          </p>
        </motion.div>
        
        <div className="space-y-12">
          {/* Step 1 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full md:w-1/2 bg-blue-100 dark:bg-blue-900/30 rounded-xl overflow-hidden flex items-center justify-center p-8">
              <Image
                src="/template-screen.svg"
                alt="Choose a template"
                width={400}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold px-4 py-1 mb-4">
                Step 1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Choose a Template
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our collection of professionally designed templates or start from scratch. Each template is fully customizable to match your needs.
              </p>
            </div>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div 
            className="flex flex-col md:flex-row-reverse items-center gap-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full md:w-1/2 bg-purple-100 dark:bg-purple-900/30 rounded-xl overflow-hidden flex items-center justify-center p-8">
              <Image
                src="/customize-screen.svg"
                alt="Customize your README"
                width={400}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-semibold px-4 py-1 mb-4">
                Step 2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Customize Your Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Edit text, add GitHub stats, showcase your top projects, and personalize the design with our intuitive editor. No coding required!
              </p>
            </div>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full md:w-1/2 bg-green-100 dark:bg-green-900/30 rounded-xl overflow-hidden flex items-center justify-center p-8">
              <Image
                src="/export-screen.svg"
                alt="Export and deploy"
                width={400}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold px-4 py-1 mb-4">
                Step 3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Export and Deploy
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Preview your README and export it as markdown. Copy the code to your GitHub profile repository and see it live instantly!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="max-w-4xl mx-auto mt-24 text-center">
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Create Your Amazing GitHub Profile?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have improved their GitHub presence with our tools.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Start Building Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPage;
