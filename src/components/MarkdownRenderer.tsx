'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import { convertToGitHubCompatible } from '@/utils/inlineStylesConverter';

// Types for react-markdown component props
type CodeBlockProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  githubCompatible?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  githubCompatible = true
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Check for dark mode preference and apply it
  useEffect(() => {
    // Check initial dark mode setting
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkTheme(isDark);
    
    // Set up an observer to track theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkTheme(isDark);
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Prepare the content with GitHub-compatible approach
  const prepareGithubCompatibleContent = (content: string): string => {
    let processedContent = content;
    
    // Handle HTML elements for GitHub compatibility
    // Remove style and class attributes (which GitHub sanitizes)
    processedContent = processedContent.replace(/<([a-z][a-z0-9]*)\s+class="[^"]*">/gi, '<$1>');
    processedContent = processedContent.replace(/<([a-z][a-z0-9]*)\s+style="[^"]*">/gi, '<$1>');
    processedContent = processedContent.replace(/<([a-z][a-z0-9]*)\s+id="[^"]*">/gi, '<$1>');
    
    try {
      // Apply additional GitHub-compatible formatting from utility
      processedContent = convertToGitHubCompatible(processedContent);
    } catch (error) {
      console.error('Error converting to GitHub compatible format:', error);
    }
    
    return processedContent;
  };
  
  // The final content to render
  const renderedContent = githubCompatible ? prepareGithubCompatibleContent(content) : content;
    return (
    <div className={`markdown-renderer fixed inset-0 w-screen h-screen overflow-auto bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className={`max-w-5xl mx-auto my-8 px-4`}>
        <div className={`bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm`}>
          <div className={`p-8 prose dark:prose-invert max-w-none`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeRaw, { passThrough: [] }], rehypeSanitize]}
              components={{
                code: ({ node, inline, className, children, ...props }: CodeBlockProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={isDarkTheme ? vscDarkPlus : oneLight}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactNode => {
                  if (typeof src === 'string') {
                    const isAbsoluteUrl = src.startsWith('http://') || src.startsWith('https://');
                    const isGitHubStats = src.includes('/api/github-stats-svg');
                    
                    // Use specific dimensions for GitHub stats SVG
                    const dimensions = isGitHubStats ? {
                      width: 495,
                      height: 195
                    } : {
                      width: 700,
                      height: 350
                    };
                    
                    return (
                      <div className="inline-block" style={{ maxWidth: '100%' }}>
                        <Image
                          src={src}
                          alt={alt || ''}
                          {...dimensions}
                          unoptimized={true}
                          style={{ 
                            maxWidth: '100%',
                            height: 'auto'
                          }}
                          className={`rounded-md ${isGitHubStats ? 'mt-2 mb-4' : ''}`}
                          priority={isGitHubStats}
                        />
                      </div>
                    );
                  }
                  return null;
                },
                
                table({ children, ...props }) {
                  return (
                    <table {...props}>
                      {children}
                    </table>
                  );
                },
                
                th({ children, ...props }) {
                  return (
                    <th {...props}>
                      {children}
                    </th>
                  );
                },
                
                td({ children, ...props }) {
                  return (
                    <td {...props}>
                      {children}
                    </td>
                  );
                },
              }}
            >
              {renderedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownRenderer;
