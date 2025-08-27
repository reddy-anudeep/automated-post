import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  User, 
  MessageCircle, 
  Heart, 
  Share, 
  MoreHorizontal,
  Zap,
  Wand2,
  Eye,
  Settings,
  Globe,
  FileText,
  Edit3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollReveal from "@/components/ScrollReveal";

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

const postTemplates = {
  technology: [
    {
      opening: ["Just discovered", "Been experimenting with", "Spent the weekend exploring", "Recently came across"],
      hook: ["a game-changing tool", "an innovative solution", "a revolutionary approach", "something that's transforming"],
      context: ["that's reshaping how we build applications", "that's making developers more productive", "that's solving a problem we've had for years", "that's changing the industry"],
      reflection: ["Sometimes the best innovations are the simplest ones", "It's amazing how the right tool can transform your workflow", "This is why I love technology - it keeps evolving", "Innovation happens when complexity meets simplicity"],
      cta: ["What's your favorite development tool?", "Have you tried anything similar?", "What tools have changed your perspective?", "Share your favorite productivity tools below!"],
      emojis: ["🚀", "💻", "⚡", "🔥", "✨"]
    }
  ],
  ai: [
    {
      opening: ["AI isn't replacing creativity", "The future of AI is collaboration", "Spent time experimenting with AI", "AI is becoming our creative partner"],
      hook: ["it's amplifying human potential", "it's enhancing human intuition", "it's unlocking new possibilities", "it's democratizing innovation"],
      context: ["The magic happens when humans and AI work together", "We're entering an era of augmented creativity", "The key is finding the right balance", "It's not about replacement, it's about enhancement"],
      reflection: ["The future belongs to those who embrace this partnership", "We're just scratching the surface of what's possible", "This collaboration is reshaping every industry", "Human creativity + AI capabilities = unlimited potential"],
      cta: ["How are you using AI in your work?", "What's your take on AI collaboration?", "Share your AI experiences below!", "What AI tools have impressed you?"],
      emojis: ["🤖", "🎨", "⚡", "🚀", "💡"]
    }
  ],
  entrepreneurship: [
    {
      opening: ["Failed my first startup", "Learned the hard way", "Three years ago I made a mistake", "My biggest failure became my greatest teacher"],
      hook: ["Best thing that ever happened to me", "It changed everything", "It was the wake-up call I needed", "It became my foundation for success"],
      context: ["That failure taught me more than any course could", "Every setback became a stepping stone", "I learned to see rejection as redirection", "Those lessons became my competitive advantage"],
      reflection: ["Now I understand that failure is just data", "Success isn't about avoiding failure, it's about learning from it", "The best entrepreneurs are those who've failed and bounced back", "Every 'no' was preparing me for the right 'yes'"],
      cta: ["What failure changed your perspective?", "Share your comeback story!", "What lessons did failure teach you?", "To fellow entrepreneurs: keep pushing forward!"],
      emojis: ["💪", "🚀", "📈", "💡", "🔥"]
    }
  ]
};

export default function LinkedInPostGenerator() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generatedPost, setGeneratedPost] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [userContent, setUserContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

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

const generateUniquePost = (topic: string, templates: any, customDetails?: string) => {
    const template = templates[0]; // Using first template for now
    const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    const opening = randomElement(template.opening);
    const hook = randomElement(template.hook);
    const context = randomElement(template.context);
    const reflection = randomElement(template.reflection);
    const cta = randomElement(template.cta);
    const emoji = randomElement(template.emojis);
    
    // Replace placeholder content with custom details if provided
    let finalHook = hook;
    if (customDetails?.trim()) {
      finalHook = customDetails.trim();
    }
    
    return `${opening} ${finalHook} ${context} ${emoji}

${reflection}

${cta}

${generateHashtags("", [topic])}`;
  };

  const transformUserContent = (content: string, topics: string[]) => {
    // Extract key themes and transform into LinkedIn format
    const lines = content.split('\n').filter(line => line.trim());
    
    // LinkedIn post structures
    const structures = [
      // Hook + Story + Lesson + CTA
      (content: string) => {
        const hook = `Here's what I learned: ${content.split('.')[0]}.`;
        const story = lines.slice(1, -1).join('\n\n');
        const lesson = `The takeaway? ${lines[lines.length - 1] || 'Every experience teaches us something valuable.'}`;
        const cta = topics.length > 0 ? 
          `What's your experience with ${topics[0]}?` : 
          'What are your thoughts on this?';
        
        return `${hook}

${story}

${lesson}

${cta}

${generateHashtags(content, topics)}`;
      },
      
      // Problem + Solution + Results + CTA
      (content: string) => {
        const problem = `Recently faced a challenge: ${content.substring(0, 100)}...`;
        const solution = lines.slice(1, 3).join('\n\n');
        const results = `The outcome exceeded expectations.`;
        const cta = 'Have you faced similar challenges? Share your solutions!';
        
        return `${problem}

${solution}

${results}

${cta}

${generateHashtags(content, topics)}`;
      },
      
      // Insight + Context + Impact + CTA
      (content: string) => {
        const insight = `💡 Key insight: ${lines[0]}`;
        const context = lines.slice(1).join('\n\n');
        const impact = `This perspective is reshaping how I approach ${topics[0] || 'my work'}.`;
        const cta = 'What insights have changed your approach recently?';
        
        return `${insight}

${context}

${impact}

${cta}

${generateHashtags(content, topics)}`;
      }
    ];
    
    // Randomly select a structure
    const selectedStructure = structures[Math.floor(Math.random() * structures.length)];
    return selectedStructure(content);
  };

  const generatePost = async () => {
    // Check if we have either topics or user content
    if (selectedTopics.length === 0 && !userContent.trim()) {
      toast({
        title: "Content Required",
        description: "Please select topics or provide your own content to generate a post.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      let post = "";
      
      // If user provided their own content, transform it into a LinkedIn post
      if (userContent.trim()) {
        post = transformUserContent(userContent.trim(), selectedTopics);
      } else {
        // Use topic-based generation with templates
        const primaryTopic = selectedTopics[0];
        const templates = postTemplates[primaryTopic as keyof typeof postTemplates];
        
        if (templates) {
          post = generateUniquePost(primaryTopic, templates, customDetails);
        } else {
          // Fallback for topics without templates
          post = generateUniquePost("technology", postTemplates.technology, customDetails);
        }
      }
      
      setGeneratedPost(post);
      setCharCount(post.length);
      setIsGenerating(false);
      
      toast({
        title: "Post Generated! 🎉",
        description: "Your unique LinkedIn post is ready to copy and share.",
      });
    }, 2000);
  };

  const generateHashtags = (content: string, topics: string[]) => {
    // Generate relevant hashtags based on content and selected topics
    const hashtagMap: { [key: string]: string[] } = {
      technology: ["#Technology", "#Innovation", "#WebDevelopment", "#TechTrends"],
      ai: ["#ArtificialIntelligence", "#AI", "#MachineLearning", "#Innovation"],
      entrepreneurship: ["#Entrepreneurship", "#StartupLife", "#Business", "#Innovation"],
      leadership: ["#Leadership", "#Management", "#TeamBuilding", "#ProfessionalGrowth"],
      career: ["#CareerTips", "#ProfessionalDevelopment", "#CareerGrowth", "#Leadership"],
      trends: ["#IndustryTrends", "#Business", "#Innovation", "#Technology"],
      branding: ["#PersonalBranding", "#Marketing", "#Brand", "#ProfessionalGrowth"],
      projects: ["#ProjectManagement", "#Success", "#Achievement", "#Innovation"]
    };
    
    let hashtags: string[] = [];
    
    // Add hashtags from selected topics
    topics.forEach(topic => {
      if (hashtagMap[topic]) {
        hashtags.push(...hashtagMap[topic].slice(0, 2));
      }
    });
    
    // If no topics selected, add generic professional hashtags
    if (topics.length === 0) {
      hashtags = ["#Professional", "#LinkedIn", "#Career", "#Success"];
    }
    
    // Remove duplicates and limit to 4
    hashtags = [...new Set(hashtags)].slice(0, 4);
    
    return hashtags.join(" ");
  };

  const handlePostChange = (value: string) => {
    setGeneratedPost(value);
    setCharCount(value.length);
  };

  const copyToClipboard = () => {
    if (!generatedPost) {
      toast({
        title: "No Content",
        description: "Please generate a post first.",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied! 📋",
      description: "Post copied to clipboard. Ready to paste on LinkedIn!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
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
              Create engaging, professional LinkedIn posts from your content or topic selection. Generate, edit, and copy to share instantly.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Configuration */}
          <div className="space-y-8">
            {/* User Content Input */}
            <ScrollReveal delay={200}>
              <Card className="card-elevated card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="h-6 w-6 text-primary" />
                    Your Content
                  </CardTitle>
                  <p className="text-muted-foreground">Paste your content here and we'll turn it into a professional LinkedIn post</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your content here... Share your thoughts, achievements, insights, or any content you want to transform into a LinkedIn post."
                    value={userContent}
                    onChange={(e) => setUserContent(e.target.value)}
                    rows={6}
                    className="resize-none transition-all focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Pro tip: Paste any content - we'll optimize it for LinkedIn and add relevant hashtags
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Topic Selection */}
            <ScrollReveal delay={300}>
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Select Topics (Optional)
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">Choose topics to generate content or enhance your existing content with relevant hashtags</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {topics.map((topic, index) => (
                      <Button
                        key={topic.id}
                        variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                        className={`justify-start h-auto p-3 transition-all duration-300 group relative overflow-hidden text-xs ${
                          selectedTopics.includes(topic.id) 
                            ? `bg-gradient-to-r ${topic.color} text-white hover:scale-105 shadow-glow` 
                            : 'hover:scale-105'
                        }`}
                        onClick={() => handleTopicToggle(topic.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="mr-2 text-lg">{topic.icon}</span>
                        <span className="font-medium">{topic.label}</span>
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
                  <p className="text-muted-foreground text-sm">Add specific details to personalize topic-based content</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add specific details like project names, achievements, or keywords to personalize topic-based posts..."
                    value={customDetails}
                    onChange={(e) => setCustomDetails(e.target.value)}
                    rows={3}
                    className="resize-none transition-all focus:ring-2 focus:ring-primary/50"
                  />
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Generate Button */}
            <ScrollReveal delay={500}>
              <Button 
                onClick={generatePost}
                disabled={isGenerating}
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
                        <User className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Your Name</h3>
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
                          <span className="text-xs">Add your content or select topics and click generate</span>
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
                      <CardTitle className="flex items-center gap-2">
                        <Edit3 className="h-5 w-5 text-primary" />
                        Edit & Copy
                      </CardTitle>
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
                      <Button 
                        onClick={copyToClipboard} 
                        className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all hover:scale-105 shadow-glow"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to LinkedIn
                      </Button>
                      <Button onClick={generatePost} variant="outline" className="transition-all hover:scale-105">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
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
              Transform any content into professional LinkedIn posts. Generate, edit, copy, and share instantly.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}