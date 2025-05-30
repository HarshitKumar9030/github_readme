import { create } from 'zustand';
import { getGithubStats } from '@/services/socialStats';
import { SocialStats, SocialStatsWidgetConfig } from '@/widgets/SocialStatsWidget';

interface SocialStatsState {
  stats: SocialStats;
  loading: boolean;
  error: string | null;
  mounted: boolean;
  viewMode: 'preview' | 'markdown';
  copied: boolean;
  showConfig: boolean;
  lastUsername: string;
  lastMarkdown: string;
}

interface SocialStatsActions {
  setMounted: (mounted: boolean) => void;
  setLoading: (loading: boolean) => void;
  setStats: (stats: Partial<SocialStats>) => void;
  setError: (error: string | null) => void;
  setViewMode: (viewMode: 'preview' | 'markdown') => void;
  setCopied: (copied: boolean) => void;
  toggleConfig: () => void;
  resetGithubStats: () => void;
  setLastUsername: (username: string) => void;
  setLastMarkdown: (markdown: string) => void;
  fetchGithubStats: (username: string) => Promise<void>;
}

type SocialStatsStore = SocialStatsState & SocialStatsActions;

const githubDataCache = new Map<string, { data: SocialStats['github']; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSocialStatsStore = create<SocialStatsStore>((set, get) => ({
  stats: {},
  loading: false,
  error: null,
  mounted: false,
  viewMode: 'preview',
  copied: false,
  showConfig: false,
  lastUsername: '',
  lastMarkdown: '',

  setMounted: (mounted) => set({ mounted }),
  
  setLoading: (loading) => set({ loading, error: loading ? null : get().error }),
  
  setStats: (newStats) => set((state) => ({ 
    stats: { ...state.stats, ...newStats }, 
    loading: false, 
    error: null 
  })),
  
  setError: (error) => set({ error, loading: false }),
  
  setViewMode: (viewMode) => set({ viewMode }),
  
  setCopied: (copied) => set({ copied }),
  
  toggleConfig: () => set((state) => ({ showConfig: !state.showConfig })),
  
  resetGithubStats: () => set((state) => ({ 
    stats: { ...state.stats, github: undefined } 
  })),
  
  setLastUsername: (lastUsername) => set({ lastUsername }),
  
  setLastMarkdown: (lastMarkdown) => set({ lastMarkdown }),

  fetchGithubStats: async (username: string) => {
    const state = get();
    
    if (state.lastUsername === username) {
      return;
    }

    const cached = githubDataCache.get(username);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({ 
        stats: { ...state.stats, github: cached.data },
        lastUsername: username,
        loading: false,
        error: null
      });
      return;
    }

    set({ loading: true, error: null, lastUsername: username });

    try {
      const githubStats = await getGithubStats(username);
      const githubData = {
        followers: githubStats.followers,
        following: githubStats.following,
        repositories: githubStats.public_repos,
        avatar: githubStats.avatar_url,
        name: githubStats.name,
        bio: githubStats.bio
      };

      // Cache the data
      githubDataCache.set(username, {
        data: githubData,
        timestamp: Date.now()
      });

      set((state) => ({ 
        stats: { ...state.stats, github: githubData },
        loading: false,
        error: null
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub stats';
      set({ 
        error: errorMessage.includes('429') 
          ? 'Rate limit exceeded. Please try again later.' 
          : 'Failed to fetch GitHub stats',
        loading: false
      });
      console.error(err);
    }
  }
}));
