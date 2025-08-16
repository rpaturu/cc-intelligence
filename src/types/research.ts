export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  department?: string;
  companyName?: string;
  companyDomain?: string;
  territory?: string;
  salesFocus?: string;
  researchContext?: string;
}

export interface ResearchProps {
  user: User;
  onProfileClick: () => void;
  onResearchAreaNavigation?: (areaId: string) => void;
  onLogout?: () => void;
}

export interface CompletedResearch {
  id: string;
  title: string;
  completedAt: Date;
  researchArea?: string; // The research area ID (e.g., "decision_makers", "tech_stack")
  findings: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      details?: string[];
      contact?: {
        name: string;
        role: string;
        email?: string;
        phone?: string;
        linkedin?: string;
      };
      valueProps?: Array<{
        competitor: string;
        ourAdvantage: string;
        talkingPoints: string[];
        objectionHandling?: string;
      }>;
    }>;
  };
}

export interface Source {
  id: number;
  title: string;
  url: string;
  domain: string;
  description: string;
  publishedDate?: string;
  type: "article" | "press_release" | "report" | "social" | "company_page" | "news";
  relevance: "high" | "medium" | "low";
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Source[];
  options?: Array<{
    id: string;
    text: string;
    iconName?: string;
  }>;
  isStreaming?: boolean;
  streamingSteps?: Array<{
    text: string;
    completed: boolean;
    iconName?: string;
  }>;
  companySummary?: CompanyData;
  researchFindings?: {
    title: string;
    researchAreaId?: string;
    items: Array<{
      title: string;
      description: string;
      details?: string[];
      contact?: {
        name: string;
        role: string;
        email?: string;
        phone?: string;
        linkedin?: string;
      };
      valueProps?: Array<{
        competitor: string;
        ourAdvantage: string;
        talkingPoints: string[];
        objectionHandling?: string;
      }>;
    }>;
  };
  followUpOptions?: Array<{
    id: string;
    text: string;
    iconName?: string;
    category: "research" | "action" | "explore";
  }>;
  vendorProfile?: {
    company: string;
    overview: string;
    products: Array<{
      name: string;
      category: string;
      description: string;
    }>;
    competitors: Array<{
      name: string;
      category: string;
      strength: string;
    }>;
    persona: {
      role: string;
      keyFocus: string[];
      successMetrics: string[];
      commonChallenges: string[];
    };
  };
}

export interface ResearchArea {
  id: string;
  text: string;
  iconName?: string;
  category?: "research" | "action" | "explore";
}

export interface FollowUpOption {
  id: string;
  text: string;
  iconName?: string;
  category: "research" | "action" | "explore";
}

export interface StreamingStep {
  text: string;
  iconName?: string;
  completed: boolean;
}

export interface CompanyData {
  name: string;
  industry: string;
  size: string;
  location: string;
  recentNews: string;
  techStack: string[];
  founded: string;
  revenue: string;
  businessModel?: string;
  marketPosition?: string;
  growthStage?: string;
  fundingHistory?: Array<{
    round: string;
    amount: string;
    date: string;
    investors?: string[];
  }>;
  keyExecutives?: Array<{
    name: string;
    role: string;
    background?: string;
  }>;
  businessMetrics?: {
    valuation?: string;
    employeeGrowth?: string;
    customerCount?: string;
    marketShare?: string;
  };
  recentDevelopments?: Array<{
    type: "funding" | "product" | "partnership" | "expansion" | "leadership";
    title: string;
    date: string;
    impact: "high" | "medium" | "low";
  }>;
  competitiveContext?: {
    mainCompetitors: string[];
    differentiators: string[];
    challenges: string[];
  };
}

export interface VendorProfile {
  company: string;
  overview: string;
  products: Array<{
    name: string;
    category: string;
    description: string;
  }>;
  competitors: Array<{
    name: string;
    category: string;
    strength: string;
  }>;
  persona: {
    role: string;
    keyFocus: string[];
    successMetrics: string[];
    commonChallenges: string[];
  };
}