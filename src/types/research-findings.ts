// Research Findings Types
export interface ContactInfo {
  name: string;
  role: string;
  email: string;
  linkedin?: string;
  phone?: string;
}

export interface BaseResearchItem {
  title: string;
  description: string;
  details: string[] | Record<string, any>;
}

export interface DecisionMakerItem extends BaseResearchItem {
  contact: ContactInfo;
}

export interface TechStackItem extends BaseResearchItem {
  category: string;
  status: string;
  usage: string;
  satisfaction: number;
  contract: string;
  spending: string;
  integrations: number;
  concerns: string[];
  opportunities: string[];
}

export interface BusinessChallengeItem extends BaseResearchItem {
  category: string;
  severity: string;
  impact: string;
  timeline: string;
  businessImpact: Record<string, string>;
  painPoints: string[];
  solutions: Array<{
    title: string;
    description: string;
    roi: string;
    timeframe: string;
  }>;
}

export interface CompetitivePositioningItem extends BaseResearchItem {
  category: string;
  competitors: Array<{
    name: string;
    strength: string;
    weakness: string;
  }>;
  opportunities: string[];
  threats: string[];
}

export interface CompetitivePositioningValuePropItem extends BaseResearchItem {
  category: string;
  targetAudience: string;
  keyBenefits: string[];
  differentiation: string[];
}

export interface RecentActivityItem extends BaseResearchItem {
  type: string;
  date: string;
  impact: string;
  source: string;
}

export interface BudgetIndicatorItem extends BaseResearchItem {
  amount: string;
  status: string;
  confidence: string;
  timeline: string;
  details: {
    breakdown?: Array<{
      category: string;
      amount: string;
      percentage?: number;
    }>;
    approvalProcess?: string[];
    stakeholders?: string[];
    timeline?: Array<{
      phase: string;
      date: string;
      milestone: string;
    }>;
  };
}

export interface BuyingSignalItem extends BaseResearchItem {
  type: string;
  likelihood: string;
  timeframe: string;
  source: string;
  stakeholders: string[];
}

export interface CompetitiveUsageItem extends BaseResearchItem {
  vendor: string;
  category: string;
  usage: string;
  satisfaction: number;
  contract: string;
  renewal: string;
  opportunities: string[];
}

export interface DigitalFootprintItem extends BaseResearchItem {
  platform: string;
  activity: string;
  engagement: string;
  sentiment: string;
  opportunities: string[];
}

export interface GrowthSignalItem extends BaseResearchItem {
  type: string;
  timeframe: string;
  impact: string;
  confidence: string;
  opportunities: string[];
}

export interface ComplianceRequirementItem extends BaseResearchItem {
  framework: string;
  status: string;
  deadline: string;
  riskLevel: string;
  requirements: string[];
  gaps: string[];
}

export interface IntegrationNeedItem extends BaseResearchItem {
  system: string;
  priority: string;
  complexity: string;
  timeline: string;
  requirements: string[];
  challenges: string[];
}

// Research Findings Container Types
export interface ResearchFindings {
  id: string;
  title: string;
  researchArea: string;
  items: BaseResearchItem[];
}

export interface DecisionMakersFindings extends ResearchFindings {
  items: DecisionMakerItem[];
}

export interface TechStackFindings extends ResearchFindings {
  items: TechStackItem[];
}

export interface BusinessChallengesFindings extends ResearchFindings {
  items: BusinessChallengeItem[];
}

export interface CompetitivePositioningFindings extends ResearchFindings {
  items: CompetitivePositioningItem[];
}

export interface CompetitivePositioningValuePropsFindings extends ResearchFindings {
  items: CompetitivePositioningValuePropItem[];
}

export interface RecentActivitiesFindings extends ResearchFindings {
  items: RecentActivityItem[];
}

export interface BudgetIndicatorsFindings extends ResearchFindings {
  items: BudgetIndicatorItem[];
}

export interface BuyingSignalsFindings extends ResearchFindings {
  items: BuyingSignalItem[];
}

export interface CompetitiveUsageFindings extends ResearchFindings {
  items: CompetitiveUsageItem[];
}

export interface DigitalFootprintFindings extends ResearchFindings {
  items: DigitalFootprintItem[];
}

export interface GrowthSignalsFindings extends ResearchFindings {
  items: GrowthSignalItem[];
}

export interface ComplianceRequirementsFindings extends ResearchFindings {
  items: ComplianceRequirementItem[];
}

export interface IntegrationNeedsFindings extends ResearchFindings {
  items: IntegrationNeedItem[];
}

// Union type for all research findings
export type AllResearchFindings = 
  | DecisionMakersFindings
  | TechStackFindings
  | BusinessChallengesFindings
  | CompetitivePositioningFindings
  | CompetitivePositioningValuePropsFindings
  | RecentActivitiesFindings
  | BudgetIndicatorsFindings
  | BuyingSignalsFindings
  | CompetitiveUsageFindings
  | DigitalFootprintFindings
  | GrowthSignalsFindings
  | ComplianceRequirementsFindings
  | IntegrationNeedsFindings;

// Registry for research findings types
export interface ResearchFindingsRegistry {
  decision_makers: DecisionMakersFindings;
  tech_stack: TechStackFindings;
  business_challenges: BusinessChallengesFindings;
  competitive_positioning: CompetitivePositioningFindings;
  competitive_positioning_value_props: CompetitivePositioningValuePropsFindings;
  recent_activities: RecentActivitiesFindings;
  budget_indicators: BudgetIndicatorsFindings;
  buying_signals: BuyingSignalsFindings;
  competitive_usage: CompetitiveUsageFindings;
  digital_footprint: DigitalFootprintFindings;
  growth_signals: GrowthSignalsFindings;
  compliance_requirements: ComplianceRequirementsFindings;
  integration_needs: IntegrationNeedsFindings;
}

// Additional types for backward compatibility
export interface ValueProposition {
  title: string;
  description: string;
  targetAudience: string;
  keyBenefits: string[];
  differentiation: string[];
}

export interface StakeholderMessaging {
  role: string;
  keyMessages: string[];
  painPoints: string[];
  valueProps: string[];
}

export interface CompetitiveMap {
  competitors: Array<{
    name: string;
    strength: string;
    weakness: string;
    marketPosition: string;
  }>;
  opportunities: string[];
  threats: string[];
}

export interface ValuePropItem {
  title: string;
  description: string;
  targetAudience: string;
  keyBenefits: string[];
}
