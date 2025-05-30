import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Block, WidgetBlock } from '@/interfaces/BlockTypes';
import GitHubStatsWidget from '@/widgets/GitHubStatsWidget';
import SocialStatsWidget from '@/widgets/SocialStatsWidget';
import TopLanguagesWidget from '@/widgets/TopLanguagesWidget';
import ContributionGraphWidget from '@/widgets/ContributionGraphWidget';
import WaveAnimationWidget from '@/widgets/WaveAnimationWidget';
import LanguageChartWidget from '@/widgets/LanguageChartWidget';
import RepositoryShowcaseWidget from '@/widgets/RepositoryShowcaseWidget';
import AnimatedProgressWidget from '@/widgets/AnimatedProgressWidget';
import TypingAnimationWidget from '@/widgets/TypingAnimationWidget';

interface BuilderAreaProps {
  builderBlocks: Block[];
  dragOver: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  selectedBlockId: string | null;
  handleBlockSelect: (id: string) => void;
  handleRemoveBlock: (id: string) => void;
  handleMoveBlockUp: (id: string) => void;
  handleMoveBlockDown: (id: string) => void;
  loadTemplate: (templateType: string) => void;
  widgetConfig: any;
  username: string;
  socials: any;
  handleWidgetMarkdownGenerated?: (blockId: string, markdown: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BuilderArea: React.FC<BuilderAreaProps> = ({
  builderBlocks,
  dragOver,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  selectedBlockId,
  handleBlockSelect,
  handleRemoveBlock,
  handleMoveBlockUp,
  handleMoveBlockDown,
  loadTemplate,
  widgetConfig,
  username,
  socials,
  handleWidgetMarkdownGenerated,  handleUndo,
  handleRedo,
  canUndo,
  canRedo
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    isMountedRef.current = true;
  }, []);

  // Create stable callback functions for each block to prevent re-renders
  const blockIds = useMemo(() => builderBlocks.map(b => b.id), [builderBlocks]);
  const stableCallbacks = useMemo(() => {
    const callbacks: Record<string, (md: string) => void> = {};
    builderBlocks.forEach(block => {
      callbacks[block.id] = (md: string) => {
        // Use ref instead of state to avoid recreating callbacks
        if (isMountedRef.current && typeof window !== 'undefined' && handleWidgetMarkdownGenerated) {
          handleWidgetMarkdownGenerated(block.id, md);
        }
      };
    });
    return callbacks;
  }, [builderBlocks, handleWidgetMarkdownGenerated]); // Remove isMounted dependency

  const githubStatsConfig = useMemo(() => ({
    username: username,
    theme: widgetConfig?.theme || 'light',
    layoutType: 'full' as const,
    layoutStyle: widgetConfig?.layoutStyle || 'side-by-side',
    showTrophies: true,
    showStreaks: true,
    showLanguages: true,
    showStats: true,
    hideBorder: widgetConfig?.hideBorder || false,
    hideTitle: widgetConfig?.hideTitle || false,
    includeAllCommits: widgetConfig?.includeAllCommits || false,
    includePrivate: widgetConfig?.includePrivate || false,
    compactMode: widgetConfig?.layoutCompact || false,
    hideRank: widgetConfig?.hideRank || false,
    trophyTheme: widgetConfig?.trophyTheme || widgetConfig?.theme || 'flat',
    customTitle: widgetConfig?.customTitle
  }), [
    username,
    widgetConfig?.theme,
    widgetConfig?.layoutStyle,
    widgetConfig?.hideBorder,
    widgetConfig?.hideTitle,
    widgetConfig?.includeAllCommits,
    widgetConfig?.includePrivate,
    widgetConfig?.layoutCompact,
    widgetConfig?.hideRank,
    widgetConfig?.trophyTheme,
    widgetConfig?.customTitle
  ]);

  const topLanguagesConfig = useMemo(() => ({
    username: username,
    theme: widgetConfig?.theme || 'light',
    layout: widgetConfig?.layout || 'compact',
    hideBorder: widgetConfig?.hideBorder || false,
    hideTitle: widgetConfig?.hideTitle || false,
    customTitle: widgetConfig?.customTitle || '',
    excludeRepos: widgetConfig?.excludeRepos || '',
    excludeLangs: widgetConfig?.excludeLangs || '',
    cardWidth: widgetConfig?.cardWidth || 495,
  }), [
    username,
    widgetConfig?.theme,
    widgetConfig?.layout,
    widgetConfig?.hideBorder,
    widgetConfig?.hideTitle,
    widgetConfig?.customTitle,
    widgetConfig?.excludeRepos,
    widgetConfig?.excludeLangs,
    widgetConfig?.cardWidth
  ]);
  const contributionGraphConfig = useMemo(() => ({
    username: username,
    theme: widgetConfig?.theme || 'github',
    showArea: widgetConfig?.showArea || false,
    showDots: widgetConfig?.showDots || true,
    height: widgetConfig?.height || 180,
    graphType: widgetConfig?.graphType || 'line',
    hideBorder: widgetConfig?.hideBorder || false,
    hideTitle: widgetConfig?.hideTitle || false,
    customTitle: widgetConfig?.customTitle || ''
  }), [
    username,
    widgetConfig?.theme,
    widgetConfig?.showArea,
    widgetConfig?.showDots,
    widgetConfig?.height,
    widgetConfig?.graphType,
    widgetConfig?.hideBorder,
    widgetConfig?.hideTitle,
    widgetConfig?.customTitle
  ]);
  const animatedProgressConfig = useMemo(() => ({
    theme: widgetConfig?.theme || 'default',
    skills: widgetConfig?.skills || [
      { name: 'JavaScript', level: 90, color: '#f1e05a' },
      { name: 'TypeScript', level: 85, color: '#3178c6' },
      { name: 'React', level: 80, color: '#61dafb' }
    ],
    animationDuration: widgetConfig?.animationDuration || 2000,
    showProgressText: widgetConfig?.showProgressText !== false,
    progressBarHeight: widgetConfig?.progressBarHeight || 20,
    hideBorder: widgetConfig?.hideBorder || false,
    hideTitle: widgetConfig?.hideTitle || false,
    customTitle: widgetConfig?.customTitle || ''
  }), [
    widgetConfig?.theme,
    widgetConfig?.skills,
    widgetConfig?.animationDuration,
    widgetConfig?.showProgressText,
    widgetConfig?.progressBarHeight,
    widgetConfig?.hideBorder,
    widgetConfig?.hideTitle,
    widgetConfig?.customTitle
  ]);
  const typingAnimationConfig = useMemo(() => ({
    theme: widgetConfig?.theme || 'default',
    text: widgetConfig?.text || 'Hello, I am a developer!',
    font: widgetConfig?.font || 'monospace',
    size: widgetConfig?.size || 20,
    color: widgetConfig?.color || '#0066cc',
    duration: widgetConfig?.duration || 3000,
    loop: widgetConfig?.loop !== false,
    cursor: widgetConfig?.cursor !== false,
    width: widgetConfig?.width || 600,
    height: 100,
    hideBorder: widgetConfig?.hideBorder || false,
    hideTitle: widgetConfig?.hideTitle || false,
    customTitle: widgetConfig?.customTitle || ''
  }), [
    widgetConfig?.theme,
    widgetConfig?.text,
    widgetConfig?.font,
    widgetConfig?.size,
    widgetConfig?.color,
    widgetConfig?.duration,
    widgetConfig?.loop,
    widgetConfig?.cursor,
    widgetConfig?.width,
    widgetConfig?.hideBorder,
    widgetConfig?.hideTitle,
    widgetConfig?.customTitle
  ]);
  const languageChartConfig = useMemo(() => ({
    username: username,
    theme: widgetConfig?.theme || 'light',
    showPercentages: widgetConfig?.showPercentages !== false,
    size: widgetConfig?.cardWidth || 300,
    minPercentage: 5,
    maxLanguages: 8,
    hideBorder: widgetConfig?.hideBorder || false,
    hideTitle: widgetConfig?.hideTitle || false,
    customTitle: widgetConfig?.customTitle || ''
  }), [
    username,
    widgetConfig?.theme,
    widgetConfig?.showPercentages,
    widgetConfig?.cardWidth,
    widgetConfig?.hideBorder,
    widgetConfig?.hideTitle,
    widgetConfig?.customTitle
  ]);
  const waveAnimationConfig = useMemo(() => ({
    username: username,
    theme: widgetConfig?.theme || 'light',
    waveColor: widgetConfig?.waveColor || '#0099ff',
    waveSecondaryColor: widgetConfig?.waveSecondaryColor || '#00ccff',
    waveSpeed: widgetConfig?.waveSpeed || 'medium',
    waveCount: widgetConfig?.waveCount || 3,
    width: widgetConfig?.width || 800,
    height: widgetConfig?.height || 200,
    hideTitle: widgetConfig?.hideTitle || false,
    customTitle: widgetConfig?.customTitle || ''
  }), [
    username,
    widgetConfig?.theme,
    widgetConfig?.waveColor,
    widgetConfig?.waveSecondaryColor,
    widgetConfig?.waveSpeed,
    widgetConfig?.waveCount,
    widgetConfig?.width,
    widgetConfig?.height,
    widgetConfig?.hideTitle,
    widgetConfig?.customTitle
  ]);  // Memoize repository array parsing to prevent recreation on every render
  const showcaseReposList = useMemo(() => {
    if (Array.isArray(widgetConfig?.showcaseRepos)) {
      return widgetConfig.showcaseRepos;
    }
    if (typeof widgetConfig?.showcaseRepos === 'string' && widgetConfig.showcaseRepos.trim()) {
      return widgetConfig.showcaseRepos.split(',').map((repo: string) => repo.trim()).filter((repo: string) => repo.length > 0);
    }
    return [];
  }, [widgetConfig?.showcaseRepos]);

  const repoShowcaseConfig = useMemo(() => ({
    username: username,
    theme: widgetConfig?.theme || 'default',
    showcaseRepos: showcaseReposList,
    repoLayout: widgetConfig?.repoLayout || 'single',
    sortBy: widgetConfig?.sortBy || 'stars',
    repoLimit: widgetConfig?.repoLimit || 6,
    showStats: widgetConfig?.showStats !== false,
    showLanguage: widgetConfig?.showLanguage !== false,
    showDescription: widgetConfig?.showDescription !== false,
    showTopics: widgetConfig?.showTopics !== false,
    showLastUpdated: widgetConfig?.showLastUpdated !== false,
    repoCardWidth: widgetConfig?.repoCardWidth || 400,
    repoCardHeight: widgetConfig?.repoCardHeight || 200,
    hideBorder: widgetConfig?.hideBorder || false,
    hideTitle: widgetConfig?.hideTitle || false,
    customTitle: widgetConfig?.customTitle || ''
  }), [
    username,
    widgetConfig?.theme,
    showcaseReposList,
    widgetConfig?.repoLayout,
    widgetConfig?.sortBy,
    widgetConfig?.repoLimit,
    widgetConfig?.showStats,
    widgetConfig?.showLanguage,
    widgetConfig?.showDescription,
    widgetConfig?.showTopics,
    widgetConfig?.showLastUpdated,
    widgetConfig?.repoCardWidth,
    widgetConfig?.repoCardHeight,
    widgetConfig?.hideBorder,
    widgetConfig?.hideTitle,
    widgetConfig?.customTitle
  ]);

  const memoizedConfigs = useMemo(() => ({
    githubStats: githubStatsConfig,
    topLanguages: topLanguagesConfig,
    contributionGraph: contributionGraphConfig,
    animatedProgress: animatedProgressConfig,
    typingAnimation: typingAnimationConfig,
    languageChart: languageChartConfig,
    waveAnimation: waveAnimationConfig,
    repoShowcase: repoShowcaseConfig
  }), [
    githubStatsConfig,
    topLanguagesConfig,
    contributionGraphConfig,
    animatedProgressConfig,
    typingAnimationConfig,
    languageChartConfig,
    waveAnimationConfig,
    repoShowcaseConfig
  ]);

  // Widget error boundary component
  const WidgetErrorBoundary: React.FC<{ children: React.ReactNode; widgetId: string }> = ({ children, widgetId }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error(`Error rendering widget ${widgetId}:`, error);
      return (
        <div className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p>Error loading {widgetId} widget</p>
        </div>
      );
    }
  };
  const renderWidget = useCallback((block: Block) => {
    if (!isMounted) {
      return (
        <div className="p-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-md">
          <p>Loading widget...</p>
        </div>
      );
    }

    if (block.type !== 'widget') {
      return null;
    }

    const widgetBlock = block as WidgetBlock;

    return (
      <WidgetErrorBoundary widgetId={widgetBlock.widgetId}>        {widgetBlock.widgetId === 'github-stats' && (
          <GitHubStatsWidget 
            config={memoizedConfigs.githubStats}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}        {widgetBlock.widgetId === 'social-stats' && (
          <SocialStatsWidget            config={{
              socials: socials,
              displayLayout: widgetConfig?.layout === 'compact' ? 'inline' : 'grid',
              showDetails: true,
              showImages: true,
              hideTitle: widgetConfig?.hideBorder,
              customTitle: widgetConfig?.customTitle,
              badgeStyle: 'for-the-badge',
              gridColumns: 3
            }}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
        {widgetBlock.widgetId === 'top-languages' && (
          <TopLanguagesWidget
            config={memoizedConfigs.topLanguages}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
        {widgetBlock.widgetId === 'contribution-graph' && (
          <ContributionGraphWidget
            config={memoizedConfigs.contributionGraph}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
        {widgetBlock.widgetId === 'wave-animation' && (
          <WaveAnimationWidget
            config={memoizedConfigs.waveAnimation}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
        {widgetBlock.widgetId === 'language-chart' && (
          <LanguageChartWidget
            config={memoizedConfigs.languageChart}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
        {widgetBlock.widgetId === 'repo-showcase' && (
          <RepositoryShowcaseWidget
            config={memoizedConfigs.repoShowcase}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
        {widgetBlock.widgetId === 'animated-progress' && (
          <AnimatedProgressWidget
            config={memoizedConfigs.animatedProgress}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
        {widgetBlock.widgetId === 'typing-animation' && (
          <TypingAnimationWidget
            config={memoizedConfigs.typingAnimation}
            onMarkdownGenerated={stableCallbacks[block.id]}
          />
        )}
      </WidgetErrorBoundary>
    );
  }, [isMounted, memoizedConfigs, stableCallbacks, socials, widgetConfig?.layout, widgetConfig?.customTitle, widgetConfig?.hideBorder]);

  return (
    <div className="lg:col-span-6 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          README Builder
        </h3>        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1.5 text-xs rounded-md flex items-center transition ${
              canUndo 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleUndo}
            disabled={!canUndo}
            title={canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Undo
          </button>
          <button 
            className={`px-3 py-1.5 text-xs rounded-md flex items-center transition ${
              canRedo 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleRedo}
            disabled={!canRedo}
            title={canRedo ? 'Redo (Ctrl+Y)' : 'Nothing to redo'}
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Redo
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-auto">
        <div 
          className={`border-2 border-dashed rounded-lg ${dragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-4 ring-blue-500/20' 
            : 'border-gray-200 dark:border-gray-700'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-4">
            {builderBlocks.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No blocks yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop blocks from the sidebar to start building your README
                </p>
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => loadTemplate('personal')}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start with a template
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                {builderBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`pt-4 ${index > 0 ? 'pt-4' : ''}`}
                  >
                    <div 
                      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border ${
                        selectedBlockId === block.id 
                          ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-800' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900'
                      } transition-all cursor-pointer`}
                      onClick={() => handleBlockSelect(block.id)}
                    >
                      <div className="flex items-center gap-3">
                        {block.type === 'content' ? (
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        ) : block.type === 'widget' ? (
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">{block.label}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{block.type}</span>
                        <div className="ml-auto flex items-center space-x-1">
                          <button 
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveBlockUp(block.id);
                            }}
                            disabled={builderBlocks.indexOf(block) === 0}
                            title="Move up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          </button>
                          <button 
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveBlockDown(block.id);
                            }}
                            disabled={builderBlocks.indexOf(block) === builderBlocks.length - 1}
                            title="Move down"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </button>
                          <button 
                            className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveBlock(block.id);
                            }}
                            title="Remove block"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                        {/* Block preview - you may need to create separate components for each block type for better maintainability */}
                      {block.type === 'widget' && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {(() => {
                              const widgetBlock = block as WidgetBlock;
                              switch (widgetBlock.widgetId) {
                                case 'github-stats': return 'GitHub Stats Widget';
                                case 'top-languages': return 'Top Languages Widget';
                                case 'contribution-graph': return 'Contribution Graph Widget';
                                case 'wave-animation': return 'Wave Animation Widget';
                                case 'language-chart': return 'Language Chart Widget';
                                case 'repo-showcase': return 'Repository Showcase Widget';
                                case 'animated-progress': return 'Animated Progress Widget';
                                case 'typing-animation': return 'Typing Animation Widget';
                                case 'social-stats': return 'Social Stats Widget';
                                default: return 'Unknown Widget';
                              }
                            })()}
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
                            {renderWidget(block)}
                          </div>
                        </div>
                      )}
                      
                      {block.type === 'content' && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 max-h-40 overflow-hidden relative">
                            <div className="prose dark:prose-invert prose-sm max-w-none line-clamp-3">
                              Content Preview
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-50 dark:from-gray-900/50 to-transparent pointer-events-none"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BuilderArea);
