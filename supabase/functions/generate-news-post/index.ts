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
  // Generate realistic current news based on search query and current date
  return generateSimulatedNews(searchQuery);
}

function generateSimulatedNews(searchQuery: string): string {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentDay = new Date().getDate();
  
  // Create dynamic, varied news templates
  const newsVariations = [
    {
      'tech': [
        `Breaking: Major tech breakthrough in ${currentMonth} ${currentYear} revolutionizes industry standards. New platform achieves 10x performance improvement, setting new benchmarks for scalability and efficiency.`,
        `Industry Alert: ${currentMonth} ${currentDay} - Emerging technology disrupts traditional business models. Early adopters report 40% productivity gains within first quarter of implementation.`,
        `Tech Update: Revolutionary software solution launches globally this ${currentMonth}. Beta users share remarkable results, with 95% reporting improved workflow efficiency.`
      ],
      'ai': [
        `AI Milestone: ${currentMonth} ${currentYear} marks historic advancement in artificial intelligence capabilities. New model demonstrates unprecedented accuracy in complex problem-solving tasks.`,
        `Breaking AI: Latest research reveals game-changing applications in healthcare and finance. ${currentMonth} ${currentYear} study shows 60% improvement in diagnostic accuracy.`,
        `AI Innovation: Startup unveils groundbreaking machine learning platform this ${currentMonth}. Early results show remarkable potential for business automation and decision-making.`
      ],
      'startup': [
        `Startup Scene: ${currentMonth} ${currentYear} funding round breaks records with $500M raised across 20 companies. Climate tech and AI sectors dominate investor interest.`,
        `Entrepreneurship: New unicorn emerges in ${currentMonth} ${currentYear}, reaching $1B valuation in just 18 months. Founders share insights on rapid scaling strategies.`,
        `Innovation Hub: ${currentMonth} sees surge in B2B startups addressing remote work challenges. Three companies secure Series A funding totaling $75M.`
      ],
      'leadership': [
        `Leadership Trends: ${currentMonth} ${currentYear} study reveals evolving management practices. 85% of top executives prioritize employee well-being and flexible work arrangements.`,
        `Executive Insight: Fortune 500 CEOs share ${currentYear} strategies for navigating market uncertainty. Focus shifts to resilient leadership and adaptive decision-making.`,
        `Management Evolution: ${currentMonth} research highlights importance of emotional intelligence in modern leadership. Companies investing in leadership development see 25% better retention.`
      ],
      'career': [
        `Career Shift: ${currentMonth} ${currentYear} job market shows unprecedented demand for hybrid skills. Remote work capabilities become standard requirement across industries.`,
        `Professional Growth: New ${currentYear} survey reveals top skills for career advancement. Data analysis and digital literacy lead the list of most sought-after competencies.`,
        `Workforce Evolution: ${currentMonth} data shows 70% of professionals pursuing continuous learning. Micro-credentials and online certifications gain mainstream adoption.`
      ]
    }
  ];

  // Get random variation
  const templates = newsVariations[0];
  const searchLower = searchQuery.toLowerCase();
  
  for (const [key, variations] of Object.entries(templates)) {
    if (searchLower.includes(key.toLowerCase())) {
      const randomIndex = Math.floor(Math.random() * variations.length);
      return variations[randomIndex];
    }
  }

  // Enhanced fallback with variety
  const generalNews = [
    `Business Update: ${currentMonth} ${currentYear} brings significant shifts in global market dynamics. Companies embrace innovative strategies to maintain competitive advantage.`,
    `Market Insight: Latest ${currentYear} analysis reveals emerging opportunities across multiple sectors. Digital transformation accelerates as businesses adapt to changing consumer preferences.`,
    `Industry Focus: ${currentMonth} highlights importance of sustainable business practices. Organizations investing in green initiatives report improved brand reputation and customer loyalty.`
  ];
  
  return generalNews[Math.floor(Math.random() * generalNews.length)];
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
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.8,
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