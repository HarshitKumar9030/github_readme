'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Enhanced feature card interface
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  comingSoon?: boolean;
  link?: string;
  benefits: string[];
}

const FeaturesPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('templates');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Enhanced feature cards data with icons and colors
  const features: FeatureCard[] = [
    {
      id: 'templates',
      title: 'Professional Templates',
      description: 'Choose from 50+ stunning, professionally designed templates that showcase your unique developer personality.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      link: '/templates',
      benefits: ['50+ Premium Templates', 'Category-Specific Designs', 'One-Click Application', 'Regular Updates']
    },
    {
      id: 'github-stats',
      title: 'Dynamic GitHub Stats',
      description: 'Showcase your coding achievements with beautiful, real-time GitHub statistics and contribution graphs.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      benefits: ['Real-time Statistics', 'Contribution Graphs', 'Language Charts', 'Repository Showcases']
    },
    {
      id: 'drag-drop',
      title: 'Drag & Drop Builder',
      description: 'Build your perfect README effortlessly with our intuitive drag-and-drop interface. No coding skills required.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      benefits: ['Visual Editor', 'Reorder Sections', 'Live Preview', 'Instant Changes']
    },
    {
      id: 'customization',
      title: 'Advanced Customization',
      description: 'Personalize every aspect of your README with custom themes, colors, and interactive elements.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      benefits: ['Custom Color Schemes', 'Widget Integration', 'Font Customization', 'Brand Colors']
    },
    {
      id: 'export',
      title: 'Seamless Export',
      description: 'Export your README in multiple formats and deploy directly to GitHub with one-click integration.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600',
      benefits: ['Multiple Formats', 'GitHub Integration', 'One-Click Deploy', 'Shareable Links']
    },
    {
      id: 'analytics',
      title: 'Smart Analytics',
      description: 'Track your profile views and engagement with built-in analytics and optimization suggestions.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      comingSoon: true,
      benefits: ['Profile Views', 'Engagement Metrics', 'Optimization Tips', 'Performance Insights']
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
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  const floatingVariants = {
    floating: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 blur-3xl"
          style={{
            left: mousePosition.x / 20,
            top: mousePosition.y / 20,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-600/20 blur-3xl right-0 bottom-0"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-4 py-16">
        {/* Hero section */}
        <motion.div 
          className="max-w-6xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            variants={floatingVariants}
            animate="floating"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              ✨ Trusted by 100+ developers
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-8 leading-tight">
            Features That Make
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              README Magic
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transform your GitHub profile with powerful tools designed for modern developers. 
            Create stunning READMEs that tell your story and showcase your skills.
          </p>
        </motion.div>
        
        {/* Interactive features showcase */}
        <div className="max-w-7xl mx-auto mb-20">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative"
                onHoverStart={() => setActiveFeature(feature.id)}
              >
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Coming soon badge */}
                  {feature.comingSoon && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      Coming Soon
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Benefits list */}
                  <ul className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-3`} />
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Action button */}
                  {feature.link && !feature.comingSoon && (
                    <Link
                      href={feature.link}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                    >
                      Explore
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                  
                  {feature.comingSoon && (
                    <div className="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold rounded-xl cursor-not-allowed">
                      Coming Soon
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
                  {/* Process section */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transform your GitHub profile in three simple steps
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {/* Step 1 */}
            <motion.div 
              className="flex flex-col lg:flex-row items-center gap-12"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full lg:w-1/2">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl p-12 backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl">🎨</div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                  Choose Your Style
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Pick the Perfect Template
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Browse our curated collection of stunning templates designed by professional developers. 
                  Each template is crafted to showcase different aspects of your coding journey.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Professional', 'Creative', 'Minimal', 'Colorful'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              className="flex flex-col lg:flex-row-reverse items-center gap-12"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full lg:w-1/2">
                <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-600/10 rounded-3xl p-12 backdrop-blur-sm border border-emerald-200/20 dark:border-emerald-800/20">
                  <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl">⚡</div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
                  Customize Everything
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Make It Uniquely Yours
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Use our intuitive drag-and-drop editor to personalize every detail. Add your GitHub stats, 
                  showcase projects, and tell your story with interactive elements.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Drag & Drop', 'Live Preview', 'GitHub Stats', 'Custom Colors'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              className="flex flex-col lg:flex-row items-center gap-12"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full lg:w-1/2">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-3xl p-12 backdrop-blur-sm border border-purple-200/20 dark:border-purple-800/20">
                  <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl">🚀</div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
                  Launch & Share
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Deploy With One Click
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Export your masterpiece and deploy it instantly to your GitHub profile. 
                  Share your unique README with the world and watch your profile come to life.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['One-Click Deploy', 'Multiple Formats', 'GitHub Integration', 'Instant Live'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Statistics section */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.div
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 shadow-2xl text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]`} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">
                Join the README Revolution
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Thousands of developers have already transformed their GitHub presence
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">100+</div>
                  <div className="text-blue-100">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">50+</div>
                  <div className="text-blue-100">Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">99%</div>
                  <div className="text-blue-100">Satisfaction</div>
                </div>
              </div>
              
              <Link
                href="/create"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Creating Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
