/**
 * Interface for components that can export markdown
 */
export interface MarkdownExportable {
  /**
   * Generate markdown representation of the component
   * @returns A string containing valid markdown
   */
  generateMarkdown: () => string;
  
  /**
   * Preview the component in its current state
   * @returns JSX Element for preview
   */
  renderPreview?: () => JSX.Element;
}

/**
 * Base widget configuration shared by all widgets
 */
export interface BaseWidgetConfig {
  theme: 'light' | 'dark' | 'radical' | 'tokyonight' | 'merko' | 'gruvbox';
}

/**
 * Base props for any widget component
 */
export interface BaseWidgetProps {
  onMarkdownGenerated?: (markdown: string) => void;
}
