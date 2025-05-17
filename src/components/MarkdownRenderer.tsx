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
import type { CodeProps } from 'react-syntax-highlighter';
import Image from 'next/image';
import Link from 'next/link';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  fullScreen?: boolean;
  maxHeight?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  fullScreen = true, // Default to fullscreen for better GitHub-like experience
  maxHeight = 'max-h-[85vh]'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(fullScreen);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isGithubStyle, setIsGithubStyle] = useState(true); // Always use GitHub style by default
  
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
  };

  const toggleStyle = () => {
    setIsGithubStyle(!isGithubStyle);
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
    <div className={`relative rounded-lg overflow-hidden ${className}`}>      {/* Toolbar - GitHub Style */}
      <div className="z-10 sticky top-0 flex items-center justify-between px-4 py-3 bg-[#f6f8fa] dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z" />
            </svg>
            <span className="font-semibold">README Preview</span>
          </div>
          
          <span className="text-xs py-1 px-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium">
            GitHub Style
          </span>
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
      
      {/* Content */}      <div 
        className={`overflow-auto ${isFullscreen ? 'fixed inset-0 z-40 pt-12 bg-white dark:bg-gray-900' : maxHeight}`}
      >
        <div className={`${githubWrapperClasses} ${isFullscreen ? 'max-w-5xl mx-auto my-8' : ''}`}>
          <div className={`${githubContentClasses} prose dark:prose-invert max-w-none 
          ${isFullscreen ? 'md:text-lg' : ''} 
          prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 
          prose-headings:pb-2 prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl 
          prose-headings:scroll-mt-20 prose-img:my-8 prose-img:rounded-md
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:font-normal hover:prose-a:underline
          prose-p:leading-relaxed prose-p:my-4 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 
          dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic 
          prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:font-normal
          prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-gray-100 dark:prose-code:bg-gray-800
          prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-pre:p-0 prose-pre:rounded-md
          prose-hr:border-gray-200 dark:prose-hr:border-gray-800`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, [rehypeRaw, { passThrough: [] }], rehypeSanitize]}              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
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
                },
                
                img: ({ node, src, alt, ...props }: any) => {
                  // Handle GitHub stats and other SVG images
                  if (typeof src === 'string' && (
                    src.includes('github-readme-stats.vercel.app') || 
                    src.includes('github-profile-trophy.vercel.app') ||
                    src.includes('github-readme-streak-stats.herokuapp.com')
                  )) {
                    return (
                      <div className="my-6 overflow-hidden">
                        <Image
                          src={src}
                          alt={alt || 'GitHub stats'}
                          width={700}
                          height={300}
                          className="rounded-md"
                          priority={true}
                          unoptimized={true}
                        />
                      </div>
                    );
                  }
                  
                  // Handle regular images
                  if (typeof src === 'string') {
                    return (
                      <span className="block relative my-6 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                        <Image
                          src={src}
                          alt={alt || ''}
                          width={700}
                          height={350}
                          className="rounded-md max-w-full"
                          unoptimized={true}
                        />
                      </span>
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
  );
};

export default MarkdownRenderer;
