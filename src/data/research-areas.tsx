import { 
  Users, Target, Activity, DollarSign, Briefcase, Globe, BarChart3, Shield,
  Zap, TrendingUp, Swords, Link
} from "lucide-react";
import { ResearchArea } from "../types/research-types";

// Core 6 research areas optimized for mobile (matching Figma design)
const PRIORITY_RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "decision_makers",
    title: "Key contacts and decision makers",
    description: "Key contacts and stakeholders",
    icon: <Users className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 8, CSM: 9 }
  },
  {
    id: "business_challenges",
    title: "Pain points and operational challenges", 
    description: "Pain points and operational challenges",
    icon: <Target className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 8, CSM: 10 }
  },
  {
    id: "competitive_positioning",
    title: "Competitive landscape analysis",
    description: "Competitive positioning & value propositions", 
    icon: <Swords className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 7, CSM: 8 }
  },
  {
    id: "budget_indicators", 
    title: "Financial health and spending signals",
    description: "Financial health and spending signals",
    icon: <DollarSign className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 5, CSM: 7 }
  },
  {
    id: "buying_signals",
    title: "Intent data and purchase indicators", 
    description: "Intent data and purchase indicators",
    icon: <TrendingUp className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 7, CSM: 6 }
  },
  {
    id: "recent_activities",
    title: "News, hiring, expansion signals",
    description: "News, hiring, expansion signals",
    icon: <Activity className="w-4 h-4" />,
    roleRelevance: { AE: 9, SE: 6, CSM: 8 }
  }
];

// 13 structured research areas with descriptive labels (matching initial list)
export const CORE_RESEARCH_AREAS: ResearchArea[] = [
  ...PRIORITY_RESEARCH_AREAS,
  {
    id: "tech_stack", 
    title: "Current technology usage and preferences",
    description: "Current technology usage and preferences",
    icon: <Zap className="w-4 h-4" />,
    roleRelevance: { AE: 7, SE: 10, CSM: 6 }
  },
  {
    id: "competitive_positioning_value_props",
    title: "Competitive positioning & value propositions",
    description: "Competitive positioning & value propositions",
    icon: <Target className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 7, CSM: 8 }
  },
  {
    id: "competitive_usage",
    title: "Current vendor relationships",
    description: "Current vendor relationships",
    icon: <Briefcase className="w-4 h-4" />,
    roleRelevance: { AE: 9, SE: 8, CSM: 7 }
  },
  {
    id: "digital_footprint",
    title: "Online presence and marketing activity", 
    description: "Online presence and marketing activity", 
    icon: <Globe className="w-4 h-4" />,
    roleRelevance: { AE: 6, SE: 5, CSM: 4 }
  },
  {
    id: "growth_signals",
    title: "Expansion and scaling indicators",
    description: "Expansion and scaling indicators",
    icon: <BarChart3 className="w-4 h-4" />,
    roleRelevance: { AE: 9, SE: 6, CSM: 9 }
  },
  {
    id: "compliance_requirements",
    title: "Regulatory and security needs",
    description: "Regulatory and security needs",
    icon: <Shield className="w-4 h-4" />,
    roleRelevance: { AE: 8, SE: 9, CSM: 7 }
  },
  {
    id: "integration_needs",
    title: "Technical integration requirements",
    description: "Technical integration requirements",
    icon: <Link className="w-4 h-4" />,
    roleRelevance: { AE: 6, SE: 10, CSM: 5 }
  }
];

export const getResearchAreas = (userRole: string): ResearchArea[] => {
  // Return all 13 research areas to match initial list (1/13 progress)
  return CORE_RESEARCH_AREAS.map(area => ({
    ...area,
    priority: area.roleRelevance[getRoleKey(userRole)]
  }));
};

function getRoleKey(userRole: string): 'AE' | 'SE' | 'CSM' {
  const roleKey = userRole.replace(/[-_]/g, '').toUpperCase();
  return roleKey === 'ACCOUNTEXECUTIVE' ? 'AE' : 
         roleKey === 'SOLUTIONSENGINEER' ? 'SE' : 
         roleKey === 'CUSTOMERSUCCESS' ? 'CSM' : 'AE';
} 