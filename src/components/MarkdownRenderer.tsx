'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose dark:prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node, ...props }) => {
            // Handle GitHub stats and other SVG images
            if (props.src && (
              props.src.includes('github-readme-stats.vercel.app') || 
              props.src.includes('github-profile-trophy.vercel.app') ||
              props.src.includes('github-readme-streak-stats.herokuapp.com')
            )) {
              return (
                <div className="my-4">
                  <Image
                    src={props.src}
                    alt={props.alt || 'GitHub stats'}
                    width={500}
                    height={200}
                    className="rounded-md"
                    unoptimized={true}
                  />
                </div>
              );
            }
            
            // Default image handling
            return <img {...props} className="rounded-md max-w-full" />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
