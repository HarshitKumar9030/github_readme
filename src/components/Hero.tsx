'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'
import { getRepositoryStats, getWeeklyStarCount } from '@/services/socialStats'
import { AvatarWithFallback } from '../utils/avatarGenerator'

const Hero = () => {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const scale = useTransform(scrollY, [0, 300], [1, 0.98])
  
  // GitHub repository stats
  const [repoStats, setRepoStats] = useState({
    stars: 0,
    forks: 0,
    watchers: 0,
    weeklyStars: 0,
    loading: true
  })

  // Fetch GitHub repository stats
  useEffect(() => {
    const fetchRepoStats = async () => {
      try {
        const owner = 'harshitkumar9030'
        const repo = 'github_readme'
        
        const stats = await getRepositoryStats(owner, repo)
        const weeklyStars = await getWeeklyStarCount(owner, repo)
        
        setRepoStats({
          stars: stats.stars,
          forks: stats.forks,
          watchers: stats.watchers,
          weeklyStars,
          loading: false
        })
      } catch (error) {
        console.error("Failed to fetch repository stats:", error)
        setRepoStats(prev => ({ ...prev, loading: false }))
      }
    }

    fetchRepoStats()
  }, [])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])    // Enhanced typing animation for the heading
  const headingTexts = useMemo(() => [
    "GitHub README Generator",
    "Create Beautiful Profiles", 
    "Stand Out on GitHub"
  ], [])
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    const currentText = headingTexts[currentTextIndex]
    
    const typeText = () => {
      if (!isDeleting) {
        if (displayedText.length < currentText.length) {
          setDisplayedText(currentText.slice(0, displayedText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000) // Pause before deleting
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentText.slice(0, displayedText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % headingTexts.length)
        }
      }
    }

    const timeout = setTimeout(typeText, isDeleting ? 50 : 100)
    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentTextIndex, headingTexts])
  
  // Handle scroll visibility of elements
  const [isScrolled, setIsScrolled] = useState(false)
    useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
    return (
    <motion.section 
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
      style={{ opacity, scale }}
      ref={scrollRef}
    >
      {/* Subtle animated gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Simplified floating particles */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0 ? 'bg-blue-400/20' : i % 2 === 0 ? 'bg-purple-400/15' : 'bg-indigo-400/10'
            }`}
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              opacity: 0.3
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>      {/* Animated code patterns in background */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-20 pb-20">
        <div className="flex flex-col items-center justify-center text-center">          {/* Header with theme toggle and badge */}
          <div className="flex justify-center items-center w-full mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  🚢
                </motion.span>
                Made for HackClub&apos;s Shipwrecked Event
              </span>
            </motion.div>
          </div>          {/* Enhanced main heading with improved typing animation */}
          <motion.div 
            className="relative mb-8"
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.h1 
              className="relative text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                {displayedText}
              </span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-blue-600 dark:text-blue-400 ml-1"
              >|</motion.span>
            </motion.h1>
            
            {/* Animated underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mt-4"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(displayedText.length * 8, 400)}px` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>            {/* Enhanced tagline with better visual hierarchy */}
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-gray-700 dark:text-gray-300">Create </span>
            <motion.span 
              className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              stunning GitHub profile READMEs
            </motion.span>
            <span className="text-gray-700 dark:text-gray-300"> with our intuitive drag-and-drop builder, pre-built templates, and integrated GitHub widgets. Now with </span>
            <motion.span 
              className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              enhanced GFM support
            </motion.span>
            <span className="text-gray-700 dark:text-gray-300"> and </span>
            <motion.span 
              className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              direct GitHub integration
            </motion.span>
            <span className="text-gray-700 dark:text-gray-300">.</span>
          </motion.p>
            {/* GitHub stars badge - Now dynamic */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://github.com/harshitkumar9030/github_readme" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md">
                <svg className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>Star on GitHub</span>
                <motion.span 
                  className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs font-medium"
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
              
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {['Alex M', 'Emma K', 'Ryan T'].map((name, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden">
                      <AvatarWithFallback
                        src={`https://i.pravatar.cc/28?img=${i + 4}`}
                        alt={name}
                        name={name}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                        style="circle"
                      />
                    </div>
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
          </motion.div>              {/* Enhanced CTA Buttons with improved hover effects and micro-interactions */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.button
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white font-semibold flex items-center justify-center gap-3 shadow-xl overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/create')}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              {/* Content */}
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                🚀
              </motion.span>
              <span className="relative z-10 text-lg">Start Building Now</span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.button>
            
            <motion.button
              className="group relative px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 font-semibold bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center gap-3 overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                borderColor: "#3b82f6",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/templates')}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0, borderRadius: "100%" }}
                whileHover={{ scale: 1, borderRadius: "0%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Content */}
              <motion.span
                className="relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                🎨
              </motion.span>
              <span className="relative z-10 text-lg text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Browse Templates
              </span>
            </motion.button>
          </motion.div>
            {/* Demo preview image with enhanced styling */}
          <motion.div
            className="relative w-full max-w-5xl mx-auto mb-20 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ 
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            {/* Browser header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-10 w-full flex items-center px-4 space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300">README Preview</div>
              </div>
            </div>
            
            {/* Content area */}
            <div className="bg-white dark:bg-gray-900 p-8 relative">
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-500/5 dark:to-blue-500/10 pointer-events-none"></div>
              
              <Image 
                src="/preview-screen.svg" 
                alt="README Preview" 
                width={1200} 
                height={700}
                className="w-full h-auto relative z-10"
                priority
              />
              
              {/* Floating action button overlay */}
              <motion.div 
                className="absolute bottom-6 right-6 z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <motion.button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/create')}
                >
                  <span>Try It Now</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
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
      </div>      {/* Enhanced testimonial section with improved design and vibrant colors */}
      <motion.div
        className="max-w-6xl mx-auto mt-24 px-4 mb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Section header with animated elements */}
        <div className="text-center mb-16 relative">
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.h3 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Developers Are Saying
          </motion.h3>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of developers who have transformed their GitHub profiles
          </motion.p>
        </div>
        
        {/* Testimonials grid with enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "Senior Frontend Developer",
              company: "Tech Innovations",
              text: "This tool saved me hours of work. My GitHub profile now stands out and I've received compliments from recruiters! The templates are incredibly well-designed.",
              avatar: "https://i.pravatar.cc/100?img=1",
              rating: 5,
              highlight: "Saved hours of work"
            },
            {
              name: "James Wilson",
              role: "Full Stack Engineer",
              company: "StartupXYZ",
              text: "The drag and drop builder makes creating professional READMEs so easy. The widgets are extremely useful and the GitHub integration is seamless.",
              avatar: "https://i.pravatar.cc/100?img=2",
              rating: 5,
              highlight: "Seamless integration"
            },
            {
              name: "Priya Sharma",
              role: "Open Source Contributor",
              company: "Community Leader",
              text: "I use this tool for all my repositories now. The GitHub stats integration is brilliant and gives my projects a professional look that attracts contributors.",
              avatar: "https://i.pravatar.cc/100?img=3",
              rating: 5,
              highlight: "Professional look"
            }
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * idx, duration: 0.6, type: "spring" }}
              whileHover={{ y: -8 }}
            >
              {/* Card background with gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <div className="relative bg-white dark:bg-gray-800/90 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm h-full flex flex-col">
                {/* Rating stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-yellow-400 text-lg"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + idx * 0.2 + i * 0.1, duration: 0.3 }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                
                {/* Testimonial text */}                <blockquote className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 flex-grow">
                  <span className="text-3xl text-blue-500 leading-none">&ldquo;</span>
                  {testimonial.text}
                  <span className="text-3xl text-blue-500 leading-none">&rdquo;</span>
                </blockquote>
                
                {/* Highlight badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                    ✨ {testimonial.highlight}
                  </span>
                </div>
                
                {/* Author info */}
                <div className="flex items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/20">
                      <AvatarWithFallback 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        name={testimonial.name}
                        width={48} 
                        height={48}
                        className="w-full h-full object-cover"
                        style="circle"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
          {/* Enhanced call to action in testimonials section */}
        <motion.div 
          className="text-center mt-16 mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="group relative inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-semibold text-lg shadow-2xl overflow-hidden"
            whileHover={{ 
              scale: 1.08, 
              y: -4,
              boxShadow: "0 25px 50px rgba(139, 92, 246, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/create')}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            {/* Sparkle effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-pink-300/20 to-purple-300/20 opacity-0 group-hover:opacity-100"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Content */}
            <motion.span
              className="relative z-10 mr-3"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.span>
            <span className="relative z-10">Join These Happy Developers</span>
            <motion.span
              className="relative z-10 ml-3"
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              🚀
            </motion.span>
          </motion.button>
          
          {/* Additional motivational text */}
          <motion.p
            className="mt-6 text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Start creating your professional GitHub profile in under 5 minutes
          </motion.p>
        </motion.div>
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
        {/* Smooth gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50 pointer-events-none"></div>
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