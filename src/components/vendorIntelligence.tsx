import { 
  Users, 
  User, 
  Shield, 
  CheckCircle, 
  Lock, 
  Cloud, 
  Briefcase, 
  Zap, 
  GitBranch, 
  Database, 
  Building2, 
  Network 
} from "lucide-react";

export interface ProductPortfolioItem {
  category: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Competitor {
  name: string;
  description: string;
  category: string;
}

export interface VendorIntelligence {
  industry: string;
  size: string;
  revenue: string;
  growthRate: string;
  founded: string;
  location: string;
  stockSymbol?: string;
  description: string;
  productPortfolio: ProductPortfolioItem[];
  competitors: Competitor[];
  recentNews: string;
}

export const getVendorIntelligence = (companyName: string): VendorIntelligence => {
  const vendorData: Record<string, VendorIntelligence> = {
    "Okta": {
      industry: "Identity & Access Management",
      size: "5,800+ employees",
      revenue: "$2.1B",
      growthRate: "+28% YoY",
      founded: "2009",
      location: "San Francisco, CA",
      stockSymbol: "OKTA",
      description: "Leading identity and access management platform, enabling secure access for any user to any application from any device.",
      productPortfolio: [
        {
          category: "Employee IAM",
          name: "Okta Workforce Identity",
          description: "SSO, MFA, lifecycle management for employees",
          icon: <Users className="w-4 h-4" />
        },
        {
          category: "CIAM",
          name: "Okta Customer Identity",
          description: "Customer registration, authentication, and user management",
          icon: <User className="w-4 h-4" />
        },
        {
          category: "PAM",
          name: "Okta Privileged Access",
          description: "Secure access to servers, applications, and infrastructure",
          icon: <Shield className="w-4 h-4" />
        },
        {
          category: "IGA",
          name: "Okta Governance",
          description: "Access reviews, certifications, and compliance reporting",
          icon: <CheckCircle className="w-4 h-4" />
        },
        {
          category: "Device Security",
          name: "Okta Device Trust",
          description: "Device-based conditional access and security",
          icon: <Lock className="w-4 h-4" />
        }
      ],
      competitors: [
        { name: "Microsoft Entra ID", description: "Office 365 integration, bundled pricing", category: "Enterprise IAM" },
        { name: "Ping Identity", description: "Hybrid environments, complex integrations", category: "Enterprise IAM" },
        { name: "CyberArk", description: "Privileged access management leader", category: "PAM" },
        { name: "SailPoint", description: "Identity governance specialist", category: "IGA" }
      ],
      recentNews: "Auth0 integration complete, new workforce identity features"
    },
    "Tesla": {
      industry: "Automotive & Energy",
      size: "140,000+ employees", 
      revenue: "$96.8B",
      growthRate: "+19% YoY",
      founded: "2003",
      location: "Austin, TX",
      stockSymbol: "TSLA",
      description: "Leading electric vehicle and clean energy company accelerating the world's transition to sustainable energy.",
      productPortfolio: [
        {
          category: "Vehicles",
          name: "Model S, 3, X, Y",
          description: "Premium electric vehicles with Autopilot and Full Self-Driving",
          icon: <Building2 className="w-4 h-4" />
        },
        {
          category: "Energy",
          name: "Solar & Powerwall",
          description: "Solar panels, solar roof tiles, and home battery storage",
          icon: <Zap className="w-4 h-4" />
        },
        {
          category: "Charging",
          name: "Supercharger Network",
          description: "Global fast-charging infrastructure for electric vehicles",
          icon: <Network className="w-4 h-4" />
        },
        {
          category: "Commercial",
          name: "Semi & Cybertruck",
          description: "Commercial electric vehicles for logistics and work",
          icon: <Building2 className="w-4 h-4" />
        }
      ],
      competitors: [
        { name: "Ford Lightning", description: "Traditional automaker, strong brand loyalty", category: "Electric Trucks" },
        { name: "BMW iX", description: "Luxury electric vehicles, premium market", category: "Premium EV" },
        { name: "Rivian", description: "Electric trucks and delivery vans", category: "Electric Trucks" },
        { name: "Lucid Air", description: "Luxury electric sedans, long range", category: "Premium EV" }
      ],
      recentNews: "Q4 2024 record deliveries, Cybertruck production scaling"
    },
    "Microsoft": {
      industry: "Technology & Cloud Services",
      size: "221,000+ employees",
      revenue: "$211.9B", 
      growthRate: "+13% YoY",
      founded: "1975",
      location: "Redmond, WA",
      stockSymbol: "MSFT",
      description: "Global technology leader providing cloud computing, productivity software, and AI-powered solutions.",
      productPortfolio: [
        {
          category: "Cloud",
          name: "Azure",
          description: "Comprehensive cloud computing platform and services",
          icon: <Cloud className="w-4 h-4" />
        },
        {
          category: "Productivity",
          name: "Microsoft 365",
          description: "Office apps, Teams, SharePoint, and collaboration tools",
          icon: <Briefcase className="w-4 h-4" />
        },
        {
          category: "AI",
          name: "Copilot",
          description: "AI assistant integrated across Microsoft products",
          icon: <Zap className="w-4 h-4" />
        },
        {
          category: "Developer",
          name: "GitHub & VS Code",
          description: "Development platforms and code repositories",
          icon: <GitBranch className="w-4 h-4" />
        },
        {
          category: "Data",
          name: "SQL Server & Power BI",
          description: "Database management and business intelligence",
          icon: <Database className="w-4 h-4" />
        }
      ],
      competitors: [
        { name: "Amazon Web Services", description: "Cloud infrastructure leader, broad service portfolio", category: "Cloud Computing" },
        { name: "Google Workspace", description: "Collaboration tools, Google ecosystem integration", category: "Productivity" },
        { name: "Salesforce", description: "CRM leader, extensive app marketplace", category: "Business Applications" },
        { name: "Oracle", description: "Database and enterprise software specialist", category: "Enterprise Software" }
      ],
      recentNews: "AI integration across product suite, GitHub Copilot expansion"
    },
    "Salesforce": {
      industry: "Customer Relationship Management",
      size: "79,000+ employees",
      revenue: "$31.4B",
      growthRate: "+11% YoY",
      founded: "1999",
      location: "San Francisco, CA",
      stockSymbol: "CRM",
      description: "World's leading customer relationship management platform, helping companies connect with customers through cloud-based solutions.",
      productPortfolio: [
        {
          category: "CRM",
          name: "Sales Cloud",
          description: "Lead management, opportunity tracking, and sales forecasting",
          icon: <Users className="w-4 h-4" />
        },
        {
          category: "Service",
          name: "Service Cloud",
          description: "Case management, knowledge base, and omnichannel support",
          icon: <User className="w-4 h-4" />
        },
        {
          category: "Marketing",
          name: "Marketing Cloud",
          description: "Email marketing, automation, and customer journey management",
          icon: <Zap className="w-4 h-4" />
        },
        {
          category: "Commerce",
          name: "Commerce Cloud",
          description: "E-commerce platform for B2B and B2C digital experiences",
          icon: <Building2 className="w-4 h-4" />
        },
        {
          category: "Analytics",
          name: "Tableau",
          description: "Data visualization and business intelligence platform",
          icon: <Database className="w-4 h-4" />
        }
      ],
      competitors: [
        { name: "Microsoft Dynamics", description: "Integrated with Office 365, enterprise focus", category: "CRM" },
        { name: "HubSpot", description: "Inbound marketing and sales automation", category: "Marketing Automation" },
        { name: "Oracle CX", description: "Enterprise customer experience suite", category: "Enterprise CRM" },
        { name: "SAP Customer Experience", description: "ERP integration, enterprise customers", category: "Enterprise CRM" }
      ],
      recentNews: "Einstein AI integration across platform, Slack integration enhancements"
    },
    "HubSpot": {
      industry: "Marketing & Sales Software",
      size: "8,000+ employees",
      revenue: "$2.2B",
      growthRate: "+20% YoY",
      founded: "2006",
      location: "Cambridge, MA",
      stockSymbol: "HUBS",
      description: "Inbound marketing, sales, and customer service platform helping businesses grow better through exceptional customer experiences.",
      productPortfolio: [
        {
          category: "Marketing",
          name: "Marketing Hub",
          description: "Lead generation, email marketing, and marketing automation",
          icon: <Zap className="w-4 h-4" />
        },
        {
          category: "Sales",
          name: "Sales Hub",
          description: "CRM, deal tracking, and sales automation tools",
          icon: <Users className="w-4 h-4" />
        },
        {
          category: "Service",
          name: "Service Hub",
          description: "Customer service, ticketing, and knowledge base",
          icon: <User className="w-4 h-4" />
        },
        {
          category: "Content",
          name: "Content Hub",
          description: "Website building, content management, and SEO tools",
          icon: <Building2 className="w-4 h-4" />
        },
        {
          category: "Operations",
          name: "Operations Hub",
          description: "Data sync, automation, and business intelligence",
          icon: <Database className="w-4 h-4" />
        }
      ],
      competitors: [
        { name: "Salesforce", description: "Enterprise CRM leader, extensive app ecosystem", category: "CRM" },
        { name: "Marketo", description: "Marketing automation specialist, Adobe integration", category: "Marketing Automation" },
        { name: "Pardot", description: "B2B marketing automation, Salesforce integration", category: "Marketing Automation" },
        { name: "Mailchimp", description: "Email marketing leader, SMB focus", category: "Email Marketing" }
      ],
      recentNews: "New AI-powered content creation tools, enhanced sales automation features"
    }
  };

  // Return the vendor data if it exists, otherwise return a default structure
  return vendorData[companyName] || {
    industry: "Technology",
    size: "1,000+ employees",
    revenue: "Growing", 
    growthRate: "+15% YoY",
    founded: "2010s",
    location: "Various",
    description: "Technology company focused on digital innovation and business transformation.",
    productPortfolio: [],
    competitors: [],
    recentNews: "Digital transformation initiatives"
  };
};

// Helper function to get all available companies (useful for testing or company selection)
export const getAvailableCompanies = (): string[] => {
  return ["Okta", "Tesla", "Microsoft", "Salesforce", "HubSpot"];
};