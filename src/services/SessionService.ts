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
import { getApiHeaders } from '../utils/apiHeaders';

export interface UserContext {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
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
      
      const headers = getApiHeaders({
        contentType: 'application/json',
        includeSession: false, // No session yet for session creation
        additionalHeaders: {
          'X-API-Key': API_CONFIG.apiKey,
        }
      });
      
      const response = await fetch(`${this.baseUrl}/session`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userContext),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Session creation failed: ${errorData.error}`);
      }

      const responseData = await response.json();
      
      // Extract session data from the nested response structure
      const sessionData = responseData.data || responseData;
      
      // Store sessionId locally for API calls
      sessionStorage.setItem(this.SESSION_KEY, sessionData.sessionId);
      
      console.log('SessionService: Session created successfully', { 
        sessionId: sessionData.sessionId,
        expiresIn: sessionData.expiresIn 
      });
      
      return sessionData.sessionId;
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
        const headers = getApiHeaders({
          contentType: 'application/json',
          includeSession: false, // No session needed for session destruction
          additionalHeaders: {
            'X-API-Key': API_CONFIG.apiKey,
          }
        });
        
        await fetch(`${this.baseUrl}/session/${sessionId}`, {
          method: 'DELETE',
          headers,
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
    
    // Clear any other session-related data
    sessionStorage.removeItem('sessionUserId');
    sessionStorage.removeItem('authToken');
    
    // Clear any persistent storage that might contain session data
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    
    // Emit event for components to handle logout
    window.dispatchEvent(new CustomEvent('sessionExpired'));
    
    console.log('SessionService: Session expiration handled, event dispatched');
  }

  /**
   * Validate session with backend (optional - for debugging)
   */
  async validateSession(): Promise<boolean> {
    const sessionId = this.getSessionId();
    if (!sessionId) return false;

    try {
      const headers = getApiHeaders({
        contentType: 'application/json',
        includeSession: false, // No session needed for session validation
        additionalHeaders: {
          'X-API-Key': API_CONFIG.apiKey,
        }
      });
      
      const response = await fetch(`${this.baseUrl}/session/${sessionId}`, {
        method: 'GET',
        headers,
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
