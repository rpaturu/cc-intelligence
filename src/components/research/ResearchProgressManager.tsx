import { StreamingStep, Message } from "../../types/research";
import { SSEProgressMapper, BackendEventDescriptions, BackendEventIcons } from "../../services/progress/SSEProgressMapper";

export interface ProgressState {
  isActive: boolean;
  currentStep: number;
  steps: StreamingStep[];
  messageId: string | null;
  content: string;
  collectedData?: any;
  isCompleted?: boolean;
}

export class ResearchProgressManager {
  private progressState: ProgressState = {
    isActive: false,
    currentStep: 0,
    steps: [],
    messageId: null,
    content: "",
    collectedData: undefined,
    isCompleted: false
  };

  private setMessages: ((updater: (prev: Message[]) => Message[]) => void) | null = null;
  private onComplete: (() => void) | null = null;

  constructor() { }

  // Initialize the progress manager with message setter
  initialize(setMessages: (updater: (prev: Message[]) => Message[]) => void) {
    this.setMessages = setMessages;
  }

  // Start new research progress
  startNewResearch(
    companyName: string,
    onComplete?: () => void,
    backendEventDescriptions?: BackendEventDescriptions,
    backendEventTypes?: string[],
    backendEventIcons?: BackendEventIcons,
    existingMessageId?: string
  ): string {
    const messageId = existingMessageId || (Date.now() + 1).toString();
    this.onComplete = onComplete || null;

    if (backendEventDescriptions && backendEventTypes && backendEventIcons) {
      // Create all steps using backend data
      const streamingSteps = backendEventTypes.map(eventType => ({
        text: backendEventDescriptions[eventType] || `Processing ${eventType}...`,
        iconName: backendEventIcons[eventType] || 'circle',
        completed: false
      }));

      // CRITICAL: Create streaming message with actual steps (no placeholder to replace)
      if (streamingSteps.length === 0) {
        return messageId;
      }

      const streamingMessage: Message = {
        id: messageId,
        type: "assistant",
        content: `🔍 Researching ${companyName}...`,
        timestamp: new Date(),
        isStreaming: true,
        streamingSteps
      };

      // Create the streaming message (no replacement needed)
      this.setMessages?.(prev => [...prev, streamingMessage]);

      this.progressState = {
        isActive: true,
        currentStep: 0,
        steps: streamingSteps,
        messageId,
        content: "Researching company overview..."
      };
    } else {
      // Don't create any message - wait for SSE events to provide actual data
      // This prevents empty progress component flash
      this.progressState = {
        isActive: true,
        currentStep: 0,
        steps: [],
        messageId,
        content: "Researching company overview..."
      };
    }

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

  // Handle SSE events and update progress accordingly
  handleSSEEvent(eventType: string, eventData: any, messageId: string, _setMessages: any, backendEventTypes?: string[]) {
    if (!this.progressState.isActive || this.progressState.messageId !== messageId) {
      return;
    }

    // FIXED APPROACH: Only update existing steps, don't create new ones
    const stepIndex = SSEProgressMapper.getStepIndexForEvent(eventType, backendEventTypes);

    if (stepIndex !== -1 && this.progressState.steps && stepIndex < this.progressState.steps.length) {
      this.updateProgressStep(stepIndex, true);
    }

    // Store collected data for research completion
    if (eventType === 'research_findings') {
      this.progressState.collectedData = eventData;
    }

    // Handle completion
    if (eventType === 'research_complete') {
      this.completeProgress();
    }
  }

  // Handle polling updates from backend
  handlePollingUpdate(
    currentStep: string,
    message: string,
    messageId: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) {


    if (!this.progressState.isActive || this.progressState.messageId !== messageId) {
      return;
    }

    // Find the step index for the current step
    const stepIndex = this.progressState.steps.findIndex(step => 
      step.text.toLowerCase().includes(currentStep.toLowerCase()) ||
      step.text.toLowerCase().includes('research') && currentStep === 'research_started' ||
      step.text.toLowerCase().includes('gathering') && currentStep === 'data_gathering' ||
      step.text.toLowerCase().includes('analyzing') && currentStep === 'analysis_in_progress' ||
      step.text.toLowerCase().includes('complete') && currentStep === 'synthesis_complete' ||
      step.text.toLowerCase().includes('completed') && currentStep === 'research_complete'
    );

    if (stepIndex !== -1) {
      // Update the current step and all previous steps as completed
      this.updateProgressStep(stepIndex, true);
      
      // Update message content with the new message
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: message }
          : msg
      ));
    }

    // Note: Completion is handled by ResearchPollingService, not here
    // This method only handles progress updates
  }

  // Complete the progress
  completeProgress() {
    if (!this.progressState.isActive || !this.progressState.messageId) {
      return;
    }

    // Prevent double completion
    if (this.progressState.isCompleted) {
      return;
    }

    // Update the message to hide the progress component completely
    this.setMessages?.(prev => prev.map(msg =>
      msg.id === this.progressState.messageId
        ? { 
            ...msg, 
            isStreaming: false,
            streamingSteps: [], // Use empty array instead of undefined to ensure length check fails
            // Clear any completion messages - let the research results be the final display
            content: msg.content
              .replace('🔍 Researching ', '')
              .replace('...', '')
              .trim()
          }
        : msg
    ));

    this.progressState.isActive = false;
    this.progressState.isCompleted = true;
    this.onComplete?.();
  }

  // Get current progress state
  getProgressState(): ProgressState {
    return { ...this.progressState };
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
}

// Export a singleton instance
export const researchProgressManager = new ResearchProgressManager();
