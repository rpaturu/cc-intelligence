import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, TrendingUp, Zap } from 'lucide-react';
import { CompanySummary } from '../../types/research-types';

interface CompanySummaryCardProps {
  companySummary: CompanySummary;
  className?: string;
}

export function CompanySummaryCard({ companySummary, className = "" }: CompanySummaryCardProps) {
  return (
    <Card className={`bg-accent/50 border-l-4 border-l-primary ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">{companySummary.name}</span>
            <Badge variant="secondary">{companySummary.industry}</Badge>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{companySummary.size}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>{companySummary.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Recent: {companySummary.recentNews}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="flex flex-wrap gap-1">
              <span className="text-muted-foreground text-sm">Tech:</span>
              {companySummary.techStack.map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 