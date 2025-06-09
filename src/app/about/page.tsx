'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getGithubStats } from '@/services/socialStats';

// GitHub user interface
interface GitHubUser {
  name: string;
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  company: string | null;
  location: string | null;
  blog: string | null;
}

// GitHub username constant
const GITHUB_USERNAME = 'harshitkumar9030';

export default function AboutPage() {
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);  useEffect(() => {
    const fetchGithubData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // Check localStorage for cached data (valid for 1 hour)
        const cacheKey = `github_user_${GITHUB_USERNAME}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        
        if (cachedData && cacheTimestamp) {
          const isValidCache = (Date.now() - parseInt(cacheTimestamp)) < 3600000; // 1 hour
          if (isValidCache) {
            setGithubUser(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }
        
        // Fetch fresh data from GitHub API
        const githubStats = await getGithubStats(GITHUB_USERNAME);
        
        const userData: GitHubUser = {
          name: githubStats.name || "Harshit Kumar",
          login: GITHUB_USERNAME,
          avatar_url: githubStats.avatar_url,
          html_url: `https://github.com/${GITHUB_USERNAME}`,
          bio: githubStats.bio || "Full Stack Developer | ML Enthusiast | Open Source Contributor",
          public_repos: githubStats.public_repos,
          followers: githubStats.followers,
          following: githubStats.following,
          company: null,
          location: null,
          blog: null
        };
        
        setGithubUser(userData);
        
        // Cache the data in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(userData));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
        setError(true);
        
        // Fallback to default data if API fails
        const fallbackUser: GitHubUser = {
          name: "Harshit Kumar",
          login: GITHUB_USERNAME,
          avatar_url: "https://avatars.githubusercontent.com/u/93194961",
          html_url: `https://github.com/${GITHUB_USERNAME}`,
          bio: "Full Stack Developer | ML Enthusiast | Open Source Contributor",
          public_repos: 34,
          followers: 86,
          following: 25,
          company: "@NxC3",
          location: "India",
          blog: "https://leoncyriac.me"
        };
        
        setGithubUser(fallbackUser);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Enhanced background elements */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 25, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-blue-400/20' : i % 2 === 0 ? 'bg-purple-400/15' : 'bg-pink-400/10'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-20"
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Shipwrecked Badge - Simple mention */}
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
                🚀
              </motion.span>
              Made for HackClub&apos;s Shipwrecked Event
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="ml-3 text-lg"
              >
                ⭐
              </motion.span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              About README 
              <br />
              Generator
            </motion.h1>
              <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              I created this powerful, intuitive generator to help fellow developers create stunning GitHub profile READMEs effortlessly. 
              Built with love and attention to detail to help you showcase your projects and skills beautifully.
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {[
                { value: '50+', label: 'Professional Templates', icon: '📋' },
                { value: '25+', label: 'GitHub Widgets', icon: '🎨' },
                { value: '500+', label: 'Projects Created', icon: '🚀' },
                { value: '1000+', label: 'Happy Developers', icon: '👩‍💻' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="text-center p-6 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.5, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <motion.div 
                    className="text-3xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 0.5, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>          {/* Main Content Sections */}
          <div className="max-w-5xl mx-auto space-y-20">
            {/* Visual Breadcrumb Navigation */}
            <motion.div
              className="flex items-center justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <Link 
                  href="/"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
                >
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </motion.div>
                  <span className="font-medium">Home</span>
                </Link>
                
                <motion.div
                  className="mx-3 text-gray-400 dark:text-gray-500"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                
                <div className="flex items-center">
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center mr-3"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg
                      className="w-4 h-4 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">About</span>
                </div>
              </div>
            </motion.div>{/* Enhanced Mission Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mr-2"
                  >
                    ⚡
                  </motion.span>
                  My Mission
                </motion.div>
                
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Empowering Developers
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >                  README Generator was created to help developers create beautiful, professional GitHub profile READMEs 
                  without having to write complex markdown or HTML. My goal is to make it easier for developers to 
                  showcase their skills and projects in a visually appealing way using my intuitive drag-and-drop builder 
                  and integrated GitHub widgets.
                </motion.p>
              </div>

              {/* Mission Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    icon: "🎯",
                    title: "Simplicity",
                    description: "Making README creation accessible to developers of all skill levels",
                    gradient: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: "⚡",
                    title: "Speed",
                    description: "Create professional READMEs in minutes, not hours",
                    gradient: "from-purple-500 to-purple-600"
                  },
                  {
                    icon: "🎨",
                    title: "Customization",
                    description: "Extensive templates and widgets to match your style",
                    gradient: "from-indigo-500 to-indigo-600"
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-blue-400/20 via-purple-400/20 to-indigo-400/20" />
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 text-center h-full">
                      <motion.div
                        className="text-4xl mb-4"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: idx * 0.5 
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                      
                      {/* Animated bottom border */}
                      <motion.div
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.gradient} rounded-b-2xl`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
              {/* Enhanced How It Works Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    ⚙️
                  </motion.span>
                  How It Works
                </motion.div>
                
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Simple. Fast. Effective.
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >                  My README Generator provides an intuitive interface for creating custom GitHub profile 
                  READMEs. Simply choose a template, customize it with your information, and export the 
                  markdown to use in your GitHub profile.
                </motion.p>
              </div>

              <div className="relative">
                {/* Central animated element */}
                <motion.div 
                  className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full hidden lg:block"
                  style={{ transform: 'translateX(-50%)' }}
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                  {[
                    {
                      step: "01",
                      title: "Choose Your Template",
                      description: "Browse my collection of professionally designed templates and select the one that best fits your style.",
                      icon: "📋",
                      color: "blue",
                      position: "left"
                    },
                    {
                      step: "02", 
                      title: "Customize Everything",
                      description: "Add your personal information, skills, projects, and preferences using my intuitive interface.",
                      icon: "✨",
                      color: "purple",
                      position: "right"
                    },
                    {
                      step: "03",
                      title: "Preview in Real-time", 
                      description: "See your README come to life with my live preview feature as you make changes.",
                      icon: "👀",
                      color: "indigo",
                      position: "left"
                    },
                    {
                      step: "04",
                      title: "Export & Deploy",
                      description: "Download your generated markdown and add it to your GitHub profile to showcase your work.",
                      icon: "🚀",
                      color: "green", 
                      position: "right"
                    }
                  ].map((item, idx) => {
                    const isLeft = item.position === 'left';
                    return (
                      <motion.div
                        key={idx}
                        className={`flex items-center gap-6 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} ${
                          isLeft ? 'lg:text-left' : 'lg:text-right'
                        }`}
                        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 * idx }}
                      >
                        {/* Step card */}
                        <motion.div
                          className="flex-1 group"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
                            {/* Background gradient */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600`} />
                            
                            <div className="relative z-10">
                              <div className="flex items-center gap-4 mb-4">
                                <motion.div
                                  className={`w-12 h-12 rounded-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 flex items-center justify-center text-white font-bold text-lg`}
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                                >
                                  {item.step}
                                </motion.div>
                                <motion.div
                                  className="text-3xl"
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                                >
                                  {item.icon}
                                </motion.div>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                              
                              {/* Check mark */}
                              <motion.div
                                className="mt-4 inline-flex items-center text-green-600 dark:text-green-400"
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                              >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Easy & Quick</span>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Timeline dot for large screens */}
                        <motion.div
                          className={`hidden lg:block w-4 h-4 rounded-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 border-4 border-white dark:border-gray-900 relative z-10`}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
              {/* Enhanced Why Choose Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mr-2"
                  >
                    💎
                  </motion.span>
                  Why Choose This
                </motion.div>
                
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Stand Out From The Crowd
                </motion.h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: "⚡",
                    title: "Lightning Fast",
                    description: "Create professional READMEs in minutes instead of hours with my easy-to-use templates and intuitive interface.",
                    gradient: "from-yellow-400 to-orange-500",
                    bgGradient: "from-yellow-50 to-orange-50",
                    darkBgGradient: "from-yellow-900/20 to-orange-900/20"
                  },
                  {
                    icon: "🚀",
                    title: "No Coding Required",
                    description: "My intuitive drag-and-drop interface means you don't need to write any markdown, HTML, or code.",
                    gradient: "from-blue-400 to-purple-500",
                    bgGradient: "from-blue-50 to-purple-50",
                    darkBgGradient: "from-blue-900/20 to-purple-900/20"
                  },
                  {
                    icon: "🎨",
                    title: "Professional Design",
                    description: "Make your GitHub profile stand out with beautifully designed templates that showcase your skills perfectly.",
                    gradient: "from-pink-400 to-red-500",
                    bgGradient: "from-pink-50 to-red-50",
                    darkBgGradient: "from-pink-900/20 to-red-900/20"
                  },
                  {
                    icon: "💎",
                    title: "Always Free",
                    description: "This powerful tool is completely free to use and will always remain so for all developers worldwide.",
                    gradient: "from-green-400 to-emerald-500",
                    bgGradient: "from-green-50 to-emerald-50",
                    darkBgGradient: "from-green-900/20 to-emerald-900/20"
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="group relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * idx }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    {/* Animated background glow */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl`}
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0, 0.1, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.8
                      }}
                    />
                    
                    <div className={`relative bg-gradient-to-br ${feature.bgGradient} dark:bg-gradient-to-br dark:${feature.darkBgGradient} p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden h-full`}>
                      {/* Top corner decoration */}
                      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-r ${feature.gradient} opacity-10 rounded-full -mt-10 -mr-10`} />
                      
                      {/* Icon with animation */}
                      <motion.div
                        className="text-5xl mb-6"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: idx * 0.4
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                      
                      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{feature.description}</p>
                      
                      {/* Feature highlight */}
                      <motion.div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${feature.gradient} text-white`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          ✨
                        </motion.span>
                        <span className="ml-1">Featured</span>
                      </motion.div>
                      
                      {/* Bottom accent line */}
                      <motion.div
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
              {/* Enhanced Creator Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800/50 dark:via-indigo-900/20 dark:to-purple-900/20 p-10 md:p-12 rounded-3xl relative overflow-hidden backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                {/* Enhanced decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full -mt-20 -mr-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full -mb-20 -ml-20" />
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                
                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${
                      i % 3 === 0 ? 'bg-blue-400/30' : i % 2 === 0 ? 'bg-purple-400/30' : 'bg-indigo-400/30'
                    }`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3
                    }}
                  />
                ))}
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-800 dark:text-indigo-300 mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="mr-2"
                      >
                        👨‍💻
                      </motion.span>
                      Meet the Creator
                    </motion.div>
                    
                    <motion.h2 
                      className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    >
                      Built with Passion
                    </motion.h2>
                    
                    <motion.p 
                      className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      README Generator was lovingly crafted by Harshit Kumar as a project for HackClub&apos;s Shipwrecked event. 
                      If you enjoy using this tool or have suggestions for improvement, feel free to contribute to the project or reach out!
                    </motion.p>
                  </div>
                  
                  {/* Enhanced GitHub Profile Card */}
                  <motion.div 
                    className="bg-white/90 z-[40] dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      scale: 1.02
                    }}
                  >
                    {/* Enhanced GitHub header */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-24 relative overflow-hidden">
                      {/* Animated background pattern */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'linear'
                        }}
                        style={{
                          backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                          backgroundSize: '20px 20px'
                        }}
                      />
                      
                      {/* GitHub logo with animation */}
                      <motion.div 
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                      
                      <div className="!absolute z-50 -bottom-12 left-8">
                        {loading ? (
                          <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse border-4 border-white dark:border-gray-800"></div>
                        ) : error ? (
                          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>                        ) : (
                          <motion.div
                            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white shadow-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Image 
                              src={githubUser?.avatar_url || "https://avatars.githubusercontent.com/u/93194961"}
                              alt={`${githubUser?.name || 'GitHub'} profile picture`}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://avatars.githubusercontent.com/u/93194961";
                              }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced profile info */}
                    <div className="pt-16 pb-8 px-8">
                      {loading ? (
                        <div className="space-y-4">
                          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                        </div>
                      ) : error ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center">Could not load GitHub profile</p>
                      ) : (
                        <>
                          <div className="space-y-2 mb-6">
                            <motion.h3 
                              className="text-2xl font-bold text-gray-900 dark:text-white"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              {githubUser?.name}
                            </motion.h3>
                            <motion.a 
                              href={githubUser?.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 }}
                              whileHover={{ x: 5 }}
                            >
                              @{githubUser?.login}
                              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </motion.a>
                          </div>
                          
                          <motion.p 
                            className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            {githubUser?.bio}
                          </motion.p>
                          
                          {/* Enhanced user stats */}
                          <motion.div 
                            className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                          >
                            {[
                              { label: 'Repositories', value: githubUser?.public_repos, icon: '📚' },
                              { label: 'Followers', value: githubUser?.followers, icon: '👥' },
                              { label: 'Following', value: githubUser?.following, icon: '🤝' }
                            ].map((stat, idx) => (
                              <motion.div 
                                key={idx}
                                className="text-center group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <motion.div 
                                  className="text-2xl mb-1"
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                                >
                                  {stat.icon}
                                </motion.div>
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {stat.value}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </div>
                    
                    {/* Enhanced card footer */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/30 dark:to-blue-900/20 px-8 py-4 flex justify-between items-center">
                      <motion.a
                        href="https://github.com/harshitkumar9030"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        View Full Profile
                        <motion.svg 
                          className="w-4 h-4 ml-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </motion.svg>
                      </motion.a>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="mr-1"
                        >
                          ⭐
                        </motion.span>
                        GitHub Profile
                      </span>
                    </div>
                  </motion.div>
                  
                  {/* Enhanced CTA buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/create" 
                        className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl group"
                      >
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mr-3"
                        >
                          🚀
                        </motion.span>
                        Start Creating Now
                        <motion.svg 
                          className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </motion.svg>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a
                        href="https://github.com/harshitkumar9030/github_readme"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:shadow-lg"
                      >
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="mr-3"
                        >
                          ⭐
                        </motion.span>
                        Star on GitHub
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
