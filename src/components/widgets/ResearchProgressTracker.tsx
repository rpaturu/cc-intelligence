import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ChevronUp, ChevronDown, Target, CheckCircle } from 'lucide-react';
import { ResearchProgress, ResearchArea } from '../../types/research-types';

interface ResearchProgressTrackerProps {
  progress: ResearchProgress;
  allResearchAreas: ResearchArea[];
  onToggleCollapse?: () => void;
  onAreaClick?: (areaId: string, areaTitle: string) => void;
  className?: string;
}

export function ResearchProgressTracker({ 
  progress, 
  allResearchAreas,
  onToggleCollapse,
  onAreaClick,
  className = "" 
}: ResearchProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(!progress.isCollapsed);
  
  const completedAreas = allResearchAreas.filter(area => 
    progress.completedIds.includes(area.id)
  );
  
  const remainingAreas = allResearchAreas.filter(area => 
    !progress.completedIds.includes(area.id)
  );

  const progressPercentage = progress.totalAreas > 0 
    ? (progress.completedAreas / progress.totalAreas) * 100 
    : 0;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggleCollapse?.();
  };

  return (
    <Card className={`bg-muted/80 border ${className}`}>
      <CardContent className="p-3">
        {/* Header with progress */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Research Progress</span>
            <span className="text-sm text-muted-foreground">
              {progress.completedAreas}/{progress.totalAreas}
            </span>
            <div className="flex-1 mx-2">
              <Progress value={progressPercentage} className="h-0.5" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </Button>
        </div>

        {/* Remaining count */}
        <div className="flex items-center gap-1 mb-2">
          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
          <span className="text-sm text-muted-foreground">
            {remainingAreas.length} remaining
          </span>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="space-y-2">
            {/* Remaining Research Areas */}
            {remainingAreas.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {remainingAreas.map((area) => (
                  <Button
                    key={area.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => onAreaClick?.(area.id, area.title)}
                  >
                    {area.icon && <span className="mr-2">{area.icon}</span>}
                    {area.description}
                  </Button>
                ))}
              </div>
            )}

            {/* Completed Section */}
            {completedAreas.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {completedAreas.length} completed
                  </span>
                </div>
                
                <div className="space-y-0.5 ml-4">
                  {completedAreas.map((area) => (
                    <div 
                      key={area.id}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground line-through">{area.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 