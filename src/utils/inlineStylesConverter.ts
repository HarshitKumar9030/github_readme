/**
 * Utility to convert external CSS styles to inline styles for GitHub compatibility
 * This is necessary because GitHub doesn't support external CSS when rendering markdown
 */

// Map of CSS selectors to inline styles
export const gridLayoutStyles = {
  // Grid container styles
  gridContainer: `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
  `,
  // Grid container with 1 column
  gridContainer1Col: `
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1.5rem 0;
  `,
  // Grid container with 3 columns
  gridContainer3Col: `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
  `,
  // Widget card styles
  widgetCard: `
    border-radius: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  `,
  // Widget header
  widgetHeader: `
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
  `,
  // Widget header title
  widgetHeaderTitle: `
    margin: 0;
    font-size: 0.875rem;
    color: #4b5563;
  `,
  // Widget type badge
  widgetTypeBadge: `
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.375rem 0.625rem;
    background-color: #dbeafe;
    color: #1e40af;
    border-radius: 0.375rem;
  `,
  // Widget body
  widgetBody: `
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  // Widget image
  widgetImage: `
    width: 100%;
    height: auto;
    max-width: 100%;
    border-radius: 0.375rem;
  `,
  // Widget footer
  widgetFooter: `
    padding: 0.5rem 1rem;
    border-top: 1px solid #e5e7eb;
    font-size: 0.75rem;
    color: #6b7280;
    text-align: right;
  `,
  // Full-width widget (for trophies)
  fullWidthWidget: `
    grid-column: 1 / -1;
  `
};

/**
 * Convert markdown with grid layout classes to markdown with inline styles
 * @param markdown The markdown content with grid layout classes
 * @returns The markdown content with inline styles
 */
export function convertToInlineStyles(markdown: string): string {
  // Replace grid container with inline styles
  markdown = markdown.replace(
    /<div class="grid-widget-layout">/g, 
    '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">'
  );
  
  // Replace widget cards with inline styles
  markdown = markdown.replace(
    /<div class="widget-card h-full">/g, 
    '<div style="border-radius: 8px; overflow: hidden; background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">'
  );
  
  // Replace widget headers with inline styles
  markdown = markdown.replace(
    /<div class="widget-header">/g, 
    '<div style="padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; font-weight: 500;">'
  );
  
  // Replace widget header titles with inline styles
  markdown = markdown.replace(
    /<h3 class="flex items-center">/g, 
    '<h3 style="margin: 0; font-size: 0.875rem; color: #4b5563; display: flex; align-items: center;">'
  );
  
  // Replace widget type badges with inline styles
  markdown = markdown.replace(
    /<span class="text-xs font-medium px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">/g, 
    '<span style="font-size: 0.75rem; font-weight: 500; padding: 0.375rem 0.625rem; background-color: #dbeafe; color: #1e40af; border-radius: 0.375rem;">'
  );
  
  // Replace widget bodies with inline styles
  markdown = markdown.replace(
    /<div class="widget-body widget-compact flex items-center justify-center">/g, 
    '<div style="padding: 1rem; display: flex; align-items: center; justify-content: center;">'
  );
  
  // Replace widget images with inline styles
  markdown = markdown.replace(
    /class="rounded-md max-w-full"/g, 
    'style="width: 100%; height: auto; max-width: 100%; border-radius: 0.375rem;"'
  );
  
  // Replace widget footers with inline styles
  markdown = markdown.replace(
    /<div class="widget-footer">/g, 
    '<div style="padding: 0.5rem 1rem; border-top: 1px solid #e5e7eb; font-size: 0.75rem; color: #6b7280; text-align: right;">'
  );
  
  // Replace trophy widgets (full-width) with inline styles
  markdown = markdown.replace(
    /<div class="widget-trophy">/g, 
    '<div style="grid-column: 1 / -1;">'
  );
  
  return markdown;
}

/**
 * Generate HTML for a widget card with inline styles
 * @param type Widget type (stats, languages, trophy, streak)
 * @param title Widget title
 * @param imageSrc Image source URL
 * @param altText Image alt text
 * @param footerText Footer text
 * @returns HTML string with inline styles
 */
export function generateWidgetCardHTML(
  type: 'stats' | 'languages' | 'trophy' | 'streak',
  title: string,
  imageSrc: string,
  altText: string,
  footerText: string
): string {
  // Determine if the widget should be full width
  const isFullWidth = type === 'trophy';
  
  return `<div style="${isFullWidth ? gridLayoutStyles.fullWidthWidget : ''}">
  <div style="${gridLayoutStyles.widgetCard}">
    <div style="${gridLayoutStyles.widgetHeader}">
      <h3 style="${gridLayoutStyles.widgetHeaderTitle}">${title}</h3>
      <span style="${gridLayoutStyles.widgetTypeBadge}">${type}</span>
    </div>
    <div style="${gridLayoutStyles.widgetBody}">
      <img src="${imageSrc}" alt="${altText}" style="${gridLayoutStyles.widgetImage}" />
    </div>
    <div style="${gridLayoutStyles.widgetFooter}">
      <span>${footerText}</span>
    </div>
  </div>
</div>`;
}

/**
 * Generate a complete grid layout with widgets using inline styles
 * @param widgets Array of widget configurations
 * @param columns Number of columns (1, 2, or 3)
 * @returns HTML string with inline styles
 */
export function generateGridLayoutHTML(
  widgets: Array<{
    type: 'stats' | 'languages' | 'trophy' | 'streak';
    title: string;
    imageSrc: string;
    altText: string;
    footerText: string;
  }>,
  columns: 1 | 2 | 3 = 2
): string {
  // Select the appropriate grid container style based on columns
  let gridContainerStyle;
  if (columns === 1) {
    gridContainerStyle = gridLayoutStyles.gridContainer1Col;
  } else if (columns === 3) {
    gridContainerStyle = gridLayoutStyles.gridContainer3Col;
  } else {
    gridContainerStyle = gridLayoutStyles.gridContainer;
  }
  
  // Start with the grid container
  let html = `<div style="${gridContainerStyle}">\n`;
  
  // Add each widget
  widgets.forEach(widget => {
    html += generateWidgetCardHTML(
      widget.type,
      widget.title,
      widget.imageSrc,
      widget.altText,
      widget.footerText
    );
    html += '\n';
  });
  
  // Close the grid container
  html += '</div>';
  
  return html;
}
