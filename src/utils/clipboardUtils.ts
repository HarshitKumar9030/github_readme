/**
 * Clipboard utilities for GitHub README generation
 */

import { convertToGitHubCompatible } from './inlineStylesConverter';

/**
 * Copy GitHub-optimized markdown to clipboard
 * @param content - Raw markdown content
 * @returns Promise that resolves when copying is complete
 */
export async function copyGitHubMarkdown(content: string): Promise<void> {
  const githubCompatibleContent = convertToGitHubCompatible(content);
  
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(githubCompatibleContent);
      return;
    } catch (err) {
      console.warn('Modern clipboard API failed, falling back to legacy method:', err);
    }
  }
  
  // Fallback for older browsers or non-secure contexts
  const textArea = document.createElement('textarea');
  textArea.value = githubCompatibleContent;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textArea);
  }
}

/**
 * Get GitHub-compatible markdown content without copying
 * @param content - Raw markdown content
 * @returns GitHub-optimized markdown string
 */
export function getGitHubCompatibleMarkdown(content: string): string {
  return convertToGitHubCompatible(content);
}

/**
 * Validate if content is likely GitHub-compatible
 * @param content - Markdown content to validate
 * @returns Object with validation results
 */
export function validateGitHubCompatibility(content: string): {
  isCompatible: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for unsupported HTML attributes
  if (content.includes('class=') || content.includes('style=') || content.includes('id=')) {
    warnings.push('Contains HTML attributes that GitHub will remove (class, style, id)');
    suggestions.push('Use GitHub-compatible HTML or plain markdown instead');
  }
  
  // Check for unsupported HTML tags
  const unsupportedTags = ['script', 'iframe', 'object', 'embed', 'form', 'input'];
  for (const tag of unsupportedTags) {
    if (content.includes(`<${tag}`)) {
      warnings.push(`Contains unsupported HTML tag: ${tag}`);
      suggestions.push(`Remove <${tag}> tags or replace with supported alternatives`);
    }
  }
  
  // Check for proper heading spacing
  const improperHeadings = content.match(/\n#{1,6}[^\s]/g);
  if (improperHeadings) {
    warnings.push('Some headings may not render properly due to missing space after #');
    suggestions.push('Ensure there is a space after # symbols in headings');
  }
  
  // Check for excessive line breaks
  if (content.includes('\n\n\n')) {
    suggestions.push('Consider reducing excessive line breaks for cleaner formatting');
  }
  
  const isCompatible = warnings.length === 0;
  
  return {
    isCompatible,
    warnings,
    suggestions
  };
}

/**
 * Downloads GitHub-compatible markdown as a README.md file
 * @param content - The raw markdown content to process and download
 * @param filename - The filename to use for download (default: 'README.md')
 */
export const downloadGitHubMarkdown = (content: string, filename: string = 'README.md'): void => {
  try {
    const githubCompatibleContent = getGitHubCompatibleMarkdown(content);
    const blob = new Blob([githubCompatibleContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download markdown:', error);
    throw new Error('Failed to download markdown file');
  }
};