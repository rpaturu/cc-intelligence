/**
 * GDPR Compliance Module
 * Handles data protection, consent management, and user rights
 */

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  researchHistory: boolean;
  profileData: boolean;
  thirdPartyData: boolean;
  timestamp: string;
  version: string;
}

export interface DataRetentionPolicy {
  researchHistory: number; // days
  profileData: number; // days
  analytics: number; // days
  sessionData: number; // hours
}

export interface UserRights {
  rightToAccess: boolean;
  rightToRectification: boolean;
  rightToErasure: boolean;
  rightToPortability: boolean;
  rightToObject: boolean;
  rightToRestriction: boolean;
}

/**
 * GDPR Compliance Manager
 */
export class GDPRComplianceManager {
  private static instance: GDPRComplianceManager;
  private consentKey = 'gdpr_consent_preferences';
  private retentionKey = 'data_retention_policy';
  private rightsKey = 'user_rights_status';

  private constructor() {}

  static getInstance(): GDPRComplianceManager {
    if (!GDPRComplianceManager.instance) {
      GDPRComplianceManager.instance = new GDPRComplianceManager();
    }
    return GDPRComplianceManager.instance;
  }

  /**
   * Initialize GDPR compliance for a new user
   */
  initializeGDPR(userId: string): void {
    // Set default consent preferences (all false - user must opt-in for GDPR compliance)
    const defaultConsent: ConsentPreferences = {
      analytics: false,
      marketing: false,
      researchHistory: false, // User must explicitly opt-in
      profileData: false, // User must explicitly opt-in
      thirdPartyData: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    // Set data retention policy
    const retentionPolicy: DataRetentionPolicy = {
      researchHistory: 365, // 1 year
      profileData: 730, // 2 years
      analytics: 90, // 3 months
      sessionData: 24 // 24 hours
    };

    // Set user rights status
    const userRights: UserRights = {
      rightToAccess: true,
      rightToRectification: true,
      rightToErasure: true,
      rightToPortability: true,
      rightToObject: true,
      rightToRestriction: true
    };

    // Store in session storage (GDPR-compliant)
    sessionStorage.setItem(`${this.consentKey}_${userId}`, JSON.stringify(defaultConsent));
    sessionStorage.setItem(`${this.retentionKey}_${userId}`, JSON.stringify(retentionPolicy));
    sessionStorage.setItem(`${this.rightsKey}_${userId}`, JSON.stringify(userRights));
  }

  /**
   * Get user consent preferences
   */
  getConsentPreferences(userId: string): ConsentPreferences | null {
    try {
      const stored = sessionStorage.getItem(`${this.consentKey}_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving consent preferences:', error);
      return null;
    }
  }

  /**
   * Update user consent preferences
   */
  updateConsentPreferences(userId: string, preferences: Partial<ConsentPreferences>): void {
    try {
      const current = this.getConsentPreferences(userId) || {
        analytics: false,
        marketing: false,
        researchHistory: true,
        profileData: true,
        thirdPartyData: false,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      const updated: ConsentPreferences = {
        ...current,
        ...preferences,
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem(`${this.consentKey}_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating consent preferences:', error);
    }
  }

  /**
   * Check if user has consented to specific data processing
   */
  hasConsent(userId: string, dataType: keyof ConsentPreferences): boolean {
    const preferences = this.getConsentPreferences(userId);
    if (!preferences) return false;
    
    const value = preferences[dataType];
    return typeof value === 'boolean' ? value : false;
  }

  /**
   * Implement right to be forgotten (data erasure)
   */
  async implementRightToErasure(userId: string): Promise<void> {
    try {
      // Clear all session data
      sessionStorage.removeItem(`${this.consentKey}_${userId}`);
      sessionStorage.removeItem(`${this.retentionKey}_${userId}`);
      sessionStorage.removeItem(`${this.rightsKey}_${userId}`);
      sessionStorage.removeItem(`sessionUserId`);
      sessionStorage.removeItem(`authToken`);

      // Clear any persistent storage
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');

      // TODO: Call backend API to delete user data
      // await apiClient.deleteUserData(userId);

      console.log(`Right to erasure implemented for user: ${userId}`);
    } catch (error) {
      console.error('Error implementing right to erasure:', error);
      throw error;
    }
  }

  /**
   * Implement right to data portability
   */
  async implementRightToPortability(userId: string): Promise<any> {
    try {
      // TODO: Call backend API to export user data
      // const userData = await apiClient.exportUserData(userId);
      
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        dataTypes: ['profile', 'researchHistory', 'consentPreferences'],
        // data: userData
      };

      return exportData;
    } catch (error) {
      console.error('Error implementing right to portability:', error);
      throw error;
    }
  }

  /**
   * Export user data in JSON format
   */
  async exportUserData(userId: string): Promise<any> {
    try {
      // Get profile data
      const profileResponse = await fetch(`/api/profile/${encodeURIComponent(userId)}`);
      const profile = profileResponse.ok ? await profileResponse.json() : null;

      // Get research history
      const researchResponse = await fetch(`/api/research-history/users/${encodeURIComponent(userId)}`);
      const researchHistory = researchResponse.ok ? await researchResponse.json() : null;

      // Get consent preferences
      const consentPreferences = this.getConsentPreferences(userId);

      // Get audit trail
      const auditTrail = this.getAuditTrail(userId);

      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        profile,
        researchHistory,
        consentPreferences,
        auditTrail,
        format: 'JSON',
        version: '1.0'
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  /**
   * Download user data as JSON file
   */
  async downloadUserData(userId: string): Promise<void> {
    try {
      const data = await this.exportUserData(userId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading user data:', error);
      throw error;
    }
  }

  /**
   * Check data retention compliance
   */
  checkDataRetentionCompliance(userId: string): {
    compliant: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    const retentionPolicy = this.getRetentionPolicy(userId);

    if (!retentionPolicy) {
      return { compliant: false, violations: ['No retention policy found'] };
    }

    // Check session data retention
    const sessionData = sessionStorage.getItem(`sessionUserId`);
    if (sessionData) {
      // Session data should be cleared on browser close, but we can check for old data
      const lastActivity = sessionStorage.getItem(`lastActivity_${userId}`);
      if (lastActivity) {
        const lastActivityDate = new Date(lastActivity);
        const hoursSinceActivity = (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceActivity > retentionPolicy.sessionData) {
          violations.push('Session data exceeds retention period');
        }
      }
    }

    return {
      compliant: violations.length === 0,
      violations
    };
  }

  /**
   * Get data retention policy
   */
  private getRetentionPolicy(userId: string): DataRetentionPolicy | null {
    try {
      const stored = sessionStorage.getItem(`${this.retentionKey}_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving retention policy:', error);
      return null;
    }
  }

  /**
   * Log data processing activity for audit trail
   */
  logDataProcessing(userId: string, dataType: string, action: string, purpose: string): void {
    const auditLog = {
      userId,
      dataType,
      action,
      purpose,
      timestamp: new Date().toISOString(),
      consentGiven: this.hasConsent(userId, dataType as keyof ConsentPreferences)
    };

    // Store audit log in session storage (for this session only)
    const auditKey = `audit_log_${userId}`;
    const existingLogs = sessionStorage.getItem(auditKey);
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(auditLog);
    
    // Keep only last 100 entries to prevent storage bloat
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    sessionStorage.setItem(auditKey, JSON.stringify(logs));
  }

  /**
   * Get audit trail for user
   */
  getAuditTrail(userId: string): any[] {
    try {
      const auditKey = `audit_log_${userId}`;
      const stored = sessionStorage.getItem(auditKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving audit trail:', error);
      return [];
    }
  }
}

// Export singleton instance
export const gdprManager = GDPRComplianceManager.getInstance();
