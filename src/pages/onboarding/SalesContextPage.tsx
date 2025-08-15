import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

const SalesContextPage = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  
  const [formData, setFormData] = useState({
    territory: data.territory || "",
    salesFocus: data.salesFocus || "",
    defaultResearchContext: data.defaultResearchContext || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update onboarding data
    updateData(formData);
    
    // Create complete profile
    const profileData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: user?.email || '',
      role: data.role,
      department: data.department || '',
      company: data.company,
      companyDomain: data.companyDomain || '',
      territory: formData.territory,
      salesFocus: formData.salesFocus as 'enterprise' | 'smb' | 'mid-market' | 'startup',
      defaultResearchContext: formData.defaultResearchContext as 'discovery' | 'competitive' | 'partnership' | 'renewal',
      primaryProducts: [],
      keyValueProps: [],
      mainCompetitors: [],
      targetIndustries: []
    };

    try {
      await updateProfile(profileData);
      navigate('/research');
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const handleBack = () => {
    navigate('/onboarding/company');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateData({ [field]: value }); // Save to onboarding context immediately
  };

  const isFormValid = formData.territory && formData.salesFocus && formData.defaultResearchContext;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg md:max-w-4xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Context</CardTitle>
              <CardDescription>Configure your sales preferences</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">Step 4 of 4</div>
          </div>
          <Progress value={100} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="territory">Territory</Label>
              <Select value={formData.territory} onValueChange={(value) => handleInputChange("territory", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your territory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
                  <SelectItem value="middle-east-africa">Middle East & Africa</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salesFocus">Sales focus</Label>
              <Select value={formData.salesFocus} onValueChange={(value) => handleInputChange("salesFocus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your sales focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                  <SelectItem value="mid-market">Mid-Market (200-1000 employees)</SelectItem>
                  <SelectItem value="smb">Small & Medium Business (&lt; 200 employees)</SelectItem>
                  <SelectItem value="startup">Startup & Early Stage</SelectItem>
                  <SelectItem value="public-sector">Public Sector</SelectItem>
                  <SelectItem value="non-profit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultResearchContext">Primary research context</Label>
              <Select value={formData.defaultResearchContext} onValueChange={(value) => handleInputChange("defaultResearchContext", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select research context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery Call Preparation</SelectItem>
                  <SelectItem value="demo">Demo Preparation</SelectItem>
                  <SelectItem value="proposal">Proposal Preparation</SelectItem>
                  <SelectItem value="competitive">Competitive Analysis</SelectItem>
                  <SelectItem value="account-planning">Account Planning</SelectItem>
                  <SelectItem value="renewal">Renewal Preparation</SelectItem>
                  <SelectItem value="expansion">Expansion Opportunities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!isFormValid}
              >
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesContextPage; 