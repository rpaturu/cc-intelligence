import type { 
  ICompetitivePosition, 
  CompetitorCategory,
  PositioningStrategy
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const competitivePositioning: ICompetitivePosition[] = [
  {
    id: "auth0-displacement",
    competitor: "Auth0",
    category: "Current Provider",
    strategy: "Displacement",
    confidence: "High",
    priority: 1,
    title: "Auth0 Contract Renewal Opportunity",
    description: "Position against current CIAM provider with unified platform advantage",
    currentStatus: "Contract expires Q2 2025 with 40% price increase proposed",
    ourAdvantages: [
      "Unified workforce + customer identity platform",
      "7,000+ pre-built integrations vs Auth0's limited ecosystem", 
      "Enterprise-grade governance built-in vs add-on modules",
      "Better scalability - handles 100B+ authentications annually"
    ],
    theirWeaknesses: [
      "Customer-only focus, no workforce identity",
      "Limited enterprise governance capabilities",
      "Expensive add-on modules for compliance",
      "Support quality declining, renewal pricing aggressive"
    ],
    talkingPoints: [
      "One platform eliminates operational overhead of multiple identity systems",
      "Built-in compliance vs piecemeal Auth0 add-ons",
      "Proven enterprise scale and reliability",
      "Cost savings through vendor consolidation"
    ],
    objectionHandling: {
      "Auth0 is good enough": "Emphasize operational overhead of managing multiple identity systems and security gaps between workforce and customer identity",
      "Auth0 integration costs": "Highlight sunk cost fallacy and long-term TCO benefits of unified platform",
      "Migration complexity": "Provide detailed migration plan and professional services support"
    },
    competitiveBattleCard: {
      winningMessage: "While Auth0 serves customer identity well, you need a unified platform that handles both workforce and customer identity without operational complexity.",
      keyProofPoints: [
        "Customer case study: Similar FinTech saved $400K annually switching from Auth0",
        "Enterprise governance capabilities built-in vs Auth0 add-ons",
        "99.9% uptime SLA with 24/7 enterprise support"
      ],
      riskMitigation: [
        "Proven migration methodology with zero downtime",
        "Dedicated customer success manager throughout transition", 
        "Professional services team with Auth0 migration experience"
      ]
    }
  },
  {
    id: "microsoft-entra-defense",
    competitor: "Microsoft Entra ID",
    category: "Bundled Solution",
    strategy: "Defensive",
    confidence: "Medium",
    priority: 2, 
    title: "Microsoft Entra ID Bundling Defense",
    description: "Defend against Microsoft's 'free' identity bundling strategy",
    currentStatus: "Microsoft likely to pitch bundled identity with Office 365",
    ourAdvantages: [
      "Cloud-neutral vs Microsoft's Azure-first approach",
      "7,000+ integrations vs limited third-party app support",
      "Purpose-built for identity vs general productivity focus",
      "Better support for AWS-native applications and services"
    ],
    theirWeaknesses: [
      "Azure-centric, poor multi-cloud support",
      "Limited third-party SaaS integrations",
      "Generic identity solution, not specialized",
      "Hidden costs in licensing complexity"
    ],
    talkingPoints: [
      "Multi-cloud flexibility essential for FinTech companies",
      "Best-of-breed identity vs bundled productivity tool",
      "True cost analysis reveals Microsoft isn't 'free'",
      "AWS-first architecture requires specialized identity platform"
    ],
    objectionHandling: {
      "Microsoft is free": "Calculate hidden costs - licensing complexity, limited functionality, vendor lock-in risks for multi-cloud FinTech",
      "Already have Office 365": "Emphasize limitations of Entra ID for AWS-heavy workloads and third-party integrations",
      "Microsoft ecosystem": "Position as complement, not replacement - best of both worlds"
    },
    competitiveBattleCard: {
      winningMessage: "Microsoft Entra works for Microsoft-centric organizations, but your AWS-first, multi-cloud FinTech architecture needs a specialized identity platform.",
      keyProofPoints: [
        "AWS Partner Advanced status with native IAM integration",
        "FinTech-specific compliance certifications Microsoft lacks",
        "Customer references from similar multi-cloud environments"
      ],
      riskMitigation: [
        "Hybrid deployment options maintain Office 365 integration",
        "Microsoft partnership ensures compatibility",
        "ROI calculator shows true cost comparison"
      ]
    }
  },
  {
    id: "okta-differentiation", 
    competitor: "Okta",
    category: "Direct Competitor",
    strategy: "Differentiation",
    confidence: "Medium",
    priority: 3,
    title: "Okta Competitive Differentiation",
    description: "Position against primary identity management competitor",
    currentStatus: "Okta likely in RFP evaluation as market leader",
    ourAdvantages: [
      "FinTech-specific features and compliance built-in",
      "Better pricing model for growing companies",
      "Specialized customer success for financial services",
      "Integrated fraud detection and risk analytics"
    ],
    theirWeaknesses: [
      "Generic platform, not FinTech-specialized",
      "Complex pricing structure with usage-based costs", 
      "Less focus on financial services compliance",
      "Limited fraud detection capabilities"
    ],
    talkingPoints: [
      "Purpose-built for FinTech vs generic identity platform",
      "Predictable pricing vs Okta's usage-based surprises",
      "Built-in financial services compliance",
      "Integrated fraud prevention saves additional vendor costs"
    ],
    objectionHandling: {
      "Okta is market leader": "Position as FinTech specialist vs generalist - focused expertise matters",
      "Okta ecosystem": "Highlight our FinTech-specific integrations and specialized features",
      "Okta proven scale": "Emphasize our financial services focus and specialized compliance"
    },
    competitiveBattleCard: {
      winningMessage: "Okta is a solid general identity platform, but you need FinTech-specialized features, compliance, and fraud protection built-in.",
      keyProofPoints: [
        "SOC 2 Type II + FinTech-specific certifications",
        "Built-in fraud detection saves $200K+ annually",
        "FinTech customer references with similar use cases"
      ],
      riskMitigation: [
        "Migration path from Okta with minimal disruption",
        "Feature parity guarantee for current Okta capabilities",
        "Okta integration available if needed for legacy systems"
      ]
    }
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getCompetitivePositioningConcise = (): Array<{
  competitor: string;
  strategy: PositioningStrategy;
  keyAdvantage: string;
  winningMessage: string;
}> => {
  return competitivePositioning.slice(0, 3).map(position => ({
    competitor: position.competitor,
    strategy: position.strategy,
    keyAdvantage: position.ourAdvantages[0] || "Specialized platform advantage",
    winningMessage: position.competitiveBattleCard.winningMessage
  }));
};

// Generate comprehensive view with all details
export const getCompetitivePositioningComprehensive = (): ICompetitivePosition[] => {
  return competitivePositioning;
};

// Generate summary statistics from comprehensive data
export const getCompetitivePositioningStats = () => {
  const displacementOpportunities = competitivePositioning.filter(p => p.strategy === "Displacement").length;
  const highConfidencePositions = competitivePositioning.filter(p => p.confidence === "High").length;
  const currentProviderOpportunities = competitivePositioning.filter(p => p.category === "Current Provider").length;
  
  return {
    totalCompetitors: competitivePositioning.length,
    displacementOpportunities,
    highConfidencePositions,
    currentProviderOpportunities,
    primaryThreat: competitivePositioning.find(p => p.priority === 1)?.competitor || "Auth0"
  };
};

// Generate competitor-specific positioning
export const getPositioningByCompetitor = (competitor: string) => {
  return competitivePositioning.find(p => 
    p.competitor.toLowerCase().includes(competitor.toLowerCase())
  );
};

// Generate battle cards for sales team
export const getCompetitiveBattleCards = () => {
  return competitivePositioning.map(position => ({
    competitor: position.competitor,
    category: position.category,
    winningMessage: position.competitiveBattleCard.winningMessage,
    keyProofPoints: position.competitiveBattleCard.keyProofPoints,
    commonObjections: Object.keys(position.objectionHandling || {}),
    riskMitigation: position.competitiveBattleCard.riskMitigation
  }));
};

export const competitorCategories: CompetitorCategory[] = [
  "Current Provider",
  "Direct Competitor", 
  "Bundled Solution",
  "Alternative Platform"
];

export const positioningStrategies: PositioningStrategy[] = [
  "Displacement",
  "Differentiation",
  "Defensive",
  "Flanking"
];