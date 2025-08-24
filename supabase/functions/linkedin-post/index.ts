import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkedInPostRequest {
  text: string;
  accessToken: string;
  personUrn?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, accessToken, personUrn }: LinkedInPostRequest = await req.json();

    if (!text || !accessToken) {
      throw new Error('Text and access token are required');
    }

    // Get person URN if not provided
    let authorUrn = personUrn;
    if (!authorUrn) {
      const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to get LinkedIn profile');
      }

      const profile = await profileResponse.json();
      authorUrn = `urn:li:person:${profile.sub}`;
    }

    // Create the post
    const postData = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    console.log('Posting to LinkedIn:', postData);

    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      console.error('LinkedIn API error:', errorText);
      throw new Error(`Failed to post to LinkedIn: ${postResponse.status} ${errorText}`);
    }

    const result = await postResponse.json();
    console.log('LinkedIn post created successfully:', result);

    return new Response(JSON.stringify({
      success: true,
      postId: result.id,
      message: 'Post published to LinkedIn successfully!'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('LinkedIn post error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);