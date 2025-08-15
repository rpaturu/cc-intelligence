import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import { ArrowRight } from "lucide-react";
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useProfile } from '../../hooks/useProfile';
import { RoleIntelligenceWidget } from '../../components/widgets/RoleIntelligenceWidget';

const PersonalInfoPage = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const { profile } = useProfile();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    department: "",
  });



  // Pre-populate form with existing profile data or onboarding data
  useEffect(() => {
    if (profile?.name) {
      // Split the full name into first and last name
      const nameParts = profile.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName: data.firstName || firstName,
        lastName: data.lastName || lastName,
        role: data.role || profile.role || "",
        department: data.department || "",
      });
    } else {
      // Fallback to onboarding data if profile is empty
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        role: data.role || "",
        department: data.department || "",
      });
    }
  }, [profile, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(formData);
    navigate('/onboarding/company');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateData({ [field]: value }); // Save to onboarding context immediately
  };

  const isFormValid = formData.firstName && formData.lastName && formData.role && formData.department;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg md:max-w-4xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">Step 1 of 3</div>
          </div>
          <Progress value={33.33} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account-executive">Account Executive</SelectItem>
                  <SelectItem value="solutions-engineer">Solutions Engineer</SelectItem>
                  <SelectItem value="sales-development">Sales Development Representative</SelectItem>
                  <SelectItem value="business-development">Business Development Representative</SelectItem>
                  <SelectItem value="sales-manager">Sales Manager</SelectItem>
                  <SelectItem value="customer-success">Customer Success Manager</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Role Description Widget */}
              {formData.role && (
                <RoleIntelligenceWidget 
                  role={formData.role}
                  showFullDetails={false}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="business-development">Business Development</SelectItem>
                  <SelectItem value="customer-success">Customer Success</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="partnerships">Partnerships</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!isFormValid}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoPage; 