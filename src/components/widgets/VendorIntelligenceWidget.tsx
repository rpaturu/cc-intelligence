import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Building, Building2, Users, DollarSign, TrendingUp, Calendar, MapPin,
  Zap, Target, CheckCircle, BarChart3
} from 'lucide-react';
import { vendorContext } from '../../lib/api';

// Helper function for AI config based on role
const getAIConfigForRole = (role: string) => {
  const configs = {
    "account-executive": {
      focus: "Revenue Acceleration",
      description: "AI optimized for deal velocity, competitive positioning, and revenue growth strategies.",
      keyAreas: ["Buying signals detection", "Decision maker mapping", "Competitive intelligence", "Revenue opportunities"]
    },
    "solutions-engineer": {
      focus: "Technical Solution Fit",
      description: "AI tailored for technical requirements, architecture analysis, and implementation planning.",
      keyAreas: ["Technical requirements", "Solution architecture", "Integration planning", "Implementation timeline"]
    },
    "sales-development": {
      focus: "Lead Generation & Qualification",
      description: "AI designed for prospect qualification, outreach optimization, and pipeline development.",
      keyAreas: ["Lead scoring", "Outreach personalization", "Qualification criteria", "Pipeline optimization"]
    },
    "business-development": {
      focus: "Partnership & Market Expansion",
      description: "AI optimized for partnership opportunities, market analysis, and strategic initiatives.",
      keyAreas: ["Partnership mapping", "Market analysis", "Strategic opportunities", "Competitive landscape"]
    },
    "sales-manager": {
      focus: "Team Performance & Strategy",
      description: "AI configured for team analytics, forecast accuracy, and strategic insights.",
      keyAreas: ["Team performance", "Forecast accuracy", "Market trends", "Coaching insights"]
    },
    "customer-success": {
      focus: "Customer Growth & Retention",
      description: "AI tailored for customer health monitoring, expansion identification, and retention strategies.",
      keyAreas: ["Health score tracking", "Expansion signals", "Retention strategies", "Success metrics"]
    }
  };
  
  return configs[role as keyof typeof configs] || configs["account-executive"];
};

interface CompanyIntelligenceData {
  name: string;
  industry: string;
  products: string[];
  targetMarkets: string[];
  competitors: string[];
  valuePropositions: string[];
  positioningStrategy: string;
  pricingModel: string;
  companySize: string;
  marketPresence: string;
  recentNews: string[];
  keyExecutives: string[];
  businessChallenges: string[];
  growthIndicators: string[];
  techStack: string[];
  partnerships: string[];
  lastUpdated: string;
  fromCache?: boolean;
  aiConfig?: {
    focus: string;
    description: string;
    keyAreas: string[];
  };
  // Future API fields
  painPoints?: string[];
  talkingPoints?: string[];
  potentialObjections?: string[];
  buyingSignals?: string[];
  metrics?: {
    revenue?: string;
    growth?: string;
    employees?: string;
    [key: string]: any;
  };
  basicInfo?: {
    headquarters?: string;
    founded?: string;
    website?: string;
    [key: string]: any;
  };
}

interface CompanyIntelligenceWidgetProps {
  companyName: string;
  companyDomain?: string;
  userRole: string;
  className?: string;
  // Configure which sections to show
  sections?: {
    products?: boolean;
    competitors?: boolean;
    techStack?: boolean;
    executives?: boolean;
    news?: boolean;
    partnerships?: boolean;
    growth?: boolean;
    targetMarkets?: boolean;
    valuePropositions?: boolean;
    positioning?: boolean;
    overview?: boolean;
    // Future sections (currently disabled)
    painPoints?: boolean;
    talkingPoints?: boolean;
    objections?: boolean;
    buyingSignals?: boolean;
    metricsGrid?: boolean;
    infoGrid?: boolean;
  };
}

const DEFAULT_SECTIONS = {
  products: true,
  competitors: true,
  techStack: true,
  executives: true,
  news: true,
  partnerships: true,
  growth: true,
  targetMarkets: true,
  valuePropositions: true,
  positioning: true,
  overview: true,
  // Future sections disabled by default
  painPoints: false,
  talkingPoints: false,
  objections: false,
  buyingSignals: false,
  metricsGrid: false,
  infoGrid: false,
};

export function CompanyIntelligenceWidget({ 
  companyName, 
  companyDomain,
  userRole,
  className = "",
  sections = DEFAULT_SECTIONS 
}: CompanyIntelligenceWidgetProps) {
  const [companyIntelligence, setCompanyIntelligence] = useState<CompanyIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeSections = { ...DEFAULT_SECTIONS, ...sections };

  useEffect(() => {
    const fetchCompanyIntelligence = async () => {
      if (!companyName.trim()) {
        setCompanyIntelligence(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const vendorData = await vendorContext(companyName);

        if (vendorData.success) {
          const roleConfig = getAIConfigForRole(userRole || "account-executive");
          
          setCompanyIntelligence({
            name: vendorData.vendorContext.companyName,
            industry: vendorData.vendorContext.industry || 'Technology',
            products: vendorData.vendorContext.products || [],
            targetMarkets: vendorData.vendorContext.targetMarkets || [],
            competitors: vendorData.vendorContext.competitors || [],
            valuePropositions: vendorData.vendorContext.valuePropositions || [],
            positioningStrategy: vendorData.vendorContext.positioningStrategy || '',
            pricingModel: vendorData.vendorContext.pricingModel || '',
            companySize: vendorData.vendorContext.companySize || '',
            marketPresence: vendorData.vendorContext.marketPresence || '',
            recentNews: vendorData.vendorContext.recentNews || [],
            keyExecutives: vendorData.vendorContext.keyExecutives || [],
            businessChallenges: vendorData.vendorContext.businessChallenges || [],
            growthIndicators: vendorData.vendorContext.growthIndicators || [],
            techStack: vendorData.vendorContext.techStack || [],
            partnerships: vendorData.vendorContext.partnerships || [],
            lastUpdated: vendorData.vendorContext.lastUpdated,
            fromCache: vendorData.metadata.fromCache,
            aiConfig: {
              focus: roleConfig.focus,
              description: roleConfig.description,
              keyAreas: roleConfig.keyAreas
            }
          });
        } else {
          throw new Error('Vendor context API returned unsuccessful response');
        }
      } catch (err) {
        setError('Failed to fetch company intelligence.');
        console.error('Company intelligence error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyIntelligence();
  }, [companyName]);

  if (loading) {
    return (
      <Card className={`bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-slate-200 dark:border-slate-800 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
            <span className="text-sm text-slate-700 dark:text-slate-300">Loading company intelligence...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-slate-200 dark:border-slate-800 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!companyIntelligence) {
    return null;
  }

  return (
    <Card className={`bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-slate-200 dark:border-slate-800 ${className}`}>
      <CardContent className="p-6">
        {/* Consolidated Company Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{companyIntelligence.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {companyDomain || `${companyIntelligence.name.toLowerCase().replace(/\s+/g, '')}.com`}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Live Data
              </Badge>
              {companyIntelligence.fromCache && (
                <Badge variant="secondary" className="text-xs">
                  Cached
                </Badge>
              )}
              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
            {companyIntelligence.lastUpdated && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last updated: {new Date(companyIntelligence.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Company Overview */}
          {activeSections.overview && (companyIntelligence.companySize || companyIntelligence.marketPresence || companyIntelligence.businessChallenges?.length > 0) && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Company Overview</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.companySize && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Size: </span>
                    <span className="text-slate-600 dark:text-slate-300">{companyIntelligence.companySize}</span>
                  </div>
                )}
                {companyIntelligence.marketPresence && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Market Presence: </span>
                    <span className="text-slate-600 dark:text-slate-300">{companyIntelligence.marketPresence}</span>
                  </div>
                )}
                {companyIntelligence.businessChallenges && companyIntelligence.businessChallenges.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">Business Challenges:</span>
                    <ul className="mt-1 space-y-1">
                      {companyIntelligence.businessChallenges.map((challenge: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-slate-500 dark:text-slate-400">•</span>
                          <span className="text-sm text-slate-600 dark:text-slate-300">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Industry */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-900 dark:text-white">Industry</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{companyIntelligence.industry}</p>
          </div>

          {/* Products & Services */}
          {activeSections.products && companyIntelligence.products?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Products & Services</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyIntelligence.products.slice(0, 6).map((product: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Competitive Landscape */}
          {activeSections.competitors && companyIntelligence.competitors?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Competitive Landscape</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyIntelligence.competitors.slice(0, 5).map((competitor: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {competitor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack */}
          {activeSections.techStack && companyIntelligence.techStack?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Technology Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyIntelligence.techStack.slice(0, 8).map((tech: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Key Executives */}
          {activeSections.executives && companyIntelligence.keyExecutives?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Key Executives</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyIntelligence.keyExecutives.slice(0, 4).map((executive: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {executive}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Recent News */}
          {activeSections.news && companyIntelligence.recentNews?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Recent News</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.recentNews.slice(0, 3).map((news: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-slate-500 dark:text-slate-400">•</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{news}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Partnerships */}
          {activeSections.partnerships && companyIntelligence.partnerships?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Key Partnerships</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyIntelligence.partnerships.slice(0, 6).map((partner: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {partner}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Growth Indicators */}
          {activeSections.growth && companyIntelligence.growthIndicators?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Growth Indicators</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.growthIndicators.slice(0, 3).map((indicator: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Markets */}
          {activeSections.targetMarkets && companyIntelligence.targetMarkets?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Target Markets</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyIntelligence.targetMarkets.map((market: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {market}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Value Propositions */}
          {activeSections.valuePropositions && companyIntelligence.valuePropositions?.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Value Propositions</span>
              </div>
              <div className="space-y-1">
                {companyIntelligence.valuePropositions.map((prop: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-slate-500 dark:text-slate-400">•</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{prop}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Positioning */}
          {activeSections.positioning && (companyIntelligence.positioningStrategy || companyIntelligence.pricingModel) && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Market Positioning</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.positioningStrategy && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Positioning: </span>
                    <span className="text-slate-600 dark:text-slate-300">{companyIntelligence.positioningStrategy}</span>
                  </div>
                )}
                {companyIntelligence.pricingModel && (
                  <div className="text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Pricing Model: </span>
                    <span className="text-slate-600 dark:text-slate-300">{companyIntelligence.pricingModel}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Future API Sections - Empty Placeholders */}
          {/* These sections are disabled by default but ready for future API enhancement */}

          {/* Pain Points (Future) */}
          {activeSections.painPoints && companyIntelligence.painPoints && companyIntelligence.painPoints.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Pain Points</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.painPoints?.map((point: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-slate-500 mt-1">•</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Talking Points (Future) */}
          {activeSections.talkingPoints && companyIntelligence.talkingPoints && companyIntelligence.talkingPoints.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Talking Points</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.talkingPoints?.map((point: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-slate-500 mt-1">•</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Potential Objections (Future) */}
          {activeSections.objections && companyIntelligence.potentialObjections && companyIntelligence.potentialObjections.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Potential Objections</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.potentialObjections?.map((objection: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-slate-500 mt-1">•</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{objection}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buying Signals (Future) */}
          {activeSections.buyingSignals && companyIntelligence.buyingSignals && companyIntelligence.buyingSignals.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Buying Signals</span>
              </div>
              <div className="space-y-2">
                {companyIntelligence.buyingSignals?.map((signal: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-slate-600 dark:text-slate-400 mt-1" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Metrics Grid (Future) */}
          {activeSections.metricsGrid && companyIntelligence.metrics && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Company Metrics</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {companyIntelligence.metrics.revenue && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-muted-foreground">Revenue</span>
                    </div>
                    <p className="text-sm font-medium">{companyIntelligence.metrics.revenue}</p>
                  </div>
                )}
                {companyIntelligence.metrics.growth && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-muted-foreground">Growth</span>
                    </div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">{companyIntelligence.metrics.growth}</p>
                  </div>
                )}
                {companyIntelligence.metrics.employees && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-muted-foreground">Employees</span>
                    </div>
                    <p className="text-sm font-medium">{companyIntelligence.metrics.employees}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Info Grid (Future) */}
          {activeSections.infoGrid && companyIntelligence.basicInfo && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Company Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {companyIntelligence.basicInfo.headquarters && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-muted-foreground">Headquarters</span>
                    </div>
                    <p className="text-sm">{companyIntelligence.basicInfo.headquarters}</p>
                    {companyIntelligence.basicInfo.founded && (
                      <p className="text-xs text-muted-foreground mt-1">Founded {companyIntelligence.basicInfo.founded}</p>
                    )}
                  </div>
                )}
                {companyIntelligence.basicInfo.website && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-muted-foreground">Website</span>
                    </div>
                    <p className="text-sm">{companyIntelligence.basicInfo.website}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Configuration Section */}
          {companyIntelligence.aiConfig && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  AI Configuration: {companyIntelligence.aiConfig.focus}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                {companyIntelligence.aiConfig.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {companyIntelligence.aiConfig.keyAreas.map((area: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
} 