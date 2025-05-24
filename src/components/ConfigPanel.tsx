'use client';


interface ConfigOption {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'color' | 'text';
  defaultValue: any;
  options?: { value: string; label: string }[];
}

export interface WidgetConfig {
  theme: 'light' | 'dark' | 'radical' | 'tokyonight' | 'merko' | 'gruvbox';
  showIcons: boolean;
  includePrivate: boolean;
  layout: 'default' | 'compact';
  layoutStyle: 'side-by-side' | 'grid' | 'vertical';
  locale: string;
  includeAllCommits: boolean;
  hideTitle: boolean;
  hideBorder: boolean;
  hideRank: boolean;
  layoutCompact: boolean;
  showTrophies: boolean;
  showStreaks: boolean;
  showLanguages: boolean;
  showStats: boolean;
  trophyTheme: string;
  customTitle: string;
  excludeRepos?: string;
  excludeLangs?: string;
  cardWidth?: number;
  gridColumns?: 2 | 3 | 4; // Added to support SocialStatsWidget
}

interface ConfigPanelProps {
  config: Partial<WidgetConfig>;
  onChange: (config: Partial<WidgetConfig>) => void;
  title?: string;
  widgetType?: 'github-stats' | 'social-stats' | 'top-languages';
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
    },
    {
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

  // Get options based on widget type
  const getOptionsForWidgetType = () => {
    switch (widgetType) {
      case 'github-stats':
        return [...commonOptions, ...githubStatsOptions];
      case 'top-languages':
        return [...commonOptions, ...topLanguagesOptions];
      case 'social-stats':
        return [...commonOptions, ...socialStatsOptions];
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
