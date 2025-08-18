/**
 * API Headers Utility
 * 
 * Centralized utility for managing API request headers including:
 * - API Key authentication
 * - Session-based authentication
 * - User ID headers
 * - Common content types
 */

import { API_CONFIG } from '../lib/config';
import { sessionService } from '../services/SessionService';

export interface ApiHeadersOptions {
  contentType?: string;
  includeSession?: boolean;
  additionalHeaders?: Record<string, string>;
}

/**
 * Get standard API headers with authentication
 * Backend extracts userId from session for security
 */
export function getApiHeaders(options: ApiHeadersOptions = {}): Record<string, string> {
  const {
    contentType = 'application/json',
    includeSession = true,
    additionalHeaders = {}
  } = options;

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'X-API-Key': API_CONFIG.apiKey,
    ...additionalHeaders
  };

  // Add session ID if required and available
  // Backend will extract userId from session for security
  if (includeSession) {
    const sessionId = sessionService.getSessionId();
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
  }

  return headers;
}

/**
 * Get headers for session-based API calls
 */
export function getSessionHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
  return getApiHeaders({
    includeSession: true,
    additionalHeaders
  });
}

/**
 * Get headers for API calls that don't require session authentication
 */
export function getBasicHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
  return getApiHeaders({
    includeSession: false,
    additionalHeaders
  });
}

/**
 * Check if session is available for API calls
 */
export function hasValidSession(): boolean {
  return sessionService.getSessionId() !== null;
}

/**
 * Get current session ID
 */
export function getCurrentSessionId(): string | null {
  return sessionService.getSessionId();
}
