export const scrollToBottom = (behavior: ScrollBehavior = "smooth"): void => {
  // Try to find the messages end element that should be placed at the bottom of the messages
  const messagesEndElement = document.querySelector('div[ref="messagesEndRef"]') || 
                            document.querySelector('.messages-end-marker') ||
                            document.querySelector('.message-list-container')?.lastElementChild;
  
  if (messagesEndElement) {
    messagesEndElement.scrollIntoView({ behavior });
  } else {
    // Fallback: scroll to bottom of viewport
    window.scrollTo({ top: document.body.scrollHeight, behavior });
  }
};

export const scrollToUserMessage = (userMessageId: string): void => {
  const userMessageElement = document.querySelector(`[data-message-id="${userMessageId}"]`);
  if (userMessageElement) {
    userMessageElement.scrollIntoView({ 
      behavior: "smooth", 
      block: "start",
      inline: "nearest"
    });
  }
};

export const scrollToStreamingMessage = (): void => {
  console.log("🔄 Scrolling to streaming research message...");
  
  // Wait a bit to ensure streaming message is rendered
  setTimeout(() => {
    // Find the latest streaming message
    const streamingElements = document.querySelectorAll('[data-research-streaming="true"]');
    
    if (streamingElements.length > 0) {
      const latestStreaming = streamingElements[streamingElements.length - 1];
      const container = latestStreaming.closest('.research-message-container');
      
      if (container) {
        console.log("✅ Found streaming message container, scrolling...");
        
        // Get the bounding rect to check current position
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Only scroll if the streaming message is not already well positioned
        if (rect.top < 100 || rect.top > viewportHeight * 0.7) {
          // Scroll to show the streaming progress
          container.scrollIntoView({ 
            behavior: "smooth", 
            block: "center", // Center the streaming message in viewport
            inline: "nearest"
          });
        } else {
          console.log("✅ Streaming message already well positioned");
        }
      } else {
        console.log("⚠️ No container found for streaming message");
        // Fallback: scroll to bottom
        scrollToBottom();
      }
    } else {
      console.log("⚠️ No streaming message found to scroll to");
      // Fallback: scroll to bottom
      scrollToBottom();
    }
  }, 100); // Reduced from 400ms to 100ms for faster scroll response
};

export const scrollToResearchFindings = (): void => {
  console.log("🎯 Scrolling to research findings with user context...");
  
  // Wait a bit to ensure DOM is fully updated
  setTimeout(() => {
    // Find the latest research findings card
    const findingsElements = document.querySelectorAll('[data-research-findings="true"]');
    
    if (findingsElements.length > 0) {
      const latestFindings = findingsElements[findingsElements.length - 1];
      const findingsContainer = latestFindings.closest('.research-message-container');
      
      if (findingsContainer) {
        // Look for the previous user message container
        const allContainers = Array.from(document.querySelectorAll('.research-message-container'));
        const findingsIndex = allContainers.indexOf(findingsContainer);
        
        let targetContainer = findingsContainer;
        
        // If there's a previous container that is a user message, include it in the scroll
        if (findingsIndex > 0) {
          const previousContainer = allContainers[findingsIndex - 1];
          const isUserMessage = previousContainer.getAttribute('data-message-type') === 'user';
          
          if (isUserMessage) {
            console.log("✅ Found user message before findings, scrolling to show both");
            targetContainer = previousContainer;
          }
        }
        
        console.log("✅ Scrolling to show research context...");
        
        // Scroll to show the user message + research findings
        targetContainer.scrollIntoView({ 
          behavior: "smooth", 
          block: "start", // Show from the top to include user context
          inline: "nearest"
        });
      } else {
        console.log("⚠️ No container found for research findings");
        // Fallback: scroll to bottom if container not found
        scrollToBottom();
      }
    } else {
      console.log("⚠️ No research findings found to scroll to");
      // Fallback: scroll to bottom if no findings found
      scrollToBottom();
    }
  }, 100); // Short delay to ensure DOM is ready
};
