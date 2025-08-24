import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkedInAuthRequest {
  code?: string;
  state?: string;
  action: 'authorize' | 'token' | 'profile';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { action, code, state }: LinkedInAuthRequest = await req.json();

    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('LinkedIn credentials not configured');
    }

    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/linkedin-auth`;

    switch (action) {
      case 'authorize':
        // Generate authorization URL
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code&` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${Math.random().toString(36).substring(7)}&` +
          `scope=openid%20profile%20email%20w_member_social`;

        return new Response(JSON.stringify({ authUrl }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      case 'token':
        if (!code) {
          throw new Error('Authorization code required');
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        console.log('LinkedIn token exchange successful:', tokenData);

        return new Response(JSON.stringify(tokenData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      case 'profile':
        // This would be called with an access token to get user profile
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          throw new Error('Access token required');
        }

        const accessToken = authHeader.replace('Bearer ', '');
        
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch LinkedIn profile');
        }

        const profileData = await profileResponse.json();
        console.log('LinkedIn profile fetched:', profileData);

        return new Response(JSON.stringify(profileData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error: any) {
    console.error('LinkedIn auth error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);