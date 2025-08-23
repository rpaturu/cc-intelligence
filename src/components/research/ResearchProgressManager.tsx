import { StreamingStep, Message } from "../../types/research";

export interface ProgressState {
  isActive: boolean;
  currentStep: number;
  steps: StreamingStep[];
  messageId: string | null;
  content: string;
}

export class ResearchProgressManager {
  private progressState: ProgressState = {
    isActive: false,
    currentStep: 0,
    steps: [],
    messageId: null,
    content: ""
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

  // Handle SSE progress updates
  handleSSEProgressUpdate(eventData: any) {
    if (!this.progressState.isActive || !this.progressState.messageId) {
      return;
    }

    // Update progress based on SSE event type
    switch (eventData.type) {
      case 'collection_started':
        this.updateProgressStep(0, true);
        this.updateContent("Starting research collection...");
        break;
      case 'progress_update':
        this.updateProgressStep(1, true);
        this.updateContent(`Progress: ${eventData.progress}% - ${eventData.currentStep}`);
        break;
      case 'sources_found':
        this.updateProgressStep(2, true);
        this.updateContent("Found relevant data sources...");
        break;
      case 'research_findings':
        this.updateProgressStep(3, true);
        this.updateContent("Compiling research findings...");
        break;
      case 'research_complete':
        this.completeProgress();
        break;
    }
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
