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
    const { content, enhancementType, username, socials } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    const prompts = {
      structure: `You are an expert GitHub README optimizer. Analyze this README content and improve its structure and organization. Focus on:

1. Adding proper headings hierarchy (H1, H2, H3)
2. Organizing sections logically (About, Installation, Usage, Contributing, etc.)
3. Improving readability with better spacing and formatting
4. Adding missing sections that would be valuable
5. Ensuring proper markdown syntax

Current README content:
\`\`\`markdown
${content}
\`\`\`

Return ONLY the improved markdown content without any explanations or additional text. Make sure to preserve all existing information while improving the structure.`,

      content: `You are an expert technical writer specializing in GitHub READMEs. Enhance this README content to be more engaging, informative, and professional. Focus on:

1. Improving descriptions to be clearer and more compelling
2. Adding helpful details that users would want to know
3. Making the tone more professional yet approachable
4. Enhancing existing sections with better explanations
5. Adding relevant badges, emojis, and visual elements where appropriate
6. Ensuring the content follows README best practices

${username ? `GitHub Username: ${username}` : ''}
${socials?.github ? `GitHub: ${socials.github}` : ''}
${socials?.linkedin ? `LinkedIn: ${socials.linkedin}` : ''}
${socials?.twitter ? `Twitter: ${socials.twitter}` : ''}

Current README content:
\`\`\`markdown
${content}
\`\`\`

Return ONLY the enhanced markdown content without any explanations or additional text. Preserve the overall structure while significantly improving the content quality.`,

      formatting: `You are a GitHub markdown formatting expert. Optimize this README for better visual appeal and GitHub compatibility. Focus on:

1. Fixing any markdown syntax issues
2. Improving tables, lists, and code blocks
3. Adding proper spacing and alignment
4. Optimizing for GitHub's markdown renderer
5. Adding visual elements like horizontal rules, badges, and proper formatting
6. Ensuring mobile-friendly formatting
7. Using GitHub-compatible HTML where beneficial

Current README content:
\`\`\`markdown
${content}
\`\`\`

Return ONLY the formatted markdown content without any explanations or additional text. Focus purely on visual improvement and GitHub compatibility.`,

      comprehensive: `You are a GitHub README specialist with expertise in creating professional, engaging, and well-structured documentation. Perform a comprehensive enhancement of this README covering:

**Structure & Organization:**
- Logical section ordering and hierarchy
- Proper heading structure (H1, H2, H3)
- Clear navigation and flow

**Content Quality:**
- More engaging and professional descriptions
- Better explanations of features and usage
- Helpful examples and code snippets
- Missing sections that would add value

**Visual Appeal & Formatting:**
- GitHub-optimized markdown formatting
- Proper spacing, alignment, and visual hierarchy
- Relevant badges, emojis, and visual elements
- Mobile-friendly formatting
- GitHub-compatible HTML where beneficial

**Best Practices:**
- README conventions and standards
- Clear installation and usage instructions
- Professional tone while remaining approachable
- Accessibility and readability optimizations

${username ? `GitHub Username: ${username}` : ''}
${socials?.github ? `GitHub: ${socials.github}` : ''}
${socials?.linkedin ? `LinkedIn: ${socials.linkedin}` : ''}
${socials?.twitter ? `Twitter: ${socials.twitter}` : ''}

Current README content:
\`\`\`markdown
${content}
\`\`\`

Return ONLY the comprehensively enhanced markdown content without any explanations, comments, or additional text. This should be a significantly improved version ready for immediate use.`
    };

    const selectedPrompt = prompts[enhancementType as keyof typeof prompts] || prompts.comprehensive;

    const result = await model.generateContent(selectedPrompt);
    const response = await result.response;
    const enhancedContent = response.text();

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
