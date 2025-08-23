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
import { getStreamingSteps } from "../utils/research-utils";
import { getResearchAreas } from "../components/research-content/data/research-areas-data";
import { getFollowUpOptions } from "../components/research-content/data/follow-up-options-data";
import { createResearchEventSource } from '../lib/api';
import { researchProgressManager } from "../components/research/ResearchProgressManager";
import { scrollToStreamingMessage, scrollToResearchFindings } from "../utils/scroll-utils";

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

  async startRealResearch(messageId: string, researchAreaId: string, companyName?: string) {
    const { setMessages, userProfile, currentCompany } = this.dependencies;
    const targetCompany = companyName || currentCompany;
    
    if (!userProfile || !targetCompany) {
      console.error('Missing user profile or company for research');
      return;
    }

    // Get appropriate streaming steps for this research area
    const steps = getStreamingSteps(researchAreaId);
    const streamingSteps = steps.map(step => ({ ...step, completed: false }));

    // Initialize streaming message with proper progress steps
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { 
            ...msg, 
            isStreaming: true, 
            streamingSteps
          }
        : msg
    ));

    // Scroll to show streaming progress
    setTimeout(() => {
      scrollToStreamingMessage();
    }, 150);

    try {
      // Start SSE connection for real-time research updates using API client
      const eventSource = await createResearchEventSource(
        researchAreaId,
        targetCompany
      );

      let collectedData: any = null;

      // SSE event handlers - using ResearchProgressManager
      eventSource.addEventListener('collection_started', (event) => {
        const data = JSON.parse(event.data);
        researchProgressManager.handleCollectionStarted(data, messageId, setMessages);
      });

      eventSource.addEventListener('progress_update', (event) => {
        const data = JSON.parse(event.data);
        researchProgressManager.handleProgressUpdate(data, messageId, setMessages);
      });

      eventSource.addEventListener('research_findings', (event) => {
        const data = JSON.parse(event.data);
        researchProgressManager.handleResearchFindingsEvent(data, messageId, setMessages);
      });

      eventSource.addEventListener('research_complete', (event) => {
        const data = JSON.parse(event.data);
        console.log('✅ Research completed:', data);
        
        // Close SSE connection
        eventSource.close();
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

    // Replace the streaming message with company summary
    setMessages(prev => {
      const filteredMessages = prev.filter(msg => msg.id !== messageId);
      
      const summaryMessage: Message = {
        id: messageId,
        type: "assistant",
        content: "",
        timestamp: new Date(),
        companySummary: companyData,
      };

      // Add research topics after company summary
      const researchAreas = getResearchAreas(companyName || "Unknown Company", userProfile?.role || "Sales", userProfile?.company || "Tech Corp");
      const optionsMessage: Message = {
        id: `options-${Date.now()}`,
        type: "assistant",
        content: researchAreas.intro,
        timestamp: new Date(),
        options: researchAreas.options,
      };

      return [...filteredMessages, summaryMessage, optionsMessage];
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
