'use client';

// This is a temporary replacement for the AnimatedProgressWidget to resolve hydration issues
// The original implementation is stored in AnimatedProgressWidget.original.tsx
import DisabledAnimatedProgressWidget, { 
  AnimatedProgressWidgetConfig, 
  Skill 
} from './DisabledAnimatedProgressWidget';

export default DisabledAnimatedProgressWidget;
export type { 
  AnimatedProgressWidgetConfig,
  Skill 
};
