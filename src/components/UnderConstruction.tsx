'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface UnderConstructionProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title = 'Under Construction',
  message = 'We\'re working hard to bring you amazing templates. Check back soon!',
  showHomeLink = true
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Animation for the construction gear
  const gearVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <motion.div 
        className="max-w-lg w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="relative w-32 h-32 mx-auto mb-8"
          variants={itemVariants}
        >
          {/* Main gear animation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={gearVariants}
            animate="rotate"
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 84C73.2548 84 84 73.2548 84 60C84 46.7452 73.2548 36 60 36C46.7452 36 36 46.7452 36 60C36 73.2548 46.7452 84 60 84Z" stroke="currentColor" strokeWidth="4" className="text-blue-500 dark:text-blue-400" />
              <path d="M60 28V12M60 108V92M92 60H108M12 60H28M84.85 35.15L96.07 23.93M23.93 96.07L35.15 84.85M84.85 84.85L96.07 96.07M23.93 23.93L35.15 35.15" stroke="currentColor" strokeWidth="4" className="text-blue-500 dark:text-blue-400" />
              <path d="M51 60C51 55.0294 55.0294 51 60 51C64.9706 51 69 55.0294 69 60C69 64.9706 64.9706 69 60 69C55.0294 69 51 64.9706 51 60Z" fill="currentColor" className="text-blue-500 dark:text-blue-400" />
            </svg>
          </motion.div>
          
          {/* Secondary gear animation (opposite direction) */}
          <motion.div
            className="absolute right-0 bottom-0 flex items-center justify-center"
            animate={{ 
              rotate: -360,
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: 'linear'
              }
            }}
          >
            <svg width="60" height="60" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 84C73.2548 84 84 73.2548 84 60C84 46.7452 73.2548 36 60 36C46.7452 36 36 46.7452 36 60C36 73.2548 46.7452 84 60 84Z" stroke="currentColor" strokeWidth="4" className="text-indigo-500 dark:text-indigo-400" />
              <path d="M60 28V12M60 108V92M92 60H108M12 60H28M84.85 35.15L96.07 23.93M23.93 96.07L35.15 84.85M84.85 84.85L96.07 96.07M23.93 23.93L35.15 35.15" stroke="currentColor" strokeWidth="4" className="text-indigo-500 dark:text-indigo-400" />
              <path d="M51 60C51 55.0294 55.0294 51 60 51C64.9706 51 69 55.0294 69 60C69 64.9706 64.9706 69 60 69C55.0294 69 51 64.9706 51 60Z" fill="currentColor" className="text-indigo-500 dark:text-indigo-400" />
            </svg>
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-8"
          variants={itemVariants}
        >
          {message}
        </motion.p>
        
        {showHomeLink && (
          <motion.div variants={itemVariants}>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UnderConstruction;
