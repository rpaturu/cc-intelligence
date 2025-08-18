import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

import { 
  Shield, 
  Database, 
  Users, 
  BarChart3, 
  Share2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { gdprService, GdprConsentStatus } from '../services/GdprService';

interface ConsentChange {
  type: string;
  oldValue: boolean;
  newValue: boolean;
  timestamp: string;
}

const ConsentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consentStatus, setConsentStatus] = useState<GdprConsentStatus | null>(null);
  const [pendingConsent, setPendingConsent] = useState<boolean | null>(null);
  const [consentHistory, setConsentHistory] = useState<ConsentChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Load GDPR data on component mount
  useEffect(() => {
    if (user?.userId) {
      loadGdprData();
      loadConsentHistory();
    }
  }, [user?.userId]);

  const loadGdprData = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      
      // Load consent status
      const consent = await gdprService.checkConsentStatus();
      setConsentStatus(consent);
    } catch (error) {
      console.error('Error loading GDPR data:', error);
      setMessage({ type: 'error', text: 'Failed to load GDPR data' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadConsentHistory = () => {
    try {
      // Load consent history from session storage
      const historyKey = `consent_history_${user!.userId}`;
      const stored = sessionStorage.getItem(historyKey);
      if (stored) {
        setConsentHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading consent history:', error);
    }
  };

  const handleConsentChange = (value: boolean) => {
    setPendingConsent(value);
    setMessage(null);
  };

  const handleSaveChanges = async () => {
    if (!user?.userId || pendingConsent === null) return;

    setIsSaving(true);
    try {
      // Update consent via backend
      const updatedStatus = pendingConsent 
        ? await gdprService.grantConsent('1.0')
        : await gdprService.withdrawConsent();

      // Record change in history
      const change: ConsentChange = {
        type: 'researchHistory',
        oldValue: consentStatus?.hasConsent || false,
        newValue: pendingConsent,
        timestamp: new Date().toISOString()
      };

      // Save to history
      const historyKey = `consent_history_${user.userId}`;
      const existingHistory = sessionStorage.getItem(historyKey);
      const allHistory = existingHistory ? JSON.parse(existingHistory) : [];
      sessionStorage.setItem(historyKey, JSON.stringify([change, ...allHistory]));

      // Update state
      setConsentStatus(updatedStatus);
      setConsentHistory(prev => [change, ...prev]);
      setPendingConsent(null);

      setMessage({ type: 'success', text: 'Consent updated successfully' });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving consent:', error);
      setMessage({ type: 'error', text: 'Failed to save consent' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (!user?.userId) return;

    setPendingConsent(false);
    setMessage({ type: 'info', text: 'Reset to no consent. Click Save to apply changes.' });
  };

  const hasChanges = pendingConsent !== null;

  const getConsentIcon = (type: string) => {
    switch (type) {
      case 'researchHistory': return <Database className="h-4 w-4" />;
      case 'profileData': return <Users className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'marketing': return <BarChart3 className="h-4 w-4" />;
      case 'thirdPartyData': return <Share2 className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getConsentDescription = (type: string) => {
    switch (type) {
      case 'researchHistory':
        return 'Store your company research sessions to enable you to continue where you left off and access previous findings.';
      case 'profileData':
        return 'Process your profile information to personalize your research experience and provide relevant insights.';
      case 'analytics':
        return 'Use anonymized usage data to improve our service and develop new features.';
      case 'marketing':
        return 'Send you updates about new features, tips, and relevant content.';
      case 'thirdPartyData':
        return 'Allow us to enhance your research with data from trusted third-party sources.';
      default:
        return 'Data processing consent for this category.';
    }
  };

  const getConsentStatus = () => {
    if (!consentStatus) return 'unknown';
    
    const currentValue = consentStatus.hasConsent;
    const pendingValue = pendingConsent;
    
    if (pendingValue !== null) {
      return pendingValue ? 'pending-enabled' : 'pending-disabled';
    }
    
    return currentValue ? 'enabled' : 'disabled';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading consent preferences...</span>
        </div>
      </div>
    );
  }

  if (!consentStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Unable to load consent status. Please try refreshing the page.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 pb-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Consent Management
              </h1>
              <p className="text-muted-foreground">
                Manage your data processing preferences and consent settings
              </p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : message.type === 'error' ? 'text-red-800' : 'text-blue-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-14">
          {/* Current Consent Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Current Consent Preferences
              </CardTitle>
              <CardDescription>
                Review and update your data processing consent preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="researchHistory"
                  checked={pendingConsent !== null ? pendingConsent : consentStatus.hasConsent}
                  onCheckedChange={(checked) => handleConsentChange(checked === true)}
                  className="mt-1 border border-gray-300"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getConsentIcon('researchHistory')}
                    <label htmlFor="researchHistory" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Research History
                    </label>
                    <Badge 
                      variant={
                        getConsentStatus() === 'enabled' || getConsentStatus() === 'pending-enabled' ? 'default' :
                        getConsentStatus() === 'disabled' || getConsentStatus() === 'pending-disabled' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {getConsentStatus() === 'enabled' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {getConsentStatus() === 'disabled' && <XCircle className="h-3 w-3 mr-1" />}
                      {getConsentStatus() === 'pending-enabled' && <Clock className="h-3 w-3 mr-1" />}
                      {getConsentStatus() === 'pending-disabled' && <Clock className="h-3 w-3 mr-1" />}
                      {getConsentStatus() === 'enabled' ? 'Enabled' : 
                       getConsentStatus() === 'disabled' ? 'Disabled' : 
                       getConsentStatus() === 'pending-enabled' ? 'Will Enable' : 
                       getConsentStatus() === 'pending-disabled' ? 'Will Disable' : 'Unknown'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getConsentDescription('researchHistory')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Save your changes or reset to default preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetToDefaults}
                  disabled={isSaving}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
              
              {hasChanges && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You have unsaved changes. Click "Save Changes" to apply them.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Consent History */}
          {consentHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Consent History</CardTitle>
                <CardDescription>
                  Recent changes to your consent preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consentHistory.slice(0, 10).map((change, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getConsentIcon(change.type)}
                        <div>
                          <p className="text-sm font-medium">
                            {change.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {change.oldValue ? 'Enabled' : 'Disabled'} → {change.newValue ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(change.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Right to Withdraw Consent:</strong> You can withdraw your consent at any time by unchecking the boxes above and saving your changes.
                </p>
                <p>
                  <strong>Right to Access:</strong> You can request a copy of all your personal data through your profile settings.
                </p>
                <p>
                  <strong>Right to Erasure:</strong> You can request deletion of your data through your profile settings.
                </p>
                <p>
                  <strong>Data Retention:</strong> Your data is retained according to our data retention policy. You can view this in our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsentManagementPage;
