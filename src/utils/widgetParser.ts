/**
 * Widget Parser Utility
 * 
 * This utility provides functionality to parse AI-generated markdown content
 * and extract widget information that can be converted back into editable components.
 */

export interface ParsedWidget {
  id: string;
  type: string;
  rawMarkdown: string;
  imageUrl: string;
  altText?: string;
  title?: string;
  parameters: Record<string, any>;
  position: {
    start: number;
    end: number;
    line: number;
  };
}

export interface WidgetParsingResult {
  widgets: ParsedWidget[];
  cleanedMarkdown: string;
  totalWidgets: number;
}

// Widget type detection patterns
const WIDGET_PATTERNS = {
  'github-stats': [
    /github-readme-stats\.vercel\.app/,
    /api\/github-stats-svg/,
    /github\.com\/anuraghazra\/github-readme-stats/
  ],
  'repository-showcase': [
    /api\/repo-showcase/,
    /repository-showcase/
  ],
  'typing-animation': [
    /api\/typing-animation/,
    /readme-typing-svg/,
    /typing-animation/
  ],
  'wave-animation': [
    /api\/wave-animation/,
    /wave-animation/
  ],
  'language-chart': [
    /api\/language-chart/,
    /language-chart/,
    /github-readme-stats.*\/top-langs/
  ],
  'animated-progress': [
    /api\/animated-progress/,
    /animated-progress/
  ],
  'contribution-graph': [
    /github-readme-activity-graph/,
    /contribution-graph/,
    /github\.com\/ashutosh00710\/github-readme-activity-graph/
  ]
};


export function detectWidgetType(url: string): string | null {
  for (const [type, patterns] of Object.entries(WIDGET_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(url))) {
      return type;
    }
  }
  return null;
}


export function extractUrlParameters(url: string): Record<string, any> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, any> = {};
    
    for (const [key, value] of urlObj.searchParams.entries()) {
      // Try to parse as number if it looks like one
      if (/^\d+$/.test(value)) {
        params[key] = parseInt(value, 10);
      } else if (/^\d*\.\d+$/.test(value)) {
        params[key] = parseFloat(value);
      } else if (value === 'true' || value === 'false') {
        params[key] = value === 'true';
      } else {
        params[key] = value;
      }
    }
    
    return params;
  } catch {
    return {};
  }
}


export function parseWidgetsFromMarkdown(markdown: string): WidgetParsingResult {
  const widgets: ParsedWidget[] = [];
  const lines = markdown.split('\n');
  // eslint-disable-next-line prefer-const
  let cleanedMarkdown = markdown;
  
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)(?:\s*"([^"]*)")?/g;
  let match;
  let widgetCounter = 0;
  
  while ((match = imageRegex.exec(markdown)) !== null) {
    const [fullMatch, altText, imageUrl, title] = match;
    const widgetType = detectWidgetType(imageUrl);
    
    if (widgetType) {
      widgetCounter++;
      
      const beforeMatch = markdown.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      
      const widget: ParsedWidget = {
        id: `parsed-widget-${widgetCounter}-${Date.now()}`,
        type: widgetType,
        rawMarkdown: fullMatch,
        imageUrl,
        altText: altText || undefined,
        title: title || undefined,
        parameters: extractUrlParameters(imageUrl),
        position: {
          start: match.index,
          end: match.index + fullMatch.length,
          line: lineNumber
        }
      };
      
      widgets.push(widget);
    }
  }
  
  widgets.sort((a, b) => a.position.start - b.position.start);
  
  return {
    widgets,
    cleanedMarkdown,
    totalWidgets: widgets.length
  };
}

export function widgetToMarkdown(widget: ParsedWidget): string {
  const altText = widget.altText || '';
  const title = widget.title ? ` "${widget.title}"` : '';
  return `![${altText}](${widget.imageUrl})${title}`;
}

/**
 * Replaces widgets in markdown with placeholders
 */
export function replaceWidgetsWithPlaceholders(
  markdown: string, 
  widgets: ParsedWidget[]
): string {
  let result = markdown;
  
  for (let i = widgets.length - 1; i >= 0; i--) {
    const widget = widgets[i];
    const placeholder = `<!-- WIDGET_PLACEHOLDER_${widget.id} -->`;
    
    result = result.substring(0, widget.position.start) + 
             placeholder + 
             result.substring(widget.position.end);
  }
  
  return result;
}

/**
 * Restores widgets from placeholders in markdown
 */
export function restoreWidgetsFromPlaceholders(
  markdown: string,
  widgets: ParsedWidget[]
): string {
  let result = markdown;
  
  for (const widget of widgets) {
    const placeholder = `<!-- WIDGET_PLACEHOLDER_${widget.id} -->`;
    const widgetMarkdown = widgetToMarkdown(widget);
    result = result.replace(placeholder, widgetMarkdown);
  }
  
  return result;
}

export function analyzeWidgetDistribution(widgets: ParsedWidget[]): {
  byType: Record<string, number>;
  byLine: Record<number, ParsedWidget[]>;
  totalCount: number;
} {
  const byType: Record<string, number> = {};
  const byLine: Record<number, ParsedWidget[]> = {};
  
  for (const widget of widgets) {
    // Count by type
    byType[widget.type] = (byType[widget.type] || 0) + 1;
    
    // Group by line
    if (!byLine[widget.position.line]) {
      byLine[widget.position.line] = [];
    }
    byLine[widget.position.line].push(widget);
  }
  
  return {
    byType,
    byLine,
    totalCount: widgets.length
  };
}


export async function validateWidgetUrl(url: string): Promise<{
  isValid: boolean;
  isAccessible: boolean;
  error?: string;
}> {
  try {
    new URL(url);
    
    // Try to fetch the URL (with no-cors mode for external URLs)
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    return {
      isValid: true,
      isAccessible: true
    };
  } catch (error) {
    return {
      isValid: false,
      isAccessible: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function generateWidgetSuggestions(markdown: string): {
  type: string;
  reason: string;
  confidence: number;
}[] {
  const suggestions: { type: string; reason: string; confidence: number; }[] = [];
  const content = markdown.toLowerCase();
  
  // GitHub stats suggestion
  if (content.includes('github') || content.includes('repository') || content.includes('commit')) {
    suggestions.push({
      type: 'github-stats',
      reason: 'Content mentions GitHub-related terms',
      confidence: 0.7
    });
  }
  
  if (content.includes('language') || content.includes('programming') || content.includes('code')) {
    suggestions.push({
      type: 'language-chart',
      reason: 'Content mentions programming languages',
      confidence: 0.6
    });
  }
  
  if (content.includes('project') || content.includes('repository') || content.includes('repo')) {
    suggestions.push({
      type: 'repository-showcase',
      reason: 'Content mentions projects or repositories',
      confidence: 0.6
    });
  }
  
  if (content.includes('developer') || content.includes('engineer') || content.includes('coder')) {
    suggestions.push({
      type: 'typing-animation',
      reason: 'Profile suggests developer role',
      confidence: 0.5
    });
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
