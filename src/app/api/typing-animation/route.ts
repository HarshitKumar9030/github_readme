import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface TypingAnimationParams {
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  theme: string;
  speed: number;
  cursor: boolean;
  cursorColor: string;
  fontFamily: string;
  fontWeight: string;
  width: number;
  height: number;
  loop: boolean;
  pauseAfter: number;
  gradient?: string;
  shadow?: boolean;
  centered?: boolean;
  borderRadius?: number;
}

// Utility function to escape XML/SVG special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

function parseGradient(gradient: string): string[] {
  return gradient.split(',').map(color => color.trim()).filter(color => isValidHexColor(color) || color.startsWith('#'));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const text = searchParams.get('text') || 'Hello, World!';
    if (text.length > 500) {
      return new NextResponse('Text too long (max 500 characters)', { status: 400 });
    }
    
    const fontSize = Math.max(8, Math.min(72, parseInt(searchParams.get('fontSize') || '24')));
    const rawColor = searchParams.get('color') || '#3b82f6';
    const color = isValidHexColor(rawColor) ? rawColor : '#3b82f6';
    const backgroundColor = searchParams.get('backgroundColor') || 'transparent';
    const theme = searchParams.get('theme') || 'default';
    const speed = Math.max(50, Math.min(2000, parseFloat(searchParams.get('speed') || '150')));
    const cursor = searchParams.get('cursor') !== 'false';
    const rawCursorColor = searchParams.get('cursorColor') || color;
    const cursorColor = isValidHexColor(rawCursorColor) ? rawCursorColor : color;
    const fontFamily = searchParams.get('fontFamily') || 'monospace';
    const fontWeight = searchParams.get('fontWeight') || 'normal';
    const width = Math.max(100, Math.min(1200, parseInt(searchParams.get('width') || '600')));
    const height = Math.max(50, Math.min(400, parseInt(searchParams.get('height') || '100')));
    const loop = searchParams.get('loop') !== 'false';
    const pauseAfter = Math.max(500, Math.min(10000, parseInt(searchParams.get('pauseAfter') || '2000')));
    const gradient = searchParams.get('gradient');
    const shadow = searchParams.get('shadow') === 'true';
    const centered = searchParams.get('centered') === 'true';
    const borderRadius = Math.max(0, Math.min(50, parseInt(searchParams.get('borderRadius') || '0')));
    
    const themes = {
      default: { bg: 'transparent', text: '#3b82f6', accent: '#3b82f6' },
      dark: { bg: '#1a1a1a', text: '#ffffff', accent: '#00ff88' },
      matrix: { bg: '#000000', text: '#00ff00', accent: '#00ff00' },
      neon: { bg: '#0a0a0a', text: '#ff006e', accent: '#8338ec' },
      terminal: { bg: '#282c34', text: '#abb2bf', accent: '#61afef' },
      gradient: { bg: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', accent: '#ffffff' },
      ocean: { bg: '#0077be', text: '#ffffff', accent: '#00c9ff' },
      sunset: { bg: '#ff7e5f', text: '#ffffff', accent: '#feb47b' },
      forest: { bg: '#2d5016', text: '#a3e635', accent: '#65a30d' },
      purple: { bg: '#581c87', text: '#c084fc', accent: '#a855f7' },
      minimal: { bg: '#ffffff', text: '#374151', accent: '#6b7280' },
      retro: { bg: '#1a1a2e', text: '#eee', accent: '#16213e' }
    };
    
    const currentTheme = themes[theme as keyof typeof themes] || themes.default;
    const finalBg = backgroundColor !== 'transparent' ? backgroundColor : currentTheme.bg;
    const finalColor = color !== '#3b82f6' ? color : currentTheme.text;
    const finalCursorColor = cursorColor !== color ? cursorColor : currentTheme.accent;
    
    const charWidth = fontSize * 0.6;
    const estimatedTextWidth = text.length * charWidth;
    const finalWidth = Math.max(estimatedTextWidth + 80, width);
    const finalHeight = Math.max(fontSize + 40, height);
    
    const totalDuration = text.length * speed + pauseAfter;
    const typingDuration = text.length * speed;
    
    const characterAnimations = text.split('').map((_, index) => `
      .char-${index} {
        animation: appear 200ms ease-out forwards;
        animation-delay: ${index * speed}ms;
        opacity: 0;
      }
    `).join('');
    
    const cursorAnimation = cursor ? `
      .cursor {
        animation: blink 1s infinite ${loop ? `, cursor-move ${totalDuration}ms infinite` : `, cursor-move ${totalDuration}ms forwards`};
        fill: ${finalCursorColor};
        transform-origin: center;
        font-weight: ${fontWeight};
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
    ` : '';

    const backgroundElement = finalBg !== 'transparent' ? 
      finalBg.startsWith('linear-gradient') ? 
        `<rect width="100%" height="100%" fill="url(#gradient)" rx="${borderRadius}"/>` :
        `<rect width="100%" height="100%" fill="${finalBg}" rx="${borderRadius}"/>` : '';

    const gradientDef = finalBg.startsWith('linear-gradient') ? `
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    ` : '';

    // Enhanced custom gradient support
    const customGradientDef = gradient ? `
      <linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        ${parseGradient(gradient).map((color, index, arr) => 
          `<stop offset="${(index / Math.max(arr.length - 1, 1)) * 100}%" style="stop-color:${color};stop-opacity:1" />`
        ).join('')}
      </linearGradient>
    ` : '';

    const textShadow = shadow ? `
      <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
      </filter>
    ` : '';

    const textX = centered ? finalWidth / 2 : 20;
    const textAnchor = centered ? 'middle' : 'start';
    const textY = finalHeight / 2;

    const svg = `
<svg width="${finalWidth}" height="${finalHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${finalWidth} ${finalHeight}">
  <defs>
    ${gradientDef}
    ${customGradientDef}
    ${textShadow}
    
    <style>
      .typing-container {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        font-weight: ${fontWeight};
        fill: ${gradient ? 'url(#customGradient)' : finalColor};
        dominant-baseline: central;
        text-anchor: ${textAnchor};
        ${shadow ? 'filter: url(#textShadow);' : ''}
      }
      
      ${characterAnimations}
      
      @keyframes appear {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      ${cursorAnimation}
      
      .typing-text {
        ${loop ? `animation: reset-text ${totalDuration}ms infinite;` : ''}
      }
      
      ${loop ? `
      @keyframes reset-text {
        0%, ${((totalDuration - pauseAfter) / totalDuration) * 100}% { }
      }
      ` : ''}
    </style>
  </defs>
  
  <!-- Background -->
  ${backgroundElement}
  
  <!-- Text container -->
  <g transform="translate(${textX}, ${textY})" class="typing-text">
    <!-- Individual characters with staggered animation -->
    ${text.split('').map((char, index) => {
      const xPosition = centered ? (index - text.length / 2) * charWidth : index * charWidth;
      const escapedChar = escapeXml(char);
      return `<text class="typing-container char-${index}" x="${xPosition}" y="0">${escapedChar}</text>`;
    }).join('')}
    
    <!-- Cursor -->
    ${cursor ? `
    <text class="typing-container cursor" x="${centered ? (text.length / 2 - text.length / 2) * charWidth : 0}" y="0">|</text>
    ` : ''}
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
  
  } catch (error) {
    console.error('Error generating typing animation:', error);
    return new NextResponse('Error generating typing animation', { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
