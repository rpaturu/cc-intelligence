import type { 
  IActivityRecord, 
  ActivityCategory,
  ActivityImpact,
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const recentActivities: IActivityRecord[] = [
  {
    id: "series-b-funding",
    category: "Financial",
    title: "Series B Funding Completed",
    date: "December 15, 2024", 
    impact: "High",
    confidence: "Confirmed",
    description: "$50M Series B funding round completed with strategic investors focused on FinTech growth",
    details: [
      "$50M raised from Tier 1 VC firms specializing in B2B SaaS",
      "Board pressure to accelerate growth and market expansion",
      "Funding specifically allocated for engineering and security infrastructure",
      "Runway extends through 2027 with aggressive hiring plans"
    ],
    businessImplications: [
      "Strong financial position eliminates budget constraints",
      "Pressure for rapid deployment of growth initiatives", 
      "Board oversight ensuring ROI on technology investments",
      "Urgency to scale operations and infrastructure"
    ],
    salesImplications: [
      "Decision-making accelerated due to funding pressure",
      "Larger budget allocations for strategic technology purchases",
      "C-level involvement in major infrastructure decisions",
      "Timeline compression for vendor selection processes"
    ],
    sources: ["SEC filing", "Press release", "TechCrunch coverage"],
    relatedStakeholders: ["CEO", "CFO", "CTO", "Board of Directors"],
    followUpActions: [
      "Position as strategic growth enabler aligned with funding goals",
      "Emphasize rapid deployment capabilities for urgent timelines",
      "Highlight enterprise scalability for aggressive expansion plans"
    ]
  },
  {
    id: "cto-hire-stripe",
    category: "Executive",
    title: "New CTO Hired from Stripe",
    date: "April 2024",
    impact: "High", 
    confidence: "Confirmed",
    description: "Sarah Chen joined as CTO from Stripe where she led identity platform initiatives",
    details: [
      "Previously Senior Director of Identity at Stripe for 3 years",
      "Led Stripe's enterprise identity platform expansion",
      "Strong background in FinTech security and compliance",
      "Published thought leadership on modern authentication"
    ],
    businessImplications: [
      "Identity management expertise now in C-level leadership",
      "Stripe experience brings enterprise platform perspective",
      "Technical decision-making authority for security infrastructure",
      "Industry connections from Stripe ecosystem"
    ],
    salesImplications: [
      "Direct engagement opportunity with identity-focused CTO",
      "Stripe experience creates common ground and credibility",
      "Technical depth enables consultative selling approach",
      "C-level champion potential for strategic initiatives"
    ],
    sources: ["LinkedIn announcement", "Company blog", "Industry contacts"],
    relatedStakeholders: ["Sarah Chen (CTO)", "Engineering Team", "Board"],
    followUpActions: [
      "Engage with technical thought leadership content",
      "Reference Stripe's identity challenges and solutions",
      "Position as strategic partner for identity modernization"
    ]
  },
  {
    id: "soc2-audit-completion",
    category: "Compliance", 
    title: "SOC 2 Type II Audit Completed",
    date: "November 2024",
    impact: "Medium",
    confidence: "Confirmed", 
    description: "Successfully completed SOC 2 Type II audit with identified areas for identity management improvement",
    details: [
      "Audit identified 8 specific gaps in identity governance",
      "Manual user provisioning flagged as operational risk",
      "Multi-factor authentication gaps across systems noted",
      "Compliance team expanded to address findings"
    ],
    businessImplications: [
      "Regulatory pressure driving identity infrastructure upgrades",
      "Audit findings create urgency for automated solutions",
      "Enterprise customer requirements demanding compliance",
      "Risk mitigation essential for business growth"
    ],
    salesImplications: [
      "Specific pain points identified through third-party validation", 
      "Compliance urgency creates natural buying triggers",
      "Audit recommendations support solution positioning",
      "Risk-based messaging resonates with stakeholders"
    ],
    sources: ["CISO communications", "Compliance team updates", "Audit documentation"],
    relatedStakeholders: ["Jennifer Wu (CISO)", "Compliance Team", "IT Operations"],
    followUpActions: [
      "Reference audit findings in gap analysis presentations",
      "Position automated solutions as audit remediation",
      "Emphasize compliance-ready platform capabilities"
    ]
  },
  {
    id: "engineering-team-expansion",
    category: "Operational",
    title: "Engineering Team 40% Expansion Planned", 
    date: "January 2025",
    impact: "High",
    confidence: "High",
    description: "Aggressive engineering hiring to support product development and infrastructure scaling",
    details: [
      "Growing from 50 to 70 engineers throughout 2025",
      "Focus on platform engineering and security roles", 
      "International expansion driving infrastructure needs",
      "DevOps and SRE teams doubling in size"
    ],
    businessImplications: [
      "Scaling challenges requiring automated identity management",
      "Infrastructure complexity increasing with team growth",
      "Operational overhead of manual processes becoming unsustainable",
      "Engineering productivity directly tied to tooling efficiency"
    ],
    salesImplications: [
      "Identity platform becomes business-critical for scaling",
      "Automation benefits quantifiable with larger team",
      "Engineering leadership involved in tooling decisions",
      "Productivity metrics drive purchasing decisions"
    ],
    sources: ["Engineering leadership communications", "Job postings", "HR planning"],
    relatedStakeholders: ["Marcus Rodriguez (VP Eng)", "HR Team", "Engineering Managers"],
    followUpActions: [
      "Calculate productivity gains from automated onboarding",
      "Position as engineering productivity enabler", 
      "Demonstrate integration capabilities for engineering tools"
    ]
  },
  {
    id: "european-expansion-planning",
    category: "Strategic",
    title: "European Expansion Initiative",
    date: "Q3 2025 Target",
    impact: "High",
    confidence: "High",
    description: "Strategic expansion into European markets with regulatory compliance requirements",
    details: [
      "UK office lease signed for London headquarters",
      "GDPR compliance requirements for European operations",
      "Local hiring planned for sales and customer success",
      "Multi-region infrastructure deployment needed"
    ],
    businessImplications: [
      "International compliance adding complexity to identity management",
      "Data residency requirements for European customers", 
      "Multi-region operations requiring centralized identity governance",
      "Regulatory oversight across multiple jurisdictions"
    ],
    salesImplications: [
      "Global platform capabilities essential for expansion",
      "Compliance certifications critical for European market entry",
      "Multi-region deployment becomes strategic requirement",
      "International references and case studies valuable"
    ],
    sources: ["Executive planning", "Legal team updates", "HR communications"],
    relatedStakeholders: ["CEO", "Legal Team", "International Team"],
    followUpActions: [
      "Emphasize global platform and compliance capabilities",
      "Provide European customer references and case studies",
      "Demonstrate multi-region deployment expertise"
    ]
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getRecentActivitiesConcise = (): Array<{
  title: string;
  date: string;
  impact: ActivityImpact;
  keyImplication: string;
}> => {
  return recentActivities.slice(0, 3).map(activity => ({
    title: activity.title,
    date: activity.date,
    impact: activity.impact,
    keyImplication: activity.businessImplications[0] || "Strategic initiative underway"
  }));
};

// Generate comprehensive view with all details
export const getRecentActivitiesComprehensive = (): IActivityRecord[] => {
  return recentActivities;
};

// Generate summary statistics from comprehensive data
export const getRecentActivitiesStats = () => {
  const highImpactActivities = recentActivities.filter(a => a.impact === "High").length;
  const confirmedActivities = recentActivities.filter(a => a.confidence === "Confirmed").length;
  const recentActivitiesCount = recentActivities.filter(a => {
    const activityDate = new Date(a.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return activityDate > threeMonthsAgo;
  }).length;
  
  return {
    totalActivities: recentActivities.length,
    highImpactActivities,
    confirmedActivities,
    recentActivitiesCount,
    primaryCategory: recentActivities[0]?.category || "Financial"
  };
};

// Generate activities by category
export const getActivitiesByCategory = (category: ActivityCategory) => {
  return recentActivities.filter(activity => activity.category === category);
};

// Generate timeline view
export const getActivitiesTimeline = () => {
  return recentActivities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(activity => ({
      date: activity.date,
      title: activity.title,
      impact: activity.impact,
      category: activity.category,
      keyImplication: activity.businessImplications[0]
    }));
};

// Generate sales-focused activity insights
export const getSalesRelevantActivities = () => {
  return recentActivities.map(activity => ({
    title: activity.title,
    salesImplications: activity.salesImplications,
    followUpActions: activity.followUpActions,
    relatedStakeholders: activity.relatedStakeholders
  }));
};

export const activityCategories: ActivityCategory[] = [
  "Financial",
  "Executive", 
  "Operational",
  "Strategic",
  "Compliance",
  "Technical"
];