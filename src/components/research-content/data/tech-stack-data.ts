import type { 
  ITechStackItem, 
  TechCategory, 
  TechStatus,
  UsageLevel 
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const techStack: ITechStackItem[] = [
  {
    category: "identity",
    name: "Auth0",
    type: "Customer Identity and Access Management", 
    status: "active",
    usage: "High",
    satisfaction: 3.2,
    contract: "Expires Q2 2025",
    spending: "$180K annually",
    integrations: 12,
    description: "Current CIAM provider for customer authentication and authorization",
    concerns: [
      "Contract renewal approaching with 40% price increase",
      "Limited workforce identity capabilities",
      "Integration complexity with enterprise systems",
      "Support response times declining",
      "Lack of advanced governance features"
    ],
    opportunities: [
      "Evaluate unified workforce + customer identity platform",
      "Consolidate identity spend across multiple vendors",
      "Improve user experience with better SSO",
      "Add advanced security features like risk-based auth"
    ]
  },
  {
    category: "identity",
    name: "Microsoft Active Directory",
    type: "On-Premise Directory Service",
    status: "legacy",
    usage: "Medium",
    satisfaction: 2.8,
    contract: "Perpetual license, aging infrastructure",
    spending: "$45K annually (maintenance)",
    integrations: 8,
    description: "Legacy on-premise directory for employee authentication",
    concerns: [
      "Aging on-premise infrastructure requiring updates",
      "Limited cloud integration capabilities", 
      "Manual user provisioning processes",
      "No support for modern authentication protocols",
      "Security gaps with remote workforce"
    ],
    opportunities: [
      "Migrate to cloud-native identity platform",
      "Implement automated user lifecycle management",
      "Add modern authentication methods (MFA, SSO)",
      "Integrate with cloud applications seamlessly"
    ]
  },
  {
    category: "cloud",
    name: "Amazon Web Services (AWS)",
    type: "Primary Cloud Infrastructure",
    status: "active", 
    usage: "High",
    satisfaction: 4.2,
    contract: "Enterprise Agreement through 2026",
    spending: "$300K annually, growing 25%",
    integrations: 25,
    description: "Primary cloud provider for compute, storage, and platform services",
    concerns: [
      "Growing costs with scale",
      "Complex IAM management across services",
      "Need for better cost optimization",
      "Multi-region compliance requirements"
    ],
    opportunities: [
      "Integrate identity platform with AWS IAM",
      "Implement FinOps for cost optimization",
      "Leverage AWS security services integration",
      "Expand to additional regions for compliance"
    ]
  },
  {
    category: "business",
    name: "Salesforce",
    type: "Customer Relationship Management",
    status: "active",
    usage: "High", 
    satisfaction: 4.0,
    contract: "3-year agreement, expires 2026",
    spending: "$180K annually, expanding usage",
    integrations: 15,
    description: "CRM platform and marketing cloud for customer management",
    concerns: [
      "Complex user provisioning for new features",
      "Need better integration with other systems",
      "License optimization opportunities",
      "Data synchronization challenges"
    ],
    opportunities: [
      "Implement automated user provisioning via SCIM",
      "Integrate with unified identity platform",
      "Optimize licensing based on usage patterns",
      "Enhance data flows with other platforms"
    ]
  },
  {
    category: "development",
    name: "GitHub Enterprise",
    type: "Code Repository and DevOps",
    status: "active",
    usage: "High",
    satisfaction: 4.5,
    contract: "Annual subscription, auto-renewal",
    spending: "$45K annually",
    integrations: 10,
    description: "Primary code repository and development workflow platform",
    concerns: [
      "Need better integration with SSO",
      "Access management for contractors/partners",
      "Security scanning integration needs",
      "Workflow automation opportunities"
    ],
    opportunities: [
      "Integrate with enterprise SSO platform",
      "Implement just-in-time access for repositories",
      "Enhance security with identity-based policies",
      "Automate access reviews and compliance"
    ]
  },
  {
    category: "security",
    name: "CrowdStrike Falcon",
    type: "Endpoint Detection and Response",
    status: "active",
    usage: "High",
    satisfaction: 4.1,
    contract: "2-year agreement through 2025",
    spending: "$95K annually",
    integrations: 5,
    description: "Endpoint protection and threat detection platform",
    concerns: [
      "Limited integration with identity systems",
      "Need for better user context in alerts",
      "Manual incident response processes",
      "Cost scaling with headcount growth"
    ],
    opportunities: [
      "Integrate with identity platform for user context",
      "Implement risk-based authentication triggers",
      "Automate incident response workflows",
      "Enhance threat intelligence sharing"
    ]
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getTechStackConcise = (): Array<{
  name: string;
  category: TechCategory;
  status: TechStatus;
  keyOpportunity: string;
}> => {
  return techStack.map(tech => ({
    name: tech.name,
    category: tech.category,
    status: tech.status,
    keyOpportunity: tech.opportunities[0] || "Integration optimization available"
  }));
};

// Generate comprehensive view with all details
export const getTechStackComprehensive = (): ITechStackItem[] => {
  return techStack;
};

// Generate summary statistics from comprehensive data
export const getTechStackStats = () => {
  const identityTools = techStack.filter(t => t.category === "identity").length;
  const legacyTools = techStack.filter(t => t.status === "legacy").length;
  const totalSpending = techStack.reduce((sum, tech) => {
    const spending = tech.spending.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
    if (spending) {
      let amount = parseFloat(spending[1]);
      const unit = spending[2];
      if (unit === 'M') amount *= 1000000;
      else if (unit === 'K') amount *= 1000;
      return sum + amount;
    }
    return sum;
  }, 0);
  
  return {
    totalTools: techStack.length,
    identityTools,
    legacyTools,
    totalSpending: `$${(totalSpending / 1000).toFixed(0)}K+`,
    avgSatisfaction: (techStack.reduce((sum, t) => sum + t.satisfaction, 0) / techStack.length).toFixed(1)
  };
};

// Generate category-specific tools
export const getToolsByCategory = (category: TechCategory) => {
  return techStack.filter(tool => tool.category === category);
};

// Generate modernization opportunities
export const getModernizationOpportunities = () => {
  return techStack
    .filter(tool => tool.status === "legacy" || tool.satisfaction < 3.5)
    .map(tool => ({
      name: tool.name,
      status: tool.status,
      satisfaction: tool.satisfaction,
      topOpportunity: tool.opportunities[0],
      spending: tool.spending
    }));
};

export const techCategories: TechCategory[] = [
  "identity",
  "security", 
  "cloud",
  "development",
  "data",
  "business"
];

export const techStatuses: TechStatus[] = [
  "active",
  "legacy",
  "underutilized"
];

export const usageLevels: UsageLevel[] = [
  "High",
  "Medium",
  "Low"
];