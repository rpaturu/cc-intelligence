import { 
  Users, Target, Activity, DollarSign, Briefcase, Globe, BarChart3, Shield,
  Zap, TrendingUp, Swords, Link
} from "lucide-react";
import { ResearchArea } from "../types/research-types";

// Core 6 research areas optimized for mobile (matching Figma design)
const PRIORITY_RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "decision_makers",
    title: "Decision Makers",
    description: "Key contacts and stakeholders",
    icon: <Users className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 8, CSM: 9 }
  },
  {
    id: "business_challenges",
    title: "Business Challenges", 
    description: "Pain points and operational challenges",
    icon: <Target className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 8, CSM: 10 }
  },
  {
    id: "competitive_positioning",
    title: "Competitive Positioning",
    description: "Competitive positioning & value propositions", 
    icon: <Swords className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 7, CSM: 8 }
  },
  {
    id: "budget_indicators", 
    title: "Budget Indicators",
    description: "Financial health and spending signals",
    icon: <DollarSign className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 5, CSM: 7 }
  },
  {
    id: "buying_signals",
    title: "Buying Signals", 
    description: "Intent data and purchase indicators",
    icon: <TrendingUp className="w-4 h-4" />,
    roleRelevance: { AE: 10, SE: 7, CSM: 6 }
  },
  {
    id: "recent_activities",
    title: "Recent Activities",
    description: "News, hiring, expansion signals",
    icon: <Activity className="w-4 h-4" />,
    roleRelevance: { AE: 9, SE: 6, CSM: 8 }
  }
];

// 11 structured research areas from Figma analysis
export const CORE_RESEARCH_AREAS: ResearchArea[] = [
  ...PRIORITY_RESEARCH_AREAS,
  {
    id: "tech_stack", 
    title: "Tech Stack",
    description: "Current technology usage and preferences",
    icon: <Zap className="w-4 h-4" />,
    roleRelevance: { AE: 7, SE: 10, CSM: 6 }
  },
  {
    id: "competitive_usage",
    title: "Current Vendors",
    description: "Current vendor relationships",
    icon: <Briefcase className="w-4 h-4" />,
    roleRelevance: { AE: 9, SE: 8, CSM: 7 }
  },
  {
    id: "digital_footprint",
    title: "Digital Footprint",
    description: "Online presence and marketing activity", 
    icon: <Globe className="w-4 h-4" />,
    roleRelevance: { AE: 6, SE: 5, CSM: 4 }
  },
  {
    id: "growth_signals",
    title: "Growth Signals",
    description: "Expansion and scaling indicators",
    icon: <BarChart3 className="w-4 h-4" />,
    roleRelevance: { AE: 9, SE: 6, CSM: 9 }
  },
  {
    id: "compliance_requirements",
    title: "Compliance & Security",
    description: "Regulatory and security needs",
    icon: <Shield className="w-4 h-4" />,
    roleRelevance: { AE: 8, SE: 9, CSM: 7 }
  },
  {
    id: "integration_needs",
    title: "Technical Integration",
    description: "Technical integration requirements",
    icon: <Link className="w-4 h-4" />,
    roleRelevance: { AE: 6, SE: 10, CSM: 5 }
  }
];

export const getResearchAreas = (userRole: string): ResearchArea[] => {
  // Return all 12 research areas to match Figma design (1/12 progress)
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