import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Building, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Lightbulb,
  Download,
  Share,
  Bookmark,
  Calendar,
  Shield,
  AlertCircle,
  Sparkles,
  Brain,
  Search,
  Volume2,
  Settings,
  X,
  BarChart3,
  Target,
} from 'lucide-react';
import { getCompanyOverview, getDiscoveryInsights, getCompanySearch, getCompanyAnalysis } from '../lib/api';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';

interface CompanyOverview {
  name: string;
  domain: string;
  industry: string;
  description?: string;
  foundedYear?: number;
  size?: string;
  revenue?: string;
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

interface AIMessage {
  id: string;
  type: 'narration' | 'insight' | 'question' | 'suggestion' | 'data-card';
  content: string;
  timestamp: Date;
  dataCard?: {
    type: 'company-overview' | 'financial-summary' | 'leadership-grid' | 'market-analysis' | 'quick-stats' | 'performance-metrics' | 'recent-news' | 'market-position' | 'discovery-insights' | 'search-intelligence' | 'technology-stack' | 'pain-points';
    data: any;
    interactive?: boolean;
  };
  actions?: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  }>;
}

interface ResearchContext {
  purpose: 'discovery' | 'competitive' | 'partnership' | 'investment' | 'renewal';
  stage: 'research' | 'preparation' | 'meeting' | 'follow-up';
  userRole: 'sales' | 'marketing' | 'product' | 'executive';
  priority: 'high' | 'medium' | 'low';
}

export function EnhancedIntelligenceExperience() {
  const navigate = useNavigate();
  const { profile, isProfileComplete } = useProfile();
  const { user, loading: authLoading } = useAuth();
  const [currentCompany, setCurrentCompany] = useState<string>('');
  const [overview, setOverview] = useState<CompanyOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [researchContext, setResearchContext] = useState<ResearchContext>({
    purpose: 'discovery',
    stage: 'research',
    userRole: 'sales',
    priority: 'high'
  });
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [, setConversationMemory] = useState<{
    companies: string[];
    insights: any[];
    context: any;
  }>({
    companies: [],
    insights: [],
    context: {}
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const addAIMessage = (message: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMessage: AIMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setAiMessages(prev => [...prev, newMessage]);
  };

  const generateContextualMessage = (company: string, userProfile: any) => {
    if (userProfile?.name && userProfile?.company) {
      return `Hi ${userProfile.name}! I'll research ${company} from a ${userProfile.company} ${userProfile.role} perspective. What's your focus today?`;
    } else if (user) {
      return `Hi ${user.username}! I'll research ${company} for you. What's your focus?`;
    }
    return `I'll research ${company} for you. What's your focus?`;
  };

  const handleCompanyResearch = async (company: string) => {
    if (!company.trim()) return;
    
    setCurrentCompany(company);
    setIsLoading(true);
    setOverview(null);
    
    // Add to conversation memory
    setConversationMemory(prev => ({
      ...prev,
      companies: [...prev.companies.filter(c => c !== company), company]
    }));

    // Initial contextual message
    addAIMessage({
      type: 'question',
      content: generateContextualMessage(company, profile),
      actions: [
        { label: 'Discovery Call', action: 'set-context-discovery', variant: 'default' },
        { label: 'Competitive Analysis', action: 'set-context-competitive', variant: 'outline' },
        { label: 'Partnership Opportunity', action: 'set-context-partnership', variant: 'outline' },
        { label: 'Investment Research', action: 'set-context-investment', variant: 'outline' }
      ]
    });

    try {
      // Real API call without fake delays
      addAIMessage({
        type: 'narration',
        content: `Researching ${company}...`
      });

      const data = await getCompanyOverview(company) as CompanyOverview;
      setOverview(data);
      setIsLoading(false);

      // Add company overview as rich data card
      addAIMessage({
        type: 'data-card',
        content: `Here's what I found about ${data.name}:`,
        dataCard: {
          type: 'company-overview',
          data: data,
          interactive: true
        }
      });

      // Generate contextual insights based on profile
      const insights = generateProfileAwareInsights(data, profile);
      if (insights.length > 0) {
        addAIMessage({
          type: 'insight',
          content: profile 
            ? `Based on your ${profile.company} ${profile.role} perspective, here are the key opportunities:`
            : 'Here are the key insights I found:',
          dataCard: {
            type: 'market-analysis',
            data: { insights: insights.slice(0, 3) }
          }
        });
      }

      // Show performance metrics if available
      if (data.performanceMetrics && data.performanceMetrics.length > 0) {
        addAIMessage({
          type: 'data-card',
          content: 'Here are their key performance metrics:',
          dataCard: {
            type: 'performance-metrics',
            data: data.performanceMetrics
          }
        });
      }

      // Show recent news if available
      if (data.recentNews && data.recentNews.length > 0) {
        addAIMessage({
          type: 'data-card',
          content: 'Latest company news and developments:',
          dataCard: {
            type: 'recent-news',
            data: data.recentNews
          }
        });
      }

      // Get discovery insights automatically
      try {
        addAIMessage({
          type: 'narration',
          content: 'Running discovery analysis...'
        });

        const discoveryData = await getDiscoveryInsights(company);
        
        addAIMessage({
          type: 'data-card',
          content: 'Discovery insights for sales opportunities:',
          dataCard: {
            type: 'discovery-insights',
            data: discoveryData
          }
        });

        // Get search intelligence 
        const searchData = await getCompanySearch(company);
        
        addAIMessage({
          type: 'data-card',
          content: 'Here\'s the search intelligence behind this research:',
          dataCard: {
            type: 'search-intelligence',
            data: searchData
          }
        });

        // Get contextual analysis based on research purpose
        try {
          addAIMessage({
            type: 'narration',
            content: `Running contextual analysis for ${researchContext.purpose} context...`
          });

          const analysisData = await getCompanyAnalysis(company, researchContext.purpose, searchData.results);
          
          addAIMessage({
            type: 'insight',
            content: `Here's the contextual analysis tailored for ${researchContext.purpose}:`,
            dataCard: {
              type: 'market-analysis',
              data: {
                insights: analysisData.insights ? Object.values(analysisData.insights).flat().map(insight => ({
                  type: 'insight',
                  title: insight.title || insight.severity || 'Analysis Insight',
                  description: insight.text || insight.content || insight.description || 'Contextual analysis insight',
                  confidence: analysisData.confidenceScore || 0.8,
                  impact: 'high'
                })) : [
                  {
                    type: 'insight',
                    title: 'Contextual Analysis',
                    description: `Analysis tailored for ${researchContext.purpose} context`,
                    confidence: 0.9,
                    impact: 'high'
                  }
                ]
              }
            }
          });
        } catch (analysisError) {
          console.error('Error getting contextual analysis:', analysisError);
          addAIMessage({
            type: 'narration',
            content: 'I\'ll continue with the core insights. You can request deeper analysis using the action buttons below.'
          });
        }
      } catch (error) {
        console.error('Error getting additional insights:', error);
        addAIMessage({
          type: 'narration',
          content: 'Additional analysis is still processing - continuing with available data.'
        });
      }

      // Follow-up question
      addAIMessage({
        type: 'question',
        content: 'What would you like to explore deeper?',
        actions: [
          { label: 'Financial Performance', action: 'explore-financial', variant: 'default' },
          { label: 'Leadership Team', action: 'explore-leadership', variant: 'outline' },
          { label: 'Market Position', action: 'explore-market', variant: 'outline' },
          { label: 'Deep Analysis', action: 'explore-analysis', variant: 'outline' },
          { label: 'Pain Points Focus', action: 'explore-pain-points', variant: 'outline' }
        ]
      });

    } catch (error) {
      console.error('Error researching company:', error);
      setIsLoading(false);
      addAIMessage({
        type: 'narration',
        content: 'I encountered an issue researching this company. Let me try a different approach.',
        actions: [
          { label: 'Try Again', action: 'retry-research', variant: 'default' },
          { label: 'Search Different Company', action: 'new-search', variant: 'outline' }
        ]
      });
    }
  };

  const generateProfileAwareInsights = (data: CompanyOverview, userProfile: any) => {
    const insights = [];
    
    // Profile-aware insights based on lean profile data
    // Note: Company intelligence (products, competitors) is now fetched dynamically
    // rather than stored in user profiles
    
    // Size-based insights
    if (data.employeeCount) {
      if (data.employeeCount > 5000 && userProfile?.salesFocus === 'enterprise') {
        insights.push({
          type: 'insight',
          title: 'Enterprise Sales Opportunity',
          description: 'Large organization - focus on champions and complex buying process',
          confidence: 0.9,
          impact: 'high'
        });
      } else if (data.employeeCount < 500 && userProfile?.salesFocus === 'smb') {
        insights.push({
          type: 'opportunity',
          title: 'SMB Quick-Win Opportunity',
          description: 'Smaller team - emphasize ease of implementation and quick ROI',
          confidence: 0.8,
          impact: 'medium'
        });
      }
    }

    // Financial growth insights
    if (data.financialData?.revenueGrowth) {
      insights.push({
        type: 'opportunity',
        title: 'Growth Company',
        description: `${data.financialData.revenueGrowth} growth indicates expansion budget availability`,
        confidence: 0.9,
        impact: 'high'
      });
    }
    
    return insights;
  };

  const handleAIAction = (action: string) => {
    switch (action) {
      case 'set-context-discovery':
        setResearchContext(prev => ({ ...prev, purpose: 'discovery' }));
        addAIMessage({
          type: 'narration',
          content: 'Perfect! I\'ll prioritize pain points, key contacts, and discovery opportunities in my analysis.'
        });
        break;
      case 'set-context-competitive':
        setResearchContext(prev => ({ ...prev, purpose: 'competitive' }));
        addAIMessage({
          type: 'narration',
          content: 'Great! I\'ll focus on competitive positioning, differentiators, and market analysis.'
        });
        break;
      case 'set-context-partnership':
        setResearchContext(prev => ({ ...prev, purpose: 'partnership' }));
        addAIMessage({
          type: 'narration',
          content: 'Excellent! I\'ll analyze partnership opportunities, technology alignment, and strategic fit.'
        });
        break;
      case 'set-context-investment':
        setResearchContext(prev => ({ ...prev, purpose: 'investment' }));
        addAIMessage({
          type: 'narration',
          content: 'Perfect! I\'ll focus on financial performance, growth metrics, and market position.'
        });
        break;
      case 'explore-financial':
        if (overview?.financialData) {
          addAIMessage({
            type: 'data-card',
            content: 'Here\'s their detailed financial breakdown:',
            dataCard: {
              type: 'financial-summary',
              data: overview.financialData,
              interactive: true
            }
          });
        }
        break;
      case 'explore-leadership':
        if (overview?.leadership) {
          addAIMessage({
            type: 'data-card',
            content: 'Here\'s what I found about their leadership team:',
            dataCard: {
              type: 'leadership-grid',
              data: overview.leadership,
              interactive: true
            }
          });
        }
        break;
      case 'explore-market':
        if (overview?.marketData) {
          addAIMessage({
            type: 'data-card',
            content: 'Here\'s their market position and competitive landscape:',
            dataCard: {
              type: 'market-position',
              data: overview.marketData,
              interactive: true
            }
          });
        }
        break;
      case 'explore-competitive':
        addAIMessage({
          type: 'narration',
          content: 'Let me analyze their competitive position and differentiators...'
        });
        if (overview?.keyDifferentiators || overview?.marketData?.competitiveAdvantages) {
          const competitiveData = {
            differentiators: overview.keyDifferentiators || [],
            advantages: overview.marketData?.competitiveAdvantages || [],
            position: overview.competitivePosition || overview.marketData?.marketPosition
          };
          addAIMessage({
            type: 'insight',
            content: 'Here\'s their competitive analysis:',
            dataCard: {
              type: 'market-analysis',
              data: {
                insights: [
                  {
                    type: 'insight',
                    title: 'Competitive Position',
                    description: competitiveData.position || 'Analysis of market position',
                    confidence: 0.8,
                    impact: 'high'
                  }
                ]
              }
            }
          });
        }
        break;
      case 'explore-analysis':
        if (currentCompany && overview) {
          addAIMessage({
            type: 'narration',
            content: 'Running deep contextual analysis...'
          });
          
          // Get context-aware analysis
          getCompanyAnalysis(currentCompany, researchContext.purpose, overview)
            .then((analysisData) => {
              addAIMessage({
                type: 'insight',
                content: 'Here\'s the deep contextual analysis:',
                dataCard: {
                  type: 'market-analysis',
                  data: {
                    insights: analysisData.insights ? Object.values(analysisData.insights).flat().map(insight => ({
                      type: 'insight',
                      title: insight.title || 'Analysis Insight',
                      description: insight.content || insight.description || 'Contextual analysis insight',
                      confidence: analysisData.confidenceScore || 0.8,
                      impact: 'high'
                    })) : [
                      {
                        type: 'insight',
                        title: 'Contextual Analysis',
                        description: `Analysis tailored for ${researchContext.purpose} context`,
                        confidence: 0.9,
                        impact: 'high'
                      }
                    ]
                  }
                }
              });
            })
            .catch((error) => {
              console.error('Analysis error:', error);
              addAIMessage({
                type: 'narration',
                content: 'Deep analysis is processing - results will be available shortly.'
              });
            });
        }
        addAIMessage({
          type: 'narration',
          content: 'Deep analysis is temporarily disabled for debugging. Please try other exploration options.'
        });
        break;
      case 'explore-pain-points':
        addAIMessage({
          type: 'narration',
          content: 'Let me focus on their pain points and how you can help...'
        });
        
        // Focus on pain points from discovery insights
        if (overview) {
          addAIMessage({
            type: 'insight',
            content: profile 
              ? `Pain points analysis for ${profile.company} sales approach:`
              : 'Pain points and sales opportunities identified:',
            actions: [
              { label: 'Solution Mapping', action: 'map-solutions', variant: 'default' },
              { label: 'Competitive Gaps', action: 'find-gaps', variant: 'outline' }
            ]
          });
        }
        break;
      case 'map-solutions':
        addAIMessage({
          type: 'insight',
          content: profile && profile.primaryProducts 
            ? `Here's how ${profile.primaryProducts[0]} can address their challenges:`
            : 'Solution mapping based on identified pain points:',
          dataCard: {
            type: 'market-analysis',
            data: {
              insights: [
                {
                  type: 'opportunity',
                  title: 'Solution Fit',
                  description: 'Direct alignment between their needs and your solutions',
                  confidence: 0.85,
                  impact: 'high'
                }
              ]
            }
          }
        });
        break;
      case 'retry-research':
        if (currentCompany) {
          handleCompanyResearch(currentCompany);
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Rich data card components
  const DataCard = ({ type, data }: { type: string; data: any; interactive?: boolean }) => {
    switch (type) {
      case 'company-overview':
        return (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
                <p className="text-blue-700 font-medium">{data.industry}</p>
                <p className="text-gray-600 mt-1">{data.domain}</p>
                {data.description && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-3">{data.description}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">Employees</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {data.employeeCount ? data.employeeCount.toLocaleString() : data.employeeRange || data.size || 'N/A'}
                </p>
              </div>
              
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">Revenue</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {data.financialData?.revenue || data.revenue || 'N/A'}
                </p>
              </div>
              
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-gray-600">Growth</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {data.financialData?.revenueGrowth || 'N/A'}
                </p>
              </div>
              
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-gray-600">Confidence</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {data.confidence ? Math.round(data.confidence.overall * 100) : 'N/A'}%
                </p>
              </div>
            </div>

            {/* Key Differentiators */}
            {data.keyDifferentiators && data.keyDifferentiators.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Key Differentiators</h4>
                <div className="flex flex-wrap gap-2">
                  {data.keyDifferentiators.slice(0, 6).map((diff: any, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {(typeof diff === 'string' ? diff : diff.text || diff.content || String(diff)).replace(/\s*\[\d+\]\s*/g, '')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Products & Services */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.products && data.products.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Products</h4>
                  <div className="flex flex-wrap gap-1">
                    {data.products.slice(0, 4).map((product: any, index: number) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {(typeof product === 'string' ? product : product.text || product.content || String(product)).replace(/\s*\[\d+\]\s*/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.services && data.services.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                  <div className="flex flex-wrap gap-1">
                    {data.services.slice(0, 4).map((service: any, index: number) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {(typeof service === 'string' ? service : service.text || service.content || String(service)).replace(/\s*\[\d+\]\s*/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );

      case 'financial-summary':
        return (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Financial Overview</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-medium">{data.revenue || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate</span>
                  <span className="font-medium text-green-600">{data.revenueGrowth || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Cap</span>
                  <span className="font-medium">{data.marketCap || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Exchange</span>
                  <span className="font-medium">{data.stockExchange || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Funding</span>
                  <span className="font-medium">{data.totalFunding || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Symbol</span>
                  <span className="font-medium font-mono">{data.stockSymbol || 'Private'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P/E Ratio</span>
                  <span className="font-medium">{data.peRatio || 'N/A'}</span>
                </div>
              </div>
            </div>
          </Card>
        );

      case 'leadership-grid':
        return (
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Leadership Team</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.slice(0, 6).map((leader: any, index: number) => (
                <div key={index} className="bg-white/70 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{leader.name}</h5>
                      <p className="text-sm text-purple-700">{leader.title}</p>
                      {leader.department && (
                        <p className="text-xs text-gray-500 mt-1">{leader.department}</p>
                      )}
                      {leader.background && (
                        <p className="text-xs text-gray-600 mt-1">{leader.background}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'market-analysis':
        return (
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Key Insights</h4>
            </div>
            
            <div className="space-y-3">
              {data.insights.map((insight: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
                    insight.type === 'risk' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {insight.type === 'opportunity' ? <TrendingUp className="w-4 h-4" /> :
                     insight.type === 'risk' ? <AlertCircle className="w-4 h-4" /> :
                     <Lightbulb className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{insight.title}</h5>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            insight.confidence > 0.8 ? 'bg-green-500' : 
                            insight.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${insight.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(insight.confidence * 100)}% confidence</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'performance-metrics':
        return (
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
            </div>
            
            <div className="space-y-3">
              {data.map((metric: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{metric.name}</h5>
                    <p className="text-sm text-gray-600">{metric.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{metric.value}</span>
                    {metric.trend && (
                      <div className={`p-1 rounded-full ${
                        metric.trend === 'up' ? 'bg-green-100 text-green-600' :
                        metric.trend === 'down' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                         metric.trend === 'down' ? <TrendingUp className="w-3 h-3 rotate-180" /> :
                         <Lightbulb className="w-3 h-3" />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'recent-news':
        return (
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-gray-900">Recent News & Updates</h4>
            </div>
            
            <div className="space-y-4">
              {data.slice(0, 3).map((news: any, index: number) => (
                <div key={index} className="bg-white/70 p-4 rounded-lg border-l-4 border-l-yellow-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{news.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{news.summary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{news.date}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{news.source}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      news.relevance === 'high' ? 'bg-red-100 text-red-800' :
                      news.relevance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {news.relevance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'market-position':
        return (
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-gray-900">Market Position</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/70 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Position</h5>
                <p className="text-sm text-gray-700">{data.marketPosition}</p>
              </div>
              
              {data.marketShare && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Market Share</h5>
                  <p className="text-sm text-gray-700">{data.marketShare}</p>
                </div>
              )}
              
              {data.competitiveAdvantages && data.competitiveAdvantages.length > 0 && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Competitive Advantages</h5>
                  <ul className="space-y-1">
                    {data.competitiveAdvantages.map((advantage: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        );

      case 'discovery-insights':
        return (
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-gray-900">Discovery Insights</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.painPoints && data.painPoints.length > 0 && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3 text-red-700">🚨 Pain Points</h5>
                  <ul className="space-y-2">
                    {data.painPoints.slice(0, 4).map((pain: any, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                        {typeof pain === 'string' ? pain : pain.text || pain.content || String(pain)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {data.opportunities && data.opportunities.length > 0 && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3 text-green-700">🎯 Opportunities</h5>
                  <ul className="space-y-2">
                    {data.opportunities.slice(0, 4).map((opp: any, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {typeof opp === 'string' ? opp : opp.text || opp.content || String(opp)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {data.keyContacts && data.keyContacts.length > 0 && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3 text-blue-700">👥 Key Contacts</h5>
                  <ul className="space-y-2">
                    {data.keyContacts.slice(0, 4).map((contact: any, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <Users className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          {typeof contact === 'string' ? contact : (
                            <>
                              <div className="font-medium">{contact.name}</div>
                              {contact.title && <div className="text-xs text-gray-600">{contact.title}</div>}
                              {contact.approachStrategy && (
                                <div className="text-xs text-blue-600 mt-1">{contact.approachStrategy}</div>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {data.technologyStack && data.technologyStack.length > 0 && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3 text-purple-700">⚙️ Tech Stack</h5>
                  <div className="flex flex-wrap gap-1">
                    {data.technologyStack.slice(0, 6).map((tech: any, index: number) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 rounded text-xs ${
                          typeof tech === 'object' && tech.category === 'current' 
                            ? 'bg-green-100 text-green-800'
                            : typeof tech === 'object' && tech.category === 'planned'
                            ? 'bg-blue-100 text-blue-800'
                            : typeof tech === 'object' && tech.category === 'vendor'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                        title={typeof tech === 'object' ? tech.description : ''}
                      >
                        {typeof tech === 'string' ? tech : tech.name || tech.text || tech.content || String(tech)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );

      case 'search-intelligence':
        return (
          <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-cyan-600" />
              <h4 className="font-semibold text-gray-900">Search Intelligence</h4>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/70 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-cyan-700">{data.totalResults}</p>
                  <p className="text-xs text-gray-600">Total Results</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-cyan-700">{data.searchTime}ms</p>
                  <p className="text-xs text-gray-600">Search Time</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-cyan-700">{data.queries?.length || 0}</p>
                  <p className="text-xs text-gray-600">Queries Used</p>
                </div>
              </div>
              
              {data.queries && data.queries.length > 0 && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Search Queries</h5>
                  <div className="flex flex-wrap gap-2">
                    {data.queries.slice(0, 6).map((query: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs">
                        "{query}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.results && data.results.length > 0 && (
                <div className="bg-white/70 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">Top Sources</h5>
                  <div className="space-y-2">
                    {data.results.slice(0, 3).map((result: any, index: number) => (
                      <div key={index} className="border-l-2 border-cyan-400 pl-3">
                        <p className="text-sm font-medium text-gray-900">{result.query}</p>
                        <p className="text-xs text-gray-600">{result.totalResults} results in {result.searchTime}ms</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  // Export panel component
  const ExportPanel = () => (
    <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 transform transition-transform duration-300 ${showExportPanel ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Export Research</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowExportPanel(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Research Summary</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Company: {currentCompany}<br/>
              Research Context: {researchContext.purpose}<br/>
              Insights Generated: {aiMessages.filter(m => m.type === 'insight').length}<br/>
              Data Points: {overview ? 'Financial, Leadership, Market' : 'None'}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full" variant="default">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          <Button className="w-full" variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share with Team
          </Button>
          <Button className="w-full" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
          <Button className="w-full" variant="outline">
            <Bookmark className="w-4 h-4 mr-2" />
            Save to Profile
          </Button>
        </div>
      </div>
    </div>
  );

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top action bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">AI Research Assistant</h1>
              {currentCompany && (
                <p className="text-sm text-gray-600">Researching {currentCompany}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Volume2 className="w-4 h-4 mr-2" />
              Voice Mode
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowExportPanel(true)}
              disabled={!currentCompany}
            >
              <Share className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main conversation area */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {!currentCompany && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {user && profile?.name 
                ? `Welcome back, ${profile.name}!`
                : user 
                ? `Welcome, ${user.username}!`
                : 'Welcome to AI Research Assistant'
              }
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {user && profile 
                ? `Start researching companies from your ${profile.company} ${profile.role} perspective.`
                : 'Enter a company name to start your guided research experience.'
              }
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <ChatInput
                onSendMessage={handleCompanyResearch}
                disabled={isLoading}
                placeholder="Enter company name to research..."
              />
            </div>
            
            {!isProfileComplete() && (
              <Alert className="mb-6 max-w-md mx-auto">
                <Settings className="w-4 h-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Complete Your Profile</div>
                  <p className="text-sm mb-3">
                    Set up your sales profile to get personalized, context-aware research insights.
                  </p>
                  <Button
                    onClick={() => navigate('/profile')}
                    size="sm"
                  >
                    Setup Profile
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-wrap gap-2 justify-center">
              {['Microsoft', 'Salesforce', 'HubSpot', 'Zoom'].map((company) => (
                <Button
                  key={company}
                  variant="outline"
                  onClick={() => handleCompanyResearch(company)}
                  className="text-sm"
                >
                  Research {company}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation stream */}
        <div className="conversation-stream space-y-6">
          {aiMessages.map((message) => (
            <div key={message.id} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-gray-900 leading-relaxed">{message.content}</p>
                  <span className="text-xs text-gray-500 ml-4 flex-shrink-0">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {message.dataCard && (
                  <DataCard 
                    type={message.dataCard.type} 
                    data={message.dataCard.data}
                    interactive={message.dataCard.interactive}
                  />
                )}
                
                {message.actions && (
                  <div className="flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || 'outline'}
                        size="sm"
                        onClick={() => handleAIAction(action.action)}
                        className="text-sm"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <TypingIndicator />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Floating input when research is active */}
        {currentCompany && !isLoading && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
              <ChatInput
                onSendMessage={(query) => {
                  addAIMessage({
                    type: 'question',
                    content: `Tell me more about: ${query}`,
                    actions: [
                      { label: 'Research This', action: 'research-query', variant: 'default' }
                    ]
                  });
                }}
                disabled={isLoading}
                placeholder="Ask me anything about this company..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Export panel */}
      <ExportPanel />
      
      {/* Overlay for export panel */}
      {showExportPanel && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setShowExportPanel(false)}
        />
      )}
    </div>
  );
} 