'use client';

import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  variant?: 'icon' | 'select' | 'buttons';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Simple icon toggle between light and dark only
  if (variant === 'icon') {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
        className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {resolvedTheme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>
    );
  }

  // Dropdown select with all three options
  if (variant === 'select') {
    return (
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className={`rounded-md border border-gray-300 dark:border-gray-600 py-1.5 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${className}`}
        aria-label="Select theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    );
  }

  // Button group with all three options
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group">
      <button
        onClick={() => setTheme("light")}
        className={`inline-flex items-center px-3 py-1.5 text-xs rounded-l-md border border-gray-300 dark:border-gray-600 
          ${theme === "light" 
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium" 
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
        aria-label="Light theme"
        title="Light theme"
      >
        <Sun className="h-3.5 w-3.5 mr-1" />
        Light
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`inline-flex items-center px-3 py-1.5 text-xs border-t border-b border-gray-300 dark:border-gray-600 
          ${theme === "system" 
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium" 
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
        aria-label="System theme"
        title="System theme"
      >
        <Laptop className="h-3.5 w-3.5 mr-1" />
        Auto
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center px-3 py-1.5 text-xs rounded-r-md border border-gray-300 dark:border-gray-600 
          ${theme === "dark" 
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium" 
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
        aria-label="Dark theme"
        title="Dark theme"
      >
        <Moon className="h-3.5 w-3.5 mr-1" />
        Dark
      </button>
    </div>
  );
}
