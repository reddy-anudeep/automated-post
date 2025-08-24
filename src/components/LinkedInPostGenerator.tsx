import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Copy, Send, User, MessageCircle, Heart, Share, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const topics = [
  { id: "technology", label: "Technology", icon: "💻" },
  { id: "ai", label: "Artificial Intelligence", icon: "🤖" },
  { id: "entrepreneurship", label: "Entrepreneurship", icon: "🚀" },
  { id: "leadership", label: "Leadership", icon: "👑" },
  { id: "career", label: "Career Tips", icon: "📈" },
  { id: "trends", label: "Industry Trends", icon: "📊" },
  { id: "branding", label: "Personal Branding", icon: "✨" },
  { id: "projects", label: "Project Showcase", icon: "🎯" },
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
  const { toast } = useToast();

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

  const simulatePublish = () => {
    toast({
      title: "Published! 🚀",
      description: "Your post has been published to LinkedIn (demo mode).",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            LinkedIn Post Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create engaging, professional LinkedIn posts that drive engagement and grow your network
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Configuration */}
          <div className="space-y-6 animate-slide-up">
            {/* Topic Selection */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Select Your Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {topics.map((topic) => (
                    <Button
                      key={topic.id}
                      variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                      className="justify-start h-auto p-4 transition-smooth"
                      onClick={() => handleTopicToggle(topic.id)}
                    >
                      <span className="mr-2 text-lg">{topic.icon}</span>
                      <span className="text-sm">{topic.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Details */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Custom Details (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add specific details like project names, achievements, or keywords to personalize your post..."
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button 
              onClick={generatePost}
              disabled={isGenerating || selectedTopics.length === 0}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Post...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate LinkedIn Post
                </>
              )}
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* LinkedIn Preview */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>LinkedIn Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* LinkedIn-style post preview */}
                <div className="bg-card border border-border rounded-lg p-6 m-6">
                  {/* User header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Your Name</h3>
                      <p className="text-sm text-muted-foreground">Your Professional Title</p>
                      <p className="text-xs text-muted-foreground">2h • 🌍</p>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-muted-foreground ml-auto" />
                  </div>

                  {/* Post content */}
                  <div className="mb-4">
                    {generatedPost ? (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {generatedPost}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm italic">
                        Your generated post will appear here...
                      </div>
                    )}
                  </div>

                  {/* Engagement bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit & Actions */}
            {generatedPost && (
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Edit Your Post</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={charCount > 1200 ? "destructive" : charCount > 700 ? "secondary" : "default"}>
                        {charCount}/1200
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={generatedPost}
                    onChange={(e) => handlePostChange(e.target.value)}
                    rows={8}
                    className="resize-none"
                    placeholder="Edit your post here..."
                  />
                  
                  <div className="flex gap-3">
                    <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button onClick={generatePost} variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button onClick={simulatePublish} className="flex-1">
                      <Send className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}