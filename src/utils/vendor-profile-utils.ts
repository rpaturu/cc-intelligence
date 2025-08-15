import { VendorProfile } from '../types/research-types';

export const createVendorProfile = (userCompany: string, userRole: string): VendorProfile => {
  // Role-specific data for demonstration
  const getPersonaByRole = (role: string) => {
    const normalizedRole = role.toLowerCase().replace(/[-_]/g, '');
    
    if (normalizedRole.includes('account') || normalizedRole.includes('ae')) {
      return {
        role: userRole,
        keyFocus: [
          "Territory expansion and account penetration",
          "Competitive displacement strategies", 
          "Executive relationship building",
          "Multi-product upsell opportunities"
        ],
        successMetrics: [
          "Quota attainment (120%+ target)",
          "Average deal size ($45K ARR)",
          "Sales cycle velocity (90-day average)",
          "Territory growth year-over-year"
        ],
        commonChallenges: [
          "Competing against Microsoft and CyberArk",
          "Justifying premium pricing in security market",
          "Navigating complex enterprise buying committees",
          "Proving ROI in zero-trust transformations"
        ]
      };
    }
    
    // Fallback for other roles (will enhance these later)
    return {
      role: userRole,
      keyFocus: ["Revenue acceleration", "Customer acquisition", "Market expansion", "Solution optimization"],
      successMetrics: ["Deal velocity", "Win rate", "Pipeline growth", "Customer satisfaction"],
      commonChallenges: ["Complex sales cycles", "Competitive differentiation", "Technical evaluation", "Stakeholder alignment"]
    };
  };

  // Company-specific competitive edge (using Okta as example)
  const getCompetitiveEdge = (company: string) => {
    const companyLower = company.toLowerCase();
    
    if (companyLower.includes('okta')) {
      return [
        { name: "Workforce Identity Cloud", category: "Core Platform", description: "Market-leading SSO and MFA for 15,000+ customers" },
        { name: "Customer Identity Cloud", category: "CIAM", description: "Auth0 acquisition strengthens developer-first CIAM" },
        { name: "Privileged Access Management", category: "PAM", description: "Zero-trust approach to privileged account security" },
        { name: "Identity Governance", category: "IGA", description: "Automated compliance and access certification" }
      ];
    }
    
    // Generic fallback
    return [
      { name: "Core Platform", category: "SaaS", description: "Primary business solution" },
      { name: "Enterprise Suite", category: "Enterprise", description: "Advanced features for large organizations" },
      { name: "Analytics Dashboard", category: "Analytics", description: "Real-time insights and reporting" },
      { name: "API Gateway", category: "Integration", description: "Seamless third-party integrations" }
    ];
  };

  return {
    company: userCompany,
    overview: `Leading identity and access management platform trusted by enterprises for zero-trust security.`,
    products: getCompetitiveEdge(userCompany),
    persona: getPersonaByRole(userRole)
  };
}; 