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

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate comprehensive widget information text for AI context
    const widgetInfo = availableWidgets ? `

**🎯 AVAILABLE WIDGETS TO ENHANCE README**

You have access to these powerful widgets that provide real-time GitHub data. Choose 2-3 most relevant ones based on the content:

${Object.entries(availableWidgets).map(([name, info]: [string, any]) => `
**${name}**: ${info.description}
Example: \`${info.markdownExample?.replace(/USERNAME/g, username || 'your-username').replace(/REPO_NAME/g, 'your-repo') || `![${name}](https://github-readme-generator.com/widgets/${name.toLowerCase()})`}\`
${info.useCases ? `Best for: ${info.useCases.slice(0, 2).join(', ')}` : ''}
`).join('')}

**INTEGRATION GUIDELINES:**
- Use only 2-3 widgets maximum to avoid clutter
- Replace "USERNAME" with: ${username || 'your-username'}
- Place widgets logically (stats in about, languages in skills, etc.)
- Ensure each widget appears only ONCE
- Avoid duplicate content and headers

**RECOMMENDED PLACEMENTS:**
- Profile Stats: GitHub Stats Widget in about/header section
- Skills Section: Top Languages or Animated Progress Widget
- Projects: Repository Showcase Widget (if applicable)
- Contact: Social Stats Widget (only if social links provided)

These widgets auto-update and provide real-time data.` : '';

    const prompts = {
      structure: `You are an expert GitHub README optimizer. Your task is to improve structure and selectively integrate widgets.

**PRIMARY GOALS:**
1. Create clear heading hierarchy (# for title, ## for main sections, ### for subsections)
2. Organize sections logically: About → Installation → Usage → Features → Contributing → License
3. Improve readability with proper spacing and structure
4. Add 2 relevant widgets maximum (choose wisely based on content)
5. Remove duplicate content and redundant sections
6. Ensure clean, professional markdown

**CRITICAL QUALITY RULES:**
- NO duplicate headers or sections
- Use single blank lines between sections
- NO placeholder content (remove if not provided)
- Each widget appears only ONCE in the most appropriate location
- Remove redundant social links or duplicate information

${widgetInfo}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**OUTPUT:** Return ONLY the improved markdown with clean structure and 2 relevant widgets integrated naturally. NO explanations.`,

      content: `You are an expert technical writer. Your task is to enhance content quality while maintaining clean structure.

**PRIMARY GOALS:**
1. Improve descriptions to be clearer and more engaging
2. Add helpful details users need to know
3. Make tone professional yet approachable
4. Add 2 relevant widgets that complement the content
5. Include useful badges and visual elements
6. Follow GitHub README best practices

**QUALITY STANDARDS:**
- NO duplicate content or repetitive sections
- Remove placeholder text if actual data not provided
- Use meaningful examples, not generic ones
- Ensure all links are valid and functional
- Maintain consistent formatting throughout

${widgetInfo}

User Information:
${username ? `GitHub Username: ${username}` : ''}
${socials?.github ? `GitHub: ${socials.github}` : ''}
${socials?.linkedin ? `LinkedIn: ${socials.linkedin}` : ''}
${socials?.twitter ? `Twitter: ${socials.twitter}` : ''}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**OUTPUT:** Return ONLY the enhanced markdown with improved content and 2 relevant widgets. NO explanations.`,

      formatting: `You are a markdown formatting expert. Your task is to optimize visual presentation and add appropriate widgets.

**PRIMARY GOALS:**
1. Fix markdown syntax issues and improve formatting
2. Optimize tables, lists, and code blocks for GitHub
3. Improve spacing, alignment, and visual hierarchy
4. Add 2 visual widgets that enhance presentation
5. Ensure mobile-friendly formatting
6. Add visual elements like badges and dividers where appropriate

**FORMATTING STANDARDS:**
- Remove excessive empty lines or duplicate spacing
- Ensure consistent indentation in lists and code
- Use proper table formatting with aligned columns
- NO redundant content or duplicate sections
- Clean, professional appearance throughout

${widgetInfo}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**OUTPUT:** Return ONLY the formatted markdown with visual improvements and 2 relevant widgets. NO explanations.`,

      comprehensive: `You are a GitHub README specialist. Create a comprehensive, professional README enhancement.

**COMPREHENSIVE ENHANCEMENT GOALS:**
1. **Structure**: Clear hierarchy with logical section organization
2. **Content**: Engaging, informative descriptions with helpful details
3. **Visual**: Professional formatting with 2-3 carefully chosen widgets
4. **Quality**: Remove redundancy, fix errors, add missing valuable sections
5. **Standards**: Follow GitHub README best practices

**CRITICAL QUALITY REQUIREMENTS:**
- NO duplicate sections, headers, or content anywhere
- Each widget appears only ONCE in the most appropriate location
- Remove placeholder content if real data not provided
- Use proper spacing (single blank lines between sections)
- Ensure all URLs and links are valid and functional
- Professional, clean appearance throughout

**WIDGET SELECTION STRATEGY:**
- Choose 2-3 widgets that best complement the content purpose
- Place GitHub Stats in about/profile section if it's a personal README
- Use Top Languages widget for showcasing programming skills
- Use Repository Showcase only if highlighting specific projects
- Use Social Stats only if valid social links are provided

${widgetInfo}

User Information:
${username ? `GitHub Username: ${username}` : ''}
${socials?.github ? `GitHub: ${socials.github}` : ''}
${socials?.linkedin ? `LinkedIn: ${socials.linkedin}` : ''}
${socials?.twitter ? `Twitter: ${socials.twitter}` : ''}

Current README content:
\`\`\`markdown
${content}
\`\`\`

**OUTPUT:** Return ONLY the comprehensively enhanced markdown with clean structure, improved content, and 2-3 strategically placed widgets. NO explanations, comments, or additional text. Ensure ZERO duplicate content.`
    };

    const selectedPrompt = prompts[enhancementType as keyof typeof prompts] || prompts.comprehensive;

    console.log('📤 Sending prompt to AI...');
    console.log('🎯 Selected enhancement type:', enhancementType);
    console.log('📏 Prompt length:', selectedPrompt.length, 'characters');
    
    const result = await model.generateContent(selectedPrompt);
    const response = await result.response;
    const enhancedContent = response.text();

    console.log('📥 Received response from AI');
    console.log('📊 Response length:', enhancedContent.length, 'characters');
    
    // Check for widget integration in response
    const widgetChecks = {
      'github-stats': enhancedContent.toLowerCase().includes('github-stats'),
      'top-languages': enhancedContent.toLowerCase().includes('top-langs'),
      'repository-showcase': enhancedContent.toLowerCase().includes('repo-showcase'),
      'contribution-graph': enhancedContent.toLowerCase().includes('contribution-graph'),
      'social-stats': enhancedContent.toLowerCase().includes('social-stats'),
      'widgets-found': (enhancedContent.match(/vercel\.app|github-readme-stats|skillicons\.dev/gi) || []).length
    };
    
    console.log('🔍 Widget integration check:', widgetChecks);
    
    // Clean the response to remove any markdown code block wrappers
    const cleanedContent = enhancedContent
      .replace(/^```markdown\s*/i, '')
      .replace(/```\s*$/i, '')
      .replace(/^```\s*/i, '')
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
