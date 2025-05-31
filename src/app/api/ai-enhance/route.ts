import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return NextResponse.json(
        { 
          error: 'GEMINI_API_KEY is not configured. Please add your Google Gemini API key to the .env.local file. Get your key from: https://aistudio.google.com/app/apikey' 
        },
        { status: 500 }
      );
    }

    // Initialize Gemini with API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const body = await request.json();
    const { content, enhancementType, username, socials, availableWidgets } = body;

    // Add detailed logging
    console.log('🤖 AI Enhancement API called');
    console.log('📊 Enhancement type:', enhancementType);
    console.log('👤 Username:', username);
    console.log('🔧 Available widgets count:', availableWidgets ? Object.keys(availableWidgets).length : 0);
    console.log('📝 Content length:', content?.length || 0);
    
    if (availableWidgets) {
      console.log('🎯 Widget names available:', Object.keys(availableWidgets));
      // Log a sample widget to verify structure
      const firstWidgetKey = Object.keys(availableWidgets)[0];
      if (firstWidgetKey) {
        console.log('🔍 Sample widget structure:', {
          name: firstWidgetKey,
          description: availableWidgets[firstWidgetKey].description?.substring(0, 100) + '...',
          hasFeatures: !!availableWidgets[firstWidgetKey].features,
          hasThemes: !!availableWidgets[firstWidgetKey].themes,
          hasMarkdownExample: !!availableWidgets[firstWidgetKey].markdownExample
        });
      }
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }    // Generate comprehensive widget information text for AI context
    const widgetInfo = availableWidgets ? `

**🎯 CRITICAL: USE THESE CUSTOM WIDGETS TO ENHANCE THE README**

You MUST consider and actively suggest these 9 powerful custom widgets when enhancing README content. These widgets provide real-time GitHub data and significantly improve profile visibility:

${Object.entries(availableWidgets).map(([name, info]: [string, any]) => `
**${name}**: ${info.description}
Example: \`${info.markdownExample?.replace(/USERNAME/g, username || 'your-username').replace(/REPO_NAME/g, 'your-repo') || `![${name}](https://github-readme-generator.com/widgets/${name.toLowerCase()})`}\`
${info.useCases ? `Best for: ${info.useCases.slice(0, 2).join(', ')}` : ''}
`).join('')}

**⚠️ IMPORTANT INSTRUCTIONS:**
- ALWAYS suggest at least 2-3 relevant widgets in your enhancement
- Replace "USERNAME" with: ${username || '[your-username]'}
- Place widgets strategically in the README (header, about section, footer)
- Use widgets that match the README content and purpose
- Priority widgets: GitHub Stats, Top Languages, Repository Showcase

**✅ Widget Integration Examples:**
- Header: GitHub Stats + Wave Animation
- About section: Top Languages + Animated Progress (for skills)  
- Projects section: Repository Showcase
- Footer: Social Stats + Contribution Graph

These widgets auto-update and require no maintenance once added.` : '';

    const prompts = {      structure: `You are an expert GitHub README optimizer. Your task is to improve structure AND integrate custom widgets.

**PRIMARY GOALS:**
1. Add proper headings hierarchy (H1, H2, H3)
2. Organize sections logically (About, Installation, Usage, Contributing, etc.)
3. Improve readability with better spacing and formatting
4. **MANDATORY: Add 2-3 relevant custom widgets from the list below**
5. Add missing sections that would be valuable
6. Ensure proper markdown syntax

${widgetInfo}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**REQUIRED OUTPUT:** Return ONLY the improved markdown content that INCLUDES relevant custom widgets integrated naturally into the structure. NO explanations or additional text.`,      content: `You are an expert technical writer specializing in GitHub READMEs. Your task is to enhance content AND integrate custom widgets.

**PRIMARY GOALS:**
1. Improve descriptions to be clearer and more compelling
2. Add helpful details that users would want to know
3. Make the tone more professional yet approachable
4. **MANDATORY: Integrate 2-3 relevant custom widgets from the list below**
5. Add relevant badges, emojis, and visual elements
6. Follow README best practices

${widgetInfo}

${username ? `GitHub Username: ${username}` : ''}
${socials?.github ? `GitHub: ${socials.github}` : ''}
${socials?.linkedin ? `LinkedIn: ${socials.linkedin}` : ''}
${socials?.twitter ? `Twitter: ${socials.twitter}` : ''}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**REQUIRED OUTPUT:** Return ONLY the enhanced markdown content that INCLUDES relevant custom widgets integrated naturally. NO explanations or additional text.`,

formatting: `You are a GitHub markdown formatting expert. Your task is to optimize formatting AND add custom widgets.

**PRIMARY GOALS:**
1. Fix any markdown syntax issues
2. Improve tables, lists, and code blocks
3. Add proper spacing and alignment
4. **MANDATORY: Add 2-3 relevant custom widgets for visual enhancement**
5. Optimize for GitHub's markdown renderer
6. Add visual elements like horizontal rules and badges
7. Ensure mobile-friendly formatting

${widgetInfo}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**REQUIRED OUTPUT:** Return ONLY the formatted markdown content that INCLUDES relevant custom widgets for visual enhancement. NO explanations.`,comprehensive: `You are a GitHub README specialist. Perform a COMPREHENSIVE enhancement that MUST include custom widgets.

**MANDATORY REQUIREMENTS:**
1. **INCLUDE 3-4 CUSTOM WIDGETS** from the list below - this is non-negotiable
2. Improve structure with proper heading hierarchy
3. Enhance content quality and descriptions
4. Optimize visual formatting for GitHub
5. Add missing valuable sections
6. Follow README best practices

**WIDGET PLACEMENT STRATEGY:**
- Header: GitHub Stats + Wave Animation
- About/Skills: Top Languages + Animated Progress  
- Projects: Repository Showcase
- Footer: Social Stats + Contribution Graph

${widgetInfo}

${username ? `GitHub Username: ${username}` : ''}
${socials?.github ? `GitHub: ${socials.github}` : ''}
${socials?.linkedin ? `LinkedIn: ${socials.linkedin}` : ''}
${socials?.twitter ? `Twitter: ${socials.twitter}` : ''}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**REQUIRED OUTPUT:** Return ONLY the comprehensively enhanced markdown content that INCLUDES multiple custom widgets integrated naturally throughout the README. NO explanations, comments, or additional text.`
    };

    const selectedPrompt = prompts[enhancementType as keyof typeof prompts] || prompts.comprehensive;

    console.log('📤 Sending prompt to AI...');
    console.log('🎯 Selected enhancement type:', enhancementType);
    console.log('📏 Prompt length:', selectedPrompt.length, 'characters');
    console.log('🔍 Widget info included:', selectedPrompt.includes('AVAILABLE CUSTOM WIDGETS'));
      // Log a portion of the prompt to verify widget inclusion
    const widgetSectionMatch = selectedPrompt.indexOf('**🚀 AVAILABLE CUSTOM WIDGETS');
    const widgetRecommendationsMatch = selectedPrompt.indexOf('**🎯 WIDGET RECOMMENDATIONS:');
    if (widgetSectionMatch !== -1 && widgetRecommendationsMatch !== -1) {
      console.log('✅ Widget section found in prompt (from char', widgetSectionMatch, 'to', widgetRecommendationsMatch, ')');
    } else {
      console.log('❌ Widget section NOT found in prompt');
    }

    const result = await model.generateContent(selectedPrompt);
    const response = await result.response;
    const enhancedContent = response.text();    console.log('📥 Received response from AI');
    console.log('📊 Response length:', enhancedContent.length, 'characters');
    
    // Check for widget integration in response
    const widgetChecks = {
      'github-stats': enhancedContent.toLowerCase().includes('github-stats'),
      'top-languages': enhancedContent.toLowerCase().includes('top-languages'),
      'repository-showcase': enhancedContent.toLowerCase().includes('repository-showcase'),
      'contribution-graph': enhancedContent.toLowerCase().includes('contribution-graph'),
      'social-stats': enhancedContent.toLowerCase().includes('social-stats'),
      'animated-progress': enhancedContent.toLowerCase().includes('animated-progress'),
      'wave-animation': enhancedContent.toLowerCase().includes('wave-animation'),
      'language-chart': enhancedContent.toLowerCase().includes('language-chart'),
      'typing-animation': enhancedContent.toLowerCase().includes('typing-animation'),
      'widget-mentions': (enhancedContent.match(/widget/gi) || []).length,
      'readme-generator': enhancedContent.toLowerCase().includes('github-readme-generator.com')
    };
    
    console.log('🔍 Widget integration check:', widgetChecks);
    
    const totalWidgetsFound = Object.values(widgetChecks).filter((v, i) => i < 9 && v).length;
    console.log('📈 Total widgets integrated:', totalWidgetsFound, '/ 9');
    
    // Log first 800 chars of response to see structure
    console.log('📝 Response preview:', enhancedContent.substring(0, 800) + '...');

    const cleanedContent = enhancedContent
      .replace(/^```markdown\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return NextResponse.json({ 
      enhancedContent: cleanedContent,
      originalLength: content.length,
      enhancedLength: cleanedContent.length
    });

  } catch (error) {
    console.error('Error enhancing README with Gemini:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to enhance README content. Please try again.' },
      { status: 500 }
    );
  }
}
