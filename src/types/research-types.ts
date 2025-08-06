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
  type: "article" | "press_release" | "report" | "social" | "company_page";
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
  name: string;
  industry: string;
  size: string;
  location: string;
  recentNews: string;
  techStack: string[];
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