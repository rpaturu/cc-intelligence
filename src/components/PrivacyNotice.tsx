import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Database, Users, BarChart3, Clock, Eye, Download, Trash2, Settings } from "lucide-react";

interface PrivacyNoticeProps {
  variant?: 'full' | 'summary';
  className?: string;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ variant = 'full', className = '' }) => {
  if (variant === 'summary') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy Notice Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p><strong>Data Collection:</strong> We collect only the data necessary to provide our service.</p>
            <p><strong>Data Usage:</strong> Your data is used solely for research functionality and personalization.</p>
            <p><strong>Data Retention:</strong> Research data (1 year), Profile data (2 years), Analytics (3 months).</p>
            <p><strong>Your Rights:</strong> Access, rectify, delete, or export your data at any time.</p>
          </div>
          <Alert>
            <AlertDescription>
              For complete details, see our full <a href="/privacy" className="underline font-medium">Privacy Policy</a>.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Privacy Policy
          </CardTitle>
          <CardDescription>
            Last updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Information We Collect</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Profile Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Name, email, role, company, and preferences you provide during onboarding.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Research Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Your company research queries, results, and analysis sessions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Usage Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Anonymized usage patterns to improve our service (with your consent).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Service Provision:</strong> To provide and maintain our research platform</p>
              <p><strong>Personalization:</strong> To customize your research experience</p>
              <p><strong>Research History:</strong> To enable you to access previous research sessions</p>
              <p><strong>Improvement:</strong> To enhance our service and develop new features</p>
              <p><strong>Communication:</strong> To send important updates and notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">3. Data Retention</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Research History</h4>
                  <p className="text-sm text-muted-foreground">1 year from last activity</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Profile Data</h4>
                  <p className="text-sm text-muted-foreground">2 years from last activity</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Analytics Data</h4>
                  <p className="text-sm text-muted-foreground">3 months from collection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Session Data</h4>
                  <p className="text-sm text-muted-foreground">Browser session only</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">4. Your Rights Under GDPR</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Right to Access</h4>
                  <p className="text-sm text-muted-foreground">
                    You can view all your personal data through your profile page.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Right to Rectification</h4>
                  <p className="text-sm text-muted-foreground">
                    You can update your profile information at any time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Right to Erasure</h4>
                  <p className="text-sm text-muted-foreground">
                    You can delete your profile and research data completely.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Right to Portability</h4>
                  <p className="text-sm text-muted-foreground">
                    You can export your data in a structured, machine-readable format.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">5. Data Security</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Encryption:</strong> All data is encrypted in transit and at rest</p>
              <p><strong>Access Controls:</strong> User data is isolated and protected</p>
              <p><strong>Secure Storage:</strong> AWS DynamoDB with enterprise-grade security</p>
              <p><strong>Regular Audits:</strong> We regularly review our security practices</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">6. Third-Party Services</h3>
            <div className="space-y-2 text-sm">
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>AWS:</strong> Cloud infrastructure and data storage</li>
                <li><strong>Google Knowledge Graph:</strong> Company information enrichment</li>
                <li><strong>SerpAPI:</strong> Search results for research</li>
              </ul>
              <p>All third-party services are GDPR-compliant and process data under our instructions.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">7. Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p>For any questions about this privacy policy or to exercise your rights:</p>
              <p><strong>Email:</strong> privacy@company.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@company.com</p>
              <p>We will respond to your request within 30 days.</p>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Updates:</strong> We may update this privacy policy from time to time. 
              We will notify you of any material changes via email or through the application.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyNotice;
