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
  chartColors?: string[];

  // Repository Showcase SVG specific properties
  showcaseRepos?: string[]; // Array of repo names to showcase
  showStars?: boolean;
  showForks?: boolean;
  showLanguage?: boolean;
  showDescription?: boolean;

     // Animated Progress SVG specific properties
  skills?: { name: string; level: number; color?: string }[];
  animationDuration?: number;
  showProgressText?: boolean;
  progressBarHeight?: number;

  // Typing Animation SVG specific properties
  text?: string;
  font?: string;
  size?: number;
  color?: string;
  duration?: number;
  loop?: boolean;
  cursor?: boolean;
  width?: number;
}
