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
import 'katex/dist/katex.min.css';
import { convertToGitHubCompatible } from '@/utils/inlineStylesConverter';

// Import markdown-grid styles
import '../styles/markdown-grid-new.css';

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
          <div className={`p-8 font-[system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji] text-[16px] prose dark:prose-invert max-w-none 
            prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 
            prose-headings:pb-2 prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl 
            prose-headings:scroll-mt-20 prose-img:my-8 prose-img:rounded-md
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:font-normal hover:prose-a:underline
            prose-p:leading-relaxed prose-p:my-4 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
            dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic 
            prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:font-normal
            prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-gray-100 dark:prose-code:bg-gray-800
            prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-pre:p-0 prose-pre:rounded-md
            prose-hr:border-gray-200 dark:prose-hr:border-gray-800 markdown-grid-layout`}
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
                
                img: ({ src, alt, ...props }) => {
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
