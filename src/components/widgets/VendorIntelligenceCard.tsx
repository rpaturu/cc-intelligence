import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../ui/tabs";
import { 
  Building, 
  Target, 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Globe, 
  Layers, 
  GitBranch,
  Shield,
  Award,
  Lightbulb,
  Handshake,
  AlertTriangle,
  Rocket,
  Code,
  Network,
  Activity,
  Database,
  Clock,
  TrendingDown,
  User,
  BarChart3
} from "lucide-react";

// Types
interface VendorContext {
  companyName: string;
  industry: string;
  products?: string[];
  productPortfolio?: Array<{ name: string; description?: string }>;
  targetMarkets?: string[];
  competitors?: Array<{ name: string } | string>;
  valuePropositions?: string[];
  positioningStrategy?: string;
  pricingModel?: string;
  companySize?: string;
  marketPresence?: string;
  recentNews?: string[];
  keyExecutives?: Array<{ name: string; title: string }>;
  businessChallenges?: string[];
  growthIndicators?: string[];
  techStack?: string[];
  partnerships?: string[];
  revenue?: string;
  revenueGrowth?: string;
  stockSymbol?: string;
  marketCap?: string;
  lastUpdated: string;
  dataQuality?: {
    completeness: number;
    freshness: number;
    reliability: number;
    overall: number;
  };
}

interface UserData {
  companyName: string;
  companyDomain: string;
}

interface VendorIntelligenceCardProps {
  vendorIntelligence: VendorContext;
  userData: UserData;
  loadingVendor: boolean;
}

// Helper functions
const formatLastUpdated = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  } catch {
    return "Recently";
  }
};

const formatDataQuality = (score: number) => {
  if (score >= 0.8) return { label: "Excellent", color: "text-green-600" };
  if (score >= 0.6) return { label: "Good", color: "text-blue-600" };
  if (score >= 0.4) return { label: "Fair", color: "text-yellow-600" };
  return { label: "Needs Improvement", color: "text-red-600" };
};

export const VendorIntelligenceCard: React.FC<VendorIntelligenceCardProps> = ({
  vendorIntelligence,
  userData,
  loadingVendor
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  if (!vendorIntelligence && !loadingVendor && userData.companyName) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
        <CardContent className="p-6 text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            <Building2 className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold">Vendor Intelligence API Error</h3>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">
            Could not load vendor intelligence for {userData.companyName}. 
            Check API connectivity and data availability.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!vendorIntelligence) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 border-border animate-in card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted text-muted-foreground rounded-lg p-2">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-foreground">
                {userData.companyName} Intelligence Dashboard
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {userData.companyDomain}
                </Badge>
                {vendorIntelligence.stockSymbol && (
                  <Badge variant="outline" className="text-xs">
                    {vendorIntelligence.stockSymbol}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Live Data</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50 border border-border rounded-lg p-1 shadow-sm animate-in">
            <TabsTrigger
              value="overview"
              className="font-medium hover:text-foreground btn-hover-lift transition-colors duration-150"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="font-medium hover:text-foreground btn-hover-lift transition-colors duration-150"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="competitive"
              className="font-medium hover:text-foreground btn-hover-lift transition-colors duration-150"
            >
              Market
            </TabsTrigger>
            <TabsTrigger
              value="leadership"
              className="font-medium hover:text-foreground btn-hover-lift transition-colors duration-150"
            >
              Leadership
            </TabsTrigger>
            <TabsTrigger
              value="intelligence"
              className="font-medium hover:text-foreground btn-hover-lift transition-colors duration-150"
            >
              Intelligence
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-4">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              {/* Industry Position - Figma Style */}
              <div className="bg-gradient-to-r from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 rounded-lg p-4 border border-border card-hover research-card-entrance">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Industry Position</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {vendorIntelligence.positioningStrategy || "Enterprise-focused cloud identity leader emphasizing security, scalability, and seamless integration"}
                </p>
                <Badge variant="outline" className="text-xs">
                  {vendorIntelligence.industry}
                </Badge>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border card-hover contact-reveal">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Revenue</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {vendorIntelligence.revenue || "$1.8 billion (FY2023)"}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border card-hover contact-reveal">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Growth</span>
                  </div>
                  <p className="text-sm font-medium text-green-600">
                    {vendorIntelligence.revenueGrowth || "30% YoY"}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border card-hover contact-reveal">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Company Size</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {vendorIntelligence.companySize || "Large Enterprise (3,000+ employees)"}
                  </p>
                </div>
                {vendorIntelligence.marketCap && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border card-hover contact-reveal">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Market Cap</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {vendorIntelligence.marketCap}
                    </p>
                  </div>
                )}
              </div>

              {/* Market Presence */}
              {vendorIntelligence.marketPresence && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover value-prop-reveal">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Market Presence</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{vendorIntelligence.marketPresence}</p>
                </div>
              )}

              {/* Recent Developments */}
              {vendorIntelligence.recentNews && vendorIntelligence.recentNews.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Recent Developments</span>
                  </div>
                  <div className="space-y-2">
                    {vendorIntelligence.recentNews.slice(0, 3).map((news: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground mt-1 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{news}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Quality Widget - Figma Style */}
              {vendorIntelligence.dataQuality && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Intelligence Quality</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Completeness</span>
                        <span className="text-xs font-medium">{Math.round(vendorIntelligence.dataQuality.completeness * 100)}%</span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.completeness * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Freshness</span>
                        <span className="text-xs font-medium">{Math.round(vendorIntelligence.dataQuality.freshness * 100)}%</span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.freshness * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Reliability</span>
                        <span className="text-xs font-medium">{Math.round(vendorIntelligence.dataQuality.reliability * 100)}%</span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.reliability * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Overall Score</span>
                        <span className={`text-xs font-medium ${formatDataQuality(vendorIntelligence.dataQuality.overall).color}`}>
                          {Math.round(vendorIntelligence.dataQuality.overall * 100)}%
                        </span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.overall * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Last updated: {formatLastUpdated(vendorIntelligence.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <TabsContent value="products" className="space-y-4">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              {/* Product Portfolio */}
              {vendorIntelligence.productPortfolio && vendorIntelligence.productPortfolio.length > 0 ? (
                <div className="bg-gradient-to-r from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 rounded-lg p-4 border border-border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Product Portfolio</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vendorIntelligence.productPortfolio.map((product: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border card-hover contact-reveal">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Value Propositions */}
              {vendorIntelligence.valuePropositions && vendorIntelligence.valuePropositions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover value-prop-reveal">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Key Value Propositions</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vendorIntelligence.valuePropositions.map((value: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg contact-reveal">
                        <Lightbulb className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span className="text-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Markets */}
              {vendorIntelligence.targetMarkets && vendorIntelligence.targetMarkets.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Target Markets</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vendorIntelligence.targetMarkets.map((market: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs btn-hover-lift">
                        {market}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Model */}
              {vendorIntelligence.pricingModel && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover contact-reveal">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Pricing Strategy</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{vendorIntelligence.pricingModel}</p>
                </div>
              )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <TabsContent value="competitive" className="space-y-4">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              {/* Competitive Landscape */}
              {vendorIntelligence.competitors && vendorIntelligence.competitors.length > 0 && (
                <div className="bg-gradient-to-r from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 rounded-lg p-4 border border-border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Competitive Landscape</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vendorIntelligence.competitors.map((competitor: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border card-hover contact-reveal">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">{competitor.name || competitor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Challenges */}
              {vendorIntelligence.businessChallenges && vendorIntelligence.businessChallenges.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover value-prop-reveal">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-foreground">Business Challenges</span>
                  </div>
                  <div className="space-y-2">
                    {vendorIntelligence.businessChallenges.map((challenge: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg contact-reveal">
                        <TrendingDown className="w-3 h-3 text-amber-600 mt-1 flex-shrink-0" />
                        <span className="text-xs text-amber-700 dark:text-amber-300">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Growth Indicators */}
              {vendorIntelligence.growthIndicators && vendorIntelligence.growthIndicators.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-foreground">Growth Indicators</span>
                  </div>
                  <div className="space-y-2">
                    {vendorIntelligence.growthIndicators.map((indicator: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg contact-reveal">
                        <TrendingUp className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-xs text-green-700 dark:text-green-300">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <TabsContent value="leadership" className="space-y-4">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              {/* Key Executives */}
              {vendorIntelligence.keyExecutives && vendorIntelligence.keyExecutives.length > 0 && (
                <div className="bg-gradient-to-r from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 rounded-lg p-4 border border-border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Key Executives</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {vendorIntelligence.keyExecutives.map((executive: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border card-hover contact-reveal">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 avatar-container">
                            <AvatarFallback className="text-xs">
                              {executive.name ? executive.name.split(' ').map((n: string) => n[0]).join('') : 'EX'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{executive.name}</p>
                            <p className="text-xs text-muted-foreground">{executive.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <TabsContent value="intelligence" className="space-y-4">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              {/* Technology Stack */}
              {vendorIntelligence.techStack && vendorIntelligence.techStack.length > 0 && (
                <div className="bg-gradient-to-r from-muted/30 to-muted/50 dark:from-muted/10 dark:to-muted/20 rounded-lg p-4 border border-border card-hover research-card-entrance">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Technology Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vendorIntelligence.techStack.map((tech: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 btn-hover-lift">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Partnerships */}
              {vendorIntelligence.partnerships && vendorIntelligence.partnerships.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover value-prop-reveal">
                  <div className="flex items-center gap-2 mb-3">
                    <Handshake className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Strategic Partnerships</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {vendorIntelligence.partnerships.map((partner: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg contact-reveal">
                        <Network className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        <span className="text-xs">{partner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Quality Metrics */}
              {vendorIntelligence.dataQuality && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border card-hover ai-breathing">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Intelligence Quality</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Completeness</span>
                        <span className="text-xs font-medium">{Math.round(vendorIntelligence.dataQuality.completeness * 100)}%</span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.completeness * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Freshness</span>
                        <span className="text-xs font-medium">{Math.round(vendorIntelligence.dataQuality.freshness * 100)}%</span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.freshness * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Reliability</span>
                        <span className="text-xs font-medium">{Math.round(vendorIntelligence.dataQuality.reliability * 100)}%</span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.reliability * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Overall Score</span>
                        <span className={`text-xs font-medium ${formatDataQuality(vendorIntelligence.dataQuality.overall).color}`}>
                          {Math.round(vendorIntelligence.dataQuality.overall * 100)}%
                        </span>
                      </div>
                      <Progress value={vendorIntelligence.dataQuality.overall * 100} className="h-2" />
                    </div>
                  </div>
                  {vendorIntelligence.lastUpdated && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Last updated: {formatLastUpdated(vendorIntelligence.lastUpdated)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
};
