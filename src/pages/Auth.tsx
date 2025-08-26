import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth component mounted');
    
    // Check if user is already authenticated
    const checkUser = async () => {
      console.log('Checking existing session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Existing session:', session);
      if (session) {
        console.log('User already authenticated, navigating to /');
        navigate('/');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change in Auth component:', event, session);
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, navigating to /');
        toast({
          title: "Welcome!",
          description: "Successfully signed in to your account.",
        });
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);


  const signInWithLinkedIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Authentication Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            LinkedIn Post Generator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to create and publish amazing LinkedIn content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={signInWithLinkedIn}
            variant="default"
            className="w-full h-12 font-medium bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300"
          >
            <Linkedin className="w-5 h-5 mr-3" />
            Continue with LinkedIn
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;