
/**
 * Types of blocks that can be used in the README builder
 */
export type BlockType = "template" | "widget" | "content";

/**
 * Base interface for all block types
 */
export interface BlockBase {
  id: string;
  type: BlockType;
  label: string;
  blockLayout?: "default" | "side-by-side" | "grid";
}

/**
 * Template block representing pre-defined README templates
 */
export interface TemplateBlock extends BlockBase {
  type: "template";
  templateId: string;
}

/**
 * Widget block representing dynamic components like GitHub stats
 */
export interface WidgetBlock extends BlockBase {
  type: "widget";
  widgetId: string;
  theme?: "light" | "dark" | "radical" | "tokyonight" | "merko" | "gruvbox";
  includePrivate?: boolean;
  size?: "small" | "medium" | "large";
}

/**
 * Content block representing custom markdown content
 */
export interface ContentBlock extends BlockBase {
  type: "content";
  content: string;
  layout?: "flow" | "inline" | "grid";
}

/**
 * Union type of all possible block types
 */
export type Block = TemplateBlock | WidgetBlock | ContentBlock;
