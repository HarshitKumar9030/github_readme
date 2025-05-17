'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import Link from 'next/link';
import 'katex/dist/katex.min.css';

// Types for react-markdown component props
type CodeBlockProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ImageProps = {
  node?: any;
  src?: string;
  alt?: string;
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  fullScreen?: boolean;
  maxHeight?: string;
  defaultLayout?: 'grid' | 'flow';
  defaultGridColumns?: 1 | 2 | 3;
}

// Import markdown-grid styles
import '../styles/markdown-grid.css';

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  fullScreen = true, // Default to fullscreen for better GitHub-like experience
  maxHeight = 'max-h-[85vh]',
  defaultLayout = 'grid',
  defaultGridColumns = 2
}) => {
  const [isFullscreen, setIsFullscreen] = useState(fullScreen);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isGithubStyle, setIsGithubStyle] = useState(true); // Always use GitHub style by default
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [useGridLayout, setUseGridLayout] = useState(defaultLayout === 'grid'); // Use the default layout
  const [gridColumns, setGridColumns] = useState(defaultGridColumns); // Default number of columns
  const [equalHeight, setEqualHeight] = useState(true); // Make widgets have equal height
  
  // Check for dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkTheme(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // Also check for any class-based dark mode on the document
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkTheme(isDark);
    };
    
    checkDarkMode();
    
    // Set up a mutation observer to detect changes to the html element's classes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Close sidebar when entering fullscreen
    if (!isFullscreen) {
      setSidebarOpen(false);
    }
  };

  const toggleStyle = () => {
    setIsGithubStyle(!isGithubStyle);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkTheme;
    setIsDarkTheme(newDarkMode);
    
    // Update document class for dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // GitHub-style wrapper classNames
  const githubWrapperClasses = isGithubStyle 
    ? 'bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm w-full' 
    : '';
  
  // GitHub-style content classNames
  const githubContentClasses = isGithubStyle 
    ? 'p-8 font-[system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji] text-[16px] md:text-[18px]' 
    : '';

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900' : ''} ${className}`}>
      {/* Header toolbar - GitHub Style */}
      <div className="z-10 sticky top-0 flex items-center justify-between px-4 py-2.5 bg-[#f6f8fa] dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Show options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z" />
            </svg>
            <span className="font-semibold">README Preview</span>
          </div>
          
          {isGithubStyle && (
            <span className="text-xs py-1 px-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium">
              GitHub Style
            </span>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={toggleFullscreen}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Main content with sidebar and preview */}
      <div className="flex h-[calc(100%-44px)]">
        {/* Sidebar */}
        <div 
          className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isFullscreen ? 'fixed z-50 h-[calc(100%-44px)]' : 'h-full'}`}
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Display Options</h3>
            
            <div className="space-y-4">
              {/* GitHub style toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">GitHub Style</label>
                <button 
                  onClick={toggleStyle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${isGithubStyle ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`${isGithubStyle ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                </button>
              </div>
              
              {/* Dark mode toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</label>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${isDarkTheme ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`${isDarkTheme ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                </button>
              </div>
              
              {/* Full screen toggle */}              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Full Screen</label>
                <button 
                  onClick={toggleFullscreen}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${isFullscreen ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`${isFullscreen ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                </button>
              </div>
              
              {/* Widget Grid Layout toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Grid Layout</label>
                <button 
                  onClick={() => setUseGridLayout(!useGridLayout)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${useGridLayout ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`${useGridLayout ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                </button>
              </div>
                {/* Grid Columns selector (only shown when grid layout is enabled) */}
              {useGridLayout && (
                <>
                  <div className="mt-2">
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Grid Columns</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map(cols => (
                        <button
                          key={cols}
                          onClick={() => setGridColumns(cols)}
                          className={`flex-1 py-1.5 px-3 text-sm rounded ${
                            gridColumns === cols
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {cols}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Equal height toggle for widgets */}
                  <div className="flex items-center justify-between mt-4">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Equal Height Widgets</label>
                    <button 
                      onClick={() => setEqualHeight(!equalHeight)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${equalHeight ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <span className={`${equalHeight ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Overlay when sidebar is open (on smaller screens) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
          {/* Markdown content */}
        <div 
          className={`flex-grow overflow-auto bg-gray-50 dark:bg-gray-900 ${
            isFullscreen ? 'w-full' : maxHeight
          }`}
        >          <div className={`${isFullscreen ? 'max-w-5xl mx-auto my-8 px-4' : 'p-4'}`}>
            <div className={`${githubWrapperClasses}`}>              <div className={`${githubContentClasses} prose dark:prose-invert max-w-none 
                ${isFullscreen ? 'md:text-lg' : ''} 
                ${useGridLayout ? 'grid-widget-layout' : ''}
                ${useGridLayout && equalHeight ? 'grid-equal-height' : ''}
                prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 
                prose-headings:pb-2 prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl 
                prose-headings:scroll-mt-20 prose-img:my-8 prose-img:rounded-md
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:font-normal hover:prose-a:underline
                prose-p:leading-relaxed prose-p:my-4 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
                dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic 
                prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:font-normal
                prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-pre:p-0 prose-pre:rounded-md
                prose-hr:border-gray-200 dark:prose-hr:border-gray-800`}
                style={useGridLayout ? { '--grid-columns': gridColumns } as React.CSSProperties : undefined}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, [rehypeRaw, { passThrough: [] }], rehypeSanitize]}
                  components={{
                    code: ({ node, inline, className, children, ...props }: CodeBlockProps) => {
                      const match = /language-(\w+)/.exec(className || '');
                      
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={isDarkTheme ? vscDarkPlus : oneLight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                          className="text-[14px] rounded-md overflow-hidden !bg-gray-50 dark:!bg-gray-800 !my-6"
                          showLineNumbers={true}
                          customStyle={{
                            margin: '1.5rem 0',
                            padding: '1rem',
                            borderRadius: '6px',
                            fontSize: isFullscreen ? '16px' : '14px',
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={`${className} font-mono text-sm px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800`} {...props}>
                          {children}
                        </code>
                      );
                    },                    img: ({ src, alt, ...props }) => {
                      // Handle GitHub stats and other SVG images
                      if (typeof src === 'string' && (
                        src.includes('github-readme-stats.vercel.app') || 
                        src.includes('github-profile-trophy.vercel.app') ||
                        src.includes('github-readme-streak-stats.herokuapp.com')
                      )) {
                        // Check if we should apply the grid layout to this widget
                        const isStats = src.includes('github-readme-stats.vercel.app/api?');
                        const isLanguages = src.includes('github-readme-stats.vercel.app/api/top-langs');
                        const isTrophy = src.includes('github-profile-trophy.vercel.app');
                        const isStreak = src.includes('github-readme-streak-stats.herokuapp.com');
                        
                        // Apply widget-specific styles
                        const widgetType = isStats ? 'stats' : 
                                          isLanguages ? 'languages' : 
                                          isTrophy ? 'trophy' : 
                                          isStreak ? 'streak' : 'other';
                        
                        // Get username from URL to use in the title
                        let username = '';
                        try {
                          const urlParams = new URL(src).searchParams;
                          username = urlParams.get('username') || '';
                        } catch (e) {
                          // Ignore URL parsing errors
                        }
                        
                        // Apply grid layout if enabled
                        const gridClasses = useGridLayout 
                          ? `widget-${widgetType} w-full p-2 ${isTrophy ? 'widget-larger' : ''} ${equalHeight ? 'h-full' : ''}` 
                          : 'my-6 overflow-hidden flex justify-center';
                        
                        // Create widget titles based on type
                        const widgetTitles = {
                          stats: `GitHub Stats${username ? ` - @${username}` : ''}`,
                          languages: `Top Languages${username ? ` - @${username}` : ''}`,
                          trophy: `GitHub Trophies${username ? ` - @${username}` : ''}`,
                          streak: `Contribution Streak${username ? ` - @${username}` : ''}`,
                          other: 'GitHub Widget'
                        };
                        
                        return (
                          <div className={gridClasses} data-widget-type={widgetType}>
                            <div className="widget-card h-full">
                              <div className="widget-header">
                                <h3 className="flex items-center">
                                  {widgetType === 'stats' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                      <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
                                    </svg>
                                  )}
                                  {widgetType === 'languages' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z" />
                                    </svg>
                                  )}
                                  {widgetType === 'trophy' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M3.217 6.962A3.75 3.75 0 010 3.25v-.5C0 1.784.784 1 1.75 1h3.5c.966 0 1.75.784 1.75 1.75v.5A3.75 3.75 0 013.217 6.962zm-1.5-5.212A.25.25 0 001.75 2h1.5v-.25a.25.25 0 00-.25-.25h-1a.25.25 0 00-.25.25v.25zM12 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0112 6zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                                      <path fillRule="evenodd" d="M7.5 1.75V5H10c.484 0 .952.046 1.407.132l.595-1.191a.75.75 0 011.343.67L12.682 6.3a4.75 4.75 0 11-1.49 9.348 4.75 4.75 0 01-8.365 0A4.75 4.75 0 012.318 6.3l-.663-1.324a.75.75 0 011.342-.671l.596 1.19A5.75 5.75 0 017.5 5V1.75c0-.984.796-1.75 1.75-1.75h.5c.954 0 1.75.766 1.75 1.75v.5a.75.75 0 01-1.5 0v-.5a.25.25 0 00-.25-.25h-.5a.25.25 0 00-.25.25v.5a.75.75 0 01-1.5 0z" />
                                    </svg>
                                  )}
                                  {widgetType === 'streak' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.788 2.788 0 01-1.436-.874A3.21 3.21 0 003 10c0 2.53 2.164 4.5 4.998 4.5zM9.533.753C9.496.34 9.16.009 8.77.146 7.035.75 4.34 3.187 5.997 6.5c.344.689.285 1.218.003 1.5-.419.419-1.54.487-2.04-.832-.173-.454-.659-.762-1.035-.454C2.036 7.44 1.5 8.702 1.5 10c0 3.512 2.998 6 6.498 6s6.5-2.5 6.5-6c0-2.137-1.128-3.26-2.312-4.438-1.19-1.184-2.436-2.425-2.653-4.81z" />
                                    </svg>
                                  )}
                                  {widgetTitles[widgetType]}
                                </h3>
                                <span className="text-xs font-medium px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                                  {widgetType}
                                </span>
                              </div>
                              <div className="widget-body widget-compact flex items-center justify-center">
                                <Image
                                  src={src}
                                  alt={alt || `GitHub ${widgetType}`}
                                  width={600}
                                  height={250}
                                  className="rounded-md max-w-full"
                                  priority={true}
                                  unoptimized={true}
                                />
                              </div>
                              <div className="widget-footer">
                                <span>
                                  {isTrophy ? 'GitHub Profile Trophy' : isStreak ? 'GitHub Streak Stats' : 'GitHub ReadMe Stats'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // Handle regular images
                      if (typeof src === 'string') {
                        return (
                          <div className="relative my-6 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 flex justify-center">
                            <Image
                              src={src}
                              alt={alt || ''}
                              width={700}
                              height={350}
                              className="rounded-md max-w-full"
                              unoptimized={true}
                            />
                          </div>
                        );
                      }
                      return null;
                    },
                    
                    a({ href, children, ...props }) {
                      const isExternal = href && (href.startsWith('http') || href.startsWith('mailto:'));
                      
                      return isExternal ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          {...props}
                        >
                          {children}
                        </a>
                      ) : (
                        <Link
                          href={href || '#'}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          {...props}
                        >
                          {children}
                        </Link>
                      );
                    },
                    
                    table({ children, ...props }) {
                      return (
                        <div className="my-6 overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props}>
                            {children}
                          </table>
                        </div>
                      );
                    },
                    
                    th({ children, ...props }) {
                      return (
                        <th className="bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
                          {children}
                        </th>
                      );
                    },
                    
                    td({ children, ...props }) {
                      return (
                        <td className="px-4 py-3 text-sm border-t border-gray-200 dark:border-gray-700" {...props}>
                          {children}
                        </td>
                      );
                    },
                    
                    blockquote({ children, ...props }) {
                      return (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-700 dark:text-gray-300 my-6" {...props}>
                          {children}
                        </blockquote>
                      );
                    },
                    
                    hr({ ...props }) {
                      return (
                        <hr className="my-8 border-t border-gray-200 dark:border-gray-800" {...props} />
                      );
                    },
                    
                    h1({ children, ...props }) {
                      return (
                        <h1 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mt-8 mb-4" {...props}>
                          {children}
                        </h1>
                      );
                    },
                    
                    h2({ children, ...props }) {
                      return (
                        <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mt-8 mb-4" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    
                    ul({ children, ...props }) {
                      return (
                        <ul className="list-disc pl-8 my-4 space-y-2" {...props}>
                          {children}
                        </ul>
                      );
                    },
                    
                    ol({ children, ...props }) {
                      return (
                        <ol className="list-decimal pl-8 my-4 space-y-2" {...props}>
                          {children}
                        </ol>
                      );
                    },
                    
                    li({ children, ...props }) {
                      return (
                        <li className="pl-1" {...props}>
                          {children}
                        </li>
                      );
                    },
                    
                    p({ children, ...props }) {
                      return (
                        <p className="my-4 leading-relaxed" {...props}>
                          {children}
                        </p>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownRenderer;
