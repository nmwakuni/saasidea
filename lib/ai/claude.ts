import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is not set');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ContentGenerationOptions {
  transcript: string;
  contentType:
    | 'linkedin_post'
    | 'twitter_thread'
    | 'instagram_caption'
    | 'email_newsletter'
    | 'blog_article'
    | 'tiktok_script'
    | 'quote_card'
    | 'summary';
  count?: number;
  tone?: 'professional' | 'casual' | 'inspirational' | 'educational';
  brandVoice?: string;
  additionalContext?: string;
}

export async function generateContent(
  options: ContentGenerationOptions
): Promise<string[]> {
  const {
    transcript,
    contentType,
    count = 1,
    tone = 'professional',
    brandVoice,
    additionalContext,
  } = options;

  const prompts = getPromptForContentType(
    contentType,
    transcript,
    count,
    tone,
    brandVoice,
    additionalContext
  );

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompts,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse the response to extract multiple pieces of content
  return parseContentResponse(content.text, count);
}

function getPromptForContentType(
  contentType: string,
  transcript: string,
  count: number,
  tone: string,
  brandVoice?: string,
  additionalContext?: string
): string {
  const baseContext = `
You are an expert content marketer helping to repurpose long-form content into engaging social media posts and marketing materials.

${brandVoice ? `Brand Voice: ${brandVoice}` : ''}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}
Tone: ${tone}

Here is the transcript to work with:

${transcript}
`;

  const prompts: Record<string, string> = {
    linkedin_post: `${baseContext}

Create ${count} engaging LinkedIn post${count > 1 ? 's' : ''} based on the transcript. Each post should:
- Be 1-3 paragraphs (150-300 words)
- Start with a hook that grabs attention
- Include a clear value proposition or key insight
- Use line breaks for readability
- End with a question or call-to-action to drive engagement
- Be professional yet conversational
- Include 3-5 relevant hashtags

Format each post clearly separated with "---POST ${count > 1 ? 'N' : '1'}---" headers.`,

    twitter_thread: `${baseContext}

Create ${count} Twitter thread${count > 1 ? 's' : ''} based on the transcript. Each thread should:
- Have 5-8 tweets
- Start with an attention-grabbing first tweet with a hook
- Break down one key concept or insight per tweet
- Use numbered format (1/, 2/, etc.)
- Keep each tweet under 280 characters
- End with a CTA (like, retweet, comment)
- Include relevant emojis sparingly
- Add 2-3 hashtags in the final tweet only

Format each thread clearly with "---THREAD ${count > 1 ? 'N' : '1'}---" headers.`,

    instagram_caption: `${baseContext}

Create ${count} Instagram caption${count > 1 ? 's' : ''} based on the transcript. Each caption should:
- Be 150-200 words
- Start with an attention-grabbing first line (no emojis)
- Use emojis strategically throughout for visual interest
- Include line breaks for easy reading
- Tell a story or share a key insight
- End with a clear call-to-action
- Include 15-20 relevant hashtags at the end

Format each caption clearly with "---CAPTION ${count > 1 ? 'N' : '1'}---" headers.`,

    email_newsletter: `${baseContext}

Create ${count} email newsletter${count > 1 ? 's' : ''} based on the transcript. Each newsletter should:
- Have a compelling subject line
- Start with a personal greeting and hook
- Include 2-3 main sections with subheadings
- Be 400-600 words total
- Use bullet points for key takeaways
- Include a clear call-to-action
- End with a personal sign-off

Format each newsletter with "---EMAIL ${count > 1 ? 'N' : '1'}---" headers. Include [SUBJECT: ...] at the top of each.`,

    blog_article: `${baseContext}

Create ${count} blog article${count > 1 ? 's' : ''} based on the transcript. Each article should:
- Have an SEO-friendly title (H1)
- Include an engaging introduction (2-3 paragraphs)
- Have 3-5 main sections with H2 subheadings
- Be 800-1200 words total
- Include bullet points and examples
- Have a clear conclusion with key takeaways
- End with a call-to-action

Format each article with "---ARTICLE ${count > 1 ? 'N' : '1'}---" headers.`,

    tiktok_script: `${baseContext}

Create ${count} TikTok/Short-form video script${count > 1 ? 's' : ''} based on the transcript. Each script should:
- Be 60-90 seconds when read aloud
- Start with a hook in the first 3 seconds
- Use simple, conversational language
- Include [VISUAL CUE] markers for what to show on screen
- Break into short, punchy segments
- End with a clear call-to-action
- Include suggested text overlays in [TEXT: ...]

Format each script with "---SCRIPT ${count > 1 ? 'N' : '1'}---" headers.`,

    quote_card: `${baseContext}

Extract ${count} powerful, shareable quote${count > 1 ? 's' : ''} from the transcript. Each quote should:
- Be 10-25 words (short and impactful)
- Stand alone without context
- Be inspirational, insightful, or thought-provoking
- Work well as a visual quote card
- Include suggested attribution if applicable

Format each quote with "---QUOTE ${count > 1 ? 'N' : '1'}---" headers.`,

    summary: `${baseContext}

Create ${count} summary${count > 1 ? ' summaries' : ''} of the transcript. ${count > 1 ? 'Each' : 'The'} summary should include:
- A 2-3 sentence overview
- 5-7 key takeaways (bullet points)
- Main topics covered
- Important quotes or insights
- Recommended audience for this content

Format${count > 1 ? ' each summary' : ''} with "---SUMMARY${count > 1 ? ' N' : ''}---" header${count > 1 ? 's' : ''}.`,
  };

  return prompts[contentType] || prompts.summary;
}

function parseContentResponse(response: string, count: number): string[] {
  // Split by separators like "---POST 1---", "---THREAD 2---", etc.
  const separatorRegex = /---(?:POST|THREAD|CAPTION|EMAIL|ARTICLE|SCRIPT|QUOTE|SUMMARY)\s*\d*---/gi;

  const parts = response.split(separatorRegex).filter((part) => part.trim());

  // If we have the expected number of parts, return them
  if (parts.length >= count) {
    return parts.slice(0, count).map((p) => p.trim());
  }

  // Otherwise, return the whole response as a single item
  return [response.trim()];
}

// Batch generation for efficiency
export async function generateMultipleContentTypes(
  transcript: string,
  types: Array<{
    type: ContentGenerationOptions['contentType'];
    count: number;
  }>,
  options?: {
    tone?: ContentGenerationOptions['tone'];
    brandVoice?: string;
  }
): Promise<Record<string, string[]>> {
  const results: Record<string, string[]> = {};

  // Generate in parallel
  await Promise.all(
    types.map(async ({ type, count }) => {
      try {
        results[type] = await generateContent({
          transcript,
          contentType: type,
          count,
          tone: options?.tone,
          brandVoice: options?.brandVoice,
        });
      } catch (error) {
        console.error(`Failed to generate ${type}:`, error);
        results[type] = [];
      }
    })
  );

  return results;
}

// Extract key topics and insights
export async function extractInsights(transcript: string): Promise<{
  topics: string[];
  keyQuotes: string[];
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Analyze this transcript and extract:
1. Top 5-7 main topics/themes
2. 3-5 most impactful quotes
3. A 2-3 sentence summary
4. Overall sentiment (positive, neutral, or negative)

Transcript:
${transcript}

Please respond in this exact JSON format:
{
  "topics": ["topic1", "topic2", ...],
  "keyQuotes": ["quote1", "quote2", ...],
  "summary": "summary text",
  "sentiment": "positive|neutral|negative"
}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse JSON response
  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Failed to parse insights:', error);
    return {
      topics: [],
      keyQuotes: [],
      summary: '',
      sentiment: 'neutral',
    };
  }
}
