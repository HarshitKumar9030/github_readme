import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract parameters with defaults
  const text = searchParams.get('text') || 'Hello, World!';
  const fontSize = parseInt(searchParams.get('fontSize') || '24');
  const color = searchParams.get('color') || '#3b82f6';
  const backgroundColor = searchParams.get('backgroundColor') || 'transparent';
  const theme = searchParams.get('theme') || 'default';
  const speed = parseFloat(searchParams.get('speed') || '150'); // milliseconds per character
  const cursor = searchParams.get('cursor') !== 'false';
  const cursorColor = searchParams.get('cursorColor') || color;
  const fontFamily = searchParams.get('fontFamily') || 'monospace';
  const width = parseInt(searchParams.get('width') || '800');
  const height = parseInt(searchParams.get('height') || '100');
  const loop = searchParams.get('loop') !== 'false';
  const pauseAfter = parseInt(searchParams.get('pauseAfter') || '2000'); // pause after typing completes
  
  // Theme configurations
  const themes = {
    default: { bg: 'transparent', text: '#3b82f6', accent: '#3b82f6' },
    dark: { bg: '#1a1a1a', text: '#ffffff', accent: '#00ff88' },
    matrix: { bg: '#000000', text: '#00ff00', accent: '#00ff00' },
    neon: { bg: '#0a0a0a', text: '#ff006e', accent: '#8338ec' },
    terminal: { bg: '#282c34', text: '#abb2bf', accent: '#61afef' },
    gradient: { bg: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', accent: '#ffffff' },
    ocean: { bg: '#0077be', text: '#ffffff', accent: '#00c9ff' },
    sunset: { bg: '#ff7e5f', text: '#ffffff', accent: '#feb47b' }
  };
  
  const currentTheme = themes[theme as keyof typeof themes] || themes.default;
  const finalBg = backgroundColor !== 'transparent' ? backgroundColor : currentTheme.bg;
  const finalColor = color !== '#3b82f6' ? color : currentTheme.text;
  const finalCursorColor = cursorColor !== color ? cursorColor : currentTheme.accent;
  
  // Calculate dimensions based on text length
  const charWidth = fontSize * 0.6;
  const estimatedTextWidth = text.length * charWidth;
  const finalWidth = width === 800 ? Math.max(estimatedTextWidth + 80, 300) : width;
  const finalHeight = height === 100 ? fontSize + 40 : height;
  
  // Create the typing animation timing
  const totalDuration = text.length * speed + pauseAfter;
  const typingDuration = text.length * speed;
  
  // Generate individual character animations
  const characterAnimations = text.split('').map((char, index) => {
    const delay = index * speed;
    const animationDelay = `${delay}ms`;
    return `
      .char-${index} {
        opacity: 0;
        animation: appear 0ms ${animationDelay} forwards;
      }
    `;
  }).join('');

  const svg = `
<svg width="${finalWidth}" height="${finalHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${finalWidth} ${finalHeight}">
  <defs>
    ${finalBg.startsWith('linear-gradient') ? `
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    ` : ''}
    
    <style>
      .typing-container {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        fill: ${finalColor};
        dominant-baseline: central;
        text-anchor: start;
      }
      
      ${characterAnimations}
      
      @keyframes appear {
        to { opacity: 1; }
      }
      
      .cursor {
        animation: blink 1s infinite ${loop ? `, cursor-move ${totalDuration}ms infinite` : `, cursor-move ${totalDuration}ms forwards`};
        fill: ${finalCursorColor};
        transform-origin: center;
      }
      
      @keyframes cursor-move {
        0% { transform: translateX(0); }
        ${(typingDuration / totalDuration) * 100}% { transform: translateX(${estimatedTextWidth}px); }
        100% { transform: translateX(${estimatedTextWidth}px); }
      }
      
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      .typing-text {
        ${loop ? `animation: reset-text ${totalDuration}ms infinite;` : ''}
      }
      
      ${loop ? `
      @keyframes reset-text {
        0%, 100% { }
        ${((totalDuration - pauseAfter) / totalDuration) * 100}% { }
      }
      ` : ''}
    </style>
  </defs>
  
  <!-- Background -->
  ${finalBg !== 'transparent' ? `
  <rect width="100%" height="100%" fill="${finalBg.startsWith('linear-gradient') ? 'url(#gradient)' : finalBg}" rx="8"/>
  ` : ''}
  
  <!-- Text container -->
  <g transform="translate(20, ${finalHeight / 2})" class="typing-text">
    <!-- Individual characters with staggered animation -->
    ${text.split('').map((char, index) => {
      const xPosition = index * charWidth;
      // Escape special characters for SVG
      const escapedChar = char === '<' ? '&lt;' : char === '>' ? '&gt;' : char === '&' ? '&amp;' : char;
      return `<text class="typing-container char-${index}" x="${xPosition}" y="0">${escapedChar}</text>`;
    }).join('')}
    
    <!-- Cursor -->
    ${cursor ? `
    <text class="typing-container cursor" x="0" y="0">|</text>
    ` : ''}
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
