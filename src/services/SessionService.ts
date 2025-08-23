/**
 * SessionService - Frontend session management
 * 
 * Clean implementation that coordinates with backend:
 * 1. Calls backend to create session after Cognito login
 * 2. Stores sessionId locally for API calls
 * 3. Handles session expiration and logout
 * 4. Provides session info for API middleware
 */

import { Message, CompletedResearch } from "../types/research";
import { getCompanyResearch, saveCompanyResearch } from '../lib/api';
import { API_CONFIG } from '../lib/config';

export interface SessionServiceDependencies {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCompletedResearch: React.Dispatch<React.SetStateAction<CompletedResearch[]>>;
  setCurrentCompany: React.Dispatch<React.SetStateAction<string>>;
  setShowCompanySearch: React.Dispatch<React.SetStateAction<boolean>>;
  setResearchHistory: React.Dispatch<React.SetStateAction<Array<{
    company: string;
    lastUpdated: string;
    completedAreas: number;
    lastActivity?: string;
  }>>>;
  userProfile: any;
  messages: Message[];
  completedResearch: CompletedResearch[];
  currentCompany: string;
}

export class SessionService {
  private dependencies: SessionServiceDependencies;

  constructor(dependencies: SessionServiceDependencies) {
    this.dependencies = dependencies;
  }

  // Load research history from backend (session-based)
  async loadResearchHistory(): Promise<void> {
    try {
      console.log('Loading research history via session...');
      // COMMENTED OUT for testing: const response = await getResearchHistory();
      // console.log('Research history response:', response);
      // this.dependencies.setResearchHistory(response.companies || []);
      console.log('Research history loading COMMENTED OUT for testing');
      this.dependencies.setResearchHistory([]); // Set empty array for testing
    } catch (error) {
      console.error('Failed to load research history:', error);
      this.dependencies.setResearchHistory([]);
    }
  }

  // Load specific company research data
  async loadCompanyResearch(companyName: string): Promise<void> {
    try {
      console.log('Loading company research for:', companyName);
      // setIsLoadingExistingData(true); // Prevent auto-save during loading - COMMENTED OUT
      
      const response = await getCompanyResearch(companyName);
      console.log('Company research response:', response);
      
      // The response structure is {success: true, data: Object}
      // where data contains the actual research data
      const researchData = response.data;
      
      // Always reset messages and completed research first
      this.dependencies.setMessages([]);
      this.dependencies.setCompletedResearch([]);
      
      if (researchData && researchData.messages && researchData.messages.length > 0) {
        // Convert API messages to frontend Message format
        const convertedMessages: Message[] = researchData.messages.map((msg: any) => ({
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
          type: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          sources: msg.sources || undefined,
          options: msg.options || undefined,
          isStreaming: msg.isStreaming || false,
          streamingSteps: msg.streamingSteps || undefined,
          companySummary: msg.companySummary || undefined,
          researchFindings: msg.researchFindings || undefined,
          followUpOptions: msg.followUpOptions || undefined,
          vendorProfile: msg.vendorProfile || undefined
        }));
        this.dependencies.setMessages(convertedMessages);
      } else {
        // No existing messages, create a user message for company selection (like Figma design)
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          type: "user",
          content: `Research ${companyName}`,
          timestamp: new Date(),
        };
        this.dependencies.setMessages([userMessage]);
      }
      
      if (researchData && researchData.completedResearch && researchData.completedResearch.length > 0) {
        // Convert API completed research to frontend format
        const convertedCompletedResearch: CompletedResearch[] = researchData.completedResearch.map((research: any) => ({
          id: research.id || `research-${Date.now()}-${Math.random()}`,
          title: research.title || `${research.researchArea} Research`,
          completedAt: new Date(research.timestamp),
          researchArea: research.researchArea,
          findings: research.findings || { title: '', items: [] }
        }));
        this.dependencies.setCompletedResearch(convertedCompletedResearch);
      }
      
      // Set the current company
      this.dependencies.setCurrentCompany(companyName);
      
      // Hide company search since we have a company selected
      this.dependencies.setShowCompanySearch(false);
      
      // Allow auto-save after data is loaded - COMMENTED OUT
      // setTimeout(() => setIsLoadingExistingData(false), 2000);
      
    } catch (error) {
      console.error('Failed to load company research:', error);
      // setIsLoadingExistingData(false); // COMMENTED OUT for testing
      // If loading fails, show company search
      this.dependencies.setShowCompanySearch(true);
    }
  }

  // Auto-save current research session to backend
  async saveCurrentResearchSession(): Promise<void> {
    if (!this.dependencies.currentCompany || !this.dependencies.userProfile) return;

    try {
      console.log('Saving research session for:', this.dependencies.currentCompany);
      const sessionData = {
        messages: this.dependencies.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date && !isNaN(msg.timestamp.getTime()) 
            ? msg.timestamp.toISOString() 
            : new Date().toISOString(),
        })),
        completedResearch: this.dependencies.completedResearch.map(research => ({
          id: research.id,
          areaId: research.researchArea || research.id,
          title: research.title,
          status: 'completed' as const,
          completedAt: research.completedAt instanceof Date && !isNaN(research.completedAt.getTime())
            ? research.completedAt.toISOString()
            : new Date().toISOString(),
          data: {
            findings: research.findings
          }
        })),
        metadata: {
          userRole: this.dependencies.userProfile.role,
          userCompany: this.dependencies.userProfile.company,
          lastActivity: new Date().toISOString(),
        },
      };

      console.log('Session data to save:', sessionData);
      
      // Save research data to backend
      await saveCompanyResearch(this.dependencies.currentCompany, sessionData);
      console.log('Research session saved successfully');
      
      // Reload research history to include the newly saved session
      // await this.loadResearchHistory();
    } catch (error) {
      console.error('Failed to save research session:', error);
    }
  }

  // Handle session expiry
  async handleSessionExpired(): Promise<void> {
    console.log('Session expired, saving current research data...');
    
    // Save current research session before signing out
    if (this.dependencies.currentCompany && this.dependencies.messages.length > 0) {
      try {
        await this.saveCurrentResearchSession();
        console.log('Research data saved before session expiry');
      } catch (error) {
        console.error('Failed to save research data before session expiry:', error);
        
        // Fallback: save to localStorage
        const pendingData = {
          company: this.dependencies.currentCompany,
          messages: this.dependencies.messages.length,
          completedResearch: this.dependencies.completedResearch.length,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('pending_research_save', JSON.stringify(pendingData));
        console.log('Research data saved to localStorage as fallback');
      }
    }
  }

  // Handle before unload (page refresh/close)
  async handleBeforeUnload(): Promise<void> {
    console.log('Page unload detected, saving research data...');
    
    if (this.dependencies.currentCompany && this.dependencies.messages.length > 0) {
      try {
        await this.saveCurrentResearchSession();
        console.log('Research data saved before page unload');
      } catch (error) {
        console.error('Failed to save research data before page unload:', error);
        
        // Fallback: save to localStorage
        const pendingData = {
          company: this.dependencies.currentCompany,
          messages: this.dependencies.messages.length,
          completedResearch: this.dependencies.completedResearch.length,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('pending_research_save', JSON.stringify(pendingData));
        console.log('Research data saved to localStorage before page unload');
      }
    }
  }

  // Process pending research data from localStorage
  processPendingResearchData(): void {
    const pendingResearchData = localStorage.getItem('pending_research_save');
    if (pendingResearchData) {
      try {
        const data = JSON.parse(pendingResearchData);
        console.log('Research: Found pending research data from previous session:', data);
        
        // Clear the pending data since we've processed it
        localStorage.removeItem('pending_research_save');
        
        // Optionally, we could restore the research session here
        // For now, we'll just log it for debugging
      } catch (error) {
        console.error('Research: Error parsing pending research data:', error);
        localStorage.removeItem('pending_research_save');
      }
    }
  }
}

// Legacy singleton export for backward compatibility with AuthContext
// This maintains the old API while the new SessionService is used for research sessions
class LegacySessionService {
  private static instance: LegacySessionService;
  private readonly SESSION_KEY = 'app_session_id';
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  static getInstance(): LegacySessionService {
    if (!LegacySessionService.instance) {
      LegacySessionService.instance = new LegacySessionService();
    }
    return LegacySessionService.instance;
  }

  async createSession(userContext: any): Promise<string> {
    try {
      console.log('LegacySessionService: Creating session via backend', { userId: userContext.userId });
      
      const response = await fetch(`${this.baseUrl}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_CONFIG.apiKey,
        },
        body: JSON.stringify(userContext),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Session creation failed: ${errorData.error}`);
      }

      const responseData = await response.json();
      const sessionData = responseData.data || responseData;
      
      sessionStorage.setItem(this.SESSION_KEY, sessionData.sessionId);
      
      console.log('LegacySessionService: Session created successfully', { 
        sessionId: sessionData.sessionId,
        expiresIn: sessionData.expiresIn 
      });
      
      return sessionData.sessionId;
    } catch (error) {
      console.error('LegacySessionService: Failed to create session', error);
      throw error;
    }
  }

  getSessionId(): string | null {
    return sessionStorage.getItem(this.SESSION_KEY);
  }

  hasSession(): boolean {
    return this.getSessionId() !== null;
  }

  async destroySession(): Promise<void> {
    const sessionId = this.getSessionId();
    sessionStorage.removeItem(this.SESSION_KEY);
    console.log('LegacySessionService: Local session cleared');

    if (sessionId) {
      try {
        await fetch(`${this.baseUrl}/session/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_CONFIG.apiKey,
          }
        });
        console.log('LegacySessionService: Backend session destroyed');
      } catch (error) {
        console.warn('LegacySessionService: Failed to notify backend of session destruction', error);
      }
    }
  }

  async handleSessionExpiration(): Promise<void> {
    console.log('LegacySessionService: Handling session expiration');
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem('sessionUserId');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    window.dispatchEvent(new CustomEvent('sessionExpired'));
    console.log('LegacySessionService: Session expiration handled, event dispatched');
  }
}

// Export singleton instance for backward compatibility
export const sessionService = LegacySessionService.getInstance();
