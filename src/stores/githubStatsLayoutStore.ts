import { create } from 'zustand';
import { WidgetTheme } from '@/utils/inlineStylesConverter';

// Widget arrangement options
type WidgetArrangement = 'sideBySide' | 'statsLanguages' | 'allWidgets';

interface GitHubStatsLayoutState {
  // UI State
  arrangement: WidgetArrangement;
  theme: WidgetTheme;
  showPrivate: boolean;
  compactLanguages: boolean;
  showIcons: boolean;
  lastMarkdown: string;
  
  // Actions
  setArrangement: (arrangement: WidgetArrangement) => void;
  setTheme: (theme: WidgetTheme) => void;
  setShowPrivate: (showPrivate: boolean) => void;
  setCompactLanguages: (compactLanguages: boolean) => void;
  setShowIcons: (showIcons: boolean) => void;
  setLastMarkdown: (markdown: string) => void;
  generateMarkdown: (username: string) => string;
  reset: () => void;
}

export const useGithubStatsLayoutStore = create<GitHubStatsLayoutState>((set, get) => ({
  // Initial state
  arrangement: 'sideBySide',
  theme: 'tokyonight',
  showPrivate: false,
  compactLanguages: true,
  showIcons: true,
  lastMarkdown: '',

  // Actions
  setArrangement: (arrangement: WidgetArrangement) => set({ arrangement }),
  
  setTheme: (theme: WidgetTheme) => set({ theme }),
  
  setShowPrivate: (showPrivate: boolean) => set({ showPrivate }),
  
  setCompactLanguages: (compactLanguages: boolean) => set({ compactLanguages }),
  
  setShowIcons: (showIcons: boolean) => set({ showIcons }),
  
  setLastMarkdown: (markdown: string) => set({ lastMarkdown: markdown }),
  generateMarkdown: (username: string) => {
    const state = get();
    
    // Helper function to generate GitHub Stats URL with parameters
    const generateStatsUrl = () => {
      const params = new URLSearchParams();
      params.append('theme', state.theme);
      params.append('show_icons', String(state.showIcons));
      params.append('count_private', String(state.showPrivate));
      params.append('hide_border', 'true');
      return `https://github-readme-stats.vercel.app/api?username=${username}&${params.toString()}`;
    };

    // Helper function to generate Top Languages URL with parameters
    const generateLanguagesUrl = () => {
      const params = new URLSearchParams();
      params.append('theme', state.theme);
      params.append('hide_border', 'true');
      if (state.compactLanguages) {
        params.append('layout', 'compact');
      }
      return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&${params.toString()}`;
    };

    let markdown = '';
    
    switch (state.arrangement) {
      case 'sideBySide':        
        markdown = `<div align="center">

<table>
<tr>
<td>

![Github Stats](${generateStatsUrl()})

</td>
<td>

![Top Languages](${generateLanguagesUrl()})

</td>
</tr>
<tr>
<td align="center">

**My GitHub Statistics**

</td>
<td align="center">

**My Top Languages**

</td>
</tr>
</table>

</div>`;
        break;
        
      case 'statsLanguages':
        // Stat card on top, languages below in a table layout
        markdown = `<div align="center">

![GitHub Stats](${generateStatsUrl()})

<table>
<tr>
<td>

![Most Used Languages](${generateLanguagesUrl()})

</td>
<td>

![GitHub Stats Details](${generateStatsUrl()}&include_all_commits=true&count_private=true)

</td>
</tr>
</table>

</div>`;
        break;
        
      case 'allWidgets':       
        markdown = `<div align="center">

<table>
<tr>
<td>

![GitHub Stats](${generateStatsUrl()})

</td>
<td>

![Top Languages](${generateLanguagesUrl()})

</td>
</tr>
<tr>
<td colspan="2">

![Contributions Graph](https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${state.theme === 'light' ? 'default' : state.theme}&area=true&hide_border=true)

</td>
</tr>
</table>

</div>`;
        break;
        
      default:
        markdown = `<div align="center">

![GitHub Stats](${generateStatsUrl()})

![Top Languages](${generateLanguagesUrl()})

</div>`;
        break;
    }
    
    // Don't update store state during markdown generation to prevent re-renders
    return markdown;
  },

  reset: () => set({
    arrangement: 'sideBySide',
    theme: 'tokyonight',
    showPrivate: false,
    compactLanguages: true,
    showIcons: true,
    lastMarkdown: ''
  })
}));

export type { WidgetArrangement };
