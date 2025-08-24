/**
 * EventHandlerService
 * 
 * Handles all user interaction events in the research flow:
 * 1. Message sending and processing
 * 2. Option clicks (research areas, export, etc.)
 * 3. Company selection and session management
 * 4. New research session creation
 * 
 * Extracted from Research.tsx to reduce file size and improve separation of concerns
 */

import { Message, CompletedResearch } from "../types/research";
import { parseCompanyFromInput, isResearchQuery } from "../utils/research-utils";
import { scrollToBottom } from "../utils/scroll-utils";
import { researchProgressManager } from "../components/research/ResearchProgressManager";
import { getCompanyResearch } from '../lib/api';
import { CORE_RESEARCH_AREAS } from "../data/research-areas";
import { ResearchPollingService } from "./ResearchPollingService";

export interface EventHandlerServiceDependencies {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCompany: React.Dispatch<React.SetStateAction<string>>;
  setShowCompanySearch: React.Dispatch<React.SetStateAction<boolean>>;
  setCompletedResearch: React.Dispatch<React.SetStateAction<CompletedResearch[]>>;
  setResearchHistory: React.Dispatch<React.SetStateAction<Array<{
    company: string;
    lastUpdated: string;
    completedAreas: number;
    lastActivity?: string;
  }>>>;
  inputValue: string;
  messages: Message[];
  completedResearch: CompletedResearch[];
  researchHistory: Array<{
    company: string;
    lastUpdated: string;
    completedAreas: number;
    lastActivity?: string;
  }>;
  userProfile: any;
  startRealResearch: (messageId: string, researchArea: string, companyName?: string) => void;
  handleDownloadReport: (format: 'pdf' | 'powerpoint' | 'word' | 'excel' | 'json') => void;
  handleExportResearch: () => void;
  currentCompany: string;
}

export class EventHandlerService {
  private dependencies: EventHandlerServiceDependencies;
  private allResearchAreaIds: string[];
  private pollingService: ResearchPollingService;

  constructor(dependencies: EventHandlerServiceDependencies) {
    this.dependencies = dependencies;
    this.allResearchAreaIds = CORE_RESEARCH_AREAS.map(area => area.id);
    
    // Initialize polling service
    this.pollingService = new ResearchPollingService({
      setMessages: dependencies.setMessages,
      setCompletedResearch: dependencies.setCompletedResearch,
      setIsTyping: dependencies.setIsTyping,
      userProfile: dependencies.userProfile,
      currentCompany: dependencies.currentCompany
    });
  }

  /**
   * Handle sending messages (user input or programmatic)
   */
  handleSendMessage(messageContent?: string): void {
    const messageToSend = messageContent || this.dependencies.inputValue;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    this.dependencies.setMessages(prev => [...prev, userMessage]);
    this.dependencies.setInputValue("");
    this.dependencies.setIsTyping(true);

    setTimeout(() => {
      const messageId = (Date.now() + 1).toString();

      if (isResearchQuery(messageToSend)) {
        const company = parseCompanyFromInput(messageToSend);
        this.dependencies.setCurrentCompany(company);

        console.log('🔧 EventHandlerService: Triggering polling research for:', company);

        // Use polling service instead of SSE
        this.pollingService.startResearch(messageId, "company_overview", company);
      } else {
        const assistantMessage: Message = {
          id: messageId,
          type: "assistant",
          content: "I can help you research companies and prospects. Try asking me to 'Research [Company Name]' to get started with comprehensive discovery across 12 key areas including competitive positioning.",
          timestamp: new Date(),
        };

        this.dependencies.setMessages(prev => [...prev, assistantMessage]);
        this.dependencies.setIsTyping(false);
      }
    }, 1000);
  }

  /**
   * Handle option clicks (research areas, export, etc.)
   */
  handleOptionClick(optionId: string, optionText: string, format?: string): void {
    if (optionId === "export_report") {
      if (format) {
        this.dependencies.handleDownloadReport(format as 'pdf' | 'powerpoint' | 'word' | 'excel' | 'json');
      } else {
        this.dependencies.handleExportResearch();
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: optionText,
      timestamp: new Date(),
    };

    this.dependencies.setMessages(prev => [...prev, userMessage]);
    this.dependencies.setIsTyping(true);

    // Check if this is a research area for special handling
    const isResearchArea = this.allResearchAreaIds.includes(optionId);

    // Immediate scroll to show user message for quick feedback
    setTimeout(() => {
      scrollToBottom("instant");
    }, 50); // Very quick scroll to show user response

    setTimeout(() => {
      const messageId = (Date.now() + 1).toString();

      if (isResearchArea) {
        // Use polling service instead of SSE
        this.pollingService.startResearch(messageId, optionId);
      } else {
        if (optionId === "research_another") {
          this.dependencies.setShowCompanySearch(true);
          this.dependencies.setCurrentCompany("");
          this.dependencies.setMessages([]);
          this.dependencies.setCompletedResearch([]);
          this.dependencies.setIsTyping(false);
        } else {
          const assistantMessage: Message = {
            id: messageId,
            type: "assistant",
            content: "I can help you research companies and prospects. Try asking me to 'Research [Company Name]' to get started with comprehensive discovery across 12 key areas including competitive positioning.",
            timestamp: new Date(),
          };

          this.dependencies.setMessages(prev => [...prev, assistantMessage]);
          this.dependencies.setIsTyping(false);
        }
      }
    }, 1000);
  }

  /**
   * Handle company selection from search or history
   */
  async handleCompanySelect(company: any): Promise<void> {
    console.log('Company selected:', company.name);
    console.log('Current research history:', this.dependencies.researchHistory);
    
    this.dependencies.setCurrentCompany(company.name);
    this.dependencies.setShowCompanySearch(false);
    this.dependencies.setMessages([]);
    this.dependencies.setCompletedResearch([]);

    // Check if there's an existing session for this company
    const existingSession = this.dependencies.researchHistory.find(item => item.company === company.name);
    console.log('Existing session found:', existingSession);
    
    if (existingSession) {
      try {
        console.log('Loading existing session for:', company.name);
        
        // Show progress first, then load existing session
        const userMessageId = Date.now().toString();
        const userMessage: Message = {
          id: userMessageId,
          type: "user",
          content: `Research ${company.name}`,
          timestamp: new Date(),
        };

        this.dependencies.setMessages([userMessage]);

        // Add streaming progress message
        setTimeout(() => {
          researchProgressManager.startHistoryLoading(async () => {
            // After progress completes, load the existing session
            try {
              const response = await getCompanyResearch(company.name);
              console.log('Research response:', response);
              
              this.dependencies.setMessages(response.data.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })));
              this.dependencies.setCompletedResearch(response.data.completedResearch.map((research: any) => ({
                id: research.id,
                title: research.title,
                completedAt: research.completedAt ? new Date(research.completedAt) : new Date(),
                researchArea: research.areaId,
                findings: research.data?.findings || {
                  title: research.title,
                  items: []
                }
              })));
              
              // Set available research areas for existing session
              // const researchAreas = getResearchAreas(company.name, userProfile.role, userProfile.company);
              // Available research areas are now calculated dynamically
            } catch (error) {
              console.error('Failed to load existing session:', error);
              // Fall back to creating a new session
              this.createNewResearchSession(company.name);
            }
          });
        }, 500);
        
      } catch (error) {
        console.error('Failed to load existing session:', error);
        // Fall back to creating a new session
        this.createNewResearchSession(company.name);
      }
    } else {
      console.log('No existing session found, creating new session for:', company.name);
      // Create a new session with progress flow
      this.createNewResearchSession(company.name);
      
      // Automatically trigger overview research for new companies after progress completes
      console.log('Triggering automatic overview research for:', company.name);
      // The progress simulation will handle this automatically
    }
    
    // Reload research history to ensure it's up to date - COMMENTED OUT for testing
    // await loadResearchHistory();
  }

  /**
   * Create a new research session for a company
   */
  createNewResearchSession(companyName: string): void {
    // Create initial research conversation
    setTimeout(() => {
      const userMessageId = Date.now().toString();
      const userMessage: Message = {
        id: userMessageId,
        type: "user",
        content: `Research ${companyName}`,
        timestamp: new Date(),
      };

      this.dependencies.setMessages([userMessage]);

      // Add streaming progress message instead of company card immediately
      setTimeout(() => {
        // Start real research using polling service
        console.log('Starting real research for:', companyName);
        
        // Create a messageId for the research
        const messageId = (Date.now() + 1).toString();
        
        console.log('🔧 EventHandlerService: Triggering polling research for:', companyName);
        
        // Use polling service instead of SSE
        this.pollingService.startResearch(messageId, 'company_overview', companyName);
      }, 500);
    }, 200);
  }
}
