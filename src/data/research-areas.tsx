import { ResearchArea } from "../types/research";

// Core 6 research areas optimized for mobile (matching Figma design)
const PRIORITY_RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "decision_makers",
    text: "Key contacts and decision makers",
    description: "Key contacts and stakeholders",
    iconName: "users",
    roleRelevance: { AE: 10, SE: 8, CSM: 9 }
  },
  {
    id: "business_challenges",
    text: "Pain points and operational challenges", 
    description: "Pain points and operational challenges",
    iconName: "target",
    roleRelevance: { AE: 10, SE: 8, CSM: 10 }
  },
  {
    id: "competitive_positioning",
    text: "Competitive landscape analysis",
    description: "Competitive positioning & value propositions", 
    iconName: "swords",
    roleRelevance: { AE: 10, SE: 7, CSM: 8 }
  },
  {
    id: "budget_indicators", 
    text: "Financial health and spending signals",
    description: "Financial health and spending signals",
    iconName: "dollar-sign",
    roleRelevance: { AE: 10, SE: 5, CSM: 7 }
  },
  {
    id: "buying_signals",
    text: "Intent data and purchase indicators", 
    description: "Intent data and purchase indicators",
    iconName: "trending-up",
    roleRelevance: { AE: 10, SE: 7, CSM: 6 }
  },
  {
    id: "recent_activities",
    text: "News, hiring, expansion signals",
    description: "News, hiring, expansion signals",
    iconName: "activity",
    roleRelevance: { AE: 9, SE: 6, CSM: 8 }
  }
];

// 13 structured research areas with descriptive labels (matching initial list)
export const CORE_RESEARCH_AREAS: ResearchArea[] = [
  ...PRIORITY_RESEARCH_AREAS,
  {
    id: "tech_stack", 
    text: "Current technology usage and preferences",
    description: "Current technology usage and preferences",
    iconName: "zap",
    roleRelevance: { AE: 7, SE: 10, CSM: 6 }
  },
  {
    id: "competitive_positioning_value_props",
    text: "Competitive positioning & value propositions",
    description: "Competitive positioning & value propositions",
    iconName: "target",
    roleRelevance: { AE: 10, SE: 7, CSM: 8 }
  },
  {
    id: "competitive_usage",
    text: "Current vendor relationships",
    description: "Current vendor relationships",
    iconName: "briefcase",
    roleRelevance: { AE: 9, SE: 8, CSM: 7 }
  },
  {
    id: "digital_footprint",
    text: "Online presence and marketing activity", 
    description: "Online presence and marketing activity", 
    iconName: "globe",
    roleRelevance: { AE: 6, SE: 5, CSM: 4 }
  },
  {
    id: "growth_signals",
    text: "Expansion and scaling indicators",
    description: "Expansion and scaling indicators",
    iconName: "bar-chart-3",
    roleRelevance: { AE: 9, SE: 6, CSM: 9 }
  },
  {
    id: "compliance_requirements",
    text: "Regulatory and security needs",
    description: "Regulatory and security needs",
    iconName: "shield",
    roleRelevance: { AE: 8, SE: 9, CSM: 7 }
  },
  {
    id: "integration_needs",
    text: "Technical integration requirements",
    description: "Technical integration requirements",
    iconName: "link",
    roleRelevance: { AE: 6, SE: 10, CSM: 5 }
  }
];

export const getResearchAreas = (userRole: string): ResearchArea[] => {
  // Return all 13 research areas to match initial list (1/13 progress)
  return CORE_RESEARCH_AREAS.map(area => ({
    ...area,
    priority: area.roleRelevance?.[getRoleKey(userRole)] || 0,
  }));
};

function getRoleKey(userRole: string): 'AE' | 'SE' | 'CSM' {
  const roleKey = userRole.replace(/[-_]/g, '').toUpperCase();
  return roleKey === 'ACCOUNTEXECUTIVE' ? 'AE' : 
         roleKey === 'SOLUTIONSENGINEER' ? 'SE' : 
         roleKey === 'CUSTOMERSUCCESS' ? 'CSM' : 'AE';
} 