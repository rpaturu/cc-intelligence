import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, ArrowRight, Search, CheckCircle } from "lucide-react";
import { useOnboarding } from '../../contexts/OnboardingContext';
import { lookupCompanies } from '../../lib/api';
import { CompanyIntelligenceWidget } from '../../components/widgets/VendorIntelligenceWidget';

interface CompanySearchResult {
  name: string;
  domain?: string;
  description?: string;
}

const CompanyInfoPage = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  
  const [formData, setFormData] = useState<{
    company: string;
    companyDomain: string;
  }>({
    company: data.company || "",
    companyDomain: data.companyDomain || "",
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [companySelected, setCompanySelected] = useState(false);
  const [lastInputTime, setLastInputTime] = useState<number>(0);
  
  // Sync form data with onboarding context
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      company: data.company || prev.company,
      companyDomain: data.companyDomain || prev.companyDomain
    }));
  }, [data.company, data.companyDomain]);
  
  // Removed API integration state - CompanyIntelligenceWidget handles its own state

  // Get user role from onboarding data
  const userRole = data.role || "account-executive";





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(formData);
    navigate('/onboarding/context');
  };

  const handleBack = () => {
    navigate('/onboarding/personal');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateData({ [field]: value });
    
    // Only auto-select if the user is actively typing (not from initialization or browser autofill)
    if (field === 'company' && value.trim().length > 2 && !companySelected && value !== data.company) {
      // Check if this might be browser autofill by looking at timing
      const now = Date.now();
      if (!lastInputTime || (now - lastInputTime) > 100) {
        // This is likely user input, not autofill
        setCompanySelected(true);
      }
    }
    
    // Track input timing to detect autofill
    setLastInputTime(Date.now());
  };

  const handleCompanySearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    
    try {
      const response = await lookupCompanies(searchQuery);
      setSearchResults(response.data.companies.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      setSearchError('Failed to search companies. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCompanySelect = (result: CompanySearchResult) => {
    const newFormData = {
      company: result.name,
      companyDomain: result.domain || ""
    };
    
    // Force immediate update of form data
    const updatedFormData = {
      ...formData,
      ...newFormData
    };
    
    setFormData(updatedFormData);
    
    // Update onboarding context
    updateData(newFormData);
    
    // Clear search and mark as selected
    setSearchQuery(""); // Clear search query
    setSearchResults([]);
    setCompanySelected(true); // Mark company as selected
  };

  const isFormValid = formData.company && formData.companyDomain;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg md:max-w-4xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Help us understand your company</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">Step 3 of 4</div>
          </div>
          <Progress value={75} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Search Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Search for your company</h3>
                <p className="text-sm text-muted-foreground mb-4">Find your company from our database</p>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value.trim()) {
                      setSearchResults([]);
                    }
                  }}
                  placeholder="e.g. Okta, Microsoft, Tesla..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCompanySearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="shrink-0"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Search</span>
                </Button>
              </div>
              
              {searchError && (
                <Alert variant="destructive">
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}
              
              {searchResults.length > 0 && (
                <div className="border rounded-md bg-background">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        console.log('CompanyInfoPage: Button clicked for result:', result);
                        handleCompanySelect(result);
                      }}
                      className="w-full p-3 text-left hover:bg-accent border-b last:border-b-0 flex items-center justify-between"
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-muted-foreground">{result.domain}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t" />
            
            {/* Selected Company Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Company Information</h3>
                {companySelected && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCompanySelected(false);
                      setFormData(prev => ({ ...prev, company: "", companyDomain: "" }));
                      updateData({ company: "", companyDomain: "" });
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company name</Label>
                <div className="relative">
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Enter company name"
                    required
                    readOnly={companySelected}
                    className={companySelected ? "bg-muted pr-16" : ""}
                    autoComplete="off"
                  />
                  {companySelected && formData.company && (
                    <Badge 
                      variant="secondary" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                    >
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyDomain">Company domain</Label>
                <Input
                  id="companyDomain"
                  value={formData.companyDomain}
                  onChange={(e) => handleInputChange("companyDomain", e.target.value)}
                  placeholder="Enter company domain"
                  required
                  readOnly={companySelected}
                  className={companySelected ? "bg-muted" : ""}
                  autoComplete="off"
                />
              </div>
            </div>
            
            {/* Company Intelligence Widget */}
            {companySelected && formData.company && (
              <CompanyIntelligenceWidget 
                companyName={formData.company}
                companyDomain={formData.companyDomain}
                userRole={userRole}
              />
            )}
            
            
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
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyInfoPage; 