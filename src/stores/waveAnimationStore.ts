import { create } from 'zustand';
import { WaveAnimationWidgetConfig } from '@/widgets/WaveAnimationWidget';

export interface WaveAnimationState {
  svgUrl: string;
  loading: boolean;
  error: string | null;
  mounted: boolean;
  lastConfig: string; // JSON stringified config for comparison
  lastGenerated: number; // timestamp for cache invalidation
}

interface WaveAnimationActions {
  setMounted: (mounted: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSvgUrl: (url: string) => void;
  setError: (error: string | null) => void;
  setLastConfig: (config: string) => void;
  generateWaveAnimation: (config: WaveAnimationWidgetConfig) => Promise<void>;
  resetState: () => void;
}

type WaveAnimationStore = WaveAnimationState & WaveAnimationActions;

const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to generate wave animation parameters
const generateWaveParams = (config: WaveAnimationWidgetConfig): URLSearchParams => {
  const speedMap = {
    'slow': 0.5,
    'medium': 1.0,
    'fast': 2.0
  };

  const params = new URLSearchParams({
    color: config.waveColor || '#0099ff',
    waves: (config.waveCount || 3).toString(),
    speed: speedMap[config.waveSpeed || 'medium'].toString(),
    width: (config.width || 800).toString(),
    height: (config.height || 200).toString(),
    theme: config.theme || 'light'
  });

  // Add secondary color if provided and different from primary
  if (config.waveSecondaryColor && config.waveSecondaryColor !== config.waveColor) {
    params.set('secondaryColor', config.waveSecondaryColor);
  }

  return params;
};

const createCacheKey = (config: WaveAnimationWidgetConfig): string => {
  return JSON.stringify({
    waveColor: config.waveColor || '#0099ff',
    waveSecondaryColor: config.waveSecondaryColor || '#00ccff',
    waveSpeed: config.waveSpeed || 'medium',
    waveCount: config.waveCount || 3,
    width: config.width || 800,
    height: config.height || 200,
    theme: config.theme || 'light'
  });
};

export const useWaveAnimationStore = create<WaveAnimationStore>((set, get) => ({
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

  generateWaveAnimation: async (config: WaveAnimationWidgetConfig) => {
    const state = get();
    
    if (!state.mounted) return;

    const configKey = createCacheKey(config);
    
    // Check if config has actually changed
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
      const params = generateWaveParams(config);
      const url = `/api/wave-animation?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to generate wave animation: ${response.status} ${response.statusText}`);
      }

      // Cache the URL
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate wave animation';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      console.error('Wave animation generation error:', err);
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
