/**
 * ResearchPollingService - Smart polling with frontend progress simulation
 * 
 * Implements intelligent polling strategy:
 * 1. Starts with frequent polling (500ms) for first few seconds
 * 2. Gradually increases intervals (1s, 2s, 5s) as research progresses
 * 3. Stops polling when research is complete
 * 4. Uses frontend simulation for smooth progress between polls
 */

import { Message, CompletedResearch } from "../types/research";
import { researchProgressManager } from "../components/research/ResearchProgressManager";
import { scrollToResearchFindings } from "../utils/scroll-utils";
import { startResearchSession, getResearchStatus, getResearchResults } from "../lib/api";
import { getResearchAreas } from "../components/research-content/data/research-areas-data";
import { getFollowUpOptions } from "../components/research-content/data/follow-up-options-data";

export interface ResearchPollingServiceDependencies {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCompletedResearch: React.Dispatch<React.SetStateAction<CompletedResearch[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: any;
  currentCompany: string;
  currentCompanyDomain: string;
}

interface PollingConfig {
  initialInterval: number; // 500ms
  maxInterval: number; // 5s
  backoffMultiplier: number; // 2x
  maxBackoffCount: number; // 3
  maxPollingTime: number; // 5 minutes
  maxPollingAttempts: number; // 60 attempts
}

interface ResearchSession {
  researchSessionId: string;
  areaId: string;
  companyId: string;
  status: string;
  currentStep: string;
  progress: number;
  message: string;
  timestamp: string;
  elapsedTime: number;
  results?: any; // Optional results when research is completed
}

export class ResearchPollingService {
  private dependencies: ResearchPollingServiceDependencies;
  private pollingConfig: PollingConfig;
  private activePolling: Map<string, NodeJS.Timeout> = new Map();
  private progressSimulation: Map<string, NodeJS.Timeout> = new Map();
  private researchMessageIds: Map<string, string> = new Map(); // Store message ID for each research session

  constructor(dependencies: ResearchPollingServiceDependencies) {
    this.dependencies = dependencies;
    this.pollingConfig = {
      initialInterval: 500, // Start with 500ms
      maxInterval: 5000, // Max 5 seconds
      backoffMultiplier: 2,
      maxBackoffCount: 3,
      maxPollingTime: 5 * 60 * 1000, // 5 minutes
      maxPollingAttempts: 60 // 60 attempts
    };
  }

  async startResearch(_messageId: string, researchAreaId: string, companyName?: string, companyDomain?: string) {
    const { setMessages, userProfile, currentCompany, currentCompanyDomain } = this.dependencies;
    // Use domain if available, otherwise fall back to company name
    const targetCompany = companyName || currentCompanyDomain || currentCompany;
    
    if (!userProfile || !targetCompany) {
      console.error('Missing user profile or company for research');
      return;
    }

    try {
      // Step 1: Start research session via POST
      // Get the current values from dependencies (they might have been updated)
      const { currentCompany: updatedCurrentCompany, currentCompanyDomain: updatedCurrentCompanyDomain } = this.dependencies;
      
      // Use the passed companyName as companyId, and use passed domain or fall back to dependencies
      const requestCompanyId = companyName || updatedCurrentCompany;
      const requestCompanyDomain = companyDomain || updatedCurrentCompanyDomain || '';
      
      const sessionResponse = await this.startResearchSession(researchAreaId, requestCompanyId, requestCompanyDomain);
      
      if (!sessionResponse?.researchSessionId) {
        throw new Error('Failed to start research session');
      }

      const { researchSessionId, areaId, companyId } = sessionResponse;

      // Step 2: Initialize progress manager
      researchProgressManager.initialize(setMessages);

      // Step 3: Create initial progress message with simulated steps
      const messageId = researchProgressManager.startNewResearch(
        targetCompany,
        undefined, // onComplete
        this.getSimulatedEventDescriptions(areaId),
        this.getSimulatedEventTypes(areaId),
        this.getSimulatedEventIcons(areaId),
        _messageId
      );

      // Store message ID for this research session
      this.researchMessageIds.set(researchSessionId, messageId);

      // Step 4: Start frontend progress simulation IMMEDIATELY for better UX
      this.startProgressSimulation(researchSessionId, messageId, areaId, companyId);

      // Step 5: Start smart polling in background (with delay to let simulation start)
      setTimeout(() => {
        this.startSmartPolling(researchSessionId, messageId, areaId, companyId);
      }, 500);

    } catch (error) {
      console.error('Failed to start research:', error);
      throw error;
    }
  }

  private async startResearchSession(areaId: string, companyId: string, companyDomain?: string): Promise<any> {
    return await startResearchSession(areaId, companyId, companyDomain);
  }

  private async getResearchStatus(researchSessionId: string): Promise<ResearchSession> {
    return await getResearchStatus(researchSessionId);
  }

  private startSmartPolling(researchSessionId: string, messageId: string, areaId: string, companyId: string) {
    let backoffCount = 0;
    let currentInterval = this.pollingConfig.initialInterval;
    let pollingAttempts = 0;
    const startTime = Date.now();

    const poll = async () => {
      // Check timeout conditions
      const elapsedTime = Date.now() - startTime;
      pollingAttempts++;

      if (elapsedTime > this.pollingConfig.maxPollingTime) {
        console.error('❌ Polling timeout reached:', {
          researchSessionId,
          elapsedTime: Math.round(elapsedTime / 1000),
          maxTime: Math.round(this.pollingConfig.maxPollingTime / 1000)
        });
        this.stopPolling(researchSessionId);
        this.stopProgressSimulation(researchSessionId);
        this.handlePollingError(researchSessionId, 'Research polling timed out after 5 minutes');
        return;
      }

      if (pollingAttempts > this.pollingConfig.maxPollingAttempts) {
        console.error('❌ Max polling attempts reached:', {
          researchSessionId,
          attempts: pollingAttempts,
          maxAttempts: this.pollingConfig.maxPollingAttempts
        });
        this.stopPolling(researchSessionId);
        this.stopProgressSimulation(researchSessionId);
        this.handlePollingError(researchSessionId, 'Research polling exceeded maximum attempts');
        return;
      }

      try {
        const status = await this.getResearchStatus(researchSessionId);
        

        // Only check for completion - let simulation handle progress updates
        if (status.status === 'completed' || 
            (status.message && status.message.includes('✅ Research completed successfully'))) {
          
          // Tell simulation to complete the final step
          this.completeSimulation(researchSessionId, messageId);
          
          // Stop polling
          this.stopPolling(researchSessionId);
          
          // Handle completion
          await this.handleResearchComplete(researchSessionId, areaId, companyId);
          return;
        }

        // Continue polling with backoff
        backoffCount++;
        if (backoffCount <= this.pollingConfig.maxBackoffCount) {
          currentInterval = Math.min(
            currentInterval * this.pollingConfig.backoffMultiplier,
            this.pollingConfig.maxInterval
          );
        }

        const timeoutId = setTimeout(poll, currentInterval);
        this.activePolling.set(researchSessionId, timeoutId);

      } catch (error) {
        console.error('Polling error:', error);
        // Continue polling even on error, but with max interval
        const timeoutId = setTimeout(poll, this.pollingConfig.maxInterval);
        this.activePolling.set(researchSessionId, timeoutId);
      }
    };

    // Start first poll
    const timeoutId = setTimeout(poll, currentInterval);
    this.activePolling.set(researchSessionId, timeoutId);
  }

  private startProgressSimulation(researchSessionId: string, messageId: string, areaId: string, companyId: string) {
    const steps = this.getSimulatedEventTypes(areaId);
    let currentStepIndex = 0;

    const simulateProgress = () => {
      // Check if polling has stopped (indicating completion)
      if (!this.activePolling.has(researchSessionId)) {
        return;
      }

      if (currentStepIndex < steps.length - 1) { // Stop before the last step
        const step = steps[currentStepIndex];
        
        // Update progress with simulated data
        researchProgressManager.handlePollingUpdate(
          step,
          this.getSimulatedMessage(step, companyId),
          messageId,
          this.dependencies.setMessages
        );

        currentStepIndex++;
        
        // Continue simulation with intervals for better UX
        const timeoutId = setTimeout(simulateProgress, 1000); // 1s between simulated steps
        this.progressSimulation.set(researchSessionId, timeoutId);
      }
    };

    // Start simulation after a short delay
    const timeoutId = setTimeout(simulateProgress, 1000);
    this.progressSimulation.set(researchSessionId, timeoutId);
  }

  private completeSimulation(researchSessionId: string, messageId: string) {
    
    // Complete the final step (but don't set completion message here)
    researchProgressManager.handlePollingUpdate(
      'research_complete',
      '',  // Empty string instead of "Finalizing research for adidas..."
      messageId,
      this.dependencies.setMessages
    );
    
    // Complete the progress (hide progress component and set completion message)
    researchProgressManager.completeProgress();
    
    // Stop the simulation
    this.stopProgressSimulation(researchSessionId);
  }

  private stopPolling(researchSessionId: string) {
    const timeoutId = this.activePolling.get(researchSessionId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.activePolling.delete(researchSessionId);
    }
  }

  private stopProgressSimulation(researchSessionId: string) {
    const timeoutId = this.progressSimulation.get(researchSessionId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.progressSimulation.delete(researchSessionId);
    }
  }

  private handlePollingError(researchSessionId: string, errorMessage: string) {
    console.error('❌ Polling error:', { researchSessionId, errorMessage });
    
    // Add error message to UI
    this.dependencies.setMessages((prev: Message[]) => [...prev, {
      id: Date.now().toString(),
      type: "assistant",
      content: `❌ ${errorMessage}`,
      timestamp: new Date(),
    }]);
    
    this.dependencies.setIsTyping(false);
  }

  private async handleResearchComplete(researchSessionId: string, areaId: string, companyId: string) {
    const { setCompletedResearch, setIsTyping, setMessages } = this.dependencies;


    try {
      // Get final research results using the centralized API function
      const researchData = await getResearchResults(researchSessionId);
      
      // Get the message ID for this research session
      const messageId = this.researchMessageIds.get(researchSessionId);
      if (!messageId) {
        return;
      }

      // Update the message based on research area type
      setMessages((prev: Message[]) => prev.map(message => {
        if (message.id === messageId) {
          const updatedMessage = {
            ...message,
            sources: researchData.sources || [],
            // Clear any completion message content - let the research results be the final display
            content: message.content
              .replace('🔍 Researching ', '')
              .replace('...', '')
              .trim()
          };

          // For company_overview, add companySummary
          if (areaId === 'company_overview') {
            updatedMessage.companySummary = this.formatCompanySummary(researchData, companyId);
          } else {
            // For all other research areas, add researchFindings
            updatedMessage.researchFindings = this.formatResearchFindings(researchData, areaId, companyId);
          }

          return updatedMessage;
        }
        return message;
      }));

      // Add to completed research
      setCompletedResearch((prev: CompletedResearch[]) => [...prev, {
        id: researchSessionId,
        title: `${areaId} Research - ${companyId}`,
        areaId,
        companyId,
        data: researchData,
        timestamp: new Date(),
        completedAt: new Date(),
        findings: researchData,
        userProfile: this.dependencies.userProfile
      }]);

      // Scroll to research findings FIRST (before adding follow-up messages)
      setTimeout(() => {
        scrollToResearchFindings();
      }, 500);

      // Add appropriate follow-up message based on research area type (after scrolling)
      setTimeout(() => {
        if (areaId === 'company_overview') {
          // For company_overview, add initial research areas message
          const researchAreas = getResearchAreas(companyId, this.dependencies.userProfile?.role || "Account Manager", this.dependencies.userProfile?.company);
          
          const researchAreasMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "assistant",
            content: researchAreas.intro,
            timestamp: new Date(),
            options: researchAreas.options
          };

          setMessages((prev: Message[]) => [...prev, researchAreasMessage]);
        } else {
          // For other research areas, add follow-up options message
          const followUpOptions = getFollowUpOptions(areaId);
          
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "assistant",
            content: "What would you like to do next?",
            timestamp: new Date(),
            followUpOptions: followUpOptions
          };

          setMessages((prev: Message[]) => [...prev, followUpMessage]);
        }
      }, 1000); // Delay follow-up messages to allow scroll to complete

      setIsTyping(() => false);

    } catch (error) {
      console.error('❌ Failed to handle research completion:', error);
    }
  }

  // Cleanup method to stop all active polling
  cleanup() {
    this.activePolling.forEach((timeoutId) => clearTimeout(timeoutId));
    this.activePolling.clear();
    
    this.progressSimulation.forEach((timeoutId) => clearTimeout(timeoutId));
    this.progressSimulation.clear();
  }

  // Simulated data for frontend progress
  private getSimulatedEventTypes(areaId: string): string[] {
    const eventTypesMap: Record<string, string[]> = {
      'company_overview': ['research_started', 'data_gathering', 'analysis_in_progress', 'synthesis_complete', 'research_complete'],
      'decision_makers': ['research_started', 'data_gathering', 'analysis_in_progress', 'synthesis_complete', 'research_complete'],
      'key_contacts': ['research_started', 'data_gathering', 'analysis_in_progress', 'synthesis_complete', 'research_complete']
    };
    
    return eventTypesMap[areaId] || eventTypesMap['company_overview'];
  }

  private getSimulatedEventDescriptions(areaId: string): Record<string, string> {
    const descriptionsMap: Record<string, Record<string, string>> = {
      'company_overview': {
        'research_started': '🚀 Starting company overview research...',
        'data_gathering': '📡 Gathering comprehensive company information...',
        'analysis_in_progress': '🧠 AI is analyzing and synthesizing the data...',
        'synthesis_complete': '✨ Analysis complete, preparing your summary...',
        'research_complete': '✅ Company overview research completed successfully'
      },
      'decision_makers': {
        'research_started': '🚀 Starting decision makers research...',
        'data_gathering': '📡 Gathering leadership and contact information...',
        'analysis_in_progress': '🧠 AI is analyzing decision maker profiles...',
        'synthesis_complete': '✨ Analysis complete, preparing contact list...',
        'research_complete': '✅ Decision makers research completed successfully'
      },
      'key_contacts': {
        'research_started': '🚀 Starting key contacts research...',
        'data_gathering': '📡 Gathering contact and relationship data...',
        'analysis_in_progress': '🧠 AI is analyzing contact networks...',
        'synthesis_complete': '✨ Analysis complete, preparing contact insights...',
        'research_complete': '✅ Key contacts research completed successfully'
      }
    };
    
    return descriptionsMap[areaId] || descriptionsMap['company_overview'];
  }

  private getSimulatedEventIcons(areaId: string): Record<string, string> {
    const iconsMap: Record<string, Record<string, string>> = {
      'company_overview': {
        'research_started': '🚀',
        'data_gathering': '📡',
        'analysis_in_progress': '🧠',
        'synthesis_complete': '✨',
        'research_complete': '✅'
      },
      'decision_makers': {
        'research_started': '🚀',
        'data_gathering': '📡',
        'analysis_in_progress': '🧠',
        'synthesis_complete': '✨',
        'research_complete': '✅'
      },
      'key_contacts': {
        'research_started': '🚀',
        'data_gathering': '📡',
        'analysis_in_progress': '🧠',
        'synthesis_complete': '✨',
        'research_complete': '✅'
      }
    };
    
    return iconsMap[areaId] || iconsMap['company_overview'];
  }

  private getSimulatedMessage(step: string, companyId: string): string {
    const messages: Record<string, string> = {
      'research_started': `🚀 Starting research for ${companyId}...`,
      'data_gathering': `📡 Gathering comprehensive information about ${companyId}...`,
      'analysis_in_progress': `🧠 AI is analyzing and synthesizing the information...`,
      'synthesis_complete': `✨ Analysis complete, preparing your research summary...`,
      'research_complete': `✅ Research completed successfully for ${companyId}`
    };
    
    return messages[step] || `Processing ${step}...`;
  }

  private formatResearchFindings(researchData: any, areaId: string, companyId: string) {
    // Format research data for ResearchFindingsCard component
    return {
      title: `${areaId.replace('_', ' ').toUpperCase()} Research - ${companyId}`,
      researchAreaId: areaId,
      items: researchData.findings || researchData.items || []
    };
  }

  private formatCompanySummary(researchData: any, companyId: string) {
    // Format research data for CompanySummaryCard component
    return {
      name: researchData.name || companyId,
      industry: researchData.industry || 'Technology',
      size: researchData.size || 'Enterprise',
      location: researchData.location || 'United States',
      recentNews: researchData.recentNews || 'Company overview completed',
      techStack: researchData.techStack || [],
      founded: researchData.founded || 'Unknown',
      revenue: researchData.revenue || 'Unknown',
      businessModel: researchData.businessModel,
      marketPosition: researchData.marketPosition,
      growthStage: researchData.growthStage,
      keyExecutives: researchData.keyExecutives || [],
      businessMetrics: researchData.businessMetrics || {},
      recentDevelopments: researchData.recentDevelopments || [],
      competitiveContext: researchData.competitiveContext || {}
    };
  }
}
