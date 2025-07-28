import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Send, Search, CheckCircle, Clock, ArrowRight, Download, MapPin, TrendingUp, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { lookupCompanies } from "../lib/api";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  companySummary?: {
  name: string;
  industry: string;
  size: string;
  location: string;
    recentNews: string;
    techStack: string[];
  };
  options?: Array<{
    id: string;
    text: string;
    icon?: React.ReactNode;
  }>;
  followUpOptions?: Array<{
    id: string;
    text: string;
    icon?: React.ReactNode;
    category: string;
  }>;
  isStreaming?: boolean;
  streamingSteps?: Array<{
    text: string;
    completed: boolean;
  }>;
}

export function GuidedResearchPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const userName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
    const userCompany = profile?.company || 'your company';
    const userRole = profile?.role || 'sales professional';
    
    const welcomeMessage: Message = {
      id: "welcome",
      type: "assistant",
      content: `Hello ${userName}! I'm your AI research assistant, optimized for ${userCompany} ${userRole}s. I understand your products, competitive landscape, and what drives success in your role. What prospect would you like me to research today?`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, [user, profile]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const parseCompanyFromInput = (input: string): string => {
    // Extract company name from various input formats
    const patterns = [
      /research\s+(.+)/i,
      /analyze\s+(.+)/i,
      /tell me about\s+(.+)/i,
      /lookup\s+(.+)/i,
      /find\s+(.+)/i,
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    // If no pattern matches, assume the entire input is a company name
    return input.trim();
  };

  const isResearchQuery = (input: string): boolean => {
    const researchKeywords = ['research', 'analyze', 'tell me about', 'lookup', 'find', 'investigate'];
    const lowerInput = input.toLowerCase();
    return researchKeywords.some(keyword => lowerInput.includes(keyword)) || 
           lowerInput.length > 2; // Assume any substantial input is a research query
  };

  const getCompanyData = async (companyName: string) => {
    try {
      const response = await lookupCompanies(companyName, 1);
      if (response.data.companies.length > 0) {
        const company = response.data.companies[0];
        return {
          name: company.name,
          industry: company.industry || 'Technology',
          size: '1,000+ employees', // Mock data
          location: 'United States', // Mock data
          recentNews: 'Recently announced new product launch',
          techStack: ['AWS', 'React', 'Node.js', 'MongoDB'], // Mock data
          domain: company.domain
        };
      }
    } catch (error) {
      console.error('Failed to lookup company:', error);
    }
    
    // Fallback mock data
    return {
      name: companyName,
      industry: 'Technology',
      size: '500-1000 employees',
      location: 'United States',
      recentNews: 'Expanding into new markets',
      techStack: ['Salesforce', 'HubSpot', 'AWS'],
    };
  };

  const getResearchOptions = (_companyName: string) => [
    { id: "decision_makers", text: "Find Decision Makers", icon: <Search className="w-4 h-4" /> },
    { id: "tech_stack", text: "Analyze Tech Stack", icon: <Zap className="w-4 h-4" /> },
    { id: "competitive_positioning", text: "Competitive Positioning", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "recent_activities", text: "Recent Company Activities", icon: <Clock className="w-4 h-4" /> },
  ];

  const simulateStreaming = (messageId: string, researchArea: string) => {
    const steps = [
      { text: "Searching company database...", completed: false },
      { text: "Analyzing public information...", completed: false },
      { text: "Cross-referencing data sources...", completed: false },
      { text: "Generating insights...", completed: false },
    ];
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isStreaming: true, streamingSteps: steps }
        : msg
    ));

    steps.forEach((_, index) => {
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId && msg.streamingSteps
            ? {
                ...msg,
                streamingSteps: msg.streamingSteps.map((step, i) => 
                  i === index ? { ...step, completed: true } : step
                )
              }
            : msg
        ));
      }, (index + 1) * 1000);
    });

    setTimeout(() => {
      const findings = {
        title: `${researchArea} Analysis for ${currentCompany}`,
        summary: `Based on our analysis, here are the key findings for ${currentCompany}:`,
        items: [
          {
            title: "Key Finding 1",
            description: "Important insight about the company's current situation.",
          },
          {
            title: "Key Finding 2", 
            description: "Strategic information relevant to your sales approach.",
          },
        ]
      };

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              isStreaming: false,
              content: findings.summary,
              followUpOptions: [
                { id: "create_outreach", text: "Create Outreach Message", icon: <Send className="w-4 h-4" />, category: "action" },
                { id: "export_report", text: "Export Research", icon: <Download className="w-4 h-4" />, category: "action" },
                { id: "research_another", text: "Research Another Company", icon: <Search className="w-4 h-4" />, category: "explore" }
              ]
            }
          : msg
      ));
      setIsTyping(false);
    }, steps.length * 1000 + 500);
  };

  const handleSendMessage = async (messageContent?: string) => {
    const messageToSend = messageContent || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = messageToSend;
    setInputValue("");
    setIsTyping(true);

    setTimeout(async () => {
      const messageId = (Date.now() + 1).toString();
      
      if (isResearchQuery(currentInput)) {
        const company = parseCompanyFromInput(currentInput);
        setCurrentCompany(company);
        const companyData = await getCompanyData(company);
        
        const summaryMessage: Message = {
          id: messageId,
          type: "assistant",
          content: "",
          timestamp: new Date(),
          companySummary: companyData,
        };

        setMessages(prev => [...prev, summaryMessage]);

        setTimeout(() => {
          const optionsMessageId = (Date.now() + 2).toString();
          
          const optionsMessage: Message = {
            id: optionsMessageId,
            type: "assistant",
            content: `What specific aspect of ${company} would you like me to research first?`,
            timestamp: new Date(),
            options: getResearchOptions(company),
          };

          setMessages(prev => [...prev, optionsMessage]);
          setIsTyping(false);
        }, 2000);
      } else {
        const assistantMessage: Message = {
          id: messageId,
          type: "assistant",
          content: "I can help you research companies and prospects. Try asking me to 'Research [Company Name]' to get started with comprehensive discovery.",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }
    }, 1000);
  };

  const handleOptionClick = (optionId: string, optionText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: optionText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const messageId = (Date.now() + 1).toString();
      
      if (["decision_makers", "tech_stack", "competitive_positioning", "recent_activities"].includes(optionId)) {
        const streamingMessage: Message = {
          id: messageId,
          type: "assistant",
          content: `🔍 Analyzing ${optionText.toLowerCase()}...`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, streamingMessage]);
        simulateStreaming(messageId, optionText);
      } else {
        const responses = {
          "create_outreach": "I'll help you create personalized outreach based on the decision makers we found...",
          "export_report": "Preparing your research report for download...",
          "research_another": "What other company would you like to research?",
        };

        const assistantMessage: Message = {
          id: messageId,
          type: "assistant",
          content: responses[optionId as keyof typeof responses] || "Let me help you with that...",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Extract user data for display
  const userData = {
    firstName: profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
    lastName: profile?.name?.split(' ')[1] || '',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 pb-4 pt-32 md:pt-20 min-h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pt-8">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {message.type === "user" ? (
                    <>
                      <AvatarImage src="" alt={`${userData.firstName} ${userData.lastName}`} />
                      <AvatarFallback className="text-xs">
                        {getInitials(userData.firstName, userData.lastName)}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className={`space-y-2 ${message.type === "user" ? "text-right" : "text-left"}`}>
                  {/* Company Summary Card */}
                  {message.companySummary && (
      <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.companySummary.name}</span>
                            <Badge variant="secondary">{message.companySummary.industry}</Badge>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">{message.companySummary.size}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{message.companySummary.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>Recent: {message.companySummary.recentNews}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              <span className="text-muted-foreground text-sm">Tech:</span>
                              {message.companySummary.techStack.map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
          </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

                  {/* Regular Message Content */}
                  {message.content && (
                    <Card className={message.type === "user" ? "bg-primary text-primary-foreground" : ""}>
                      <CardContent className="p-3">
                        <p>{message.content}</p>
                        
                        {/* Streaming Steps */}
                        {message.isStreaming && message.streamingSteps && (
                          <div className="mt-3 space-y-2">
                            {message.streamingSteps.map((step, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                {step.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />
                                )}
                                <span className={step.completed ? "text-foreground" : "text-muted-foreground"}>
                                  {step.text}
                                </span>
                              </div>
                            ))}
                          </div>
        )}

                        {/* Research Options */}
                        {message.options && !message.isStreaming && (
                          <div className="mt-3 grid grid-cols-1 gap-2">
                            {message.options.map((option) => (
                              <Button
                                key={option.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left"
                                onClick={() => handleOptionClick(option.id, option.text)}
                              >
                                {option.icon && <span className="mr-2">{option.icon}</span>}
                                {option.text}
                              </Button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Follow-up Options */}
                  {message.followUpOptions && (
                    <Card className="bg-accent/10 border-dashed">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <ArrowRight className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">What would you like to do next?</span>
      </div>
                        <div className="space-y-2">
                          {message.followUpOptions.map((option) => (
                <Button 
                              key={option.id}
                  variant="ghost" 
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => handleOptionClick(option.id, option.text)}
                >
                              <div className="flex items-center gap-2">
                                {option.icon}
                                <span>{option.text}</span>
                                <Badge variant="outline" className="text-xs ml-auto">
                                  {option.category}
                                </Badge>
                  </div>
                </Button>
                          ))}
                        </div>
              </CardContent>
            </Card>
                  )}
                  
                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-3xl">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </CardContent>
  </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to research a company, e.g., 'Research Acme Corp'"
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isTyping}>
              <Send className="w-4 h-4" />
        </Button>
      </div>
          
          {/* Suggested Queries */}
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage("Research Tesla")}
              disabled={isTyping}
            >
              Research Tesla
            </Button>
              <Button
                variant="outline"
              size="sm"
              onClick={() => handleSendMessage("Research Shopify")}
              disabled={isTyping}
              >
              Research Shopify
              </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage("Research Microsoft")}
              disabled={isTyping}
            >
              Research Microsoft
        </Button>
      </div>
         </div>
      </div>
    </div>
); 
} 