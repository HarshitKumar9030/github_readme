"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { convertToGitHubCompatible } from "@/utils/inlineStylesConverter";
import {
  copyGitHubMarkdown,
  downloadGitHubMarkdown,
} from "@/utils/clipboardUtils";

interface ReadmePreviewProps {
  content: string;
  onClose: () => void;
  onCopy?: () => void;
  liveMode?: boolean;
  onLiveModeToggle?: (enabled: boolean) => void;
}

// Simple inline markdown renderer component
const InlineMarkdownRenderer = ({ content }: { content: string }) => {
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            return !isInline ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-md"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          img({ src, alt, ...props }) {
            return (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                loading="lazy"
                {...props}
              />
            );
          },
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-600 dark:decoration-blue-400"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }) {
            return (
              <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-200" {...props}>
                {children}
              </td>
            );
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300" {...props}>
                {children}
              </blockquote>
            );
          },
          h1({ children, ...props }) {
            return (
              <h1 className="text-3xl font-bold mt-8 mb-6 text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-3" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3 className="text-xl font-semibold mt-5 mb-3 text-gray-900 dark:text-white" {...props}>
                {children}
              </h3>
            );
          },
          ul({ children, ...props }) {
            return (
              <ul className="list-disc list-inside my-4 space-y-1 text-gray-800 dark:text-gray-200" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol className="list-decimal list-inside my-4 space-y-1 text-gray-800 dark:text-gray-200" {...props}>
                {children}
              </ol>
            );
          },
          p({ children, ...props }) {
            return (
              <p className="my-4 text-gray-800 dark:text-gray-200 leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default function ReadmePreview({
  content,
  onClose,
  onCopy,
  liveMode = false,
  onLiveModeToggle,
}: ReadmePreviewProps) {
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);

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
              </div>

              {/* Live Mode */}
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
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-hidden"
          style={{ minHeight: 0 }}
        >
          {viewMode === "preview" ? (
            <div className="h-full overflow-auto bg-white dark:bg-gray-900">
              <div className="max-w-4xl mx-auto p-8">
                <InlineMarkdownRenderer content={content} />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-800">
              <pre className="p-8 text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                {rawContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
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
              </span>
              <span className="flex items-center gap-1">
                🔤 {content.split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
              </span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
