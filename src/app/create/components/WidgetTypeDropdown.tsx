'use client';

import React, { useState, useRef, useEffect } from 'react';

interface WidgetOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'stats' | 'animation' | 'visualization';
}

interface WidgetTypeDropdownProps {
  selectedWidgetId: string;
  onWidgetChange: (widgetId: string) => void;
}

const widgetOptions: WidgetOption[] = [
  // Stats Category
  {
    id: 'github-stats',
    name: 'GitHub Stats',
    description: 'Display comprehensive GitHub statistics with customizable themes',
    icon: '📊',
    category: 'stats'
  },
  {
    id: 'top-languages',
    name: 'Top Languages',
    description: 'Show your most used programming languages in various layouts',
    icon: '🔧',
    category: 'stats'
  },
  {
    id: 'contribution-graph',
    name: 'Contribution Graph',
    description: 'Visualize your GitHub contribution activity over time',
    icon: '📈',
    category: 'stats'
  },
  {
    id: 'social-stats',
    name: 'Social Stats',
    description: 'Connect multiple social platforms with unified stats display',
    icon: '🔗',
    category: 'stats'  },
  
  // Animation Category
  {
    id: 'wave-animation',
    name: 'Wave Animation',
    description: 'Beautiful animated wave patterns with customizable colors',
    icon: '🌊',
    category: 'animation'
  },
  {
    id: 'animated-progress',
    name: 'Animated Progress',
    description: 'Showcase skills with smooth animated progress bars',
    icon: '📊',
    category: 'animation'
  },
  
  // Visualization Category
  {
    id: 'language-chart',
    name: 'Language Chart',
    description: 'Advanced language distribution with donut, pie, and bar charts',
    icon: '🎨',
    category: 'visualization'
  },
  {
    id: 'repo-showcase',
    name: 'Repository Showcase',
    description: 'Highlight your best repositories with live GitHub data',
    icon: '🏆',
    category: 'visualization'
  }
];

const categoryColors = {
  stats: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-300',
  animation: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700/50 dark:text-purple-300',
  visualization: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700/50 dark:text-emerald-300'
};

const categoryLabels = {
  stats: 'Statistics',
  animation: 'Animations',
  visualization: 'Visualizations'
};

const WidgetTypeDropdown: React.FC<WidgetTypeDropdownProps> = ({
  selectedWidgetId,
  onWidgetChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedWidget = widgetOptions.find(widget => widget.id === selectedWidgetId);

  // Ensure component is only interactive after mounting (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter widgets based on search term
  const filteredWidgets = widgetOptions.filter(widget =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered widgets by category
  const groupedWidgets = filteredWidgets.reduce((acc, widget) => {
    if (!acc[widget.category]) {
      acc[widget.category] = [];
    }
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, WidgetOption[]>);
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!mounted) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mounted]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (mounted && isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, mounted]);
  const handleWidgetSelect = (widgetId: string) => {
    if (!mounted) return;
    onWidgetChange(widgetId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!mounted) return;
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Show static version during SSR/hydration
  if (!mounted) {
    return (
      <div className="relative">
        <div className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
              selectedWidget ? categoryColors[selectedWidget.category] : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              {selectedWidget?.icon || '🧩'}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                {selectedWidget?.name || 'Select Widget Type'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
                {selectedWidget?.description || 'Choose a widget to customize'}
              </div>
            </div>
          </div>
          <div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group ${
          isOpen ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
            selectedWidget ? categoryColors[selectedWidget.category] : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {selectedWidget?.icon || '🧩'}
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900 dark:text-white">
              {selectedWidget?.name || 'Select Widget Type'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
              {selectedWidget?.description || 'Choose a widget to customize'}
            </div>
          </div>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search widgets..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              />
            </div>
          </div>

          {/* Widget Options */}
          <div className="max-h-80 overflow-y-auto">
            {Object.keys(groupedWidgets).length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm">No widgets found</div>
                <div className="text-xs">Try a different search term</div>
              </div>
            ) : (
              Object.entries(groupedWidgets).map(([category, widgets]) => (
                <div key={category} className="py-2">
                  {/* Category Header */}
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  
                  {/* Widget Items */}
                  {widgets.map((widget) => (
                    <button
                      key={widget.id}
                      onClick={() => handleWidgetSelect(widget.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                        selectedWidgetId === widget.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${categoryColors[widget.category]}`}>
                        {widget.icon}
                      </div>
                      <div className="text-left flex-grow min-w-0">
                        <div className={`font-medium truncate ${
                          selectedWidgetId === widget.id 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {widget.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {widget.description}
                        </div>
                      </div>
                      {selectedWidgetId === widget.id && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetTypeDropdown;
