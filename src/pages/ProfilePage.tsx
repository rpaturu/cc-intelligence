import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types/api';
import { 
  User, 
  Building, 
  Users, 
  ArrowLeft, 
  Save,
  Trash2,
  Target,
  CheckCircle
} from 'lucide-react';

// Persona mapping utilities (same as OnboardingFlow)
const getPersonaType = (role: string): string => {
  const aeRoles = ['Account Executive', 'Senior Account Executive', 'Enterprise Account Executive', 'Strategic Account Executive', 'Sales Development Representative', 'Business Development Representative'];
  const csmRoles = ['Customer Success Manager', 'Senior Customer Success Manager', 'Enterprise Customer Success Manager', 'Customer Success Director', 'Account Manager'];
  const seRoles = ['Solutions Engineer', 'Senior Solutions Engineer', 'Principal Solutions Engineer', 'Solutions Architect', 'Technical Sales Engineer', 'Sales Engineer'];

  if (aeRoles.some(aeRole => role.includes(aeRole.split(' ')[0]) && role.includes(aeRole.split(' ')[1] || ''))) {
    return 'Revenue-Focused (AE)';
  } else if (csmRoles.some(() => role.includes('Success') || role.includes('Account Manager'))) {
    return 'Health-Focused (CSM)';
  } else if (seRoles.some(() => role.includes('Engineer') || role.includes('Architect') || role.includes('Technical'))) {
    return 'Technical-Focused (SE)';
  } else {
    return 'Leadership/Management';
  }
};

const getPersonaDescription = (role: string): string => {
  const personaType = getPersonaType(role);
  switch (personaType) {
    case 'Revenue-Focused (AE)':
      return 'AI will focus on buying signals, competitive intel, and revenue opportunities';
    case 'Health-Focused (CSM)':
      return 'AI will emphasize customer health, renewal risk, and expansion opportunities';
    case 'Technical-Focused (SE)':
      return 'AI will prioritize tech stack, integration complexity, and technical validation';
    default:
      return 'AI will provide balanced insights across business, technical, and relationship aspects';
  }
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile, clearProfile, loading, error } = useProfile();
  const { user } = useAuth();

  const [originalCompany, setOriginalCompany] = useState<string>('');
  const [hasCompanyChanged, setHasCompanyChanged] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfile>({
    userId: '',
    name: '',
    role: '',
    email: '',
    department: '',
    company: '',
    companyDomain: '',
    industry: '',
    primaryProducts: [],
    keyValueProps: [],
    mainCompetitors: [],
    territory: '',
    targetIndustries: [],
    salesFocus: 'enterprise',
    defaultResearchContext: 'discovery',
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        // Auto-populate email from user registration if not already set
        email: profile.email || user?.email || user?.attributes?.email || ''
      });

      // Track original company for change detection
      setOriginalCompany(profile.company || '');
      setHasCompanyChanged(false);
    } else if (user) {
      // If no profile but user exists, pre-populate email
      setFormData(prev => ({
        ...prev,
        email: user.email || user.attributes?.email || ''
      }));
    }
  }, [profile, user]);

  // Track company changes
  useEffect(() => {
    if (originalCompany && formData.company !== originalCompany) {
      setHasCompanyChanged(true);
    } else {
      setHasCompanyChanged(false);
    }
  }, [formData.company, originalCompany]);

  const handleSave = async () => {
    try {
      // Exclude userId, createdAt, updatedAt when saving
      const { userId, createdAt, updatedAt, ...profileData } = formData;
      void userId; void createdAt; void updatedAt;
      await updateProfile(profileData);
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Error is already set in the context
    }
  };

  const handleClear = async () => {
    try {
      await clearProfile();
    setFormData({
      userId: '',
      name: '',
      role: '',
      email: '',
      department: '',
      company: '',
      companyDomain: '',
      industry: '',
      primaryProducts: [],
      keyValueProps: [],
      mainCompetitors: [],
      territory: '',
      targetIndustries: [],
      salesFocus: 'enterprise',
      defaultResearchContext: 'discovery',
      createdAt: '',
      updatedAt: ''
    });
    } catch (error) {
      console.error('Failed to clear profile:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft />
              Back to App
            </Button>
            <h1>Profile Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
      {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}

        {/* Personal Information */}
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User />
              <CardTitle>Personal Information</CardTitle>
              </div>
          </CardHeader>
          <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                placeholder="e.g., Ramesh Paturu"
                value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                type="email"
                  placeholder="your.email@company.com"
                value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    disabled
                  className="bg-muted"
              />
            </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role/Title *</Label>
                <div className="relative">
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="🎯 Select your role to personalize AI insights" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Account Executive Personas */}
                      <SelectItem value="Account Executive">Account Executive</SelectItem>
                      <SelectItem value="Senior Account Executive">Senior Account Executive</SelectItem>
                      <SelectItem value="Enterprise Account Executive">Enterprise Account Executive</SelectItem>
                      <SelectItem value="Strategic Account Executive">Strategic Account Executive</SelectItem>
                      <SelectItem value="Sales Development Representative">Sales Development Representative (SDR)</SelectItem>
                      <SelectItem value="Business Development Representative">Business Development Representative (BDR)</SelectItem>

                      {/* Customer Success Personas */}
                      <SelectItem value="Customer Success Manager">Customer Success Manager</SelectItem>
                      <SelectItem value="Senior Customer Success Manager">Senior Customer Success Manager</SelectItem>
                      <SelectItem value="Enterprise Customer Success Manager">Enterprise Customer Success Manager</SelectItem>
                      <SelectItem value="Customer Success Director">Customer Success Director</SelectItem>
                      <SelectItem value="Account Manager">Account Manager</SelectItem>

                      {/* Solutions Engineer Personas */}
                      <SelectItem value="Solutions Engineer">Solutions Engineer</SelectItem>
                      <SelectItem value="Senior Solutions Engineer">Senior Solutions Engineer</SelectItem>
                      <SelectItem value="Principal Solutions Engineer">Principal Solutions Engineer</SelectItem>
                      <SelectItem value="Solutions Architect">Solutions Architect</SelectItem>
                      <SelectItem value="Technical Sales Engineer">Technical Sales Engineer</SelectItem>
                      <SelectItem value="Sales Engineer">Sales Engineer</SelectItem>

                      {/* Sales Leadership */}
                      <SelectItem value="VP of Sales">VP of Sales</SelectItem>
                      <SelectItem value="Sales Director">Sales Director</SelectItem>
                      <SelectItem value="Regional Sales Manager">Regional Sales Manager</SelectItem>
                      <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Enterprise Sales"
                value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  />
                </div>
              </div>

            {/* Persona Detection Helper - Full Width */}
            {formData.role && (
              <Card className="mt-6">
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Target />
                    <Badge variant="secondary">
                      {getPersonaType(formData.role)}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {getPersonaDescription(formData.role)}
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building />
              <CardTitle>Company Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>

            <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
                <Select
                value={formData.company}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, company: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.company && (
                      <SelectItem value={formData.company}>
                        <span className="truncate">
                          {formData.company}
                        </span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDomain">Company Domain</Label>
              <Input
                id="companyDomain"
                  placeholder="e.g., tesla.com"
                value={formData.companyDomain}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyDomain: e.target.value }))}
                  />

              </div>
            </div>

            {/* Company Intelligence Status */}
            {formData.company && formData.role && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle />
                    <CardTitle>
                      {getPersonaType(formData.role)} Intelligence Ready
                    </CardTitle>
                  </div>
                  <CardDescription>
                    AI configured for {formData.company} research from your {formData.role} perspective:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {getPersonaType(formData.role) === 'Revenue-Focused (AE)' && (
                      <>
                        <Badge variant="secondary">Buying Signals</Badge>
                        <Badge variant="secondary">Competitive Intel</Badge>
                        <Badge variant="secondary">Revenue Opportunities</Badge>
                        <Badge variant="secondary">Decision Makers</Badge>
                      </>
                    )}
                    {getPersonaType(formData.role) === 'Health-Focused (CSM)' && (
                      <>
                        <Badge variant="secondary">Health Metrics</Badge>
                        <Badge variant="secondary">Renewal Risk</Badge>
                        <Badge variant="secondary">Expansion Opportunities</Badge>
                        <Badge variant="secondary">Stakeholder Insights</Badge>
                      </>
                    )}
                    {getPersonaType(formData.role) === 'Technical-Focused (SE)' && (
                      <>
                        <Badge variant="secondary">Tech Stack Analysis</Badge>
                        <Badge variant="secondary">Integration Complexity</Badge>
                        <Badge variant="secondary">POC Requirements</Badge>
                        <Badge variant="secondary">Architecture Planning</Badge>
                      </>
                    )}
                    {getPersonaType(formData.role) === 'Leadership/Management' && (
                      <>
                        <Badge variant="secondary">Team Performance</Badge>
                        <Badge variant="secondary">Strategic Planning</Badge>
                        <Badge variant="secondary">Market Analysis</Badge>
                        <Badge variant="secondary">Revenue Forecasting</Badge>
                      </>
                    )}
                  </div>
                  <CardDescription className="mt-4">
                    AI will prioritize {getPersonaType(formData.role).toLowerCase()} insights when researching prospects.
                  </CardDescription>
                </CardContent>
              </Card>
            )}

            {/* Company Change Recommendation */}
            {hasCompanyChanged && (
              <Alert variant="destructive">
                <AlertTitle>Company Changed: Consider Profile Refresh</AlertTitle>
                <AlertDescription>
                  <p>
                    You've changed from "{originalCompany}" to "{formData.company}".
                    Your current profile data is optimized for {originalCompany}.
                  </p>
                  <p>
                    💡 <strong>Recommendation:</strong> Clear your profile to get fresh company intelligence
                    and auto-populated fields for {formData.company} during next onboarding.
                  </p>
                  <Button
                    onClick={handleClear}
                    variant="destructive"
                    size="sm"
                  >
                    Clear Profile & Start Fresh
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sales Context */}
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users />
              <CardTitle>Sales Context</CardTitle>
                </div>
          </CardHeader>
          <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="territory">Territory/Region</Label>
              <Input
                id="territory"
                placeholder="e.g., North America, EMEA"
                  value={formData.territory}
                  onChange={(e) => setFormData((prev) => ({ ...prev, territory: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesFocus">Sales Focus</Label>
                  <Select 
                value={formData.salesFocus} 
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, salesFocus: value as 'enterprise' | 'smb' | 'mid-market' | 'startup' }))}
                  >
                    <SelectTrigger>
                  <SelectValue placeholder="Select sales focus" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="mid-market">Mid-Market</SelectItem>
                  <SelectItem value="smb">Small Business</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <div className="md:col-span-2 space-y-2">
            <Label htmlFor="defaultContext">Default Research Context</Label>
            <Select 
              value={formData.defaultResearchContext} 
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultResearchContext: value as 'discovery' | 'competitive' | 'partnership' | 'renewal' }))}
                >
              <SelectTrigger>
                <SelectValue placeholder="Select research context" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="discovery">Discovery Call</SelectItem>
                <SelectItem value="competitive">Competitive Analysis</SelectItem>
                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                <SelectItem value="renewal">Renewal/Expansion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          </Card>

        {/* Save Actions */}
        <div className="w-full max-w-2xl flex justify-between items-center">
          <div>
            <Button
              onClick={handleClear}
              variant="destructive"
              disabled={loading}
            >
              <Trash2 />
              Clear Profile
            </Button>
          </div>

                <Button 
            onClick={handleSave}
            disabled={loading}
            size="lg"
          >
            <Save />
            {loading ? 'Saving...' : 'Save Profile'}
                </Button>
        </div>
      </div>
    </div>
  );
} 