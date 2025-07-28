import { useState, useRef, useEffect, useMemo } from 'react';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { IntelligenceCard } from '../components/chat/IntelligenceCard';
import { parseUserInput } from '../utils/nlp-parser';
import { getCompanyOverview } from '../lib/api';
import { toast } from 'sonner';
import { useChatPersistence } from '../hooks/useChatPersistence';
import { Button } from '../components/ui/button';
import { 
  ChevronRight, 
  ChevronLeft, 
  History, 
  User, 
  Trash2,
  Building,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';
import type { SalesIntelligenceResponse, SalesContext } from '../types/api';

interface CompanyOverview {
  name: string;
  domain: string;
  industry: string;
  description?: string;
  foundedYear?: number;
  
  // Legacy fields for backward compatibility
  size?: string;
  revenue?: string;
  
  // New comprehensive fields
  financialData?: {
    stockSymbol?: string;
    stockExchange?: string;
    marketCap?: string;
    revenue?: string;
    revenueGrowth?: string;
    totalFunding?: string;
    latestFundingRound?: {
      type: string;
      amount: string;
      date: string;
      investors: string[];
      citations: number[];
    };
    peRatio?: number;
    citations: number[];
  };
  employeeCount?: number;
  employeeRange?: string;
  leadership?: Array<{
    name: string;
    title: string;
    department?: string;
    background?: string;
    citations: number[];
  }>;
  marketData?: {
    marketSize?: string;
    marketShare?: string;
    marketPosition?: string;
    majorCompetitors?: string[];
    competitiveAdvantages?: string[];
    citations: number[];
  };
  products?: string[];
  services?: string[];
  recentNews?: Array<{
    title: string;
    summary: string;
    date: string;
    source: string;
    relevance: 'high' | 'medium' | 'low';
    citations: number[];
  }>;
  majorCustomers?: string[];
  businessModel?: string;
  revenueModel?: string;
  pricingStructure?: Array<{
    name: string;
    price: string;
    period: string;
    features?: string[];
    citations: number[];
  }>;
  performanceMetrics?: Array<{
    name: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
    period?: string;
    citations: number[];
  }>;
  competitivePosition?: string;
  keyDifferentiators?: string[];
  confidence?: {
    overall: number;
    financial: number;
    leadership: number;
    market: number;
    products: number;
    size: number;
    revenue: number;
  };
  sources?: Array<{
    id: number;
    url: string;
    title: string;
    domain: string;
    sourceType: string;
    snippet: string;
    credibilityScore: number;
    lastUpdated: string;
  }>;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intelligence?: SalesIntelligenceResponse;
  overview?: CompanyOverview;
  suggestions?: string[];
  loadingState?: 'overview' | 'full-analysis' | 'complete';
  showFullAnalysisOption?: boolean;
  sourcedClaims?: import('../types/api').SourcedClaim[];
  enhancedSources?: import('../types/api').EnhancedSource[];
  confidenceScore?: number;
  [key: string]: unknown; // Allow additional properties for compatibility
}

interface SmartContext {
  userCompany: string | null;
  competitors: string[];
  industry: string | null;
  salesContext: SalesContext | null;
  meetingStage: 'unknown' | 'discovery' | 'demo' | 'negotiation' | 'closing';
  confidence: number;
  missingContext: string[];
  conversationHistory: string[];
  intelligenceGenerated: boolean;
}

interface CompanyHistoryItem {
  domain: string;
  name: string;
  lastResearched: Date;
  context: SalesContext;
  intelligence?: SalesIntelligenceResponse;
  overview?: CompanyOverview;
}

interface CompetitorAnalysis {
  name: string;
  marketShare?: string;
  strengths: string[];
  weaknesses: string[];
  lastUpdated: Date;
}

interface IndustryTrend {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  source: string;
}

interface DashboardData {
  userCompany: string | null;
  targetCompanies: CompanyHistoryItem[];
  competitorAnalysis: CompetitorAnalysis[];
  salesMetrics: {
    dealProbability: number;
    confidence: number;
    timeToClose: string;
  };
  recentInsights: Array<{
    company: string;
    insight: string;
    timestamp: Date;
    category: string;
  }>;
  industryTrends: IndustryTrend[];
}

export function HybridIntelligenceExperience() {
  const initialMessages: Message[] = useMemo(() => [
    {
      id: '1',
      content: "Hi! I'm your smart intelligence assistant. I'll adapt to your conversation style and ask intelligent follow-up questions to provide the most relevant insights. What company would you like to research today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "Research Shopify for a discovery call",
        "Compare Tesla vs Ford in EVs",
        "Analyze Microsoft's cloud strategy",
        "Prepare for Netflix competitive discussion"
      ],
    },
  ], []);

  const { messages, setMessages, clearHistory, isLoaded } = useChatPersistence({
    storageKey: 'cc-intelligence-hybrid-chat',
    initialMessages,
    maxHistorySize: 100
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [smartContext, setSmartContext] = useState<SmartContext>({
    userCompany: null,
    competitors: [],
    industry: null,
    salesContext: null,
    meetingStage: 'unknown',
    confidence: 0,
    missingContext: [],
    conversationHistory: [],
    intelligenceGenerated: false,
  });

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userCompany: null,
    targetCompanies: [],
    competitorAnalysis: [],
    salesMetrics: {
      dealProbability: 0,
      confidence: 0,
      timeToClose: 'Unknown'
    },
    recentInsights: [],
    industryTrends: []
  });

  const [companyHistory, setCompanyHistory] = useState<CompanyHistoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load company history from localStorage
  useEffect(() => {
    if (isLoaded) {
      const savedHistory = localStorage.getItem('cc-intelligence-company-history');
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          // Convert timestamp strings back to Date objects
          const historyWithDates = parsed.map((item: Record<string, unknown>) => ({
            ...item,
            lastResearched: new Date(item.lastResearched as string)
          }));
          setCompanyHistory(historyWithDates);
        } catch (error) {
          console.error('Error loading company history:', error);
        }
      }

      // Load dashboard data
      const savedDashboard = localStorage.getItem('cc-intelligence-hybrid-dashboard');
      if (savedDashboard) {
        try {
          const parsed = JSON.parse(savedDashboard);
          parsed.recentInsights = parsed.recentInsights?.map((insight: Record<string, unknown>) => ({
            ...insight,
            timestamp: new Date(insight.timestamp as string)
          })) || [];
          setDashboardData(parsed);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      }
    }
  }, [isLoaded]);

  // Save company history when it changes
  useEffect(() => {
    if (isLoaded && companyHistory.length > 0) {
      localStorage.setItem('cc-intelligence-company-history', JSON.stringify(companyHistory));
    }
  }, [companyHistory, isLoaded]);

  // Save dashboard data when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cc-intelligence-hybrid-dashboard', JSON.stringify(dashboardData));
    }
  }, [dashboardData, isLoaded]);

  const handleClearHistory = () => {
    clearHistory();
    setSmartContext({
      userCompany: null,
      competitors: [],
      industry: null,
      salesContext: null,
      meetingStage: 'unknown',
      confidence: 0,
      missingContext: [],
      conversationHistory: [],
      intelligenceGenerated: false,
    });
    setCompanyHistory([]);
    setDashboardData({
      userCompany: null,
      targetCompanies: [],
      competitorAnalysis: [],
      salesMetrics: {
        dealProbability: 0,
        confidence: 0,
        timeToClose: 'Unknown'
      },
      recentInsights: [],
      industryTrends: []
    });
    localStorage.removeItem('cc-intelligence-company-history');
    localStorage.removeItem('cc-intelligence-hybrid-dashboard');
    setIsDashboardOpen(false);
    toast.success('Chat history and data cleared');
  };

  const addToCompanyHistory = (company: string, context: SalesContext, intelligence?: SalesIntelligenceResponse, overview?: CompanyOverview) => {
    const historyItem: CompanyHistoryItem = {
      domain: company,
      name: company,
      lastResearched: new Date(),
      context,
      intelligence,
      overview
    };

    setCompanyHistory(prev => {
      // Remove existing entry for this company if it exists
      const filtered = prev.filter(item => item.domain !== company);
      // Add new entry at the beginning
      return [historyItem, ...filtered.slice(0, 9)]; // Keep max 10 items
    });
  };

  const loadCompanyFromHistory = (item: CompanyHistoryItem) => {
    // Add a message showing we're loading this company
    const loadMessage: Message = {
      id: Date.now().toString(),
      content: `Loading research for ${item.name}...`,
      sender: 'ai',
      timestamp: new Date(),
      intelligence: item.intelligence,
      overview: item.overview
    };

    setMessages(prev => [...prev, loadMessage]);
    
    // Update smart context
    setSmartContext(prev => ({
      ...prev,
      userCompany: item.domain,
      salesContext: item.context,
      intelligenceGenerated: !!item.intelligence
    }));

    // Open dashboard if we have data
    if (item.intelligence || item.overview) {
      setIsDashboardOpen(true);
    }

    setIsHistoryOpen(false);
    toast.success(`Loaded research for ${item.name}`);
  };

  const analyzeUserInput = async (input: string): Promise<import('../utils/nlp-parser').ParsedUserInput> => {
    const analysis = await parseUserInput(input);
    
    // Update smart context based on analysis
    setSmartContext(prev => {
      const updated = { ...prev };
      
      if (analysis.company && analysis.company !== prev.userCompany) {
        updated.userCompany = analysis.company;
        updated.intelligenceGenerated = false;
      }
      
      if (analysis.salesContext) {
        updated.salesContext = analysis.salesContext;
      }
      
      // Determine missing context and confidence
      updated.missingContext = [];
      if (!updated.userCompany) updated.missingContext.push('target company');
      if (!updated.salesContext) updated.missingContext.push('meeting context');
      
      updated.confidence = Math.max(0, Math.min(100, 
        (updated.userCompany ? 40 : 0) + 
        (updated.salesContext ? 30 : 0) + 
        (analysis.additionalContext ? 10 : 0)
      ));

      return updated;
    });

    return analysis;
  };

  const generateSmartFollowUp = (analysis: import('../utils/nlp-parser').ParsedUserInput, currentContext: SmartContext): string | null => {
    // Use fresh analysis results combined with current context for better decision making
    const hasCompany = analysis.company || currentContext.userCompany;
    const hasContext = analysis.salesContext || currentContext.salesContext;
    const confidence = hasCompany ? (hasContext ? 70 : 50) : 20;
    
    if (confidence < 70) {
      if (!hasCompany) {
        return "What company are you researching?";
      }
      
      if (!hasContext) {
        return "What type of meeting or analysis are you preparing for? (Discovery call, competitive analysis, renewal discussion, etc.)";
      }
      
      if (currentContext.competitors.length === 0 && (analysis.salesContext === 'competitive' || currentContext.salesContext === 'competitive')) {
        return "Who are their main competitors you're concerned about?";
      }
    }
    
    return null;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Analyze the user input
      const analysis = await analyzeUserInput(content);
      
      // Use analysis result instead of stale smartContext for better logic
      const hasCompany = analysis.company || smartContext.userCompany;
      const hasContext = analysis.salesContext || smartContext.salesContext;
      const currentConfidence = hasCompany ? (hasContext ? 70 : 50) : 20;
      
      // Generate smart follow-up based on analysis and current context
      const followUpQuestion = generateSmartFollowUp(analysis, smartContext);
      
      if (followUpQuestion && !smartContext.intelligenceGenerated && currentConfidence < 70) {
        // Ask intelligent follow-up question
        const followUpMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: followUpQuestion,
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, followUpMessage]);
      } else if (hasCompany) {
        // Proceed with intelligence generation using the company from analysis
        const companyToAnalyze = analysis.company || smartContext.userCompany!;
        let overview: CompanyOverview;

        // First get company overview for quick insights
        try {
          overview = await getCompanyOverview(companyToAnalyze);
          
          const overviewMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Here's what I found about ${companyToAnalyze}:`,
            sender: 'ai',
            timestamp: new Date(),
            overview,
            loadingState: 'overview',
            showFullAnalysisOption: true
          };
          
          setMessages(prev => [...prev, overviewMessage]);
          
          // Add to company history
          addToCompanyHistory(companyToAnalyze, analysis.salesContext || 'discovery', undefined, overview);
          
          // Open dashboard
          setIsDashboardOpen(true);
          
          // Update dashboard data
          setDashboardData(prev => ({
            ...prev,
            userCompany: companyToAnalyze,
            recentInsights: [
              {
                company: companyToAnalyze,
                insight: `Company overview generated`,
                timestamp: new Date(),
                category: 'overview'
              },
              ...prev.recentInsights.slice(0, 9)
            ]
          }));

        } catch (error) {
          console.error('Error getting company overview:', error);
          
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "I encountered an issue getting the company overview. Let me try a different approach or you can provide more specific details about what you'd like to know.",
            sender: 'ai',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }

        setSmartContext(prev => ({ ...prev, intelligenceGenerated: true }));
      } else {
        // General conversation response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I understand. Can you provide more details about the company and what specific information you're looking for?",
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I encountered an error processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };



  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your intelligence workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-inter">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Intelligence</h1>
            {smartContext.userCompany && (
              <div className="text-sm text-gray-500">
                Researching: <span className="font-medium text-gray-700">{smartContext.userCompany}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isDashboardOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/profile'}
              className="text-gray-600 hover:text-gray-900"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Company History Sidebar */}
      {isHistoryOpen && (
        <div className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 z-40 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Research History</h2>
              <div className="flex items-center gap-2">
                {messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                    className="text-gray-500 hover:text-red-600"
                    title="Clear chat history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHistoryOpen(false)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {companyHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">No companies researched yet</p>
            ) : (
              <div className="space-y-2">
                {companyHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => loadCompanyFromHistory(item)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.context} • {item.lastResearched.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {companyHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="w-full mt-4 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Clear All History
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 pt-16 ${isHistoryOpen ? 'ml-80' : ''} ${isDashboardOpen ? 'mr-96' : ''} transition-all duration-300 bg-gray-50 h-screen overflow-x-hidden`}>
        {/* Chat Widget Container - natural conversation flow */}
        <div className="h-full p-6">
          <div className="max-w-4xl mx-auto h-full bg-white rounded-xl border border-gray-200 shadow-lg">
            {/* Messages and Input Area - natural conversation flow */}
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <MessageBubble
                      message={message.content}
                      isUser={message.sender === 'user'}
                      timestamp={message.timestamp}
                      sourcedClaims={message.sourcedClaims as import('../types/api').SourcedClaim[] | undefined}
                      enhancedSources={message.enhancedSources as import('../types/api').EnhancedSource[] | undefined}
                      confidenceScore={message.confidenceScore as number | undefined}
                    />
                    
                    {(message.overview as CompanyOverview | undefined) && (
                      <div className="mt-4">
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Company Overview</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 font-medium min-w-[80px]">Company:</span>
                              <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 font-medium min-w-[80px]">Domain:</span>
                              <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.domain || 'Unknown'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 font-medium min-w-[80px]">Industry:</span>
                              <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.industry || 'Unknown'}</span>
                          </div>
                            {(message.overview as CompanyOverview)?.description && (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-[80px]">About:</span>
                                <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.description}</span>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.foundedYear && (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-[80px]">Founded:</span>
                                <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.foundedYear}</span>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.financialData && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Financial Information</h4>
                                <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                                  {(message.overview as CompanyOverview)?.financialData?.stockSymbol && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-gray-500 font-medium min-w-[80px]">Stock:</span>
                                      <span className="text-gray-900 flex-1">
                                        {(message.overview as CompanyOverview)?.financialData?.stockSymbol}
                                        {(message.overview as CompanyOverview)?.financialData?.stockExchange && ` (${(message.overview as CompanyOverview)?.financialData?.stockExchange})`}
                                      </span>
                                    </div>
                                  )}
                                  {(message.overview as CompanyOverview)?.financialData?.marketCap && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-gray-500 font-medium min-w-[80px]">Market Cap:</span>
                                      <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.financialData?.marketCap}</span>
                                    </div>
                                  )}
                                  {(message.overview as CompanyOverview)?.financialData?.revenue && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-gray-500 font-medium min-w-[80px]">Revenue:</span>
                                      <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.financialData?.revenue}</span>
                                    </div>
                                  )}
                                  {(message.overview as CompanyOverview)?.financialData?.totalFunding && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-gray-500 font-medium min-w-[80px]">Funding:</span>
                                      <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.financialData?.totalFunding}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.employeeCount && (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-[80px]">Employees:</span>
                                <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.employeeCount?.toLocaleString()}</span>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.employeeRange && (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-[80px]">Size:</span>
                                <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.employeeRange}</span>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.leadership && (message.overview as CompanyOverview)?.leadership!.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Leadership</h4>
                                <div className="space-y-2 pl-4 border-l-2 border-green-200">
                                  {(message.overview as CompanyOverview)?.leadership?.slice(0, 3).map((leader, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <span className="text-gray-500 font-medium min-w-[80px]">{leader.title}:</span>
                                      <span className="text-gray-900 flex-1">{leader.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.products && (message.overview as CompanyOverview)?.products!.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Products & Services</h4>
                                <div className="pl-4 border-l-2 border-purple-200">
                                  <div className="flex flex-wrap gap-2">
                                    {(message.overview as CompanyOverview)?.products?.slice(0, 5).map((product, index) => (
                                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                        {product}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.majorCustomers && (message.overview as CompanyOverview)?.majorCustomers!.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Major Customers</h4>
                                <div className="pl-4 border-l-2 border-orange-200">
                                  <div className="flex flex-wrap gap-2">
                                    {(message.overview as CompanyOverview)?.majorCustomers?.slice(0, 5).map((customer, index) => (
                                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                                        {customer}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.businessModel && (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-[80px]">Business Model:</span>
                                <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.businessModel}</span>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.confidence && (
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-2">Data Confidence</h4>
                                <div className="text-xs text-gray-600">
                                  Overall: {Math.round(((message.overview as CompanyOverview)?.confidence?.overall || 0) * 100)}%
                                  {((message.overview as CompanyOverview)?.confidence?.financial || 0) > 0 && (
                                    <span className="ml-3">Financial: {Math.round(((message.overview as CompanyOverview)?.confidence?.financial || 0) * 100)}%</span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Legacy fields for backward compatibility */}
                            {(message.overview as CompanyOverview)?.revenue && !(message.overview as CompanyOverview)?.financialData?.revenue && (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-[80px]">Revenue:</span>
                                <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.revenue}</span>
                              </div>
                            )}
                            {(message.overview as CompanyOverview)?.size && !(message.overview as CompanyOverview)?.employeeRange && !(message.overview as CompanyOverview)?.size?.includes('not directly stated') && !(message.overview as CompanyOverview)?.size?.includes('Unable to determine') && (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-[80px]">Size:</span>
                                <span className="text-gray-900 flex-1">{(message.overview as CompanyOverview)?.size}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(message.intelligence as SalesIntelligenceResponse | undefined) && (
                      <div className="mt-4">
                        <IntelligenceCard data={message.intelligence as SalesIntelligenceResponse} />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <TypingIndicator />
                  </div>
                )}
                
                <div ref={messagesEndRef} />
                
                {/* Chat Input - flows naturally with conversation */}
                <div className="mt-6">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    placeholder="Ask about any company... I'll adapt to your style and ask smart follow-ups"
                  />
                  
                  {smartContext.confidence > 0 && smartContext.confidence < 70 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Context confidence: {smartContext.confidence}% 
                      {smartContext.missingContext.length > 0 && (
                        <span className="ml-2">• Missing: {smartContext.missingContext.join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Sidebar */}
      {isDashboardOpen && (
        <div className="fixed right-0 top-16 bottom-0 w-96 bg-slate-900 text-white z-40 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-white">Analytics Dashboard</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDashboardOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Sales Metrics */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Sales Metrics</h3>
              <div className="space-y-3">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <Target className="w-3 h-3" />
                    Deal Probability
                  </div>
                  <div className="text-lg font-semibold text-green-400">
                    {dashboardData.salesMetrics.dealProbability}%
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Confidence
                  </div>
                  <div className="text-lg font-semibold text-blue-400">
                    {dashboardData.salesMetrics.confidence}%
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <Clock className="w-3 h-3" />
                    Time to Close
                  </div>
                  <div className="text-lg font-semibold text-purple-400">
                    {dashboardData.salesMetrics.timeToClose}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Insights */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Recent Insights</h3>
              <div className="space-y-2">
                {dashboardData.recentInsights.length === 0 ? (
                  <p className="text-sm text-slate-500">No insights yet</p>
                ) : (
                  dashboardData.recentInsights.slice(0, 5).map((insight, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">{insight.company}</span>
                      </div>
                      <p className="text-xs text-slate-400">{insight.insight}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {insight.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Company Overview */}
            {dashboardData.userCompany && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Current Research</h3>
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-200">{dashboardData.userCompany}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Active research session
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 