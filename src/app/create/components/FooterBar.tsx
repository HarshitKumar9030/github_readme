'use client';

import React, { useState } from 'react';

interface FooterBarProps {
  setShowPreview: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  exportToFile: () => void;
  saveProject: () => void;
  onAIEnhanceClick: () => void;
}

const FooterBar: React.FC<FooterBarProps> = ({
  setShowPreview,
  setShowImportModal,
  exportToFile,
  saveProject,
  onAIEnhanceClick
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
  };  return (
    <div className="mt-6 p-6 border-t border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-white/95 via-gray-50/80 to-blue-50/60 dark:from-gray-800/95 dark:via-gray-900/80 dark:to-blue-900/20 backdrop-blur-md rounded-t-2xl">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">        <div className="flex flex-wrap gap-3">
          <button 
            className="px-5 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center gap-2 hover:shadow-blue-500/40 hover:scale-[1.02]"
            onClick={() => setShowPreview(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview README
          </button>

          <button 
            className="px-5 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-200 flex items-center gap-2 hover:shadow-purple-500/40 hover:scale-[1.02]"
            onClick={onAIEnhanceClick}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Enhance
          </button>
          
          <button 
            className="px-4 py-3 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 hover:shadow-lg backdrop-blur-sm"
            onClick={() => setShowImportModal(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Project
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className="px-4 py-3 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg backdrop-blur-sm"
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
            className="px-5 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center gap-2 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
      
      {/* Enhanced Quick Actions Info */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-md shadow-sm">Ctrl</kbd>
              <span className="text-gray-400">+</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-md shadow-sm">P</kbd>
              <span className="font-medium">Quick preview</span>
            </span>
            <span className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-md shadow-sm">Ctrl</kbd>
              <span className="text-gray-400">+</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-md shadow-sm">S</kbd>
              <span className="font-medium">Save project</span>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50/70 dark:bg-emerald-900/30 px-3 py-2 rounded-lg backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-emerald-700 dark:text-emerald-300">Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBar;
