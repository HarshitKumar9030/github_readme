import { useReducer, useCallback, useEffect, useRef } from 'react';

// Unified widget state interface
export interface WidgetState {
  isLoading: boolean;
  error: string | null;
  content: string;
  mounted: boolean;
  lastUpdate: number;
}

// Widget actions
export type WidgetAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_MOUNTED'; payload: boolean }
  | { type: 'RESET' }
  | { type: 'UPDATE_SUCCESS'; payload: string };

// Widget reducer
const widgetReducer = (state: WidgetState, action: WidgetAction): WidgetState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_MOUNTED':
      return { ...state, mounted: action.payload };
    case 'RESET':
      return { 
        ...state, 
        isLoading: false, 
        error: null, 
        content: '', 
        lastUpdate: Date.now() 
      };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        content: action.payload,
        isLoading: false,
        error: null,
        lastUpdate: Date.now()
      };
    default:
      return state;
  }
};

// Initial state
const initialState: WidgetState = {
  isLoading: false,
  error: null,
  content: '',
  mounted: false,
  lastUpdate: 0
};

// Widget configuration interface
export interface UseWidgetConfig {
  enabled?: boolean;
  debounceMs?: number;
  retryCount?: number;
  cacheKey?: string;
}

// Main useWidget hook
export const useWidget = (
  widgetGenerator: () => Promise<string>,
  dependencies: any[],
  config: UseWidgetConfig = {}
) => {
  const {
    enabled = true,
    debounceMs = 300,
    retryCount = 2
  } = config;
  const [state, dispatch] = useReducer(widgetReducer, initialState);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const lastDepsRef = useRef<any[]>([]);

  // Check if dependencies actually changed (deep comparison)
  const dependenciesChanged = useCallback(() => {
    if (lastDepsRef.current.length !== dependencies.length) return true;
    return dependencies.some((dep, index) => {
      const lastDep = lastDepsRef.current[index];
      return JSON.stringify(dep) !== JSON.stringify(lastDep);
    });
  }, [dependencies]);

  // Generate widget content with error handling and retries
  const generateWidget = useCallback(async () => {
    if (!enabled || !state.mounted) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const content = await widgetGenerator();
      dispatch({ type: 'UPDATE_SUCCESS', payload: content });
      retryCountRef.current = 0;
    } catch (error) {
      console.error('Widget generation error:', error);
      
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        // Exponential backoff for retries
        setTimeout(() => generateWidget(), Math.pow(2, retryCountRef.current) * 1000);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        retryCountRef.current = 0;
      }
    }
  }, [widgetGenerator, enabled, state.mounted, retryCount]);
  // Debounced effect for widget generation
  useEffect(() => {
    if (!enabled || !dependenciesChanged()) return;

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      generateWidget();
      lastDepsRef.current = [...dependencies];
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [generateWidget, enabled, dependenciesChanged, debounceMs, dependencies]);

  // Mount effect
  useEffect(() => {
    dispatch({ type: 'SET_MOUNTED', payload: true });
    return () => {
      dispatch({ type: 'SET_MOUNTED', payload: false });
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Manual refresh function
  const refresh = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    generateWidget();
  }, [generateWidget]);

  // Reset function
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    retryCountRef.current = 0;
  }, []);

  return {
    ...state,
    refresh,
    reset
  };
};

// Specialized hook for API-based widgets
export const useApiWidget = (
  url: string | (() => string),
  dependencies: any[],
  config: UseWidgetConfig = {}
) => {
  const widgetGenerator = useCallback(async () => {
    const apiUrl = typeof url === 'function' ? url() : url;
    
    if (!apiUrl) {
      throw new Error('No URL provided');
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  }, [url]);

  return useWidget(widgetGenerator, dependencies, config);
};
