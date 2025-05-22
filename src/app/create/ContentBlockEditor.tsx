'use client';

import React, { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';

interface ContentBlockEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  layout?: 'flow' | 'inline' | 'grid';
  onLayoutChange?: (layout: 'flow' | 'inline' | 'grid') => void;
  username?: string;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  initialContent,
  onChange,
  layout = 'flow',
  onLayoutChange,
  username = 'yourusername'
}) => {
  const [content, setContent] = useState(initialContent);
  const [currentLayout, setCurrentLayout] = useState<'flow' | 'inline' | 'grid'>(layout);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  const handleLayoutChange = (newLayout: 'flow' | 'inline' | 'grid') => {
    setCurrentLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };
  
  // layout options for text alignment
  const applyTextAlignment = (alignment: 'left' | 'center' | 'right') => {
    // Get selected text or add alignment to whole content
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newContent = content;
    if (selectedText) {
      // Apply alignment to selected text only
      const alignedText = `<div align="${alignment}">\n\n${selectedText}\n\n</div>`;
      newContent = content.substring(0, start) + alignedText + content.substring(end);
    } else {
      // Apply alignment to whole content if nothing selected
      newContent = `<div align="${alignment}">\n\n${content}\n\n</div>`;
    }
    
    handleChange(newContent);
  };

  // inset image
  // future impl: add a custom popup here
  const insertImage = () => {
    const url = prompt('Enter image URL:', 'https://example.com/image.jpg');
    if (!url) return;
    
    const alt = prompt('Enter image description:', 'Image description');
    const imageMarkdown = `![${alt}](${url})`;
    
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
    
    handleChange(newContent);
  };

  return (
    <div className="content-block-editor rounded-lg overflow-hidden">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 p-2 flex flex-wrap gap-1">
          <div className="flex items-center mr-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">Alignment:</div>
            <div className="flex gap-1">
              <button 
                onClick={() => applyTextAlignment('left')} 
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Align Left"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h12" />
                </svg>
              </button>
              <button 
                onClick={() => applyTextAlignment('center')} 
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Align Center"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M7 18h10" />
                </svg>
              </button>
              <button 
                onClick={() => applyTextAlignment('right')} 
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Align Right"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M8 18h12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-center mr-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">Layout:</div>
            <div className="flex gap-1">
              <button 
                onClick={() => handleLayoutChange('flow')} 
                className={`p-1 rounded ${currentLayout === 'flow' ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                title="Flow Layout"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button 
                onClick={() => handleLayoutChange('grid')} 
                className={`p-1 rounded ${currentLayout === 'grid' ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                title="Grid Layout"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
              <button 
                onClick={() => handleLayoutChange('inline')} 
                className={`p-1 rounded ${currentLayout === 'inline' ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                title="Side by Side Layout"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            onClick={insertImage}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300"
            title="Insert Image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Insert Image</span>
          </button>
        </div>

        <MarkdownEditor 
          initialValue={content} 
          onChange={handleChange} 
          height="400px" 
          showPreview
          placeholder="Write your content here using Markdown..."
          className=""
        />
      </div>
    </div>
  );
};

export default ContentBlockEditor;
