'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import Link from 'next/link';
import { convertToGitHubCompatible } from '@/utils/inlineStylesConverter';

// Import KaTeX CSS for math rendering
import 'katex/dist/katex.min.css';

// Types for react-markdown component props
type CodeBlockProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

type ImageProps = {
  src?: string | Blob;
  alt?: string;
  title?: string;
  node?: any;
  [key: string]: any;
};

type LinkProps = {
  href?: string;
  children?: React.ReactNode;
  node?: any;
  [key: string]: any;
};

type TableProps = {
  children?: React.ReactNode;
  node?: any;
  [key: string]: any;
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  githubCompatible?: boolean;
  showLineNumbers?: boolean;
  enableMath?: boolean;
  showAnchorLinks?: boolean;
  enhancedWidgetRendering?: boolean;
  onWidgetDetected?: (widgetType: string, widgetData: any) => void;
  livePreview?: boolean;
  containerStyle?: 'fixed' | 'responsive' | 'embedded';
  enableTableOfContents?: boolean;
  maxWidth?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  githubCompatible = true,
  showLineNumbers = false,
  enableMath = false,
  showAnchorLinks = true,
  enhancedWidgetRendering = false,
  onWidgetDetected,
  livePreview = false,
  containerStyle = 'responsive',
  enableTableOfContents = false,
  maxWidth = '5xl'
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for dark mode preference and apply it
  useEffect(() => {
    // Check initial dark mode setting
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    localStorage.getItem('theme') === 'dark' ||
                    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkTheme(isDark);
      setIsLoading(false);
    };

    checkTheme();

    // Set up an observer to track theme changes
    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => checkTheme();
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Enhanced widget detection with better pattern matching
  const detectWidgets = useCallback((content: string) => {
    if (!enhancedWidgetRendering || !onWidgetDetected) return;

    const widgetPatterns = [
      {
        pattern: /!\[([^\]]*)\]\((https:\/\/github-readme-stats\.vercel\.app\/api[^)]+)\)/g,
        type: 'github-stats'
      },
      {
        pattern: /!\[([^\]]*)\]\((https:\/\/github-readme-stats\.vercel\.app\/api\/top-langs[^)]+)\)/g,
        type: 'top-languages'
      },
      {
        pattern: /!\[([^\]]*)\]\((https:\/\/skillicons\.dev\/icons[^)]+)\)/g,
        type: 'animated-progress'
      },
      {
        pattern: /!\[([^\]]*)\]\((https:\/\/github-readme-activity-graph\.vercel\.app[^)]+)\)/g,
        type: 'contribution-graph'
      },
      {
        pattern: /!\[([^\]]*)\]\((https:\/\/github-profile-trophy\.vercel\.app[^)]+)\)/g,
        type: 'trophy'
      },
      {
        pattern: /!\[([^\]]*)\]\((https:\/\/github-readme-streak-stats\.herokuapp\.com[^)]+)\)/g,
        type: 'streak-stats'
      },
      {
        pattern: /<img[^>]+src="([^"]*github-readme-stats\.vercel\.app[^"]*)"[^>]*>/g,
        type: 'github-stats'
      },
      {
        pattern: /<img[^>]+src="([^"]*skillicons\.dev[^"]*)"[^>]*>/g,
        type: 'skill-icons'
      }
    ];

    widgetPatterns.forEach(({ pattern, type }) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const [fullMatch, altOrSrc, url] = match;
        onWidgetDetected(type, {
          url: url || altOrSrc,
          alt: type === 'github-stats' ? altOrSrc : undefined,
          fullMatch,
          type
        });
      }
    });
  }, [enhancedWidgetRendering, onWidgetDetected]);


  const prepareGithubCompatibleContent = (input: string) => {
    return githubCompatible ? convertToGitHubCompatible(input) : input;
  };

  const processedContent = useMemo(() => {
    return githubCompatible ? prepareGithubCompatibleContent(content) : content;
  }, [content, githubCompatible]);

  // GitHub-compatible sanitization schema
  const sanitizeSchema = useMemo(() => ({
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'div', 'span', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img',
      'details', 'summary',
      'sup', 'sub',
      'kbd'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'table': ['align'],
      'th': ['align'],
      'td': ['align'],
      'div': ['align'],
      'p': ['align'],
      'details': ['open']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      'img': ['http', 'https', 'data']
    }
  }), []);

  if (isLoading) {
    return (
      <div className={`markdown-renderer ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Generate container classes based on containerStyle
  const getContainerClasses = () => {
    switch (containerStyle) {
      case 'fixed':
        return `markdown-renderer fixed inset-0 w-screen h-screen overflow-auto bg-gray-50 dark:bg-gray-900 ${className}`;
      case 'embedded':
        return `markdown-renderer w-full ${className}`;
      case 'responsive':
      default:
        return `markdown-renderer w-full max-w-none ${className}`;
    }
  };

  const getContentClasses = () => {
    const baseMaxWidth = maxWidth === '5xl' ? 'max-w-5xl' : 
                        maxWidth === '4xl' ? 'max-w-4xl' :
                        maxWidth === '3xl' ? 'max-w-3xl' :
                        maxWidth === '2xl' ? 'max-w-2xl' :
                        maxWidth === 'xl' ? 'max-w-xl' :
                        maxWidth === 'full' ? 'max-w-none' : 'max-w-5xl';
    
    switch (containerStyle) {
      case 'fixed':
        return `${baseMaxWidth} mx-auto my-8 px-4`;
      case 'embedded':
        return `w-full`;
      case 'responsive':
      default:
        return `${baseMaxWidth} mx-auto px-4 py-6`;
    }
  };

  const getCardClasses = () => {
    switch (containerStyle) {
      case 'embedded':
        return '';
      case 'fixed':
      case 'responsive':
      default:
        return 'bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm';
    }
  };

  const getPaddingClasses = () => {
    switch (containerStyle) {
      case 'embedded':
        return 'prose dark:prose-invert max-w-none prose-lg prose-gray dark:prose-slate';
      case 'fixed':
      case 'responsive':
      default:
        return 'p-8 prose dark:prose-invert max-w-none prose-lg prose-gray dark:prose-slate';
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div className={getContentClasses()}>
        <div className={getCardClasses()}>
          <div className={getPaddingClasses()}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, ...(enableMath ? [remarkMath] : [])]}
              rehypePlugins={[
                [rehypeRaw, { passThrough: [] }], 
                [rehypeSanitize, sanitizeSchema],
                ...(enableMath ? [rehypeKatex] : [])
              ]}
              components={{                // Enhanced code block component with proper syntax highlighting
                code: ({ node, inline, className, children, ...props }: CodeBlockProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const codeContent = String(children).replace(/\n$/, '');
                  
                  if (!inline && language) {
                    return (
                      <div className="my-6 relative not-prose">
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm font-mono text-gray-700 dark:text-gray-300 rounded-t-md border border-gray-200 dark:border-gray-700 border-b-0">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{language}</span>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(codeContent);
                                // Could add toast notification here
                              } catch (err) {
                                console.warn('Failed to copy code:', err);
                              }
                            }}
                            className="text-xs px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            title="Copy code"
                          >
                            Copy
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={isDarkTheme ? oneDark : oneLight}
                          language={language}
                          PreTag="div"
                          className="!mt-0 !rounded-t-none border border-t-0 border-gray-200 dark:border-gray-700"
                          showLineNumbers={showLineNumbers}
                          lineNumberStyle={{
                            minWidth: '3em',
                            paddingRight: '1em',
                            textAlign: 'right',
                            userSelect: 'none',
                            color: isDarkTheme ? '#6b7280' : '#9ca3af',
                          }}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0 0 0.375rem 0.375rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                            backgroundColor: isDarkTheme ? '#1f2937' : '#f9fafb',
                          }}
                          {...props}
                        >
                          {codeContent}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  
                  return (
                    <code 
                      className={`${className || ''} px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-sm border border-gray-200 dark:border-gray-700`} 
                      {...props}
                    >
                      {children}
                    </code>
                  );                },                // Enhanced image component with GitHub-compatible features and widget detection
                img: ({ src, alt, title, ...props }: ImageProps) => {
                  if (!src) return null;
                  
                  // Handle Blob objects by converting to string or skipping
                  const srcString = typeof src === 'string' ? src : '';
                  if (!srcString) return null;
                    const isAbsoluteUrl = srcString.startsWith('http://') || srcString.startsWith('https://');
                  const isDataUrl = srcString.startsWith('data:');
                  const isGitHubStats = srcString.includes('/api/github-stats-svg') || 
                                     srcString.includes('github-readme-stats');
                  const isRepoShowcase = srcString.includes('/api/repo-showcase');
                  const isTypingAnimation = srcString.includes('/api/typing-animation');
                  const isWaveAnimation = srcString.includes('/api/wave-animation');
                  const isLanguageChart = srcString.includes('/api/language-chart');
                  const isAnimatedProgress = srcString.includes('/api/animated-progress');
                  const isContributionGraph = srcString.includes('github-readme-activity-graph') || 
                                            srcString.includes('contribution-graph');
                  
                  // Widget detection for enhanced rendering
                  if (enhancedWidgetRendering && onWidgetDetected) {
                    if (isGitHubStats) {
                      onWidgetDetected('github-stats', { src: srcString, alt, title });
                    } else if (isRepoShowcase) {
                      onWidgetDetected('repository-showcase', { src: srcString, alt, title });
                    } else if (isTypingAnimation) {
                      onWidgetDetected('typing-animation', { src: srcString, alt, title });
                    } else if (isWaveAnimation) {
                      onWidgetDetected('wave-animation', { src: srcString, alt, title });
                    } else if (isLanguageChart) {
                      onWidgetDetected('language-chart', { src: srcString, alt, title });
                    } else if (isAnimatedProgress) {
                      onWidgetDetected('animated-progress', { src: srcString, alt, title });
                    } else if (isContributionGraph) {
                      onWidgetDetected('contribution-graph', { src: srcString, alt, title });
                    }
                  }
                  
                  const isBadge = 
                    srcString.includes('img.shields.io') ||
                    srcString.includes('badge/') ||
                    srcString.includes('badges.') ||
                    (srcString.includes('github.com') && srcString.includes('badge')) ||
                    (alt && ['badge', 'shield', 'stars', 'license', 'version', 'build'].some(term => 
                      alt.toLowerCase().includes(term)
                    ));                    // GitHub-style image handling
                  const imageProps = {
                    src: srcString,
                    alt: alt || '',
                    title,
                    unoptimized: !!(isAbsoluteUrl || isDataUrl || isGitHubStats || isBadge || isRepoShowcase || isTypingAnimation || isWaveAnimation || isLanguageChart || isAnimatedProgress), // Ensure boolean with double negation
                    className: `${isBadge ? '' : 'rounded-md'} max-w-full h-auto ${(isGitHubStats || isRepoShowcase) && !isBadge ? 'border border-gray-200 dark:border-gray-700' : ''}`,
                  };                  // Determine dimensions based on image type
                  let dimensions = { width: 800, height: 400 };
                  if (isGitHubStats) {
                    if (isBadge) {
                      dimensions = { width: 150, height: 28 };
                    } else if (srcString.includes('github-readme-stats') || srcString.includes('/api/github-stats-svg')) {
                      dimensions = { width: 495, height: 195 };
                    }
                  } else if (isRepoShowcase) {
                    // Repository showcase dimensions - extract from URL params if possible
                    try {
                      const url = new URL(srcString, window.location.origin);
                      const cardWidth = parseInt(url.searchParams.get('cardWidth') || '400');
                      const cardHeight = parseInt(url.searchParams.get('cardHeight') || '200');
                      const layout = url.searchParams.get('layout') || 'single';
                      
                      let displayWidth = cardWidth;
                      let displayHeight = cardHeight;
                      
                      switch (layout) {
                        case 'grid-2x1':
                          displayWidth = cardWidth * 2 + 10;
                          break;
                        case 'grid-2x2':
                          displayWidth = cardWidth * 2 + 10;
                          displayHeight = cardHeight * 2 + 10;
                          break;
                        case 'grid-3x1':
                          displayWidth = cardWidth * 3 + 20;
                          break;
                        case 'list':
                          const repos = url.searchParams.get('repos')?.split(',') || [];
                          const repoLimit = parseInt(url.searchParams.get('repoLimit') || '6');
                          displayHeight = cardHeight * Math.min(repos.length, repoLimit) + (Math.min(repos.length, repoLimit) - 1) * 10;
                          break;
                      }
                      
                      dimensions = { width: displayWidth, height: displayHeight };
                    } catch {
                      dimensions = { width: 400, height: 200 }; // Fallback
                    }
                  } else if (isTypingAnimation) {
                    try {
                      const url = new URL(srcString, window.location.origin);
                      const width = parseInt(url.searchParams.get('width') || '600');
                      const height = parseInt(url.searchParams.get('height') || '100');
                      dimensions = { width, height };
                    } catch {
                      dimensions = { width: 600, height: 100 };
                    }
                  } else if (isWaveAnimation) {
                    try {
                      const url = new URL(srcString, window.location.origin);
                      const width = parseInt(url.searchParams.get('width') || '800');
                      const height = parseInt(url.searchParams.get('height') || '200');
                      dimensions = { width, height };
                    } catch {
                      dimensions = { width: 800, height: 200 };
                    }
                  } else if (isLanguageChart) {
                    try {
                      const url = new URL(srcString, window.location.origin);
                      const size = parseInt(url.searchParams.get('size') || '300');
                      dimensions = { width: size, height: size };
                    } catch {
                      dimensions = { width: 300, height: 300 };
                    }
                  } else if (isAnimatedProgress) {
                    try {
                      const url = new URL(srcString, window.location.origin);
                      const width = parseInt(url.searchParams.get('width') || '500');
                      const height = parseInt(url.searchParams.get('height') || '300');
                      dimensions = { width, height };
                    } catch {
                      dimensions = { width: 500, height: 300 };
                    }
                  } else if (isBadge) {
                    // Standard badges have these dimensions
                    dimensions = { width: 120, height: 20 };
                    
                    // Attempt to estimate badge width based on alt text
                    if (alt) {
                      // Approximate width based on text length (conservative estimate)
                      const estimatedWidth = Math.min(Math.max(alt.length * 7, 80), 250);
                      dimensions = { width: estimatedWidth, height: 20 };
                    }
                  }

                  // Use inline styling for badges to ensure proper rendering
                  const containerClassName = isBadge 
                    ? "inline-flex mx-1 my-1" 
                    : "my-4 text-center";

                  return (
                    <div className={containerClassName}>                      <div className={`${isBadge ? 'inline-block' : 'inline-block relative'}`}>
                        <Image
                          {...imageProps}
                          {...dimensions}
                          alt={alt || ''}
                          style={{ 
                            maxWidth: '100%',
                            height: 'auto'
                          }}
                          onError={(e) => {
                            // Fallback for failed images
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'bg-gray-200 dark:bg-gray-700 rounded-md p-4 text-gray-500 dark:text-gray-400 text-center text-sm';
                            fallback.textContent = `Failed to load image: ${alt || srcString}`;
                            target.parentNode?.appendChild(fallback);
                          }}
                        />
                        {title && !isBadge && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                            {title}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                },                a: ({ href, children, ...props }: LinkProps) => {
                  if (!href) return <span>{children}</span>;
                  
                  const isExternal = href.startsWith('http://') || href.startsWith('https://');
                  const isEmail = href.startsWith('mailto:');
                  const isInternal = href.startsWith('/') || href.startsWith('#');                  // Check if this link contains an image (for profile badges, etc.)
                  const hasImage = React.Children.toArray(children).some(child => {
                    if (!React.isValidElement(child)) return false;
                    if (child.type === 'img') return true;
                    if (typeof child.type === 'function' && child.props && typeof child.props === 'object' && 'src' in child.props) {
                      return true;
                    }
                    return false;
                  });
                  
                  // Base link classes without underline for image links
                  const baseLinkClasses = hasImage 
                    ? "inline-block hover:opacity-80 transition-opacity"
                    : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-1 underline-offset-2 transition-colors";
                  
                  if (isExternal || isEmail) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={baseLinkClasses}
                        {...props}
                      >
                        {children}
                        {isExternal && !githubCompatible && !hasImage && (
                          <span className="inline-block ml-1 text-xs">
                            ↗
                          </span>
                        )}
                      </a>
                    );
                  }
                  
                  if (isInternal) {
                    return (
                      <Link 
                        href={href}
                        className={baseLinkClasses}
                        {...props}
                      >
                        {children}
                      </Link>
                    );
                  }
                  
                  return <span className="text-gray-500">{children}</span>;
                },

                // Enhanced table components with GitHub styling
                table: ({ children, ...props }: TableProps) => (
                  <div className="overflow-x-auto my-6">
                    <table 
                      className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-md"
                      {...props}
                    >
                      {children}
                    </table>
                  </div>
                ),
                
                thead: ({ children, ...props }) => (
                  <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
                    {children}
                  </thead>
                ),
                
                th: ({ children, ...props }) => (
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600"
                    {...props}
                  >
                    {children}
                  </th>
                ),
                
                td: ({ children, ...props }) => (
                  <td 
                    className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
                    {...props}
                  >
                    {children}
                  </td>
                ),

                // Enhanced blockquote with GitHub styling
                blockquote: ({ children, ...props }) => (
                  <blockquote 
                    className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800/50 rounded-r-md"
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),                // Enhanced task list items with GitHub-style checkboxes
                li: ({ children, ...props }) => {
                  const content = React.Children.toArray(children);
                  const firstChild = content[0];
                  
                  // Check if this is a task list item
                  if (typeof firstChild === 'string') {
                    const taskMatch = firstChild.match(/^\[( |x|X)\]\s*(.*)/);
                    if (taskMatch) {
                      const [, checked, text] = taskMatch;
                      const isChecked = checked.toLowerCase() === 'x';
                      
                      return (
                        <li className="list-none flex items-start gap-2 py-1" {...props}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`${isChecked ? 'line-through text-gray-500 dark:text-gray-400' : ''} leading-relaxed`}>
                            {text}
                            {content.slice(1)}
                          </span>
                        </li>
                      );
                    }
                  }
                  
                  return (
                    <li className="py-1" {...props}>
                      {children}
                    </li>
                  );
                },

                details: ({ children, ...props }) => (
                  <details 
                    className="my-4 border border-gray-200 dark:border-gray-700 rounded-md"
                    {...props}
                  >
                    {children}
                  </details>
                ),
                
                summary: ({ children, ...props }) => (
                  <summary 
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-md border-b border-gray-200 dark:border-gray-700 font-medium"
                    {...props}
                  >
                    {children}
                  </summary>
                ),                // Enhanced headings with GitHub-style formatting and optional anchor links
                h1: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h1 
                      id={headingId}
                      className="text-4xl font-bold mb-6 mt-10 pb-3 border-b border-gray-200 dark:border-gray-700 group relative"
                      {...props}
                    >
                      {children}
                      {headingId && showAnchorLinks && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 no-underline"
                          aria-label="Direct link to heading"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(headingId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', `#${headingId}`);
                            }
                          }}
                        >
                          #
                        </a>
                      )}
                    </h1>
                  );
                },                h2: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h2 
                      id={headingId}
                      className="text-3xl font-bold mb-5 mt-8 pb-2 border-b border-gray-200 dark:border-gray-700 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && showAnchorLinks && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 no-underline"
                          aria-label="Direct link to heading"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(headingId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', `#${headingId}`);
                            }
                          }}
                        >
                          #
                        </a>
                      )}
                    </h2>
                  );
                },                h3: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h3 
                      id={headingId}
                      className="text-2xl font-bold mb-4 mt-6 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && showAnchorLinks && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 no-underline"
                          aria-label="Direct link to heading"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(headingId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', `#${headingId}`);
                            }
                          }}                        >
                          #
                        </a>
                      )}
                    </h3>
                  );
                },                h4: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h4 
                      id={headingId}
                      className="text-xl font-bold mb-3 mt-5 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && showAnchorLinks && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 no-underline text-sm"
                          aria-label="Direct link to heading"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(headingId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', `#${headingId}`);
                            }
                          }}
                        >
                          #
                        </a>
                      )}
                    </h4>
                  );
                },                h5: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h5 
                      id={headingId}
                      className="text-lg font-bold mb-2 mt-4 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && showAnchorLinks && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 no-underline text-sm"
                          aria-label="Direct link to heading"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(headingId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', `#${headingId}`);
                            }
                          }}
                        >
                          #
                        </a>
                      )}                    </h5>
                  );
                },                h6: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h6 
                      id={headingId}
                      className="text-base font-bold mb-2 mt-3 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && showAnchorLinks && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 no-underline text-sm"
                          aria-label="Direct link to heading"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(headingId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', `#${headingId}`);
                            }
                          }}
                        >
                          #
                        </a>
                      )}
                    </h6>
                  );
                },

                // Enhanced horizontal rule
                hr: ({ ...props }) => (
                  <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" {...props} />
                ),

                // Enhanced paragraphs
                p: ({ children, ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props}>
                    {children}
                  </p>
                ),
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownRenderer;
