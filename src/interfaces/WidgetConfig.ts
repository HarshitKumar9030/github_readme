/**
 * Configuration options for widgets
 */
export interface WidgetConfig {
  theme: 'light' | 'dark' | 'radical' | 'tokyonight' | 'merko' | 'gruvbox';
  showIcons: boolean;
  includePrivate: boolean;
  layout: 'default' | 'compact';
  layoutStyle: 'side-by-side' | 'grid' | 'vertical';
  locale: string;
  includeAllCommits: boolean;
  hideTitle: boolean;
  hideBorder: boolean;
  hideRank: boolean;
  layoutCompact: boolean;
  showTrophies: boolean;
  showStreaks: boolean;
  showLanguages: boolean;
  showStats: boolean;
  trophyTheme: string;
  customTitle: string;
  excludeRepos?: string;
  excludeLangs?: string;
  cardWidth?: number;
  gridColumns?: 2 | 3 | 4;
  // Contribution graph specific properties
  showArea?: boolean;
  showDots?: boolean;
  height?: number;
  graphType?: 'line' | 'area' | 'compact';

  // Wave Animation SVG specific properties
  waveColor?: string;
  waveSecondaryColor?: string;
  waveSpeed?: 'slow' | 'medium' | 'fast';
  waveCount?: number;

  // Language Chart SVG specific properties
  showPercentages?: boolean;
  chartType?: 'pie' | 'donut';
  chartColors?: string[];  // Repository Showcase SVG specific properties
  showcaseRepos?: string[]; // Array of repo names to showcase (can be "reponame" or "owner/reponame")
  repoLayout?: 'single' | 'grid-2x1' | 'grid-2x2' | 'grid-3x1' | 'list';
  sortBy?: 'stars' | 'forks' | 'updated' | 'name' | 'created';
  repoLimit?: number;
  showStars?: boolean;
  showForks?: boolean;
  showLanguage?: boolean;
  showDescription?: boolean;
  showTopics?: boolean;
  showLastUpdated?: boolean;
  repoCardWidth?: number;
  repoCardHeight?: number;

     // Animated Progress SVG specific properties  skills?: { name: string; level: number; color?: string }[];
  animationDuration?: number;
  showProgressText?: boolean;
  progressBarHeight?: number;
}
