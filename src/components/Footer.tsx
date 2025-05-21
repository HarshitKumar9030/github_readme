'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const fadeInUpVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };
  
  return (
    <footer className="bg-gradient-to-b from-gray-50/80 to-gray-50 dark:from-gray-900/90 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {/* Logo and name */}
          <motion.div 
            className="flex items-center mb-8 relative group"
            variants={fadeInUpVariants}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <Image 
              src="/file.svg" 
              alt="GitHub README Generator"
              width={32}
              height={32}
              className="mr-3 relative z-10"
            />
            <span className="text-gray-900 dark:text-white font-bold text-xl relative z-10">README <span className="text-blue-600 dark:text-blue-400">Gen</span></span>
          </motion.div>
          
          {/* Navigation links */}
          <motion.div 
            className="flex flex-wrap justify-center gap-x-16 gap-y-8 mb-10"
            variants={fadeInUpVariants}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="min-w-[160px]">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-center text-lg">Product</h3>
              <ul className="space-y-3 flex flex-col items-center">
                <li>
                  <Link href="/features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-flex items-center group">
                    <span className="bg-blue-500/0 group-hover:bg-blue-500/10 absolute inset-0 rounded-lg -z-10 transition-colors duration-300"></span>
                    <span>Features</span>
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-flex items-center group">
                    <span className="bg-blue-500/0 group-hover:bg-blue-500/10 absolute inset-0 rounded-lg -z-10 transition-colors duration-300"></span>
                    <span>Templates</span>
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-flex items-center group">
                    <span className="bg-blue-500/0 group-hover:bg-blue-500/10 absolute inset-0 rounded-lg -z-10 transition-colors duration-300"></span>
                    <span>Create README</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="min-w-[160px]">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-center text-lg">Resources</h3>
              <ul className="space-y-3 flex flex-col items-center">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-flex items-center group">
                    <span className="bg-blue-500/0 group-hover:bg-blue-500/10 absolute inset-0 rounded-lg -z-10 transition-colors duration-300"></span>
                    <span>About</span>
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/harshitkumar9030/github_readme_gen" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-flex items-center group">
                    <span className="bg-blue-500/0 group-hover:bg-blue-500/10 absolute inset-0 rounded-lg -z-10 transition-colors duration-300"></span>
                    <span>GitHub</span>
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
          
          {/* Social links */}
          <motion.div 
            className="flex space-x-8 mb-10"
            variants={fadeInUpVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              <span className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"></span>
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">GitHub</span>
            </Link>
            <Link 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              <span className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"></span>
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
            <Link 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              <span className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300"></span>
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="sr-only">LinkedIn</span>
            </Link>
          </motion.div>
          
          {/* Copyright */}
          <motion.div 
            className="text-center relative"
            variants={fadeInUpVariants}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 inline-block px-4 py-2 bg-gray-50 dark:bg-gray-900 relative">
              © {currentYear} README Generator
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Made with 
              <motion.span
                className="text-red-500 inline-block mx-1"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ❤️
              </motion.span> 
              by <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">Harshit</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
