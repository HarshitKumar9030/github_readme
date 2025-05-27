'use client';

import { WidgetConfig } from '@/interfaces/WidgetConfig';

interface ConfigOption {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'color' | 'text' | 'range' | 'textarea';
  defaultValue: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface ConfigPanelProps {
  config: Partial<WidgetConfig>;
  onChange: (config: Partial<WidgetConfig>) => void;
  title?: string;
  widgetType?: 'github-stats' | 'social-stats' | 'top-languages' | 'contribution-graph' | 'typing-animation' | 'wave-animation' | 'language-chart' | 'repo-showcase' | 'animated-progress';
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  config, 
  onChange, 
  title = 'Widget Configuration', 
  widgetType = 'github-stats'
}) => {
  const commonOptions: ConfigOption[] = [
    {
      id: 'theme',
      label: 'Theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'radical', label: 'Radical' },
        { value: 'tokyonight', label: 'Tokyo Night' },
        { value: 'merko', label: 'Merko' },
        { value: 'gruvbox', label: 'Gruvbox' }
      ]
    }
  ];  // GitHub stats specific options
  const githubStatsOptions: ConfigOption[] = [
    {
      id: 'showIcons',
      label: 'Show Icons',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'includePrivate',
      label: 'Include Private Contri.',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'includeAllCommits',
      label: 'Include All Commits',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'hideTitle',
      label: 'Hide Title',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideBorder',
      label: 'Hide Border',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideRank',
      label: 'Hide Rank',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'layoutCompact',
      label: 'Use Compact Layout',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'layoutStyle',
      label: 'Layout Style',
      type: 'select',
      defaultValue: 'side-by-side',
      options: [
        { value: 'side-by-side', label: 'Side by Side' },
        { value: 'grid', label: 'Grid Layout' },
        { value: 'vertical', label: 'Vertical Stack' }
      ]
    },
    {
      id: 'showTrophies',
      label: 'Show GitHub Trophies',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showStreaks',
      label: 'Show GitHub Streaks',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showLanguages',
      label: 'Show Top Languages',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'customTitle',
      label: 'Custom Title',
      type: 'text',
      defaultValue: ''
    },
    {
      id: 'trophyTheme',
      label: 'Trophy Theme',
      type: 'select',
      defaultValue: 'flat',
      options: [
        { value: 'flat', label: 'Flat' },
        { value: 'onedark', label: 'One Dark' },
        { value: 'gruvbox', label: 'Gruvbox' },
        { value: 'dracula', label: 'Dracula' },
        { value: 'tokyonight', label: 'Tokyo Night' },
        { value: 'nord', label: 'Nord' },
        { value: 'radical', label: 'Radical' }
      ]
    }
  ];

  // Top languages specific options
  const topLanguagesOptions: ConfigOption[] = [
    {
      id: 'layout',
      label: 'Layout',
      type: 'select',
      defaultValue: 'compact',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'compact', label: 'Compact' }
      ]
    },
    {
      id: 'includePrivate',
      label: 'Include Private Repos',
      type: 'toggle',
      defaultValue: false
    }
  ];  // Social stats specific options
  const socialStatsOptions: ConfigOption[] = [
    {
      id: 'compactMode',
      label: 'Compact Display',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideTitle',
      label: 'Hide Title',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideBorder',
      label: 'Hide Border',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideFollowers',
      label: 'Hide Followers Count',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideFollowing',
      label: 'Hide Following Count',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideRepos',
      label: 'Hide Repository Count',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'customTitle',
      label: 'Custom Title',
      type: 'text',
      defaultValue: ''
    },    {
      id: 'badgeStyle',
      label: 'Badge Style',
      type: 'select',
      defaultValue: 'for-the-badge',
      options: [
        { value: 'for-the-badge', label: 'For The Badge' },
        { value: 'flat', label: 'Flat' },
        { value: 'flat-square', label: 'Flat Square' },
        { value: 'plastic', label: 'Plastic' }
      ]
    }
  ];
  // Contribution Graph specific options
  const contributionGraphOptions: ConfigOption[] = [
    {
      id: 'theme',
      label: 'Theme',
      type: 'select',
      defaultValue: 'github',
      options: [
        { value: 'default', label: 'Default (Cotton Candy)' },
        { value: 'github', label: 'GitHub' },
        { value: 'github-compact', label: 'GitHub Compact' },
        { value: 'react', label: 'React' },
        { value: 'react-dark', label: 'React Dark' },
        { value: 'vue', label: 'Vue' },
        { value: 'vue-dark', label: 'Vue Dark' },
        { value: 'dracula', label: 'Dracula' },
        { value: 'merko', label: 'Merko' },
        { value: 'rogue', label: 'Rogue' },
        { value: 'tokyo-night', label: 'Tokyo Night' },
        { value: 'high-contrast', label: 'High Contrast' },
        { value: 'xcode', label: 'XCode' },
        { value: 'chartreuse-dark', label: 'Chartreuse Dark' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'ocean-dark', label: 'Ocean Dark' },
        { value: 'city-lights', label: 'City Lights' },
        { value: 'monokai', label: 'Monokai' },
        { value: 'shades-of-purple', label: 'Shades of Purple' },
        { value: 'nightowl', label: 'Night Owl' },
        { value: 'buefy', label: 'Buefy' },
        { value: 'blue-green', label: 'Blue Green' },
        { value: 'algolia', label: 'Algolia' },
        { value: 'great-gatsby', label: 'Great Gatsby' },
        { value: 'darcula', label: 'Darcula' },
        { value: 'bear', label: 'Bear' },
        { value: 'solarized-dark', label: 'Solarized Dark' },
        { value: 'solarized-light', label: 'Solarized Light' },
        { value: 'chartreuse-light', label: 'Chartreuse Light' },
        { value: 'nord', label: 'Nord' },
        { value: 'gotham', label: 'Gotham' },
        { value: 'material-palenight', label: 'Material Palenight' },
        { value: 'graywhite', label: 'Gray White' },
        { value: 'vision-friendly-dark', label: 'Vision Friendly Dark' },
        { value: 'ayu-mirage', label: 'Ayu Mirage' },
        { value: 'midnight-purple', label: 'Midnight Purple' },
        { value: 'calm', label: 'Calm' },
        { value: 'flag-india', label: 'Flag India' },
        { value: 'omni', label: 'Omni' },
        { value: 'jolly', label: 'Jolly' },
        { value: 'maroongold', label: 'Maroon Gold' },
        { value: 'yeblu', label: 'Yeblu' },
        { value: 'blueberry', label: 'Blueberry' },
        { value: 'slateorange', label: 'Slate Orange' },
        { value: 'kacho_ga', label: 'Kacho Ga' },
        { value: 'gruvbox', label: 'Gruvbox' },
        { value: 'radical', label: 'Radical' },
        { value: 'onedark', label: 'One Dark' },
        { value: 'cobalt', label: 'Cobalt' },
        { value: 'synthwave', label: 'Synthwave' }
      ]
    },
    {
      id: 'showArea',
      label: 'Show Area Graph',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'showDots',
      label: 'Show Data Points',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'height',
      label: 'Graph Height',
      type: 'select',
      defaultValue: '180',
      options: [
        { value: '120', label: '120px' },
        { value: '150', label: '150px' },
        { value: '180', label: '180px' },
        { value: '200', label: '200px' },
        { value: '220', label: '220px' },
        { value: '250', label: '250px' }
      ]
    },
    {
      id: 'graphType',
      label: 'Graph Type',
      type: 'select',
      defaultValue: 'line',
      options: [
        { value: 'line', label: 'Line Graph' },
        { value: 'area', label: 'Area Graph' },
        { value: 'bar', label: 'Bar Graph' }
      ]
    },
    {
      id: 'hideTitle',
      label: 'Hide Title',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'hideBorder',
      label: 'Hide Border',
      type: 'toggle',
      defaultValue: false
    },    {
      id: 'customTitle',
      label: 'Custom Title',
      type: 'text',
      defaultValue: ''
    }
  ];

  // Language Chart specific options
  const languageChartOptions: ConfigOption[] = [
    {
      id: 'username',
      label: 'GitHub Username',
      type: 'text',
      defaultValue: '',
      placeholder: 'Enter GitHub username (e.g., octocat, torvalds)'
    },
    {
      id: 'chartType',
      label: 'Chart Type',
      type: 'select',
      defaultValue: 'donut',
      options: [
        { value: 'donut', label: '🍩 Donut Chart' },
        { value: 'pie', label: '🥧 Pie Chart' },
        { value: 'bar', label: '📊 Bar Chart' }
      ]
    },
    {
      id: 'maxLanguages',
      label: 'Max Languages',
      type: 'select',
      defaultValue: 8,
      options: [
        { value: '3', label: 'Top 3' },
        { value: '5', label: 'Top 5' },
        { value: '8', label: 'Top 8' }
      ]
    },
    {
      id: 'size',
      label: 'Chart Size',
      type: 'range',
      defaultValue: 400,
      min: 300,
      max: 600,
      step: 50
    },
    {
      id: 'minPercentage',
      label: 'Minimum Percentage',
      type: 'range',
      defaultValue: 1,
      min: 0.5,
      max: 5,
      step: 0.5
    }
  ];
  // Repository Showcase specific options
  const repoShowcaseOptions: ConfigOption[] = [
    {
      id: 'username',
      label: 'GitHub Username',
      type: 'text',
      defaultValue: '',
      placeholder: 'Enter GitHub username'
    },
    {
      id: 'showcaseRepos',
      label: 'Showcase Repositories',
      type: 'textarea',
      defaultValue: '',
      placeholder: 'Enter repository names, comma-separated (e.g., repo1, repo2, repo3)'
    },
    {
      id: 'layout',
      label: 'Layout Style',
      type: 'select',
      defaultValue: 'single',
      options: [
        { value: 'single', label: 'Single Repository' },
        { value: 'grid-2x1', label: 'Grid 2×1 (2 repositories)' },
        { value: 'grid-2x2', label: 'Grid 2×2 (4 repositories)' },
        { value: 'grid-3x1', label: 'Grid 3×1 (3 repositories)' },
        { value: 'list', label: 'Vertical List' }
      ]
    },
    {
      id: 'sortBy',
      label: 'Sort Repositories By',
      type: 'select',
      defaultValue: 'stars',
      options: [
        { value: 'stars', label: 'Stars (Descending)' },
        { value: 'forks', label: 'Forks (Descending)' },
        { value: 'updated', label: 'Last Updated' },
        { value: 'name', label: 'Name (Alphabetical)' },
        { value: 'created', label: 'Date Created' }
      ]
    },
    {
      id: 'repoLimit',
      label: 'Repository Limit',
      type: 'select',
      defaultValue: 4,
      options: [
        { value: '1', label: '1 repository' },
        { value: '2', label: '2 repositories' },
        { value: '3', label: '3 repositories' },
        { value: '4', label: '4 repositories' },
        { value: '6', label: '6 repositories' }
      ]
    },
    {
      id: 'showStars',
      label: 'Show Stars',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showForks',
      label: 'Show Forks',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showLanguage',
      label: 'Show Language',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showDescription',
      label: 'Show Description',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'showTopics',
      label: 'Show Topics',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'showLastUpdated',
      label: 'Show Last Updated',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'cardWidth',
      label: 'Card Width',
      type: 'range',
      defaultValue: 400,
      min: 300,
      max: 600,
      step: 50
    },
    {
      id: 'cardHeight',
      label: 'Card Height',
      type: 'range',
      defaultValue: 200,
      min: 150,
      max: 300,
      step: 25
    }
  ];

  // Typing Animation specific options
  const typingAnimationOptions: ConfigOption[] = [
    {
      id: 'text',
      label: 'Text to Display',
      type: 'text',
      defaultValue: 'Hello, I am a developer!',
      placeholder: 'Enter text to animate'
    },
    {
      id: 'font',
      label: 'Font Family',
      type: 'select',
      defaultValue: 'monospace',
      options: [
        { value: 'monospace', label: 'Monospace' },
        { value: 'serif', label: 'Serif' },
        { value: 'sans-serif', label: 'Sans-serif' },
        { value: 'cursive', label: 'Cursive' },
        { value: 'fantasy', label: 'Fantasy' }
      ]
    },
    {
      id: 'size',
      label: 'Font Size',
      type: 'range',
      defaultValue: 20,
      min: 12,
      max: 48,
      step: 2
    },
    {
      id: 'color',
      label: 'Text Color',
      type: 'color',
      defaultValue: '#0066cc'
    },
    {
      id: 'duration',
      label: 'Animation Duration (ms)',
      type: 'range',
      defaultValue: 3000,
      min: 1000,
      max: 10000,
      step: 500
    },
    {
      id: 'loop',
      label: 'Loop Animation',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'cursor',
      label: 'Show Cursor',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'width',
      label: 'Animation Width',
      type: 'range',
      defaultValue: 600,
      min: 300,
      max: 800,
      step: 50
    },
    {
      id: 'height',
      label: 'Animation Height',
      type: 'range',
      defaultValue: 100,
      min: 50,
      max: 200,
      step: 25
    }
  ];

  // Wave Animation specific options
  const waveAnimationOptions: ConfigOption[] = [
    {
      id: 'waveColor',
      label: 'Primary Wave Color',
      type: 'color',
      defaultValue: '#0099ff'
    },
    {
      id: 'waveSecondaryColor',
      label: 'Secondary Wave Color',
      type: 'color',
      defaultValue: '#00ccff'
    },
    {
      id: 'waveSpeed',
      label: 'Wave Speed',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { value: 'slow', label: 'Slow' },
        { value: 'medium', label: 'Medium' },
        { value: 'fast', label: 'Fast' }
      ]
    },
    {
      id: 'waveCount',
      label: 'Number of Waves',
      type: 'select',
      defaultValue: 3,
      options: [
        { value: '1', label: '1 Wave' },
        { value: '2', label: '2 Waves' },
        { value: '3', label: '3 Waves' },
        { value: '4', label: '4 Waves' },
        { value: '5', label: '5 Waves' }
      ]    },
    {
      id: 'width',
      label: 'Wave Width',
      type: 'select',
      defaultValue: 800,
      options: [
        { value: '400', label: '400px' },
        { value: '600', label: '600px' },
        { value: '800', label: '800px' },
        { value: '1000', label: '1000px' },
        { value: '1200', label: '1200px' }
      ]
    },
    {
      id: 'height',
      label: 'Wave Height',
      type: 'select',
      defaultValue: 200,
      options: [
        { value: '100', label: '100px' },
        { value: '150', label: '150px' },
        { value: '200', label: '200px' },
        { value: '250', label: '250px' },
        { value: '300', label: '300px' }
      ]
    }
  ];

  // Animated Progress specific options
  const animatedProgressOptions: ConfigOption[] = [
    {
      id: 'skills',
      label: 'Skills (JSON Array)',
      type: 'text',
      defaultValue: '[{"name":"JavaScript","level":90},{"name":"TypeScript","level":85},{"name":"React","level":80}]'
    },
    {
      id: 'animationDuration',
      label: 'Animation Duration (ms)',
      type: 'select',
      defaultValue: 2000,
      options: [
        { value: '500', label: '0.5 seconds' },
        { value: '1000', label: '1 second' },
        { value: '1500', label: '1.5 seconds' },
        { value: '2000', label: '2 seconds' },
        { value: '3000', label: '3 seconds' },
        { value: '4000', label: '4 seconds' },
        { value: '5000', label: '5 seconds' }
      ]
    },
    {
      id: 'showProgressText',
      label: 'Show Progress Text',
      type: 'toggle',
      defaultValue: true
    },
    {
      id: 'progressBarHeight',
      label: 'Progress Bar Height',
      type: 'select',
      defaultValue: 20,
      options: [
        { value: '10', label: '10px' },
        { value: '15', label: '15px' },
        { value: '20', label: '20px' },
        { value: '25', label: '25px' },
        { value: '30', label: '30px' },
        { value: '40', label: '40px' },
        { value: '50', label: '50px' }
      ]
    }
  ];

  // Get options based on widget type
  const getOptionsForWidgetType = () => {
    switch (widgetType) {
      case 'github-stats':
        return [...commonOptions, ...githubStatsOptions];
      case 'top-languages':
        return [...commonOptions, ...topLanguagesOptions];
      case 'contribution-graph':
        return [...commonOptions, ...contributionGraphOptions];
      case 'social-stats':
        return [...commonOptions, ...socialStatsOptions];      case 'typing-animation':
        return [...commonOptions, ...typingAnimationOptions];
      case 'wave-animation':
        return [...commonOptions, ...waveAnimationOptions];
      case 'animated-progress':
        return [...commonOptions, ...animatedProgressOptions];
      case 'language-chart':
        return [...commonOptions, ...languageChartOptions];
      case 'repo-showcase':
        return [...commonOptions, ...repoShowcaseOptions];
      default:
        return commonOptions;
    }
  };

  const options = getOptionsForWidgetType();

  const handleChange = (id: string, value: any) => {
    onChange({
      ...config,
      [id]: value
    });
  };
  // Group options by category
  const themeOptions = options.filter(opt => opt.id === 'theme');
  const toggleOptions = options.filter(opt => opt.type === 'toggle');
  const otherOptions = options.filter(opt => opt.type !== 'toggle' && opt.id !== 'theme');

  // Render a text input
  const renderTextInput = (option: ConfigOption) => {
    const value = config[option.id as keyof typeof config] ?? option.defaultValue;
    
    return (
      <div key={option.id} className="mb-3">
        <label 
          htmlFor={`text-${option.id}`} 
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {option.label}
        </label>
        <input
          type="text"
          id={`text-${option.id}`}
          value={value}
          onChange={(e) => handleChange(option.id, e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={`Enter ${option.label.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <div className="rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      
      {/* Theme Selection */}
      {themeOptions.length > 0 && (
        <div className="mb-6">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 block">
            Appearance
          </label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions[0].options?.map((opt) => (
              <button
                key={opt.value}
                className={`h-10 rounded-md border transition-colors ${
                  config.theme === opt.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleChange('theme', opt.value)}
              >
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Toggle Options in Cards */}
      {toggleOptions.length > 0 && (
        <div className="mb-6">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 block">
            Features
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {toggleOptions.map((option) => {
              const isActive = config[option.id as keyof WidgetConfig] !== undefined
                ? config[option.id as keyof WidgetConfig] as boolean
                : option.defaultValue;
                
              return (
                <div 
                  key={option.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => handleChange(option.id, !isActive)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {option.id === 'showIcons' && (
                        <svg className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {option.id === 'includePrivate' && (
                        <svg className={`w-5 h-5 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}                      {option.id === 'includeAllCommits' && (
                        <svg className={`w-5 h-5 ${isActive ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )}
                      <span className={`text-sm font-medium ${isActive ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {option.label}
                      </span>
                    </div>
                    <div className="flex items-center h-5">
                      <input
                        id={`toggle-${option.id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={isActive}
                        onChange={(e) => handleChange(option.id, e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Other Options */}
      {otherOptions.length > 0 && (
        <div className="space-y-4">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 block">
            Other Settings
          </label>
          {otherOptions.map((option) => (
            <div key={option.id} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {option.label}
              </label>
              
              {option.type === 'select' && option.options && (
                <select
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={config[option.id as keyof WidgetConfig] !== undefined ?
                    config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                >
                  {option.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
              
              {option.type === 'color' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    className="h-8 w-8 p-0 rounded-md border border-gray-300 dark:border-gray-600"
                    value={config[option.id as keyof WidgetConfig] !== undefined ? 
                      config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                    onChange={(e) => handleChange(option.id, e.target.value)}
                  />
                  <input
                    type="text"
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={config[option.id as keyof WidgetConfig] !== undefined ? 
                      config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                    onChange={(e) => handleChange(option.id, e.target.value)}
                  />
                </div>
              )}
              
              {option.type === 'text' && (
                <input
                  type="text"
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={config[option.id as keyof WidgetConfig] !== undefined ? 
                    config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                />
              )}
              
              {option.type === 'range' && (
                <input
                  type="range"
                  min={option.min}
                  max={option.max}
                  step={option.step}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  value={config[option.id as keyof WidgetConfig] !== undefined ? 
                    config[option.id as keyof WidgetConfig] as number : option.defaultValue}
                  onChange={(e) => handleChange(option.id, Number(e.target.value))}
                />
              )}
              
              {option.type === 'textarea' && (
                <textarea
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={config[option.id as keyof WidgetConfig] !== undefined ? 
                    config[option.id as keyof WidgetConfig] as string : option.defaultValue}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                  rows={3}
                  placeholder={option.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
