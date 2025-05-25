import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface ProgressBarParams {
  skills: string[];
  values: number[];
  theme?: 'default' | 'gradient' | 'neon' | 'minimal';
  width?: number;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
  title?: string;
}

function getThemeStyles(theme: string) {
  switch(theme) {
    case 'gradient':
      return {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        barBg: '#2a2a40',
        progressGradient: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        text: '#ffffff',
        title: '#ffffff'
      };
    case 'neon':
      return {
        bg: '#0d1117',
        barBg: '#161b22',
        progressGradient: 'linear-gradient(90deg, #39ff14 0%, #00ffff 50%, #ff0080 100%)',
        text: '#58a6ff',
        title: '#f0f6fc',
        glow: '0 0 10px currentColor'
      };
    case 'minimal':
      return {
        bg: '#ffffff',
        barBg: '#f6f8fa',
        progressGradient: 'linear-gradient(90deg, #0969da 0%, #0550ae 100%)',
        text: '#656d76',
        title: '#24292f'
      };
    default:
      return {
        bg: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
        barBg: '#374151',
        progressGradient: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
        text: '#e5e7eb',
        title: '#ffffff'
      };
  }
}

function generateProgressSvg(params: ProgressBarParams): string {
  const {
    skills,
    values,
    theme = 'default',
    width = 400,
    height = 300,
    animated = true,
    showPercentage = true,
    title = 'Skills & Technologies'
  } = params;

  const styles = getThemeStyles(theme);
  const barHeight = 20;
  const spacing = 35;
  const startY = 60;
  const maxValue = Math.max(...values);

  const animationDuration = animated ? '2s' : '0s';
  const glowEffect = styles.glow ? `filter: drop-shadow(${styles.glow});` : '';

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${styles.bg.includes('gradient') ? '#1e3a8a' : styles.bg}" />
          <stop offset="100%" style="stop-color:${styles.bg.includes('gradient') ? '#3730a3' : styles.bg}" />
        </linearGradient>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          ${styles.progressGradient.includes('gradient') ? 
            '<stop offset="0%" style="stop-color:#3b82f6" /><stop offset="100%" style="stop-color:#8b5cf6" />' :
            `<stop offset="0%" style="stop-color:${styles.progressGradient}" />`
          }
        </linearGradient>        ${animated ? `
        <style>
          <![CDATA[
          .fade-in {
            animation: fadeIn 1s ease-in-out 0.5s both;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          ]]>
        </style>
        ` : ''}
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGradient)" rx="10" />
      
      <!-- Title -->
      <text x="20" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="600" 
            fill="${styles.title}" class="fade-in">${title}</text>
      
      ${skills.map((skill, index) => {
        const y = startY + (index * spacing);
        const percentage = Math.round((values[index] / maxValue) * 100);
        const barWidth = (values[index] / maxValue) * (width - 120);
        
        return `
          <!-- Skill: ${skill} -->
          <g class="fade-in" style="animation-delay: ${index * 0.1}s">
            <!-- Skill Label -->
            <text x="20" y="${y - 5}" font-family="'Segoe UI', Arial, sans-serif" 
                  font-size="12" font-weight="500" fill="${styles.text}">${skill}</text>
            
            <!-- Background Bar -->
            <rect x="20" y="${y}" width="${width - 120}" height="${barHeight}" 
                  fill="${styles.barBg}" rx="10" />
            
            <!-- Progress Bar -->
            <rect x="20" y="${y}" width="0" height="${barHeight}" 
                  fill="url(#progressGradient)" rx="10"
                  class="progress-bar" 
                  style="--final-width: ${barWidth}px; width: ${animated ? '0' : barWidth + 'px'}; ${glowEffect}">
              ${animated ? `
                <animate attributeName="width" 
                         from="0" to="${barWidth}" 
                         dur="${animationDuration}" 
                         begin="${index * 0.2}s"
                         fill="freeze" />
              ` : ''}
            </rect>
            
            ${showPercentage ? `
              <!-- Percentage Text -->
              <text x="${width - 80}" y="${y + 15}" font-family="'Segoe UI', Arial, sans-serif" 
                    font-size="11" font-weight="600" fill="${styles.text}" text-anchor="middle">
                ${percentage}%
                ${animated ? `
                  <animate attributeName="opacity" 
                           from="0" to="1" 
                           dur="0.5s" 
                           begin="${index * 0.2 + 1}s"
                           fill="freeze" />
                ` : ''}
              </text>
            ` : ''}
          </g>
        `;
      }).join('')}
    </svg>
  `.trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Handle both formats: skills=JS:90,TS:85 or skills=JS,TS&values=90,85
    const skillsParam = searchParams.get('skills') || 'JavaScript,TypeScript,React,Node.js,Python';
    const valuesParam = searchParams.get('values');
    const theme = searchParams.get('theme') || 'default';
    const width = parseInt(searchParams.get('width') || '400');
    const height = parseInt(searchParams.get('height') || '300');
    const animated = searchParams.get('animated') !== 'false';
    const showPercentage = searchParams.get('show_progress_text') !== 'false' && searchParams.get('showPercentage') !== 'false';
    const title = searchParams.get('title') || 'Skills & Technologies';

    let skills: string[];
    let values: number[];

    // Check if skills param contains values (format: "skill:value,skill:value")
    if (skillsParam.includes(':') && !valuesParam) {
      const skillValuePairs = skillsParam.split(',').map(s => s.trim());
      skills = [];
      values = [];
      
      for (const pair of skillValuePairs) {
        const [skill, value] = pair.split(':').map(s => s.trim());
        if (skill && value && !isNaN(parseInt(value))) {
          skills.push(skill);
          values.push(parseInt(value));
        }
      }
    } else {
      // Traditional format: separate skills and values
      skills = skillsParam.split(',').map(s => s.trim());
      const defaultValues = '90,85,95,80,75';
      values = (valuesParam || defaultValues).split(',').map(v => parseInt(v.trim()));
    }

    if (skills.length === 0 || values.length === 0) {
      return new NextResponse('No valid skills or values provided', { status: 400 });
    }

    if (skills.length !== values.length) {
      // If values array is shorter, pad with default values
      while (values.length < skills.length) {
        values.push(75); // Default value
      }
      // If values array is longer, truncate it
      values = values.slice(0, skills.length);
    }

    const svg = generateProgressSvg({
      skills,
      values,
      theme: theme as 'default' | 'gradient' | 'neon' | 'minimal',
      width,
      height,
      animated,
      showPercentage,
      title
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error generating progress SVG:', error);
    return new NextResponse('Error generating SVG', { status: 500 });
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
