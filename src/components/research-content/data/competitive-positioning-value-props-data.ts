import type { 
  IValueProposition, 
  ValuePropCategory 
} from './types';

export const valuePropositions: IValueProposition[] = [
  {
    id: "unified-platform",
    category: "Integration",
    title: "Unified Identity Platform Architecture",
    description: "Single platform that consolidates workforce and customer identity management with comprehensive SSO, MFA, and governance capabilities",
    differentiator: "Unlike competitors who require multiple products, we provide complete identity coverage in one integrated solution",
    competitiveAdvantage: "Reduces complexity, lowers total cost of ownership, and eliminates integration challenges that plague multi-vendor approaches",
    evidencePoints: [
      "45% reduction in total identity costs vs. multi-vendor solutions",
      "90% faster time-to-deployment compared to Okta + Auth0 combination",
      "Single vendor relationship eliminates finger-pointing",
      "Unified analytics and reporting across all identity use cases"
    ],
    customerBenefits: [
      "Simplified vendor management and procurement",
      "Reduced training and expertise requirements",
      "Faster problem resolution with single support team",
      "Consistent user experience across all applications"
    ],
    targetPersonas: [
      "CTO - Technology consolidation",
      "CISO - Simplified security management", 
      "IT Director - Operational efficiency",
      "Procurement - Vendor consolidation"
    ],
    messagingFramework: {
      primaryMessage: "Stop managing multiple identity vendors. Get complete identity coverage with a single, unified platform that scales with your business.",
      supportingPoints: [
        "Eliminate vendor sprawl and integration complexity",
        "Reduce total cost of ownership by up to 45%",
        "Deploy faster with pre-integrated capabilities",
        "Scale seamlessly from startup to enterprise"
      ],
      proofPoints: [
        "Customer case study: TechCorp reduced identity costs by $800K annually",
        "Forrester study: 65% faster deployment than competitors",
        "Gartner recognition as platform leader",
        "99.99% uptime SLA with enterprise support"
      ],
      objectionHandling: [
        {
          objection: "We're already invested in our current solutions",
          response: "We provide migration tools and professional services to minimize disruption while maximizing ROI",
          evidence: [
            "Average migration completed in 90 days",
            "Zero-downtime migration guarantee",
            "ROI typically achieved within 12 months"
          ]
        },
        {
          objection: "Best-of-breed solutions might be better for specific use cases",
          response: "Our platform provides best-in-class capabilities across all identity use cases, eliminating trade-offs",
          evidence: [
            "Leader in Gartner Magic Quadrant for both workforce and CIAM",
            "Higher customer satisfaction scores than point solutions",
            "Advanced features competitive with specialists"
          ]
        }
      ]
    }
  },
  {
    id: "modern-architecture", 
    category: "Scalability",
    title: "Cloud-Native Modern Architecture",
    description: "Built from the ground up for cloud scalability with API-first design, microservices architecture, and elastic scaling capabilities",
    differentiator: "While competitors struggle with legacy architecture debt, our modern platform scales effortlessly and integrates seamlessly",
    competitiveAdvantage: "Superior performance, reliability, and developer experience compared to legacy solutions being modernized",
    evidencePoints: [
      "API-first architecture with 99.9% API uptime",
      "Sub-100ms authentication response times at scale",
      "Elastic scaling handles 10x traffic spikes automatically",
      "Developer-friendly SDKs and comprehensive documentation"
    ],
    customerBenefits: [
      "Better performance and user experience",
      "Reduced infrastructure costs through efficiency",
      "Future-proof technology investment",
      "Faster integration and development cycles"
    ],
    targetPersonas: [
      "VP of Engineering - Technical architecture",
      "Solutions Architect - Integration requirements",
      "DevOps Lead - Performance and reliability",
      "Developer - Implementation experience"
    ],
    messagingFramework: {
      primaryMessage: "Don't settle for modernized legacy systems. Choose a platform built for the cloud from day one.",
      supportingPoints: [
        "Cloud-native architecture delivers superior performance",
        "API-first design enables faster integration",
        "Microservices architecture ensures reliability and scalability",
        "Developer-centric approach reduces implementation time"
      ],
      proofPoints: [
        "Sub-100ms response times under load",
        "99.9% API availability SLA",
        "Handles 1M+ authentications per second",
        "Ranked #1 for developer experience by TechTarget"
      ],
      objectionHandling: [
        {
          objection: "Our current solution works fine for our scale",
          response: "Modern architecture provides benefits beyond scale - better security, performance, and developer productivity",
          evidence: [
            "60% improvement in application response times",
            "85% reduction in security incidents",
            "40% faster feature development cycles"
          ]
        }
      ]
    }
  },
  {
    id: "superior-support",
    category: "User Experience",
    title: "White-Glove Customer Success",
    description: "Dedicated customer success teams, 24/7 expert support, and proactive monitoring ensure your identity platform never becomes a bottleneck",
    differentiator: "While competitors treat support as a cost center, we invest in customer success as a competitive advantage",
    competitiveAdvantage: "Higher customer satisfaction, faster issue resolution, and strategic guidance that turns identity into a business enabler",
    evidencePoints: [
      "Average 5-minute response time for critical issues",
      "95% customer satisfaction score (vs. industry average of 68%)", 
      "Dedicated customer success manager for enterprise accounts",
      "Proactive monitoring prevents 90% of potential issues"
    ],
    customerBenefits: [
      "Reduced downtime and business disruption",
      "Faster problem resolution and root cause analysis",
      "Strategic guidance for identity optimization",
      "Peace of mind with proactive support"
    ],
    targetPersonas: [
      "IT Operations - Support and reliability",
      "CISO - Risk management",
      "CTO - Strategic technology guidance",
      "End Users - User experience quality"
    ],
    messagingFramework: {
      primaryMessage: "Get the support you deserve. Our customer success team treats your identity platform like their own business-critical system.",
      supportingPoints: [
        "24/7 expert support with 5-minute response times",
        "Proactive monitoring prevents issues before they impact users",
        "Dedicated customer success managers provide strategic guidance",
        "95% customer satisfaction vs. 68% industry average"
      ],
      proofPoints: [
        "Customer testimonial: 'Best support experience in enterprise software'",
        "Net Promoter Score of 78 (vs. Okta's 23)",
        "Zero unplanned downtime for 89% of customers in 2024",
        "Average issue resolution 3x faster than competitors"
      ],
      objectionHandling: [
        {
          objection: "Support quality is hard to measure before purchase",
          response: "We offer a support experience trial and guarantee our response times with SLA credits",
          evidence: [
            "30-day support experience trial available",
            "SLA credits for missed response times",
            "Reference customers available for support discussions"
          ]
        }
      ]
    }
  }
];

// Add the expected positioningSummary export
export const positioningSummary = [
  {
    id: "cost-efficiency",
    category: "Performance", 
    title: "45% Lower Total Cost of Ownership",
    description: "Transparent pricing with no hidden fees delivers significant cost savings compared to multi-vendor approaches",
    advantage: "Predictable costs with volume discounts",
    evidence: "Customer savings average $400K annually",
    impact: "Critical"
  },
  {
    id: "deployment-speed",
    category: "Implementation",
    title: "90% Faster Deployment Timeline", 
    description: "Pre-integrated platform capabilities eliminate complex multi-vendor integrations",
    advantage: "Unified platform architecture",
    evidence: "Average 30-day implementation vs. 6-month competitor timeline",
    impact: "High"
  },
  {
    id: "customer-satisfaction",
    category: "Performance",
    title: "Industry-Leading Customer Satisfaction",
    description: "95% customer satisfaction score with dedicated success management",
    advantage: "White-glove customer experience",
    evidence: "NPS of 78 vs. Okta's 23",
    impact: "High"
  }
];

export const valuePropCategories: ValuePropCategory[] = [
  "Security",
  "Scalability", 
  "Integration",
  "User Experience",
  "Compliance",
  "Cost Efficiency"
];