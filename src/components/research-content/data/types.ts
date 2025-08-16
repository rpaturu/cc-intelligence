// Core shared types
export type ImpactLevel = "High" | "Medium" | "Low";
export type UrgencyLevel = "immediate" | "high" | "medium" | "low";
export type ConfidenceLevel = "Confirmed" | "High" | "Medium" | "Low";
export type TrendDirection = "increasing" | "accelerating" | "expanding" | "scaling" | "stable" | "decreasing" | "Up" | "Accelerating";
export type SeverityLevel = "Critical" | "High" | "Medium" | "Low";
export type UsageLevel = "High" | "Medium" | "Low";
export type ComplexityLevel = "High" | "Medium" | "Low" | "N/A";
export type RiskLevel = "Critical" | "High" | "Medium" | "Low";
export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";

// Decision Makers interfaces
export interface IDecisionMaker {
  id: string;
  name: string;
  role: string;
  company: string;
  department: string;
  level: OrganizationalLevel;
  influence: InfluenceLevel;
  budget: string;
  avatar: string;
  background: string;
  tenure: string;
  linkedin?: string;
  email: string;
  phone?: string;
  location: string;
  recentActivity: string[];
  keyInterests: string[];
  buyingSignals: string[];
  connectionOpportunities: string[];
}

export type OrganizationalLevel = "C-Level" | "VP" | "Director" | "Manager";
export type InfluenceLevel = "High" | "Medium" | "Low";
export type Department = "Engineering" | "Security" | "IT" | "Operations" | "Compliance";

// Tech Stack interfaces
export interface ITechStackItem {
  category: TechCategory;
  name: string;
  type: string;
  status: TechStatus;
  usage: UsageLevel;
  satisfaction: number;
  contract: string;
  spending: string;
  integrations: number;
  description: string;
  concerns: string[];
  opportunities: string[];
}

export type TechCategory = "identity" | "security" | "cloud" | "development" | "data" | "business";
export type TechStatus = "active" | "legacy" | "underutilized";

// Business Challenges interfaces
export interface IBusinessChallenge {
  id: string;
  title: string;
  category: BusinessChallengeCategory;
  severity: SeverityLevel;
  impact: ImpactLevel;
  timeline: string;
  description: string;
  details: string[];
  businessImpact: IBusinessImpact;
  painPoints: string[];
  solutions: ISolution[];
}

export interface IBusinessImpact {
  cost?: string;
  productivity?: string;
  security?: string;
  compliance?: string;
  satisfaction?: string;
  helpdesk?: string;
  remote?: string;
  growth?: string;
  customer?: string;
  reputation?: string;
  business?: string;
  legal?: string;
  complexity?: string;
  visibility?: string;
  strategy?: string;
  insurance?: string;
}

export interface ISolution {
  title: string;
  description: string;
  roi: string;
  timeframe: string;
}

export type BusinessChallengeCategory = 
  | "Technical" 
  | "Operational" 
  | "Security" 
  | "Risk & Compliance" 
  | "User Experience" 
  | "Strategic";

// Competitive Positioning interfaces
export interface ICompetitivePositioning {
  id: string;
  vendor: string;
  category: CompetitorCategory;
  marketPosition: MarketPosition;
  strength: number;
  currentRelationship: string;
  threatLevel: ThreatLevel;
  lastUpdate: string;
  strengths: string[];
  weaknesses: string[];
  positioning: IPositioning;
  marketShare: number;
  customerSentiment: number;
  recentActivity: string[];
  vulnerabilities: string[];
  opportunities: string[];
}

export interface IPositioning {
  price: string;
  innovation: string;
  support: string;
  integration: string;
}

export type CompetitorCategory = "Current Provider" | "Direct Competitor" | "Bundled Solution" | "Alternative Platform";
export type ThreatLevel = "High" | "Medium" | "Low";
export type MarketPosition = "Market Leader" | "Fast Follower" | "Specialized" | "Challenger";

// Buying Signals interfaces
export interface IIntentScore {
  overall: number;
  category: string;
  confidence: number;
  timeframe: string;
  likelihood: string;
  trend: TrendDirection;
  lastUpdated: string;
  keyFactors: string[];
}

export interface IBuyingSignal {
  id: number | string;
  type: SignalType;
  category?: string;
  signal?: string;
  title?: string;
  description?: string;
  strength?: number;
  impact?: ImpactLevel;
  detected?: string;
  source: string;
  confidence: ConfidenceLevel | number;
  date?: string;
  value?: string;
  timeline?: string;
  urgency?: UrgencyLevel;
  implications?: string[];
  details?: IBuyingSignalDetails;
  nextAction?: string;
  actionItems?: string[];
}

export interface IBuyingSignalDetails {
  requirements?: string[];
  evaluation?: string[];
  stakeholders?: string[];
  allocation?: string[];
  drivers?: string[];
  approvalProcess?: string[];
  activities?: string[];
  criteria?: string[];
  currentStatus?: string[];
  positions?: string[];
  departments?: string[];
  budget?: string;
}

export type SignalType = 
  | "procurement" 
  | "financial" 
  | "research" 
  | "organizational" 
  | "competitive" 
  | "technical" 
  | "budget" 
  | "evaluation" 
  | "stakeholder";

// Growth Signals interfaces
export interface IGrowthMetric {
  metric: string;
  value: string;
  growth: string;
  trend: TrendDirection;
  details: IGrowthMetricDetails;
}

export interface IGrowthMetricDetails {
  baseline: number | string;
  current: number | string;
  projected: number | string;
  timeframe: string;
  departments?: string[];
  segments?: string[];
  regions?: string[];
}

export interface IExpansionIndicator {
  id: string;
  type: ExpansionType;
  title: string;
  description: string;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  details: IExpansionDetails;
  implications: string[];
}

export interface IExpansionDetails {
  positions?: string[];
  departments?: string[];
  timeline?: string;
  budget?: string;
  amount?: string;
  lead_investor?: string;
  participants?: string[];
  valuation?: string;
  use_cases?: string[];
  regions?: string[];
  requirements?: string[];
  investment?: string;
  product?: string;
  target_customers?: string;
  launch_date?: string;
  growth_rate?: string;
  current_customers?: number;
  projected_customers?: number;
  customer_segments?: string[];
  current_compliance?: string[];
  required_compliance?: string[];
  audit_schedule?: string[];
}

export type ExpansionType = 
  | "hiring" 
  | "financial" 
  | "geographic" 
  | "product" 
  | "commercial" 
  | "regulatory";

// Budget Indicators interfaces
export interface IBudgetIndicator {
  id: string;
  category: BudgetCategory;
  title: string;
  amount: string;
  status: BudgetStatus;
  confidence: ConfidenceLevel;
  timeline: string;
  description: string;
  source: string;
  lastUpdated: string;
  details: IBudgetDetails;
  implications: string[];
  relatedInitiatives: string[];
}

export interface IBudgetDetails {
  breakdown?: IBudgetBreakdown[];
  approvalProcess?: string[];
  stakeholders?: string[];
  requirements?: string[];
  constraints?: string[];
  timeline?: IBudgetTimeline[];
}

export interface IBudgetBreakdown {
  category: string;
  amount: string;
  percentage?: number;
}

export interface IBudgetTimeline {
  phase: string;
  date: string;
  milestone: string;
}

export type BudgetCategory = 
  | "Security" 
  | "IT Infrastructure" 
  | "Compliance" 
  | "Development" 
  | "Operations";

export type BudgetStatus = 
  | "Approved" 
  | "Pending Approval" 
  | "Under Review" 
  | "Allocated" 
  | "Spent";

// Compliance Requirements interfaces
export type ComplianceFramework = 
  | "SOC 2 Type II" 
  | "ISO 27001" 
  | "GDPR" 
  | "CCPA" 
  | "HIPAA" 
  | "PCI DSS"
  | "PCI DSS Level 1"
  | "FedRAMP";

export type ComplianceStatus = 
  | "Compliant" 
  | "In Progress" 
  | "Gap Identified"
  | "Gaps Identified"
  | "Not Started" 
  | "At Risk"
  | "Ongoing Compliance"
  | "Planning Phase";

export type RequirementType = "Identity Governance" | "Information Security" | "Payment Security" | "Data Privacy" | "Access Control" | "Audit & Logging";
export type ResourceType = "Internal Team" | "External Consultant" | "Technology Solution" | "Training Program";

export interface IComplianceRequirement {
  id: string;
  framework: ComplianceFramework;
  type: RequirementType;
  status: ComplianceStatus;
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  title: string;
  description: string;
  deadline: string;
  requirements: string[];
  currentGaps: string[];
  businessImpact: IComplianceBusinessImpact;
  solutions: IComplianceSolution[];
}

export interface IComplianceBusinessImpact {
  riskExposure: string;
  financialImpact: string;
  operationalImpact: string;
  reputationalRisk: string;
}

export interface IComplianceSolution {
  requirement: string;
  solution: string;
  timeline: string;
  roi: string;
}

export interface IRemediationStep {
  step: string;
  timeline: string;
  effort: string;
  dependencies?: string[];
}

export interface IComplianceImpact {
  risk: string;
  business: string;
  financial: string;
  operational?: string;
}

export interface IComplianceResource {
  type: ResourceType;
  name: string;
  role?: string;
  effort?: string;
  cost?: string;
}

// Digital Footprint interfaces
export interface IDigitalFootprint {
  id: string;
  channel: DigitalChannel;
  title: string;
  contentType: ContentType;
  engagement: EngagementLevel;
  trend: TrendDirection;
  confidence: ConfidenceLevel;
  lastUpdated: string;
  description: string;
  metrics: IDigitalMetrics;
  contentAnalysis: string[];
  audienceSignals: string[];
  buyingSignals: string[];
  competitiveIntelligence: string[];
}

export interface IDigitalMetrics {
  [key: string]: string;
}

export interface IContentMetrics {
  posts: number;
  frequency: string;
  topics: string[];
  engagement_rate?: number;
}

export type DigitalChannel = "Corporate Website" | "LinkedIn" | "Engineering Blog" | "Industry Events" | "Social Media" | "Webinars" | "Podcasts";
export type ContentType = "Corporate Content" | "Professional Content" | "Technical Content" | "Speaking Engagements" | "Social Content" | "Video Content";
export type DigitalCategory = "Social Media" | "Professional Networks" | "Company Blogs" | "Industry Publications" | "Conferences" | "Podcasts";
export type PresenceLevel = "High" | "Medium" | "Low" | "Minimal";
export type EngagementLevel = "High" | "Medium" | "Low" | "Inactive" | "Growing" | "Very High";

// Integration Needs interfaces
export type IntegrationCategory = 
  | "Authentication" 
  | "User Provisioning" 
  | "Data Synchronization" 
  | "Reporting" 
  | "Workflow Automation"
  | "SaaS Integration"
  | "Cloud Infrastructure"
  | "API Integration"
  | "DevOps Integration"
  | "Database Integration"
  | "Legacy Systems";

export type IntegrationType = "Single Sign-On" | "Infrastructure Access" | "API Gateway" | "CI/CD Pipeline" | "Database Access" | "Legacy Integration";

export interface IIntegrationNeed {
  id: string;
  category: IntegrationCategory;
  type: IntegrationType;
  title: string;
  description: string;
  priority: PriorityLevel;
  complexity: ComplexityLevel;
  confidence: ConfidenceLevel;
  timeline: string;
  applications: string[];
  requirements: string[];
  technicalSpecs: ITechnicalSpecs;
  businessImpact: IIntegrationBusinessImpact;
  currentPainPoints: string[];
  implementation: IImplementationPhase;
}

export interface ITechnicalSpecs {
  [key: string]: string[];
}

export interface IIntegrationBusinessImpact {
  [key: string]: string;
}

export interface IImplementationPhase {
  [key: string]: string;
}

export interface IIntegrationEffort {
  development: string;
  testing: string;
  deployment: string;
  total: string;
}

// Recent Activities interfaces
export interface IRecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  source: string;
  impact: ImpactLevel;
  description: string;
  details: string[];
  implications: string[];
  followUp?: string[];
}

export type ActivityType = 
  | "Hiring" 
  | "Funding" 
  | "Product Launch" 
  | "Partnership" 
  | "Compliance" 
  | "Security Incident" 
  | "Market Expansion" 
  | "Executive Change";

// Competitive Usage interfaces
export interface ICompetitiveUsage {
  id: string;
  competitor: string;
  solution: string;
  usageType: UsageType;
  deployment: DeploymentType;
  satisfaction: number;
  contract: IContractDetails;
  strengths: string[];
  weaknesses: string[];
  migrationRisk: RiskLevel;
  opportunities: string[];
}

export interface IContractDetails {
  duration: string;
  value: string;
  renewalDate: string;
  terms: string[];
}

export type UsageType = "Primary" | "Secondary" | "Trial" | "Legacy";
export type DeploymentType = "Cloud" | "On-Premise" | "Hybrid";

// Competitive Positioning Value Props interfaces
export interface IValueProposition {
  id: string;
  category: ValuePropCategory;
  title: string;
  description: string;
  differentiator: string;
  competitiveAdvantage: string;
  evidencePoints: string[];
  customerBenefits: string[];
  targetPersonas: string[];
  messagingFramework: IMessagingFramework;
}

export interface IMessagingFramework {
  primaryMessage: string;
  supportingPoints: string[];
  proofPoints: string[];
  objectionHandling: IObjHandling[];
}

export interface IObjHandling {
  objection: string;
  response: string;
  evidence: string[];
}

export type ValuePropCategory = 
  | "Security" 
  | "Scalability" 
  | "Integration" 
  | "User Experience" 
  | "Compliance" 
  | "Cost Efficiency";

// Additional interfaces for CompetitivePositioningContent
export interface ICompetitor {
  id: number;
  name: string;
  position: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  products: string[];
  pricing: string;
  customerBase: string;
  recentMoves: string[];
  threatLevel: ThreatLevel;
  competitiveScore: number;
}

export interface IMarketAnalysis {
  totalMarketSize: string;
  growthRate: string;
  keyTrends: string[];
  marketDrivers: string[];
  barriers: string[];
}

// Additional interfaces for RecentActivitiesContent
export interface ISignalCategory {
  category: string;
  signalCount: number;
  strengthScore: number;
  trend: TrendDirection;
  recentSignals: string[];
}

// Competitive Positioning - Updated interfaces
export interface ICompetitivePosition {
  id: string;
  competitor: string;
  category: CompetitorCategory;
  strategy: PositioningStrategy;
  confidence: ConfidenceLevel;
  priority: number;
  title: string;
  description: string;
  currentStatus: string;
  ourAdvantages: string[];
  theirWeaknesses: string[];
  talkingPoints: string[];
  objectionHandling: Record<string, string>;
  competitiveBattleCard: IBattleCard;
}

export interface IBattleCard {
  winningMessage: string;
  keyProofPoints: string[];
  riskMitigation: string[];
}

export type PositioningStrategy = "Displacement" | "Differentiation" | "Defensive" | "Flanking";

// Recent Activities - Updated interfaces
export interface IActivityRecord {
  id: string;
  category: ActivityCategory;
  title: string;
  date: string;
  impact: ActivityImpact;
  confidence: ConfidenceLevel;
  description: string;
  details: string[];
  businessImplications: string[];
  salesImplications: string[];
  sources: string[];
  relatedStakeholders: string[];
  followUpActions: string[];
}

export type ActivityCategory = "Financial" | "Executive" | "Operational" | "Strategic" | "Compliance" | "Technical";
export type ActivityImpact = "High" | "Medium" | "Low";

// Growth Signals - Updated interfaces
export interface IGrowthSignal {
  id: string;
  category: GrowthCategory;
  title: string;
  stage: GrowthStage;
  confidence: ConfidenceLevel;
  timeframe: TimeFrame;
  strength: number;
  description: string;
  indicators: string[];
  businessImplications: string[];
  infrastructureNeeds: string[];
  urgencyFactors: string[];
  roi_metrics: Record<string, string>;
}

export type GrowthCategory = "Team Expansion" | "Geographic Expansion" | "Product Development" | "Customer Growth" | "Revenue Growth" | "Technology Scaling";
export type GrowthStage = "Early Growth" | "High Growth" | "Market Expansion" | "Innovation" | "Market Growth";
export type TimeFrame = string;

// Competitive Usage - Updated interfaces
export interface IVendorRelationship {
  id: string;
  vendor: string;
  category: VendorCategory;
  type: string;
  status: RelationshipStatus;
  contract: IVendorContract;
  satisfaction: IVendorSatisfaction;
  usage: IVendorUsage;
  stakeholders: string[];
  opportunities: string[];
  replacementPriority: PriorityLevel;
  migrationComplexity: ComplexityLevel;
}

export interface IVendorContract {
  value: string;
  renewal: string;
  status: ContractStatus;
  terms: string;
}

export interface IVendorSatisfaction {
  level: SatisfactionLevel;
  score: number;
  concerns: string[];
}

export interface IVendorUsage {
  adoption: UsageLevel;
  integrations: number;
  users: string;
  criticality: CriticalityLevel;
}

export type VendorCategory = "Identity & Security" | "Cloud Infrastructure" | "Business Applications" | "Development Tools" | "Security" | "Data & Analytics";
export type RelationshipStatus = "Strategic" | "Strong Partnership" | "Expanding" | "Stable" | "At Risk" | "Legacy";
export type ContractStatus = "Renewal Risk" | "Maintenance Only" | "Expanding" | "Growing" | "Stable" | "Renewal Planning";
export type SatisfactionLevel = "High" | "Medium" | "Low";
export type CriticalityLevel = "Mission Critical" | "Business Critical" | "Security Critical" | "Legacy Dependency";