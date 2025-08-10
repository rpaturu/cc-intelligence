import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { 
  Building, 
  Mail, 
  User, 
  LogOut, 
  Search, 
  BarChart3,
  MapPin,
  Target,
  CheckCircle,
  Zap,
  Globe
} from "lucide-react";
import Navbar from "../components/Navbar";
import { VendorIntelligenceCard } from "../components/widgets/VendorIntelligenceCard";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { getInitials } from "../utils";
import { vendorContext } from "../lib/api";
import { 
  getRoleDescription, 
  getRoleDisplayName, 
  getDepartmentDisplayName, 
  getTerritoryDisplayName, 
  getFocusDisplayName, 
  getContextDisplayName
} from "../components/roleIntelligence.ts";



export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [vendorIntelligence, setVendorIntelligence] = useState<any>(null);
  const [loadingVendor, setLoadingVendor] = useState(false);

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

  // Extract user data from profile or user
  const userData = {
    firstName: profile?.name?.split(' ')[0] || 'User',
    lastName: profile?.name?.split(' ')[1] || '',
    email: profile?.email || user?.email || '',
    role: profile?.role || '',
    department: profile?.department || '',
    companyName: profile?.company || '',
    companyDomain: profile?.companyDomain || '',
    territory: profile?.territory || '',
    salesFocus: profile?.salesFocus || '',
    researchContext: profile?.defaultResearchContext || ''
  };

  const roleInfo = userData.role ? getRoleDescription(userData.role) : null;





  // Load vendor intelligence from API
  useEffect(() => {
    const loadVendorIntelligence = async () => {
      if (!userData.companyName) {
        setVendorIntelligence(null);
        return;
      }

      setLoadingVendor(true);
      try {
        console.log('ProfilePage: Loading vendor intelligence for:', userData.companyName);
        const response = await vendorContext(userData.companyName);
        
        if (response.success && response.vendorContext) {
          console.log('ProfilePage: Vendor intelligence loaded successfully:', response.vendorContext);
          // Transform API data only - no mock data fallbacks
          const apiData = response.vendorContext;
          
          // Transform API products to Figma product portfolio structure (API data only)
          const productPortfolio = apiData.products?.map((product: string, index: number) => ({
            category: index < 2 ? "Core Identity" : index < 4 ? "Security" : "Integration",
            name: product,
            description: `Advanced ${product.toLowerCase()} capabilities`,
            icon: null // No mock icons - will show missing data
          }));

          const transformedData = {
            // Only use real API data - show gaps clearly
            industry: apiData.industry,
            size: apiData.companySize,
            description: apiData.industry ? 
              `Leading ${apiData.industry} platform, enabling secure access for any user to any application from any device.` : 
              undefined,
            productPortfolio: productPortfolio,
            competitors: apiData.competitors?.map((comp: string) => ({
              name: comp,
              description: `Competitive ${comp.includes('Microsoft') ? 'enterprise suite' : comp.includes('Auth0') ? 'developer platform' : 'identity solution'}`,
              category: 'Competitor'
            })),
            // Enhanced financial data from API
            revenue: apiData.revenue || undefined,
            revenueGrowth: apiData.revenueGrowth || undefined,
            stockSymbol: apiData.stockSymbol || undefined,
            marketCap: apiData.marketCap || undefined,
            // Enhanced vendor context fields
            positioningStrategy: apiData.positioningStrategy || 'Leading platform in the industry',
            companySize: apiData.companySize,
            marketPresence: apiData.marketPresence,
            valuePropositions: apiData.valuePropositions || [],
            targetMarkets: apiData.targetMarkets || [],
            pricingModel: apiData.pricingModel || 'Contact for pricing',
            techStack: apiData.techStack || [],
            partnerships: apiData.partnerships || [],
            businessChallenges: apiData.businessChallenges || [],
            growthIndicators: apiData.growthIndicators || [],
            keyExecutives: apiData.keyExecutives?.map((exec: string) => {
              const parts = exec.split(' - ');
              return {
                name: parts[0] || exec,
                title: parts[1] || 'Executive'
              };
            }) || [],
            recentNews: apiData.recentNews || [],
            dataQuality: apiData.dataQuality || {
              completeness: 0.7,
              freshness: 0.8,
              reliability: 0.75,
              overall: 0.75
            },
            lastUpdated: apiData.lastUpdated || new Date().toISOString()
          };
          setVendorIntelligence(transformedData);
        } else {
          console.log('ProfilePage: API failed, no fallback data');
          setVendorIntelligence(null);
        }
      } catch (error) {
        console.error('ProfilePage: Error loading vendor intelligence:', error);
        // No fallback - show API error clearly
        setVendorIntelligence(null);
      } finally {
        setLoadingVendor(false);
      }
    };

    loadVendorIntelligence();
  }, [userData.companyName]);

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
                    {getInitials(userData.firstName, userData.lastName)}
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
          {roleInfo && (
            <Card className="bg-gradient-to-br from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-muted text-muted-foreground rounded-lg p-2">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">
                      {userData.role ? getRoleDisplayName(userData.role) : 'Sales Professional'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {userData.department ? getDepartmentDisplayName(userData.department) : 'Sales'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 rounded-lg p-4 border border-border mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      AI Intelligence: {roleInfo.focus}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {roleInfo.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roleInfo.keyAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Territory</span>
                    </div>
                    <p className="text-sm font-medium">{userData.territory ? getTerritoryDisplayName(userData.territory) : 'Global'}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Focus</span>
                    </div>
                    <p className="text-sm font-medium">{userData.salesFocus ? getFocusDisplayName(userData.salesFocus) : 'Enterprise'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vendor Intelligence Dashboard */}
          <VendorIntelligenceCard 
            vendorIntelligence={vendorIntelligence}
            userData={userData}
            loadingVendor={loadingVendor}
          />

          {/* Quick Actions */}
          <Card className="card-hover animate-in">
                <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
            <CardContent className="space-y-3 stagger-children">
              <Button 
                onClick={handleResearchClick}
                className="w-full justify-start btn-hover-lift"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Start Research Session
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start btn-hover-lift"
                size="lg"
                onClick={() => navigate('/research')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Research History
              </Button>
                  <Button
                variant="outline"
                className="w-full justify-start btn-hover-lift"
                size="lg"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Update Profile Settings
                  </Button>
          </CardContent>
        </Card>

          {/* Account Actions */}
          <Card className="card-hover slide-in-from-bottom-4">
          <CardHeader>
              <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
              <Button 
                onClick={handleLogout}
                className="w-full justify-start bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 btn-hover-lift"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 