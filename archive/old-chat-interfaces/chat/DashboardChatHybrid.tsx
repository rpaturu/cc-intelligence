import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { IntelligenceCard } from '../../components/chat/IntelligenceCard';
import { parseUserInput, extractUserCompany } from '../../utils/nlp-parser';
import { generateIntelligence } from '../../lib/api';
import { toast } from 'sonner';
import { useChatPersistence } from '../../hooks/useChatPersistence';
import { Button } from '../../components/ui/button';
import { 
  Building2, 
  Target, 
  TrendingUp,
  PieChart,
  Activity,
  Globe,
  Zap,
  RefreshCw,
  Maximize2,
  Minimize2,
  Trash2
} from 'lucide-react';
import type { SalesIntelligenceResponse } from '../../types/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intelligence?: SalesIntelligenceResponse;
  dashboardUpdate?: boolean;
  sourcedClaims?: import('../../types/api').SourcedClaim[];
  enhancedSources?: import('../../types/api').EnhancedSource[];
  confidenceScore?: number;
}

interface DashboardData {
  userCompany: string | null;
  targetCompanies: string[];
  competitorAnalysis: {
    company: string;
    strength: 'high' | 'medium' | 'low';
    marketShare: string;
  }[];
  salesMetrics: {
    dealProbability: number;
    confidence: number;
    timeToClose: string;
  };
  recentInsights: {
    insight: string;
    timestamp: Date;
    type: 'competitive' | 'opportunity' | 'risk';
  }[];
  industryTrends: {
    trend: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

interface DashboardPanel {
  id: string;
  title: string;
  isExpanded: boolean;
  data?: Record<string, unknown>;
}

export function DashboardChatHybrid() {
  const initialMessages: Message[] = [
    {
      id: '1',
      content: "Welcome to your intelligence dashboard! I'll update the visual panels as we chat and analyze companies together. What company would you like to start with?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ];

  const { messages, setMessages, clearHistory, hasSavedHistory, isLoaded } = useChatPersistence({
    storageKey: 'cc-intelligence-dashboard-chat',
    initialMessages,
    maxHistorySize: 100
  });
  
  const [isLoading, setIsLoading] = useState(false);
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

  // Load dashboard data from localStorage on mount only
  useEffect(() => {
    if (isLoaded) {
      const savedDashboard = localStorage.getItem('cc-intelligence-dashboard-data');
      if (savedDashboard) {
        try {
          const parsed = JSON.parse(savedDashboard);
          // Convert timestamp strings back to Date objects
          parsed.recentInsights = parsed.recentInsights?.map((insight: Record<string, unknown>) => ({
            ...insight,
            timestamp: new Date(insight.timestamp as string)
          })) || [];
          setDashboardData(parsed);
          console.log('📊 Loaded dashboard data from localStorage:', parsed);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      } else {
        // If no saved dashboard, reconstruct from messages with intelligence
        console.log('🔄 No saved dashboard data, reconstructing from messages...');
        reconstructDashboardFromMessages().catch(console.error);
      }
    }
  }, [isLoaded]); // Removed messages dependency to prevent race condition

  // Reconstruct dashboard data from existing messages with intelligence
  const reconstructDashboardFromMessages = async () => {
    const intelligenceMessages = messages.filter(msg => msg.intelligence);
    if (intelligenceMessages.length > 0) {
      console.log('🔄 Reconstructing dashboard from', intelligenceMessages.length, 'intelligence messages');
      
      // Use the most recent intelligence message to update dashboard
      const latestIntelligence = intelligenceMessages[intelligenceMessages.length - 1];
      if (latestIntelligence.intelligence) {
        const parsedData = await parseUserInput(latestIntelligence.content);
        const companyName = parsedData.company || 'Unknown';
        console.log('🔄 Reconstructing with company:', companyName);
        updateDashboardFromIntelligence(latestIntelligence.intelligence, companyName);
        
        // Also check if any messages mention the user's company
        const userCompanyMessage = messages.find(msg => 
          msg.content.toLowerCase().includes('our company') || 
          msg.content.toLowerCase().includes('we are') ||
          msg.content.toLowerCase().includes('my company') ||
          msg.content.toLowerCase().includes('i work for') ||
          msg.content.toLowerCase().includes("i'm from") ||
          msg.content.toLowerCase().includes('i represent')
        );
        
        if (userCompanyMessage) {
          const userCompanyName = extractUserCompany(userCompanyMessage.content);
          if (userCompanyName) {
            setDashboardData(prev => ({ ...prev, userCompany: userCompanyName }));
            console.log('🏢 Reconstructed user company:', userCompanyName);
          }
        }
      }
    } else {
      console.log('🔄 No intelligence messages found for reconstruction');
    }
  };

  // Save dashboard data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cc-intelligence-dashboard-data', JSON.stringify(dashboardData));
      console.log('💾 Saved dashboard data to localStorage:', dashboardData);
    }
  }, [dashboardData, isLoaded]);
  
  const [panels, setPanels] = useState<DashboardPanel[]>([
    { id: 'overview', title: 'Company Overview', isExpanded: true },
    { id: 'competitive', title: 'Competitive Analysis', isExpanded: true },
    { id: 'metrics', title: 'Sales Metrics', isExpanded: false },
    { id: 'insights', title: 'Recent Insights', isExpanded: false },
  ]);
  
  const [chatExpanded, setChatExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const togglePanel = (panelId: string) => {
    setPanels(panels.map(panel => 
      panel.id === panelId 
        ? { ...panel, isExpanded: !panel.isExpanded }
        : panel
    ));
  };

  const handleClearHistory = () => {
    clearHistory();
    const resetData = {
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
    };
    setDashboardData(resetData);
    localStorage.removeItem('cc-intelligence-dashboard-data');
    console.log('🧹 Cleared dashboard data from localStorage');
    toast.success('Chat history and dashboard cleared');
  };

  const updateDashboardFromIntelligence = (intelligence: SalesIntelligenceResponse, companyName: string) => {
    console.log('🔄 Updating dashboard with intelligence:', { intelligence, companyName });
    
    setDashboardData(prev => {
      const updated = { ...prev };
      
      // Update target companies
      if (!updated.targetCompanies.includes(companyName)) {
        updated.targetCompanies = [...updated.targetCompanies, companyName];
      }
      
      // Update competitor analysis
      console.log('🏢 Competitive landscape:', intelligence.insights.competitiveLandscape);
      if (intelligence.insights.competitiveLandscape?.competitors) {
        console.log('✅ Found competitors:', intelligence.insights.competitiveLandscape.competitors);
        updated.competitorAnalysis = intelligence.insights.competitiveLandscape.competitors.map(comp => ({
          company: comp.name,
          strength: comp.strength,
          marketShare: comp.marketShare || 'Unknown'
        }));
      } else {
        console.log('❌ No competitors found in response');
      }
      
      // Update sales metrics
      console.log('📊 Deal probability:', intelligence.insights.dealProbability);
      console.log('📊 Confidence score:', intelligence.confidenceScore);
      if (intelligence.insights.dealProbability !== undefined) {
        updated.salesMetrics = {
          dealProbability: intelligence.insights.dealProbability,
          confidence: intelligence.confidenceScore,
          timeToClose: 'Analyzing...'
        };
      }
      
      // Add recent insights
      const newInsights = [
        ...intelligence.insights.talkingPoints?.map(point => ({
          insight: typeof point === 'string' ? point : point.text,
          timestamp: new Date(),
          type: 'opportunity' as const
        })) || [],
        ...intelligence.insights.painPoints?.map(point => ({
          insight: typeof point === 'string' ? point : point.text,
          timestamp: new Date(),
          type: 'risk' as const
        })) || []
      ];
      
      updated.recentInsights = [...newInsights, ...updated.recentInsights].slice(0, 10);
      
      console.log('📱 Updated dashboard data:', updated);
      return updated;
    });
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Parse the input
      const parsedData = await parseUserInput(content);
      
      // Check if this is about user's company using the specialized function
      const isUserCompany = content.toLowerCase().includes('our company') || 
                           content.toLowerCase().includes('we are') ||
                           content.toLowerCase().includes('my company') ||
                           content.toLowerCase().includes('i work for') ||
                           content.toLowerCase().includes("i'm from") ||
                           content.toLowerCase().includes('i represent');
      
      if (isUserCompany) {
        const userCompanyName = extractUserCompany(content);
        if (userCompanyName) {
          setDashboardData(prev => ({ ...prev, userCompany: userCompanyName }));
          console.log('🏢 Extracted user company:', userCompanyName);
        }
      }
      
      // Generate intelligence if we have enough context
      if (parsedData.company || dashboardData.targetCompanies.length > 0) {
        const targetCompany = parsedData.company || dashboardData.targetCompanies[0];
        
        const contextualPrompt = `
          Dashboard Context:
          - User Company: ${dashboardData.userCompany || 'Unknown'}
          - Target Company: ${targetCompany}
          - Previous Analysis: ${dashboardData.targetCompanies.join(', ')}
          - Current Request: ${content}
          
          Please provide intelligence suitable for dashboard visualization.
        `;

        const intelligence = await generateIntelligence({
          companyDomain: targetCompany,
          salesContext: parsedData.salesContext || 'discovery',
          additionalContext: contextualPrompt,
        });

        // Update dashboard with new intelligence
        updateDashboardFromIntelligence(intelligence, targetCompany);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I've analyzed ${targetCompany} and updated your dashboard with the latest intelligence. Check the panels for visual insights!`,
          sender: 'ai',
          timestamp: new Date(),
          intelligence,
          dashboardUpdate: true,
          sourcedClaims: intelligence.insights.sourcedClaims,
          enhancedSources: intelligence.enhancedSources,
          confidenceScore: intelligence.sourceCredibilityScore || intelligence.confidenceScore,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Provide contextual guidance
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'd love to help you analyze a company. Please specify which company you'd like me to research and I'll update your dashboard with visual insights!",
          sender: 'ai',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Error processing your message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const CompanyOverviewPanel = () => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Your Company</span>
          </div>
          <p className="text-lg font-semibold text-blue-800">
            {dashboardData.userCompany || 'Not specified'}
          </p>
        </div>
        
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Target Companies</span>
          </div>
          <p className="text-lg font-semibold text-green-800">
            {dashboardData.targetCompanies.length || 0}
          </p>
        </div>
      </div>
      
      {dashboardData.targetCompanies.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Companies Being Analyzed:</h4>
          <div className="space-y-2">
            {dashboardData.targetCompanies.map((company, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{company}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CompetitiveAnalysisPanel = () => (
    <div className="p-4 space-y-4">
      {dashboardData.competitorAnalysis.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3">
            {dashboardData.competitorAnalysis.map((comp, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{comp.company}</p>
                  <p className="text-sm text-gray-600">Market Share: {comp.marketShare}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  comp.strength === 'high' ? 'bg-red-100 text-red-800' :
                  comp.strength === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {comp.strength} threat
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No competitive analysis yet</p>
          <p className="text-sm">Ask me to analyze a company to see competitor insights</p>
        </div>
      )}
    </div>
  );

  const SalesMetricsPanel = () => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Deal Probability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${dashboardData.salesMetrics.dealProbability}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-purple-800">
              {dashboardData.salesMetrics.dealProbability}%
            </span>
          </div>
        </div>
        
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Confidence Score</span>
          </div>
          <p className="text-lg font-semibold text-orange-800">
            {dashboardData.salesMetrics.confidence}%
          </p>
        </div>
      </div>
    </div>
  );

  const RecentInsightsPanel = () => (
    <div className="p-4 space-y-3">
      {dashboardData.recentInsights.length > 0 ? (
        dashboardData.recentInsights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              insight.type === 'opportunity' ? 'bg-green-500' :
              insight.type === 'risk' ? 'bg-red-500' :
              'bg-blue-500'
            }`} />
            <div className="flex-1">
              <p className="text-sm text-gray-900">{insight.insight}</p>
              <p className="text-xs text-gray-500 mt-1">
                {insight.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No insights yet</p>
          <p className="text-sm">Intelligence insights will appear here</p>
        </div>
      )}
    </div>
  );

  const renderPanelContent = (panel: DashboardPanel) => {
    switch (panel.id) {
      case 'overview':
        return <CompanyOverviewPanel />;
      case 'competitive':
        return <CompetitiveAnalysisPanel />;
      case 'metrics':
        return <SalesMetricsPanel />;
      case 'insights':
        return <RecentInsightsPanel />;
      default:
        return <div>Panel content not found</div>;
    }
  };

  // Don't render until chat history is loaded
  if (!isLoaded) {
    return (
      <div className="flex h-full max-w-7xl mx-auto">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading chat history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full max-w-7xl mx-auto">
      {/* Dashboard Panels */}
      <div className={`${chatExpanded ? 'w-1/3' : 'w-2/3'} border-r border-border bg-background transition-all duration-300`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Intelligence Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Visual insights update as you chat
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasSavedHistory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatExpanded(!chatExpanded)}
              >
                {chatExpanded ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-4">
          {panels.map((panel) => (
            <div key={panel.id} className="border-b border-border">
              <button
                onClick={() => togglePanel(panel.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{panel.title}</span>
                <div className="flex items-center gap-2">
                  {panel.isExpanded ? 
                    <Minimize2 className="w-4 h-4" /> : 
                    <Maximize2 className="w-4 h-4" />
                  }
                </div>
              </button>
              {panel.isExpanded && (
                <div className="border-t border-border">
                  {renderPanelContent(panel)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`${chatExpanded ? 'w-2/3' : 'w-1/3'} flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat Intelligence</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatExpanded(!chatExpanded)}
            >
              {chatExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask questions to update the dashboard
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <MessageBubble
                message={message.content}
                isUser={message.sender === 'user'}
                timestamp={message.timestamp}
                sourcedClaims={message.sourcedClaims}
                enhancedSources={message.enhancedSources}
                confidenceScore={message.confidenceScore}
              />
              
              {message.dashboardUpdate && (
                <div className="mt-2 ml-12 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-800">Dashboard updated with new intelligence</span>
                  </div>
                </div>
              )}
              
              {message.intelligence && (
                <div className="mt-2 ml-12">
                  <IntelligenceCard data={message.intelligence} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="ml-12">
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask about companies to update your dashboard..."
          />
        </div>
      </div>
    </div>
  );
} 