import { UserProfile } from '../types/api';

interface CompanyIntelligence {
  focus: string;
  winStrategy: string;
  latestNews: string[];
  competitiveEdge: {
    platform: string;
    description: string;
    keyPoints: string[];
  }[];
  challenges: string[];
  metrics: {
    quotaTarget: string;
    dealSize: string;
    salesCycle: string;
    growth: string;
  };
}

interface WelcomeSource {
  id: number;
  title: string;
  url: string;
  domain: string;
  description?: string;
  snippet?: string;
  relevance: "high" | "medium" | "low";
  type: "article" | "press_release" | "report" | "social" | "company_page" | "news_article" | "research_report";
  publishedDate?: string;
}

export const getCompanyIntelligence = (companyName: string, territory: string = 'north-america'): CompanyIntelligence => {
  const territoryDisplayName = territory === 'north-america' ? 'territory expansion' :
                             territory === 'europe' ? 'European expansion' :
                             territory === 'asia-pacific' ? 'APAC growth' :
                             'market expansion';

  if (companyName.toLowerCase() === 'okta') {
    return {
      focus: `focused on ${territoryDisplayName}, executive relationship building, and competitive displacement`,
      winStrategy: "You win by positioning **Workforce Identity Cloud, PAM, and IGA** as a unified zero-trust platform[1]—while navigating enterprise buyers and proving ROI against **Microsoft and CyberArk**[2]",
      latestNews: [
        "Okta launches **AI-powered Identity Threat Detection** for enterprise clients[3]",
        "Okta named a **Leader in the 2025 Gartner Magic Quadrant** for Access Management[4]"
      ],
      competitiveEdge: [
        {
          platform: "Core Platform",
          description: "Workforce Identity Cloud",
          keyPoints: ["Market-leading SSO and MFA for 15,000+ customers"]
        },
        {
          platform: "CIAM",
          description: "Customer Identity Cloud",
          keyPoints: ["Auth0 acquisition strengthens developer-first CIAM"]
        },
        {
          platform: "PAM",
          description: "Privileged Access Management",
          keyPoints: ["Zero-trust approach to privileged account security"]
        },
        {
          platform: "IGA",
          description: "Identity Governance",
          keyPoints: ["Automated compliance and access certification"]
        }
      ],
      challenges: [
        "Competing against Microsoft and CyberArk",
        "Justifying premium pricing in security market",
        "Navigating complex enterprise buying committees",
        "Proving ROI in zero-trust transformations"
      ],
      metrics: {
        quotaTarget: "120%+ target",
        dealSize: "$45K ARR",
        salesCycle: "90-day average",
        growth: "Territory growth year-over-year"
      }
    };
  } else if (companyName.toLowerCase() === 'salesforce') {
    return {
      focus: `focused on ${territoryDisplayName}, digital transformation, and platform adoption`,
      winStrategy: "You win by positioning **Sales Cloud, Service Cloud, and Marketing Cloud** as an integrated CRM ecosystem[1]—while competing against **Microsoft and HubSpot**[2]",
      latestNews: [
        "Salesforce announces **AI-powered Einstein GPT** for enterprise sales teams[3]",
        "Salesforce recognized as a **Leader in Gartner's CRM Magic Quadrant** for 2025[4]"
      ],
      competitiveEdge: [
        {
          platform: "Sales Cloud",
          description: "Leading CRM Platform",
          keyPoints: ["Industry-leading sales automation and pipeline management"]
        },
        {
          platform: "Service Cloud",
          description: "Customer Service Platform",
          keyPoints: ["Unified customer service across all channels"]
        },
        {
          platform: "Marketing Cloud",
          description: "Marketing Automation",
          keyPoints: ["Personalized customer journeys at scale"]
        },
        {
          platform: "Platform",
          description: "Custom App Development",
          keyPoints: ["Low-code/no-code application development"]
        }
      ],
      challenges: [
        "Competing against Microsoft Dynamics and HubSpot",
        "Justifying platform complexity for smaller businesses",
        "Managing multi-cloud implementation projects",
        "Proving time-to-value for digital transformation"
      ],
      metrics: {
        quotaTarget: "110%+ target",
        dealSize: "$65K ARR",
        salesCycle: "120-day average",
        growth: "Platform adoption year-over-year"
      }
    };
  } else {
    // Generic company template
    return {
      focus: `focused on ${territoryDisplayName}, relationship building, and competitive positioning`,
      winStrategy: `You win by understanding your prospects' challenges and positioning **${companyName}'s solutions** as the best fit for their business needs[1]`,
      latestNews: [
        `${companyName} continues to **innovate in the enterprise market**[3]`,
        `${companyName} expands market presence with **new strategic partnerships**[4]`
      ],
      competitiveEdge: [
        {
          platform: "Core Platform",
          description: `${companyName} Solutions`,
          keyPoints: ["Industry-leading technology and customer success"]
        },
        {
          platform: "Innovation",
          description: "Market Leadership",
          keyPoints: ["Continuous innovation and market expansion"]
        }
      ],
      challenges: [
        "Competing in a crowded marketplace",
        "Differentiating from established competitors",
        "Proving value and ROI to enterprise buyers",
        "Navigating complex sales cycles"
      ],
      metrics: {
        quotaTarget: "100%+ target",
        dealSize: "Market average",
        salesCycle: "Standard cycle",
        growth: "Consistent growth"
      }
    };
  }
};

export const generatePersonalizedWelcome = (profile: UserProfile | null, user: any): string => {
  const firstName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const companyName = profile?.company || 'your company';
  const territory = profile?.territory || 'north-america';

  const companyIntelligence = getCompanyIntelligence(companyName, territory);
  
  return `**Welcome back, ${firstName}. I've done my homework.**

**How You Win**

⚔️ ${companyIntelligence.winStrategy}.

---

**Latest ${companyName} Highlights**

📰 Recent Company Updates  
• ${companyIntelligence.latestNews[0]}  
• ${companyIntelligence.latestNews[1]}

---

**Ready to Research?**

🚀 **I'm here to help you prep faster, compete sharper, and close stronger.**

Simply tell me which customer you want to research, and I'll surface the most relevant insights, guidance, and content—tailored to your role and how you win deals.`;
};

export const getWelcomeSources = (companyName: string): WelcomeSource[] => {
  if (companyName.toLowerCase() === 'okta') {
    return [
      {
        id: 1,
        title: "Okta Product Portfolio - Identity and Access Management Solutions",
        url: "https://okta.com/products/",
        domain: "okta.com",
        description: "Comprehensive overview of Okta's Workforce Identity Cloud, Privileged Access Management, and Identity Governance & Administration solutions for zero-trust security.",
        snippet: "Comprehensive overview of Okta's Workforce Identity Cloud, Privileged Access Management, and Identity Governance & Administration solutions for zero-trust security.",
        relevance: "high",
        type: "company_page"
      },
      {
        id: 2,
        title: "Competitive Landscape Analysis: Okta vs Microsoft vs CyberArk",
        url: "https://gartner.com/market-analysis/identity-access-management-2025",
        domain: "gartner.com",
        description: "Industry analysis comparing leading identity and access management vendors, highlighting competitive positioning and market dynamics.",
        snippet: "Industry analysis comparing leading identity and access management vendors, highlighting competitive positioning and market dynamics.",
        relevance: "high",
        type: "report"
      },
      {
        id: 3,
        title: "Okta Launches AI-Powered Identity Threat Detection",
        url: "https://techcrunch.com/2025/07/15/okta-ai-threat-detection",
        domain: "techcrunch.com",
        description: "TechCrunch coverage of Okta's latest AI-powered security features for enterprise identity threat detection and response.",
        snippet: "TechCrunch coverage of Okta's latest AI-powered security features for enterprise identity threat detection and response.",
        relevance: "high",
        type: "news_article",
        publishedDate: "Jul 15, 2024"
      },
      {
        id: 4,
        title: "Gartner Magic Quadrant for Access Management 2025",
        url: "https://gartner.com/magic-quadrant/access-management-2025",
        domain: "gartner.com",
        description: "Gartner's annual Magic Quadrant analysis positioning Okta as a Leader in the Access Management market for 2025.",
        snippet: "Gartner's annual Magic Quadrant analysis positioning Okta as a Leader in the Access Management market for 2025.",
        relevance: "high",
        type: "research_report"
      }
    ];
  } else if (companyName.toLowerCase() === 'salesforce') {
    return [
      {
        id: 1,
        title: "Salesforce CRM Platform - Sales, Service, and Marketing Cloud",
        url: "https://salesforce.com/products/",
        domain: "salesforce.com",
        description: "Complete overview of Salesforce's integrated CRM ecosystem including Sales Cloud, Service Cloud, Marketing Cloud, and Platform for customer engagement.",
        snippet: "Complete overview of Salesforce's integrated CRM ecosystem including Sales Cloud, Service Cloud, Marketing Cloud, and Platform for customer engagement.",
        relevance: "high",
        type: "company_page"
      },
      {
        id: 2,
        title: "Salesforce vs Microsoft Dynamics vs HubSpot - CRM Comparison",
        url: "https://gartner.com/crm-vendor-comparison-2025",
        domain: "gartner.com",
        description: "Comprehensive analysis comparing leading CRM platforms, highlighting strengths, weaknesses, and competitive positioning in enterprise markets.",
        snippet: "Comprehensive analysis comparing leading CRM platforms, highlighting strengths, weaknesses, and competitive positioning in enterprise markets.",
        relevance: "high",
        type: "research_report"
      },
      {
        id: 3,
        title: "Salesforce Announces Einstein GPT for Sales Teams",
        url: "https://techcrunch.com/2025/01/10/salesforce-einstein-gpt",
        domain: "techcrunch.com",
        description: "Latest coverage of Salesforce's AI-powered Einstein GPT integration for automated sales processes and customer engagement.",
        snippet: "Latest coverage of Salesforce's AI-powered Einstein GPT integration for automated sales processes and customer engagement.",
        relevance: "high",
        type: "news_article",
        publishedDate: "Jan 10, 2025"
      },
      {
        id: 4,
        title: "Gartner Magic Quadrant for CRM Customer Engagement 2025",
        url: "https://gartner.com/magic-quadrant/crm-2025",
        domain: "gartner.com",
        description: "Gartner's annual Magic Quadrant positioning Salesforce as a Leader in CRM Customer Engagement Centers for 2025.",
        snippet: "Gartner's annual Magic Quadrant positioning Salesforce as a Leader in CRM Customer Engagement Centers for 2025.",
        relevance: "high",
        type: "research_report"
      }
    ];
  } else {
    // Generic sources for other companies
    return [
      {
        id: 1,
        title: `${companyName} Company Overview and Solutions`,
        url: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com/about`,
        domain: `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        relevance: "high",
        type: "company_page"
      },
      {
        id: 2,
        title: `${companyName} Market Analysis and Competitive Positioning`,
        url: "https://industry-analysis.com/market-report",
        domain: "industry-analysis.com",
        relevance: "medium",
        type: "report"
      },
      {
        id: 3,
        title: `${companyName} Latest News and Updates`,
        url: "https://news.company.com/latest",
        domain: "news.company.com",
        relevance: "medium",
        type: "article",
        publishedDate: "Recent"
      }
    ];
  }
};

export const getRoleFocusAreas = (role: string): string[] => {
  switch (role) {
    case 'account-executive':
      return [
        "Territory expansion and account penetration",
        "Competitive displacement strategies", 
        "Executive relationship building",
        "Multi-product upsell opportunities"
      ];
    case 'solutions-engineer':
      return [
        "Technical requirements discovery",
        "Solution architecture and fit analysis",
        "Integration and implementation planning",
        "Technical stakeholder engagement"
      ];
    case 'sales-development':
      return [
        "Lead qualification and scoring",
        "Outreach personalization at scale",
        "Pipeline generation and nurturing",
        "Qualification criteria optimization"
      ];
    case 'customer-success':
      return [
        "Customer health monitoring",
        "Expansion opportunity identification",
        "Renewal risk assessment",
        "Satisfaction analysis and improvement"
      ];
    default:
      return [
        "Account growth and expansion",
        "Relationship building and management",
        "Competitive positioning",
        "Value demonstration and ROI"
      ];
  }
};