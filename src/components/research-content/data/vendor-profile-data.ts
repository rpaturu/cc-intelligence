import { VendorProfile } from "../../../types/research";

export const getVendorProfile = (companyName: string, userRole: string): VendorProfile => {
  const profiles: Record<string, VendorProfile> = {
    "Okta": {
      company: "Okta",
      overview: "Leading identity and access management platform, enabling secure access for any user to any application from any device.",
      products: [
        {
          name: "Okta Workforce Identity",
          category: "Employee IAM",
          description: "SSO, MFA, lifecycle management for employees"
        },
        {
          name: "Okta Customer Identity",
          category: "CIAM",
          description: "Customer registration, authentication, and user management"
        },
        {
          name: "Okta Privileged Access",
          category: "PAM",
          description: "Secure access to servers, applications, and infrastructure"
        },
        {
          name: "Okta Governance",
          category: "IGA",
          description: "Access reviews, certifications, and compliance reporting"
        },
        {
          name: "Okta Device Trust",
          category: "Device Security",
          description: "Device-based conditional access and security"
        }
      ],
      competitors: [
        {
          name: "Microsoft Entra ID",
          category: "Enterprise IAM",
          strength: "Office 365 integration, bundled pricing"
        },
        {
          name: "Ping Identity",
          category: "Enterprise IAM", 
          strength: "Hybrid environments, complex integrations"
        },
        {
          name: "Auth0",
          category: "Developer CIAM",
          strength: "Developer-friendly, quick implementation"
        },
        {
          name: "CyberArk",
          category: "Privileged Access",
          strength: "Mature PAM capabilities, enterprise security"
        },
        {
          name: "SailPoint",
          category: "Identity Governance",
          strength: "IGA market leader, compliance focus"
        }
      ],
      persona: {
        role: "Account Manager",
        keyFocus: [
          "Revenue growth and quota attainment",
          "Building strategic customer relationships", 
          "Identifying expansion opportunities",
          "Competitive displacement strategies"
        ],
        successMetrics: [
          "Annual Recurring Revenue (ARR)",
          "Deal size and velocity",
          "Customer satisfaction scores",
          "Product adoption rates"
        ],
        commonChallenges: [
          "Competing against Microsoft bundling",
          "Demonstrating ROI vs. existing solutions",
          "Navigating complex enterprise buying cycles",
          "Addressing security and compliance concerns"
        ]
      }
    }
  };

  return profiles[companyName] || {
    company: companyName,
    overview: "Technology company focused on modern solutions",
    products: [],
    competitors: [],
    persona: {
      role: userRole,
      keyFocus: ["Customer success", "Revenue growth"],
      successMetrics: ["Performance targets"],
      commonChallenges: ["Market competition"]
    }
  };
};
