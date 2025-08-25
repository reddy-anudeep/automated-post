import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Send, 
  User, 
  MessageCircle, 
  Heart, 
  Share, 
  MoreHorizontal,
  Mail,
  Linkedin,
  Zap,
  Wand2,
  Eye,
  Settings,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollReveal from "@/components/ScrollReveal";
import useLinkedInAuth from "@/hooks/useLinkedInAuth";
import useEmailService from "@/hooks/useEmailService";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

const topics = [
  { id: "technology", label: "Technology", icon: "💻", color: "from-blue-500 to-cyan-500" },
  { id: "ai", label: "Artificial Intelligence", icon: "🤖", color: "from-purple-500 to-pink-500" },
  { id: "entrepreneurship", label: "Entrepreneurship", icon: "🚀", color: "from-orange-500 to-red-500" },
  { id: "leadership", label: "Leadership", icon: "👑", color: "from-yellow-500 to-orange-500" },
  { id: "career", label: "Career Tips", icon: "📈", color: "from-green-500 to-emerald-500" },
  { id: "trends", label: "Industry Trends", icon: "📊", color: "from-indigo-500 to-purple-500" },
  { id: "branding", label: "Personal Branding", icon: "✨", color: "from-pink-500 to-rose-500" },
  { id: "projects", label: "Project Showcase", icon: "🎯", color: "from-teal-500 to-cyan-500" },
];

const samplePosts = {
  technology: "Just discovered an amazing new framework that's changing how we build web applications! 🚀\n\nAfter years of wrestling with complex configurations, this tool makes development feel effortless again. Sometimes the best innovations are the ones that simplify our daily workflows.\n\nWhat's your favorite development tool that changed your perspective?\n\n#WebDevelopment #Technology #Innovation #ProductivityTips",
  ai: "AI isn't replacing human creativity - it's amplifying it! 🎨\n\nSpent the morning experimenting with AI-powered design tools, and I'm blown away by how they enhance rather than replace human intuition. The key is knowing when to collaborate with AI and when to trust your own instincts.\n\nThe future belongs to those who can dance between human creativity and artificial intelligence.\n\n#ArtificialIntelligence #Creativity #FutureOfWork #Innovation",
  entrepreneurship: "Failed my first startup at 25. Best thing that ever happened to me. 💪\n\nThat failure taught me more about business, resilience, and customer needs than any MBA could. Every 'no' became a lesson, every setback a stepping stone.\n\nNow running a successful company, and I credit that early failure for everything I know today.\n\nTo all entrepreneurs facing rejection: your breakthrough is one pivot away.\n\n#Entrepreneurship #Failure #GrowthMindset #StartupLife"
};

export default function LinkedInPostGenerator() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generatedPost, setGeneratedPost] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [emailAddress, setEmailAddress] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const { toast } = useToast();

  // Auth Hook
  const { user, signOut } = useAuth();

  // LinkedIn Auth Hook
  const { 
    isConnecting, 
    profile, 
    accessToken, 
    initiateAuth, 
    publishPost, 
    disconnect, 
    isConnected 
  } = useLinkedInAuth();

  // Email Service Hook
  const { sendPostNotification, isSending } = useEmailService();

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.5;
      const heroElement = document.querySelector('.hero-bg') as HTMLElement;
      if (heroElement) {
        heroElement.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const generatePost = async () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "Select Topics",
        description: "Please select at least one topic to generate a post.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      const primaryTopic = selectedTopics[0];
      let post = samplePosts[primaryTopic as keyof typeof samplePosts] || samplePosts.technology;
      
      // If custom details are provided, customize the post
      if (customDetails.trim()) {
        post = post.replace(/amazing new framework|AI-powered design tools|first startup/g, customDetails.trim());
      }
      
      setGeneratedPost(post);
      setCharCount(post.length);
      setIsGenerating(false);
      
      toast({
        title: "Post Generated! 🎉",
        description: "Your LinkedIn post is ready to review and edit.",
      });
    }, 2000);
  };

  const handlePostChange = (value: string) => {
    setGeneratedPost(value);
    setCharCount(value.length);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied! 📋",
      description: "Post copied to clipboard successfully.",
    });
  };

  const publishToLinkedIn = async () => {
    if (!accessToken || !generatedPost) {
      toast({
        title: "Unable to Publish",
        description: !accessToken ? "Please connect to LinkedIn first." : "No post content to publish.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await publishPost(generatedPost);
      toast({
        title: "Published! 🎉",
        description: "Your post has been published to LinkedIn successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendEmailNotification = async () => {
    if (!emailAddress || !generatedPost) {
      toast({
        title: "Email Required",
        description: "Please enter an email address and generate a post first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendPostNotification(generatedPost, emailAddress);
      setShowEmailInput(false);
      setEmailAddress("");
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* User Profile & Theme Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <ThemeToggle />
      </div>
      
      {/* Animated Background Elements */}
      <div className="hero-bg absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Content Generation</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
              LinkedIn Post
              <br />
              Generator
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create engaging, professional LinkedIn posts that drive engagement and grow your network with AI-powered content generation
            </p>
          </div>
        </ScrollReveal>

        {/* Connection Status */}
        {isConnected && (
          <ScrollReveal delay={200}>
            <div className="max-w-md mx-auto mb-8">
              <Card className="glass-morphism border-primary/20">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-linkedin-blue to-linkedin-blue-light rounded-full flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Connected to LinkedIn</p>
                    <p className="text-sm text-muted-foreground">{profile?.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={disconnect}>
                    Disconnect
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        )}

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Configuration */}
          <div className="space-y-8">
            {/* Topic Selection */}
            <ScrollReveal delay={300}>
              <Card className="card-elevated card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Wand2 className="h-6 w-6 text-primary" />
                    Select Your Topics
                  </CardTitle>
                  <p className="text-muted-foreground">Choose topics that resonate with your expertise and audience</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {topics.map((topic, index) => (
                      <Button
                        key={topic.id}
                        variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                        className={`justify-start h-auto p-4 transition-all duration-300 group relative overflow-hidden ${
                          selectedTopics.includes(topic.id) 
                            ? `bg-gradient-to-r ${topic.color} text-white hover:scale-105 shadow-glow` 
                            : 'hover:scale-105'
                        }`}
                        onClick={() => handleTopicToggle(topic.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="mr-3 text-2xl">{topic.icon}</span>
                        <span className="text-sm font-medium">{topic.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Custom Details */}
            <ScrollReveal delay={400}>
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Custom Details
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">Add specific details to personalize your content</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add specific details like project names, achievements, or keywords to personalize your post..."
                    value={customDetails}
                    onChange={(e) => setCustomDetails(e.target.value)}
                    rows={4}
                    className="resize-none transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Actions */}
            <ScrollReveal delay={500}>
              <div className="space-y-4">
                {/* Generate Button */}
                <Button 
                  onClick={generatePost}
                  disabled={isGenerating || selectedTopics.length === 0}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-glow"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-6 w-6 animate-spin" />
                      Generating Your Post...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-6 w-6" />
                      Generate LinkedIn Post
                    </>
                  )}
                </Button>

                {/* Connection Actions */}
                {!isConnected ? (
                  <Button 
                    onClick={initiateAuth}
                    disabled={isConnecting}
                    variant="outline"
                    className="w-full h-12 border-linkedin-blue text-linkedin-blue hover:bg-linkedin-blue hover:text-white transition-all duration-300"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Linkedin className="mr-2 h-5 w-5" />
                        Connect to LinkedIn
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={publishToLinkedIn}
                    disabled={!generatedPost}
                    className="w-full h-12 bg-linkedin-blue hover:bg-linkedin-blue-light transition-all duration-300"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Publish to LinkedIn
                  </Button>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Panel - Preview & Actions */}
          <div className="space-y-8">
            {/* LinkedIn Preview */}
            <ScrollReveal delay={600}>
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    LinkedIn Preview
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">See how your post will look on LinkedIn</p>
                </CardHeader>
                <CardContent className="p-0">
                  {/* LinkedIn-style post preview */}
                  <div className="bg-card border border-border rounded-xl p-6 m-6 shadow-inner">
                    {/* User header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center shadow-lg">
                        {profile?.picture ? (
                          <img 
                            src={profile.picture} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{profile?.name || "Your Name"}</h3>
                        <p className="text-sm text-muted-foreground">Your Professional Title</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          2h • <Globe className="w-3 h-3" />
                        </p>
                      </div>
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>

                    {/* Post content */}
                    <div className="mb-6">
                      {generatedPost ? (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                          {generatedPost}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm italic p-8 text-center border-2 border-dashed border-border rounded-lg">
                          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          Your generated post will appear here...
                          <br />
                          <span className="text-xs">Select topics and click generate to get started</span>
                        </div>
                      )}
                    </div>

                    {/* Engagement bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                          <Heart className="h-4 w-4 mr-2" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-colors">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Edit & Actions */}
            {generatedPost && (
              <ScrollReveal delay={700}>
                <Card className="card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Edit Your Post</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={charCount > 1200 ? "destructive" : charCount > 700 ? "secondary" : "default"}
                          className="animate-pulse-glow"
                        >
                          {charCount}/1200
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      value={generatedPost}
                      onChange={(e) => handlePostChange(e.target.value)}
                      rows={8}
                      className="resize-none transition-all focus:ring-2 focus:ring-primary/50"
                      placeholder="Edit your post here..."
                    />
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={copyToClipboard} variant="outline" className="transition-all hover:scale-105">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button onClick={generatePost} variant="outline" className="transition-all hover:scale-105">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>

                    {/* Email Action */}
                    <div className="space-y-3">
                      {!showEmailInput ? (
                        <Button 
                          onClick={() => setShowEmailInput(true)} 
                          variant="outline" 
                          className="w-full border-primary/20 hover:bg-primary/10 transition-all"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Email this Post
                        </Button>
                      ) : (
                        <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-primary/5">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="flex gap-2">
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              onClick={sendEmailNotification} 
                              disabled={isSending}
                              size="sm"
                              className="bg-primary hover:bg-primary-glow"
                            >
                              {isSending ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button 
                            onClick={() => setShowEmailInput(false)} 
                            variant="ghost" 
                            size="sm"
                            className="w-full text-muted-foreground"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}
          </div>
        </div>

        {/* Footer */}
        <ScrollReveal delay={800}>
          <div className="text-center mt-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border shadow-lg">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-medium">Powered by AI Technology</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Create professional content that engages your network and builds your personal brand on LinkedIn
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}