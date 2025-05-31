"use client";

import React, { useState, useCallback, useEffect } from "react";
import { convertToGitHubCompatible } from "@/utils/inlineStylesConverter";
import {
  copyGitHubMarkdown,
  downloadGitHubMarkdown,
} from "@/utils/clipboardUtils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EnhancedWidgetPreview from "@/components/EnhancedWidgetPreview";
import { parseWidgetsFromMarkdown, ParsedWidget } from "@/utils/widgetParser";

interface ReadmePreviewProps {
  content: string;
  onClose: () => void;
  onCopy?: () => void;
  liveMode?: boolean;
  onLiveModeToggle?: (enabled: boolean) => void;
}

interface DetectedWidget {
  type: string;
  data: any;
  id: string;
}

export default function ReadmePreview({
  content,
  onClose,
  onCopy,
  liveMode = false,
  onLiveModeToggle,
}: ReadmePreviewProps) {
  const [viewMode, setViewMode] = useState<"preview" | "raw" | "widgets">("preview");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detectedWidgets, setDetectedWidgets] = useState<DetectedWidget[]>([]);
  const [parsedWidgets, setParsedWidgets] = useState<ParsedWidget[]>([]);
  const [showWidgetHighlights, setShowWidgetHighlights] = useState(false);

  // Parse widgets from content on change
  useEffect(() => {
    const parseResult = parseWidgetsFromMarkdown(content);
    setParsedWidgets(parseResult.widgets);
  }, [content]);

  // Handle widget detection from MarkdownRenderer
  const handleWidgetDetected = useCallback((widgetType: string, widgetData: any) => {
    const widgetId = `${widgetType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWidget: DetectedWidget = {
      type: widgetType,
      data: widgetData,
      id: widgetId
    };
    
    setDetectedWidgets(prev => {
      // Avoid duplicates by checking if same widget already exists
      const isDuplicate = prev.some(w => 
        w.type === newWidget.type && 
        w.data.src === newWidget.data.src
      );
      if (isDuplicate) return prev;
      return [...prev, newWidget];
    });
  }, []);

  // Handle parsed widget removal
  const handleWidgetRemove = useCallback((widgetId: string) => {
    setParsedWidgets(prev => prev.filter(w => w.id !== widgetId));
  }, []);

  const handleCopy = async () => {
    setCopyStatus("copying");
    try {
      await copyGitHubMarkdown(content);
      setCopyStatus("copied");
      onCopy?.();
      setTimeout(() => setCopyStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
      setCopyStatus("idle");
    }
  };

  const handleDownload = () => {
    try {
      downloadGitHubMarkdown(content);
    } catch (err) {
      console.error("Failed to download markdown:", err);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get processed content for raw view
  const rawContent = React.useMemo(() => {
    return convertToGitHubCompatible(content);
  }, [content]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 ${
          isFullscreen
            ? "h-screen w-screen"
            : "h-[90vh] w-[95vw] max-w-7xl rounded-xl"
        } overflow-hidden`}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div 
          className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
          style={{ flexShrink: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                📄 README Preview
              </h2>
                {/* View Toggle */}
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "preview"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  👁️ Preview
                </button>                <button
                  onClick={() => setViewMode("widgets")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 relative ${
                    viewMode === "widgets"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  🧩 Widgets
                  {(detectedWidgets.length > 0 || parsedWidgets.length > 0) && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {Math.max(detectedWidgets.length, parsedWidgets.length)}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setViewMode("raw")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "raw"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  📝 Raw
                </button>
              </div>              {/* Live Mode */}
              {onLiveModeToggle && (
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={liveMode}
                    onChange={(e) => onLiveModeToggle(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        liveMode ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      }`}
                    />
                    Live Updates
                  </span>
                </label>
              )}              {/* Widget Highlights */}
              {viewMode === "preview" && (detectedWidgets.length > 0 || parsedWidgets.length > 0) && (
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={showWidgetHighlights}
                    onChange={(e) => setShowWidgetHighlights(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="flex items-center gap-2">
                    🔍 Highlight Widgets ({Math.max(detectedWidgets.length, parsedWidgets.length)})
                  </span>
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={isFullscreen ? "M6 18L18 6M6 6l12 12" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"} 
                  />
                </svg>
              </button>

              <button
                onClick={handleDownload}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Download README.md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button
                onClick={handleCopy}
                disabled={copyStatus === "copying"}
                className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  copyStatus === "copied"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-600"
                    : copyStatus === "copying"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Copy GitHub-optimized markdown"
              >
                {copyStatus === "copying" && (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {copyStatus === "copied" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {copyStatus === "idle" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
                {copyStatus === "copied" ? "✅ Copied!" : copyStatus === "copying" ? "⏳ Copying..." : "📋 Copy for GitHub"}
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                title="Close preview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>        {/* Content */}
        <div 
          className="flex-1 overflow-hidden"
          style={{ minHeight: 0 }}
        >
          {viewMode === "preview" ? (
            <div className="h-full overflow-auto bg-white dark:bg-gray-900">
              <div className="max-w-4xl mx-auto p-8">
                <MarkdownRenderer 
                  content={content}
                  githubCompatible={true}
                  enhancedWidgetRendering={true}
                  onWidgetDetected={handleWidgetDetected}
                  livePreview={liveMode}
                  showAnchorLinks={true}
                  className="prose-lg"
                />
                  {/* Widget Overlay Highlights */}
                {showWidgetHighlights && (detectedWidgets.length > 0 || parsedWidgets.length > 0) && (
                  <div className="fixed bottom-4 right-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 max-w-sm shadow-lg z-40">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      🧩 Detected Widgets ({Math.max(detectedWidgets.length, parsedWidgets.length)})
                    </h4>
                    <div className="space-y-1">
                      {/* Show parsed widgets first as they're more comprehensive */}
                      {parsedWidgets.length > 0 ? (
                        parsedWidgets.map((widget, idx) => (
                          <div key={widget.id} className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="capitalize">{widget.type.replace('-', ' ')}</span>
                          </div>
                        ))
                      ) : (
                        detectedWidgets.map((widget, idx) => (
                          <div key={widget.id} className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="capitalize">{widget.type.replace('-', ' ')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>          ) : viewMode === "widgets" ? (
            <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-800">
              <div className="max-w-6xl mx-auto p-8">
                {parsedWidgets.length > 0 ? (
                  <EnhancedWidgetPreview 
                    widgets={parsedWidgets}
                    onWidgetRemove={handleWidgetRemove}
                    enableValidation={true}
                    showStatistics={true}
                    enableInteraction={true}
                  />
                ) : detectedWidgets.length > 0 ? (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        🧩 Widget Analysis
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Basic widget detection results. For enhanced analysis, ensure your content includes parseable widget markdown.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {detectedWidgets.map((widget, idx) => (
                        <div key={widget.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                {widget.type.replace('-', ' ')} Widget
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Widget #{idx + 1} • Detected from image source
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {widget.type}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Source URL
                              </label>
                              <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded border break-all">
                                {widget.data.src}
                              </code>
                            </div>
                            
                            {widget.data.alt && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Alt Text
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  {widget.data.alt}
                                </p>
                              </div>
                            )}
                            
                            {widget.data.title && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Title
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  {widget.data.title}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No widgets detected yet
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Widgets will appear here as they&apos;re detected in your README content
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-800">
              <pre className="p-8 text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                {rawContent}
              </pre>
            </div>
          )}
        </div>        {/* Footer */}
        <div 
          className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3"
          style={{ flexShrink: 0 }}
        >
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                📊 {content.length.toLocaleString()} characters
              </span>
              <span className="flex items-center gap-1">
                📄 {content.split("\n").length.toLocaleString()} lines
              </span>              <span className="flex items-center gap-1">
                🔤 {content.split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
              </span>
              {(parsedWidgets.length > 0 || detectedWidgets.length > 0) && (
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                  🧩 {Math.max(parsedWidgets.length, detectedWidgets.length)} widget{Math.max(parsedWidgets.length, detectedWidgets.length) !== 1 ? 's' : ''}
                  {parsedWidgets.length > 0 && detectedWidgets.length > 0 && parsedWidgets.length !== detectedWidgets.length && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({parsedWidgets.length} parsed, {detectedWidgets.length} detected)
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                GitHub Ready
              </span>
              {liveMode && (
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                  <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  Live Mode
                </span>
              )}
              {showWidgetHighlights && (
                <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                  🔍 Widget Highlights
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
