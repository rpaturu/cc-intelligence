import { StreamingStep, Message } from "../../types/research";

export const getCompanyResearchSteps = (companyName: string): StreamingStep[] => {
  return [
    { 
      text: `🎯 Mapping ${companyName} organizational structure`, 
      iconName: "target", 
      completed: false 
    },
    { 
      text: `🔍 Scanning LinkedIn and company directory`, 
      iconName: "search", 
      completed: false 
    },
    { 
      text: `📊 Analyzing recent leadership changes`, 
      iconName: "bar-chart-3", 
      completed: false 
    },
    { 
      text: `👥 Identifying key stakeholders`, 
      iconName: "users", 
      completed: false 
    },
    { 
      text: `✅ Company profile complete - found key insights`, 
      iconName: "check-circle", 
      completed: false 
    }
  ];
};

export const simulateCompanyResearch = (
  messageId: string,
  companyName: string,
  setMessages: any,
  onComplete: () => void
) => {
  const steps = getCompanyResearchSteps(companyName);
  const streamingSteps = steps.map(step => ({ ...step, completed: false }));
  
  // Set the message to streaming with steps
  setMessages((prev: Message[]) => prev.map((msg: Message) => 
    msg.id === messageId 
      ? { ...msg, isStreaming: true, streamingSteps }
      : msg
  ));

  // Complete each step progressively
  steps.forEach((_, index) => {
    setTimeout(() => {
      setMessages((prev: Message[]) => prev.map((msg: Message) => 
        msg.id === messageId && msg.streamingSteps
          ? {
              ...msg,
              streamingSteps: msg.streamingSteps.map((step: StreamingStep, i: number) => 
                i === index ? { ...step, completed: true } : step
              )
            }
          : msg
      ));
    }, (index + 1) * 1000); // Each step takes 1 second
  });

  // Complete the streaming after all steps
  setTimeout(() => {
    // Just call completion callback - let the API handle the final message state
    onComplete();
  }, steps.length * 1000 + 500);
};

export const simulateHistoryLoading = (
  messageId: string,
  setMessages: any,
  onComplete: () => void
) => {
  // Don't override the streaming steps - they're already set correctly for history loading
  // Just animate the existing steps to completion
  
  // Get the current message to find how many steps it has
  let currentSteps: StreamingStep[] = [];
  setMessages((prev: Message[]) => {
    const msg = prev.find(m => m.id === messageId);
    if (msg && msg.streamingSteps) {
      currentSteps = msg.streamingSteps;
    }
    return prev;
  });

  // Complete each step progressively
  currentSteps.forEach((_, index) => {
    setTimeout(() => {
      setMessages((prev: Message[]) => prev.map((msg: Message) => 
        msg.id === messageId && msg.streamingSteps
          ? {
              ...msg,
              streamingSteps: msg.streamingSteps.map((step: StreamingStep, i: number) => 
                i === index ? { ...step, completed: true } : step
              )
            }
          : msg
      ));
    }, (index + 1) * 1000); // Each step takes 1 second
  });

  // Complete the streaming after all steps
  setTimeout(() => {
    // Just call completion callback
    onComplete();
  }, currentSteps.length * 1000 + 500);
};
