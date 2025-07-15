import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  [key: string]: unknown; // Allow additional properties like intelligence, suggestions, etc.
}

interface ChatPersistenceConfig {
  storageKey: string;
  initialMessages?: Message[];
  maxHistorySize?: number;
}

export function useChatPersistence({
  storageKey,
  initialMessages = [],
  maxHistorySize = 100
}: ChatPersistenceConfig) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: Record<string, unknown>) => ({
          ...msg,
          timestamp: new Date(msg.timestamp as string)
        }));
        setMessages(messagesWithDates);
      } else {
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages(initialMessages);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, initialMessages]);

  // Save messages to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      // Limit history size to prevent localStorage from getting too large
      const messagesToSave = messages.slice(-maxHistorySize);
      localStorage.setItem(storageKey, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
      // If storage is full, try to clear some space
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        try {
          // Keep only the last 50 messages
          const reducedMessages = messages.slice(-50);
          localStorage.setItem(storageKey, JSON.stringify(reducedMessages));
        } catch (retryError) {
          console.error('Error saving reduced chat history:', retryError);
        }
      }
    }
  }, [messages, isLoaded, storageKey, maxHistorySize]);

  // Clear chat history
  const clearHistory = () => {
    try {
      localStorage.removeItem(storageKey);
      setMessages(initialMessages);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Check if there's saved history
  const hasSavedHistory = () => {
    try {
      return localStorage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  };

  return {
    messages,
    setMessages,
    clearHistory,
    hasSavedHistory: hasSavedHistory(),
    isLoaded
  };
} 