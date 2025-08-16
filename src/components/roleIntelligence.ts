export interface RoleDescription {
  description: string;
  keyAreas: string[];
  focus: string;
}

export interface RoleMapping {
  [key: string]: string;
}

// Role descriptions for AI intelligence
export const getRoleDescription = (role: string): RoleDescription => {
  const roleDescriptions: Record<string, RoleDescription> = {
    "account-executive": {
      description: "AI optimized for deal velocity, competitive positioning, and revenue growth strategies.",
      keyAreas: ["Buying signals detection", "Decision maker mapping", "Competitive intelligence", "Revenue opportunities"],
      focus: "Revenue Acceleration"
    },
    "account-manager": {
      description: "AI configured for account growth, renewal strategies, and relationship optimization.", 
      keyAreas: ["Usage pattern analysis", "Expansion opportunities", "Renewal risk assessment", "Stakeholder mapping"],
      focus: "Account Growth"
    },
    "solutions-engineer": {
      description: "AI tailored for technical requirements, architecture analysis, and implementation planning.",
      keyAreas: ["Technical requirements", "Solution architecture", "Integration planning", "Implementation timeline"],
      focus: "Technical Solutions"
    },
    "sales-development": {
      description: "AI designed for prospect qualification, outreach optimization, and pipeline development.",
      keyAreas: ["Lead scoring", "Outreach personalization", "Qualification criteria", "Pipeline optimization"],
      focus: "Lead Generation"
    },
    "business-development": {
      description: "AI optimized for partnership opportunities, market analysis, and strategic initiatives.",
      keyAreas: ["Partnership mapping", "Market analysis", "Strategic opportunities", "Competitive landscape"],
      focus: "Strategic Partnerships"
    },
    "sales-manager": {
      description: "AI configured for team analytics, forecast accuracy, and strategic insights.",
      keyAreas: ["Team performance", "Forecast accuracy", "Market trends", "Coaching insights"],
      focus: "Team Performance"
    },
    "customer-success": {
      description: "AI tailored for customer health monitoring, expansion identification, and retention strategies.",
      keyAreas: ["Health score tracking", "Expansion signals", "Retention strategies", "Success metrics"],
      focus: "Customer Success"
    }
  };
  
  return roleDescriptions[role] || {
    description: "AI configured for sales and business development activities.",
    keyAreas: ["Lead generation", "Relationship building", "Market analysis", "Revenue growth"],
    focus: "Sales Excellence"
  };
};

// Role display name mappings
export const getRoleDisplayName = (role: string): string => {
  const roleMap: RoleMapping = {
    "account-executive": "Account Executive",
    "account-manager": "Account Manager", 
    "solutions-engineer": "Solutions Engineer",
    "sales-development": "Sales Development Representative",
    "business-development": "Business Development",
    "sales-manager": "Sales Manager",
    "customer-success": "Customer Success Executive"
  };
  return roleMap[role] || role;
};

// Department display name mappings
export const getDepartmentDisplayName = (department: string): string => {
  const departmentMap: RoleMapping = {
    "sales": "Sales",
    "business-development": "Business Development",
    "customer-success": "Customer Success",
    "marketing": "Marketing",
    "partnerships": "Partnerships"
  };
  return departmentMap[department] || department;
};

// Territory display name mappings
export const getTerritoryDisplayName = (territory: string): string => {
  const territoryMap: RoleMapping = {
    "north-america": "North America",
    "europe": "Europe",
    "asia-pacific": "Asia Pacific",
    "latin-america": "Latin America",
    "middle-east-africa": "Middle East & Africa",
    "global": "Global"
  };
  return territoryMap[territory] || territory;
};

// Sales focus display name mappings
export const getFocusDisplayName = (focus: string): string => {
  const focusMap: RoleMapping = {
    "enterprise": "Enterprise",
    "mid-market": "Mid-Market", 
    "smb": "Small & Medium Business",
    "startup": "Startup",
    "government": "Government",
    "education": "Education"
  };
  return focusMap[focus] || focus;
};

// Research context display name mappings
export const getContextDisplayName = (context: string): string => {
  const contextMap: RoleMapping = {
    "discovery-call": "Discovery Call",
    "demo-prep": "Demo Preparation",
    "proposal-development": "Proposal Development",
    "competitive-analysis": "Competitive Analysis",
    "renewal-discussion": "Renewal Discussion",
    "expansion-planning": "Expansion Planning"
  };
  return contextMap[context] || context;
};

// Helper functions to get all available options (useful for dropdowns, etc.)
export const getAvailableRoles = (): string[] => {
  return [
    "account-executive",
    "account-manager", 
    "solutions-engineer",
    "sales-development",
    "business-development",
    "sales-manager",
    "customer-success"
  ];
};

export const getAvailableDepartments = (): string[] => {
  return [
    "sales",
    "business-development",
    "customer-success",
    "marketing",
    "partnerships"
  ];
};

export const getAvailableTerritories = (): string[] => {
  return [
    "north-america",
    "europe",
    "asia-pacific",
    "latin-america",
    "middle-east-africa",
    "global"
  ];
};

export const getAvailableFocusOptions = (): string[] => {
  return [
    "enterprise",
    "mid-market",
    "smb",
    "startup",
    "government",
    "education"
  ];
};

export const getAvailableContextOptions = (): string[] => {
  return [
    "discovery-call",
    "demo-prep",
    "proposal-development",
    "competitive-analysis",
    "renewal-discussion",
    "expansion-planning"
  ];
};

// Get role-specific suggestions for territories and focus areas
export const getRoleSuggestions = (role: string): { territories: string[]; focusAreas: string[] } => {
  const roleSuggestions: Record<string, { territories: string[]; focusAreas: string[] }> = {
    "account-executive": {
      territories: ["north-america", "europe", "asia-pacific"],
      focusAreas: ["enterprise", "mid-market"]
    },
    "account-manager": {
      territories: ["north-america", "europe", "global"],
      focusAreas: ["enterprise", "mid-market"]
    },
    "solutions-engineer": {
      territories: ["north-america", "europe", "asia-pacific"],
      focusAreas: ["enterprise", "government"]
    },
    "sales-development": {
      territories: ["north-america", "europe"],
      focusAreas: ["mid-market", "smb", "startup"]
    },
    "business-development": {
      territories: ["global", "north-america", "asia-pacific"],
      focusAreas: ["enterprise", "startup"]
    },
    "sales-manager": {
      territories: ["north-america", "europe", "asia-pacific"],
      focusAreas: ["enterprise", "mid-market"]
    },
    "customer-success": {
      territories: ["north-america", "europe", "global"],
      focusAreas: ["enterprise", "mid-market", "smb"]
    }
  };

  return roleSuggestions[role] || {
    territories: ["north-america", "global"],
    focusAreas: ["enterprise", "mid-market"]
  };
};