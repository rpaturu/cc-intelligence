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
import { CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import type { SalesIntelligenceResponse, SalesContext } from '../../types/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intelligence?: SalesIntelligenceResponse;
  options?: string[];
  currentStep?: string;
  sourcedClaims?: import('../../types/api').SourcedClaim[];
  enhancedSources?: import('../../types/api').EnhancedSource[];
  confidenceScore?: number;
}

interface GuidedState {
  currentStep: 'welcome' | 'company' | 'context' | 'competitors' | 'additional' | 'confirm' | 'complete';
  userCompany: string;
  salesContext: SalesContext | null;
  competitors: string[];
  additionalContext: string;
  isComplete: boolean;
}

const SALES_CONTEXT_OPTIONS = [
  { value: 'discovery', label: 'Discovery Call', icon: '🔍', description: 'Initial meeting to understand their needs' },
  { value: 'competitive', label: 'Competitive Battle', icon: '⚔️', description: 'Competing against other vendors' },
  { value: 'renewal', label: 'Renewal Discussion', icon: '🔄', description: 'Contract renewal or expansion' },
  { value: 'demo', label: 'Product Demo', icon: '🎯', description: 'Technical demonstration' },
  { value: 'negotiation', label: 'Negotiation', icon: '🤝', description: 'Pricing and terms discussion' },
  { value: 'closing', label: 'Closing Meeting', icon: '✅', description: 'Final decision and next steps' },
];

export function GuidedConversationChat() {
  const initialMessages: Message[] = [
    {
      id: '1',
      content: "Hi! I'm your guided intelligence assistant. I'll walk you through a few quick questions to understand your company context and provide the most relevant competitive intelligence. Let's start with your company - what's the name or website?",
      sender: 'ai',
      timestamp: new Date(),
      currentStep: 'welcome',
    },
  ];

  const { messages, setMessages, clearHistory, hasSavedHistory, isLoaded } = useChatPersistence({
    storageKey: 'cc-intelligence-guided-chat',
    initialMessages,
    maxHistorySize: 100
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [guidedState, setGuidedState] = useState<GuidedState>({
    currentStep: 'company',
    userCompany: '',
    salesContext: null,
    competitors: [],
    additionalContext: '',
    isComplete: false,
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
    setGuidedState({
      currentStep: 'company',
      userCompany: '',
      salesContext: null,
      competitors: [],
      additionalContext: '',
      isComplete: false,
    });
    toast.success('Chat history and guided state reset');
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

  const addAiMessage = (content: string, options?: string[], currentStep?: string) => {
    const aiMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'ai',
      timestamp: new Date(),
      options,
      currentStep,
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleStepComplete = (userInput: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Process the input based on current step
    setTimeout(async () => {
      switch (guidedState.currentStep) {
        case 'company':
          await handleCompanyStep(userInput);
          break;
        case 'context':
          handleContextStep(userInput);
          break;
        case 'competitors':
          handleCompetitorsStep(userInput);
          break;
        case 'additional':
          handleAdditionalStep(userInput);
          break;
        case 'confirm':
          await handleConfirmStep(userInput);
          break;
      }
    }, 500);
  };

  const handleCompanyStep = async (input: string) => {
    const parsed = await parseUserInput(input);
    const companyName = parsed.company || input.trim();
    
    setGuidedState(prev => ({
      ...prev,
      userCompany: companyName,
      currentStep: 'context'
    }));

    addAiMessage(
      `Great! I'll help you with intelligence about ${companyName}. Now, what type of meeting or situation are you preparing for?`,
      SALES_CONTEXT_OPTIONS.map(option => option.label),
      'context'
    );
  };

  const handleContextStep = (input: string) => {
    const selectedOption = SALES_CONTEXT_OPTIONS.find(option => 
      option.label.toLowerCase().includes(input.toLowerCase()) ||
      input.toLowerCase().includes(option.value)
    );
    
    const contextValue = selectedOption?.value as SalesContext || 'discovery';
    
    setGuidedState(prev => ({
      ...prev,
      salesContext: contextValue,
      currentStep: 'competitors'
    }));

    addAiMessage(
      `Perfect! For a ${selectedOption?.label || 'discovery'} with ${guidedState.userCompany}, it would be helpful to know about their competitive landscape. Who are their main competitors? (You can list multiple companies or skip if unknown)`,
      ['Skip this step', 'I don\'t know their competitors'],
      'competitors'
    );
  };

  const handleCompetitorsStep = (input: string) => {
    let competitors: string[] = [];
    
    if (!input.toLowerCase().includes('skip') && !input.toLowerCase().includes('don\'t know')) {
      // Parse competitor names
      competitors = input
        .split(/[,\n]/)
        .map(comp => comp.trim())
        .filter(comp => comp.length > 0);
    }
    
    setGuidedState(prev => ({
      ...prev,
      competitors,
      currentStep: 'additional'
    }));

    addAiMessage(
      `${competitors.length > 0 ? `Got it! I'll include insights about ${competitors.join(', ')}.` : 'No problem!'} Last question - any specific context or details about your ${guidedState.userCompany} situation? (Optional - you can skip this too)`,
      ['Skip - generate intelligence now'],
      'additional'
    );
  };

  const handleAdditionalStep = (input: string) => {
    const additionalContext = input.toLowerCase().includes('skip') ? '' : input;
    
    setGuidedState(prev => ({
      ...prev,
      additionalContext,
      currentStep: 'confirm'
    }));

    // Show confirmation
    const contextOption = SALES_CONTEXT_OPTIONS.find(opt => opt.value === guidedState.salesContext);
    const confirmationMessage = `Perfect! Here's what I'll research for you:

🏢 **Company**: ${guidedState.userCompany}
📋 **Meeting Type**: ${contextOption?.label}
${guidedState.competitors.length > 0 ? `🏆 **Competitors**: ${guidedState.competitors.join(', ')}` : ''}
${additionalContext ? `📝 **Additional Context**: ${additionalContext}` : ''}

Ready to generate your intelligence report?`;

    addAiMessage(confirmationMessage, ['Generate Intelligence Report', 'Let me modify something'], 'confirm');
  };

  const handleConfirmStep = async (input: string) => {
    if (input.toLowerCase().includes('modify')) {
      // Reset to company step
      setGuidedState(prev => ({ ...prev, currentStep: 'company' }));
      addAiMessage("No problem! Let's start over. What's your company name or website?", [], 'company');
      return;
    }

    // Generate intelligence
    await generateIntelligenceReport();
  };

  const generateIntelligenceReport = async () => {
    setIsLoading(true);
    
    try {
      const contextualPrompt = `
        User Company: ${guidedState.userCompany}
        Meeting Type: ${guidedState.salesContext}
        ${guidedState.competitors.length > 0 ? `Known Competitors: ${guidedState.competitors.join(', ')}` : ''}
        ${guidedState.additionalContext ? `Additional Context: ${guidedState.additionalContext}` : ''}
        
        Please provide intelligence from the perspective of someone preparing to work with ${guidedState.userCompany}.
      `;

      const intelligence = await generateIntelligence({
        companyDomain: guidedState.userCompany,
        salesContext: guidedState.salesContext!,
        additionalContext: contextualPrompt,
      });

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: `Here's your personalized intelligence report for ${guidedState.userCompany}:`,
        sender: 'ai',
        timestamp: new Date(),
        intelligence,
        sourcedClaims: intelligence.insights.sourcedClaims,
        enhancedSources: intelligence.enhancedSources,
        confidenceScore: intelligence.sourceCredibilityScore || intelligence.confidenceScore,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      setGuidedState(prev => ({ ...prev, currentStep: 'complete', isComplete: true }));
      
      // Add follow-up message
      setTimeout(() => {
        addAiMessage(
          "Would you like me to generate another report for a different company or meeting type?",
          ['Start New Report', 'Ask Follow-up Question'],
          'complete'
        );
      }, 1000);

    } catch (error) {
      console.error('Error generating intelligence:', error);
      toast.error('Failed to generate intelligence. Please try again.');
      
      addAiMessage(
        'Sorry, I encountered an error generating your report. Would you like to try again?',
        ['Try Again', 'Start Over'],
        'confirm'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleStepComplete(action);
  };

  const getProgressSteps = () => {
    const steps = ['Company', 'Context', 'Competitors', 'Details', 'Confirm', 'Complete'];
    const stepIndex = steps.indexOf(guidedState.currentStep === 'welcome' ? 'Company' : 
      guidedState.currentStep.charAt(0).toUpperCase() + guidedState.currentStep.slice(1));
    
    return { steps, currentIndex: stepIndex };
  };

  const { steps, currentIndex } = getProgressSteps();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header with Progress */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-2">Guided Intelligence Assistant</h1>
            <p className="text-sm text-muted-foreground mb-3">
              I'll guide you through a few questions to provide the most relevant intelligence
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
        
        {/* Progress Steps */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                index <= currentIndex 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {index < currentIndex ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <span className="w-3 h-3 mr-1 rounded-full bg-current opacity-50" />
                )}
                {step}
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 mx-1 text-gray-400" />
              )}
            </div>
          ))}
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
            
            {/* Quick Action Options */}
            {message.options && message.sender === 'ai' && (
              <div className="mt-3 ml-12 flex flex-wrap gap-2">
                {message.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(option)}
                    className="text-sm"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Sales Context Options */}
            {message.currentStep === 'context' && (
              <div className="mt-3 ml-12 grid grid-cols-2 gap-2">
                {SALES_CONTEXT_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(option.label)}
                    className="text-left justify-start p-3 h-auto"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {option.icon} {option.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </div>
                    </div>
                  </Button>
                ))}
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
          onSendMessage={handleStepComplete}
          disabled={isLoading}
          placeholder={
            guidedState.currentStep === 'company' ? "Enter your company name or website..." :
            guidedState.currentStep === 'context' ? "Describe your meeting type..." :
            guidedState.currentStep === 'competitors' ? "List their main competitors..." :
            guidedState.currentStep === 'additional' ? "Any specific context or details..." :
            guidedState.currentStep === 'confirm' ? "Type 'yes' to generate report..." :
            "Ask a follow-up question..."
          }
        />
      </div>
    </div>
  );
} 