import { create } from 'zustand';
import { RepositoryShowcaseWidgetConfig } from '@/widgets/RepositoryShowcaseWidget';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

export interface RepositoryShowcaseState {
  svgUrl: string;
  loading: boolean;
  error: string | null;
  mounted: boolean;
  lastConfig: string; // JSON stringified config for comparison
  lastGenerated: number; // timestamp for cache invalidation
}

interface RepositoryShowcaseActions {
  setMounted: (mounted: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSvgUrl: (url: string) => void;
  setError: (error: string | null) => void;
  setLastConfig: (config: string) => void;
  generateRepositoryShowcase: (config: RepositoryShowcaseWidgetConfig) => Promise<void>;
  resetState: () => void;
}

type RepositoryShowcaseStore = RepositoryShowcaseState & RepositoryShowcaseActions;

const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Debounce map to prevent rapid successive calls
const debounceMap = new Map<string, NodeJS.Timeout>();
const DEBOUNCE_DELAY = 500; // 500ms debounce

// Helper function to format repositories
const formatRepositories = (config: RepositoryShowcaseWidgetConfig): string[] => {
  const showcaseRepos = Array.isArray(config.showcaseRepos) ? config.showcaseRepos : [];
  
  return showcaseRepos.map((repo: any) => {
    if (typeof repo !== 'string') return ''; // Skip invalid entries
    
    // Clean the repo name (remove whitespace, newlines, and other control characters)
    const cleanRepo = repo.trim().replace(/[\n\r\t]/g, '');
    if (!cleanRepo) return '';
    
    if (cleanRepo.includes('/')) {
      return cleanRepo; // Already in owner/repo format
    } else if (config.username?.trim()) {
      return `${config.username}/${cleanRepo}`; // Add username as owner
    }
    return cleanRepo;
  }).filter((repo: string) => repo && repo.includes('/')); // Only keep valid owner/repo pairs
};

// Helper function to generate repository showcase parameters
const generateRepositoryParams = (config: RepositoryShowcaseWidgetConfig): URLSearchParams => {
  const formattedRepos = formatRepositories(config);
  
  // Calculate card dimensions based on cardSize
  const sizeMap = {
    small: { width: 300, height: 150 },
    medium: { width: 350, height: 175 },
    large: { width: 400, height: 200 }
  };
  const cardDims = sizeMap[config.cardSize || 'medium'];
    const params = new URLSearchParams({
    repos: formattedRepos.join(','),
    theme: config.theme || 'light',
    layout: config.repoLayout || 'single',
    sortBy: config.sortBy || 'stars',
    maxRepos: (config.maxRepos || 4).toString(),
    cardWidth: cardDims.width.toString(),
    cardHeight: cardDims.height.toString(),
    spacing: getSpacingValue(config.cardSpacing || 'normal').toString()
  });

  if (config.showStats !== undefined) {
    params.set('showStats', config.showStats.toString());
  }
  if (config.showLanguage !== undefined) {
    params.set('showLanguage', config.showLanguage.toString());
  }
  if (config.showDescription !== undefined) {
    params.set('showDescription', config.showDescription.toString());
  }
  if (config.showTopics !== undefined) {
    params.set('showTopics', config.showTopics.toString());
  }
  if (config.showLastUpdated !== undefined) {
    params.set('showLastUpdated', config.showLastUpdated.toString());
  }

  return params;
};

// Helper function to convert spacing names to pixel values
const getSpacingValue = (spacing: string): number => {
  const spacingMap = { tight: 5, normal: 10, loose: 15 };
  return spacingMap[spacing as keyof typeof spacingMap] || 10;
};

const createCacheKey = (config: RepositoryShowcaseWidgetConfig): string => {
  return JSON.stringify({
    username: config.username || '',
    showcaseRepos: Array.isArray(config.showcaseRepos) ? config.showcaseRepos : [],
    theme: config.theme || 'light',
    repoLayout: config.repoLayout || 'single',
    sortBy: config.sortBy || 'stars',
    maxRepos: config.maxRepos || 4,
    cardSize: config.cardSize || 'medium',
    cardSpacing: config.cardSpacing || 'normal',
    showStats: config.showStats !== false,
    showLanguage: config.showLanguage !== false,
    showDescription: config.showDescription !== false,
    showTopics: config.showTopics !== false,
    showLastUpdated: config.showLastUpdated !== false,
    hideBorder: config.hideBorder === true,
    hideTitle: config.hideTitle === true,
    customTitle: config.customTitle || ''
  });
};

export const useRepositoryShowcaseStore = create<RepositoryShowcaseStore>((set, get) => ({
  // Initial state
  svgUrl: '',
  loading: false,
  error: null,
  mounted: false,
  lastConfig: '',
  lastGenerated: 0,

  // Actions
  setMounted: (mounted) => set({ mounted }),
  
  setLoading: (loading) => set({ loading, error: loading ? null : get().error }),
  
  setSvgUrl: (svgUrl) => set({ svgUrl, lastGenerated: Date.now() }),
  
  setError: (error) => set({ error, loading: false }),
  
  setLastConfig: (lastConfig) => set({ lastConfig }),
  generateRepositoryShowcase: async (config: RepositoryShowcaseWidgetConfig) => {
    const state = get();
    
    if (!state.mounted) return;

    const configKey = createCacheKey(config);
    
    // Clear any existing debounce for this config
    const existingTimeout = debounceMap.get(configKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Check if config has actually changed
    if (state.lastConfig === configKey && state.svgUrl) {
      return;
    }

    // Ensure showcaseRepos is an array and has content
    const showcaseRepos = Array.isArray(config.showcaseRepos) ? config.showcaseRepos : [];
    if (showcaseRepos.length === 0) {
      set({ 
        svgUrl: '', 
        loading: false, 
        error: null,
        lastConfig: configKey 
      });
      return;
    }

    // Format repositories and check if any are valid
    const formattedRepos = formatRepositories(config);
    if (formattedRepos.length === 0) {
      set({ 
        svgUrl: '', 
        loading: false, 
        error: 'No valid repositories found. Please ensure repositories are in owner/repo format.',
        lastConfig: configKey 
      });
      return;
    }

    // Check cache first
    const cached = urlCache.get(configKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({ 
        svgUrl: cached.url, 
        lastConfig: configKey,
        lastGenerated: cached.timestamp,
        loading: false,
        error: null 
      });
      return;
    }

    // Set loading immediately for this config
    set({ loading: true, error: null, lastConfig: configKey });

    // Debounce the actual API call
    const timeoutId = setTimeout(async () => {
      try {
        const params = generateRepositoryParams(config);
        const url = createAbsoluteUrl(`/api/repo-showcase?${params.toString()}`);
        
        // Test the URL by making a request
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to generate repository showcase: ${response.status} ${response.statusText}`);
        }

        // Cache the URL
        urlCache.set(configKey, {
          url,
          timestamp: Date.now()
        });

        // Only update if this is still the current config
        const currentState = get();
        if (currentState.lastConfig === configKey) {
          set({ 
            svgUrl: url, 
            loading: false, 
            error: null,
            lastGenerated: Date.now()
          });
        }
      } catch (err) {
        // Only update error if this is still the current config
        const currentState = get();
        if (currentState.lastConfig === configKey) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to generate repository showcase';
          set({ 
            error: errorMessage, 
            loading: false 
          });
        }
        console.error('Repository showcase generation error:', err);
      } finally {
        debounceMap.delete(configKey);
      }
    }, DEBOUNCE_DELAY);

    debounceMap.set(configKey, timeoutId);
  },
  resetState: () => {
    // Clear any pending debounced calls
    debounceMap.forEach((timeout) => clearTimeout(timeout));
    debounceMap.clear();
    
    set({
      svgUrl: '',
      loading: false,
      error: null,
      lastConfig: '',
      lastGenerated: 0
    });
  }
}));
