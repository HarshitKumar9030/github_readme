'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

export default function AboutPage() {
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // This data would typically come from a GitHub API call
    // For now, we'll use mock data to avoid API rate limits
    const mockUser: GitHubUser = {
      name: "Harshit Kumar",
      login: "harshitkumar9030",
      avatar_url: "https://avatars.githubusercontent.com/u/93194961",
      html_url: "https://github.com/harshitkumar9030",
      bio: "Full Stack Developer | ML Enthusiast | Open Source Contributor",
      public_repos: 34,
      followers: 86,
      following: 25,
      company: "@NxC3",
      location: "India",
      blog: "https://leoncyriac.me"
    };

    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setGithubUser(mockUser);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i % 5 === 0 ? 'w-16 h-16' : i % 3 === 0 ? 'w-24 h-24' : 'w-32 h-32'} 
                        opacity-[0.03] dark:opacity-[0.05] rounded-full`}
            style={{
              background: i % 2 === 0 ? 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0) 70%)' 
                                     : 'radial-gradient(circle, rgba(147,51,234,0.8) 0%, rgba(147,51,234,0) 70%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15],
              y: [0, Math.random() * 30 - 15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 8 + Math.random() * 7,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 group"
          >
            <motion.svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </motion.svg>
            Back to Home
          </Link>
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            About <span className="text-blue-600 dark:text-blue-400">README</span> Generator
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Learn more about our project and mission
          </motion.p>
          
          {/* Hero graphic for about page */}
          <motion.div 
            className="mt-10 mb-16 relative h-40 sm:h-60 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <svg className="w-full h-full" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* README text with animated highlight */}
              <motion.rect 
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                transition={{ duration: 1, delay: 0.8 }}
                x="100" y="70" width="300" height="60" rx="10" 
                fill="url(#blue-gradient)" fillOpacity="0.1" 
              />
              
              <text x="120" y="115" fontFamily="monospace" fontSize="40" fontWeight="bold" fill="currentColor">
                README.md
              </text>
              
              {/* Code lines */}
              
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <rect x="120" y="130" width="150" height="6" rx="3" fill="#3B82F6" fillOpacity="0.6" />
                <rect x="120" y="145" width="200" height="6" rx="3" fill="#3B82F6" fillOpacity="0.4" />
                <rect x="120" y="160" width="120" height="6" rx="3" fill="#3B82F6" fillOpacity="0.6" />
              </motion.g>
              
              {/* Animated cursor */}
              <motion.rect 
                x="290" y="115" width="3" height="30" fill="#3B82F6"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              
              {/* Decorative elements */}
              <motion.circle 
                cx="70" cy="100" r="20" fill="#3B82F6" fillOpacity="0.1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.circle 
                cx="430" cy="100" r="30" fill="#9333EA" fillOpacity="0.1"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="blue-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#9333EA" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
        
        <div className="space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Our Mission
            </h2>            <p className="text-gray-600 dark:text-gray-300">
              README Generator is a hobby project created to help developers create beautiful, 
              professional GitHub profile READMEs without having to write complex markdown or HTML. 
              Our goal is to make it easier for developers to showcase their skills and projects 
              in a visually appealing way using our intuitive drag-and-drop builder and integrated GitHub widgets.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our README Generator provides an intuitive interface for creating custom GitHub profile 
              READMEs. Simply choose a template, customize it with your information, and export the 
              markdown to use in your GitHub profile.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-lg p-6 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 opacity-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
                </svg>
              </motion.div>
              
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 relative z-10">
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center"
                >
                  <span className="mr-2">Choose from our collection of professionally designed templates</span>
                  <svg className="w-5 h-5 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center"
                >
                  <span className="mr-2">Customize the template with your personal information and preferences</span>
                  <svg className="w-5 h-5 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center"
                >
                  <span className="mr-2">Preview your README in real-time as you make changes</span>
                  <svg className="w-5 h-5 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center"
                >
                  <span className="mr-2">Export the markdown and add it to your GitHub profile</span>
                  <svg className="w-5 h-5 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.li>
              </ol>
            </div>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Why Use README Generator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-blue-500 opacity-10 rounded-full" />
                <svg className="w-8 h-8 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Save Time</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create professional READMEs in minutes instead of hours with our easy-to-use templates.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-purple-500 opacity-10 rounded-full" />
                <svg className="w-8 h-8 text-purple-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">No Coding Required</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our intuitive interface means you don&apos;t need to write any markdown or HTML.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-indigo-500 opacity-10 rounded-full" />
                <svg className="w-8 h-8 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Stand Out</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Make your GitHub profile stand out with a professionally designed README.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-green-500 opacity-10 rounded-full" />
                <svg className="w-8 h-8 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Always Free</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This is a hobby project created with love and it will always be free to use.
                </p>
              </motion.div>
            </div>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-900/30 p-8 rounded-2xl relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mt-16 -mr-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 opacity-10 rounded-full -mb-16 -ml-16" />
            
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About the Creator
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">
              README Generator was created by Harshit as a hobby project to help fellow developers 
              create better GitHub profiles. If you enjoy using this tool or have suggestions for 
              improvement, feel free to contribute to the project or reach out!
            </p>
            
            {/* GitHub Profile Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5
              }}
            >
              {/* GitHub header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-20 relative">
                <div className="absolute -bottom-10 left-6">
                  {loading ? (
                    <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                  ) : error ? (
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <motion.div
                      className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Image 
                        src={githubUser?.avatar_url || ""}
                        alt="GitHub profile picture"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized={true}
                      />
                    </motion.div>
                  )}
                </div>
                
                {/* GitHub logo */}
                <div className="absolute top-4 right-4">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Profile info */}
              <div className="pt-12 pb-6 px-6">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                  </div>
                ) : error ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center">Could not load GitHub profile</p>
                ) : (
                  <>
                    <div className="space-y-1 mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{githubUser?.name}</h3>
                      <a 
                        href={githubUser?.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        @{githubUser?.login}
                      </a>
                    </div>
                    
                    <motion.p 
                      className="text-gray-600 dark:text-gray-300 text-sm my-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {githubUser?.bio}
                    </motion.p>
                    
                    {/* User stats */}
                    <motion.div 
                      className="flex justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="text-center">
                        <span className="block text-lg font-bold text-gray-900 dark:text-white">{githubUser?.public_repos}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Repositories</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-lg font-bold text-gray-900 dark:text-white">{githubUser?.followers}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-lg font-bold text-gray-900 dark:text-white">{githubUser?.following}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
                      </div>
                    </motion.div>
                    
                    {/* User details */}
                    <motion.div 
                      className="mt-6 space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {githubUser?.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {githubUser.location}
                        </div>
                      )}
                      
                      {githubUser?.company && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {githubUser.company}
                        </div>
                      )}
                      
                      {githubUser?.blog && (
                        <div className="flex items-center text-sm">
                          <svg className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <a 
                            href={githubUser.blog.startsWith('http') ? githubUser.blog : `https://${githubUser.blog}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {githubUser.blog.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </div>
              
              {/* Card footer */}
              <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 flex justify-between items-center">
                <motion.a
                  href="https://github.com/harshitkumar9030"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  View on GitHub
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.a>
                <span className="text-sm text-gray-500 dark:text-gray-400">GitHub Profile</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex justify-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/create" 
                  className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium flex items-center hover:bg-blue-700 transition-colors"
                >
                  Get Started
                  <motion.svg 
                    className="w-5 h-5 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </motion.svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
