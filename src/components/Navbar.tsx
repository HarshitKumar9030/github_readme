'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <img src="/file.svg" alt="Logo" className="w-6 h-6" />
          <span className="font-bold text-gray-900 dark:text-white">README Gen</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/features" 
            className={`${pathname === '/features' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'}`}
          >
            Features
          </Link>
          <Link 
            href="/templates"
            className={`${pathname === '/templates' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'}`}
          >
            Templates
          </Link>
          <Link 
            href="/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create README
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
