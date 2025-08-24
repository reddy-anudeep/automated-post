import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LinkedInProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}

export default function useLinkedInAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  const initiateAuth = async () => {
    try {
      setIsConnecting(true);
      
      const { data, error } = await supabase.functions.invoke('linkedin-auth', {
        body: { action: 'authorize' }
      });

      if (error) throw error;

      // Open LinkedIn auth in new window
      const authWindow = window.open(
        data.authUrl,
        'linkedin-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for the auth completion
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check for auth completion in localStorage or URL params
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          if (code) {
            handleAuthCode(code);
          }
        }
      }, 1000);

    } catch (error: any) {
      console.error('LinkedIn auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const handleAuthCode = async (code: string) => {
    try {
      // Exchange code for token
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('linkedin-auth', {
        body: { action: 'token', code }
      });

      if (tokenError) throw tokenError;

      setAccessToken(tokenData.access_token);

      // Get user profile
      const { data: profileData, error: profileError } = await supabase.functions.invoke('linkedin-auth', {
        body: { action: 'profile' },
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (profileError) throw profileError;

      setProfile(profileData);
      
      toast({
        title: "Connected to LinkedIn!",
        description: `Welcome ${profileData.name}`,
      });

    } catch (error: any) {
      console.error('LinkedIn token exchange error:', error);
      toast({
        title: "Authentication Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const publishPost = async (text: string) => {
    if (!accessToken) {
      throw new Error('Not connected to LinkedIn');
    }

    try {
      const { data, error } = await supabase.functions.invoke('linkedin-post', {
        body: {
          text,
          accessToken,
          personUrn: profile?.sub ? `urn:li:person:${profile.sub}` : undefined
        }
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('LinkedIn post error:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setProfile(null);
    setAccessToken(null);
    toast({
      title: "Disconnected from LinkedIn",
      description: "You can reconnect anytime",
    });
  };

  return {
    isConnecting,
    profile,
    accessToken,
    initiateAuth,
    publishPost,
    disconnect,
    isConnected: !!profile
  };
}