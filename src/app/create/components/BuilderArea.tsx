import React, { useCallback, useMemo } from 'react';
import { Block } from '@/interfaces/BlockTypes';
import GitHubStatsWidget from '@/widgets/GitHubStatsWidget';
import EnhancedSocialStatsWidget from '@/app/create/SocialStatsWidget-Redesigned';
import TopLanguagesWidget from '@/widgets/TopLanguagesWidget';
import ContributionGraphWidget from '@/widgets/ContributionGraphWidget';
import WaveAnimationWidget from '@/widgets/WaveAnimationWidget';
import LanguageChartWidget from '@/widgets/LanguageChartWidget';
import RepositoryShowcaseWidget from '@/widgets/RepositoryShowcaseWidget';
import AnimatedProgressWidget from '@/widgets/AnimatedProgressWidget';
import TypingAnimationWidget from '@/widgets/TypingAnimationWidget';

// Accept widgetConfig, username, socials as props
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
  handleWidgetMarkdownGenerated,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo
}) => {
  // Memoize the markdown generation callback to prevent infinite re-renders
  const handleMarkdownGenerated = useCallback((blockId: string) => {
    return (md: string) => {
      if (typeof window !== 'undefined' && blockId && handleWidgetMarkdownGenerated) {
        handleWidgetMarkdownGenerated(blockId, md);
      }
    };
  }, [handleWidgetMarkdownGenerated]);
  // Memoize widget configs to prevent unnecessary re-renders
  const memoizedConfigs = useMemo(() => {
    return {      githubStats: {
        username: username,
        theme: widgetConfig.theme || 'light',
        layoutType: 'full' as const,
        layoutStyle: widgetConfig.layoutStyle || 'side-by-side',
        showTrophies: true,
        showStreaks: true,
        showLanguages: true,
        showStats: true,
        hideBorder: widgetConfig.hideBorder || false,
        hideTitle: widgetConfig.hideTitle || false,
        includeAllCommits: widgetConfig.includeAllCommits || false,
        includePrivate: widgetConfig.includePrivate || false,
        compactMode: widgetConfig.layoutCompact || false,
        hideRank: widgetConfig.hideRank || false,
        trophyTheme: widgetConfig.trophyTheme || widgetConfig.theme || 'flat',
        customTitle: widgetConfig.customTitle
      },
      topLanguages: {
        username: username,
        theme: widgetConfig.theme || 'light',
        layout: widgetConfig.layout || 'compact',
        hideBorder: widgetConfig.hideBorder || false,
        hideTitle: widgetConfig.hideTitle || false,
        customTitle: widgetConfig.customTitle || '',
        excludeRepos: widgetConfig.excludeRepos || '',
        excludeLangs: widgetConfig.excludeLangs || '',
        cardWidth: widgetConfig.cardWidth || 495,
      },
      contributionGraph: {
        username: username,
        theme: widgetConfig.theme || 'github',
        showArea: widgetConfig.showArea || false,
        showDots: widgetConfig.showDots || true,
        height: widgetConfig.height || 180,
        graphType: widgetConfig.graphType || 'line',
        hideBorder: widgetConfig.hideBorder || false,
        hideTitle: widgetConfig.hideTitle || false,
        customTitle: widgetConfig.customTitle || ''
      },
      animatedProgress: {
        theme: widgetConfig.theme || 'default',
        skills: widgetConfig.skills || [
          { name: 'JavaScript', level: 90, color: '#f1e05a' },
          { name: 'TypeScript', level: 85, color: '#3178c6' },
          { name: 'React', level: 80, color: '#61dafb' }
        ],
        animationDuration: widgetConfig.animationDuration || 2000,
        showProgressText: widgetConfig.showProgressText !== false,
        progressBarHeight: widgetConfig.progressBarHeight || 20,
        hideBorder: widgetConfig.hideBorder || false,
        hideTitle: widgetConfig.hideTitle || false,
        customTitle: widgetConfig.customTitle || ''
      },
      typingAnimation: {
        theme: widgetConfig.theme || 'default',
        text: 'Hello, I am a developer!',
        font: 'monospace',
        size: 20,
        color: '#0066cc',
        duration: 3000,
        loop: true,
        cursor: true,
        width: 600,
        height: 100,
        hideBorder: widgetConfig.hideBorder || false,
        hideTitle: widgetConfig.hideTitle || false,
        customTitle: widgetConfig.customTitle || ''
      },
      languageChart: {
        username: username,
        theme: widgetConfig.theme || 'light',
        showPercentages: widgetConfig.showPercentages !== false,
        size: widgetConfig.cardWidth || 300,
        minPercentage: 5,
        maxLanguages: 8,
        hideBorder: widgetConfig.hideBorder || false,
        hideTitle: widgetConfig.hideTitle || false,
        customTitle: widgetConfig.customTitle || ''
      },
      waveAnimation: {
        username: username,
        theme: widgetConfig.theme || 'light',
        waveColor: widgetConfig.waveColor || '#0066cc',
        waveSecondaryColor: widgetConfig.waveSecondaryColor,
        waveSpeed: widgetConfig.waveSpeed || 'medium',
        waveCount: widgetConfig.waveCount || 3,
        width: widgetConfig.cardWidth || 800,
        height: widgetConfig.height || 120,
        hideTitle: widgetConfig.hideTitle || false,
        customTitle: widgetConfig.customTitle || ''
      },
      repoShowcase: {
        username: username,
        theme: widgetConfig.theme || 'default',
        showcaseRepos: widgetConfig.showcaseRepos || [],
        showStars: widgetConfig.showStars !== false,
        showForks: widgetConfig.showForks !== false,
        showLanguage: widgetConfig.showLanguage !== false,
        showDescription: widgetConfig.showDescription !== false,
        width: widgetConfig.cardWidth || 400,
        height: widgetConfig.height || 200,
        hideTitle: widgetConfig.hideTitle || false,
        customTitle: widgetConfig.customTitle || ''
      }
    };
  }, [
    username,
    widgetConfig.theme,
    widgetConfig.layoutStyle,
    widgetConfig.hideBorder,
    widgetConfig.hideTitle,
    widgetConfig.includeAllCommits,
    widgetConfig.includePrivate,
    widgetConfig.layoutCompact,
    widgetConfig.hideRank,
    widgetConfig.trophyTheme,
    widgetConfig.customTitle,
    widgetConfig.layout,
    widgetConfig.excludeRepos,
    widgetConfig.excludeLangs,
    widgetConfig.cardWidth,
    widgetConfig.showArea,
    widgetConfig.showDots,
    widgetConfig.height,
    widgetConfig.graphType,
    widgetConfig.skills,
    widgetConfig.animationDuration,
    widgetConfig.showProgressText,
    widgetConfig.progressBarHeight,
    widgetConfig.showPercentages,
    widgetConfig.waveColor,
    widgetConfig.waveSecondaryColor,
    widgetConfig.waveSpeed,
    widgetConfig.waveCount,
    widgetConfig.showcaseRepos,
    widgetConfig.showStars,
    widgetConfig.showForks,
    widgetConfig.showLanguage,
    widgetConfig.showDescription
  ]);

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
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">                            {block.widgetId === 'github-stats' ? 'GitHub Stats Widget' : 
                             block.widgetId === 'top-languages' ? 'Top Languages Widget' : 
                             block.widgetId === 'contribution-graph' ? 'Contribution Graph Widget' :
                             block.widgetId === 'wave-animation' ? 'Wave Animation Widget' :
                             block.widgetId === 'language-chart' ? 'Language Chart Widget' :
                             block.widgetId === 'repo-showcase' ? 'Repository Showcase Widget' :
                             block.widgetId === 'animated-progress' ? 'Animated Progress Widget' :
                             block.widgetId === 'typing-animation' ? 'Typing Animation Widget' :
                             'Social Stats Widget'}
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">                            {block.widgetId === 'github-stats' && (                              <GitHubStatsWidget 
                                config={memoizedConfigs.githubStats}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}{block.widgetId === 'social-stats' && (
                              <EnhancedSocialStatsWidget 
                                socials={socials}
                                theme={widgetConfig.theme || 'default'}
                                layout={widgetConfig.layout === 'compact' ? 'compact' : 'default'}
                                showAvatar={true}
                                showBio={false}
                                hideStats={[]}
                                customTitle={widgetConfig.customTitle}
                                enableAnimations={true}
                                showBorder={!widgetConfig.hideBorder}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}                            {block.widgetId === 'top-languages' && (
                              <TopLanguagesWidget
                                config={memoizedConfigs.topLanguages}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}                            {block.widgetId === 'contribution-graph' && (
                              <ContributionGraphWidget
                                config={memoizedConfigs.contributionGraph}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}{block.widgetId === 'wave-animation' && (
                              <WaveAnimationWidget
                                config={memoizedConfigs.waveAnimation}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}{block.widgetId === 'language-chart' && (
                              <LanguageChartWidget
                                config={memoizedConfigs.languageChart}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}                            {block.widgetId === 'repo-showcase' && (
                              <RepositoryShowcaseWidget
                                config={memoizedConfigs.repoShowcase}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}                            {block.widgetId === 'animated-progress' && (
                              <AnimatedProgressWidget
                                config={memoizedConfigs.animatedProgress}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}                            {block.widgetId === 'typing-animation' && (
                              <TypingAnimationWidget
                                config={memoizedConfigs.typingAnimation}
                                onMarkdownGenerated={handleMarkdownGenerated(block.id)}
                              />
                            )}
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

export default BuilderArea;
