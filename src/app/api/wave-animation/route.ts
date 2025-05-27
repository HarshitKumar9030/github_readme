import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
    // Extract parameters with defaults
  const height = parseInt(searchParams.get('height') || '120');
  const width = parseInt(searchParams.get('width') || '800');
  const color = searchParams.get('color') || '#0066cc';
  const secondaryColor = searchParams.get('secondaryColor');
  const backgroundColor = searchParams.get('backgroundColor') || 'transparent';
  const waves = parseInt(searchParams.get('waves') || '3');
  const speed = parseFloat(searchParams.get('speed') || '1');
  const amplitude = parseInt(searchParams.get('amplitude') || '20');
  const frequency = parseFloat(searchParams.get('frequency') || '0.02');
  const theme = searchParams.get('theme') || 'default';
  
  // Theme configurations
  const themes = {
    default: {
      colors: ['#0066cc'],
      background: 'transparent'
    },
    ocean: {
      colors: ['#006994', '#0891b2', '#67e8f9'],
      background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)'
    },
    sunset: {
      colors: ['#dc2626', '#ea580c', '#eab308'],
      background: 'linear-gradient(180deg, #fef3c7 0%, #fed7aa 100%)'
    },
    forest: {
      colors: ['#15803d', '#22c55e', '#84cc16'],
      background: 'linear-gradient(180deg, #f7fee7 0%, #ecfccb 100%)'
    },
    purple: {
      colors: ['#7c3aed', '#a855f7', '#c084fc'],
      background: 'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)'
    },
    neon: {
      colors: ['#06b6d4', '#0891b2', '#67e8f9'],
      background: 'radial-gradient(circle, #0f172a 0%, #1e293b 100%)'
    }
  };
    const selectedTheme = themes[theme as keyof typeof themes] || themes.default;
  
  // Use custom colors if provided, otherwise fall back to theme colors
  let waveColors = selectedTheme.colors;
  if (color && color !== '#0066cc') {
    if (secondaryColor) {
      waveColors = [color, secondaryColor];
    } else {
      waveColors = [color];
    }
  }
  
  const bgColor = backgroundColor !== 'transparent' ? backgroundColor : selectedTheme.background;
  
  // Generate wave paths
  const generateWavePath = (waveIndex: number, totalWaves: number) => {
    const phaseShift = (waveIndex * Math.PI * 2) / totalWaves;
    const points = [];
    
    for (let x = 0; x <= width; x += 2) {
      const y = height / 2 + 
        Math.sin(x * frequency + phaseShift) * amplitude * (0.7 + waveIndex * 0.3 / totalWaves);
      points.push(`${x},${y}`);
    }
    
    // Close the path at the bottom
    points.push(`${width},${height}`);
    points.push(`0,${height}`);
    
    return `M ${points.join(' L ')} Z`;
  };
  
  // Generate wave elements
  const waveElements = Array.from({ length: waves }, (_, i) => {
    const colorIndex = i % waveColors.length;
    const waveColor = waveColors[colorIndex];
    const opacity = 0.3 + (i * 0.7) / waves;
    const animationDelay = i * 0.2;
    const animationDuration = 3 + i * 0.5;
    
    return `
      <path
        d="${generateWavePath(i, waves)}"
        fill="${waveColor}"
        opacity="${opacity}"
        transform-origin="center">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; ${amplitude},0; 0,0"
          dur="${animationDuration / speed}s"
          begin="${animationDelay}s"
          repeatCount="indefinite"/>
      </path>`;
  }).join('');
  
  // Generate background
  const backgroundElement = bgColor !== 'transparent' 
    ? bgColor.includes('gradient') 
      ? `<defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            ${bgColor.includes('linear-gradient') 
              ? bgColor.match(/\#[a-fA-F0-9]{6}/g)?.map((color, index, arr) => 
                  `<stop offset="${(index / (arr.length - 1)) * 100}%" stop-color="${color}"/>`
                ).join('') || ''
              : ''}
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>`
      : `<rect width="100%" height="100%" fill="${bgColor}"/>`
    : '';
  
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
         xmlns="http://www.w3.org/2000/svg">
      ${backgroundElement}
      <g>
        ${waveElements}
      </g>
    </svg>
  `;
  
  return new NextResponse(svg.trim(), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
