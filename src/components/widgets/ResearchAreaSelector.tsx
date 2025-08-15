import { Button } from '../ui/button';
import { ResearchArea } from '../../types/research-types';

interface ResearchAreaSelectorProps {
  researchAreas: ResearchArea[];
  completedIds?: string[];
  onAreaClick: (areaId: string, areaTitle: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ResearchAreaSelector({ 
  researchAreas, 
  completedIds = [],
  onAreaClick, 
  disabled = false,
  className = "" 
}: ResearchAreaSelectorProps) {
  // Only show uncompleted areas - completed ones appear in progress tracker
  const availableAreas = researchAreas.filter(area => !completedIds.includes(area.id));
  
  return (
    <div className={`grid grid-cols-1 gap-2 ${className}`}>
      {availableAreas.map((area) => (
        <Button
          key={area.id}
          variant="outline"
          size="sm"
          className="w-full justify-start text-left"
          onClick={() => !disabled && onAreaClick(area.id, area.title)}
          disabled={disabled}
        >
          {area.icon && <span className="mr-2">{area.icon}</span>}
          {area.description}
        </Button>
      ))}
    </div>
  );
} 