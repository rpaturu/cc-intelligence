import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types/api';
import { companyPresets } from '../contexts/ProfileContextTypes';
import { 
  User, 
  Building, 
  Target, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const ONBOARDING_STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'company', title: 'Company Setup', icon: Building },
  { id: 'products', title: 'Products & Value', icon: Award },
  { id: 'competitive', title: 'Competitive Intel', icon: Target },
  { id: 'sales-context', title: 'Sales Context', icon: Users }
];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { profile, updateProfile, loading } = useProfile();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<UserProfile>({
    userId: '',
    name: '',
    role: '',
    email: user?.email || '',
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

  // Helper functions for array management
  const [newProduct, setNewProduct] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  const addToArray = (field: keyof UserProfile, value: string, setValue: (val: string) => void) => {
    if (!value.trim()) return;
    setFormData((prev: UserProfile) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
    setValue('');
  };

  const removeFromArray = (field: keyof UserProfile, index: number) => {
    setFormData((prev: UserProfile) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleCompanySelect = (company: string) => {
    if (companyPresets[company]) {
      setFormData((prev: UserProfile) => ({
        ...prev,
        ...companyPresets[company],
        // Keep personal info
        name: prev.name,
        role: prev.role,
        email: prev.email,
        department: prev.department,
        territory: prev.territory,
        salesFocus: prev.salesFocus,
        defaultResearchContext: prev.defaultResearchContext
      }));
    } else {
      setFormData((prev: UserProfile) => ({
        ...prev,
        company
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal
        return !!(formData.name && formData.role);
      case 1: // Company
        return !!(formData.company);
      case 2: // Products
        return formData.primaryProducts.length > 0;
      case 3: // Competitive
        return formData.mainCompetitors.length > 0;
      case 4: // Sales Context
        return true; // Optional step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      const { userId, createdAt, updatedAt, ...profileData } = formData;
      await updateProfile(profileData);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Let's get started!</h2>
              <p className="text-muted-foreground">Tell us about yourself so we can personalize your experience</p>
            </div>
            <div className="space-y-4">
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
                <Label htmlFor="role">Role/Title *</Label>
                <Input
                  id="role"
                  placeholder="e.g., Senior Account Executive"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  placeholder="e.g., Enterprise Sales"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 1: // Company Setup
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Company Information</h2>
              <p className="text-muted-foreground">Help us understand your company context</p>
            </div>
            
            {/* Quick Setup Buttons */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Quick Setup (Optional)</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(companyPresets).map(company => (
                  <Button
                    key={company}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompanySelect(company)}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3" />
                    {company}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="e.g., Atlassian, Okta, Palo Alto Networks"
                  value={formData.company}
                  onChange={(e) => handleCompanySelect(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDomain">Company Domain (Optional)</Label>
                <Input
                  id="companyDomain"
                  placeholder="e.g., atlassian.com"
                  value={formData.companyDomain}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyDomain: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry (Optional)</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Software Development Tools"
                  value={formData.industry}
                  onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Products & Value
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Products & Value</h2>
              <p className="text-muted-foreground">What do you sell and why should customers buy?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Products *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a product (e.g., Jira, Okta SSO)"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('primaryProducts', newProduct, setNewProduct)}
                  />
                  <Button
                    onClick={() => addToArray('primaryProducts', newProduct, setNewProduct)}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.primaryProducts.map((product, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => removeFromArray('primaryProducts', index)}
                    >
                      {product} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Competitive
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Competitive Landscape</h2>
              <p className="text-muted-foreground">Who do you compete against most often?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Main Competitors *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a competitor (e.g., Microsoft, Ping Identity)"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('mainCompetitors', newCompetitor, setNewCompetitor)}
                  />
                  <Button
                    onClick={() => addToArray('mainCompetitors', newCompetitor, setNewCompetitor)}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.mainCompetitors.map((competitor, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                      onClick={() => removeFromArray('mainCompetitors', index)}
                    >
                      {competitor} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Sales Context
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Sales Context</h2>
              <p className="text-muted-foreground">Help us tailor research to your territory and focus</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory/Region</Label>
                  <Input
                    id="territory"
                    placeholder="e.g., North America, EMEA"
                    value={formData.territory || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, territory: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesFocus">Sales Focus</Label>
                  <Select 
                    value={formData.salesFocus} 
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, salesFocus: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="mid-market">Mid-Market</SelectItem>
                      <SelectItem value="smb">Small Business</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Target Industries (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an industry (e.g., Financial Services)"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('targetIndustries', newIndustry, setNewIndustry)}
                  />
                  <Button
                    onClick={() => addToArray('targetIndustries', newIndustry, setNewIndustry)}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.targetIndustries.map((industry, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-chart-4/10 text-chart-4 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-chart-4/20 transition-colors"
                      onClick={() => removeFromArray('targetIndustries', index)}
                    >
                      {industry} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Sales Assistant Setup</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isValid = validateStep(index);
              
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-500'}
                  `}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm ${isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8">
          {renderStepContent()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <Button
                onClick={completeOnboarding}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
                <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 