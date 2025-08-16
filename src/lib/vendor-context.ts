// Enhanced vendor intelligence data structure based on real API response
export interface VendorContext {
  companyName: string;
  industry: string;
  products: string[];
  targetMarkets: string[];
  competitors: string[];
  valuePropositions: string[];
  positioningStrategy: string;
  pricingModel: string;
  companySize: string;
  marketPresence: string;
  recentNews: string[];
  keyExecutives: Array<{
    name: string;
    title: string;
  }>;
  businessChallenges: string[];
  growthIndicators: string[];
  techStack: string[];
  partnerships: string[];
  revenue: string;
  revenueGrowth: string;
  stockSymbol?: string;
  marketCap?: string;
  dataQuality: {
    completeness: number;
    freshness: number;
    reliability: number;
    overall: number;
  };
  lastUpdated: string;
}

// Mock comprehensive vendor context data based on your Okta API response
export const mockVendorContext: VendorContext = {
  companyName: "Okta",
  industry: "Identity and Access Management (IAM) Software",
  products: [
    "Okta Identity Cloud",
    "Single Sign-On (SSO)",
    "Multi-Factor Authentication (MFA)",
    "Universal Directory",
    "Lifecycle Management",
    "API Access Management",
    "Advanced Server Access",
    "Identity Governance"
  ],
  targetMarkets: [
    "Large Enterprises",
    "Mid-Market Companies", 
    "Government Agencies",
    "Educational Institutions",
    "Healthcare Organizations",
    "Financial Services Companies"
  ],
  competitors: [
    "Microsoft Azure AD",
    "Ping Identity",
    "ForgeRock",
    "OneLogin",
    "Auth0 (now part of Okta)",
    "IBM Security"
  ],
  valuePropositions: [
    "Zero Trust Security Architecture",
    "Cloud-first Identity Platform",
    "Seamless User Experience",
    "Extensive Integration Network",
    "Enterprise-grade Security",
    "Scalable Identity Management"
  ],
  positioningStrategy: "Enterprise-focused cloud identity leader emphasizing security, scalability, and seamless integration",
  pricingModel: "Subscription-based per user/month with tiered pricing levels",
  companySize: "Large Enterprise (3,000+ employees)",
  marketPresence: "Global with strong presence in North America, Europe, and Asia-Pacific",
  recentNews: [
    "2023: Completed Auth0 integration",
    "2023: Expanded AI/ML capabilities in identity platform", 
    "2023: Enhanced Workforce Identity Cloud offering"
  ],
  keyExecutives: [
    { name: "Todd McKinnon", title: "CEO and Co-founder" },
    { name: "Frederic Kerrest", title: "Executive Vice Chairman, COO and Co-founder" },
    { name: "Brett Tighe", title: "Chief Financial Officer" }
  ],
  businessChallenges: [
    "Increasing competition in IAM space",
    "Integration of Auth0 acquisition",
    "Market pressure on tech valuations",
    "Growing cybersecurity threats"
  ],
  growthIndicators: [
    "Expanding product portfolio",
    "International market expansion",
    "Growing customer base",
    "Increased enterprise adoption"
  ],
  techStack: [
    "Cloud Infrastructure",
    "OAuth 2.0",
    "SAML",
    "OpenID Connect",
    "REST APIs"
  ],
  partnerships: [
    "AWS",
    "Microsoft",
    "Google Cloud",
    "Salesforce",
    "ServiceNow",
    "Workday"
  ],
  revenue: "$1.8 billion (FY2023)",
  revenueGrowth: "30% YoY",
  stockSymbol: "OKTA",
  marketCap: "~$14 billion",
  dataQuality: {
    completeness: 0.8,
    freshness: 0.9,
    reliability: 0.85,
    overall: 0.78
  },
  lastUpdated: "2025-08-08T02:03:37.302Z"
};

// Additional vendor contexts for demonstration
const salesforceContext: VendorContext = {
  companyName: "Salesforce",
  industry: "Customer Relationship Management (CRM) Software",
  products: [
    "Sales Cloud",
    "Service Cloud", 
    "Marketing Cloud",
    "Commerce Cloud",
    "Einstein AI Platform",
    "Slack",
    "Tableau",
    "MuleSoft"
  ],
  targetMarkets: [
    "Large Enterprises",
    "Mid-Market Companies",
    "Small Businesses",
    "Government",
    "Healthcare",
    "Financial Services"
  ],
  competitors: [
    "Microsoft Dynamics 365",
    "HubSpot",
    "Oracle CX",
    "SAP CX",
    "Pipedrive",
    "Zoho CRM"
  ],
  valuePropositions: [
    "Complete Customer 360 Platform",
    "Einstein AI-Powered Insights",
    "Extensive App Ecosystem",
    "Cloud-First Architecture",
    "Industry-Specific Solutions",
    "Seamless Integration Capabilities"
  ],
  positioningStrategy: "Leading cloud-based CRM platform enabling digital transformation with AI-powered customer insights",
  pricingModel: "Subscription-based per user/month with multiple edition tiers",
  companySize: "Large Enterprise (70,000+ employees)",
  marketPresence: "Global market leader with presence in 150+ countries",
  recentNews: [
    "2023: Enhanced Einstein GPT capabilities across platform",
    "2023: Expanded Slack integration with Sales and Service Clouds",
    "2023: Launched Industry-specific AI solutions"
  ],
  keyExecutives: [
    { name: "Marc Benioff", title: "Chairman and CEO" },
    { name: "Amy Weaver", title: "President and CFO" },
    { name: "Parker Harris", title: "Co-founder and CTO" }
  ],
  businessChallenges: [
    "Intense competition from Microsoft",
    "Economic headwinds affecting software spending",
    "Need for continued innovation in AI space",
    "Customer retention in challenging market"
  ],
  growthIndicators: [
    "Strong Einstein AI adoption",
    "Growing Slack integration revenue",
    "Expanding industry cloud solutions",
    "International market growth"
  ],
  techStack: [
    "Force.com Platform",
    "Heroku",
    "Lightning Platform",
    "Einstein AI",
    "REST/SOAP APIs"
  ],
  partnerships: [
    "AWS",
    "Google Cloud",
    "Microsoft Azure",
    "Accenture",
    "Deloitte",
    "IBM"
  ],
  revenue: "$31.35 billion (FY2023)",
  revenueGrowth: "18% YoY",
  stockSymbol: "CRM",
  marketCap: "~$200 billion",
  dataQuality: {
    completeness: 0.85,
    freshness: 0.92,
    reliability: 0.88,
    overall: 0.82
  },
  lastUpdated: "2025-08-10T02:03:37.302Z"
};

const hubspotContext: VendorContext = {
  companyName: "HubSpot",
  industry: "Inbound Marketing and Sales Software",
  products: [
    "Marketing Hub",
    "Sales Hub",
    "Service Hub",
    "CMS Hub",
    "Operations Hub",
    "HubSpot AI",
    "Workflows",
    "Social Media Tools"
  ],
  targetMarkets: [
    "Small Businesses",
    "Mid-Market Companies",
    "Growing Enterprises",
    "Marketing Agencies",
    "SaaS Companies",
    "Professional Services"
  ],
  competitors: [
    "Salesforce",
    "Marketo",
    "Pardot",
    "Pipedrive",
    "ActiveCampaign",
    "Zoho CRM"
  ],
  valuePropositions: [
    "All-in-One Growth Platform",
    "Freemium Business Model", 
    "Inbound Marketing Expertise",
    "Easy-to-Use Interface",
    "Integrated Marketing & Sales",
    "Strong Community & Education"
  ],
  positioningStrategy: "Inbound growth platform designed to help businesses attract, engage, and delight customers",
  pricingModel: "Freemium with tiered subscription pricing per contact/user",
  companySize: "Mid-Large Enterprise (7,000+ employees)",
  marketPresence: "Global presence with strong focus on SMB and mid-market segments",
  recentNews: [
    "2023: Launched HubSpot AI across all hubs",
    "2023: Enhanced integration with major e-commerce platforms",
    "2023: Expanded international operations in APAC"
  ],
  keyExecutives: [
    { name: "Yamini Rangan", title: "CEO" },
    { name: "Kathryn Minshew", title: "COO" },
    { name: "Anna Khan", title: "CFO" }
  ],
  businessChallenges: [
    "Moving upmarket against enterprise competitors",
    "Economic pressure on SMB software spending",
    "Integration complexity as platform grows",
    "Competition from specialized point solutions"
  ],
  growthIndicators: [
    "Strong customer growth in mid-market",
    "Expanding average contract values",
    "International market expansion",
    "AI feature adoption increasing"
  ],
  techStack: [
    "AWS Infrastructure",
    "React/Node.js",
    "Elasticsearch",
    "Kafka",
    "GraphQL APIs"
  ],
  partnerships: [
    "Shopify",
    "WordPress",
    "Zapier",
    "Google",
    "Meta",
    "LinkedIn"
  ],
  revenue: "$1.73 billion (2023)",
  revenueGrowth: "20% YoY",
  stockSymbol: "HUBS",
  marketCap: "~$28 billion",
  dataQuality: {
    completeness: 0.78,
    freshness: 0.89,
    reliability: 0.83,
    overall: 0.76
  },
  lastUpdated: "2025-08-10T02:03:37.302Z"
};

export function getVendorContext(companyName: string): VendorContext | null {
  // In a real application, this would fetch from your API
  const company = companyName.toLowerCase();
  
  if (company === "okta") {
    return mockVendorContext;
  } else if (company === "salesforce") {
    return salesforceContext;
  } else if (company === "hubspot") {
    return hubspotContext;
  }
  
  return null;
}

export function formatDataQuality(score: number): { 
  label: string; 
  color: string; 
  description: string; 
} {
  if (score >= 0.8) {
    return {
      label: "Excellent",
      color: "text-green-600 dark:text-green-400",
      description: "High-quality, comprehensive data"
    };
  } else if (score >= 0.6) {
    return {
      label: "Good", 
      color: "text-blue-600 dark:text-blue-400",
      description: "Reliable data with minor gaps"
    };
  } else if (score >= 0.4) {
    return {
      label: "Fair",
      color: "text-amber-600 dark:text-amber-400", 
      description: "Moderate data quality"
    };
  } else {
    return {
      label: "Limited",
      color: "text-red-600 dark:text-red-400",
      description: "Basic data available"
    };
  }
}