import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { CheckCircle, Clock, ArrowRight, Zap, TrendingUp, ChevronDown, Users, Target, Swords, Activity, DollarSign, Briefcase, Globe, BarChart3, Shield, Link } from "lucide-react";

interface ResearchOption {
  id: string;
  text: string;
  icon: string;
  category: string;
}

interface ResearchArea {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: string;
  completed?: boolean;
}

interface ResearchProgressProps {
  availableResearchAreas: ResearchArea[];
  completedResearch: any[];
  followUpOptions: ResearchOption[];
  onOptionClick: (optionId: string, optionText: string) => void;
}

// Complete list of research areas with their icons
const getAllResearchAreas = (): ResearchArea[] => [
  { id: "decision_makers", text: "Key contacts and decision makers", icon: <Users className="w-4 h-4" />, category: "research" },
  { id: "tech_stack", text: "Current technology usage and preferences", icon: <Zap className="w-4 h-4" />, category: "research" },
  { id: "business_challenges", text: "Pain points and operational challenges", icon: <Target className="w-4 h-4" />, category: "research" },
  { id: "competitive_positioning", text: "Competitive positioning & value propositions", icon: <Swords className="w-4 h-4" />, category: "research" },
  { id: "recent_activities", text: "News, hiring, expansion signals", icon: <Activity className="w-4 h-4" />, category: "research" },
  { id: "budget_indicators", text: "Financial health and spending signals", icon: <DollarSign className="w-4 h-4" />, category: "research" },
  { id: "buying_signals", text: "Intent data and purchase indicators", icon: <TrendingUp className="w-4 h-4" />, category: "research" },
  { id: "competitive_usage", text: "Current vendor relationships", icon: <Briefcase className="w-4 h-4" />, category: "research" },
  { id: "digital_footprint", text: "Online presence and marketing activity", icon: <Globe className="w-4 h-4" />, category: "research" },
  { id: "growth_signals", text: "Expansion and scaling indicators", icon: <BarChart3 className="w-4 h-4" />, category: "research" },
  { id: "compliance_requirements", text: "Regulatory and security needs", icon: <Shield className="w-4 h-4" />, category: "research" },
  { id: "integration_needs", text: "Technical integration requirements", icon: <Link className="w-4 h-4" />, category: "research" }
];

// Helper function to render icon from string or React component
const renderOptionIcon = (icon: any) => {
  if (typeof icon === 'string') {
    // For now, return a default icon since we don't have the Icon component
    return <Zap className="w-4 h-4" />;
  }
  return icon;
};

export default function ResearchProgress({
  availableResearchAreas,
  completedResearch,
  followUpOptions,
  onOptionClick
}: ResearchProgressProps) {
  const [isAllAreasExpanded, setIsAllAreasExpanded] = useState(false);
  
  // Use availableResearchAreas if provided, otherwise fall back to all areas
  const allAreas = availableResearchAreas && availableResearchAreas.length > 0 
    ? availableResearchAreas 
    : getAllResearchAreas();
  const completionPercentage = (completedResearch.length / allAreas.length) * 100;

  // Mark completed areas - enhanced matching logic
  const areasWithStatus = allAreas.map(area => {
    // Check if this area has been researched by looking for:
    // 1. Direct research area ID match (preferred method)
    // 2. Research title match (fallback method)
    const isCompleted = completedResearch.some(research => {
      // First, check if the research area ID directly matches
      if (research.researchArea === area.id) {
        return true;
      }
      
      // Fallback: Try to extract research type from the research findings title
      const researchTitle = research.findings?.title?.toLowerCase() || '';
      
      // Map research findings titles to area IDs
      const titleToAreaMap: Record<string, string> = {
        'key contacts & decision makers': 'decision_makers',
        'key contacts and decision makers': 'decision_makers', 
        'decision makers': 'decision_makers',
        'technology stack & preferences': 'tech_stack',
        'technology stack and preferences': 'tech_stack',
        'tech stack': 'tech_stack',
        'business challenges & pain points': 'business_challenges',
        'business challenges and pain points': 'business_challenges',
        'business challenges': 'business_challenges',
        'pain points': 'business_challenges',
        'competitive positioning & value propositions': 'competitive_positioning',
        'competitive positioning and value propositions': 'competitive_positioning',
        'competitive positioning': 'competitive_positioning',
        'recent activities & signals': 'recent_activities',
        'recent activities and signals': 'recent_activities',
        'recent activities': 'recent_activities',
        'budget indicators & financial signals': 'budget_indicators',
        'budget indicators and financial signals': 'budget_indicators',
        'budget indicators': 'budget_indicators',
        'buying signals & purchase intent': 'buying_signals',
        'buying signals and purchase intent': 'buying_signals',
        'buying signals': 'buying_signals',
        'vendor relationships': 'competitive_usage',
        'digital footprint': 'digital_footprint',
        'growth signals': 'growth_signals',
        'compliance': 'compliance_requirements',
        'integration': 'integration_needs'
      };
      
      // Check for title-based match
      return Object.entries(titleToAreaMap).some(([title, areaId]) => 
        researchTitle.includes(title) && areaId === area.id
      );
    });
    
    return {
      ...area,
      completed: isCompleted
    };
  });

  const completedAreas = areasWithStatus.filter(area => area.completed);
  const pendingAreas = areasWithStatus.filter(area => !area.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="card-hover research-progress-container"
      data-testid="research-progress"
    >
      <Card className="bg-gradient-to-br from-accent/50 to-primary/5 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          {/* Compact header with all progress info */}
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-accent/40 rounded-lg transition-all duration-200 p-2 -m-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 research-progress-header"
            onClick={(e) => {
              setIsAllAreasExpanded(!isAllAreasExpanded);
              e.currentTarget.blur();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsAllAreasExpanded(!isAllAreasExpanded);
                e.currentTarget.blur();
              }
            }}
            aria-expanded={isAllAreasExpanded}
            aria-label={`${isAllAreasExpanded ? 'Collapse' : 'Expand'} research progress details`}
          >
            {/* Left side - Progress with visual indicator */}
            <div className="flex items-center gap-3 pointer-events-none">
              <TrendingUp className="w-5 h-5 text-primary group-hover:scale-105 transition-transform duration-200" />
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Research Progress</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {completedResearch.length}/{allAreas.length}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress 
                  value={completionPercentage} 
                  className="h-2.5 w-32" 
                />
                <span className="text-sm font-medium text-primary min-w-[2.5rem]">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
            </div>
            
            {/* Right side - Expand indicator */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              <span>{isAllAreasExpanded ? 'Collapse' : 'Expand'}</span>
              <ChevronDown 
                className={`w-4 h-4 transition-all duration-200 group-hover:text-primary ${
                  isAllAreasExpanded ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* All Research Areas Collapsible */}
          <Collapsible open={isAllAreasExpanded}>
            <CollapsibleContent className="mt-2">
              <div className="space-y-3">
                {/* Remaining count indicator */}
                {pendingAreas.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <span>{pendingAreas.length} remaining</span>
                  </div>
                )}

                {/* Pending Research Areas */}
                {pendingAreas.length > 0 && (
                  <div className="space-y-2">
                    {pendingAreas.map((area) => (
                      <Button
                        key={area.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left transition-all duration-200 bg-card/50 border-border/60 hover:bg-accent hover:text-accent-foreground hover:border-primary/50 active:bg-accent/80 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-card/80 dark:border-border dark:hover:bg-accent/80 dark:hover:border-primary/60 dark:hover:text-foreground dark:active:bg-accent/60"
                        onClick={(e) => {
                          onOptionClick(area.id, area.text);
                          // Immediate visual feedback and focus management
                          e.currentTarget.blur();
                        }}
                      >
                        <span className="mr-2 flex-shrink-0">
                          {area.icon}
                        </span>
                        <span className="flex-1 text-left">{area.text}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Completed count indicator */}
                {completedAreas.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 mb-1">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{completedAreas.length} completed</span>
                  </div>
                )}

                {/* Completed Research Areas */}
                {completedAreas.length > 0 && (
                  <div className="space-y-1">
                    {completedAreas.map((area) => (
                      <div 
                        key={area.id}
                        className="flex items-center gap-3 p-2 rounded-md text-sm text-green-600 dark:text-green-400"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="flex-1 line-through decoration-2 opacity-75">{area.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Available Research Areas */}
          {followUpOptions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                What would you like to do next?
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {followUpOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-left group btn-hover-lift focus-ring"
                    onClick={(e) => {
                      onOptionClick(option.id, option.text);
                      // Clear focus after click to prevent persistent border
                      e.currentTarget.blur();
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span>{renderOptionIcon(option.icon)}</span>
                      <span className="flex-1">{option.text}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="secondary" className="text-xs">
                        {option.category}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Only show timing estimate */}
          {!isAllAreasExpanded && pendingAreas.length > 0 && (
            <div className="flex items-center justify-center pt-3 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                <Clock className="w-3 h-3 inline mr-1" />
                Est. 2-3 min each
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}