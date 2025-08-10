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
    "tech_stack": {
      title: "Technology Stack & Preferences",
      items: [
        {
          title: "Current Identity Infrastructure",
          description: "Legacy systems creating friction and security gaps",
          details: [
            "Auth0 for customer authentication (contract expires Q2 2025) [4]",
            "On-premise Active Directory for employees [4]",
            "Custom LDAP integration for contractors [4]",
            "Multiple point solutions creating complexity [4]"
          ]
        },
        {
          title: "Cloud & Development Stack",
          description: "Modern cloud-first architecture with AWS foundation",
          details: [
            "AWS (primary cloud provider) [4]",
            "Salesforce CRM and marketing cloud [4]",
            "React/Node.js for web applications [4]",
            "PostgreSQL and Redis for data [4]",
            "GitHub for code management [7]"
          ]
        },
        {
          title: "Integration Requirements",
          description: "Need for seamless SSO across all business applications",
          details: [
            "25+ SaaS applications requiring SSO [4]",
            "Custom API integrations for financial systems [4]",
            "SCIM provisioning for user lifecycle management [4]",
            "Strong preference for REST APIs and webhooks [4]"
          ]
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
            "Manual user provisioning causing delays [5]",
            "Password-related security incidents increasing [5]"
          ]
        },
        {
          title: "Operational Inefficiencies",
          description: "Multiple identity systems creating friction",
          details: [
            "IT spends 15 hours/week on user access requests [1]",
            "New employee onboarding takes 3-5 days [1]",
            "Users maintain 8+ different passwords [1]",
            "Help desk tickets for password resets up 40% [1]"
          ]
        },
        {
          title: "Scaling Challenges",
          description: "Current systems won't support planned growth",
          details: [
            "Hiring 200+ employees in next 12 months [2]",
            "International expansion planned for Q3 2025 [2]",
            "Need to support contractors and partners [2]",
            "Current systems lack automation capabilities [2]"
          ]
        }
      ]
    },
    "competitive_positioning": {
      title: "Competitive Positioning & Value Propositions",
      items: [
        {
          title: "Okta vs Auth0 (Current Provider)",
          description: "Positioning against their current CIAM provider",
          details: [
            "Contract renewal opportunity - Auth0 expires Q2 2025 [4]",
            "Unified platform vs. point solution approach",
            "Enterprise-grade security and compliance",
            "Better integration ecosystem and marketplace"
          ],
          valueProps: [
            {
              competitor: "Auth0",
              ourAdvantage: "Unified Workforce + Customer Identity Platform",
              talkingPoints: [
                "One platform for both employee and customer identity vs. Auth0's customer-only focus",
                "Okta's 7,000+ pre-built integrations vs. Auth0's limited app ecosystem",
                "Enterprise-grade governance and compliance built-in vs. add-on modules",
                "Better scalability - Okta handles 100B+ authentications annually"
              ],
              objectionHandling: "If they say Auth0 is 'good enough' - emphasize the operational overhead of managing multiple identity systems and the risk of gaps between workforce and customer identity security."
            }
          ]
        },
        {
          title: "Okta vs Microsoft Entra ID",
          description: "Defending against the bundling strategy",
          details: [
            "Microsoft may pitch 'free' identity with Office 365",
            "Acme Corp uses multiple cloud providers (not Microsoft-first) [4]",
            "FinTech regulations require best-of-breed security [5]",
            "Microsoft's identity limitations in multi-cloud environments"
          ],
          valueProps: [
            {
              competitor: "Microsoft Entra ID",
              ourAdvantage: "Best-of-Breed Multi-Cloud Identity",
              talkingPoints: [
                "Cloud-neutral vs. Microsoft's Azure-first approach",
                "7,000+ integrations vs. Microsoft's limited third-party app support",
                "Purpose-built for identity vs. Microsoft's general productivity focus",
                "Better support for AWS-native applications and services [4]"
              ],
              objectionHandling: "If they mention 'bundled pricing' - calculate the hidden costs of Microsoft licensing, limited functionality, and the risk of vendor lock-in for a multi-cloud FinTech company."
            }
          ]
        }
      ]
    },
    "recent_activities": {
      title: "Recent Activities & Signals",
      items: [
        {
          title: "Funding & Growth",
          description: "Strong financial position driving expansion",
          details: [
            "$50M Series B completed December 2024 [2]",
            "40% increase in engineering headcount planned [2]",
            "New CTO hired from Stripe in April 2024 [6]",
            "Board pressuring for faster product development [2]"
          ]
        },
        {
          title: "Security Initiatives",
          description: "Recent focus on improving security posture",
          details: [
            "SOC 2 Type II audit completed November 2024 [5]",
            "CISO hired to lead compliance efforts [3]",
            "Security training budget increased 3x [5]",
            "Zero-trust architecture evaluation underway [6]"
          ]
        }
      ]
    },
    "budget_indicators": {
      title: "Budget Indicators & Financial Signals",
      items: [
        {
          title: "Strong Financial Position",
          description: "Recent funding provides significant budget flexibility",
          details: [
            "$50M Series B with $40M still available [2]",
            "Burn rate decreased while revenue grew 200% [2]",
            "Engineering budget allocated $8M for 2025 [2]",
            "Security/compliance budget set at $2M annually [2]"
          ]
        }
      ]
    },
    "buying_signals": {
      title: "Buying Signals & Purchase Intent",
      items: [
        {
          title: "Active Evaluation Process",
          description: "Currently researching identity management solutions",
          details: [
            "RFP process initiated for identity platform [3]",
            "Attended Okta Connect and Microsoft Ignite [9]",
            "Downloaded Okta white papers and case studies [3]",
            "CTO posted about identity challenges on LinkedIn [8]"
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