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
  const estimatedTextWidth = text.length * (fontSize * 0.6);
  const finalWidth = width === 800 ? Math.max(estimatedTextWidth + 60, 300) : width;
  const finalHeight = height === 100 ? fontSize + 40 : height;
  
  // Create the typing animation
  const totalDuration = text.length * speed + pauseAfter;
  const typingDuration = text.length * speed;
  
  // Generate keyframes for typing effect
  let keyframes = '';
  for (let i = 0; i <= text.length; i++) {
    const percentage = (i * speed / totalDuration) * 100;
    keyframes += `${percentage}% { width: ${i * (fontSize * 0.6)}px; }\n`;
  }
  
  // Add pause keyframes
  const pauseStart = (typingDuration / totalDuration) * 100;
  keyframes += `${pauseStart}%, 100% { width: ${text.length * (fontSize * 0.6)}px; }\n`;
  
  const svg = `
<svg width="${finalWidth}" height="${finalHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .typing-container {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        fill: ${finalColor};
        dominant-baseline: middle;
      }
      
      .typing-text {
        overflow: hidden;
        white-space: nowrap;
        animation: typing ${totalDuration}ms ${loop ? 'infinite' : 'forwards'} steps(${text.length}, end);
      }
      
      .cursor {
        animation: blink 1s infinite;
        fill: ${finalCursorColor};
      }
      
      @keyframes typing {
        0% { width: 0; }
        ${(typingDuration / totalDuration) * 100}% { width: ${text.length * (fontSize * 0.6)}px; }
        100% { width: ${text.length * (fontSize * 0.6)}px; }
      }
      
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      .background {
        fill: ${finalBg === 'transparent' ? 'none' : finalBg};
      }
      
      ${finalBg.startsWith('linear-gradient') ? `
      .gradient-bg {
        fill: url(#gradient);
      }
      ` : ''}
    </style>
    
    ${finalBg.startsWith('linear-gradient') ? `
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    ` : ''}
  </defs>
  
  <!-- Background -->
  ${finalBg !== 'transparent' ? `
  <rect width="100%" height="100%" class="${finalBg.startsWith('linear-gradient') ? 'gradient-bg' : 'background'}" rx="8"/>
  ` : ''}
  
  <!-- Typing text container -->
  <g transform="translate(20, ${finalHeight / 2})">
    <!-- Hidden full text for proper spacing -->
    <text class="typing-container" opacity="0">${text}</text>
    
    <!-- Visible typing text with mask -->
    <defs>
      <mask id="typing-mask">
        <rect fill="white" height="${fontSize + 10}" class="typing-text"/>
      </mask>
    </defs>
    
    <text class="typing-container" mask="url(#typing-mask)">${text}</text>
    
    <!-- Cursor -->
    ${cursor ? `
    <text class="typing-container cursor" x="${text.length * (fontSize * 0.6) + 2}" y="0">|</text>
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
