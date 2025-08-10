export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  priority?: number;
  roleRelevance: {
    AE: number;      // 0-10 relevance score
    SE: number;
    CSM: number;
  };
  completed?: boolean;
}

export interface VendorProfile {
  company: string;
  overview: string;
  products: Array<{
    name: string;
    category: string;
    description: string;
  }>;
  persona: {
    role: string;
    keyFocus: string[];
    successMetrics: string[];
    commonChallenges: string[];
  };
}

export interface ResearchFindings {
  id: string;
  title: string;
  researchArea: string;
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
    citations?: number[];
  }>;
}

export interface Source {
  id: number;
  title: string;
  url: string;
  domain: string;
  description?: string;
  snippet?: string;
  type: "article" | "press_release" | "report" | "social" | "company_page" | "news_article" | "research_report";
  relevance: "high" | "medium" | "low";
  publishedDate?: string;
}

export interface VendorInsights {
  opportunities: string[];
  challenges: string[];
  competitiveAdvantage: string;
  nextSteps: string[];
}

export interface CompanySummary {
  // Core fields (required)
  name: string;
  industry: string;
  size: string;
  location: string;
  recentNews: string;
  techStack: string[];
  founded: string;  // Made required to match Figma
  revenue: string;  // Made required to match Figma
  
  // Enhanced fields (optional - matching Figma CompanyData exactly)
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
    background?: string;  // Made optional to match Figma
  }>;
  businessMetrics?: {
    valuation?: string;
    employeeGrowth?: string;
    customerCount?: string;
    marketShare?: string;
  };
  recentDevelopments?: Array<{
    type: 'funding' | 'product' | 'partnership' | 'expansion' | 'leadership';
    title: string;
    date: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  competitiveContext?: {
    mainCompetitors: string[];
    differentiators: string[];
    challenges: string[];
  };
}

export interface ResearchProgress {
  totalAreas: number;
  completedAreas: number;
  completedIds: string[];
  isCollapsed?: boolean;
}

export interface StreamingStep {
  text: string;
  completed: boolean;
  icon?: React.ReactNode;
  type?: 'analysis' | 'data' | 'research' | 'completion';
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  vendorProfile?: VendorProfile;
  companySummary?: CompanySummary;
  researchAreas?: ResearchArea[];
  options?: Array<{
    id: string;
    text: string;
    icon?: React.ReactNode;
  }>;
  researchFindings?: ResearchFindings;
  sources?: Source[];
  vendorInsights?: VendorInsights;
  followUpOptions?: Array<{
    id: string;
    text: string;
    icon?: React.ReactNode;
    category: string;
    description?: string;
  }>;
  isStreaming?: boolean;
  streamingSteps?: StreamingStep[];
  researchProgress?: ResearchProgress;
  isPersonalizedWelcome?: boolean;
} 