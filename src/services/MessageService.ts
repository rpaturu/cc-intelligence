/**
 * MessageService
 * 
 * Handles all message-related operations in the research flow:
 * 1. Message creation and formatting
 * 2. Message state management
 * 3. Message timestamp handling
 * 4. Message type definitions and utilities
 * 
 * Extracted from Research.tsx to reduce file size and improve separation of concerns
 */

import { Message } from "../types/research";
import { scrollToBottom, scrollToUserMessage } from "../utils/scroll-utils";
import { getStreamingSteps } from "../utils/research-utils";

export interface MessageServiceDependencies {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setActiveTabsState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setHighlightedSource: React.Dispatch<React.SetStateAction<number | null>>;
  messages: Message[];
  currentCompany: string;
}

export class MessageService {
  private dependencies: MessageServiceDependencies;

  constructor(dependencies: MessageServiceDependencies) {
    this.dependencies = dependencies;
  }

  /**
   * Create a user message with timestamp
   */
  createUserMessage(content: string): Message {
    return {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
  }

  /**
   * Create an assistant message with timestamp
   */
  createAssistantMessage(content: string, options?: {
    followUpOptions?: any[];
    companySummary?: any;
    researchFindings?: any;
    isStreaming?: boolean;
    streamingSteps?: any[];
  }): Message {
    const messageId = (Date.now() + 1).toString();
    
    return {
      id: messageId,
      type: "assistant",
      content,
      timestamp: new Date(),
      ...options
    };
  }

  /**
   * Create a streaming message for research
   */
  createStreamingMessage(company: string, researchArea: string): Message {
    const messageId = (Date.now() + 1).toString();
    
    // Get streaming steps for the research area
    const steps = getStreamingSteps(researchArea);
    const streamingSteps = steps.map(step => ({ ...step, completed: false }));

    return {
      id: messageId,
      type: "assistant",
      content: `🔍 Researching ${company}...`,
      timestamp: new Date(),
      isStreaming: true,
      streamingSteps
    };
  }

  /**
   * Create a simple research analysis message
   */
  createAnalysisMessage(analysisText: string): Message {
    const messageId = (Date.now() + 1).toString();
    
    return {
      id: messageId,
      type: "assistant",
      content: analysisText,
      timestamp: new Date(),
    };
  }

  /**
   * Create a user message for company research
   */
  createCompanyResearchMessage(companyName: string): Message {
    return {
      id: Date.now().toString(),
      type: "user",
      content: `Research ${companyName}`,
      timestamp: new Date(),
    };
  }

  /**
   * Add a message to the messages state
   */
  addMessage(message: Message): void {
    this.dependencies.setMessages(prev => [...prev, message]);
  }

  /**
   * Add multiple messages to the messages state
   */
  addMessages(messages: Message[]): void {
    this.dependencies.setMessages(prev => [...prev, ...messages]);
  }

  /**
   * Replace all messages
   */
  setMessages(messages: Message[]): void {
    this.dependencies.setMessages(messages);
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.dependencies.setMessages([]);
  }

  /**
   * Format message timestamps for display
   */
  formatMessageTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Convert backend message format to frontend format
   */
  formatBackendMessage(backendMessage: any): Message {
    return {
      ...backendMessage,
      timestamp: new Date(backendMessage.timestamp),
    };
  }

  /**
   * Convert multiple backend messages to frontend format
   */
  formatBackendMessages(backendMessages: any[]): Message[] {
    return backendMessages.map(msg => this.formatBackendMessage(msg));
  }

  /**
   * Handle message scrolling logic
   */
  handleMessageScrolling(): void {
    if (this.dependencies.messages.length > 0) {
      const lastMessage = this.dependencies.messages[this.dependencies.messages.length - 1];

      // For company summaries, scroll to show the user's question at the top
      if (lastMessage.type === "assistant" && lastMessage.companySummary) {
        // Find the corresponding user message (should be second to last)
        const userMessage = this.dependencies.messages[this.dependencies.messages.length - 2];
        if (userMessage && userMessage.type === "user") {
          setTimeout(() => {
            scrollToUserMessage(userMessage.id);
          }, 500); // Longer delay to ensure company card is fully rendered
        }
      }
      // For simple assistant responses (NO research-related scrolling here)
      else if (lastMessage.type === "assistant" && !lastMessage.companySummary && !lastMessage.options) {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    }
  }

  /**
   * Handle citation clicks
   */
  handleCitationClick(messageId: string, sourceId: number): void {
    console.log("🔗 Citation clicked! MessageId:", messageId, "SourceId:", sourceId);

    this.dependencies.setActiveTabsState(prev => {
      const newState = {
        ...prev,
        [messageId]: "sources"
      };
      console.log("📱 Setting active tab state:", newState);
      return newState;
    });

    this.dependencies.setHighlightedSource(sourceId);
    console.log("✨ Highlighting source:", sourceId);

    setTimeout(() => {
      this.dependencies.setHighlightedSource(null);
      console.log("🔄 Removing highlight for source:", sourceId);
    }, 3000);
  }

  /**
   * Get the last message
   */
  getLastMessage(): Message | null {
    const messages = this.dependencies.messages;
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }

  /**
   * Get messages by type
   */
  getMessagesByType(type: "user" | "assistant"): Message[] {
    return this.dependencies.messages.filter(msg => msg.type === type);
  }

  /**
   * Count messages by type
   */
  countMessagesByType(type: "user" | "assistant"): number {
    return this.dependencies.messages.filter(msg => msg.type === type).length;
  }

  /**
   * Find message by ID
   */
  findMessageById(id: string): Message | undefined {
    return this.dependencies.messages.find(msg => msg.id === id);
  }

  /**
   * Update a specific message
   */
  updateMessage(messageId: string, updates: Partial<Message>): void {
    this.dependencies.setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }

  /**
   * Remove a message by ID
   */
  removeMessage(messageId: string): void {
    this.dependencies.setMessages(prev => 
      prev.filter(msg => msg.id !== messageId)
    );
  }

  /**
   * Create standard follow-up options
   */
  createStandardFollowUpOptions(): any[] {
    return [
      { id: "research_another", text: "Research another company", iconName: "Search", category: "explore" },
      { id: "export_report", text: "View Full Report", iconName: "Eye", category: "action" },
      { id: "schedule_followup", text: "Schedule follow-up research", iconName: "Calendar", category: "action" }
    ];
  }

  /**
   * Create research area message with follow-up options
   */
  createResearchAreaMessage(optionText: string): Message {
    const messageId = (Date.now() + 1).toString();
    
    return {
      id: messageId,
      type: "assistant",
      content: `🔍 Analyzing ${optionText.toLowerCase()}...`,
      timestamp: new Date(),
    };
  }
}
