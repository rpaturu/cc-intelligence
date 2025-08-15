export const getResearchFindings = (optionId: string, companyName: string) => {
  const findings: Record<string, any> = {
    "decision_makers": {
      title: "Key Contacts & Decision Makers",
      items: [
        {
          title: "Sarah Chen - Chief Technology Officer",
          description: "Primary technical decision maker for infrastructure and security tools",
          details: [
            "Joined 8 months ago from Stripe [6]",
            "Previously led identity platform at Scale AI [8]",
            "Strong advocate for modern auth solutions [8]",
            "Active on LinkedIn discussing zero-trust architecture [8]"
          ],
          contact: {
            name: "Sarah Chen",
            role: "CTO",
            email: "sarah.chen@acmecorp.com",
            linkedin: "linkedin.com/in/sarahchen-tech"
          }
        },
        {
          title: "Marcus Rodriguez - VP of Engineering",
          description: "Oversees implementation of security and dev tools",
          details: [
            "15+ years experience in FinTech security [9]",
            "Currently evaluating SSO solutions [4]",
            "Attended recent Okta Connect conference [9]",
            "Budget owner for engineering tools ($2M annually) [1]"
          ],
          contact: {
            name: "Marcus Rodriguez",
            role: "VP Engineering",
            email: "marcus.r@acmecorp.com",
            phone: "(555) 123-4567"
          }
        },
        {
          title: "Jennifer Wu - CISO",
          description: "Security and compliance decision maker",
          details: [
            "Recently published blog on identity governance [3]",
            "Mandate to improve compliance posture [5]",
            "Evaluating identity providers Q1 2025 [3]",
            "Direct report to CEO [3]"
          ],
          contact: {
            name: "Jennifer Wu",
            role: "CISO",
            email: "jennifer.wu@acmecorp.com",
            linkedin: "linkedin.com/in/jennifer-wu-security"
          }
        }
      ]
    },
    "business_challenges": {
      title: "Business Challenges & Pain Points",
      items: [
        {
          title: "Security & Compliance Burden",
          description: "Growing regulatory requirements straining current systems",
          details: [
            "SOC 2 Type II audit identified identity gaps [5]",
            "PCI DSS compliance requires stronger access controls [5]",
            "Manual user provisioning creating security risks [1]",
            "Password-related security incidents increased 40% [2]"
          ]
        },
        {
          title: "Operational Inefficiencies",
          description: "Legacy identity systems causing productivity losses",
          details: [
            "IT spends 20+ hours/week on access management [1]",
            "New employee onboarding takes 3-5 days [1]",
            "Help desk tickets for password resets: 200+/month [2]",
            "Multiple identity silos across departments [4]"
          ]
        },
        {
          title: "Scalability Challenges",
          description: "Current systems struggling with rapid growth",
          details: [
            "Employee count grew 150% in past 18 months [7]",
            "Remote workforce expanded to 80% [7]",
            "SaaS application count increased to 120+ [4]",
            "Identity infrastructure reaching capacity limits [4]"
          ]
        }
      ]
    }
  };

  return {
    id: optionId,
    title: findings[optionId]?.title || `Analysis for ${companyName}`,
    researchArea: optionId,
    ...findings[optionId] || {
      items: [
        {
          title: "Key Finding 1",
          description: "Important insight about the company's current situation.",
        },
        {
          title: "Key Finding 2", 
          description: "Strategic information relevant to your sales approach.",
        },
      ]
    }
  };
};

export const getMockSources = (companyName: string, researchArea: string) => {
  const baseSources = [
    {
      id: 1,
      title: `${companyName} Annual Report 2024`,
      url: `https://${companyName.toLowerCase().replace(' ', '')}.com/investors/annual-report-2024`,
      domain: `${companyName.toLowerCase().replace(' ', '')}.com`,
      description: "Financial performance and strategic initiatives",
      publishedDate: "Mar 15, 2024",
      type: "report" as const,
      relevance: "high" as const
    },
    {
      id: 2,
      title: `${companyName} Security Incident Response Update`,
      url: `https://${companyName.toLowerCase().replace(' ', '')}.com/blog/security-update`,
      domain: `${companyName.toLowerCase().replace(' ', '')}.com`,
      description: "Response to recent security challenges and improvements",
      publishedDate: "Jan 22, 2024",
      type: "press_release" as const,
      relevance: "high" as const
    },
    {
      id: 3,
      title: `${companyName} Leadership Interview - TechCrunch`,
      url: `https://techcrunch.com/${companyName.toLowerCase()}-ciso-interview`,
      domain: "techcrunch.com",
      description: "CISO discusses compliance strategy and technology investments",
      publishedDate: "Dec 5, 2024",
      type: "article" as const,
      relevance: "medium" as const
    },
    {
      id: 4,
      title: `${companyName} Technology Stack Overview`,
      url: `https://stackshare.io/${companyName.toLowerCase()}`,
      domain: "stackshare.io",
      description: "Technical infrastructure and tool usage",
      type: "report" as const,
      relevance: "medium" as const
    },
    {
      id: 5,
      title: `${companyName} Completes SOC 2 Type II Audit`,
      url: `https://${companyName.toLowerCase().replace(' ', '')}.com/blog/soc2-compliance`,
      domain: `${companyName.toLowerCase().replace(' ', '')}.com`,
      description: "Security compliance and certification updates",
      publishedDate: "Nov 22, 2024",
      type: "press_release" as const,
      relevance: "high" as const
    },
    {
      id: 6,
      title: `Interview: ${companyName} CTO on Digital Transformation`,
      url: `https://www.builtinnyc.com/${companyName.toLowerCase()}-cto-interview`,
      domain: "builtinnyc.com",
      description: "Technology leadership insights and strategic direction",
      publishedDate: "Oct 8, 2024",
      type: "article" as const,
      relevance: "medium" as const
    },
    {
      id: 7,
      title: `${companyName} Job Postings - Engineering Roles`,
      url: `https://${companyName.toLowerCase().replace(' ', '')}.com/careers`,
      domain: `${companyName.toLowerCase().replace(' ', '')}.com`,
      description: "Current hiring patterns and growth signals",
      type: "company_page" as const,
      relevance: "medium" as const
    }
  ];

  if (researchArea === "decision_makers") {
    baseSources.push(
      {
        id: 8,
        title: "Sarah Chen - CTO Profile on LinkedIn",
        url: "https://linkedin.com/in/sarahchen-tech",
        domain: "linkedin.com",
        description: "Professional background and recent activities",
        publishedDate: "Recent Activity",
        type: "article" as const,
        relevance: "medium" as const
      },
      {
        id: 9,
        title: "Marcus Rodriguez speaks at FinTech Security Summit",
        url: "https://fintechsummit.com/speakers/marcus-rodriguez",
        domain: "fintechsummit.com",
        description: "VP Engineering presenting on security architecture",
        publishedDate: "Sep 12, 2024",
        type: "article" as const,
        relevance: "medium" as const
      }
    );
  }

  return baseSources;
}; 