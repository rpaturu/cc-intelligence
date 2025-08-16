import type { 
  IDecisionMaker, 
  OrganizationalLevel, 
  InfluenceLevel, 
  Department 
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const decisionMakers: IDecisionMaker[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Chief Technology Officer",
    company: "Acme Corp",
    department: "Engineering",
    level: "C-Level",
    influence: "High",
    budget: "$2M+ annually",
    avatar: "SC",
    background: "Former Stripe PM, Stanford CS",
    tenure: "8 months",
    linkedin: "linkedin.com/in/sarahchen-tech",
    email: "sarah.chen@acmecorp.com",
    location: "San Francisco, CA",
    recentActivity: [
      "Posted about zero-trust architecture challenges",
      "Attended Okta Connect conference",
      "Joined executive security committee",
      "Published article on modern identity architecture",
      "Spoke at FinTech security summit",
      "Led quarterly engineering all-hands on security priorities"
    ],
    keyInterests: [
      "Identity platform modernization",
      "Zero-trust security",
      "Developer experience",
      "Compliance automation",
      "API security standards",
      "Cloud-native architecture"
    ],
    buyingSignals: [
      "Evaluating identity providers Q1 2025",
      "Posted RFP for identity platform",
      "Budget approved for security upgrades",
      "Requesting demos from multiple vendors",
      "Assembled cross-functional evaluation team",
      "Set timeline for decision by March 2025"
    ],
    connectionOpportunities: [
      "Alumni connection through Stanford CS",
      "Mutual connection at Stripe",
      "Industry conference attendance",
      "Speaking at FinTech events",
      "Technical advisory board positions",
      "Open source project contributions"
    ]
  },
  {
    id: "marcus-rodriguez",
    name: "Marcus Rodriguez",
    role: "VP of Engineering",
    company: "Acme Corp",
    department: "Engineering",
    level: "VP",
    influence: "High",
    budget: "$500K annually",
    avatar: "MR",
    background: "15+ years FinTech security",
    tenure: "3 years",
    email: "marcus.r@acmecorp.com",
    phone: "(555) 123-4567",
    location: "Austin, TX",
    recentActivity: [
      "Currently evaluating SSO solutions",
      "Presented at FinTech Security Summit",
      "Led security architecture review",
      "Implemented new code review processes",
      "Expanded engineering team by 40%",
      "Established security champions program"
    ],
    keyInterests: [
      "Engineering tools optimization",
      "Security implementation",
      "Team productivity",
      "Technical debt reduction",
      "DevSecOps practices",
      "Microservices architecture"
    ],
    buyingSignals: [
      "Budget owner for engineering tools",
      "Evaluating current Auth0 contract",
      "Seeking consolidated security platform",
      "Requested POC environments from vendors",
      "Scheduled technical deep-dive sessions",
      "Comparing integration complexity across solutions"
    ],
    connectionOpportunities: [
      "FinTech security community",
      "Engineering leadership groups",
      "Austin tech meetups",
      "VP Engineering peer networks",
      "Security conference speaker circuit",
      "Technical advisory positions"
    ]
  },
  {
    id: "jennifer-wu",
    name: "Jennifer Wu",
    role: "Chief Information Security Officer",
    company: "Acme Corp",
    department: "Security",
    level: "C-Level",
    influence: "High",
    budget: "$1M+ annually",
    avatar: "JW",
    background: "Former Palantir CISO",
    tenure: "1 year",
    linkedin: "linkedin.com/in/jennifer-wu-security",
    email: "jennifer.wu@acmecorp.com",
    location: "San Francisco, CA",
    recentActivity: [
      "Published blog on identity governance",
      "Led SOC 2 compliance initiative",
      "Hired dedicated security team",
      "Implemented zero-trust pilot program",
      "Established security awareness training",
      "Created incident response playbooks"
    ],
    keyInterests: [
      "Compliance posture",
      "Risk management",
      "Identity governance",
      "Audit readiness",
      "Threat intelligence",
      "Security operations center"
    ],
    buyingSignals: [
      "Mandate to improve compliance",
      "Direct report to CEO",
      "SOC 2 audit identified gaps",
      "ISO 27001 certification planning",
      "Evaluating GRC platforms",
      "Building business case for identity consolidation"
    ],
    connectionOpportunities: [
      "CISO community networks",
      "Security conference circuit",
      "Compliance working groups",
      "Risk management forums",
      "Executive security councils",
      "Vendor advisory boards"
    ]
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getDecisionMakersConcise = (): Array<{
  name: string;
  role: string;
  keySignal: string;
  contact: string;
}> => {
  return decisionMakers.map(dm => ({
    name: dm.name,
    role: dm.role,
    // Pick the strongest buying signal
    keySignal: dm.buyingSignals[0] || "Active in evaluation process",
    contact: dm.email
  }));
};

// Generate comprehensive view with all details
export const getDecisionMakersComprehensive = (): IDecisionMaker[] => {
  return decisionMakers;
};

// Generate summary statistics from comprehensive data
export const getDecisionMakerStats = () => {
  const cLevelCount = decisionMakers.filter(dm => dm.level === "C-Level").length;
  const totalBudget = decisionMakers.reduce((sum, dm) => {
    const budget = dm.budget.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
    if (budget) {
      let amount = parseFloat(budget[1]);
      const unit = budget[2];
      if (unit === 'M') amount *= 1000000;
      else if (unit === 'K') amount *= 1000;
      return sum + amount;
    }
    return sum;
  }, 0);
  
  return {
    totalCount: decisionMakers.length,
    cLevelCount,
    totalBudget: `$${(totalBudget / 1000000).toFixed(1)}M+`,
    highInfluenceCount: decisionMakers.filter(dm => dm.influence === "High").length
  };
};

// Generate persona-specific messaging from comprehensive data
export const getPersonaMessaging = (decisionMakerId: string) => {
  const dm = decisionMakers.find(d => d.id === decisionMakerId);
  if (!dm) return null;
  
  return {
    name: dm.name,
    role: dm.role,
    primaryPainPoints: dm.keyInterests.slice(0, 3),
    topBuyingSignals: dm.buyingSignals.slice(0, 2),
    connectionStrategy: dm.connectionOpportunities[0],
    messagingFocus: dm.role.includes("CTO") ? "technical_architecture" :
                   dm.role.includes("CISO") ? "security_compliance" :
                   dm.role.includes("VP") ? "operational_efficiency" : "general"
  };
};

export const organizationalLevels: OrganizationalLevel[] = [
  "C-Level",
  "VP",
  "Director",
  "Manager"
];

export const influenceLevels: InfluenceLevel[] = [
  "High",
  "Medium", 
  "Low"
];

export const departments: Department[] = [
  "Engineering",
  "Security",
  "IT",
  "Operations",
  "Compliance"
];