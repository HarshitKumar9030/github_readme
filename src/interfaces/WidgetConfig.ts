/**
 * Configuration options for widgets
 */
export interface WidgetConfig {
  theme: "light" | "dark" | "radical" | "tokyonight" | "merko" | "gruvbox";
  showIcons: boolean;
  includePrivateContributions: boolean;
  includePrivate: boolean;
  includeAllCommits: boolean;
  hideTitle: boolean;
  hideBorder: boolean;
  layoutCompact: boolean;
  hideRank: boolean;
  layout?: 'compact' | 'default';
  excludeRepos?: string;
  excludeLangs?: string;
  cardWidth?: number;
  customTitle?: string;
}
