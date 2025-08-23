import { StreamingStep, Message } from "../../types/research";

export interface ProgressState {
  isActive: boolean;
  currentStep: number;
  steps: StreamingStep[];
  messageId: string | null;
  content: string;
  collectedData?: any;
}

export class ResearchProgressManager {
  private progressState: ProgressState = {
    isActive: false,
    currentStep: 0,
    steps: [],
    messageId: null,
    content: "",
    collectedData: undefined
  };

  private setMessages: ((updater: (prev: Message[]) => Message[]) => void) | null = null;
  private onComplete: (() => void) | null = null;

  constructor() {}

  // Initialize the progress manager with message setter
  initialize(setMessages: (updater: (prev: Message[]) => Message[]) => void) {
    this.setMessages = setMessages;
  }

  // Start new research progress
  startNewResearch(companyName: string, onComplete?: () => void): string {
    console.log('🔧 NEW ResearchProgressManager.startNewResearch called for:', companyName);
    const messageId = (Date.now() + 1).toString();
    this.onComplete = onComplete || null;

    const steps = this.getCompanyResearchSteps(companyName);
    const streamingSteps = steps.map(step => ({ ...step, completed: false }));

    const streamingMessage: Message = {
      id: messageId,
      type: "assistant",
      content: "Researching company overview...",
      timestamp: new Date(),
      isStreaming: true,
      streamingSteps
    };

    this.setMessages?.(prev => [...prev, streamingMessage]);

    this.progressState = {
      isActive: true,
      currentStep: 0,
      steps: streamingSteps,
      messageId,
      content: "Researching company overview..."
    };

    this.startProgressSimulation(messageId, steps);
    return messageId;
  }

  // Start history loading progress
  startHistoryLoading(onComplete?: () => void): string {
    const messageId = (Date.now() + 1).toString();
    this.onComplete = onComplete || null;

    const steps = this.getHistoryLoadingSteps();
    const streamingSteps = steps.map(step => ({ ...step, completed: false }));

    const streamingMessage: Message = {
      id: messageId,
      type: "assistant",
      content: "Loading your research session...",
      timestamp: new Date(),
      isStreaming: true,
      streamingSteps
    };

    this.setMessages?.(prev => [...prev, streamingMessage]);

    this.progressState = {
      isActive: true,
      currentStep: 0,
      steps: streamingSteps,
      messageId,
      content: "Loading your research session..."
    };

    this.startProgressSimulation(messageId, steps);
    return messageId;
  }

  // Handle SSE progress updates (for direct SSE event handling)
  handleSSEProgressUpdate(eventData: any, messageId: string, companyName: string, userProfile: any, setMessages: any, setCompletedResearch: any) {
    if (!this.progressState.isActive || !this.progressState.messageId) {
      return;
    }

    // Update progress based on SSE event type
    switch (eventData.type) {
      case 'collection_started':
        console.log('🔍 Research collection started:', eventData);
        this.updateProgressStep(0, true);
        this.updateContent("Starting research collection...");
        break;
      case 'progress_update':
        console.log('📊 Progress update:', eventData);
        this.updateProgressStep(1, true);
        this.updateContent(`Progress: ${eventData.progress}% - ${eventData.currentStep}`);
        break;
      case 'sources_found':
        console.log('🔍 Sources found:', eventData);
        this.updateProgressStep(2, true);
        this.updateContent("Found relevant data sources...");
        break;
      case 'research_findings':
        console.log('💡 Research findings received:', eventData);
        this.updateProgressStep(3, true);
        this.updateContent("Compiling research findings...");
        this.handleResearchFindings(eventData, messageId, companyName, userProfile, setMessages, setCompletedResearch);
        break;
      case 'research_complete':
        console.log('✅ Research completed:', eventData);
        this.handleResearchComplete(eventData, messageId, companyName, userProfile, setMessages, setCompletedResearch);
        break;
    }
  }

  // Handle individual SSE events (for integration with existing handlers)
  handleCollectionStarted(eventData: any, _messageId: string, _setMessages: any) {
    console.log('🔍 Research collection started:', eventData);
    this.updateProgressStep(0, true);
    this.updateContent("Starting research collection...");
  }

  handleProgressUpdate(eventData: any, _messageId: string, _setMessages: any) {
    console.log('📊 Progress update:', eventData);
    this.updateProgressStep(1, true);
    this.updateContent(`Progress: ${eventData.progress}% - ${eventData.currentStep}`);
  }

  handleResearchFindingsEvent(eventData: any, _messageId: string, _setMessages: any) {
    console.log('💡 Research findings received:', eventData);
    this.updateProgressStep(3, true);
    this.updateContent("Compiling research findings...");
    this.progressState.collectedData = eventData;
  }

  handleResearchCompleteEvent(eventData: any, messageId: string, companyName: string, userProfile: any, setMessages: any, setCompletedResearch: any, _researchAreaId: string) {
    console.log('✅ Research completed:', eventData);
    this.handleResearchComplete(eventData, messageId, companyName, userProfile, setMessages, setCompletedResearch);
  }

  // Handle research findings
  private handleResearchFindings(eventData: any, _messageId: string, _companyName: string, _userProfile: any, _setMessages: any, _setCompletedResearch: any) {
    // Store the findings data for later use
    this.progressState.collectedData = eventData;
  }

  // Handle research completion
  private handleResearchComplete(eventData: any, messageId: string, companyName: string, userProfile: any, setMessages: any, setCompletedResearch: any) {
    const collectedData = this.progressState.collectedData;
    
    // Handle company overview completion
    if (eventData.researchAreaId === 'company_overview') {
      console.log('🎯 Company overview research completed');
      
      // Extract company data from the response
      let companyData: any = undefined;
      if (collectedData?.findings) {
        const serpData = collectedData.findings.serp_api;
        const apolloData = collectedData.findings.apollo;
        
        companyData = {
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

      // Replace the streaming message with company summary
      setMessages((prev: any[]) => {
        const filteredMessages = prev.filter((msg: any) => msg.id !== messageId);
        
        const summaryMessage = {
          id: messageId,
          type: "assistant",
          content: "",
          timestamp: new Date(),
          companySummary: companyData || {
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
          },
        };

        // Add research topics after company summary
        const { getResearchAreas } = require('../../components/research-content/data');
        const researchAreas = getResearchAreas(companyName || "Unknown Company", userProfile.role || "Sales", userProfile.company || "Tech Corp");
        const optionsMessage = {
          id: `options-${Date.now()}`,
          type: "assistant",
          content: researchAreas.intro,
          timestamp: new Date(),
          options: researchAreas.options,
        };

        return [...filteredMessages, summaryMessage, optionsMessage];
      });

    } else {
      // Handle other research areas
      const completedResearchItem = {
        id: messageId,
        title: collectedData?.title || `${eventData.researchAreaId} Research`,
        completedAt: new Date(),
        findings: collectedData || { title: '', items: [] },
        researchArea: eventData.researchAreaId
      };

      setCompletedResearch((prev: any[]) => [...prev, completedResearchItem]);

      // Update message with real findings
      setMessages((prev: any[]) => prev.map((msg: any) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            content: collectedData?.title || `Research completed for ${eventData.researchAreaId}`,
            findings: collectedData
          };
        }
        return msg;
      }));
    }

    // Complete the progress
    this.completeProgress();
  }

  // Complete the progress
  completeProgress() {
    if (!this.progressState.isActive || !this.progressState.messageId) {
      return;
    }

    this.progressState.isActive = false;
    this.onComplete?.();
  }

  // Get current progress state
  getProgressState(): ProgressState {
    return { ...this.progressState };
  }

  // Private methods
  private getCompanyResearchSteps(companyName: string): StreamingStep[] {
    return [
      {
        text: `🎯 Mapping ${companyName} organizational structure`,
        iconName: "target",
        completed: false
      },
      {
        text: "🔍 Scanning LinkedIn and company directory",
        iconName: "search",
        completed: false
      },
      {
        text: "📊 Analyzing recent leadership changes",
        iconName: "bar-chart",
        completed: false
      },
      {
        text: "👥 Identifying key stakeholders",
        iconName: "users",
        completed: false
      },
      {
        text: "✅ Company profile complete - found key insights",
        iconName: "check-square",
        completed: false
      }
    ];
  }

  private getHistoryLoadingSteps(): StreamingStep[] {
    return [
      {
        text: "Loading Research",
        iconName: "download",
        completed: false
      },
      {
        text: "Restoring Session",
        iconName: "refresh-cw",
        completed: false
      },
      {
        text: "Compiling Data",
        iconName: "database",
        completed: false
      },
      {
        text: "Ready to Continue",
        iconName: "check-circle",
        completed: false
      }
    ];
  }

  private startProgressSimulation(_messageId: string, steps: StreamingStep[]) {
    // Complete each step progressively
    steps.forEach((_, index) => {
      setTimeout(() => {
        this.updateProgressStep(index, true);
      }, index * 1000);
    });

    // Complete the simulation after all steps
    setTimeout(() => {
      this.completeProgress();
    }, steps.length * 1000 + 500);
  }

  private updateProgressStep(stepIndex: number, completed: boolean) {
    if (!this.progressState.messageId || !this.setMessages) {
      return;
    }

    this.setMessages(prev => prev.map(msg => 
      msg.id === this.progressState.messageId && msg.streamingSteps
        ? {
            ...msg,
            streamingSteps: msg.streamingSteps.map((step: StreamingStep, i: number) => 
              i === stepIndex ? { ...step, completed } : step
            )
          }
        : msg
    ));

    this.progressState.currentStep = stepIndex;
  }

  private updateContent(content: string) {
    if (!this.progressState.messageId || !this.setMessages) {
      return;
    }

    this.setMessages(prev => prev.map(msg => 
      msg.id === this.progressState.messageId
        ? { ...msg, content }
        : msg
    ));

    this.progressState.content = content;
  }
}

// Export a singleton instance
export const researchProgressManager = new ResearchProgressManager();
