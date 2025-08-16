import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Building, Mail, User, LogOut, Search, MapPin, Target, BarChart3, Shield, Download, Trash2, Settings } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { getInitialsFromProfile } from "../utils/research-utils";
import { CompanyIntelligenceWidget } from "../components/widgets/VendorIntelligenceWidget";
import { RoleIntelligenceWidget } from "../components/widgets/RoleIntelligenceWidget";
import { gdprManager } from "../lib/gdpr-compliance";

// Mapping functions to convert keys to human-readable values
const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    "account-executive": "Account Executive",
    "solutions-engineer": "Solutions Engineer",
    "sales-development": "Sales Development Representative",
    "business-development": "Business Development Representative",
    "sales-manager": "Sales Manager",
    "customer-success": "Customer Success Manager"
  };
  return roleMap[role] || role;
};

const getDepartmentDisplayName = (department: string): string => {
  const departmentMap: Record<string, string> = {
    "sales": "Sales",
    "business-development": "Business Development",
    "customer-success": "Customer Success",
    "marketing": "Marketing",
    "partnerships": "Partnerships"
  };
  return departmentMap[department] || department;
};

const getTerritoryDisplayName = (territory: string): string => {
  const territoryMap: Record<string, string> = {
    "north-america": "North America",
    "europe": "Europe",
    "asia-pacific": "Asia Pacific",
    "latin-america": "Latin America",
    "middle-east-africa": "Middle East & Africa",
    "global": "Global"
  };
  return territoryMap[territory] || territory;
};

const getFocusDisplayName = (focus: string): string => {
  const focusMap: Record<string, string> = {
    "enterprise": "Enterprise",
    "mid-market": "Mid-Market", 
    "smb": "Small & Medium Business",
    "startup": "Startup",
    "government": "Government",
    "education": "Education"
  };
  return focusMap[focus] || focus;
};

const getContextDisplayName = (context: string): string => {
  const contextMap: Record<string, string> = {
    "discovery": "Discovery Call",
    "demo": "Demo Preparation",
    "proposal": "Proposal Development",
    "competitive": "Competitive Analysis",
    "renewal": "Renewal Discussion",
    "expansion": "Expansion Planning"
  };
  return contextMap[context] || context;
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleResearchClick = () => {
    navigate('/research');
  };

  const handleDataExport = async () => {
    if (!user?.userId) return;
    
    try {
      await gdprManager.downloadUserData(user.userId);
      alert('Data export completed successfully! Your data has been downloaded.');
    } catch (error) {
      console.error('Failed to export data:', error);
      if (error instanceof Error) {
        alert(`Failed to export data: ${error.message}. Please ensure you have given consent for data access.`);
      } else {
        alert('Failed to export data. Please try again or contact support.');
      }
    }
  };

  const handleConsentManagement = () => {
    navigate('/consent');
  };

  const handleAccountDeletion = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        if (user?.userId) {
          await gdprManager.implementRightToErasure(user.userId);
          alert('Account data deleted successfully. You will be logged out.');
          await signOut();
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again or contact support.');
      }
    }
  };

  // Extract user data from profile or user
  const userData = {
    firstName: profile?.firstName || 'User',
    lastName: profile?.lastName || '',
    email: profile?.email || user?.email || '',
    role: profile?.role || '',
    department: profile?.department || '',
    companyName: profile?.company || '',
    companyDomain: profile?.companyDomain || '',
    territory: profile?.territory || '',
    salesFocus: profile?.salesFocus || '',
    researchContext: profile?.defaultResearchContext || ''
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Profile Content - Using safe area inset utilities */}
      <div className="max-w-4xl mx-auto px-4 py-8 content-safe md:content-safe-sm">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" alt={`${userData.firstName} ${userData.lastName}`} />
                  <AvatarFallback>
                    {getInitialsFromProfile(userData)}
                  </AvatarFallback>
                </Avatar>
                <div>
            <div className="flex items-center gap-2">
                    <span>{userData.firstName} {userData.lastName}</span>
                    <Badge variant="secondary">{userData.role ? getRoleDisplayName(userData.role) : 'Sales Professional'}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{userData.email}</p>
              </div>
              </CardTitle>
          </CardHeader>
            <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Company:</span>
                    <span>{userData.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Department:</span>
                    <span>{userData.department ? getDepartmentDisplayName(userData.department) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Domain:</span>
                    <span>{userData.companyDomain}</span>
                  </div>
            </div>
            <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Territory:</span>
                    <span>{userData.territory ? getTerritoryDisplayName(userData.territory) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Focus:</span>
                    <span>{userData.salesFocus ? getFocusDisplayName(userData.salesFocus) : 'Enterprise'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Context:</span>
                    <span>{userData.researchContext ? getContextDisplayName(userData.researchContext) : 'N/A'}</span>
            </div>
                </div>
              </div>
          </CardContent>
        </Card>

          {/* Role Intelligence Widget */}
          {userData.role && (
            <RoleIntelligenceWidget 
              role={userData.role}
              department={userData.department}
              territory={userData.territory}
              salesFocus={userData.salesFocus}
              showFullDetails={true}
            />
          )}

          {/* Company Intelligence Widget - Using New Unified Component */}
          {userData.companyName && (
            <CompanyIntelligenceWidget 
              companyName={userData.companyName}
              companyDomain={userData.companyDomain}
              userRole={userData.role || "account-executive"}
                  />
          )}

          {/* Quick Actions */}
          <Card>
                <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleResearchClick}
                className="w-full justify-start"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Start Research Session
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start"
                size="lg"
                onClick={() => navigate('/research')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Research History
              </Button>
                  <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Update Profile Settings
                  </Button>
          </CardContent>
        </Card>

          {/* GDPR & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/privacy')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleDataExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start"
                onClick={handleConsentManagement}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Consent
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button 
                variant="destructive"
                onClick={handleAccountDeletion}
                className="w-full justify-start"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 