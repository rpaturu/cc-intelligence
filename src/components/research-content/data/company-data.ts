import { CompanyData } from "../../../types/research";

export const getCompanyData = (companyName: string): CompanyData => {
  const companyData: Record<string, CompanyData> = {
    "acme corp": {
      name: "Acme Corp",
      industry: "FinTech",
      size: "500 employees",
      location: "San Francisco, CA",
      recentNews: "$50M Series B funding (Dec 2024)",
      techStack: ["AWS", "Salesforce", "React", "Node.js", "PostgreSQL", "Kubernetes"],
      founded: "2020",
      revenue: "$25M ARR",
      businessModel: "B2B SaaS - Payment infrastructure for digital financial services",
      marketPosition: "Emerging player in embedded finance with focus on SMB banking solutions",
      growthStage: "Scale-up (Series B)",
      fundingHistory: [
        { round: "Series B", amount: "$50M", date: "Dec 2024", investors: ["Andreessen Horowitz", "Stripe", "Index Ventures"] },
        { round: "Series A", amount: "$15M", date: "Jun 2022", investors: ["Accel", "First Round Capital"] },
        { round: "Seed", amount: "$3M", date: "Mar 2021", investors: ["Y Combinator", "SV Angel"] }
      ],
      keyExecutives: [
        { name: "Sarah Chen", role: "CEO & Co-founder", background: "Former Stripe PM, Stanford CS" },
        { name: "Marcus Rodriguez", role: "CTO & Co-founder", background: "Ex-Square eng lead, MIT" },
        { name: "Jennifer Kim", role: "VP Sales", background: "Former Plaid enterprise sales director" }
      ],
      businessMetrics: {
        valuation: "$200M (Series B)",
        employeeGrowth: "+150% YoY",
        customerCount: "2,500+ SMBs",
        marketShare: "0.8% of embedded finance market"
      },
      recentDevelopments: [
        { type: "funding", title: "Series B led by a16z", date: "Dec 2024", impact: "high" },
        { type: "product", title: "Launch of ACH instant settlement", date: "Nov 2024", impact: "high" },
        { type: "partnership", title: "Integration with Quickbooks", date: "Oct 2024", impact: "medium" },
        { type: "expansion", title: "European market entry planned", date: "Sep 2024", impact: "high" },
        { type: "leadership", title: "Jennifer Kim joins as VP Sales", date: "Aug 2024", impact: "medium" }
      ],
      competitiveContext: {
        mainCompetitors: ["Stripe", "Square", "Adyen", "Plaid"],
        differentiators: ["SMB-focused", "Banking-first approach", "Vertical integrations"],
        challenges: ["Competing with Stripe's scale", "Banking regulation complexity", "Customer acquisition costs"]
      }
    },
    "acme": {
      name: "Acme Corp",
      industry: "FinTech",
      size: "500 employees",
      location: "San Francisco, CA",
      recentNews: "$50M Series B funding (Dec 2024)",
      techStack: ["AWS", "Salesforce", "React", "Node.js", "PostgreSQL", "Kubernetes"],
      founded: "2020",
      revenue: "$25M ARR",
      businessModel: "B2B SaaS - Payment infrastructure for digital financial services",
      marketPosition: "Emerging player in embedded finance with focus on SMB banking solutions",
      growthStage: "Scale-up (Series B)",
      fundingHistory: [
        { round: "Series B", amount: "$50M", date: "Dec 2024", investors: ["Andreessen Horowitz", "Stripe", "Index Ventures"] },
        { round: "Series A", amount: "$15M", date: "Jun 2022", investors: ["Accel", "First Round Capital"] },
        { round: "Seed", amount: "$3M", date: "Mar 2021", investors: ["Y Combinator", "SV Angel"] }
      ],
      keyExecutives: [
        { name: "Sarah Chen", role: "CEO & Co-founder", background: "Former Stripe PM, Stanford CS" },
        { name: "Marcus Rodriguez", role: "CTO & Co-founder", background: "Ex-Square eng lead, MIT" },
        { name: "Jennifer Kim", role: "VP Sales", background: "Former Plaid enterprise sales director" }
      ],
      businessMetrics: {
        valuation: "$200M (Series B)",
        employeeGrowth: "+150% YoY",
        customerCount: "2,500+ SMBs",
        marketShare: "0.8% of embedded finance market"
      },
      recentDevelopments: [
        { type: "funding", title: "Series B led by a16z", date: "Dec 2024", impact: "high" },
        { type: "product", title: "Launch of ACH instant settlement", date: "Nov 2024", impact: "high" },
        { type: "partnership", title: "Integration with Quickbooks", date: "Oct 2024", impact: "medium" },
        { type: "expansion", title: "European market entry planned", date: "Sep 2024", impact: "high" },
        { type: "leadership", title: "Jennifer Kim joins as VP Sales", date: "Aug 2024", impact: "medium" }
      ],
      competitiveContext: {
        mainCompetitors: ["Stripe", "Square", "Adyen", "Plaid"],
        differentiators: ["SMB-focused", "Banking-first approach", "Vertical integrations"],
        challenges: ["Competing with Stripe's scale", "Banking regulation complexity", "Customer acquisition costs"]
      }
    },
    "tesla": {
      name: "Tesla",
      industry: "Electric Vehicles & Clean Energy",
      size: "127,855 employees",
      location: "Austin, TX",
      recentNews: "Cybertruck production ramping up",
      techStack: ["Python", "C++", "Linux", "Custom Silicon", "AI/ML", "Neural Networks"],
      founded: "2003",
      revenue: "$96.8B",
      businessModel: "Direct-to-consumer EV manufacturing + Energy storage + Autonomous driving",
      marketPosition: "Global EV market leader with 20% market share",
      growthStage: "Public growth company",
      keyExecutives: [
        { name: "Elon Musk", role: "CEO", background: "Serial entrepreneur, SpaceX founder" },
        { name: "Drew Baglino", role: "SVP Powertrain & Energy", background: "20+ years Tesla, battery expert" },
        { name: "Lars Moravy", role: "VP Vehicle Engineering", background: "Model 3/Y chief engineer" }
      ],
      businessMetrics: {
        valuation: "$800B market cap",
        employeeGrowth: "+29% YoY",
        customerCount: "6M+ vehicles delivered",
        marketShare: "20% global EV market"
      },
      recentDevelopments: [
        { type: "product", title: "Cybertruck production begins", date: "Nov 2024", impact: "high" },
        { type: "expansion", title: "Mexico Gigafactory groundbreaking", date: "Oct 2024", impact: "high" },
        { type: "product", title: "FSD Beta v12 neural network", date: "Sep 2024", impact: "high" },
        { type: "partnership", title: "Ford Supercharger access deal", date: "Aug 2024", impact: "medium" }
      ],
      competitiveContext: {
        mainCompetitors: ["BYD", "Volkswagen", "GM", "Ford", "Rivian"],
        differentiators: ["Supercharger network", "Full self-driving", "Manufacturing efficiency"],
        challenges: ["Chinese competition", "Traditional OEM catch-up", "Regulatory scrutiny"]
      }
    },
    "shopify": {
      name: "Shopify",
      industry: "E-commerce Platform",
      size: "11,600 employees",
      location: "Ottawa, Canada",
      recentNews: "Shopify Plus growing 25% YoY",
      techStack: ["Ruby on Rails", "React", "GraphQL", "Kubernetes", "MySQL", "Redis"],
      founded: "2006",
      revenue: "$7.1B",
      businessModel: "SaaS + Transaction fees - Multi-tenant e-commerce platform",
      marketPosition: "Leading SMB e-commerce platform, #2 after Amazon in North America",
      growthStage: "Public scale company",
      keyExecutives: [
        { name: "Tobias Lütke", role: "CEO", background: "Co-founder, former developer" },
        { name: "Amy Shapero", role: "CFO", background: "Former Google finance executive" },
        { name: "Kaz Nejatian", role: "VP Product", background: "Former Kash founder" }
      ],
      businessMetrics: {
        valuation: "$65B market cap",
        employeeGrowth: "+15% YoY",
        customerCount: "5.6M merchants",
        marketShare: "10% of US e-commerce market"
      },
      recentDevelopments: [
        { type: "product", title: "Shopify Magic AI assistant launch", date: "Dec 2024", impact: "high" },
        { type: "expansion", title: "European POS expansion", date: "Nov 2024", impact: "medium" },
        { type: "partnership", title: "YouTube Shopping integration", date: "Oct 2024", impact: "medium" },
        { type: "product", title: "Plus 25% growth milestone", date: "Sep 2024", impact: "high" }
      ],
      competitiveContext: {
        mainCompetitors: ["Amazon", "WooCommerce", "BigCommerce", "Magento", "Wix"],
        differentiators: ["Ease of use", "App ecosystem", "Multi-channel commerce"],
        challenges: ["Amazon competition", "Platform dependency", "International expansion"]
      }
    },
    "microsoft": {
      name: "Microsoft",
      industry: "Technology - Cloud & Productivity Software",
      size: "221,000 employees",
      location: "Redmond, WA",
      recentNews: "AI integration across Office suite",
      techStack: ["Azure", ".NET", "TypeScript", "AI/ML", "C#", "React"],
      founded: "1975",
      revenue: "$211B",
      businessModel: "Enterprise software + Cloud services + Gaming + Hardware",
      marketPosition: "Global technology leader, #2 cloud provider after AWS",
      growthStage: "Mature public company in growth phase",
      keyExecutives: [
        { name: "Satya Nadella", role: "CEO", background: "22-year Microsoft veteran, cloud transformation leader" },
        { name: "Amy Hood", role: "CFO", background: "Former McKinsey consultant, 13+ years at Microsoft" },
        { name: "Rajesh Jha", role: "EVP Office & Windows", background: "20+ year Microsoft veteran" }
      ],
      businessMetrics: {
        valuation: "$2.8T market cap",
        employeeGrowth: "+8% YoY",
        customerCount: "1.4B Office users",
        marketShare: "21% cloud infrastructure market"
      },
      recentDevelopments: [
        { type: "product", title: "Copilot integration across Office suite", date: "Dec 2024", impact: "high" },
        { type: "partnership", title: "OpenAI strategic partnership expansion", date: "Nov 2024", impact: "high" },
        { type: "product", title: "Azure AI infrastructure scaling", date: "Oct 2024", impact: "high" },
        { type: "expansion", title: "European data center expansion", date: "Sep 2024", impact: "medium" }
      ],
      competitiveContext: {
        mainCompetitors: ["Amazon (AWS)", "Google", "Apple", "Oracle", "Salesforce"],
        differentiators: ["Enterprise relationships", "Integrated ecosystem", "AI leadership"],
        challenges: ["AWS competition", "Regulatory scrutiny", "Open source alternatives"]
      }
    }
  };

  return companyData[companyName.toLowerCase()] || {
    name: companyName,
    industry: "Technology",
    size: "1,000+ employees",
    location: "United States",
    recentNews: "Expanding operations globally",
    techStack: ["Modern web technologies", "Cloud platforms"],
    founded: "2000s",
    revenue: "Growing",
    businessModel: "Technology solutions provider",
    marketPosition: "Emerging technology company",
    growthStage: "Growth stage"
  };
};
