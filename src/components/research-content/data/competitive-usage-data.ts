import type { 
  IVendorRelationship, 
  VendorCategory,
  RelationshipStatus
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const vendorRelationships: IVendorRelationship[] = [
  {
    id: "auth0-ciam",
    vendor: "Auth0", 
    category: "Identity & Security",
    type: "Customer Identity and Access Management",
    status: "At Risk",
    contract: {
      value: "$180K annually",
      renewal: "Q2 2025",
      status: "Renewal Risk",
      terms: "3-year agreement, 40% price increase proposed"
    },
    satisfaction: {
      level: "Low",
      score: 2.8,
      concerns: [
        "Contract renewal with 40% price increase",
        "Limited workforce identity capabilities", 
        "Integration complexity with enterprise systems",
        "Support response times declining",
        "Lack of advanced governance features"
      ]
    },
    usage: {
      adoption: "High",
      integrations: 12,
      users: "25K+ customer identities managed",
      criticality: "Business Critical"
    },
    stakeholders: ["CTO", "Engineering Team", "Customer Success"],
    opportunities: [
      "Position unified workforce + customer identity platform",
      "Highlight cost savings vs 40% Auth0 increase",
      "Demonstrate superior integration capabilities",
      "Emphasize built-in governance vs Auth0 limitations"
    ],
    replacementPriority: "High",
    migrationComplexity: "Medium"
  },
  {
    id: "microsoft-ad",
    vendor: "Microsoft Active Directory",
    category: "Identity & Security", 
    type: "On-Premise Directory Service",
    status: "Legacy",
    contract: {
      value: "$45K annually (maintenance)",
      renewal: "Perpetual license",
      status: "Maintenance Only",
      terms: "Legacy on-premise infrastructure"
    },
    satisfaction: {
      level: "Low",
      score: 2.3,
      concerns: [
        "Aging on-premise infrastructure requiring updates",
        "Limited cloud integration capabilities",
        "Manual user provisioning processes", 
        "No support for modern authentication protocols",
        "Security gaps with remote workforce"
      ]
    },
    usage: {
      adoption: "Medium",
      integrations: 8,
      users: "150+ employees",
      criticality: "Legacy Dependency"
    },
    stakeholders: ["IT Operations", "Security Team"],
    opportunities: [
      "Modernize with cloud-native identity platform",
      "Eliminate on-premise infrastructure costs",
      "Add modern authentication methods (MFA, SSO)",
      "Integrate seamlessly with cloud applications"
    ],
    replacementPriority: "Medium",
    migrationComplexity: "High"
  },
  {
    id: "aws-cloud",
    vendor: "Amazon Web Services (AWS)",
    category: "Cloud Infrastructure",
    type: "Primary Cloud Provider", 
    status: "Strong Partnership",
    contract: {
      value: "$300K annually, growing 25%",
      renewal: "Enterprise Agreement through 2026",
      status: "Expanding",
      terms: "Multi-year enterprise agreement"
    },
    satisfaction: {
      level: "High",
      score: 4.2,
      concerns: [
        "Growing costs with scale",
        "Complex IAM management across services",
        "Need for better cost optimization",
        "Multi-region compliance requirements"
      ]
    },
    usage: {
      adoption: "High",
      integrations: 25,
      users: "All engineering and operations teams", 
      criticality: "Mission Critical"
    },
    stakeholders: ["CTO", "VP Engineering", "DevOps Team"],
    opportunities: [
      "Integrate identity platform with AWS IAM",
      "Implement FinOps for cost optimization",
      "Leverage AWS security services integration",
      "Expand to additional regions for compliance"
    ],
    replacementPriority: "Low",
    migrationComplexity: "N/A"
  },
  {
    id: "salesforce-crm",
    vendor: "Salesforce",
    category: "Business Applications",
    type: "Customer Relationship Management",
    status: "Expanding",
    contract: {
      value: "$180K annually, expanding usage",
      renewal: "3-year agreement, expires 2026", 
      status: "Growing",
      terms: "Multi-cloud license with expansion options"
    },
    satisfaction: {
      level: "High",
      score: 4.0,
      concerns: [
        "Complex user provisioning for new features",
        "Need better integration with other systems",
        "License optimization opportunities",
        "Data synchronization challenges"
      ]
    },
    usage: {
      adoption: "High",
      integrations: 15,
      users: "75+ sales and customer success users",
      criticality: "Business Critical"
    },
    stakeholders: ["Sales Team", "Customer Success", "Marketing"],
    opportunities: [
      "Implement automated user provisioning via SCIM",
      "Integrate with unified identity platform",
      "Optimize licensing based on usage patterns",
      "Enhance data flows with other platforms"
    ],
    replacementPriority: "Low",
    migrationComplexity: "Low"
  },
  {
    id: "github-enterprise",
    vendor: "GitHub Enterprise",
    category: "Development Tools",
    type: "Code Repository and DevOps",
    status: "Strategic",
    contract: {
      value: "$45K annually",
      renewal: "Annual subscription, auto-renewal",
      status: "Stable",
      terms: "Enterprise subscription with unlimited repositories"
    },
    satisfaction: {
      level: "High", 
      score: 4.5,
      concerns: [
        "Need better integration with SSO",
        "Access management for contractors/partners",
        "Security scanning integration needs",
        "Workflow automation opportunities"
      ]
    },
    usage: {
      adoption: "High",
      integrations: 10,
      users: "All 50+ engineers plus contractors",
      criticality: "Mission Critical"
    },
    stakeholders: ["Engineering Team", "DevOps", "CTO"],
    opportunities: [
      "Integrate with enterprise SSO platform",
      "Implement just-in-time access for repositories", 
      "Enhance security with identity-based policies",
      "Automate access reviews and compliance"
    ],
    replacementPriority: "Low",
    migrationComplexity: "Medium"
  },
  {
    id: "crowdstrike-endpoint",
    vendor: "CrowdStrike Falcon",
    category: "Security",
    type: "Endpoint Detection and Response",
    status: "Strategic",
    contract: {
      value: "$95K annually", 
      renewal: "2-year agreement through 2025",
      status: "Renewal Planning",
      terms: "Enterprise license for all endpoints"
    },
    satisfaction: {
      level: "High",
      score: 4.1,
      concerns: [
        "Limited integration with identity systems",
        "Need for better user context in alerts",
        "Manual incident response processes", 
        "Cost scaling with headcount growth"
      ]
    },
    usage: {
      adoption: "High",
      integrations: 5,
      users: "All employee endpoints monitored",
      criticality: "Security Critical"
    },
    stakeholders: ["CISO", "Security Team", "IT Operations"],
    opportunities: [
      "Integrate with identity platform for user context",
      "Implement risk-based authentication triggers",
      "Automate incident response workflows",
      "Enhance threat intelligence sharing"
    ],
    replacementPriority: "Low",
    migrationComplexity: "Low"
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getVendorRelationshipsConcise = (): Array<{
  vendor: string;
  category: VendorCategory;
  status: RelationshipStatus;
  keyOpportunity: string;
}> => {
  return vendorRelationships.slice(0, 4).map(relationship => ({
    vendor: relationship.vendor,
    category: relationship.category,
    status: relationship.status,
    keyOpportunity: relationship.opportunities[0] || "Integration optimization available"
  }));
};

// Generate comprehensive view with all details
export const getVendorRelationshipsComprehensive = (): IVendorRelationship[] => {
  return vendorRelationships;
};

// Generate summary statistics from comprehensive data
export const getVendorRelationshipStats = () => {
  const totalSpending = vendorRelationships.reduce((sum, vendor) => {
    const spending = vendor.contract.value.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
    if (spending) {
      let amount = parseFloat(spending[1]);
      const unit = spending[2];
      if (unit === 'M') amount *= 1000000;
      else if (unit === 'K') amount *= 1000;
      return sum + amount;
    }
    return sum;
  }, 0);
  
  const atRiskVendors = vendorRelationships.filter(v => v.status === "At Risk").length;
  const highSatisfaction = vendorRelationships.filter(v => v.satisfaction.level === "High").length;
  const identityVendors = vendorRelationships.filter(v => v.category === "Identity & Security").length;
  
  return {
    totalVendors: vendorRelationships.length,
    totalSpending: `$${(totalSpending / 1000).toFixed(0)}K+`,
    atRiskVendors,
    highSatisfaction,
    identityVendors,
    avgSatisfaction: (vendorRelationships.reduce((sum, v) => sum + v.satisfaction.score, 0) / vendorRelationships.length).toFixed(1)
  };
};

// Generate relationships by category
export const getVendorsByCategory = (category: VendorCategory) => {
  return vendorRelationships.filter(vendor => vendor.category === category);
};

// Generate replacement opportunities
export const getReplacementOpportunities = () => {
  return vendorRelationships
    .filter(vendor => vendor.replacementPriority === "High" || vendor.status === "At Risk")
    .map(vendor => ({
      vendor: vendor.vendor,
      status: vendor.status,
      priority: vendor.replacementPriority,
      contractValue: vendor.contract.value,
      satisfactionScore: vendor.satisfaction.score,
      keyOpportunity: vendor.opportunities[0],
      migrationComplexity: vendor.migrationComplexity
    }));
};

// Generate vendor consolidation analysis
export const getVendorConsolidationOpportunities = () => {
  const identityVendors = getVendorsByCategory("Identity & Security");
  const totalIdentitySpend = identityVendors.reduce((sum, vendor) => {
    const spending = vendor.contract.value.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
    if (spending) {
      let amount = parseFloat(spending[1]);
      const unit = spending[2];
      if (unit === 'K') amount *= 1000;
      return sum + amount;
    }
    return sum;
  }, 0);
  
  return {
    identityVendorsCount: identityVendors.length,
    totalIdentitySpend: `$${(totalIdentitySpend / 1000).toFixed(0)}K`,
    consolidationSavings: `$${((totalIdentitySpend * 0.3) / 1000).toFixed(0)}K potential savings`,
    vendorsToConsolidate: identityVendors.map(v => v.vendor)
  };
};

export const vendorCategories: VendorCategory[] = [
  "Identity & Security",
  "Cloud Infrastructure",
  "Business Applications", 
  "Development Tools",
  "Security",
  "Data & Analytics"
];

export const relationshipStatuses: RelationshipStatus[] = [
  "Strategic",
  "Strong Partnership",
  "Expanding",
  "Stable", 
  "At Risk",
  "Legacy"
];