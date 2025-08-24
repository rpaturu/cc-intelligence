import { StreamingStep, Message } from "../../types/research";
import { SSEProgressMapper, BackendEventDescriptions, BackendEventIcons } from "../../services/progress/SSEProgressMapper";

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
    console.log('⏰ TIMING: ResearchProgressManager.startNewResearch called at:', new Date().toISOString() + '.' + new Date().getMilliseconds().toString().padStart(3, '0'), {
      companyName,
      hasBackendDescriptions: !!backendEventDescriptions,
      hasBackendEventTypes: !!backendEventTypes,
      hasBackendEventIcons: !!backendEventIcons,
      existingMessageId
    });
    const messageId = existingMessageId || (Date.now() + 1).toString();
    this.onComplete = onComplete || null;

    if (backendEventDescriptions && backendEventTypes && backendEventIcons) {
      console.log('⏰ TIMING: Creating streaming message with steps at:', new Date().toISOString() + '.' + new Date().getMilliseconds().toString().padStart(3, '0'), {
        stepsCount: backendEventTypes.length
      });

      // Create all steps using backend data
      const streamingSteps = backendEventTypes.map(eventType => ({
        text: backendEventDescriptions[eventType] || `Processing ${eventType}...`,
        iconName: backendEventIcons[eventType] || 'circle',
        completed: false
      }));

      // CRITICAL: Create streaming message with actual steps (no placeholder to replace)
      if (streamingSteps.length === 0) {
        console.log('🚫 ResearchProgressManager: No steps to create, skipping streaming message creation');
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
      this.setMessages?.(prev => {
        console.log('⏰ TIMING: Message creation triggered at:', new Date().toISOString() + '.' + new Date().getMilliseconds().toString().padStart(3, '0'), {
          messageId,
          streamingStepsCount: streamingSteps.length,
          willCreateMessage: true
        });
        return [...prev, streamingMessage];
      });

      this.progressState = {
        isActive: true,
        currentStep: 0,
        steps: streamingSteps,
        messageId,
        content: "Researching company overview..."
      };
    } else {
      console.log('🔧 ResearchProgressManager: No backend data available, waiting for SSE events - NO MESSAGE CREATED');
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
    console.log('🔧 ResearchProgressManager.handleSSEEvent called:', {
      eventType,
      messageId,
      isActive: this.progressState.isActive,
      currentMessageId: this.progressState.messageId,
      eventMessage: eventData.message,
      hasSteps: !!this.progressState.steps,
      stepsLength: this.progressState.steps?.length || 0,
      backendEventTypes
    });

    if (!this.progressState.isActive || this.progressState.messageId !== messageId) {
      console.log('❌ ResearchProgressManager.handleSSEEvent: Conditions not met, returning early');
      return;
    }

    // FIXED APPROACH: Only update existing steps, don't create new ones
    const stepIndex = SSEProgressMapper.getStepIndexForEvent(eventType, backendEventTypes);
    console.log('🎯 ResearchProgressManager.handleSSEEvent: Event mapping:', { eventType, stepIndex });

    if (stepIndex !== -1 && this.progressState.steps && stepIndex < this.progressState.steps.length) {
      console.log('✅ ResearchProgressManager.handleSSEEvent: Updating progress step', stepIndex, 'with SSE message:', eventData.message);
      this.updateProgressStep(stepIndex, true);
    } else {
      console.log('❌ ResearchProgressManager.handleSSEEvent: Step not found or out of bounds for event', eventType, 'stepIndex:', stepIndex);
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
    console.log('🔧 updateProgressStep called:', { stepIndex, completed, hasMessageId: !!this.progressState.messageId, hasSetMessages: !!this.setMessages });

    if (!this.progressState.messageId || !this.setMessages) {
      console.log('❌ updateProgressStep: Missing requirements - messageId:', !!this.progressState.messageId, 'setMessages:', !!this.setMessages);
      return;
    }

    console.log('✅ updateProgressStep: Updating messages...');
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
    console.log('✅ updateProgressStep: Step', stepIndex, 'marked as completed');
  }
}

// Export a singleton instance
export const researchProgressManager = new ResearchProgressManager();
