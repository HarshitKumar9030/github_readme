'use client';

import { motion } from 'framer-motion';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface ReadmePreviewProps {
  content: string;
  onClose: () => void;
  onCopy: () => void;
}

export default function ReadmePreview({ content, onClose, onCopy }: ReadmePreviewProps) {
  return (
    <div className="fixed inset-0 bg-gray-800/50 dark:bg-black/70 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white dark:bg-gray-800 h-full w-full max-w-[100vw] max-h-[100vh] overflow-hidden relative markdown-preview-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >{/* GitHub-style Markdown Renderer */}
        <MarkdownRenderer 
          content={content} 
          className="w-full h-full overflow-auto"
        />
        
        <div className="absolute top-14 z-100 right-6 flex gap-2">
          <button 
            className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white shadow-lg"
            onClick={onClose}
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="absolute bottom-6 right-6 flex gap-2">
          <button 
            className="px-4 py-2 text-sm rounded-md bg-gray-800/90 hover:bg-gray-700 text-white shadow-lg flex items-center gap-2"
            onClick={onCopy}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Markdown
          </button>
        </div>
      </motion.div>
    </div>
  );
}
