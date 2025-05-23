'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  githubCompatible = true,
  showLineNumbers = false,
  enableMath = false
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
  // Prepare the content with GitHub-compatible approach
  const prepareGithubCompatibleContent = useMemo(() => {
    return (content: string): string => {
      if (!content) return '';
      
      let processedContent = content.trim();
      
      try {
        // Normalize line endings to match GitHub's rendering
        processedContent = processedContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Handle HTML elements for GitHub compatibility
        // Remove dangerous attributes that GitHub sanitizes
        processedContent = processedContent.replace(/<([a-z][a-z0-9]*)\s+class="[^"]*"/gi, '<$1');
        processedContent = processedContent.replace(/<([a-z][a-z0-9]*)\s+style="[^"]*"/gi, '<$1');
        processedContent = processedContent.replace(/<([a-z][a-z0-9]*)\s+id="[^"]*"/gi, '<$1');
        processedContent = processedContent.replace(/<([a-z][a-z0-9]*)\s+onclick="[^"]*"/gi, '<$1');
        
        // Fix div alignment (GitHub specific)
        processedContent = processedContent.replace(/<div\s+align="([^"]*)">/gi, '<div align="$1">');
        
        // Ensure proper spacing around block elements
        processedContent = processedContent.replace(/(<\/div>)(?!\n)/gi, '$1\n');
        processedContent = processedContent.replace(/(<div[^>]*>)(?!\n)/gi, '$1\n');
        processedContent = processedContent.replace(/(<\/p>)(?!\n)/gi, '$1\n');
        processedContent = processedContent.replace(/(<p[^>]*>)(?!\n)/gi, '$1\n');
        
        // Fix badge and image spacing for GitHub compatibility
        processedContent = processedContent.replace(/(\]\([^)]+\))\s+(\[!\[)/g, '$1 $2');
        processedContent = processedContent.replace(/(\]\([^)]+\))\n+(\[!\[)/g, '$1\n\n$2');
        
        // Ensure proper table formatting with GitHub standards
        processedContent = processedContent.replace(/\|\s*\|/g, '| |');
        processedContent = processedContent.replace(/\|([^|\n]+)\|/g, (match, content) => {
          return `| ${content.trim()} |`;
        });
          // Fix heading spacing (GitHub requires blank lines)
        processedContent = processedContent.replace(/\n(#{1,6}\s[^\n]+)\n(?!\n)/g, '\n$1\n\n');
        processedContent = processedContent.replace(/(?<!\n\n)(#{1,6}\s[^\n]+)/g, '\n\n$1');
        
        // Make sure heading formatting is correct and properly spaced
        // This regex processes each heading and ensures it has the correct number of # characters
        processedContent = processedContent.replace(/(^|\n)(#{1,6})(\s+)([^\n]+)/g, (match, start, hashes, space, text) => {
          // Ensure exactly one space between # and content
          return `${start}${hashes} ${text.trim()}`;
        });
        
        // Properly format headings by removing any HTML or excess formatting
        processedContent = processedContent.replace(/(^|\n)(#{1,6}\s)(.+?)(\s*#*\s*)$/gm, (match, start, prefix, content, end) => {
          return `${start}${prefix}${content.trim()}`;
        });
        
        // Ensure proper list formatting
        processedContent = processedContent.replace(/\n([*+-]\s)/g, '\n\n$1');
        processedContent = processedContent.replace(/\n(\d+\.\s)/g, '\n\n$1');
        
        // Clean up extra whitespace but preserve intentional spacing
        processedContent = processedContent.replace(/\n{3,}/g, '\n\n');
        processedContent = processedContent.replace(/^\n+/, '');
        processedContent = processedContent.replace(/\n+$/, '\n');
        
        // Fix inline code formatting (backticks)
        processedContent = processedContent.replace(/([^`])`([^`\n]+)`([^`])/g, '$1`$2`$3');
        
        // Apply additional GitHub-compatible formatting from utility
        processedContent = convertToGitHubCompatible(processedContent);
      } catch (error) {
        console.warn('Error converting to GitHub compatible format:', error);
        // Return original content if processing fails
        return content.trim();
      }
      
      return processedContent;
    };
  }, []);

  // Memoize the processed content to avoid unnecessary re-computations
  const processedContent = useMemo(() => {
    return githubCompatible ? prepareGithubCompatibleContent(content) : content;
  }, [content, githubCompatible, prepareGithubCompatibleContent]);

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
  }  return (
    <div className={`markdown-renderer fixed inset-0 w-screen h-screen overflow-auto bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="max-w-5xl mx-auto my-8 px-4">
        <div className="bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm">
          <div className="p-8 prose dark:prose-invert max-w-none prose-lg prose-gray dark:prose-slate">
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
                  );
                },                // Enhanced image component with GitHub-compatible features
                img: ({ src, alt, title, ...props }: ImageProps) => {
                  if (!src) return null;
                  
                  // Handle Blob objects by converting to string or skipping
                  const srcString = typeof src === 'string' ? src : '';
                  if (!srcString) return null;
                  
                  const isAbsoluteUrl = srcString.startsWith('http://') || srcString.startsWith('https://');
                  const isDataUrl = srcString.startsWith('data:');
                  const isGitHubStats = srcString.includes('/api/github-stats-svg') || 
                                     srcString.includes('github-readme-stats');
                  
                  const isBadge = 
                    srcString.includes('img.shields.io') ||
                    srcString.includes('badge/') ||
                    srcString.includes('badges.') ||
                    (srcString.includes('github.com') && srcString.includes('badge')) ||
                    (alt && ['badge', 'shield', 'stars', 'license', 'version', 'build'].some(term => 
                      alt.toLowerCase().includes(term)
                    ));
                    // GitHub-style image handling
                  const imageProps = {
                    src: srcString,
                    alt: alt || '',
                    title,
                    unoptimized: !!(isAbsoluteUrl || isDataUrl || isGitHubStats || isBadge), // Ensure boolean with double negation
                    className: `${isBadge ? '' : 'rounded-md'} max-w-full h-auto ${isGitHubStats && !isBadge ? 'border border-gray-200 dark:border-gray-700' : ''}`,
                  };

                  // Determine dimensions based on image type
                  let dimensions = { width: 800, height: 400 };
                  if (isGitHubStats) {
                    if (isBadge) {
                      dimensions = { width: 150, height: 28 };
                    } else if (srcString.includes('github-readme-stats') || srcString.includes('/api/github-stats-svg')) {
                      dimensions = { width: 495, height: 195 };
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
                    <div className={containerClassName}>
                      <div className={`${isBadge ? 'inline-block' : 'inline-block relative'}`}>
                        <Image
                          {...imageProps}
                          {...dimensions}
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
                },

                a: ({ href, children, ...props }: LinkProps) => {
                  if (!href) return <span>{children}</span>;
                  
                  const isExternal = href.startsWith('http://') || href.startsWith('https://');
                  const isEmail = href.startsWith('mailto:');
                  const isInternal = href.startsWith('/') || href.startsWith('#');
                  
                  if (isExternal || isEmail) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-1 underline-offset-2 transition-colors"
                        {...props}
                      >
                        {children}
                        {isExternal && (
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
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-1 underline-offset-2 transition-colors"
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
                      {headingId && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Direct link"
                        >
                          #
                        </a>
                      )}
                    </h1>
                  );
                },
                h2: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h2 
                      id={headingId}
                      className="text-3xl font-bold mb-5 mt-8 pb-2 border-b border-gray-200 dark:border-gray-700 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Direct link"
                        >
                          #
                        </a>
                      )}
                    </h2>
                  );
                },
                h3: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h3 
                      id={headingId}
                      className="text-2xl font-bold mb-4 mt-6 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Direct link"
                        >
                          #
                        </a>
                      )}
                    </h3>
                  );
                },
                h4: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h4 
                      id={headingId}
                      className="text-xl font-bold mb-3 mt-5 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                          aria-label="Direct link"
                        >
                          #
                        </a>
                      )}
                    </h4>
                  );
                },
                h5: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h5 
                      id={headingId}
                      className="text-lg font-bold mb-2 mt-4 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                          aria-label="Direct link"
                        >
                          #
                        </a>
                      )}
                    </h5>
                  );
                },
                h6: ({ children, id, ...props }) => {
                  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined);
                  return (
                    <h6 
                      id={headingId}
                      className="text-base font-bold mb-2 mt-3 group relative" 
                      {...props}
                    >
                      {children}
                      {headingId && (
                        <a 
                          href={`#${headingId}`} 
                          className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                          aria-label="Direct link"
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
