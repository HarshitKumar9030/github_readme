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
}
