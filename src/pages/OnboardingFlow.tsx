import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types/api';
import { lookupCompanies, enrichVendor } from '../lib/api';
import { 
  User, 
  Building, 
  Users, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const ONBOARDING_STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'company', title: 'Company Setup', icon: Building },
  { id: 'sales-context', title: 'Sales Context', icon: Users }
];

// Persona mapping utilities
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

  // Dynamic company lookup state
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [companySearchResults, setCompanySearchResults] = useState<Array<{
    name: string; 
    domain?: string; 
    description?: string; 
    industry?: string;
    sources?: string[];
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEnrichingVendor, setIsEnrichingVendor] = useState(false);
  const [enrichmentCompleted, setEnrichmentCompleted] = useState(false);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<{
    name: string; 
    domain?: string; 
    description?: string; 
    industry?: string;
    sources?: string[];
  } | null>(null);

  // Load existing profile data when component mounts
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        // Ensure email is populated from user auth if not in profile
        email: profile.email || user?.email || user?.attributes?.email || ''
      });

      // If company exists, show it in the search field
      if (profile.company) {
        setCompanySearchQuery(profile.company);

        // Recreate basic company details for consistent UX
        if (profile.companyDomain) {
          setSelectedCompanyDetails({
            name: profile.company,
            domain: profile.companyDomain,
            description: profile.industry ? `${profile.industry} company` : '',
            industry: profile.industry || '',
            sources: ['profile']
          });
        }

        // Check if we have vendor enrichment available (background check)
        checkExistingEnrichment(profile.company);
      }
    } else if (user) {
      // If no profile but user exists, pre-populate email
      setFormData(prev => ({
      ...prev,
        email: user.email || user.attributes?.email || ''
      }));
    }
  }, [profile, user]);

  // Check for existing vendor enrichment (non-blocking)
  const checkExistingEnrichment = async (companyName: string) => {
    try {
      // Use the ultra-clean API to check if enrichment exists
      const response = await enrichVendor(companyName);
      
      if (response.metadata.fromCache) {
        setEnrichmentCompleted(true);
        console.log('Found existing vendor enrichment for', companyName);
      }
    } catch (error) {
      // Ignore errors - this is just a background check
      console.log('Background enrichment check failed (non-critical):', {
        error: error instanceof Error ? error.message : String(error),
        companyName
      });
    }
  };

  // Manual company search functionality (triggered by button click)
  const handleCompanySearch = async () => {
    if (!companySearchQuery.trim() || companySearchQuery.length < 2) {
      setCompanySearchResults([]);
      return;
    }

    setIsSearching(true);
    // Clear previous selection when searching for new companies
    setSelectedCompanyDetails(null);

    try {
      const response = await lookupCompanies(companySearchQuery, 5);
      setCompanySearchResults(response.data.companies);
    } catch (error) {
      console.error('Company search failed:', error);
      setCompanySearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle company selection with vendor enrichment for auto-population
  const handleCompanySelect = async (companyName: string) => {
    // Don't process if user selected the "no-results" placeholder
    if (companyName === "no-results") return;
    
    // Store selected company details
    const selectedCompany = companySearchResults.find(c => c.name === companyName);
    if (selectedCompany) {
      setSelectedCompanyDetails(selectedCompany);
    }

    // Set basic company info (name and domain)
    setFormData((prev: UserProfile) => ({
      ...prev,
      company: companyName,
      companyDomain: selectedCompany?.domain || ''
    }));

    // Show selected company in search field
    setCompanySearchQuery(companyName);

    // Clear search results to clean up UI (user has made their choice)
    setCompanySearchResults([]);

    // NEW: Trigger background vendor enrichment (non-blocking)
    triggerBackgroundEnrichment(companyName);
  };

  // Separate background enrichment function - Updated for ultra-clean API
  const triggerBackgroundEnrichment = async (companyName: string) => {
    setIsEnrichingVendor(true);
    setEnrichmentCompleted(false);

    try {
      console.log(`Starting background vendor enrichment for: ${companyName}`);

      const response = await enrichVendor(companyName);
      const vendorContext = response.vendorContext;

      // Auto-populate form fields with vendor context data
      setFormData(prev => {
        const updates: Partial<UserProfile> = {};

        // Auto-populate industry
        if (vendorContext.industry) {
          updates.industry = vendorContext.industry;
        }

        // Auto-populate primary products
        if (vendorContext.products && vendorContext.products.length > 0) {
          updates.primaryProducts = vendorContext.products;
        }

        // Auto-populate main competitors
        if (vendorContext.competitors && vendorContext.competitors.length > 0) {
          updates.mainCompetitors = vendorContext.competitors;
        }

        // Auto-populate value propositions
        if (vendorContext.valuePropositions && vendorContext.valuePropositions.length > 0) {
          updates.keyValueProps = vendorContext.valuePropositions;
        }

        // Auto-populate target markets/industries
        if (vendorContext.targetMarkets && vendorContext.targetMarkets.length > 0) {
          updates.targetIndustries = vendorContext.targetMarkets;
        }

        return { ...prev, ...updates };
      });

      console.log(`Vendor enrichment successful for ${companyName}:`, {
        industry: vendorContext.industry,
        productsCount: vendorContext.products?.length || 0,
        competitorsCount: vendorContext.competitors?.length || 0,
        cached: response.metadata.fromCache,
        processingTime: response.metadata.processingTimeMs
      });

      // Show success feedback briefly
      setEnrichmentCompleted(true);
      setTimeout(() => setEnrichmentCompleted(false), 3000);

    } catch (error) {
      console.warn('Vendor enrichment failed - continuing with manual entry:', error);
      // Don't block the user flow if enrichment fails
    } finally {
      setIsEnrichingVendor(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal
        return !!(formData.name && formData.role);
      case 1: // Company
        return !!(formData.company);
      case 2: // Sales Context
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
      
      console.log('OnboardingFlow: Starting onboarding completion', {
        profileData: {
          name: profileData.name,
          role: profileData.role,
          company: profileData.company,
          hasAllRequired: !!(profileData.name && profileData.role && profileData.company)
        }
      });
      
      // Validate that all required fields are present before saving
      if (!profileData.name || !profileData.role || !profileData.company) {
        console.error('OnboardingFlow: Missing required profile data:', profileData);
        return;
      }
      
      // Save profile and wait for completion
      console.log('OnboardingFlow: Saving profile...');
      await updateProfile(profileData);
      console.log('OnboardingFlow: Profile saved successfully, navigating to main app');
      
      // Navigate only after profile is successfully saved
      navigate('/', { replace: true });
    } catch (error) {
      console.error('OnboardingFlow: Failed to complete onboarding:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Let's get started!</CardTitle>
              <CardDescription>Tell us about yourself so we can personalize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Ramesh Paturu"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
                <div className="grid gap-2">
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

                  {/* Persona Detection Helper */}
                  {formData.role && (
                    <Card>
                      <CardContent>
                        <div className="flex items-center gap-2">
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
              </div>
                <div className="grid gap-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  placeholder="e.g., Enterprise Sales"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
            </CardContent>
          </div>
        );

      case 1: // Company Setup
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Help us understand your company context</CardDescription>
            </CardHeader>
            <CardContent>
            
            {/* Dynamic Company Search */}
            <div className="mb-6">
              <Label htmlFor="company-search">Company Search</Label>
              <div className="relative">
                <div className="flex gap-2">
                <Input
                  id="company-search"
                  placeholder="Search for your company (e.g., Tesla, Shopify, Microsoft, etc.)"
                  value={companySearchQuery}
                    onChange={(e) => setCompanySearchQuery(e.target.value)}
                      disabled={loading}
                    className="flex-1"
                    autoComplete="off"
                    data-form-type="other"
                />
                  <Button
                    type="button"
                    onClick={handleCompanySearch}
                      disabled={loading || !companySearchQuery.trim()}
                    className="px-4"
                  >
                    🔍 Search
                  </Button>
                </div>
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                {companySearchResults.length > 0 && (
                    <Alert className="mb-2">
                      <AlertDescription>
                    <strong>Found {companySearchResults.length} companies - click dropdown below to select!</strong>
                      </AlertDescription>
                    </Alert>
                )}
                <Select
                  value={formData.company}
                    onValueChange={handleCompanySelect}
                >
                    <SelectTrigger className={`${companySearchResults.length > 0 ? "border-primary shadow-sm" : ""}`}>
                    <SelectValue placeholder={companySearchResults.length > 0 ? `📋 Click to select from ${companySearchResults.length} companies found` : "Select a company from search results..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {companySearchResults.length > 0 ? (
                      companySearchResults.map((company, index) => (
                        <SelectItem key={index} value={company.name}>
                          {company.name} {company.domain && `(${company.domain})`} {company.sources && company.sources.length > 0 && "✓"}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-results">
                        <span className="text-muted-foreground">No companies found. Use the search button above.</span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                
                {/* Show selected company details below the dropdown */}
                {formData.company && selectedCompanyDetails && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{formData.company}</CardTitle>
                      </CardHeader>
                      <CardContent>
                    {formData.companyDomain && (
                          <div className="flex gap-2">
                            <Badge variant="secondary">{formData.companyDomain}</Badge>
                            <Badge variant="outline">Verified</Badge>
                      </div>
                    )}
                    {selectedCompanyDetails.description && (
                          <CardDescription>
                        {selectedCompanyDetails.description}
                          </CardDescription>
                    )}

                        {/* Vendor Enrichment Feedback */}
                        {isEnrichingVendor && (
                          <Alert className="mb-3">
                            <AlertDescription>
                              🧠 Auto-populating your profile...
                              <p>Analyzing company data to fill in products, competitors, and industry info</p>
                            </AlertDescription>
                          </Alert>
                        )}

                        {enrichmentCompleted && !isEnrichingVendor && (
                          <Alert className="mb-3">
                            <CheckCircle />
                            <AlertDescription>
                              ✨ Profile auto-populated!
                              <p>Check the sales context step to see your enriched data</p>
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDomain">Company Domain (Auto-filled)</Label>
                <Input
                  id="companyDomain"
                  placeholder="e.g., tesla.com"
                  value={formData.companyDomain}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyDomain: e.target.value }))}
                />
              </div>
            </div>
            
              {/* Persona-Aware Company Intelligence Preview */}
              {formData.company && selectedCompanyDetails && formData.role && (
                <Card>
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
                          <Badge variant="secondary">Strategic Insights</Badge>
                          <Badge variant="secondary">Market Analysis</Badge>
                          <Badge variant="secondary">Competitive Landscape</Badge>
                          <Badge variant="secondary">Business Intelligence</Badge>
                        </>
                      )}
                </div>
                    <CardDescription className="mt-4">
                      AI will prioritize {getPersonaType(formData.role).toLowerCase()} insights when researching prospects.
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </div>
        );

      case 2: // Sales Context
        return (
          <div className="space-y-4">
            <CardHeader>
              <CardTitle>Sales Context</CardTitle>
              <CardDescription>Help us tailor research to your territory and focus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
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
                  <Label htmlFor="defaultResearchContext">Default Research Context</Label>
                  <Select
                    value={formData.defaultResearchContext}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultResearchContext: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default research context" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery Call</SelectItem>
                      <SelectItem value="demo">Demo Preparation</SelectItem>
                      <SelectItem value="proposal">Proposal Development</SelectItem>
                      <SelectItem value="competitive">Competitive Analysis</SelectItem>
                      <SelectItem value="renewal">Renewal Discussion</SelectItem>
                      <SelectItem value="expansion">Expansion Opportunity</SelectItem>
                    </SelectContent>
                  </Select>
                  <CardDescription>
                    This sets the default context for AI research. You can always change this for specific searches.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </div>
        );

      default:
        return null;
    }
  };

  return (
          <div className="min-h-screen">
      {/* Progress Header */}
              <div className="px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1>Sales Assistant Setup</h1>
            <span className="text-muted-foreground">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              // const isValid = validateStep(index); // Validation logic can be added later
              
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <Badge
                    variant={isCompleted ? "default" : isCurrent ? "secondary" : "outline"}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </Badge>
                  <Badge
                    variant={isCurrent ? "secondary" : "outline"}
                  >
                    {step.title}
                  </Badge>
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          {renderStepContent()}
          
          {/* Navigation */}
          <CardFooter className="flex justify-between">
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
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
                <CheckCircle />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
              >
                Next Step
                <ArrowRight />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 