import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, query } = await req.json();

    if (!content || !query) {
      return NextResponse.json(
        { error: 'Content and query are required' },
        { status: 400 }
      );
    }

    // Here we would normally call Context7 to enhance the markdown
    // For now, we'll simulate the response since we don't have direct API access
    const enhancedContent = simulateContext7Enhancement(content, query);

    return NextResponse.json({ enhancedContent }, { status: 200 });
  } catch (error) {
    console.error('Error processing Context7 request:', error);
    return NextResponse.json(
      { error: 'Failed to process documentation' },
      { status: 500 }
    );
  }
}

// This function simulates what Context7 would do
function simulateContext7Enhancement(content: string, query: string) {
  // In a real implementation, this would call the Context7 API
  // For now, we'll just add some contextual information to the markdown

  // Find package references in markdown (like `react` or `next`)
  const packageRegex = /`([@\w\/-]+)`/g;
  const packages = new Set<string>();
  let match;
  
  while ((match = packageRegex.exec(content)) !== null) {
    packages.add(match[1]);
  }

  if (packages.size === 0) {
    return content;
  }

  // Add contextual information for each package found
  let enhancedContent = content;
  
  packages.forEach(pkg => {
    // Don't enhance if it's not a likely package name
    if (pkg.length < 3 || pkg.includes('/') && !pkg.startsWith('@')) return;
    
    const docInfo = getPackageDocInfo(pkg);
    if (!docInfo) return;
    
    // Add documentation after the first instance of the package name
    const pkgRegex = new RegExp(`\`${pkg}\``, 'i');
    enhancedContent = enhancedContent.replace(pkgRegex, `\`${pkg}\`\n\n> **Context7:** ${docInfo}`);
  });

  return enhancedContent;
}

function getPackageDocInfo(packageName: string) {
  // In a real implementation, this would be returned from Context7
  const packageInfo: Record<string, string> = {
    'react': 'A JavaScript library for building user interfaces. React lets you compose complex UIs from small and isolated pieces of code called "components".',
    'next': 'A React framework that enables functionality like server-side rendering and generating static websites for React based web applications.',
    'framer-motion': 'A production-ready motion library for React. Animate with ease using declarative animations.',
    'tailwindcss': 'A utility-first CSS framework for rapidly building custom user interfaces.',
    'typescript': 'A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    'react-markdown': 'Markdown component for React. It converts markdown text to a React component tree.',
    'remark-gfm': 'A plugin for remark that adds support for GitHub Flavored Markdown (GFM) features.',
    'katex': 'The fastest math typesetting library for the web.',
    'react-syntax-highlighter': 'Syntax highlighting component for React using the seriously super amazing lowlight and refractor.'
  };

  return packageInfo[packageName.toLowerCase()] || null;
}

// Set the proper configuration for Next.js route handlers
export const dynamic = 'force-dynamic';
