import type { 
  IBuyingSignal, 
  IIntentScore,
  SignalType, 
  UrgencyLevel,
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const buyingSignals: IBuyingSignal[] = [
  {
    id: "rfp-identity-platform",
    type: "procurement",
    category: "Identity Management",
    title: "RFP Process for Identity Platform",
    description: "Formal procurement process initiated for enterprise identity management solution",
    strength: 95,
    impact: "High",
    detected: "January 15, 2025",
    source: "LinkedIn posts, vendor communications",
    confidence: "Confirmed",
    urgency: "immediate", 
    timeline: "Decision by March 31, 2025",
    implications: [
      "Budget approved and allocated for Q1 purchase",
      "Evaluation committee formed with technical and business stakeholders",
      "Current Auth0 contract expires Q2 2025, creating urgency",
      "SOC 2 compliance gaps driving immediate need"
    ],
    details: {
      requirements: [
        "Unified workforce and customer identity platform",
        "SOC 2 Type II compliance and audit readiness", 
        "SCIM 2.0 provisioning for 25+ applications",
        "99.9% uptime SLA with enterprise support",
        "Multi-region deployment capabilities"
      ],
      evaluation: [
        "Technical evaluation phase: January 15 - February 15",
        "Business case and pricing: February 16 - March 1", 
        "Final presentations: March 1 - March 15",
        "Vendor selection and negotiation: March 16 - March 31"
      ],
      stakeholders: [
        "Sarah Chen (CTO) - Technical decision maker",
        "Jennifer Wu (CISO) - Security and compliance lead",
        "Marcus Rodriguez (VP Engineering) - Implementation owner",
        "CFO - Budget approval and contract terms"
      ]
    },
    nextAction: "Submit formal RFP response by February 1, 2025",
    actionItems: [
      "Prepare comprehensive RFP response addressing all requirements",
      "Schedule technical deep-dive session with engineering team",
      "Develop custom pricing proposal with implementation timeline",
      "Arrange reference calls with similar FinTech customers"
    ]
  },
  {
    id: "executive-evaluation",
    type: "research",
    title: "Executive Team Evaluating Identity Solutions",
    description: "C-level executives actively researching and attending identity management events",
    strength: 88,
    impact: "High",
    detected: "January 10, 2025",
    source: "Conference attendance, content downloads",
    confidence: "High",
    urgency: "high",
    timeline: "Active evaluation through Q1 2025",
    implications: [
      "Top-down initiative with CEO visibility",
      "Budget prioritization for identity modernization",
      "Multiple stakeholders involved in evaluation process",
      "Integration with broader digital transformation strategy"
    ],
    details: {
      activities: [
        "CTO attended Okta Connect and Microsoft Ignite conferences",
        "Downloaded enterprise identity white papers and case studies",
        "Engaged with analyst firms for vendor comparisons",
        "Scheduled demos with multiple identity providers"
      ],
      criteria: [
        "Technical capabilities and integration flexibility",
        "Security and compliance certifications",
        "Total cost of ownership and ROI analysis",
        "Vendor stability and long-term roadmap"
      ]
    },
    nextAction: "Engage with CTO and CISO for technical discussions",
    actionItems: [
      "Schedule executive briefing on identity modernization trends",
      "Provide analyst reports and competitive analysis",
      "Arrange technical architecture session",
      "Share customer success stories from similar companies"
    ]
  },
  {
    id: "budget-allocation",
    type: "financial",
    title: "Budget Allocated for Identity Infrastructure",
    description: "Confirmed budget allocation for identity and security infrastructure upgrade",
    strength: 90,
    impact: "High", 
    detected: "December 20, 2024",
    source: "Financial planning documents, executive communications",
    confidence: "Confirmed",
    urgency: "medium",
    timeline: "Spend planned for Q1-Q2 2025",
    implications: [
      "$2M allocated specifically for identity infrastructure",
      "Additional $500K for implementation and professional services",
      "Budget tied to Series B funding with board approval",
      "Spending urgency due to fiscal year planning"
    ],
    details: {
      allocation: [
        "Identity platform license: $400K annually",
        "Implementation services: $300K one-time",
        "Migration and integration: $200K one-time", 
        "Training and change management: $100K one-time"
      ],
      approvalProcess: [
        "Board approved overall security investment",
        "CTO has direct spending authority up to $1M",
        "CFO approval required for multi-year commitments",
        "CEO involved in final vendor selection"
      ]
    },
    nextAction: "Develop investment proposal aligned with allocated budget",
    actionItems: [
      "Create detailed pricing proposal within budget range",
      "Outline ROI justification and payback timeline",
      "Propose phased implementation to optimize spend",
      "Include professional services and training recommendations"
    ]
  },
  {
    id: "competitor-dissatisfaction",
    type: "competitive",
    title: "Auth0 Contract Renewal Risk",
    description: "Current provider relationship showing signs of strain and renewal risk",
    strength: 75,
    impact: "Medium",
    detected: "January 5, 2025",
    source: "Social media posts, support ticket analysis",
    confidence: "High",
    urgency: "high",
    timeline: "Contract expires Q2 2025",
    implications: [
      "Auth0 proposed 40% price increase for renewal",
      "Technical limitations blocking growth plans",
      "Support quality concerns raised by engineering team",
      "Opportunity for competitive displacement"
    ],
    details: {
      currentStatus: [
        "Contract renewal negotiations started",
        "Engineering team expressing frustration with limitations",
        "CTO posted about need for unified identity platform",
        "Evaluation of alternatives already underway"
      ],
      positions: [
        "Price sensitivity due to startup budget constraints",
        "Technical requirements exceeding current platform",
        "Need for workforce identity capabilities not provided",
        "Integration complexity causing development delays"
      ]
    },
    nextAction: "Position unified platform advantages over Auth0 limitations",
    actionItems: [
      "Prepare competitive comparison highlighting our advantages",
      "Develop migration plan from Auth0 to minimize disruption",
      "Showcase unified workforce + customer identity benefits",
      "Offer attractive pricing compared to Auth0 renewal"
    ]
  }
];

// Intent score for overall buying likelihood
export const intentScore: IIntentScore = {
  overall: 92,
  category: "Identity Management",
  confidence: 95,
  timeframe: "Q1 2025 (next 90 days)",
  likelihood: "Very High - Active procurement process",
  trend: "accelerating",
  lastUpdated: "January 15, 2025",
  keyFactors: [
    "Formal RFP process initiated with confirmed budget",
    "Executive-level involvement and urgency",
    "Current vendor contract expiring Q2 2025",
    "Compliance gaps requiring immediate attention",
    "Board-level digital transformation initiative"
  ]
};

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getBuyingSignalsConcise = (): Array<{
  title: string;
  type: SignalType;
  strength: number;
  urgency: UrgencyLevel;
  keyImplication: string;
}> => {
  return buyingSignals.slice(0, 3).map(signal => ({
    title: signal.title || "Buying Signal Detected",
    type: signal.type,
    strength: signal.strength || 75,
    urgency: signal.urgency || "medium",
    keyImplication: signal.implications?.[0] || "Indicates purchase intent"
  }));
};

// Generate comprehensive view with all details
export const getBuyingSignalsComprehensive = (): IBuyingSignal[] => {
  return buyingSignals;
};

// Generate summary statistics from comprehensive data
export const getBuyingSignalStats = () => {
  const highStrengthSignals = buyingSignals.filter(s => (s.strength || 0) >= 80).length;
  const immediateUrgencySignals = buyingSignals.filter(s => s.urgency === "immediate").length;
  const avgStrength = buyingSignals.reduce((sum, s) => sum + (s.strength || 0), 0) / buyingSignals.length;
  
  return {
    totalSignals: buyingSignals.length,
    highStrengthSignals,
    immediateUrgencySignals,
    avgStrength: Math.round(avgStrength),
    intentScore: intentScore.overall
  };
};

// Generate signals by type
export const getSignalsByType = (type: SignalType) => {
  return buyingSignals.filter(signal => signal.type === type);
};

// Generate urgency-based prioritization
export const getSignalsByUrgency = () => {
  const urgencyOrder: UrgencyLevel[] = ["immediate", "high", "medium", "low"];
  return buyingSignals.sort((a, b) => {
    const aIndex = urgencyOrder.indexOf(a.urgency || "low");
    const bIndex = urgencyOrder.indexOf(b.urgency || "low");
    return aIndex - bIndex;
  });
};

export const signalTypes: SignalType[] = [
  "procurement",
  "financial", 
  "research",
  "organizational",
  "competitive",
  "technical",
  "budget",
  "evaluation",
  "stakeholder"
];

export const urgencyLevels: UrgencyLevel[] = [
  "immediate",
  "high",
  "medium", 
  "low"
];