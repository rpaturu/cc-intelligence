import type { 
  IBudgetIndicator, 
  BudgetCategory,
  BudgetStatus, 
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const budgetIndicators: IBudgetIndicator[] = [
  {
    id: "series-b-funding",
    category: "Security",
    title: "Series B Funding Provides Strong Financial Position",
    amount: "$50M raised, $40M available",
    status: "Allocated",
    confidence: "Confirmed",
    timeline: "Immediate availability through 2026",
    description: "Recent Series B funding round completed with significant allocation for infrastructure and security",
    source: "SEC filings, press releases, investor communications",
    lastUpdated: "December 2024",
    details: {
      breakdown: [
        {
          category: "Engineering & Infrastructure",
          amount: "$20M",
          percentage: 50
        },
        {
          category: "Security & Compliance",
          amount: "$8M", 
          percentage: 20
        },
        {
          category: "Sales & Marketing",
          amount: "$12M",
          percentage: 30
        }
      ],
      approvalProcess: [
        "Board approved overall allocation strategy",
        "CTO has $1M quarterly discretionary spending",
        "Security investments pre-approved up to $2M annually",
        "CFO approval required for contracts over $500K"
      ],
      stakeholders: [
        "CEO - Overall strategy and major purchases",
        "CFO - Budget oversight and contract approval",
        "CTO - Technical infrastructure decisions",
        "CISO - Security and compliance spending"
      ],
      timeline: [
        {
          phase: "Q1 2025",
          date: "January - March",
          milestone: "Identity platform selection and procurement"
        },
        {
          phase: "Q2 2025", 
          date: "April - June",
          milestone: "Implementation and migration"
        },
        {
          phase: "Q3 2025",
          date: "July - September", 
          milestone: "International expansion infrastructure"
        }
      ]
    },
    implications: [
      "Strong financial position eliminates budget constraints",
      "Urgency to deploy capital for growth acceleration",
      "Board pressure to show rapid ROI on investments",
      "Preference for strategic, long-term technology partnerships"
    ],
    relatedInitiatives: [
      "International expansion to Europe (Q3 2025)",
      "Engineering team scaling (200+ new hires)",
      "SOC 2 Type II and ISO 27001 compliance",
      "Product development acceleration"
    ]
  },
  {
    id: "engineering-budget",
    category: "IT Infrastructure",
    title: "Engineering Budget Allocated for 2025",
    amount: "$8M allocated for engineering tools and infrastructure",
    status: "Approved",
    confidence: "Confirmed",
    timeline: "2025 fiscal year spending",
    description: "Dedicated engineering budget approved with focus on productivity and security tools",
    source: "Engineering leadership communications, budget planning documents",
    lastUpdated: "January 2025",
    details: {
      breakdown: [
        {
          category: "Identity & Security Tools",
          amount: "$2M",
          percentage: 25
        },
        {
          category: "Development Tools & Platforms",
          amount: "$3M",
          percentage: 37.5
        },
        {
          category: "Cloud Infrastructure", 
          amount: "$2.5M",
          percentage: 31.25
        },
        {
          category: "Monitoring & Operations",
          amount: "$500K",
          percentage: 6.25
        }
      ],
      constraints: [
        "Must demonstrate clear ROI within 12 months",
        "Preference for SaaS solutions over custom builds",
        "Integration capabilities with existing stack required",
        "Vendor consolidation preferred to reduce complexity"
      ]
    },
    implications: [
      "Identity platform spending has dedicated budget allocation",
      "Engineering productivity metrics tied to tool investments",
      "Focus on automation and developer experience",
      "Opportunity for comprehensive platform adoption"
    ],
    relatedInitiatives: [
      "Engineering team growth (50 to 70 engineers)",
      "DevSecOps implementation", 
      "Multi-cloud architecture deployment",
      "Automated testing and deployment pipelines"
    ]
  },
  {
    id: "compliance-budget",
    category: "Compliance",
    title: "Compliance & Security Budget Increase",
    amount: "$2M annually for compliance and security",
    status: "Approved",
    confidence: "High",
    timeline: "Ongoing through 2025-2026",
    description: "Significant increase in compliance and security spending driven by regulatory requirements",
    source: "CISO communications, compliance planning documents",
    lastUpdated: "January 2025",
    details: {
      breakdown: [
        {
          category: "Identity & Access Management",
          amount: "$600K",
          percentage: 30
        },
        {
          category: "Compliance Tools & Auditing",
          amount: "$500K", 
          percentage: 25
        },
        {
          category: "Security Monitoring & Response",
          amount: "$400K",
          percentage: 20
        },
        {
          category: "Training & Consulting",
          amount: "$300K",
          percentage: 15
        },
        {
          category: "Risk Management Tools",
          amount: "$200K",
          percentage: 10
        }
      ],
      requirements: [
        "SOC 2 Type II compliance maintenance",
        "ISO 27001 certification achievement",
        "PCI DSS Level 1 compliance for payments",
        "GDPR compliance for European expansion"
      ]
    },
    implications: [
      "Identity management is top spending priority",
      "Compliance-first approach to vendor selection",
      "Willingness to pay premium for integrated solutions",
      "Focus on automated compliance reporting"
    ],
    relatedInitiatives: [
      "SOC 2 Type II annual audit preparation",
      "ISO 27001 certification project (6-month timeline)",
      "European data protection compliance",
      "Financial services regulatory compliance"
    ]
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getBudgetIndicatorsConcise = (): Array<{
  title: string;
  amount: string;
  status: BudgetStatus;
  category: BudgetCategory;
  keyImplication: string;
}> => {
  return budgetIndicators.map(indicator => ({
    title: indicator.title,
    amount: indicator.amount,
    status: indicator.status,
    category: indicator.category,
    keyImplication: indicator.implications[0] || "Budget available for strategic initiatives"
  }));
};

// Generate comprehensive view with all details
export const getBudgetIndicatorsComprehensive = (): IBudgetIndicator[] => {
  return budgetIndicators;
};

// Generate summary statistics from comprehensive data
export const getBudgetIndicatorStats = () => {
  const approvedBudgets = budgetIndicators.filter(b => b.status === "Approved" || b.status === "Allocated").length;
  const securityBudgets = budgetIndicators.filter(b => b.category === "Security").length;
  
  // Calculate total available budget
  const totalBudget = budgetIndicators.reduce((sum, indicator) => {
    const amount = indicator.amount.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
    if (amount) {
      let value = parseFloat(amount[1]);
      const unit = amount[2];
      if (unit === 'M') value *= 1000000;
      else if (unit === 'K') value *= 1000;
      return sum + value;
    }
    return sum;
  }, 0);
  
  return {
    totalIndicators: budgetIndicators.length,
    approvedBudgets,
    securityBudgets,
    totalBudget: `$${(totalBudget / 1000000).toFixed(1)}M+`,
    fundingStatus: "Strong - Series B completed"
  };
};

// Generate budget by category
export const getBudgetByCategory = (category: BudgetCategory) => {
  return budgetIndicators.filter(indicator => indicator.category === category);
};

// Generate spending timeline
export const getBudgetTimeline = () => {
  return budgetIndicators.map(indicator => ({
    title: indicator.title,
    timeline: indicator.timeline,
    amount: indicator.amount,
    status: indicator.status
  })).sort((a, b) => {
    // Sort by urgency/timeline
    if (a.timeline.includes("Immediate")) return -1;
    if (b.timeline.includes("Immediate")) return 1;
    return a.timeline.localeCompare(b.timeline);
  });
};

export const budgetCategories: BudgetCategory[] = [
  "Security",
  "IT Infrastructure", 
  "Compliance",
  "Development",
  "Operations"
];

export const budgetStatuses: BudgetStatus[] = [
  "Approved",
  "Pending Approval",
  "Under Review",
  "Allocated",
  "Spent"
];