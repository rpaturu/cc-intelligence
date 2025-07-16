import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { UserProfile, companyPresets } from '../contexts/ProfileContextTypes';
import { 
  User, 
  Building, 
  Target, 
  Users, 
  Award,
  ArrowLeft, 
  Save,
  Trash2,
  Sparkles
} from 'lucide-react';
// Removed CSS import - using inline Tailwind classes for better reliability

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile, clearProfile, loading, error } = useProfile();
  const { user } = useAuth();

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

  const [newProduct, setNewProduct] = useState('');
  const [newValueProp, setNewValueProp] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        // Auto-populate email from user registration if not already set
        email: profile.email || user?.email || user?.attributes?.email || ''
      });
    } else if (user) {
      // If no profile but user exists, pre-populate email
      setFormData(prev => ({
        ...prev,
        email: user.email || user.attributes?.email || ''
      }));
    }
  }, [profile, user]);

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
        company,
        companyDomain: '',
        industry: '',
        primaryProducts: [],
        keyValueProps: [],
        mainCompetitors: [],
        targetIndustries: []
      }));
      }
  };

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

  const handleClear = () => {
    clearProfile();
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Action buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Intelligence
            </Button>
            </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Profile
            </Button>
            <Button
              onClick={handleSave}
              loading={loading}
              loadingText="Saving..."
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Sales Profile Setup</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Configure your profile to get personalized, context-aware research insights. 
            The AI assistant will tailor its analysis based on your company, products, and sales focus.
          </p>
        </div>

        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
              </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                placeholder="e.g., Ramesh Paturu"
                value={formData.name}
                onChange={(e) => setFormData((prev: UserProfile) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role/Title *</Label>
              <Input
                id="role"
                placeholder="e.g., Sales Account Manager"
                value={formData.role}
                onChange={(e) => setFormData((prev: UserProfile) => ({ ...prev, role: e.target.value }))}
                  />
                </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Verified)</Label>
                  <Input
                    id="email"
                type="email"
                placeholder="ramesh@company.com"
                value={formData.email}
                    disabled
                className="bg-muted text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Enterprise Sales"
                value={formData.department}
                onChange={(e) => setFormData((prev: UserProfile) => ({ ...prev, department: e.target.value }))}
                  />
                </div>
              </div>
        </Card>

        {/* Company Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Company Information</h2>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="company-preset">Quick Setup (Optional)</Label>
            <div className="flex gap-2 mt-2">
              {Object.keys(companyPresets).map(company => (
                <Button
                  key={company}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompanySelect(company)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-3 h-3" />
                  {company}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                placeholder="e.g., Atlassian"
                value={formData.company}
                onChange={(e) => handleCompanySelect(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDomain">Company Domain</Label>
              <Input
                id="companyDomain"
                placeholder="e.g., atlassian.com"
                value={formData.companyDomain}
                onChange={(e) => setFormData((prev: UserProfile) => ({ ...prev, companyDomain: e.target.value }))}
                  />
                </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="industry">Industry</Label>
                  <Input
                id="industry"
                placeholder="e.g., Software Development Tools"
                value={formData.industry}
                onChange={(e) => setFormData((prev: UserProfile) => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
              </div>
        </Card>

        {/* Products & Value Props */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Products & Value Propositions</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Products *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a product (e.g., Jira)"
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

            <div className="space-y-2">
              <Label>Key Value Propositions</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a value prop (e.g., Team collaboration)"
                  value={newValueProp}
                  onChange={(e) => setNewValueProp(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('keyValueProps', newValueProp, setNewValueProp)}
                />
                <Button
                  onClick={() => addToArray('keyValueProps', newValueProp, setNewValueProp)}
                  size="sm"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keyValueProps.map((prop, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-chart-2/10 text-chart-2 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-chart-2/20 transition-colors"
                    onClick={() => removeFromArray('keyValueProps', index)}
                  >
                    {prop} ×
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Competitive Intelligence */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Competitive Intelligence</h2>
          </div>

          <div className="space-y-2">
            <Label>Main Competitors</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a competitor (e.g., Linear, Asana)"
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
        </Card>

        {/* Sales Context */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Sales Context</h2>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="territory">Territory/Region</Label>
              <Input
                id="territory"
                placeholder="e.g., North America, EMEA"
                value={formData.territory || ''}
                onChange={(e) => setFormData((prev: UserProfile) => ({ ...prev, territory: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesFocus">Sales Focus</Label>
                  <Select 
                value={formData.salesFocus} 
                onValueChange={(value) => setFormData((prev: UserProfile) => ({ ...prev, salesFocus: value as 'enterprise' | 'smb' | 'mid-market' | 'startup' }))}
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
              </div>

          <div className="space-y-2 mb-4">
            <Label>Target Industries</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add an industry (e.g., Software Development)"
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
 
          <div className="space-y-2">
            <Label htmlFor="defaultContext">Default Research Context</Label>
            <Select 
              value={formData.defaultResearchContext} 
              onValueChange={(value) => setFormData((prev: UserProfile) => ({ ...prev, defaultResearchContext: value as 'discovery' | 'competitive' | 'partnership' | 'renewal' }))}
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
          </Card>

        {/* Save Actions */}
        <div className="flex justify-center">
                <Button 
            onClick={handleSave}
            loading={loading}
            loadingText="Saving Profile..."
            size="lg"
            className="px-8"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Profile & Start Researching
                </Button>
        </div>
      </div>
    </div>
  );
} 