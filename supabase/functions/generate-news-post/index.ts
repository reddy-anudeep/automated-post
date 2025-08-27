import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsRequest {
  topics: string[];
  userContent?: string;
  customDetails?: string;
}

const serve_handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topics, userContent, customDetails }: NewsRequest = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating post for topics:', topics, 'userContent:', userContent);

    let newsContent = '';
    let searchQuery = '';

    // If user provided content, use it as base
    if (userContent?.trim()) {
      newsContent = userContent.trim();
    } else if (topics.length > 0) {
      // Create search query based on topics
      const topicKeywords = {
        'technology': ['tech', 'innovation', 'AI', 'software', 'startup'],
        'ai': ['artificial intelligence', 'machine learning', 'AI breakthrough', 'automation'],
        'entrepreneurship': ['startup', 'business', 'entrepreneur', 'funding', 'IPO'],
        'leadership': ['management', 'leadership', 'CEO', 'business strategy'],
        'career': ['job market', 'remote work', 'career growth', 'skills'],
        'trends': ['industry trends', 'market analysis', 'business trends'],
        'branding': ['marketing', 'brand strategy', 'social media', 'advertising'],
        'projects': ['project management', 'collaboration', 'productivity']
      };

      const primaryTopic = topics[0];
      const keywords = topicKeywords[primaryTopic as keyof typeof topicKeywords] || ['business', 'innovation'];
      searchQuery = `${keywords.join(' OR ')} latest news 2024`;

      // Simulate fetching news (in production, you'd use a real news API)
      newsContent = await fetchLatestNews(searchQuery);
    }

    // Generate LinkedIn post using OpenAI
    const linkedInPost = await generateLinkedInPost(newsContent, topics, customDetails);

    console.log('Generated LinkedIn post:', linkedInPost);

    return new Response(JSON.stringify({
      success: true,
      post: linkedInPost,
      searchQuery: searchQuery
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error generating news post:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

async function fetchLatestNews(searchQuery: string): Promise<string> {
  try {
    // Use a web search to get current news
    const searchResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`);
    
    if (!searchResponse.ok) {
      // Fallback to simulated news based on the query
      return generateSimulatedNews(searchQuery);
    }

    const searchData = await searchResponse.json();
    
    // Extract relevant information from search results
    const results = searchData.RelatedTopics?.slice(0, 3) || [];
    const newsItems = results.map((item: any) => item.Text || '').filter(Boolean);
    
    if (newsItems.length === 0) {
      return generateSimulatedNews(searchQuery);
    }

    return newsItems.join('\n\n');
  } catch (error) {
    console.error('Error fetching news:', error);
    return generateSimulatedNews(searchQuery);
  }
}

function generateSimulatedNews(searchQuery: string): string {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  const newsTemplates = {
    'tech': `Breaking: Revolutionary AI breakthrough announced this ${currentMonth} ${currentYear}. Major tech company unveils new technology that could transform how businesses operate. Industry experts predict significant impact on productivity and innovation across sectors.`,
    'AI': `Latest: Artificial intelligence adoption reaches new milestone in ${currentYear}. Recent survey shows 80% of companies now integrating AI tools into daily operations. Experts highlight both opportunities and challenges in this rapidly evolving landscape.`,
    'startup': `Trending: Startup ecosystem sees record funding in ${currentMonth} ${currentYear}. Emerging companies in fintech and healthcare sectors attracting significant investor interest. New generation of entrepreneurs focusing on sustainable and socially impactful solutions.`,
    'business': `Update: Global business landscape shifts in ${currentYear} as companies adapt to new market realities. Remote work culture becomes permanent fixture for many organizations. Leadership strategies evolve to meet changing workforce expectations.`,
    'career': `Report: Job market dynamics change significantly in ${currentYear}. Skills-based hiring gains momentum across industries. Professional development and continuous learning become key differentiators in competitive landscape.`
  };

  // Match search query to appropriate template
  for (const [key, template] of Object.entries(newsTemplates)) {
    if (searchQuery.toLowerCase().includes(key.toLowerCase())) {
      return template;
    }
  }

  return newsTemplates.business; // Default fallback
}

async function generateLinkedInPost(newsContent: string, topics: string[], customDetails?: string): Promise<string> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const systemPrompt = `You are an expert LinkedIn content creator who transforms news and information into engaging, professional LinkedIn posts. Your posts should:

1. Start with a compelling hook or insight
2. Include relevant context and personal perspective
3. End with a thought-provoking question or call-to-action
4. Use appropriate emojis sparingly (1-2 max)
5. Include 3-4 relevant hashtags
6. Be between 150-300 words
7. Sound human, authentic, and conversational
8. Avoid overly promotional language

Focus on making the content relatable and actionable for professionals. If custom details are provided, weave them naturally into the post.`;

  const userPrompt = `Transform this news/content into an engaging LinkedIn post:

Content: ${newsContent}

Topics focus: ${topics.join(', ')}
${customDetails ? `Custom details to include: ${customDetails}` : ''}

Make it sound like a human professional sharing genuine insights, not an AI-generated post. Keep it fresh, relevant, and engaging.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating LinkedIn post:', error);
    throw new Error('Failed to generate LinkedIn post');
  }
}

serve(serve_handler);