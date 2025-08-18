/**
 * GdprService - Frontend GDPR compliance management
 * 
 * Handles all GDPR-related operations:
 * 1. Consent management (grant/withdraw)
 * 2. User rights (access, rectification, erasure, portability)
 * 3. Data retention policy management
 * 4. GDPR-specific data operations
 */

import { API_CONFIG } from '../lib/config';
import { getSessionHeaders, hasValidSession } from '../utils/apiHeaders';

export interface GdprConsentStatus {
  hasConsent: boolean;
  consentDate?: string;
  consentVersion: string;
  lastUpdated?: string;
}

export interface DataRetentionPolicy {
  researchHistoryDays?: number;
  lastRetentionUpdate?: string;
}

export interface UserRights {
  rightToAccess: boolean;
  rightToRectification: boolean;
  rightToErasure: boolean;
  rightToPortability: boolean;
  rightToRestriction: boolean;
  rightToObject: boolean;
}



export class GdprService {
  private static instance: GdprService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  static getInstance(): GdprService {
    if (!GdprService.instance) {
      GdprService.instance = new GdprService();
    }
    return GdprService.instance;
  }

  /**
   * Check GDPR consent status for a user
   */
  async checkConsentStatus(): Promise<GdprConsentStatus> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/gdpr/consent-status`, {
        method: 'GET',
        headers: getSessionHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to check consent status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GdprService: Failed to check consent status', error);
      throw error;
    }
  }

  /**
   * Grant GDPR consent for research history
   */
  async grantConsent(consentVersion: string = '1.0'): Promise<GdprConsentStatus> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/gdpr/grant-consent`, {
        method: 'POST',
        headers: getSessionHeaders(),
        body: JSON.stringify({
          consent: true,
          consentVersion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to grant consent: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GdprService: Failed to grant consent', error);
      throw error;
    }
  }

  /**
   * Withdraw GDPR consent
   */
  async withdrawConsent(): Promise<GdprConsentStatus> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/gdpr/withdraw-consent`, {
        method: 'POST',
        headers: getSessionHeaders(),
        body: JSON.stringify({
          consent: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to withdraw consent: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GdprService: Failed to withdraw consent', error);
      throw error;
    }
  }

  /**
   * Get data retention policy
   */
  async getDataRetentionPolicy(): Promise<DataRetentionPolicy> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/gdpr/data-retention`, {
        method: 'GET',
        headers: getSessionHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get retention policy: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GdprService: Failed to get retention policy', error);
      throw error;
    }
  }

  /**
   * Update data retention policy
   */
  async updateDataRetentionPolicy(researchHistoryDays?: number): Promise<DataRetentionPolicy> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/gdpr/update-retention`, {
        method: 'PUT',
        headers: getSessionHeaders(),
        body: JSON.stringify({
          researchHistoryDays,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update retention policy: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GdprService: Failed to update retention policy', error);
      throw error;
    }
  }

  /**
   * Get user rights information
   */
  async getUserRights(): Promise<UserRights> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/gdpr/user-rights`, {
        method: 'GET',
        headers: getSessionHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get user rights: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GdprService: Failed to get user rights', error);
      throw error;
    }
  }

  /**
   * Export user data (Right to Access/Portability)
   */
  async exportUserData(): Promise<any> {
    try {
      if (!hasValidSession()) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${this.baseUrl}/gdpr/export-data`, {
        method: 'GET',
        headers: getSessionHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to export user data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GdprService: Failed to export user data', error);
      throw error;
    }
  }


}

// Export singleton instance
export const gdprService = GdprService.getInstance();
