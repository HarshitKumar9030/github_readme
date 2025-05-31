import { create } from 'zustand';
import { LanguageChartWidgetConfig } from '@/widgets/LanguageChartWidget';
import { createAbsoluteUrl } from '@/utils/urlHelpers';

export interface LanguageChartState {
  svgUrl: string;
  loading: boolean;
  error: string | null;
  mounted: boolean;
  lastConfig: string; // JSON stringified config for comparison
  lastGenerated: number; // timestamp for cache invalidation
}

interface LanguageChartActions {
  setMounted: (mounted: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSvgUrl: (url: string) => void;
  setError: (error: string | null) => void;
  setLastConfig: (config: string) => void;
  generateLanguageChart: (config: LanguageChartWidgetConfig) => Promise<void>;
  resetState: () => void;
}

type LanguageChartStore = LanguageChartState & LanguageChartActions;

const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to generate language chart parameters
const generateChartParams = (config: LanguageChartWidgetConfig): URLSearchParams => {
  const params = new URLSearchParams({
    username: config.username,
    theme: config.theme || 'dark',
    size: (config.size || 400).toString(),
    chartType: config.chartType || 'donut',
    maxLanguages: Math.min(config.maxLanguages || 8, 8).toString()
  });

  if (config.minPercentage) {
    params.set('minPercentage', config.minPercentage.toString());
  }

  if (config.hideBorder) {
    params.set('hideBorder', 'true');
  }

  if (config.hideTitle) {
    params.set('hideTitle', 'true');
  }

  if (config.customTitle) {
    params.set('customTitle', config.customTitle);
  }

  if (config.showPercentages) {
    params.set('showPercentages', 'true');
  }

  return params;
};

const createCacheKey = (config: LanguageChartWidgetConfig): string => {
  return JSON.stringify({
    username: config.username,
    theme: config.theme || 'dark',
    size: config.size || 400,
    chartType: config.chartType || 'donut',
    maxLanguages: config.maxLanguages || 8,
    minPercentage: config.minPercentage,
    hideBorder: config.hideBorder,
    hideTitle: config.hideTitle,
    customTitle: config.customTitle,
    showPercentages: config.showPercentages
  });
};

export const useLanguageChartStore = create<LanguageChartStore>((set, get) => ({
  svgUrl: '',
  loading: false,
  error: null,
  mounted: false,
  lastConfig: '',
  lastGenerated: 0,

  setMounted: (mounted) => set({ mounted }),
  
  setLoading: (loading) => set({ loading, error: loading ? null : get().error }),
  
  setSvgUrl: (svgUrl) => set({ svgUrl, lastGenerated: Date.now() }),
  
  setError: (error) => set({ error, loading: false }),
  
  setLastConfig: (lastConfig) => set({ lastConfig }),

  generateLanguageChart: async (config: LanguageChartWidgetConfig) => {
    const state = get();
    
    if (!state.mounted) return;

    if (!config.username?.trim()) {
      set({ svgUrl: '', error: null, loading: false });
      return;
    }

    const configKey = createCacheKey(config);
    
    if (state.lastConfig === configKey && state.svgUrl) {
      return;
    }

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

    set({ loading: true, error: null, lastConfig: configKey });

    try {
      const params = generateChartParams(config);
      const url = createAbsoluteUrl(`/api/language-chart?${params.toString()}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User "${config.username}" not found on GitHub`);
        } else if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Failed to generate chart: ${response.status} ${response.statusText}`);
        }
      }

      urlCache.set(configKey, {
        url,
        timestamp: Date.now()
      });

      set({ 
        svgUrl: url, 
        loading: false, 
        error: null,
        lastGenerated: Date.now()
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate language chart';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      console.error('Language chart generation error:', err);
    }
  },

  resetState: () => set({
    svgUrl: '',
    loading: false,
    error: null,
    lastConfig: '',
    lastGenerated: 0
  })
}));
