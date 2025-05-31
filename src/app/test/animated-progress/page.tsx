'use client';

import React, { useState } from 'react';
import AnimatedProgressWidget from '@/widgets/AnimatedProgressWidget';

// Simple test page to verify animated progress widget functionality
export default function TestPage() {
  const [config, setConfig] = useState({
    skills: [
      { name: 'JavaScript', level: 90, color: '#f1e05a' },
      { name: 'TypeScript', level: 85, color: '#3178c6' },
      { name: 'React', level: 80, color: '#61dafb' }
    ],
    theme: 'light' as const,
    width: 400,
    height: 300,
    animationDuration: 2000,
    showProgressText: true,
    progressBarHeight: 20
  });

  const [markdown, setMarkdown] = useState('');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Animated Progress Widget Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Widget</h2>
          <AnimatedProgressWidget
            config={config}
            onConfigChange={(newConfig) => setConfig(newConfig as any)}
            onMarkdownGenerated={setMarkdown}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Markdown</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">{markdown || 'No markdown generated yet'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
