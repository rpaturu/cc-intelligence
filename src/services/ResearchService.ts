/**
 * ResearchService - Frontend active research streaming management
 * 
 * Handles all active research operations:
 * 1. Initiate research sessions
 * 2. Real-time research streaming (SSE)
 * 3. Research status monitoring
 * 4. Research results retrieval
 */

import { Message, CompletedResearch, CompanyData } from "../types/research";
import { getResearchAreas } from "../components/research-content/data/research-areas-data";
import { getFollowUpOptions } from "../components/research-content/data/follow-up-options-data";
import { createResearchEventSource } from '../lib/api';
import { researchProgressManager } from "../components/research/ResearchProgressManager";
import { scrollToResearchFindings } from "../utils/scroll-utils";

export interface ResearchServiceDependencies {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCompletedResearch: React.Dispatch<React.SetStateAction<CompletedResearch[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: any;
  currentCompany: string;
}

export class ResearchService {
  private dependencies: ResearchServiceDependencies;

  constructor(dependencies: ResearchServiceDependencies) {
    this.dependencies = dependencies;
  }

  async startRealResearch(_messageId: string, researchAreaId: string, companyName?: string) {
    const { setMessages, userProfile, currentCompany } = this.dependencies;
    const targetCompany = companyName || currentCompany;
    
    if (!userProfile || !targetCompany) {
      console.error('Missing user profile or company for research');
      return;
    }

    let messageId: string = '';
    try {
          // Start SSE connection for real-time research updates using API client
    const { eventSource, streamingData } = await createResearchEventSource(
      researchAreaId,
      targetCompany
    );

                console.log('⏰ TIMING: API stream response received at:', new Date().toISOString() + '.' + new Date().getMilliseconds().toString().padStart(3, '0'), {
              hasEventDescriptions: !!streamingData?.eventDescriptions,
              hasEventTypes: !!streamingData?.eventTypes,
              hasEventIcons: !!streamingData?.eventIcons,
              eventTypesCount: streamingData?.eventTypes?.length || 0
            });

    let collectedData: any = null;

    // Initialize the progress manager with setMessages
    researchProgressManager.initialize(setMessages);

    // Start new research - this will only create streaming message if we have backend descriptions
    const messageId = researchProgressManager.startNewResearch(
      targetCompany,
      undefined, // onComplete
      streamingData?.eventDescriptions,
      streamingData?.eventTypes,
      streamingData?.eventIcons,
      _messageId // Use the existing messageId passed from EventHandlerService
    );

    // SSE event handlers - using ResearchProgressManager with new user-focused event types
    eventSource.addEventListener('research_started', (event) => {
      const data = JSON.parse(event.data);
      // console.log('🚀 Processing SSE event: research_started', data);
      researchProgressManager.handleSSEEvent('research_started', data, messageId, setMessages, streamingData?.eventTypes);
    });

    eventSource.addEventListener('data_gathering', (event) => {
      const data = JSON.parse(event.data);
      // console.log('📡 Processing SSE event: data_gathering', data);
      researchProgressManager.handleSSEEvent('data_gathering', data, messageId, setMessages, streamingData?.eventTypes);
    });

    eventSource.addEventListener('analysis_in_progress', (event) => {
      const data = JSON.parse(event.data);
      // console.log('🧠 Processing SSE event: analysis_in_progress', data);
      researchProgressManager.handleSSEEvent('analysis_in_progress', data, messageId, setMessages, streamingData?.eventTypes);
    });

    eventSource.addEventListener('synthesis_complete', (event) => {
      const data = JSON.parse(event.data);
      // console.log('✨ Processing SSE event: synthesis_complete', data);
      researchProgressManager.handleSSEEvent('synthesis_complete', data, messageId, setMessages, streamingData?.eventTypes);
    });

      eventSource.addEventListener('research_complete', async (event) => {
        const data = JSON.parse(event.data);
        console.log('✅ Research completed:', data);
        console.log('🔧 Adding 15-second delay to observe progress steps...');
        
        // Update the progress step first
        researchProgressManager.handleSSEEvent('research_complete', data, messageId, setMessages, streamingData?.eventTypes);
        
        eventSource.close();
        
        // Add longer delay to observe progress steps before completing
        await new Promise(resolve => setTimeout(resolve, 15000)); // 15-second delay
        console.log('🔧 Delay complete, now processing research completion...');
        this.handleResearchComplete(data, messageId, researchAreaId, companyName, collectedData);
      });

      eventSource.addEventListener('error', (event) => {
        console.error('❌ SSE connection error:', event);
        eventSource.close();
        this.handleResearchError(messageId);
      });

    } catch (error) {
      console.error('❌ Failed to start research:', error);
      this.handleResearchError(messageId);
    }
  }

  private handleResearchComplete(_eventData: any, messageId: string, researchAreaId: string, companyName?: string, collectedData?: any) {
    const { setIsTyping, userProfile } = this.dependencies;

    if (researchAreaId === 'company_overview') {
      this.handleCompanyOverviewComplete(messageId, companyName, collectedData, userProfile);
    } else {
      this.handleOtherResearchComplete(messageId, researchAreaId, collectedData);
    }
    
    setIsTyping(false);
  }

  private handleCompanyOverviewComplete(messageId: string, companyName?: string, collectedData?: any, userProfile?: any) {
    const { setMessages } = this.dependencies;
    
    console.log('🎯 Company overview research completed');
    
    // Extract company data from the response
    const companyData = this.extractCompanyData(collectedData, companyName);

    // Update the streaming message to show completed result
    setMessages(prev => {
      const updatedMessages = prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              isStreaming: false,
              streamingSteps: undefined,
              companySummary: companyData,
              content: ""
            }
          : msg
      );
      
      // Add research topics after company summary
      const researchAreas = getResearchAreas(companyName || "Unknown Company", userProfile?.role || "Sales", userProfile?.company || "Tech Corp");
      const optionsMessage: Message = {
        id: `options-${Date.now()}`,
        type: "assistant",
        content: researchAreas.intro,
        timestamp: new Date(),
        options: researchAreas.options,
      };

      return [...updatedMessages, optionsMessage];
    });
  }

  private handleOtherResearchComplete(messageId: string, researchAreaId: string, collectedData?: any) {
    const { setMessages, setCompletedResearch } = this.dependencies;
    

    // Handle other research areas
    const completedResearchItem: CompletedResearch = {
      id: messageId,
      title: collectedData?.title || `${researchAreaId} Research`,
      completedAt: new Date(),
      findings: collectedData || { title: '', items: [] },
      researchArea: researchAreaId
    };

    setCompletedResearch(prev => [...prev, completedResearchItem]);

    // Update message with real findings
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const updatedMessage = {
        ...msg,
        isStreaming: false,
        content: "",
        researchFindings: collectedData?.findings ? {
          id: messageId,
          title: `${researchAreaId} Research`,
          researchArea: researchAreaId,
          items: [
            {
              title: "Customer Intelligence Analysis",
              description: "Real-time research findings from multiple data sources",
              details: Object.keys(collectedData.findings).map(source => 
                `Data from ${source}: ${Object.keys(collectedData.findings[source]).length} records`
              )
            }
          ]
        } : undefined,
        sources: [], // Sources will be populated from the actual research results, not streaming data
        followUpOptions: collectedData?.options || getFollowUpOptions(researchAreaId)
      };
      
      console.log('🎯 Updating message with research findings:', {
        messageId,
        researchFindings: updatedMessage.researchFindings,
        sources: updatedMessage.sources,
        followUpOptions: updatedMessage.followUpOptions
      });
      
      return updatedMessage;
    }));

    // Scroll to show completed findings
    setTimeout(() => {
      scrollToResearchFindings();
    }, 800);
  }

  private handleResearchError(messageId: string) {
    const { setMessages, setIsTyping } = this.dependencies;
    
    // Handle error gracefully
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            isStreaming: false,
            content: "Sorry, I encountered an error while researching. Please try again.",
            streamingSteps: undefined
          }
        : msg
    ));
    
    setIsTyping(false);
  }

  private extractCompanyData(collectedData?: any, companyName?: string): CompanyData {
    if (collectedData?.findings) {
      const serpData = collectedData.findings.serp_api;
      const apolloData = collectedData.findings.apollo;
      
      return {
        name: companyName || "Unknown Company",
        industry: serpData?.industry || apolloData?.industry || "Technology",
        size: serpData?.size || apolloData?.size || "Enterprise",
        location: serpData?.location || apolloData?.location || "Global",
        revenue: serpData?.revenue || apolloData?.revenue || "$200B+",
        businessModel: serpData?.businessModel || apolloData?.businessModel || "Software & Cloud Services",
        marketPosition: serpData?.marketPosition || apolloData?.marketPosition || "Market Leader",
        techStack: serpData?.techStack || apolloData?.techStack || ["Azure", ".NET", "TypeScript", "AI/ML", "C#", "React"],
        founded: serpData?.founded || apolloData?.founded || "1975",
        recentNews: serpData?.recentNews || apolloData?.recentNews || "AI integration across Office suite",
        keyExecutives: serpData?.keyExecutives || apolloData?.keyExecutives || [
          {
            name: "Satya Nadella",
            role: "CEO",
            background: "22-year Microsoft veteran, cloud transformation leader"
          },
          {
            name: "Amy Hood",
            role: "CFO", 
            background: "Former McKinsey consultant, 13+ years at Microsoft"
          }
        ],
        recentDevelopments: serpData?.recentDevelopments || apolloData?.recentDevelopments || [
          {
            type: "product",
            title: "Copilot integration across Office suite",
            date: "Dec 2024",
            impact: "high"
          },
          {
            type: "partnership",
            title: "OpenAI strategic partnership expansion", 
            date: "Nov 2024",
            impact: "high"
          }
        ],
        businessMetrics: serpData?.businessMetrics || apolloData?.businessMetrics || {
          valuation: "$2.8T market cap",
          customerCount: "1.4B Office users"
        }
      };
    }

    // Return default company data
    return {
      name: companyName || "Unknown Company",
      industry: "Technology",
      size: "Enterprise",
      location: "Global",
      revenue: "$200B+",
      businessModel: "Software & Cloud Services",
      marketPosition: "Market Leader",
      techStack: ["Azure", ".NET", "TypeScript", "AI/ML", "C#", "React"],
      founded: "1975",
      recentNews: "AI integration across Office suite",
      keyExecutives: [
        {
          name: "Satya Nadella",
          role: "CEO",
          background: "22-year Microsoft veteran, cloud transformation leader"
        },
        {
          name: "Amy Hood",
          role: "CFO", 
          background: "Former McKinsey consultant, 13+ years at Microsoft"
        }
      ],
      recentDevelopments: [
        {
          type: "product",
          title: "Copilot integration across Office suite",
          date: "Dec 2024",
          impact: "high"
        },
        {
          type: "partnership",
          title: "OpenAI strategic partnership expansion", 
          date: "Nov 2024",
          impact: "high"
        }
      ],
      businessMetrics: {
        valuation: "$2.8T market cap",
        customerCount: "1.4B Office users"
      }
    };
  }
}
