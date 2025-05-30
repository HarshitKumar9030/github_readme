import { create } from 'zustand';
import { GitHubStatsWidgetConfig } from '@/widgets/GitHubStatsWidget';

interface GitHubUser {
  login: string;
  id: number;
  name?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
  avatar_url: string;
}

interface GitHubStatsState {
  // Core state
  isLoading: boolean;
  error: string;
  githubData: GitHubUser | null;
  lastUsername: string;
  lastMarkdown: string;
  
  // Cache
  dataCache: Record<string, { data: GitHubUser; timestamp: number }>;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setGithubData: (data: GitHubUser | null) => void;
  setLastUsername: (username: string) => void;
  setLastMarkdown: (markdown: string) => void;
  fetchGithubData: (username: string) => Promise<void>;
  generateMarkdown: (config: GitHubStatsWidgetConfig) => string;
  clearCache: () => void;
  reset: () => void;
}

// Helper function to generate URLs for config
function generateUrlsForConfig(config: GitHubStatsWidgetConfig) {
  const effectiveConfig = {
    layoutType: config.layoutType || "stats",
    layoutStyle: config.layoutStyle || "side-by-side",
    showTrophies:
      config.showTrophies ??
      (config.layoutType === "trophies" || config.layoutType === "full"),
    showStreaks:
      config.showStreaks ??
      (config.layoutType === "streaks" || config.layoutType === "full"),
    showStats:
      config.showStats ??
      ["stats", "combined", "full"].includes(config.layoutType || ""),
  };

  if (!config.username) {
    return { statsUrl: "", trophyUrl: "", streakUrl: "", effectiveConfig };
  }

  // Stats URL
  const statsParams = new URLSearchParams({
    username: config.username,
    theme: config.theme || "default",
  });
  if (config.hideBorder) statsParams.append("hide_border", "true");
  if (config.hideTitle) statsParams.append("hide_title", "true");
  if (config.compactMode) statsParams.append("layout", "compact");
  if (config.showIcons) statsParams.append("show_icons", "true");
  if (config.includePrivate) statsParams.append("count_private", "true");
  if (config.includeAllCommits) statsParams.append("include_all_commits", "true");

  const statsUrl = effectiveConfig.showStats
    ? `https://github-readme-stats.vercel.app/api?${statsParams.toString()}`
    : "";

  // Trophy URL
  const trophyUrl = effectiveConfig.showTrophies
    ? `https://github-profile-trophy.vercel.app/?username=${config.username}&theme=${
        config.trophyTheme || "flat"
      }&margin-w=10&margin-h=10`
    : "";

  // Streak URL
  const streakUrl = effectiveConfig.showStreaks
    ? `https://github-readme-streak-stats.herokuapp.com/?user=${config.username}&theme=${
        config.streakTheme || config.theme || "default"
      }&hide_border=${config.hideBorder ? "true" : "false"}`
    : "";

  return { statsUrl, trophyUrl, streakUrl, effectiveConfig };
}

// Helper function to generate markdown
function generateMarkdownForConfig(config: GitHubStatsWidgetConfig): string {
  if (!config.username) return "";

  const { statsUrl, trophyUrl, streakUrl, effectiveConfig } = generateUrlsForConfig(config);

  let md = "";

  if (!config.hideTitle && config.customTitle) {
    md += `## ${config.customTitle}\n\n`;
  } else if (!config.hideTitle) {
    md += `## GitHub Stats\n\n`;
  }

  if (effectiveConfig.layoutStyle === "side-by-side") {
    md += `<div align="center">\n\n`;
    md += `<table border="0" cellspacing="10" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n<tr>\n`;

    if (effectiveConfig.showStats && statsUrl) {
      md += `<td align="center" valign="top" style="padding: 5px;">\n`;
      md += `<img src="${statsUrl}" alt="GitHub Stats" width="420" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }

    if (trophyUrl && effectiveConfig.showTrophies) {
      md += `<td align="center" valign="top" style="padding: 5px;">\n`;
      md += `<img src="${trophyUrl}" alt="GitHub Trophies" width="420" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }

    if (streakUrl && effectiveConfig.showStreaks) {
      md += `<td align="center" valign="top" style="padding: 5px;">\n`;
      md += `<img src="${streakUrl}" alt="GitHub Streak" width="420" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }

    md += `</tr>\n</table>\n\n</div>\n\n`;
  } else if (effectiveConfig.layoutStyle === "grid") {
    md += `<div align="center">\n\n`;
    md += `<table border="0" cellspacing="20" cellpadding="0" style="border-collapse: separate; margin: 0 auto;">\n`;

    md += `<tr>\n`;
    if (effectiveConfig.showStats && statsUrl) {
      md += `<td align="center" valign="top" style="padding: 10px;">\n`;
      md += `<img src="${statsUrl}" alt="GitHub Stats" width="400" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }
    if (trophyUrl && effectiveConfig.showTrophies) {
      md += `<td align="center" valign="top" style="padding: 10px;">\n`;
      md += `<img src="${trophyUrl}" alt="GitHub Trophies" width="400" height="195" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
    }
    md += `</tr>\n`;

    if (streakUrl && effectiveConfig.showStreaks) {
      md += `<tr>\n`;
      const colSpan = effectiveConfig.showStats && effectiveConfig.showTrophies ? "2" : "1";
      md += `<td colspan="${colSpan}" align="center" style="padding: 10px;">\n`;
      md += `<img src="${streakUrl}" alt="GitHub Streak" width="800" height="180" style="border-radius: 8px;" />\n`;
      md += `</td>\n`;
      md += `</tr>\n`;
    }

    md += `</table>\n\n</div>\n\n`;
  } else {
    md += `<div align="center">\n\n`;

    if (effectiveConfig.showStats && statsUrl) {
      md += `<img src="${statsUrl}" alt="GitHub Stats" width="500" height="195" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
    }

    if (trophyUrl && effectiveConfig.showTrophies) {
      md += `<img src="${trophyUrl}" alt="GitHub Trophies" width="500" height="160" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
    }

    if (streakUrl && effectiveConfig.showStreaks) {
      md += `<img src="${streakUrl}" alt="GitHub Streak" width="500" height="180" style="border-radius: 8px; margin: 10px 0;" />\n\n`;
    }

    md += `</div>\n\n`;
  }

  return md;
}

// Cache expiry time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

export const useGithubStatsStore = create<GitHubStatsState>((set, get) => ({
  // Initial state
  isLoading: false,
  error: '',
  githubData: null,
  lastUsername: '',
  lastMarkdown: '',
  dataCache: {},

  // Actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string) => set({ error }),
  
  setGithubData: (data: GitHubUser | null) => set({ githubData: data }),
  
  setLastUsername: (username: string) => set({ lastUsername: username }),
  
  setLastMarkdown: (markdown: string) => set({ lastMarkdown: markdown }),

  fetchGithubData: async (username: string) => {
    if (!username) {
      set({ githubData: null, error: '', isLoading: false });
      return;
    }

    const state = get();
    
    // Check if we already have this data and it's recent
    if (state.lastUsername === username && state.githubData) {
      return;
    }

    // Check cache
    const cached = state.dataCache[username];
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      set({ 
        githubData: cached.data, 
        error: '', 
        isLoading: false,
        lastUsername: username 
      });
      return;
    }

    set({ isLoading: true, error: '' });

    try {
      // Create headers with GitHub token if available
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-README-Generator'
      };
      
      // Add authorization header if token is available
      if (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      const response = await fetch(`https://api.github.com/users/${username}`, { headers });
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('GitHub API rate limit exceeded. Please try again later or add a GitHub token.');
        }
        throw new Error(`GitHub user not found: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update cache
      set(state => ({
        dataCache: {
          ...state.dataCache,
          [username]: { data, timestamp: Date.now() }
        },
        githubData: data,
        error: '',
        isLoading: false,
        lastUsername: username
      }));

    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch GitHub data',
        isLoading: false,
        githubData: null
      });
    }
  },
  generateMarkdown: (config: GitHubStatsWidgetConfig) => {
    const markdown = generateMarkdownForConfig(config);
    // Don't update store state during markdown generation to prevent re-renders
    return markdown;
  },

  clearCache: () => set({ dataCache: {} }),

  reset: () => set({
    isLoading: false,
    error: '',
    githubData: null,
    lastUsername: '',
    lastMarkdown: '',
    dataCache: {}
  })
}));

export { generateUrlsForConfig, generateMarkdownForConfig };
export type { GitHubUser };
