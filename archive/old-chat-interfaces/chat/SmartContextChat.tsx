import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { IntelligenceCard } from '../../components/chat/IntelligenceCard';
import { parseUserInput } from '../../utils/nlp-parser';
import { generateIntelligence } from '../../lib/api';
import { toast } from 'sonner';
import { useChatPersistence } from '../../hooks/useChatPersistence';
import { Button } from '../../components/ui/button';
import { Brain, Target, Users, Building2, Lightbulb, CheckCircle, Trash2 } from 'lucide-react';
import type { SalesIntelligenceResponse, SalesContext } from '../../types/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intelligence?: SalesIntelligenceResponse;
  suggestions?: string[];
  contextInsights?: string[];
  sourcedClaims?: import('../../types/api').SourcedClaim[];
  enhancedSources?: import('../../types/api').EnhancedSource[];
  confidenceScore?: number;
}

interface SmartContext {
  userCompany: string | null;
  competitors: string[];
  industry: string | null;
  salesContext: SalesContext | null;
  meetingStage: 'early' | 'middle' | 'late' | 'unknown';
  confidence: number;
  missingContext: string[];
  conversationHistory: string[];
  intelligenceGenerated: boolean;
}

interface ContextualInsight {
  type: 'company' | 'competitor' | 'industry' | 'timing';
  insight: string;
  confidence: number;
  suggestedQuestion?: string;
}

export function SmartContextChat() {
  const initialMessages: Message[] = [
    {
      id: '1',
      content: "Hi! I'm your smart context recognition assistant. I'll adapt to your conversation style and ask intelligent follow-up questions to provide the most relevant intelligence. What would you like to know about today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "I'm preparing for a meeting with Shopify",
        "How does Tesla compare to Ford in EVs?",
        "Research Microsoft's recent cloud strategy",
        "What are Amazon's biggest competitive threats?"
      ],
    },
  ];

  const { messages, setMessages, clearHistory, hasSavedHistory, isLoaded } = useChatPersistence({
    storageKey: 'cc-intelligence-smart-chat',
    initialMessages,
    maxHistorySize: 100
  });
  
  const [isLoading, setIsLoading] = useState(false);
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    toast.success('Chat history and context cleared');
  };

  // Don't render until chat history is loaded
  if (!isLoaded) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading chat history...</p>
          </div>
        </div>
      </div>
    );
  }

  const analyzeContextualInsights = (message: string, parsedData: { company?: string; salesContext?: string; additionalContext?: string }): ContextualInsight[] => {
    const insights: ContextualInsight[] = [];
    
    // Analyze company context
    if (parsedData.company) {
      const isUserCompany = message.toLowerCase().includes('our') || 
                           message.toLowerCase().includes('we') || 
                           message.toLowerCase().includes('my company');
      
      if (isUserCompany && !smartContext.userCompany) {
        insights.push({
          type: 'company',
          insight: `You work for ${parsedData.company}`,
          confidence: 0.8,
          suggestedQuestion: `What's your role at ${parsedData.company}? This helps me frame the intelligence from your perspective.`
        });
      } else if (!isUserCompany && parsedData.company) {
        insights.push({
          type: 'competitor',
          insight: `${parsedData.company} is a target company for analysis`,
          confidence: 0.7,
          suggestedQuestion: `Are you competing against ${parsedData.company}, or are they a potential partner/client?`
        });
      }
    }
    
    // Analyze sales context
    if (parsedData.salesContext) {
      insights.push({
        type: 'timing',
        insight: `This is a ${parsedData.salesContext} context`,
        confidence: 0.9,
        suggestedQuestion: `What's your primary goal for this ${parsedData.salesContext}? Are you looking to win, defend, or explore?`
      });
    }
    
    // Analyze industry patterns
    const industryKeywords = {
      'saas': ['software', 'cloud', 'platform', 'api'],
      'ecommerce': ['shopify', 'amazon', 'retail', 'marketplace'],
      'fintech': ['banking', 'payments', 'fintech', 'finance'],
      'automotive': ['tesla', 'ford', 'automotive', 'electric'],
      'enterprise': ['microsoft', 'salesforce', 'enterprise', 'b2b']
    };
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const hasKeywords = keywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );
      
      if (hasKeywords && smartContext.industry !== industry) {
        insights.push({
          type: 'industry',
          insight: `This appears to be ${industry} industry focused`,
          confidence: 0.6,
          suggestedQuestion: `Are you specifically focused on the ${industry} market, or is this broader?`
        });
      }
    }
    
    return insights;
  };

  const generateSmartFollowUp = (insights: ContextualInsight[], parsedData: { company?: string; salesContext?: string }): string[] => {
    const followUps: string[] = [];
    
    // Add high-confidence insights as follow-ups
    insights
      .filter(insight => insight.confidence > 0.7 && insight.suggestedQuestion)
      .forEach(insight => {
        if (insight.suggestedQuestion) {
          followUps.push(insight.suggestedQuestion);
        }
      });
    
    // Add context-specific questions
    if (smartContext.userCompany && !smartContext.competitors.length) {
      followUps.push(`Who are ${smartContext.userCompany}'s main competitors?`);
    }
    
    if (parsedData.company && !smartContext.salesContext) {
      followUps.push(`What's your relationship with ${parsedData.company}? Are you selling to them, competing with them, or analyzing them?`);
    }
    
    // Add strategic follow-ups
    if (smartContext.confidence > 0.6 && !smartContext.intelligenceGenerated) {
      followUps.push("I have enough context to generate a comprehensive intelligence report. Would you like me to create one?");
    }
    
    return followUps.slice(0, 3); // Limit to 3 follow-ups
  };

  const updateSmartContext = (message: string, parsedData: { company?: string; salesContext?: SalesContext }, insights: ContextualInsight[]) => {
    setSmartContext(prev => {
      const updated = { ...prev };
      
      // Update conversation history
      updated.conversationHistory = [...updated.conversationHistory, message].slice(-10);
      
      // Update company context
      const companyInsight = insights.find(i => i.type === 'company');
      if (companyInsight && parsedData.company) {
        updated.userCompany = parsedData.company;
        updated.confidence += 0.3;
      }
      
      // Update competitors
      const competitorInsight = insights.find(i => i.type === 'competitor');
      if (competitorInsight && parsedData.company) {
        updated.competitors = [...new Set([...updated.competitors, parsedData.company])];
        updated.confidence += 0.2;
      }
      
      // Update sales context
      if (parsedData.salesContext) {
        updated.salesContext = parsedData.salesContext;
        updated.confidence += 0.2;
      }
      
      // Update industry
      const industryInsight = insights.find(i => i.type === 'industry');
      if (industryInsight) {
        updated.industry = industryInsight.insight.split(' ')[3]; // Extract industry name
        updated.confidence += 0.1;
      }
      
      // Update meeting stage
      const urgencyWords = ['urgent', 'asap', 'tomorrow', 'today'];
      const hasUrgency = urgencyWords.some(word => message.toLowerCase().includes(word));
      if (hasUrgency) {
        updated.meetingStage = 'late';
      } else if (message.toLowerCase().includes('preparing') || message.toLowerCase().includes('upcoming')) {
        updated.meetingStage = 'middle';
      } else if (message.toLowerCase().includes('exploring') || message.toLowerCase().includes('research')) {
        updated.meetingStage = 'early';
      }
      
      // Update missing context
      updated.missingContext = [];
      if (!updated.userCompany) updated.missingContext.push('user company');
      if (!updated.salesContext) updated.missingContext.push('sales context');
      if (updated.competitors.length === 0) updated.missingContext.push('competitors');
      
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
      
      // Analyze contextual insights
      const insights = analyzeContextualInsights(content, parsedData);
      
      // Update smart context
      updateSmartContext(content, parsedData, insights);
      
      // Generate smart follow-up questions
      const followUps = generateSmartFollowUp(insights, parsedData);
      
      // Determine if we should generate intelligence or ask follow-ups
      const shouldGenerateIntelligence = smartContext.confidence > 0.6 && 
                                       (content.toLowerCase().includes('generate') || 
                                        content.toLowerCase().includes('create report') ||
                                        content.toLowerCase().includes('intelligence'));
      
      if (shouldGenerateIntelligence) {
        // Generate intelligence report
        await generateIntelligenceReport(parsedData, content);
      } else {
        // Provide contextual response with smart follow-ups
        const contextualResponse = generateContextualResponse(insights, parsedData, followUps);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: contextualResponse,
          sender: 'ai',
          timestamp: new Date(),
          suggestions: followUps,
          contextInsights: insights.map(i => i.insight),
        };

        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Error processing your message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualResponse = (insights: ContextualInsight[], _parsedData: { company?: string }, followUps: string[]): string => {
    let response = "I'm analyzing your context... ";
    
    // Add insights
    if (insights.length > 0) {
      response += "Here's what I understand:\n\n";
      insights.forEach(insight => {
        response += `• ${insight.insight}\n`;
      });
    }
    
    // Add confidence assessment
    if (smartContext.confidence > 0.8) {
      response += `\n✅ I have high confidence in understanding your context (${Math.round(smartContext.confidence * 100)}%)`;
    } else if (smartContext.confidence > 0.5) {
      response += `\n⚠️ I have moderate confidence in your context (${Math.round(smartContext.confidence * 100)}%)`;
    } else {
      response += `\n❓ I need more context to provide the best intelligence (${Math.round(smartContext.confidence * 100)}%)`;
    }
    
    // Add strategic recommendation
    if (smartContext.userCompany && smartContext.competitors.length > 0) {
      response += `\n\n🎯 **Strategic Context**: I understand you're with ${smartContext.userCompany} and analyzing ${smartContext.competitors.join(', ')}. I can provide competitive intelligence from your perspective.`;
    }
    
    // Add next steps
    if (followUps.length > 0) {
      response += `\n\n🤔 **Smart Follow-ups**: I'd like to understand:`;
    }
    
    return response;
  };

  const generateIntelligenceReport = async (parsedData: { company?: string }, originalMessage: string) => {
    try {
      const contextualPrompt = `
        CONTEXT ANALYSIS:
        - User Company: ${smartContext.userCompany || 'Unknown'}
        - Target Company: ${parsedData.company || 'Unknown'}
        - Sales Context: ${smartContext.salesContext || 'general'}
        - Known Competitors: ${smartContext.competitors.join(', ')}
        - Industry: ${smartContext.industry || 'Unknown'}
        - Meeting Stage: ${smartContext.meetingStage}
        - Confidence: ${Math.round(smartContext.confidence * 100)}%
        
        CONVERSATION HISTORY:
        ${smartContext.conversationHistory.join('\n')}
        
        CURRENT REQUEST: ${originalMessage}
        
        Please provide intelligence that's contextually aware of the user's company perspective vs the competitive landscape.
      `;

      const intelligence = await generateIntelligence({
        companyDomain: parsedData.company || smartContext.competitors[0] || 'example.com',
        salesContext: smartContext.salesContext || 'discovery',
        additionalContext: contextualPrompt,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Based on my contextual analysis, here's your intelligent report:`,
        sender: 'ai',
        timestamp: new Date(),
        intelligence,
        sourcedClaims: intelligence.insights.sourcedClaims,
        enhancedSources: intelligence.enhancedSources,
        confidenceScore: intelligence.sourceCredibilityScore || intelligence.confidenceScore,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      setSmartContext(prev => ({ ...prev, intelligenceGenerated: true }));
      
      // Add follow-up
      setTimeout(() => {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "I can provide more specific insights or analyze additional companies. What would you like to explore next?",
          sender: 'ai',
          timestamp: new Date(),
          suggestions: [
            "Analyze another competitor",
            "Deep dive into specific market segment",
            "Compare multiple companies",
            "Strategic recommendations"
          ],
        };
        setMessages(prev => [...prev, followUpMessage]);
      }, 1000);

    } catch (error) {
      console.error('Error generating intelligence:', error);
      toast.error('Failed to generate intelligence. Please try again.');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-2">Smart Context Recognition</h1>
            <p className="text-sm text-muted-foreground mb-3">
              I adapt to your conversation and ask intelligent follow-up questions
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
                <Trash2 className="w-4 h-4 mr-1" />
                Clear History
              </Button>
            )}
          </div>
        </div>
        
        {/* Smart Context Display */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3 text-blue-600" />
            <span>Confidence: {Math.round(smartContext.confidence * 100)}%</span>
          </div>
          
          {smartContext.userCompany && (
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-green-600" />
              <span>Your Company: {smartContext.userCompany}</span>
            </div>
          )}
          
          {smartContext.competitors.length > 0 && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-red-600" />
              <span>Analyzing: {smartContext.competitors.slice(0, 2).join(', ')}</span>
            </div>
          )}
          
          {smartContext.salesContext && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-600" />
              <span>Context: {smartContext.salesContext}</span>
            </div>
          )}
        </div>
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
            
            {/* Context Insights */}
            {message.contextInsights && message.contextInsights.length > 0 && (
              <div className="mt-2 ml-12 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Context Insights</span>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  {message.contextInsights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3 ml-12 space-y-2">
                <p className="text-sm font-medium text-gray-700">Smart Follow-ups:</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion: string, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-sm"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Intelligence Card */}
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
          placeholder="Tell me about your intelligence needs - I'll ask smart follow-ups..."
        />
      </div>
    </div>
  );
} 