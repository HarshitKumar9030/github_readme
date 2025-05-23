'use client';

import React, { useState } from 'react';

interface FooterBarProps {
  setShowPreview: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  exportToFile: () => void;
  saveProject: () => void;
}

const FooterBar: React.FC<FooterBarProps> = ({
  setShowPreview,
  setShowImportModal,
  exportToFile,
  saveProject
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToFile();
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProject();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <button 
            className="px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm transition-all duration-200 flex items-center gap-2 hover:shadow-md"
            onClick={() => setShowPreview(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview README
          </button>
          
          <button 
            className="px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
            onClick={() => setShowImportModal(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Project
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className="px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            {isExporting ? 'Exporting...' : 'Export README'}
          </button>
          
          <button 
            className="px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm transition-all duration-200 flex items-center gap-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            {isSaving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>
      
      {/* Quick Actions Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-700 rounded">P</kbd>
              <span>for quick preview</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-700 rounded">S</kbd>
              <span>to save</span>
            </span>
          </div>
          <div className="text-right">
            <span>Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBar;
