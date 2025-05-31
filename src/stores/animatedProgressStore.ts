import { create } from 'zustand';

interface Skill {
  name: string;
  level: number;
  color?: string;
}

interface AnimatedProgressConfig {
  skills: Skill[];
  animationDuration?: number;
  showProgressText?: boolean;
  progressBarHeight?: number;
  hideTitle?: boolean;
  customTitle?: string;
  hideBorder?: boolean;
  width?: number;
  height?: number;
  theme?: string;
}

interface AnimatedProgressState {
  svgUrl: string;
  loading: boolean;
  error: string | null;
  lastConfigHash: string;
}

interface AnimatedProgressActions {
  generateSvg: (config: AnimatedProgressConfig) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

type AnimatedProgressStore = AnimatedProgressState & AnimatedProgressActions;

// Simple config hash function
const createConfigHash = (config: AnimatedProgressConfig): string => {
  return JSON.stringify(config);
};

export const useAnimatedProgressStore = create<AnimatedProgressStore>((set, get) => ({
  // State
  svgUrl: '',
  loading: false,
  error: null,
  lastConfigHash: '',

  // Actions
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),
  
  resetState: () => set({ svgUrl: '', loading: false, error: null, lastConfigHash: '' }),

  generateSvg: async (config: AnimatedProgressConfig) => {
    const currentHash = createConfigHash(config);
    
    // Don't regenerate if config hasn't changed
    if (get().lastConfigHash === currentHash && get().svgUrl) {
      return;
    }

    // Validate skills
    if (!config.skills || config.skills.length === 0) {
      set({ 
        error: 'No skills configured', 
        loading: false, 
        svgUrl: '',
        lastConfigHash: currentHash
      });
      return;
    }

    set({ loading: true, error: null, lastConfigHash: currentHash });

    try {
      // Build API URL
      const params = new URLSearchParams();
      
      // Convert skills to parameter format
      const skillsParam = config.skills
        .map(skill => `${encodeURIComponent(skill.name)}:${skill.level}${skill.color ? `:${skill.color}` : ''}`)
        .join(',');
        params.set('skills', skillsParam);
      params.set('animated', 'true');
      params.set('showPercentage', (config.showProgressText ?? true).toString());
      params.set('theme', config.theme || 'light');
      params.set('width', (config.width || 400).toString());
      params.set('height', (config.height || 300).toString());
      params.set('title', config.customTitle || 'Skills');
      
      if (config.animationDuration) {
        params.set('animationDuration', config.animationDuration.toString());
      }
      
      if (config.progressBarHeight) {
        params.set('barHeight', config.progressBarHeight.toString());
      }
      
      if (config.hideTitle) {
        params.set('hideTitle', 'true');
      }
      
      if (config.hideBorder) {
        params.set('hideBorder', 'true');
      }

      const apiUrl = `/api/animated-progress?${params.toString()}`;
      
      // Test the API endpoint
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      set({ svgUrl: apiUrl, loading: false, error: null });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate progress chart';
      set({ error: errorMessage, loading: false });
    }
  }
}));

export type { Skill, AnimatedProgressConfig };
