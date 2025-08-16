import type { 
  IIntegrationNeed, 
  IntegrationCategory,
  IntegrationType,
  PriorityLevel,
} from './types';

// SINGLE COMPREHENSIVE DATASET - Source of truth for backend integration
export const integrationNeeds: IIntegrationNeed[] = [
  {
    id: "saas-applications-sso",
    category: "SaaS Integration",
    type: "Single Sign-On",
    title: "25+ SaaS Applications SSO Integration",
    description: "Critical need for unified SSO across all business applications to eliminate password fatigue and security gaps",
    priority: "Critical",
    complexity: "Medium",
    confidence: "Confirmed",
    timeline: "30-60 days implementation required",
    applications: [
      "Salesforce CRM - 75 users, business critical",
      "GitHub Enterprise - 50+ developers, daily usage",
      "AWS Management Console - 25 engineers, high security needs",
      "Slack Enterprise - All employees, communication hub", 
      "Jira Software - Development and project management",
      "Confluence - Documentation and knowledge management",
      "DataDog - Monitoring and observability",
      "Figma - Design collaboration platform",
      "Notion - Internal documentation and wikis",
      "1Password - Password management (ironically)"
    ],
    requirements: [
      "SAML 2.0 support for enterprise applications",
      "OpenID Connect for modern web applications", 
      "Automated user provisioning via SCIM 2.0",
      "Just-in-time (JIT) user provisioning",
      "Multi-factor authentication enforcement",
      "Conditional access policies based on user context"
    ],
    technicalSpecs: {
      protocols: ["SAML 2.0", "OpenID Connect", "OAuth 2.0"],
      provisioning: ["SCIM 2.0", "API-based", "JIT"],
      authentication: ["MFA", "Adaptive Auth", "Risk-based"],
      standards: ["Enterprise-grade", "High availability", "Audit compliant"]
    },
    businessImpact: {
      userProductivity: "40% reduction in login time and password resets",
      itOverhead: "15 hours/week saved on password reset tickets",
      securityPosture: "95% reduction in password-related security incidents",
      complianceReadiness: "Automated audit trails for all application access"
    },
    currentPainPoints: [
      "Users maintain 8+ different passwords across applications",
      "40% increase in help desk tickets for password resets",
      "Security gaps from inconsistent MFA implementation",
      "No centralized visibility into application access",
      "Manual user provisioning taking 3-5 days per new hire"
    ],
    implementation: {
      phase1: "Critical business apps (Salesforce, GitHub, AWS) - 30 days",
      phase2: "Development and productivity tools - 45 days", 
      phase3: "Remaining SaaS applications - 60 days",
      testing: "User acceptance testing and security validation - 15 days"
    }
  },
  {
    id: "aws-iam-integration",
    category: "Cloud Infrastructure",
    type: "Infrastructure Access",
    title: "AWS IAM Integration for Cloud Resources",
    description: "Deep integration with AWS IAM for seamless cloud resource access management",
    priority: "High",
    complexity: "High", 
    confidence: "High",
    timeline: "45-90 days implementation",
    applications: [
      "AWS Management Console - Central cloud management",
      "AWS CLI and SDK access - Developer productivity",
      "EC2 instance access - Server management",
      "RDS database access - Data management",
      "S3 bucket permissions - Storage management",
      "Lambda function execution roles - Serverless computing"
    ],
    requirements: [
      "AWS IAM role assumption via SAML federation",
      "Cross-account access management",
      "Temporary credential issuance",
      "Fine-grained permission mapping",
      "Automated role lifecycle management",
      "CloudTrail integration for audit logging"
    ],
    technicalSpecs: {
      protocols: ["SAML 2.0 Federation", "AWS STS", "IAM Roles"],
      integration: ["Cross-account", "Multi-region", "Service-linked"],
      automation: ["Role provisioning", "Permission mapping", "Lifecycle management"],
      monitoring: ["CloudTrail logs", "Access analytics", "Security events"]
    },
    businessImpact: {
      developerVelocity: "50% faster cloud resource access for engineers",
      securityCompliance: "Centralized access control for all AWS resources",
      operationalEfficiency: "Automated role management reducing manual overhead",
      auditReadiness: "Complete access audit trail integration with CloudTrail"
    },
    currentPainPoints: [
      "Manual IAM role creation and assignment",
      "Inconsistent permission policies across accounts",
      "No centralized view of AWS resource access",
      "Difficult access reviews for cloud resources",
      "Security risks from long-lived access keys"
    ],
    implementation: {
      phase1: "Core AWS services integration (EC2, RDS, S3) - 45 days",
      phase2: "Developer tools integration (CLI, SDK access) - 60 days",
      phase3: "Advanced services and cross-account access - 90 days",
      validation: "Security testing and compliance validation - 30 days"
    }
  },
  {
    id: "api-access-management",
    category: "API Integration",
    type: "API Gateway",
    title: "API Access Management for Platform Extensibility",
    description: "Comprehensive API access management for internal APIs, partner integrations, and platform extensibility",
    priority: "High",
    complexity: "Medium",
    confidence: "High",
    timeline: "60-90 days implementation",
    applications: [
      "Internal microservices APIs - 50+ endpoints",
      "Partner integration APIs - Financial data providers",
      "Customer-facing APIs - Platform extensibility",
      "Webhook endpoints - Event-driven integrations",
      "GraphQL endpoints - Modern API architecture",
      "Legacy SOAP services - Financial system integrations"
    ],
    requirements: [
      "OAuth 2.0 and API key management",
      "Rate limiting and quota enforcement",
      "API versioning and lifecycle management",
      "Developer onboarding and API key provisioning",
      "Real-time API analytics and monitoring",
      "Automated threat detection and response"
    ],
    technicalSpecs: {
      protocols: ["OAuth 2.0", "JWT", "API Keys", "mTLS"],
      gateway: ["Rate limiting", "Request/response transformation", "Caching"],
      security: ["Threat protection", "DDoS mitigation", "Input validation"],
      analytics: ["Usage metrics", "Performance monitoring", "Error tracking"]
    },
    businessImpact: {
      partnerEnablement: "3x faster partner integration onboarding",
      developerExperience: "Self-service API access reducing support overhead",
      platformScaling: "Support for 10x API traffic growth",
      revenueEnablement: "API monetization capabilities for platform strategy"
    },
    currentPainPoints: [
      "Manual API key generation and management",
      "No centralized API access control or monitoring",
      "Partner integration delays due to access management complexity",
      "Limited visibility into API usage and potential abuse",
      "Inconsistent security policies across different APIs"
    ],
    implementation: {
      phase1: "Internal API access management - 30 days",
      phase2: "Partner and external API integration - 60 days",
      phase3: "Advanced analytics and threat protection - 90 days",
      optimization: "Performance tuning and scaling - Additional 30 days"
    }
  },
  {
    id: "devops-cicd-integration",
    category: "DevOps Integration",
    type: "CI/CD Pipeline",
    title: "CI/CD Pipeline Integration with Identity-Based Access",
    description: "Integration with development and deployment pipelines for automated, secure access management",
    priority: "Medium",
    complexity: "Medium",
    confidence: "Medium",
    timeline: "30-60 days implementation",
    applications: [
      "GitHub Actions - Primary CI/CD platform", 
      "Docker Hub - Container registry access",
      "AWS ECR - Private container registry",
      "Terraform Cloud - Infrastructure as code",
      "Kubernetes clusters - Container orchestration",
      "ArgoCD - GitOps deployment automation"
    ],
    requirements: [
      "Service account management for automated workflows",
      "Short-lived credentials for pipeline operations",
      "Role-based access for different deployment environments",
      "Audit logging for all automated access",
      "Integration with infrastructure as code tools",
      "Secret management integration"
    ],
    technicalSpecs: {
      automation: ["Service accounts", "Short-lived tokens", "Workload identity"],
      integration: ["GitHub Actions", "Terraform", "Kubernetes RBAC"],
      security: ["Secret rotation", "Least privilege", "Audit trails"],
      monitoring: ["Pipeline access logs", "Security events", "Performance metrics"]
    },
    businessImpact: {
      deploymentSecurity: "Zero long-lived credentials in deployment pipelines",
      developerVelocity: "Automated access management removing deployment bottlenecks",
      complianceReadiness: "Complete audit trail for all automated system access",
      incidentReduction: "50% reduction in deployment-related security incidents"
    },
    currentPainPoints: [
      "Long-lived service account credentials in CI/CD systems",
      "Manual secret rotation and credential management",
      "Inconsistent access controls across deployment environments",
      "Limited visibility into automated system access",
      "Security delays in deployment pipeline approval processes"
    ],
    implementation: {
      phase1: "GitHub Actions integration with short-lived credentials - 30 days",
      phase2: "Kubernetes and container registry integration - 45 days",
      phase3: "Infrastructure as code tool integration - 60 days",
      monitoring: "Deployment access monitoring and alerting - Additional 15 days"
    }
  }
];

// TRANSFORMATION UTILITIES for generating concise vs comprehensive views

// Generate concise view for chat responses
export const getIntegrationNeedsConcise = (): Array<{
  title: string;
  category: IntegrationCategory;
  priority: PriorityLevel;
  keyRequirement: string;
}> => {
  return integrationNeeds.slice(0, 3).map(need => ({
    title: need.title,
    category: need.category,
    priority: need.priority,
    keyRequirement: need.requirements[0] || "Integration capability required"
  }));
};

// Generate comprehensive view with all details
export const getIntegrationNeedsComprehensive = (): IIntegrationNeed[] => {
  return integrationNeeds;
};

// Generate summary statistics from comprehensive data
export const getIntegrationNeedsStats = () => {
  const criticalNeeds = integrationNeeds.filter(n => n.priority === "Critical").length;
  const highComplexity = integrationNeeds.filter(n => n.complexity === "High").length;
  const totalApplications = integrationNeeds.reduce((sum, need) => sum + need.applications.length, 0);
  const confirmedNeeds = integrationNeeds.filter(n => n.confidence === "Confirmed" || n.confidence === "High").length;
  
  return {
    totalNeeds: integrationNeeds.length,
    criticalNeeds,
    highComplexity,
    totalApplications,
    confirmedNeeds,
    primaryCategory: integrationNeeds[0]?.category || "SaaS Integration"
  };
};

// Generate needs by category
export const getIntegrationNeedsByCategory = (category: IntegrationCategory) => {
  return integrationNeeds.filter(need => need.category === category);
};

// Generate implementation roadmap
export const getIntegrationRoadmap = () => {
  return integrationNeeds
    .sort((a, b) => {
      const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .map(need => ({
      title: need.title,
      priority: need.priority,
      complexity: need.complexity,
      timeline: need.timeline,
      businessImpact: Object.values(need.businessImpact)[0],
      implementation: need.implementation
    }));
};

// Generate ROI analysis
export const getIntegrationROIAnalysis = () => {
  return integrationNeeds.map(need => ({
    title: need.title,
    category: need.category,
    priority: need.priority,
    businessImpact: need.businessImpact,
    currentPainPoints: need.currentPainPoints.slice(0, 3),
    estimatedROI: Object.entries(need.businessImpact).map(([metric, value]) => 
      `${metric}: ${value}`
    )
  }));
};

export const integrationCategories: IntegrationCategory[] = [
  "SaaS Integration",
  "Cloud Infrastructure",
  "API Integration",
  "DevOps Integration",
  "Database Integration",
  "Legacy Systems"
];

export const integrationTypes: IntegrationType[] = [
  "Single Sign-On",
  "Infrastructure Access",
  "API Gateway",
  "CI/CD Pipeline",
  "Database Access",
  "Legacy Integration"
];