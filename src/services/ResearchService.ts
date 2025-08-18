/**
 * ResearchService - Frontend active research streaming management
 * 
 * Handles all active research operations:
 * 1. Initiate research sessions
 * 2. Real-time research streaming (SSE)
 * 3. Research status monitoring
 * 4. Research results retrieval
 */

import { API_CONFIG } from '../lib/config';
import { getSessionHeaders, hasValidSession } from '../utils/apiHeaders';

export interface ResearchSession {
  status: 'initiated' | 'in_progress' | 'completed' | 'failed';
  areaId: string;
  companyId: string;
  userRole: string;
  userCompany: string;
  datasets: string[];
  startTime: string;
  progress: number;
  steps: Array<{
    dataset: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    completed: boolean;
  }>;
}

export interface ResearchStreamingResponse {
  type: 'collection_started';
  message: string;
  requestId: string;
  researchSessionId: string;
  areaId: string;
  companyId: string;
  userId: string;
  userEmail: string;
  streaming: {
    sseEndpoint: string;
    statusEndpoint: string;
    resultEndpoint: string;
    estimatedTimeMinutes: number;
    eventTypes: string[];
  };
}

export class ResearchService {
  private static instance: ResearchService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  static getInstance(): ResearchService {
    if (!ResearchService.instance) {
      ResearchService.instance = new ResearchService();
    }
    return ResearchService.instance;
  }

  /**
   * Initiate a new research session
   */
  async initiateResearch(areaId: string, companyId: string): Promise<ResearchStreamingResponse> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const params = new URLSearchParams({ areaId, companyId });
      const response = await fetch(`${this.baseUrl}/api/research/stream?${params}`, {
        method: 'POST',
        headers: getSessionHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to initiate research: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ResearchService: Failed to initiate research', error);
      throw error;
    }
  }

  /**
   * Get research status
   */
  async getResearchStatus(researchSessionId: string): Promise<ResearchSession> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/api/research/stream/${researchSessionId}/status`, {
        method: 'GET',
        headers: getSessionHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get research status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ResearchService: Failed to get research status', error);
      throw error;
    }
  }

  /**
   * Get research results
   */
  async getResearchResults(researchSessionId: string): Promise<any> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/api/research/stream/${researchSessionId}/result`, {
        method: 'GET',
        headers: getSessionHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get research results: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ResearchService: Failed to get research results', error);
      throw error;
    }
  }

  /**
   * Create SSE EventSource for real-time research updates
   * Note: EventSource doesn't support custom headers, so session must be handled via URL params or cookies
   */
  createResearchEventSource(researchSessionId: string): EventSource {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No active session found');
    }

    // Note: EventSource doesn't support custom headers
    // The backend should handle session validation via cookies or URL parameters
    const url = `${this.baseUrl}/api/research/stream/${researchSessionId}/events`;
    const eventSource = new EventSource(url);

    return eventSource;
  }
}

// Export singleton instance
export const researchService = ResearchService.getInstance();
