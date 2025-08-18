/**
 * GdprConsent - GDPR consent management component
 * 
 * Handles user consent for research history storage and processing
 */

import React, { useState, useEffect } from 'react';
import { gdprService, GdprConsentStatus } from '../services/GdprService';

interface GdprConsentProps {
  onConsentChange?: (hasConsent: boolean) => void;
  className?: string;
}

export const GdprConsent: React.FC<GdprConsentProps> = ({ 
  onConsentChange,
  className = '' 
}) => {
  const [consentStatus, setConsentStatus] = useState<GdprConsentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConsentStatus();
  }, []);

  const loadConsentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await gdprService.checkConsentStatus();
      setConsentStatus(status);
      onConsentChange?.(status.hasConsent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load consent status');
      console.error('Failed to load consent status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantConsent = async () => {
    try {
      setUpdating(true);
      setError(null);
      const updatedStatus = await gdprService.grantConsent('1.0');
      setConsentStatus(updatedStatus);
      onConsentChange?.(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grant consent');
      console.error('Failed to grant consent:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleWithdrawConsent = async () => {
    try {
      setUpdating(true);
      setError(null);
      const updatedStatus = await gdprService.withdrawConsent();
      setConsentStatus(updatedStatus);
      onConsentChange?.(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw consent');
      console.error('Failed to withdraw consent:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={`gdpr-consent loading ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`gdpr-consent error ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading consent status</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={loadConsentStatus}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`gdpr-consent ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Research History Consent
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                To provide you with persistent research history and personalized insights, 
                we need your consent to store your research data.
              </p>
              {consentStatus && (
                <div className="mt-2">
                  <p className="font-medium">
                    Current Status: 
                    <span className={consentStatus.hasConsent ? 'text-green-600' : 'text-red-600'}>
                      {consentStatus.hasConsent ? ' Consent Granted' : ' No Consent'}
                    </span>
                  </p>
                  {consentStatus.consentDate && (
                    <p className="text-xs text-gray-600">
                      Consent Date: {new Date(consentStatus.consentDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    Version: {consentStatus.consentVersion}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 flex space-x-3">
              {!consentStatus?.hasConsent ? (
                <button
                  onClick={handleGrantConsent}
                  disabled={updating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Granting...' : 'Grant Consent'}
                </button>
              ) : (
                <button
                  onClick={handleWithdrawConsent}
                  disabled={updating}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Withdrawing...' : 'Withdraw Consent'}
                </button>
              )}
              <button
                onClick={loadConsentStatus}
                disabled={updating}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
