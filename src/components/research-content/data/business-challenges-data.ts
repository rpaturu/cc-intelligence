import type { 
  IBusinessChallenge, 
  BusinessChallengeCategory, 
  SeverityLevel,
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const businessChallenges: IBusinessChallenge[] = [
  {
    id: "security-compliance-burden",
    title: "Security & Compliance Burden",
    category: "Security",
    severity: "Critical",
    impact: "High",
    timeline: "Q1 2025 - Immediate action required",
    description: "Growing regulatory requirements straining current identity management systems",
    details: [
      "SOC 2 Type II audit identified 8 identity management gaps",
      "PCI DSS compliance requires stronger access controls",
      "Manual user provisioning causing security delays",
      "Password-related security incidents increasing by 40%",
      "ISO 27001 certification process stalled due to identity gaps",
      "Regulatory reporting taking 15+ hours weekly"
    ],
    businessImpact: {
      cost: "$250K annual compliance costs + $100K audit remediation",
      security: "8 critical security gaps, 40% increase in incidents",
      compliance: "Risk of failing SOC 2 renewal, ISO 27001 delays",
      productivity: "IT team spending 60% time on compliance activities",
      reputation: "Customer trust at risk from security incidents"
    },
    painPoints: [
      "Manual identity processes don't scale with growth",
      "Multiple point solutions create security gaps",
      "Audit preparation consuming excessive resources",
      "Lack of automated compliance reporting",
      "Inconsistent access controls across systems"
    ],
    solutions: [
      {
        title: "Unified Identity Platform",
        description: "Consolidate identity management with automated compliance",
        roi: "60% reduction in compliance overhead, $150K annual savings",
        timeframe: "3-6 months implementation"
      },
      {
        title: "Automated Provisioning",
        description: "Eliminate manual user lifecycle management",
        roi: "40% reduction in IT overhead, 90% faster onboarding",
        timeframe: "2-4 months implementation"
      }
    ]
  },
  {
    id: "operational-inefficiencies",
    title: "Operational Inefficiencies",
    category: "Operational",
    severity: "High", 
    impact: "High",
    timeline: "Ongoing - Growing with scale",
    description: "Multiple identity systems creating significant operational friction",
    details: [
      "IT spends 15 hours/week on user access requests",
      "New employee onboarding takes 3-5 days",
      "Users maintain 8+ different passwords",
      "Help desk tickets for password resets up 40%",
      "Manual offboarding creates security risks",
      "Cross-system access reviews taking weeks"
    ],
    businessImpact: {
      cost: "$85K annual IT overhead for manual processes",
      productivity: "3-5 day onboarding delays, 15 hours/week IT burden",
      helpdesk: "40% increase in password reset tickets",
      business: "New hire productivity delayed, customer impact"
    },
    painPoints: [
      "Manual provisioning doesn't scale",
      "Password fatigue leading to security risks",
      "Inconsistent access across applications",
      "Time-consuming offboarding processes",
      "IT team overwhelmed with routine tasks"
    ],
    solutions: [
      {
        title: "Single Sign-On (SSO)",
        description: "Unified authentication across all applications",
        roi: "50% reduction in help desk tickets, improved user experience",
        timeframe: "1-3 months implementation"
      },
      {
        title: "Automated Lifecycle Management", 
        description: "Streamline onboarding and offboarding processes",
        roi: "80% faster onboarding, eliminated security gaps",
        timeframe: "2-4 months implementation"
      }
    ]
  },
  {
    id: "scaling-challenges",
    title: "Scaling Challenges",
    category: "Strategic",
    severity: "High",
    impact: "High", 
    timeline: "Next 12 months - Critical for growth",
    description: "Current identity systems won't support planned growth and expansion",
    details: [
      "Hiring 200+ employees in next 12 months",
      "International expansion planned for Q3 2025",
      "Need to support contractors and partners",
      "Current systems lack automation capabilities",
      "Multi-region compliance requirements",
      "Partner integration needs growing"
    ],
    businessImpact: {
      growth: "Growth plans at risk without scalable identity",
      complexity: "Manual processes will become unmanageable",
      cost: "Linear cost increase with headcount growth"
    },
    painPoints: [
      "Manual processes won't scale to 200+ new hires", 
      "International compliance complexity",
      "Partner access management challenges",
      "Lack of automation for routine tasks",
      "Regional data residency requirements"
    ],
    solutions: [
      {
        title: "Cloud-Native Identity Platform",
        description: "Scalable platform supporting global expansion",
        roi: "Linear scaling without operational overhead increase",
        timeframe: "4-6 months implementation"
      },
      {
        title: "Partner Identity Management",
        description: "Secure external user management capabilities",
        roi: "Faster partner onboarding, reduced security risk",
        timeframe: "3-5 months implementation"
      }
    ]
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getBusinessChallengesConcise = (): Array<{
  title: string;
  severity: SeverityLevel;
  impact: string;
  keyPainPoint: string;
}> => {
  return businessChallenges.map(challenge => ({
    title: challenge.title,
    severity: challenge.severity,
    impact: challenge.businessImpact.cost || challenge.businessImpact.productivity || "Significant operational impact",
    keyPainPoint: challenge.painPoints[0] || "Identity management complexity"
  }));
};

// Generate comprehensive view with all details
export const getBusinessChallengesComprehensive = (): IBusinessChallenge[] => {
  return businessChallenges;
};

// Generate summary statistics from comprehensive data
export const getBusinessChallengeStats = () => {
  const criticalCount = businessChallenges.filter(c => c.severity === "Critical").length;
  const highImpactCount = businessChallenges.filter(c => c.impact === "High").length;
  const categories = [...new Set(businessChallenges.map(c => c.category))];
  
  return {
    totalCount: businessChallenges.length,
    criticalCount,
    highImpactCount,
    categoriesCount: categories.length,
    primaryCategory: categories[0]
  };
};

// Generate category-specific challenges
export const getChallengesByCategory = (category: BusinessChallengeCategory) => {
  return businessChallenges.filter(challenge => challenge.category === category);
};

// Generate ROI-focused messaging for executives
export const getChallengeROIMessaging = () => {
  return businessChallenges.map(challenge => ({
    title: challenge.title,
    impact: challenge.businessImpact,
    topSolution: challenge.solutions[0],
    urgency: challenge.timeline
  }));
};

export const businessChallengeCategories: BusinessChallengeCategory[] = [
  "Technical",
  "Operational", 
  "Security",
  "Risk & Compliance",
  "User Experience",
  "Strategic"
];

export const severityLevels: SeverityLevel[] = [
  "Critical",
  "High", 
  "Medium",
  "Low"
];