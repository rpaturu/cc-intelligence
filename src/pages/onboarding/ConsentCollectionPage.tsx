import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Info, Shield, Database, Users, BarChart3, Share2 } from "lucide-react";
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { gdprManager } from '../../lib/gdpr-compliance';

const ConsentCollectionPage = () => {
  const navigate = useNavigate();
  const { updateData } = useOnboarding();
  const { user } = useAuth();
  
  const [consentPreferences, setConsentPreferences] = useState({
    researchHistory: false,
    profileData: false,
    analytics: false,
    marketing: false,
    thirdPartyData: false,
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Pre-populate with existing consent if available
  useEffect(() => {
    if (user?.userId) {
      const existingConsent = gdprManager.getConsentPreferences(user.userId);
      if (existingConsent) {
        setConsentPreferences({
          researchHistory: existingConsent.researchHistory,
          profileData: existingConsent.profileData,
          analytics: existingConsent.analytics,
          marketing: existingConsent.marketing,
          thirdPartyData: existingConsent.thirdPartyData,
        });
      }
    }
  }, [user?.userId]);

  const handleConsentChange = (type: keyof typeof consentPreferences, value: boolean) => {
    setConsentPreferences(prev => ({ ...prev, [type]: value }));
    setErrors([]); // Clear errors when user makes changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required consents
    const newErrors: string[] = [];
    if (!consentPreferences.researchHistory) {
      newErrors.push("Research History consent is required for app functionality");
    }
    if (!consentPreferences.profileData) {
      newErrors.push("Profile Data consent is required for personalization");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save consent preferences
    if (user?.userId) {
      gdprManager.updateConsentPreferences(user.userId, {
        ...consentPreferences,
        timestamp: new Date().toISOString(),
        version: '1.0'
      });
    }

    // Update onboarding data
    updateData({ consentPreferences });
    
    // Navigate to next step
    navigate('/onboarding/company');
  };

  const handleBack = () => {
    navigate('/onboarding/personal');
  };

  const isFormValid = consentPreferences.researchHistory && consentPreferences.profileData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg md:max-w-4xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Processing Consent
              </CardTitle>
              <CardDescription>
                We need your consent to process your data in accordance with GDPR requirements
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">Step 2 of 4</div>
          </div>
          <Progress value={50} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-4">
                To provide you with the best experience, we need your explicit consent to process certain types of data. 
                You can withdraw your consent at any time through your profile settings.
              </p>
            </div>

            {/* Required Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-destructive">Required for App Functionality</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="researchHistory"
                    checked={consentPreferences.researchHistory}
                    onCheckedChange={(checked) => handleConsentChange('researchHistory', checked as boolean)}
                    className="mt-1 border border-gray-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="researchHistory" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="h-4 w-4" />
                        Research History Storage
                      </div>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Store your company research sessions to enable you to continue where you left off and access previous findings. 
                      This data is retained for 1 year and is essential for the app's core functionality.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="profileData"
                    checked={consentPreferences.profileData}
                    onCheckedChange={(checked) => handleConsentChange('profileData', checked as boolean)}
                    className="mt-1 border border-gray-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="profileData" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4" />
                        Profile Data Processing
                      </div>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Process your profile information to personalize your research experience and provide relevant insights. 
                      This data is retained for 2 years and is used for personalization only.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">Optional - For Enhanced Experience</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="analytics"
                    checked={consentPreferences.analytics}
                    onCheckedChange={(checked) => handleConsentChange('analytics', checked as boolean)}
                    className="mt-1 border border-gray-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="analytics" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4" />
                        Analytics and Service Improvement
                      </div>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Use anonymized usage data to improve our service and develop new features. 
                      This data is retained for 3 months and does not identify you personally.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="marketing"
                    checked={consentPreferences.marketing}
                    onCheckedChange={(checked) => handleConsentChange('marketing', checked as boolean)}
                    className="mt-1 border border-gray-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4" />
                        Marketing Communications
                      </div>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Send you updates about new features, tips, and relevant content. 
                      You can unsubscribe at any time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="thirdPartyData"
                    checked={consentPreferences.thirdPartyData}
                    onCheckedChange={(checked) => handleConsentChange('thirdPartyData', checked as boolean)}
                    className="mt-1 border border-gray-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="thirdPartyData" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      <div className="flex items-center gap-2 mb-1">
                        <Share2 className="h-4 w-4" />
                        Third-Party Data Enhancement
                      </div>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to enhance your research with data from trusted third-party sources. 
                      This may include company information from public databases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Your Rights:</strong> You have the right to access, rectify, or delete your data at any time. 
                You can also withdraw your consent through your profile settings. 
                For more information, see our <a href="/privacy" className="underline">Privacy Policy</a>.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentCollectionPage;
