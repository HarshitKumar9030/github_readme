import { create } from 'zustand';

export interface TypingAnimationWidgetConfig {
  text?: string;
  font?: string;
  size?: number;
  color?: string;
  duration?: number;
  loop?: boolean;
  cursor?: boolean;
  width?: number;
  height?: number;
  hideTitle?: boolean;
  customTitle?: string;
  hideBorder?: boolean;
  theme?: string;
  speed?: number;
  pauseAfter?: number;
  cursorColor?: string;
  backgroundColor?: string;
  fontWeight?: string;
  centered?: boolean;
  shadow?: boolean;
  gradient?: string;
  borderRadius?: number;
}

export interface TypingAnimationState {
  svgUrl: string;
  loading: boolean;
  error: string | null;
  mounted: boolean;
  lastConfig: string;
  lastGenerated: number;
  isGenerating: boolean;
}

interface TypingAnimationActions {
  setMounted: (mounted: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSvgUrl: (url: string) => void;
  setError: (error: string | null) => void;
  setLastConfig: (config: string) => void;
  generateTypingAnimation: (config: TypingAnimationWidgetConfig) => Promise<void>;
  resetState: () => void;
}

type TypingAnimationStore = TypingAnimationState & TypingAnimationActions;

const urlCache = new Map<string, { url: string; timestamp: number; hits: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 100;

const cleanupCache = () => {
  const now = Date.now();
  const entries = Array.from(urlCache.entries())
    .filter(([_, data]) => now - data.timestamp < CACHE_DURATION)
    .sort((a, b) => b[1].hits - a[1].hits)
    .slice(0, MAX_CACHE_SIZE);
  
  urlCache.clear();
  entries.forEach(([key, value]) => urlCache.set(key, value));
};

// Helper function to generate typing animation parameters with validation
const generateTypingParams = (config: TypingAnimationWidgetConfig): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (config.text && config.text.trim()) {
    params.set('text', config.text.substring(0, 500));
  } else {
    params.set('text', 'Hello, I am a developer!');
  }
  
  if (config.font) params.set('fontFamily', config.font);
  if (config.size && config.size >= 8 && config.size <= 72) {
    params.set('fontSize', config.size.toString());
  }
  if (config.color && /^#[0-9A-F]{6}$/i.test(config.color)) {
    params.set('color', config.color);
  }
  if (config.cursorColor && /^#[0-9A-F]{6}$/i.test(config.cursorColor)) {
    params.set('cursorColor', config.cursorColor);
  }
  if (config.backgroundColor) {
    params.set('backgroundColor', config.backgroundColor);
  }
  
  // Animation properties with validation
  if (config.speed !== undefined && config.speed >= 50 && config.speed <= 2000) {
    params.set('speed', config.speed.toString());
  }
  if (config.duration && config.duration > 0) {
    const textLength = config.text?.length || 10;
    const speedFromDuration = Math.max(50, Math.min(2000, Math.floor(config.duration / textLength)));
    params.set('speed', speedFromDuration.toString());
  }
  if (config.pauseAfter !== undefined && config.pauseAfter >= 500 && config.pauseAfter <= 10000) {
    params.set('pauseAfter', config.pauseAfter.toString());
  }
  
  params.set('loop', (config.loop !== false).toString());
  params.set('cursor', (config.cursor !== false).toString());
  params.set('centered', (config.centered === true).toString());
  params.set('shadow', (config.shadow === true).toString());
  
  const width = config.width && config.width >= 100 && config.width <= 1200 ? config.width : 600;
  const height = config.height && config.height >= 50 && config.height <= 400 ? config.height : 100;
  params.set('width', width.toString());
  params.set('height', height.toString());
  
  if (config.fontWeight) params.set('fontWeight', config.fontWeight);
  if (config.gradient) params.set('gradient', config.gradient);
  if (config.borderRadius !== undefined) params.set('borderRadius', config.borderRadius.toString());
  
  params.set('theme', config.theme || 'default');
  
  return params;
};

export const useTypingAnimationStore = create<TypingAnimationStore>((set, get) => ({
  // State
  svgUrl: '',
  loading: false,
  error: null,
  mounted: false,
  lastConfig: '',
  lastGenerated: 0,
  isGenerating: false,

  setMounted: (mounted) => {
    set({ mounted });
  },
  
  setLoading: (loading) => set({ loading }),
  
  setSvgUrl: (url) => set({ svgUrl: url }),
  
  setError: (error) => set({ error, loading: false, isGenerating: false }),
  
  setLastConfig: (config) => set({ lastConfig: config }),
  
  resetState: () => {
    set({ 
      svgUrl: '', 
      loading: false, 
      error: null, 
      mounted: false, 
      lastConfig: '',
      lastGenerated: 0,
      isGenerating: false
    });
  },

  generateTypingAnimation: async (config: TypingAnimationWidgetConfig) => {
    const currentConfig = JSON.stringify(config);
    const currentTime = Date.now();
    
    // Don't regenerate if config hasn't changed and cache is still valid
    const { lastConfig, lastGenerated, isGenerating } = get();
    if (lastConfig === currentConfig && 
        currentTime - lastGenerated < CACHE_DURATION) {
      return;
    }

    if (isGenerating) {
      return;
    }
    
    const cachedEntry = urlCache.get(currentConfig);
    if (cachedEntry && currentTime - cachedEntry.timestamp < CACHE_DURATION) {
      cachedEntry.hits++;
      set({ 
        svgUrl: cachedEntry.url, 
        loading: false, 
        error: null,
        lastConfig: currentConfig,
        lastGenerated: currentTime,
        isGenerating: false
      });
      return;
    }

    set({ loading: true, error: null, isGenerating: true });

    try {
      if (!config.text || config.text.trim().length === 0) {
        throw new Error('Text is required for typing animation');
      }

      const params = generateTypingParams(config);
      const apiUrl = `/api/typing-animation?${params.toString()}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(apiUrl, {
          method: 'HEAD',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        urlCache.set(currentConfig, {
          url: apiUrl,
          timestamp: currentTime,
          hits: 1
        });

        if (urlCache.size > MAX_CACHE_SIZE) {
          cleanupCache();
        }

        set({ 
          svgUrl: apiUrl, 
          loading: false, 
          error: null,
          lastConfig: currentConfig,
          lastGenerated: currentTime,
          isGenerating: false
        });
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate typing animation';
      console.error('Typing animation generation error:', error);
      set({ 
        error: errorMessage, 
        loading: false, 
        isGenerating: false
      });
    }
  }
}));
