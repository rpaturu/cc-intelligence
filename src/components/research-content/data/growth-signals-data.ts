import type { 
  IGrowthSignal, 
  GrowthCategory,
  GrowthStage,
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const growthSignals: IGrowthSignal[] = [
  {
    id: "aggressive-hiring-expansion",
    category: "Team Expansion",
    title: "Aggressive Hiring Across All Departments",
    stage: "High Growth",
    confidence: "Confirmed",
    timeframe: "Next 12 months",
    strength: 92,
    description: "200+ open positions posted across engineering, sales, and support with immediate start dates",
    indicators: [
      "200+ job postings across all departments",
      "Engineering team growing 40% (50→70 engineers)",
      "Sales team doubling from 15 to 30 representatives",
      "Customer Success team expanded by 100% in last 6 months",
      "International expansion team of 12 hired in Q4 2024"
    ],
    businessImplications: [
      "Identity management becomes critical at this scale",
      "Manual onboarding processes will break with 200+ new hires",
      "IT overhead will become unsustainable without automation",
      "Security risks increase with rapid team scaling"
    ],
    infrastructureNeeds: [
      "Automated user provisioning for 200+ new employees",
      "Scalable onboarding workflows across departments",
      "Role-based access management for diverse teams",
      "International employee identity management"
    ],
    urgencyFactors: [
      "New hire productivity depends on quick access provisioning",
      "Manual processes already taking 3-5 days per new employee",
      "IT team overwhelmed with current hiring pace",
      "Compliance requirements for all new user accounts"
    ],
    roi_metrics: {
      currentCost: "15 hours/week IT time on manual provisioning",
      projectedCost: "60+ hours/week without automation",
      automationSavings: "$200K annually in IT productivity",
      timeToProductivity: "Reduce onboarding from 5 days to 1 day"
    }
  },
  {
    id: "international-expansion",
    category: "Geographic Expansion", 
    title: "European Market Entry Q3 2025",
    stage: "Market Expansion",
    confidence: "High",
    timeframe: "Q3 2025",
    strength: 88,
    description: "Strategic expansion into European markets with regulatory compliance requirements",
    indicators: [
      "UK office lease signed for London HQ (50-person capacity)",
      "European regulatory approval process initiated", 
      "Local hiring for sales, support, and compliance teams",
      "Multi-currency payment processing development underway",
      "GDPR compliance project funded and resourced"
    ],
    businessImplications: [
      "Multi-region identity management requirements",
      "European data residency and privacy compliance",
      "Complex regulatory landscape requiring governance",
      "International workforce access management needs"
    ],
    infrastructureNeeds: [
      "Multi-region identity deployment architecture",
      "GDPR-compliant user data management",
      "European employee identity federation",
      "Cross-border access policy management"
    ],
    urgencyFactors: [
      "GDPR compliance mandatory for EU operations",
      "Q3 2025 launch timeline requires infrastructure readiness",
      "International team onboarding scheduled for Q2 2025",
      "Customer data residency requirements"
    ],
    roi_metrics: {
      marketOpportunity: "$15M additional ARR potential in Europe",
      complianceCost: "$500K+ if non-compliant",
      infrastructureSavings: "$300K vs building separate European identity",
      timeToMarket: "6 months faster with existing platform"
    }
  },
  {
    id: "product-development-acceleration",
    category: "Product Development",
    title: "Product Development 3x Acceleration",
    stage: "Innovation",
    confidence: "High", 
    timeframe: "Ongoing",
    strength: 85,
    description: "Engineering velocity increasing dramatically with new feature releases and platform capabilities",
    indicators: [
      "Engineering budget increased 60% for 2025",
      "Product releases moved from quarterly to monthly cadence",
      "DevOps team doubled to support increased deployment frequency",
      "API development prioritized for platform extensibility",
      "Customer-requested features being delivered 3x faster"
    ],
    businessImplications: [
      "Developer productivity directly tied to access management efficiency",
      "Rapid deployment cycles require automated security controls", 
      "Feature development teams need flexible access to resources",
      "API development requires sophisticated access policies"
    ],
    infrastructureNeeds: [
      "Developer-friendly authentication and authorization",
      "API access management for internal and external developers",
      "Automated access reviews for rapid team changes",
      "Integration with development and deployment pipelines"
    ],
    urgencyFactors: [
      "Development velocity blocked by manual access processes",
      "Security delays feature releases without automated controls",
      "Customer demands requiring faster feature delivery",
      "Competitive pressure for rapid innovation"
    ],
    roi_metrics: {
      developerProductivity: "25% improvement in feature delivery time",
      securityDelay: "Eliminate 2-day security review delays",
      complianceAutomation: "50% reduction in manual security audits",
      customerSatisfaction: "40% improvement in feature delivery NPS"
    }
  },
  {
    id: "customer-base-expansion",
    category: "Customer Growth",
    title: "Enterprise Customer Acquisition Surge", 
    stage: "Market Growth",
    confidence: "High",
    timeframe: "Next 6 months",
    strength: 80,
    description: "Accelerating enterprise customer acquisition requiring enhanced security and compliance",
    indicators: [
      "Enterprise deal pipeline increased 150% in Q4 2024",
      "Average contract value increased from $50K to $150K",
      "Fortune 500 companies in active evaluation",
      "Enterprise customer success team established",
      "SOC 2 Type II completion driving enterprise interest"
    ],
    businessImplications: [
      "Enterprise customers demand sophisticated identity governance",
      "Compliance requirements becoming table stakes for deals",
      "Customer identity federation needs for enterprise clients",
      "Advanced security features required for large contracts"
    ],
    infrastructureNeeds: [
      "Enterprise-grade identity governance and reporting",
      "Customer identity federation capabilities",
      "Advanced compliance automation and audit trails",
      "Single sign-on for enterprise customer environments"
    ],
    urgencyFactors: [
      "Enterprise deals blocked by insufficient identity capabilities",
      "Competitive disadvantage without advanced governance",
      "Customer compliance audits requiring sophisticated reporting",
      "Revenue growth dependent on enterprise market penetration"
    ],
    roi_metrics: {
      dealVelocity: "40% faster enterprise deal closure",
      avgContractValue: "30% increase in deal size with enterprise features",
      winRate: "60% improvement in competitive enterprise deals",
      customerRetention: "95% enterprise customer renewal rate"
    }
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses  
export const getGrowthSignalsConcise = (): Array<{
  title: string;
  category: GrowthCategory;
  strength: number;
  keyIndicator: string;
}> => {
  return growthSignals.slice(0, 3).map(signal => ({
    title: signal.title,
    category: signal.category,
    strength: signal.strength,
    keyIndicator: signal.indicators[0] || "Significant growth activity detected"
  }));
};

// Generate comprehensive view with all details
export const getGrowthSignalsComprehensive = (): IGrowthSignal[] => {
  return growthSignals;
};

// Generate summary statistics from comprehensive data
export const getGrowthSignalsStats = () => {
  const highStrengthSignals = growthSignals.filter(s => s.strength >= 80).length;
  const confirmedSignals = growthSignals.filter(s => s.confidence === "Confirmed").length;
  const avgStrength = growthSignals.reduce((sum, s) => sum + s.strength, 0) / growthSignals.length;
  const urgentSignals = growthSignals.filter(s => 
    s.timeframe.includes("months") || s.timeframe.includes("Ongoing")
  ).length;
  
  return {
    totalSignals: growthSignals.length,
    highStrengthSignals,
    confirmedSignals,
    avgStrength: Math.round(avgStrength),
    urgentSignals,
    primaryGrowthStage: "High Growth"
  };
};

// Generate signals by category
export const getSignalsByCategory = (category: GrowthCategory) => {
  return growthSignals.filter(signal => signal.category === category);
};

// Generate ROI-focused growth analysis
export const getGrowthROIAnalysis = () => {
  return growthSignals.map(signal => ({
    title: signal.title,
    category: signal.category,
    strength: signal.strength,
    roiMetrics: signal.roi_metrics,
    urgencyFactors: signal.urgencyFactors,
    businessValue: signal.businessImplications[0]
  }));
};

// Generate infrastructure requirements analysis
export const getInfrastructureNeeds = () => {
  const allNeeds = growthSignals.flatMap(signal => signal.infrastructureNeeds);
  const uniqueNeeds = [...new Set(allNeeds)];
  
  return {
    totalRequirements: uniqueNeeds.length,
    criticalNeeds: uniqueNeeds.slice(0, 5),
    commonThemes: [
      "Automated user provisioning and lifecycle management",
      "Multi-region and international compliance",
      "Enterprise-grade governance and reporting", 
      "Developer and API access management",
      "Scalable authentication and authorization"
    ]
  };
};

export const growthCategories: GrowthCategory[] = [
  "Team Expansion",
  "Geographic Expansion",
  "Product Development", 
  "Customer Growth",
  "Revenue Growth",
  "Technology Scaling"
];

export const growthStages: GrowthStage[] = [
  "Early Growth",
  "High Growth", 
  "Market Expansion",
  "Innovation",
  "Market Growth"
];