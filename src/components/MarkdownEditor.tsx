'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  height?: string;
  showPreview?: boolean;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = '',
  onChange,
  height = '300px',
  showPreview = true,
  placeholder = 'Enter markdown here...'
}) => {
  const [value, setValue] = useState(initialValue);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  // Format functions for toolbar
  const insertFormatting = (startChars: string, endChars: string, defaultText: string) => {
    const textArea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    
    if (!textArea) return;
    
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    
    const newText = selectedText 
      ? beforeText + startChars + selectedText + endChars + afterText
      : beforeText + startChars + defaultText + endChars + afterText;
    
    setValue(newText);
    onChange?.(newText);
    
    // Set focus back to textarea after formatting
    setTimeout(() => {
      textArea.focus();
      if (!selectedText) {
        const newCursorPos = start + startChars.length;
        textArea.setSelectionRange(newCursorPos, newCursorPos + defaultText.length);
      }
    }, 0);
  };

  const formatBold = () => insertFormatting('**', '**', 'bold text');
  const formatItalic = () => insertFormatting('*', '*', 'italic text');
  const formatCode = () => insertFormatting('`', '`', 'code');
  const formatCodeBlock = () => insertFormatting('\n```\n', '\n```\n', 'code block');
  const formatHeading1 = () => insertFormatting('# ', '', 'Heading 1');
  const formatHeading2 = () => insertFormatting('## ', '', 'Heading 2');
  const formatHeading3 = () => insertFormatting('### ', '', 'Heading 3');
  const formatLink = () => insertFormatting('[', '](https://example.com)', 'link text');
  const formatImage = () => insertFormatting('![', '](https://example.com/image.png)', 'alt text');
  const formatList = () => insertFormatting('\n- ', '', 'list item');
  const formatNumberedList = () => insertFormatting('\n1. ', '', 'list item');
  const formatQuote = () => insertFormatting('\n> ', '', 'quote');
  const formatHorizontalRule = () => insertFormatting('\n\n---\n\n', '', '');
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
        <button 
          onClick={formatBold}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        <button 
          onClick={formatItalic}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <button 
          onClick={formatHeading1}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Heading 1"
        >
          H1
        </button>
        <button 
          onClick={formatHeading2}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Heading 2"
        >
          H2
        </button>
        <button 
          onClick={formatHeading3}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Heading 3"
        >
          H3
        </button>
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        <button 
          onClick={formatLink}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
        <button 
          onClick={formatImage}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        <button 
          onClick={formatCode}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Inline Code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
        <button 
          onClick={formatCodeBlock}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Code Block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="10" y1="12" x2="14" y2="12"></line>
            <line x1="8" y1="16" x2="16" y2="16"></line>
          </svg>
        </button>
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        <button 
          onClick={formatList}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        <button 
          onClick={formatNumberedList}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
        <button 
          onClick={formatQuote}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Quote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
          </svg>
        </button>
        <button 
          onClick={formatHorizontalRule}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Horizontal Rule"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {showPreview && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex">
          <button 
            onClick={() => setActiveTab('write')} 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'write' 
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Write
          </button>
          <button 
            onClick={() => setActiveTab('preview')} 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'preview' 
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Preview
          </button>
        </div>
      )}

      <div className={`${activeTab === 'write' ? 'block' : 'hidden'}`}>
        <textarea
          id="markdown-editor"
          className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 font-mono"
          style={{ height, resize: 'vertical' }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        ></textarea>
      </div>

      {showPreview && (
        <div className={`${activeTab === 'preview' ? 'block' : 'hidden'} overflow-auto bg-white dark:bg-gray-900`} style={{ height }}>
          <div className="p-4 prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || '*Preview will appear here*'}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Word count */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <div>
          {value.length} characters
        </div>
        <div>
          {value.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
