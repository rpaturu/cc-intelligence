import type { 
  IComplianceRequirement, 
  ComplianceFramework,
  RequirementType,
  ComplianceStatus,
  RiskLevel
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const complianceRequirements: IComplianceRequirement[] = [
  {
    id: "soc2-type2-gaps",
    framework: "SOC 2 Type II",
    type: "Identity Governance",
    status: "Gaps Identified",
    riskLevel: "High",
    confidence: "Confirmed",
    title: "SOC 2 Identity Management Gaps",
    description: "Recent SOC 2 Type II audit identified 8 critical identity management gaps requiring immediate remediation",
    deadline: "Q2 2025 - Next audit cycle",
    requirements: [
      "Automated user access reviews and certifications",
      "Privileged access monitoring and session recording",
      "Multi-factor authentication across all systems",
      "Segregation of duties for financial system access",
      "Comprehensive audit logging and retention",
      "User lifecycle management automation",
      "Role-based access control implementation",
      "Identity governance reporting and analytics"
    ],
    currentGaps: [
      "Manual access reviews taking 2+ weeks per cycle",
      "Inconsistent MFA implementation across applications",
      "No automated user provisioning or deprovisioning",
      "Limited audit trail visibility for access changes",
      "Manual role assignments without approval workflows",
      "No centralized identity governance platform",
      "Inadequate privileged access management",
      "Missing compliance reporting capabilities"
    ],
    businessImpact: {
      riskExposure: "Potential SOC 2 compliance failure",
      financialImpact: "$500K+ in lost enterprise deals if non-compliant",
      operationalImpact: "60+ hours monthly for manual compliance activities",
      reputationalRisk: "Customer trust erosion from compliance failures"
    },
    solutions: [
      {
        requirement: "Automated Access Reviews", 
        solution: "Identity governance platform with automated certification campaigns",
        timeline: "30-60 days implementation",
        roi: "90% reduction in manual review time"
      },
      {
        requirement: "Comprehensive Audit Logging",
        solution: "Centralized identity audit trail with tamper-proof logging",
        timeline: "14-30 days implementation", 
        roi: "100% audit readiness with automated reporting"
      },
      {
        requirement: "Role-Based Access Control",
        solution: "Dynamic RBAC with automated role assignment based on job function",
        timeline: "45-90 days implementation",
        roi: "75% reduction in over-privileged accounts"
      }
    ]
  },
  {
    id: "iso-27001-certification",
    framework: "ISO 27001",
    type: "Information Security",
    status: "In Progress",
    riskLevel: "Medium",
    confidence: "High",
    title: "ISO 27001 Certification Process",
    description: "Active ISO 27001 certification process requiring comprehensive identity security controls",
    deadline: "Q4 2025 - Certification target",
    requirements: [
      "Information security management system (ISMS)",
      "Access control policy and procedures",
      "User access management controls",
      "Network access control implementation",
      "Operating system access control",
      "Application and information access control", 
      "Mobile device and teleworking security",
      "Cryptographic controls for data protection"
    ],
    currentGaps: [
      "ISMS documentation incomplete for identity management",
      "Access control policies not fully documented or enforced",
      "Network access controls need identity integration",
      "Application access controls inconsistently applied",
      "Mobile device access management lacks centralized control",
      "Cryptographic controls not standardized across systems"
    ],
    businessImpact: {
      riskExposure: "Delayed certification affecting enterprise sales",
      financialImpact: "$200K certification investment at risk",
      operationalImpact: "6-month delay in international expansion",
      reputationalRisk: "Competitive disadvantage without certification"
    },
    solutions: [
      {
        requirement: "Access Control Policy Framework",
        solution: "Comprehensive identity governance with policy enforcement",
        timeline: "60-90 days implementation",
        roi: "Automated policy compliance monitoring"
      },
      {
        requirement: "Centralized Access Management", 
        solution: "Unified identity platform with single sign-on",
        timeline: "90-120 days implementation",
        roi: "Simplified compliance with centralized controls"
      }
    ]
  },
  {
    id: "pci-dss-level1",
    framework: "PCI DSS Level 1",
    type: "Payment Security",
    status: "Ongoing Compliance",
    riskLevel: "Critical",
    confidence: "Confirmed",
    title: "PCI DSS Level 1 Compliance Maintenance",
    description: "Ongoing PCI DSS Level 1 compliance for payment processing with quarterly assessments",
    deadline: "Quarterly - Ongoing requirement",
    requirements: [
      "Unique user ID assignment for system access",
      "Multi-factor authentication for remote access",
      "Role-based access control for cardholder data",
      "Regular access review and recertification", 
      "Strong access control measures for cardholder data environment",
      "Regular monitoring and testing of networks and systems",
      "User access management and authentication testing",
      "File integrity monitoring for critical systems"
    ],
    currentGaps: [
      "Manual quarterly access reviews for cardholder data environment",
      "Inconsistent MFA implementation across payment systems",
      "Limited automated monitoring of privileged access",
      "Manual user provisioning for payment application access",
      "Inadequate session management for cardholder data access"
    ],
    businessImpact: {
      riskExposure: "Loss of payment processing capabilities", 
      financialImpact: "$10M+ in lost revenue if non-compliant",
      operationalImpact: "Business operations halt without payment processing",
      reputationalRisk: "Catastrophic damage from payment security breach"
    },
    solutions: [
      {
        requirement: "Automated Access Reviews",
        solution: "Quarterly automated access certification for PCI scope",
        timeline: "30-45 days implementation",
        roi: "100% compliance with automated evidence collection"
      },
      {
        requirement: "Enhanced Session Management",
        solution: "Privileged session recording and monitoring",
        timeline: "45-60 days implementation", 
        roi: "Real-time threat detection and compliance evidence"
      }
    ]
  },
  {
    id: "gdpr-european-expansion",
    framework: "GDPR",
    type: "Data Privacy",
    status: "Planning Phase",
    riskLevel: "High",
    confidence: "High",
    title: "GDPR Compliance for European Expansion",
    description: "GDPR compliance required for Q3 2025 European market expansion",
    deadline: "Q3 2025 - European launch",
    requirements: [
      "Lawful basis for data processing documentation",
      "Data subject consent management",
      "Right to be forgotten implementation",
      "Data portability capabilities",
      "Privacy by design and default",
      "Data protection impact assessments",
      "EU representative appointment",
      "Cross-border data transfer safeguards"
    ],
    currentGaps: [
      "No data subject consent management system",
      "Identity data retention policies not GDPR-compliant",
      "No automated right to be forgotten capabilities",
      "Cross-border identity data transfers lack adequate safeguards",
      "Privacy impact assessments not integrated with identity systems"
    ],
    businessImpact: {
      riskExposure: "€20M or 4% of turnover in potential fines",
      financialImpact: "Blocked European expansion ($15M ARR opportunity)",
      operationalImpact: "6-month delay in international operations",
      reputationalRisk: "Privacy violations affecting global customer trust"
    },
    solutions: [
      {
        requirement: "Data Subject Rights Management",
        solution: "Automated consent management and data portability",
        timeline: "90-120 days implementation",
        roi: "Compliant European operations with automated rights fulfillment"
      },
      {
        requirement: "Privacy by Design Identity",
        solution: "GDPR-compliant identity platform with built-in privacy controls",
        timeline: "120-180 days implementation",
        roi: "Future-proof privacy compliance with automated controls"
      }
    ]
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getComplianceRequirementsConcise = (): Array<{
  framework: ComplianceFramework;
  status: ComplianceStatus;
  riskLevel: RiskLevel;
  keyGap: string;
}> => {
  return complianceRequirements.slice(0, 3).map(requirement => ({
    framework: requirement.framework,
    status: requirement.status,
    riskLevel: requirement.riskLevel,
    keyGap: requirement.currentGaps[0] || "Identity governance improvements needed"
  }));
};

// Generate comprehensive view with all details
export const getComplianceRequirementsComprehensive = (): IComplianceRequirement[] => {
  return complianceRequirements;
};

// Generate summary statistics from comprehensive data
export const getComplianceRequirementStats = () => {
  const criticalRequirements = complianceRequirements.filter(r => r.riskLevel === "Critical").length;
  const highRiskRequirements = complianceRequirements.filter(r => r.riskLevel === "High").length;
  const totalGaps = complianceRequirements.reduce((sum, r) => sum + r.currentGaps.length, 0);
  const activeCompliance = complianceRequirements.filter(r => 
    r.status === "In Progress" || r.status === "Ongoing Compliance"
  ).length;
  
  return {
    totalFrameworks: complianceRequirements.length,
    criticalRequirements,
    highRiskRequirements,
    totalGaps,
    activeCompliance,
    primaryFramework: complianceRequirements[0]?.framework || "SOC 2 Type II"
  };
};

// Generate requirements by framework
export const getRequirementsByFramework = (framework: ComplianceFramework) => {
  return complianceRequirements.filter(requirement => requirement.framework === framework);
};

// Generate gap analysis
export const getComplianceGapAnalysis = () => {
  return complianceRequirements.map(requirement => ({
    framework: requirement.framework,
    status: requirement.status,
    riskLevel: requirement.riskLevel,
    totalGaps: requirement.currentGaps.length,
    criticalGaps: requirement.currentGaps.slice(0, 3),
    businessImpact: requirement.businessImpact,
    deadline: requirement.deadline
  }));
};

// Generate solution roadmap
export const getComplianceSolutionRoadmap = () => {
  const allSolutions = complianceRequirements.flatMap(req => 
    req.solutions.map(sol => ({
      framework: req.framework,
      requirement: sol.requirement,
      solution: sol.solution,
      timeline: sol.timeline,
      roi: sol.roi,
      riskLevel: req.riskLevel
    }))
  );
  
  return allSolutions.sort((a, b) => {
    const riskOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
    return riskOrder[a.riskLevel as RiskLevel] - riskOrder[b.riskLevel as RiskLevel];
  });
};

export const complianceFrameworks: ComplianceFramework[] = [
  "SOC 2 Type II",
  "ISO 27001", 
  "PCI DSS Level 1",
  "GDPR",
  "HIPAA",
  "FedRAMP"
];

export const requirementTypes: RequirementType[] = [
  "Identity Governance",
  "Information Security",
  "Payment Security", 
  "Data Privacy",
  "Access Control",
  "Audit & Logging"
];