'use client';

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'

const Hero = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

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
  
  return (
    <motion.section 
      className="w-full py-20 md:py-32 relative overflow-hidden"
      style={{ opacity, scale }}
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
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i % 5 === 0 ? 'w-2 h-2' : i % 3 === 0 ? 'w-1.5 h-1.5' : 'w-1 h-1'} rounded-full ${
              i % 4 === 0 ? 'bg-blue-500/20' : i % 3 === 0 ? 'bg-purple-500/15' : 'bg-gray-500/10'
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Animated badge above heading */}
          <motion.div
            className="mb-6"
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
              New Features
            </span>
          </motion.div>          {/* Main heading with typing animation - minimal style */}
          <motion.div 
            className="relative mb-6"
          >            <motion.h1 
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
            className="text-xl md:text-2xl mb-6 max-w-2xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Create stunning GitHub profile README files with our intuitive generator
          </motion.p>
          
          {/* Stats section */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {[
              { value: '50+', label: 'Templates' },
              { value: '200+', label: 'Developers' },
              { value: '4k+', label: 'READMEs Created' }
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
          >            <motion.button
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
              Get Started
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
              Learn More
            </motion.button>
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
                title: 'Templates', 
                description: 'Choose from dozens of ready-made templates',
                color: 'from-blue-500/10 to-blue-600/5'
              },
              { 
                icon: '/globe.svg', 
                title: 'Customizable', 
                description: 'Fully customize your README to match your style',
                color: 'from-purple-500/10 to-purple-600/5'
              },
              { 
                icon: '/window.svg', 
                title: 'Preview', 
                description: 'See changes in real-time as you edit',
                color: 'from-indigo-500/10 to-indigo-600/5'
              }
            ].map((feature, index) => (              <motion.div
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
      
      {/* Animated scroll indicator */}
      <motion.div 
        className="absolute bottom-14 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
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