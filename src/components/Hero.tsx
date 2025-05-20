'use client';

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link';
import { getRepositoryStats, getWeeklyStarCount } from '@/services/socialStats';
import icon from 'react-syntax-highlighter/dist/esm/languages/prism/icon';

const Hero = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    container: scrollRef
  });
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  
  // GitHub repository stats
  const [repoStats, setRepoStats] = useState({
    stars: 0,
    forks: 0,
    watchers: 0,
    weeklyStars: 0,
    loading: true
  });

  // Fetch GitHub repository stats
  useEffect(() => {
    const fetchRepoStats = async () => {
      try {
        const owner = 'harshitkumar9030';
        const repo = 'github_readme';
        
        const stats = await getRepositoryStats(owner, repo);
        const weeklyStars = await getWeeklyStarCount(owner, repo);
        
        setRepoStats({
          stars: stats.stars,
          forks: stats.forks,
          watchers: stats.watchers,
          weeklyStars,
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch repository stats:", error);
        setRepoStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchRepoStats();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Typing animation for the heading
  const headingText = "GitHub README Generator";
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= headingText.length) {
        setDisplayedText(headingText.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);
  
  // Handle scroll visibility of elements
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <motion.section 
      className="w-full py-20 md:py-32 relative overflow-hidden"
      style={{ opacity, scale }}
      ref={scrollRef}
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-purple-500/5"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(147, 51, 234, 0.05) 100%)',
            'radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(147, 51, 234, 0.05) 100%)',
            'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(147, 51, 234, 0.05) 100%)',
            'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(147, 51, 234, 0.05) 100%)',
            'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(147, 51, 234, 0.05) 100%)',
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-[rgba(var(--background-rgb),0.1)] pointer-events-none" />
      
      {/* Animated background dots with increased number and variety */}
      <div className="absolute inset-0 w-full h-full">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i % 5 === 0 ? 'w-2 h-2' : i % 3 === 0 ? 'w-1.5 h-1.5' : 'w-1 h-1'} rounded-full ${
              i % 4 === 0 ? 'bg-blue-500/20' : i % 3 === 0 ? 'bg-purple-500/15' : i % 2 === 0 ? 'bg-green-500/15' : 'bg-gray-500/10'
            }`}
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.2 + 0.1
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0.1, 0.3, 0.1],
              scale: [1, i % 5 === 0 ? 1.2 : 1, 1]
            }}
            transition={{
              duration: 8 + Math.random() * 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Animated code patterns in background */}
      <div className="absolute top-1/4 -left-20 opacity-10 dark:opacity-5">
        <motion.div
          className="text-xs md:text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 0.7 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="my-1"
            >
              {'<'}{i % 3 === 0 ? 'div' : i % 2 === 0 ? 'span' : 'p'} 
              className={`${i % 4 === 0 ? 'text-' : 'bg-'}${i % 3 === 0 ? 'blue' : 'purple'}`}{'>'}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' : ''}`}>
        <motion.div 
          className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <Image src="/file.svg" alt="Logo" width={28} height={28} />
            <span className="font-bold text-xl">README Gen</span>
          </motion.div>
          
          <div className="flex items-center space-x-6">            <motion.nav className="hidden md:flex space-x-6">
              {[
                { name: 'Home', path: '/' },
                { name: 'Templates', path: '/templates' },
                { name: 'Create', path: '/create' },
                { name: 'About', path: '/about' },
                { name: 'New Features', path: '/features' }
              ].map((item) => (
                <motion.div key={item.name} whileHover={{ y: -2 }}>
                  <Link href={item.path} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            <ThemeToggle variant="buttons" className="rounded-lg shadow-sm" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mt-16">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Header with theme toggle and badge */}
          <div className="flex justify-between items-center w-full max-w-xl mx-auto mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-1.5"
                >
                  ✨
                </motion.span>
                New: Markdown Export & GitHub Integration
              </span>
            </motion.div>
          </div>

          {/* Main heading with typing animation - minimal style */}
          <motion.div 
            className="relative mb-6"
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight inline-block pb-2 border-b-2 border-blue-500 dark:border-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              {displayedText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0 }}
                className="typing-cursor"
              >|</motion.span>
            </motion.h1>
          </motion.div>
            {/* Animated tagline */}
          <motion.p 
            className="text-xl md:text-2xl mb-6 max-w-3xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Create <span className="font-bold text-blue-600 dark:text-blue-400">stunning GitHub profile READMEs</span> with our intuitive drag-and-drop builder, pre-built templates, and integrated GitHub widgets. Now with <span className="font-bold text-emerald-600 dark:text-emerald-400">enhanced GFM support</span> and <span className="font-bold text-purple-600 dark:text-purple-400">direct GitHub integration</span>.
          </motion.p>
          
          {/* GitHub stars badge - Now dynamic */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-4">
              <a href="https://github.com/harshitkumar9030/github_readme" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>Star on GitHub</span>
                <motion.span 
                  className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md"
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: repoStats.loading ? [1, 1.1, 1] : 1,
                    transition: {
                      repeat: repoStats.loading ? Infinity : 0,
                      duration: 1
                    }
                  }}
                >
                  {repoStats.loading ? '...' : repoStats.stars}
                </motion.span>
              </a>
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 border border-white dark:border-gray-800"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">+{repoStats.loading ? '...' : repoStats.weeklyStars} this week</span>
              </div>
            </div>
          </motion.div>
          
          {/* Stats section */}          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {[
              { value: '100+', label: 'Templates' },
              { value: '5k+', label: 'Developers' },
              { value: '12k+', label: 'READMEs Created' },
              { value: '4.9', label: 'Average Rating' },
              { value: '25+', label: 'GitHub Integrations' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center px-4"
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
            
          {/* CTA Buttons with enhanced hover effects */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.button
              className="px-8 py-3.5 rounded-lg bg-blue-600 text-white font-medium flex items-center justify-center gap-2 shadow-md"
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "#2563eb"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/create')}
            >
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >→</motion.span>
              Start Building Now
            </motion.button>
            <motion.button
              className="px-8 py-3.5 rounded-lg border border-gray-300 dark:border-gray-700 font-medium bg-transparent flex items-center justify-center"
              whileHover={{ 
                scale: 1.02, 
                borderColor: "#3b82f6"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/about')}
            >
              Browse Templates
            </motion.button>
          </motion.div>
          
          {/* Demo preview image */}
          <motion.div
            className="relative w-full max-w-4xl mx-auto mb-10 rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-gray-800 h-8 w-full flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="text-xs text-gray-400 ml-2">README Preview</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
              <Image 
                src="/preview-screen.svg" 
                alt="README Preview" 
                width={1000} 
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </motion.div>
          
          {/* Feature showcase with improved cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {[
              { 
                icon: '/file.svg', 
                title: 'Drag & Drop Builder', 
                description: 'Easily build your README with our intuitive drag-drop interface',
                color: 'from-blue-500/10 to-blue-600/5'
              },
              { 
                icon: '/globe.svg', 
                title: 'GitHub Widgets', 
                description: 'Integrate dynamic stats cards, graphs and language charts',
                color: 'from-purple-500/10 to-purple-600/5'
              },
              { 
                icon: '/window.svg', 
                title: 'Live Preview', 
                description: 'See changes in real-time exactly as they will appear',
                color: 'from-indigo-500/10 to-indigo-600/5'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-gray-800 shadow-md`}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.4 }}
              >
                <motion.div
                  className="w-16 h-16 mb-6 relative"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  style={{
                    x: mousePosition.x / 100 - index * 5,
                    y: mousePosition.y / 100 - 5
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-70" />
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain z-10"
                  />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">{feature.description}</p>
                <motion.div 
                  className="mt-5 w-full h-1 bg-gray-200/30 dark:bg-gray-800/30 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "80%" }}
                    transition={{ duration: 1, delay: 1 + index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Testimonial section */}
      <motion.div
        className="max-w-5xl mx-auto mt-20 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">What Developers Are Saying</h3>
          <p className="text-gray-600 dark:text-gray-400">Join thousands of developers who have improved their GitHub profiles</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Chen",
              role: "Senior Frontend Developer",
              text: "This tool saved me hours of work. My GitHub profile now stands out and I've received compliments from recruiters!",
              avatar: "https://i.pravatar.cc/100?img=1"
            },
            {
              name: "James Wilson",
              role: "Full Stack Engineer",
              text: "The drag and drop builder makes creating professional READMEs so easy. The templates are beautiful and the widgets are extremely useful.",
              avatar: "https://i.pravatar.cc/100?img=2"
            },
            {
              name: "Priya Sharma",
              role: "Open Source Contributor",
              text: "I use this tool for all my repositories now. The GitHub stats integration is brilliant and gives my projects a professional look.",
              avatar: "https://i.pravatar.cc/100?img=3"
            }
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-gray-800/40 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * idx, duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} />
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">&ldquo;{testimonial.text}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Enhanced floating shape animations */}
      <div className="hidden md:block">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 2 === 0 ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/5' : 'bg-gradient-to-r from-purple-500/10 to-pink-500/5'
            }`}
            style={{
              width: 150 + i * 100,
              height: 150 + i * 100,
              top: `${15 + i * 15}%`,
              right: i % 2 === 0 ? `${-10 - i * 5}%` : undefined,
              left: i % 2 !== 0 ? `${-10 - i * 5}%` : undefined,
              filter: "blur(60px)"
            }}
            animate={{
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              y: [0, i % 2 === 0 ? -20 : 20, 0],
              rotate: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Connection to next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full text-white dark:text-black" 
          viewBox="0 0 1440 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0 50H1440V100H0V50Z" 
            fill="currentColor" 
          />
          <path 
            d="M0 0L1440 0C1440 0 1140 100 720 100C300 100 0 0 0 0Z" 
            fill="currentColor" 
          />
        </svg>
      </div>
      
      {/* Enhanced animated scroll indicator with dynamic visibility based on scroll */}
      <motion.div 
        className={`absolute bottom-14 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isScrolled ? 0 : 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.p className="text-sm text-gray-500 mb-2">Scroll to explore</motion.p>
        <motion.div 
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default Hero