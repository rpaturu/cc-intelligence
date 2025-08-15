import type { ReactNode } from 'react';
import { Target, Search, CheckCircle, Building, TrendingUp, FileText, BarChart3, Users, GitBranch, CheckSquare } from 'lucide-react';

export interface QuestionContext {
  prospectCompany: string;
  vendorCompany?: string;
  userRole: string;
  territory?: string;
}

export interface StreamingStep {
  text: string;
  icon?: ReactNode;  // Activity type icon (Target, Search, etc.)
  statusIcon?: ReactNode;  // Status icon (CheckCircle, Clock, etc.)
}

export interface QuestionComponentProps {
  context: QuestionContext;
  onProgress: (step: { index: number; text: string }) => void;
  onComplete: (result: { findings: any; sources: any; followUps?: any[] }) => void;
  onError: (error: Error) => void;
}

export interface QuestionDefinition {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  datasets: string[];
  getStreamingSteps: (context: QuestionContext) => StreamingStep[];
  Component?: (props: QuestionComponentProps) => ReactNode; // optional per-question UI override
}

// Minimal registry for initial areas; can be expanded to all 12
export const QUESTION_REGISTRY: Record<string, QuestionDefinition> = {
  decision_makers: {
    id: 'decision_makers',
    title: 'Decision Makers',
    description: 'Key contacts and stakeholders',
    datasets: ['decision_makers', 'company_overview'],
    getStreamingSteps: () => [
      { 
        text: 'Mapping organizational structure', 
        icon: <GitBranch className="w-4 h-4" />
      },
      { 
        text: 'Scanning LinkedIn and company directory', 
        icon: <Search className="w-4 h-4" />
      },
      { 
        text: 'Analyzing recent leadership changes', 
        icon: <BarChart3 className="w-4 h-4" />
      },
      { 
        text: 'Identifying key stakeholders', 
        icon: <Users className="w-4 h-4" />
      },
      { 
        text: 'Found 8 decision makers with contact info', 
        icon: <CheckSquare className="w-4 h-4" />
      },
    ],
  },
  tech_stack: {
    id: 'tech_stack',
    title: 'Tech Stack',
    description: 'Current technology usage and preferences',
    datasets: ['tech_stack', 'integration_needs'],
    getStreamingSteps: () => [
      { 
        text: 'Analyzing technology footprint', 
        icon: <Target className="w-4 h-4" />
      },
      { 
        text: 'Scanning job postings for tech mentions', 
        icon: <Search className="w-4 h-4" />
      },
      { 
        text: 'Reviewing engineering blog posts', 
        icon: <BarChart3 className="w-4 h-4" />
      },
      { 
        text: 'Identifying tech preferences', 
        icon: <Users className="w-4 h-4" />
      },
      { 
        text: 'Found: AWS, Salesforce, React, Kubernetes', 
        icon: <CheckCircle className="w-4 h-4" />
      },
    ],
  },
  business_challenges: {
    id: 'business_challenges',
    title: 'Business Challenges',
    description: 'Pain points and operational challenges',
    datasets: ['business_challenges', 'recent_activities'],
    getStreamingSteps: () => [
      { 
        text: 'Reviewing news and public commentary', 
        icon: <FileText className="w-4 h-4" />
      },
      { 
        text: 'Extracting operational pain points', 
        icon: <TrendingUp className="w-4 h-4" />
      },
      { 
        text: 'Relating to vendor value propositions', 
        icon: <Building className="w-4 h-4" />
      },
      { 
        text: 'Formulating opportunity areas', 
        icon: <CheckCircle className="w-4 h-4" />
      },
    ],
  },
};


