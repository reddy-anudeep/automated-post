import LinkedInPostGenerator from "@/components/LinkedInPostGenerator";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth state:', { loading, isAuthenticated });
    if (!loading && !isAuthenticated) {
      console.log('Redirecting to auth');
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, returning null');
    return null; // Will redirect to auth
  }

  console.log('Authenticated, rendering LinkedInPostGenerator');
  return (
    <div>
      <LinkedInPostGenerator />
    </div>
  );
};

export default Index;
