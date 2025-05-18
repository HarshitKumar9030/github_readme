/**
 * Utility for GitHub-compatible markdown layouts and widgets
 * 
 * IMPORTANT: GitHub selectively sanitizes HTML in markdown files.
 * 
 * Allowed HTML elements:
 * - <div>, <img>, <details>, <summary> and more
 * 
 * Allowed attributes:
 * - align, src, alt, href, etc.
 * 
 * Removed attributes:
 * - style attributes
 * - class attributes
 * - id attributes
 * 
 * This file provides utilities to create GitHub-compatible layouts
 * using both pure markdown tables and allowed HTML elements.
 */

// Widget types for stats display
export type WidgetType = 'stats' | 'languages' | 'trophy' | 'streak' | 'contributions';

// Theme options for widgets
export type WidgetTheme = 'light' | 'dark' | 'radical' | 'merko' | 'gruvbox' | 'tokyonight' | 'onedark' | 'cobalt' | 'synthwave' | 'highcontrast' | 'dracula';

/**
 * GitHub Stats Widget configuration
 */
export interface GitHubStatsConfig {
  username: string;
  theme?: WidgetTheme;
  showIcons?: boolean;
  includeAllCommits?: boolean;
  countPrivate?: boolean;
  hideBorder?: boolean;
}

/**
 * Language Stats Widget configuration
 */
export interface LanguageStatsConfig {
  username: string;
  theme?: WidgetTheme;
  hideTitle?: boolean;
  layout?: 'compact' | 'normal';
  cardWidth?: number;
  langs_count?: number;
  hideBorder?: boolean;
}

/**
 * Trophy Widget configuration
 */
export interface TrophyConfig {
  username: string;
  theme?: WidgetTheme;
  column?: number;
  row?: number;
  noFrame?: boolean;
  margin?: 0 | 5 | 10 | 15 | 20;
}

/**
 * Streak Stats Widget configuration
 */
export interface StreakStatsConfig {
  username: string;
  theme?: WidgetTheme;
  hideTitle?: boolean;
  hideBorder?: boolean;
}

/**
 * Clean and optimize markdown for GitHub compatibility
 * @param markdown The markdown content with potential custom markup
 * @returns GitHub-compatible markdown content
 */
export function convertToGitHubCompatible(markdown: string): string {
  // Replace any HTML comments with nothing
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '');
  
  // Ensure proper spacing around headers for better rendering
  markdown = markdown.replace(/\n(#{1,6})\s/g, '\n\n$1 ');
  
  // Ensure images have proper spacing
  markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)(?!\n\n)/g, '![$1]($2)\n\n');
  
  // Ensure badges have consistent spacing
  const badgePattern = /(?:\[!\[(.*?)\]\((.*?)\)\]\((.*?)\))+/g;
  markdown = markdown.replace(badgePattern, match => {
    return `\n${match}\n\n`;
  });
  
  // Clean HTML elements that are allowed in GitHub markdown
  // Remove any class and style attributes, which GitHub sanitizes
  markdown = markdown.replace(/<([a-z][a-z0-9]*)\s+class="[^"]*"/gi, '<$1');
  markdown = markdown.replace(/<([a-z][a-z0-9]*)\s+style="[^"]*"/gi, '<$1');
  markdown = markdown.replace(/<([a-z][a-z0-9]*)\s+id="[^"]*"/gi, '<$1');
  
  // Ensure HTML tags have proper spacing for better rendering
  markdown = markdown.replace(/(<\/[a-z][a-z0-9]*>)(?!\n\n)/gi, '$1\n\n');
  
  // Fix common spacing issues
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  return markdown;
}

/**
 * Generate Markdown for a widget card with GitHub-compatible markup
 * @param type Widget type (stats, languages, trophy, streak)
 * @param title Widget title
 * @param imageSrc Image source URL
 * @param altText Image alt text
 * @param footerText Footer text
 * @returns Markdown string with GitHub-compatible formatting
 */
export function generateWidgetCardMarkdown(
  type: 'stats' | 'languages' | 'trophy' | 'streak',
  title: string,
  imageSrc: string,
  altText: string,
  footerText: string
): string {
  // For trophy widget, we need a different approach since they're wider
  const isFullWidth = type === 'trophy';
  
  if (isFullWidth) {
    // Use pure markdown with extra spacing for visual separation
    return `
## ${title}

![${altText}](${imageSrc})

${footerText}

`;
  }
  
  // For other widgets, use pure markdown
  return `### ${title}

![${altText}](${imageSrc})

${footerText}`;
}

/**
 * Generate a complete grid layout with widgets using GitHub-compatible Markdown
 * @param widgets Array of widget configurations
 * @param columns Number of columns (1, 2, or 3)
 * @returns Markdown string with GitHub-compatible formatting
 */
export function generateGridLayout(
  widgets: Array<{
    type: 'stats' | 'languages' | 'trophy' | 'streak';
    title: string;
    imageSrc: string;
    altText: string;
    footerText: string;
  }>,
  columns: 1 | 2 | 3 = 2
): string {
  // Start with an empty markdown string
  let markdown = '';
  
  // Handle different layout approaches based on column count
  if (columns === 1) {
    // For single column, just stack widgets vertically
    widgets.forEach(widget => {
      markdown += generateWidgetCardMarkdown(
        widget.type,
        widget.title,
        widget.imageSrc,
        widget.altText,
        widget.footerText
      );
      markdown += '\n\n';
    });
  } else {
    // For multiple columns, use markdown tables
    const widgetsToProcess = [...widgets]; // Copy array to avoid modifying the original
    
    while (widgetsToProcess.length > 0) {      // Handle trophy widgets separately (full width)
      if (widgetsToProcess[0]?.type === 'trophy') {
        const widget = widgetsToProcess.shift()!; // Remove and get the first widget
        
        // Add trophy widget using pure markdown - we'll use a full-width approach with markdown table
        markdown += `\n\n## ${widget.title}\n\n`;
        markdown += `![${widget.altText}](${widget.imageSrc})\n\n`;
        markdown += `${widget.footerText}\n\n`;
        
        continue;
      }
      
      // Process regular widgets in rows of 'columns'
      const rowWidgets = widgetsToProcess.splice(0, columns);
      
      // Create a markdown table row
      markdown += '| ' + rowWidgets.map(() => ' ').join(' | ') + ' |\n';
      markdown += '|' + rowWidgets.map(() => ':---:').join('|') + '|\n';
      markdown += '| ' + rowWidgets.map(widget => {
        return `![${widget.altText}](${widget.imageSrc})`;
      }).join(' | ') + ' |\n';
      markdown += '| ' + rowWidgets.map(widget => {
        return `**${widget.title}**<br>${widget.footerText}`;
      }).join(' | ') + ' |\n\n';
    }
  }
  
  return markdown;
}

/**
 * Generate a markdown grid layout for profile sections
 * @param sections Array of content sections
 * @param columns Number of columns
 * @returns Markdown string
 */
export function generateSectionGrid(
  sections: Array<{
    title: string;
    content: string;
    icon?: string;
  }>,
  columns: 1 | 2 | 3 = 2
): string {
  if (columns === 1) {
    // For single column, format as simple sections
    return sections.map(section => {
      // Use emojis instead of icon images where possible
      const iconMd = section.icon ? `${section.icon} ` : '';
      return `## ${iconMd}${section.title}\n\n${section.content}\n\n`;
    }).join('');
  }
  
  // For multiple columns, use GitHub-compatible markdown table
  let markdown = '';
  const sectionsToProcess = [...sections];
  
  while (sectionsToProcess.length > 0) {
    const rowSections = sectionsToProcess.splice(0, columns);
    
    // Table headers with emojis as icons
    markdown += '| ' + rowSections.map(section => {
      const iconMd = section.icon ? `${section.icon} ` : '';
      return `${iconMd}**${section.title}**`;
    }).join(' | ') + ' |\n';
    
    // Table alignment
    markdown += '|' + rowSections.map(() => ':---:').join('|') + '|\n';
    
    // Table content
    markdown += '| ' + rowSections.map(section => {
      return section.content;
    }).join(' | ') + ' |\n\n';
  }
  
  return markdown;
}

/**
 * Generate GitHub stats widget URL
 * @param config Stats widget configuration
 * @returns URL string for the GitHub stats image
 */
export function generateGitHubStatsUrl(config: GitHubStatsConfig): string {
  const params = new URLSearchParams();
  
  if (config.theme) params.append('theme', config.theme);
  if (config.showIcons !== undefined) params.append('show_icons', config.showIcons.toString());
  if (config.includeAllCommits !== undefined) params.append('include_all_commits', config.includeAllCommits.toString());
  if (config.countPrivate !== undefined) params.append('count_private', config.countPrivate.toString());
  if (config.hideBorder !== undefined) params.append('hide_border', config.hideBorder.toString());
  
  return `https://github-readme-stats.vercel.app/api?username=${config.username}&${params.toString()}`;
}

/**
 * Generate language stats widget URL
 * @param config Language stats configuration
 * @returns URL string for the languages stats image
 */
export function generateLanguageStatsUrl(config: LanguageStatsConfig): string {
  const params = new URLSearchParams();
  
  if (config.theme) params.append('theme', config.theme);
  if (config.hideTitle !== undefined) params.append('hide_title', config.hideTitle.toString());
  if (config.layout) params.append('layout', config.layout);
  if (config.cardWidth) params.append('card_width', config.cardWidth.toString());
  if (config.langs_count) params.append('langs_count', config.langs_count.toString());
  if (config.hideBorder !== undefined) params.append('hide_border', config.hideBorder.toString());
  
  return `https://github-readme-stats.vercel.app/api/top-langs/?username=${config.username}&${params.toString()}`;
}

/**
 * Generate trophy widget URL
 * @param config Trophy configuration
 * @returns URL string for the trophy image
 */
export function generateTrophyUrl(config: TrophyConfig): string {
  const params = new URLSearchParams();
  
  if (config.theme) params.append('theme', config.theme);
  if (config.column) params.append('column', config.column.toString());
  if (config.row) params.append('row', config.row.toString());
  if (config.noFrame !== undefined) params.append('no-frame', config.noFrame.toString());
  if (config.margin !== undefined) params.append('margin-w', config.margin.toString());
  
  return `https://github-profile-trophy.vercel.app/?username=${config.username}&${params.toString()}`;
}

/**
 * Generate streak stats widget URL
 * @param config Streak stats configuration
 * @returns URL string for the streak stats image
 */
export function generateStreakStatsUrl(config: StreakStatsConfig): string {
  const params = new URLSearchParams();
  
  if (config.theme) params.append('theme', config.theme);
  if (config.hideTitle !== undefined) params.append('hide_title', config.hideTitle.toString());
  if (config.hideBorder !== undefined) params.append('hide_border', config.hideBorder.toString());
  
  return `https://github-readme-streak-stats.herokuapp.com/?user=${config.username}&${params.toString()}`;
}

/**
 * Generate GitHub-compatible badges for your profile
 * @param badges Array of badge configurations
 * @returns Markdown string with aligned badges
 */
export function generateBadgeRow(
  badges: Array<{
    label: string;
    message: string;
    color: string;
    logo?: string;
    logoColor?: string;
    link?: string;
  }>,
  alignment: 'left' | 'center' | 'right' = 'center'
): string {
  // Use GitHub-compatible alignment with pure markdown
  let result = '';
  
  // Add alignment hint for center or right alignment using a table
  if (alignment === 'center' || alignment === 'right') {
    const alignChar = alignment === 'center' ? ':---:' : '---:';
    result += `<div align="${alignment}">\n\n`;
  }
  
  // Generate the badges
  const badgeMarkdown = badges.map(badge => {
    const logoParam = badge.logo ? `&logo=${badge.logo}` : '';
    const logoColorParam = badge.logoColor ? `&logoColor=${badge.logoColor}` : '';
    
    // Create shield.io compatible badge
    const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(badge.label)}-${encodeURIComponent(badge.message)}-${badge.color.replace('#', '')}?style=flat-square${logoParam}${logoColorParam}`;
    
    return badge.link 
      ? `[![${badge.label}](${badgeUrl})](${badge.link})`
      : `![${badge.label}](${badgeUrl})`;
  }).join(' ');
  
  result += badgeMarkdown;
  
  // Close alignment div if needed
  if (alignment === 'center' || alignment === 'right') {
    result += '\n\n</div>';
  }
  
  return result;
}

/**
 * Create GitHub-compatible profile header with avatar and text
 * @param name User's name
 * @param tagline Short description/tagline
 * @param avatarUrl URL to user's avatar image
 * @param alignment Text alignment
 * @returns Markdown string for profile header
 */
export function generateProfileHeader(
  name: string,
  tagline: string,
  avatarUrl?: string,
  alignment: 'left' | 'center' | 'right' = 'center'
): string {
  // GitHub allows the align attribute for div elements
  const alignWrapper = alignment !== 'left' 
    ? `<div align="${alignment}">\n\n` 
    : '';
  
  const avatarMarkdown = avatarUrl 
    ? `<img src="${avatarUrl}" alt="${name}" width="100" />\n\n`
    : '';
  
  const headerMarkdown = `# ${name}\n\n${tagline}\n\n`;
  
  return alignment !== 'left'
    ? `${alignWrapper}${avatarMarkdown}${headerMarkdown}</div>`
    : `${avatarMarkdown}${headerMarkdown}`;
}

/**
 * Creates a GitHub-compatible side-by-side layout using HTML divs with align attributes
 * @param columns Array of content blocks to display side-by-side
 * @param width Optional width value for each column (e.g., '48%')
 * @returns Markdown string with GitHub-compatible HTML markup
 */
export function generateSideBySideLayout(
  columns: Array<{
    content: string;
    align?: 'left' | 'center' | 'right';
  }>,
  width?: string
): string {
  // Width attribute will be ignored by GitHub but makes the preview look better
  const widthAttr = width ? ` width="${width}"` : ` width="48%"`;
  
  // GitHub allows the align attribute and will ignore width, but preserves the structure
  // Using inline-block in style will be stripped by GitHub but makes preview better
  return `
<div align="center">

${columns.map(column => {
  const alignment = column.align || 'left';
  return `<div align="${alignment}"${widthAttr} style="display: inline-block; vertical-align: top; margin: 0 4px;">\n\n${column.content}\n\n</div>`;
}).join('\n\n')}

</div>
`;
}

/**
 * Creates GitHub-compatible side-by-side layout for widgets or content using inline-block style divs
 * @param items Array of content items to display side-by-side
 * @returns Markdown string with GitHub-compatible HTML 
 */
export function generateInlineLayout(
  items: Array<{
    content: string; 
    width?: string;  // e.g., '45%'
    align?: 'left' | 'center' | 'right';
    isWidget?: boolean; // Flag to indicate if this is a GitHub widget (stat card)
  }>
): string {
  // For GitHub README, we have two good options:
  // 1. Using HTML with align attributes (works in most cases)
  // 2. Using markdown tables (better for widgets and stats)
  
  // Check if we have any widget content (like GitHub stat cards)
  const hasWidgets = items.some(item => 
    item.isWidget || 
    item.content.includes('github-readme-stats') || 
    item.content.includes('github-profile-trophy')
  );
  
  // For widgets, a table layout works better in GitHub
  if ((items.length >= 2 && items.length <= 4) && hasWidgets) {
    // Create a markdown table for side-by-side layout
    let markdown = `<div align="center">\n\n`;
    
    // Calculate rows and columns - arrange in 2 columns if more than 2 items
    const useDoubleRow = items.length > 2;
    const firstRow = useDoubleRow ? items.slice(0, 2) : items;
    const secondRow = useDoubleRow ? items.slice(2) : [];
    
    // First row
    markdown += '| ' + firstRow.map(() => ' ').join(' | ') + ' |\n';
    markdown += '|' + firstRow.map(() => ':---:').join('|') + '|\n';
    markdown += '| ' + firstRow.map(item => item.content).join(' | ') + ' |\n\n';
    
    // Second row if needed
    if (useDoubleRow && secondRow.length > 0) {
      // Add appropriate columns based on second row length
      markdown += '| ' + secondRow.map(() => ' ').join(' | ');
      if (secondRow.length === 1) markdown += ' | '; // Balance for single item
      markdown += ' |\n';
      
      markdown += '|' + secondRow.map(() => ':---:').join('|');
      if (secondRow.length === 1) markdown += '|'; // Balance for single item
      markdown += '|\n';
      
      // Add content row
      markdown += '| ' + secondRow.map(item => item.content).join(' | ');
      if (secondRow.length === 1) markdown += ' | '; // Balance for single item
      markdown += ' |\n\n';
    }
    
    markdown += '</div>\n\n';
    return markdown;
  }
  
  // For non-widget content or more complex layouts, use div-based approach
  // Create a container with GitHub-compatible alignment
  let markdown = `<div align="center">\n\n`;
  
  // Add each item with its own alignment as needed
  items.forEach((item) => {
    const alignment = item.align || 'center';
    const width = item.width || '48%';
    // Use simple div with align attribute - GitHub will ignore style but preserve structure
    markdown += `<div align="${alignment}" width="${width}" style="display: inline-block; vertical-align: top; margin: 0 4px;">\n\n${item.content}\n\n</div>\n\n`;
  });
    // Close the container
  markdown += `</div>`;
  
  return markdown;
}

/**
 * Creates a layout specifically optimized for GitHub stats cards
 * @param config Configuration for the GitHub stats layout
 * @returns Markdown string with GitHub-compatible table layout for stats cards
 */
export function generateGitHubStatsLayout(
  config: {
    username: string;
    theme?: WidgetTheme;
    layout?: 'side-by-side' | 'stats-languages' | 'trophies-stats' | 'all-widgets';
    showPrivate?: boolean;
    showIcons?: boolean;
    compactLanguages?: boolean;
  }
): string {
  const theme = config.theme || 'tokyonight';
  const username = config.username;
  
  // Generate URLs with appropriate parameters
  const statsParams = new URLSearchParams();
  statsParams.append('theme', theme);
  if (config.showIcons !== false) statsParams.append('show_icons', 'true');
  if (config.showPrivate) statsParams.append('count_private', 'true');
  statsParams.append('hide_border', 'true');
  
  const languagesParams = new URLSearchParams();
  languagesParams.append('theme', theme);
  languagesParams.append('hide_border', 'true');
  if (config.compactLanguages !== false) {
    languagesParams.append('layout', 'compact');
  }
  
  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${username}&${statsParams.toString()}`;
  const languagesUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&${languagesParams.toString()}`;
  const trophyUrl = `https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}&no-frame=true&margin-w=4`;
  const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=true`;
  
  let markdown = '';
  
  switch(config.layout || 'side-by-side') {
    case 'side-by-side':
      // Stats and Languages side by side
      markdown = `<div align="center">

| ![GitHub Stats](${statsUrl}) | ![Top Languages](${languagesUrl}) |
|----------------------------------------|--------------------------------------------|
| **My GitHub Statistics** | **My Top Languages** |

</div>`;
      break;
    
    case 'stats-languages':
      // Stat card on top, languages below with streak stats
      markdown = `<div align="center">

![GitHub Stats](${statsUrl})

| ![Most Used Languages](${languagesUrl}) | ![GitHub Streak](${streakUrl}) |
|--------------------------------------------------|------------------------------------------|

</div>`;
      break;
    
    case 'trophies-stats':
      // Trophies, then stats and languages side by side
      markdown = `<div align="center">

![Trophy](${trophyUrl})

| ![GitHub Stats](${statsUrl}) | ![Top Languages](${languagesUrl}) |
|----------------------------------------|--------------------------------------------|

</div>`;
      break;
    
    case 'all-widgets':
      // Full showcase with all widgets
      markdown = `<div align="center">

![Trophy](${trophyUrl})

| ![GitHub Stats](${statsUrl}) | ![Top Languages](${languagesUrl}) |
|----------------------------------------|--------------------------------------------|
| ![GitHub Streak](${streakUrl}) | ![Contributions Graph](https://activity-graph.herokuapp.com/graph?username=${username}&theme=${theme === 'light' ? 'minimal' : theme}) |

</div>`;
      break;
  }
  
  return markdown;
}
