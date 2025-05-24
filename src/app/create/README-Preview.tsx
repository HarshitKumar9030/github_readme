'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface ReadmePreviewProps {
  content: string;
  onClose: () => void;
  onCopy: () => void;
  liveMode?: boolean;
  onLiveModeToggle?: (enabled: boolean) => void;
}

export default function ReadmePreview({ content, onClose, onCopy, liveMode = false, onLiveModeToggle }: ReadmePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    setCopyStatus('copying');
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus('copied');
      onCopy();
      
      // Reset status after 2 seconds
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
      setCopyStatus('idle');
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 flex items-center justify-center z-50">
      <motion.div 
        className={`bg-white dark:bg-gray-800 ${
          isFullscreen 
            ? 'h-full w-full max-w-[100vw] max-h-[100vh]' 
            : 'h-[90vh] w-[95vw] max-w-7xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700'
        } overflow-hidden relative flex flex-col`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              README Preview
            </h2>
              {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Raw Markdown
              </button>
            </div>

            {/* Live Mode Toggle */}
            {onLiveModeToggle && (
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={liveMode}
                    onChange={(e) => onLiveModeToggle(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${liveMode ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    Live Updates
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
            
            <button
              onClick={downloadMarkdown}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              title="Download as README.md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            <button
              onClick={handleCopy}
              disabled={copyStatus === 'copying'}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                copyStatus === 'copied'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50`}
            >
              {copyStatus === 'copying' ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : copyStatus === 'copied' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
              {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'copying' ? 'Copying...' : 'Copy'}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              title="Close preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'preview' ? (
            <div 
              ref={contentRef}
              className="h-full overflow-auto bg-white dark:bg-gray-900"
            >
              <div className="max-w-4xl mx-auto p-6">                <MarkdownRenderer 
                  content={content} 
                  className="w-full"
                  showAnchorLinks={false}
                />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
              <pre className="p-6 text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                {content}
              </pre>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>{content.length} characters</span>
              <span>{content.split('\n').length} lines</span>
              <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Live Preview
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
