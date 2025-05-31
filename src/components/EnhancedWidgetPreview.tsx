
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ParsedWidget, validateWidgetUrl, analyzeWidgetDistribution } from '@/utils/widgetParser';

interface EnhancedWidgetPreviewProps {
  widgets: ParsedWidget[];
  onWidgetUpdate?: (widget: ParsedWidget) => void;
  onWidgetRemove?: (widgetId: string) => void;
  enableValidation?: boolean;
  showStatistics?: boolean;
  enableInteraction?: boolean;
}

interface WidgetValidationStatus {
  [widgetId: string]: {
    isValid: boolean;
    isAccessible: boolean;
    error?: string;
    lastChecked: number;
  };
}

const WIDGET_TYPE_ICONS: Record<string, string> = {
  'github-stats': '📊',
  'repository-showcase': '📦',
  'typing-animation': '⌨️',
  'wave-animation': '👋',
  'language-chart': '📈',
  'animated-progress': '📊',
  'contribution-graph': '📅'
};

const WIDGET_TYPE_COLORS: Record<string, string> = {
  'github-stats': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'repository-showcase': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'typing-animation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'wave-animation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'language-chart': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'animated-progress': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'contribution-graph': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
};

export const EnhancedWidgetPreview: React.FC<EnhancedWidgetPreviewProps> = ({
  widgets,
  onWidgetUpdate,
  onWidgetRemove,
  enableValidation = true,
  showStatistics = true,
  enableInteraction = true
}) => {
  const [validationStatus, setValidationStatus] = useState<WidgetValidationStatus>({});
  const [expandedWidgets, setExpandedWidgets] = useState<Set<string>>(new Set());
  const [isValidating, setIsValidating] = useState(false);

  // Validate widget URLs
  const validateWidgets = useCallback(async () => {
    if (!enableValidation || widgets.length === 0) return;
    
    setIsValidating(true);
    const newValidationStatus: WidgetValidationStatus = {};
    
    for (const widget of widgets) {
      try {
        const result = await validateWidgetUrl(widget.imageUrl);
        newValidationStatus[widget.id] = {
          ...result,
          lastChecked: Date.now()
        };
      } catch (error) {
        newValidationStatus[widget.id] = {
          isValid: false,
          isAccessible: false,
          error: error instanceof Error ? error.message : 'Validation failed',
          lastChecked: Date.now()
        };
      }
    }
    
    setValidationStatus(newValidationStatus);
    setIsValidating(false);
  }, [widgets, enableValidation]);

  // Run validation on mount and when widgets change
  useEffect(() => {
    validateWidgets();
  }, [validateWidgets]);

  // Toggle widget expansion
  const toggleWidgetExpansion = (widgetId: string) => {
    const newExpanded = new Set(expandedWidgets);
    if (newExpanded.has(widgetId)) {
      newExpanded.delete(widgetId);
    } else {
      newExpanded.add(widgetId);
    }
    setExpandedWidgets(newExpanded);
  };

  // Copy widget markdown to clipboard
  const copyWidgetMarkdown = async (widget: ParsedWidget) => {
    try {
      await navigator.clipboard.writeText(widget.rawMarkdown);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy widget markdown:', error);
    }
  };

  // Get widget statistics
  const statistics = showStatistics ? analyzeWidgetDistribution(widgets) : null;

  if (widgets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No widgets detected
        </h4>
        <p className="text-gray-500 dark:text-gray-400">
          Widgets will appear here as they&apos;re detected in your README content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      {showStatistics && statistics && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            📊 Widget Statistics
            {isValidating && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.totalCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Widgets</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Object.keys(statistics.byType).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Widget Types</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {enableValidation ? Object.values(validationStatus).filter(v => v.isAccessible).length : '—'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accessible</div>
            </div>
          </div>
          
          {/* Widget Type Distribution */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Distribution by Type
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statistics.byType).map(([type, count]) => (
                <span
                  key={type}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    WIDGET_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {WIDGET_TYPE_ICONS[type] || '🧩'} {type} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Validation Controls */}
      {enableValidation && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Widget Validation
            </span>
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Validating...
              </div>
            )}
          </div>
          <button
            onClick={validateWidgets}
            disabled={isValidating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {isValidating ? 'Validating...' : 'Re-validate All'}
          </button>
        </div>
      )}

      {/* Widget List */}
      <div className="space-y-4">
        {widgets.map((widget, index) => {
          const isExpanded = expandedWidgets.has(widget.id);
          const validation = validationStatus[widget.id];
          const typeColor = WIDGET_TYPE_COLORS[widget.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
          
          return (
            <div
              key={widget.id}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Widget Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{WIDGET_TYPE_ICONS[widget.type] || '🧩'}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {widget.type.replace('-', ' ')} Widget
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Widget #{index + 1} • Line {widget.position.line}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Widget Type Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                      {widget.type}
                    </span>
                    
                    {/* Validation Status */}
                    {enableValidation && validation && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        validation.isAccessible
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {validation.isAccessible ? '✅ Valid' : '❌ Invalid'}
                      </span>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyWidgetMarkdown(widget)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                        title="Copy markdown"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                      
                      {enableInteraction && (
                        <button
                          onClick={() => toggleWidgetExpansion(widget.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                      
                      {onWidgetRemove && (
                        <button
                          onClick={() => onWidgetRemove(widget.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded transition-colors"
                          title="Remove widget"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Widget Preview */}
              <div className="p-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <img
                    src={widget.imageUrl}
                    alt={widget.altText || 'Widget preview'}
                    className="max-w-full h-auto rounded border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const container = target.parentElement;
                      if (container) {
                        container.innerHTML = `
                          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                            <div class="text-4xl mb-2">⚠️</div>
                            <div class="text-sm">Failed to load widget preview</div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="space-y-4">
                    {/* URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Widget URL
                      </label>
                      <code className="block text-xs bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 break-all">
                        {widget.imageUrl}
                      </code>
                    </div>
                    
                    {/* Parameters */}
                    {Object.keys(widget.parameters).length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Parameters ({Object.keys(widget.parameters).length})
                        </label>
                        <div className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {Object.entries(widget.parameters).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium text-gray-600 dark:text-gray-400">{key}:</span>
                                <span className="text-gray-900 dark:text-gray-100">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Raw Markdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Raw Markdown
                      </label>
                      <code className="block text-xs bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 font-mono">
                        {widget.rawMarkdown}
                      </code>
                    </div>
                    
                    {/* Validation Details */}
                    {enableValidation && validation && !validation.isAccessible && validation.error && (
                      <div>
                        <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                          Validation Error
                        </label>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-3">
                          <p className="text-sm text-red-800 dark:text-red-200">{validation.error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedWidgetPreview;
