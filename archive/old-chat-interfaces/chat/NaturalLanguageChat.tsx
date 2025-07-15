import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { IntelligenceCard, OverviewCard } from '../../components/chat/IntelligenceCard';
import { parseUserInput } from '../../utils/nlp-parser';
import { generateIntelligence, getCompanyOverview } from '../../lib/api';
import { toast } from 'sonner';
import { useChatPersistence } from '../../hooks/useChatPersistence';
import { Button } from '../../components/ui/button';
import { Trash2, Zap, Brain } from 'lucide-react';
import type { SalesIntelligenceResponse } from '../../types/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intelligence?: SalesIntelligenceResponse;
  overview?: {
    name: string;
    industry: string;
    size: string;
    revenue: string;
    domain: string;
    sources: Array<{
      id: number;
      url: string;
      title: string;
      domain: string;
      sourceType: string;
      snippet: string;
      credibilityScore: number;
      lastUpdated: string;
    }>;
    requestId: string;
  };
  loadingState?: 'overview' | 'full-analysis' | 'complete';
  showFullAnalysisOption?: boolean;
  sourcedClaims?: import('../../types/api').SourcedClaim[];
  enhancedSources?: import('../../types/api').EnhancedSource[];
  confidenceScore?: number;
}

interface CompanyContext {
  userCompany: string | null;
  competitors: string[];
  industry: string | null;
  established: boolean;
}

export function NaturalLanguageChat() {
  const initialMessages: Message[] = [
    {
      id: '1',
      content: "Hi! I'm your AI intelligence assistant. I can help you understand your competitive landscape and market position. Just tell me about your company and what you'd like to know - I'll parse everything naturally and provide contextual insights.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ];

  const { messages, setMessages, clearHistory, hasSavedHistory, isLoaded } = useChatPersistence({
    storageKey: 'cc-intelligence-natural-chat',
    initialMessages,
    maxHistorySize: 100
  });

  const [isLoading, setIsLoading] = useState(false);
  const [companyContext, setCompanyContext] = useState<CompanyContext>({
    userCompany: null,
    competitors: [],
    industry: null,
    established: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateCompanyContext = (message: string, parsedData: { company?: string; salesContext?: string }) => {
    setCompanyContext(prev => {
      const updated = { ...prev };
      
      // Check if this is about the user's company
      const isUserCompany = message.toLowerCase().includes('our company') || 
                           message.toLowerCase().includes('we are') ||
                           message.toLowerCase().includes('my company') ||
                           message.toLowerCase().includes('i work for') ||
                           message.toLowerCase().includes('i work at');
      
      if (isUserCompany && parsedData.company) {
        updated.userCompany = parsedData.company;
        updated.established = true;
      } else if (parsedData.company && !updated.competitors.includes(parsedData.company)) {
        updated.competitors = [...updated.competitors, parsedData.company];
      }
      
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
      // Parse the natural language input
      const parsedData = await parseUserInput(content);
      
      // Update company context
      updateCompanyContext(content, parsedData);
      
      const targetDomain = parsedData.company || companyContext.userCompany || 'example.com';

      // Step 1: Get fast company overview (13s instead of 21s)
      const aiMessageId = (Date.now() + 1).toString();
      const initialAiMessage: Message = {
        id: aiMessageId,
        content: `Getting quick overview for ${targetDomain}...`,
        sender: 'ai',
        timestamp: new Date(),
        loadingState: 'overview'
      };

      setMessages(prev => [...prev, initialAiMessage]);

      try {
        const overview = await getCompanyOverview(targetDomain);
        
        // Update message with overview data
        const overviewMessage: Message = {
          id: aiMessageId,
          content: companyContext.userCompany 
            ? `Here's a quick overview for ${overview.name} from your company (${companyContext.userCompany})'s perspective:`
            : `Here's a quick overview for ${overview.name}:`,
          sender: 'ai',
          timestamp: new Date(),
          overview,
          loadingState: 'complete',
          showFullAnalysisOption: true
        };

        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? overviewMessage : msg
        ));

        toast.success('Quick overview loaded! ⚡');
        
      } catch (overviewError) {
        console.error('Overview failed, falling back to full analysis:', overviewError);
        
        // Fallback to full analysis if overview fails
        await loadFullAnalysis(aiMessageId, targetDomain, parsedData, content);
      }

    } catch (error) {
      console.error('Intelligence generation failed:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Sorry, I encountered an error while gathering intelligence. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to generate intelligence');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFullAnalysis = async (messageId: string, domain: string, parsedData: Record<string, unknown>, originalContent: string) => {
    // Update loading state
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, loadingState: 'full-analysis', content: `Loading comprehensive analysis for ${domain}...` } : msg
    ));

    try {
      // Generate contextual prompt
      let contextualPrompt = originalContent;
      
      if (companyContext.userCompany) {
        contextualPrompt += `\n\nCONTEXT: User works for ${companyContext.userCompany}.`;
        if (companyContext.competitors.length > 0) {
          contextualPrompt += ` Known competitors: ${companyContext.competitors.join(', ')}.`;
        }
        contextualPrompt += ' Please frame your response from their company perspective.';
      }

      // Call the comprehensive intelligence API
      const intelligence = await generateIntelligence({
        companyDomain: domain,
        salesContext: parsedData.salesContext || 'discovery',
        additionalContext: contextualPrompt,
      });

      // Update with full analysis
      const fullAnalysisMessage: Message = {
        id: messageId,
        content: companyContext.userCompany 
          ? `Here's the comprehensive analysis for ${domain} from your company (${companyContext.userCompany})'s perspective:`
          : `Here's the comprehensive analysis for ${domain}:`,
        sender: 'ai',
        timestamp: new Date(),
        intelligence,
        loadingState: 'complete',
        sourcedClaims: intelligence.insights?.sourcedClaims,
        enhancedSources: intelligence.enhancedSources,
        confidenceScore: intelligence.confidenceScore,
      };

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? fullAnalysisMessage : msg
      ));

      toast.success('Full analysis complete! 🧠');
      
    } catch (error) {
      console.error('Full analysis failed:', error);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { 
          ...msg, 
          content: 'Sorry, the comprehensive analysis failed. The quick overview above still contains valuable information.',
          loadingState: 'complete'
        } : msg
      ));
      
      toast.error('Full analysis failed, but overview is available');
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setCompanyContext({
      userCompany: null,
      competitors: [],
      industry: null,
      established: false,
    });
    toast.success('Chat history cleared');
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

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Pure Natural Language Chat</h1>
            <p className="text-sm text-muted-foreground">
              Just talk naturally - I'll understand your company context and provide relevant insights
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
        
        {companyContext.userCompany && (
          <div className="mt-2 p-2 bg-muted rounded-lg">
            <p className="text-xs font-medium">Context: {companyContext.userCompany}</p>
            {companyContext.competitors.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Competitors: {companyContext.competitors.join(', ')}
              </p>
            )}
          </div>
        )}
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
            
            {/* Show loading indicator */}
            {message.loadingState && message.loadingState !== 'complete' && (
              <div className="mt-2 ml-12">
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-blue-700">
                    {message.loadingState === 'overview' && 'Loading quick overview...'}
                    {message.loadingState === 'full-analysis' && 'Loading comprehensive analysis...'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Show overview data */}
            {message.overview && (
              <div className="mt-2 ml-12">
                <OverviewCard data={message.overview} />
                
                {/* Show full analysis option */}
                {message.showFullAnalysisOption && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Want more detailed analysis?
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const parsedData = await parseUserInput('comprehensive analysis');
                          loadFullAnalysis(message.id, message.overview!.domain, parsedData, 'comprehensive analysis');
                          // Remove the option button
                          setMessages(prev => prev.map(msg => 
                            msg.id === message.id ? { ...msg, showFullAnalysisOption: false } : msg
                          ));
                        }}
                        className="flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        Load Full Analysis
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Get comprehensive insights including pain points, competitive analysis, and talking points (~15s)
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Show full intelligence analysis */}
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
          placeholder="Ask me anything about your market, competitors, or industry..."
        />
      </div>
    </div>
  );
} 