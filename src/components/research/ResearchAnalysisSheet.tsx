import { motion } from "motion/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, ExternalLink, FileText, Database, Users, Building, TrendingUp, Shield, Zap } from "lucide-react";

// Import research content components (without navbar/layout) - Direct imports to avoid any index file issues
import { DecisionMakersContent } from "../research-content/DecisionMakersContent";
import { TechStackContent } from "../research-content/TechStackContent";
import { BusinessChallengesContent } from "../research-content/BusinessChallengesContent";
import { CompetitivePositioningContent } from "../research-content/CompetitivePositioningContent";
import { RecentActivitiesContent } from "../research-content/RecentActivitiesContent";
import { BuyingSignalsContent } from "../research-content/BuyingSignalsContent";
import { BudgetIndicatorsContent } from "../research-content/BudgetIndicatorsContent";
import { CompetitiveUsageContent } from "../research-content/CompetitiveUsageContent";
import { ComplianceRequirementsContent } from "../research-content/ComplianceRequirementsContent";
import { DigitalFootprintContent } from "../research-content/DigitalFootprintContent";
import { GrowthSignalsContent } from "../research-content/GrowthSignalsContent";
import { IntegrationNeedsContent } from "../research-content/IntegrationNeedsContent";
import { CompetitivePositioningValuePropsContent } from "../research-content/CompetitivePositioningValuePropsContent";

interface ResearchAnalysisSheetProps {
  isOpen: boolean;
  onClose: () => void;
  researchAreaId: string | null;
  onResearchAreaNavigation: (areaId: string) => void;
}

// Research area metadata for display
const researchAreaMeta = {
  decision_makers: {
    title: "Decision Makers & Key Contacts",
    description: "Comprehensive analysis of key stakeholders and decision makers",
    icon: <Users className="w-5 h-5" />,
    category: "People Intelligence"
  },
  tech_stack: {
    title: "Technology Stack Analysis",
    description: "Deep dive into their current technology infrastructure and tools",
    icon: <Database className="w-5 h-5" />,
    category: "Technical Intelligence"
  },
  business_challenges: {
    title: "Business Challenges & Pain Points",
    description: "Identified business challenges and growth obstacles",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Business Intelligence"
  },
  competitive_positioning: {
    title: "Competitive Positioning Analysis",
    description: "Competitive landscape and market positioning insights",
    icon: <Building className="w-5 h-5" />,
    category: "Market Intelligence"
  },
  competitive_positioning_value_props: {
    title: "Competitive Value Propositions",
    description: "Detailed competitive value proposition and differentiation analysis",
    icon: <Zap className="w-5 h-5" />,
    category: "Competitive Intelligence"
  },
  recent_activities: {
    title: "Recent Activities & News",
    description: "Latest company activities, news, and market developments",
    icon: <FileText className="w-5 h-5" />,
    category: "Activity Intelligence"
  },
  budget_indicators: {
    title: "Budget & Financial Indicators",
    description: "Financial health and budget allocation insights",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Financial Intelligence"
  },
  buying_signals: {
    title: "Buying Signals & Intent",
    description: "Purchase intent signals and buying behavior analysis",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Intent Intelligence"
  },
  competitive_usage: {
    title: "Competitive Tool Usage",
    description: "Analysis of competitor tool usage and preferences",
    icon: <Database className="w-5 h-5" />,
    category: "Competitive Intelligence"
  },
  digital_footprint: {
    title: "Digital Footprint Analysis",
    description: "Online presence and digital engagement patterns",
    icon: <ExternalLink className="w-5 h-5" />,
    category: "Digital Intelligence"
  },
  growth_signals: {
    title: "Growth Signals & Expansion",
    description: "Growth indicators and expansion opportunities",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Growth Intelligence"
  },
  compliance_requirements: {
    title: "Compliance & Security Requirements",
    description: "Regulatory compliance and security requirement analysis",
    icon: <Shield className="w-5 h-5" />,
    category: "Compliance Intelligence"
  },
  integration_needs: {
    title: "Integration Needs & Requirements",
    description: "Technical integration requirements and system compatibility",
    icon: <Zap className="w-5 h-5" />,
    category: "Integration Intelligence"
  }
};

export default function ResearchAnalysisSheet({
  isOpen,
  onClose,
  researchAreaId,
  onResearchAreaNavigation
}: ResearchAnalysisSheetProps) {
  if (!researchAreaId || !researchAreaMeta[researchAreaId as keyof typeof researchAreaMeta]) {
    return null;
  }

  const meta = researchAreaMeta[researchAreaId as keyof typeof researchAreaMeta];

  const handleBackToChat = () => {
    // Simply close the sheet - this will preserve the chat state and scroll position
    onClose();
  };

  const renderResearchComponent = () => {
    // Render the appropriate content component based on research area
    switch (researchAreaId) {
      case 'decision_makers':
        return <DecisionMakersContent />;
      case 'tech_stack':
        return <TechStackContent />;
      case 'business_challenges':
        return <BusinessChallengesContent />;
      case 'competitive_positioning':
        return <CompetitivePositioningContent />;
      case 'competitive_positioning_value_props':
        return <CompetitivePositioningValuePropsContent />;
      case 'recent_activities':
        return <RecentActivitiesContent />;
      case 'budget_indicators':
        return <BudgetIndicatorsContent />;
      case 'buying_signals':
        return <BuyingSignalsContent />;
      case 'competitive_usage':
        return <CompetitiveUsageContent />;
      case 'digital_footprint':
        return <DigitalFootprintContent />;
      case 'growth_signals':
        return <GrowthSignalsContent />;
      case 'compliance_requirements':
        return <ComplianceRequirementsContent />;
      case 'integration_needs':
        return <IntegrationNeedsContent />;
      default:
        // Fallback for unknown research areas
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Research Analysis</h3>
              <p className="text-muted-foreground mb-4">
                This section contains the detailed analysis for {meta.title.toLowerCase()}. 
                The full interactive analysis with all data visualizations, charts, and detailed insights 
                is available on the dedicated research page.
              </p>
              <Button 
                onClick={() => {
                  onResearchAreaNavigation(researchAreaId);
                  onClose();
                }}
                className="btn-hover-lift"
              >
                View Full Analysis
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Key Findings</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Comprehensive data analysis completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Strategic insights generated</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Actionable recommendations provided</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Available Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Export Research Data
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Create Outreach Campaign
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Schedule Follow-up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[90vw] sm:max-w-[1200px] p-0 export-sheet-scroll"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {meta.icon}
            </motion.div>
            <div className="flex-1">
              <SheetTitle className="text-left">{meta.title}</SheetTitle>
              <SheetDescription className="text-left mt-1">
                {meta.description}
              </SheetDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {meta.category}
            </Badge>
          </div>
          
          <div className="flex items-center justify-start mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToChat}
              className="gap-2 btn-hover-lift"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto export-sheet-scroll">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderResearchComponent()}
            </motion.div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}