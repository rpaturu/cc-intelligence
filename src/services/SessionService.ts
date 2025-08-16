/**
 * SessionService - Frontend session management
 * 
 * Clean implementation that coordinates with backend:
 * 1. Calls backend to create session after Cognito login
 * 2. Stores sessionId locally for API calls
 * 3. Handles session expiration and logout
 * 4. Provides session info for API middleware
 */

import { API_CONFIG } from '../lib/config';

export interface UserContext {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface SessionResponse {
  sessionId: string;
  message: string;
  expiresIn: string;
  requestId: string;
}

export class SessionService {
  private static instance: SessionService;
  private readonly SESSION_KEY = 'app_session_id';
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  /**
   * Create session via backend API after Cognito authentication
   */
  async createSession(userContext: UserContext): Promise<string> {
    try {
      console.log('SessionService: Creating session via backend', { userId: userContext.userId });
      
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

      const data: SessionResponse = await response.json();
      
      // Store sessionId locally for API calls
      sessionStorage.setItem(this.SESSION_KEY, data.sessionId);
      
      console.log('SessionService: Session created successfully', { 
        sessionId: data.sessionId,
        expiresIn: data.expiresIn 
      });
      
      return data.sessionId;
    } catch (error) {
      console.error('SessionService: Failed to create session', error);
      throw error;
    }
  }

  /**
   * Get current sessionId for API calls
   */
  getSessionId(): string | null {
    return sessionStorage.getItem(this.SESSION_KEY);
  }

  /**
   * Check if user has an active session
   */
  hasSession(): boolean {
    return this.getSessionId() !== null;
  }

  /**
   * Destroy session (logout)
   */
  async destroySession(): Promise<void> {
    const sessionId = this.getSessionId();
    
    // Clear local session immediately
    sessionStorage.removeItem(this.SESSION_KEY);
    console.log('SessionService: Local session cleared');

    // Notify backend to destroy session
    if (sessionId) {
      try {
        await fetch(`${this.baseUrl}/session/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_CONFIG.apiKey,
          },
        });
        console.log('SessionService: Backend session destroyed');
      } catch (error) {
        console.warn('SessionService: Failed to notify backend of session destruction', error);
        // Don't throw error as local session is already cleared
      }
    }
  }

  /**
   * Handle session expiration (called when receiving 401 from API)
   */
  async handleSessionExpiration(): Promise<void> {
    console.log('SessionService: Handling session expiration');
    
    // Clear local session
    sessionStorage.removeItem(this.SESSION_KEY);
    
    // Could emit event for components to handle logout
    window.dispatchEvent(new CustomEvent('sessionExpired'));
  }

  /**
   * Validate session with backend (optional - for debugging)
   */
  async validateSession(): Promise<boolean> {
    const sessionId = this.getSessionId();
    if (!sessionId) return false;

    try {
      const response = await fetch(`${this.baseUrl}/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_CONFIG.apiKey,
        },
      });

      return response.ok;
    } catch (error) {
      console.warn('SessionService: Session validation failed', error);
      return false;
    }
  }
}

// Export singleton instance
export const sessionService = SessionService.getInstance();
