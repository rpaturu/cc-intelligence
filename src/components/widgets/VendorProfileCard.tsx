import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building, Layers, Star } from 'lucide-react';
import { VendorProfile } from '../../types/research';

interface VendorProfileCardProps {
  vendorProfile: VendorProfile;
  userName?: string;
  className?: string;
}

export function VendorProfileCard({ vendorProfile, userName, className = "" }: VendorProfileCardProps) {
  return (
    <Card className={`bg-gradient-to-br from-primary/5 to-accent/30 border-l-4 border-l-primary !gap-1 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building className="w-4 h-4 text-primary" />
          Hello {userName ? `${userName}, ` : ''}I understand you completely
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          I know you as a {vendorProfile.persona.role} at {vendorProfile.company}, your market position, and the competitive landscape you navigate. {vendorProfile.overview}
        </p>
      </CardHeader>
      <CardContent className="space-y-1">

        {/* Company Context */}
        <div>
          <h4 className="mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Your Company's Competitive Edge
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vendorProfile.products.map((product, index) => (
              <div key={index} className="bg-background/50 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{product.category}</Badge>
                </div>
                <p className="text-sm text-foreground mb-1">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role Intelligence */}
        <div>
          <h4 className="mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            How You Win in Your Role
          </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="bg-background/50 rounded p-3">
                <p className="text-xs text-muted-foreground mb-2">What You Focus On</p>
              <ul className="text-xs space-y-1">
                {vendorProfile.persona.keyFocus.map((focus: string, index: number) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </div>
                          <div className="bg-background/50 rounded p-3">
                <p className="text-xs text-muted-foreground mb-2">How You're Measured</p>
              <ul className="text-xs space-y-1">
                {vendorProfile.persona.successMetrics.map((metric: string, index: number) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
                          <div className="bg-background/50 rounded p-3">
                <p className="text-xs text-muted-foreground mb-2">What You're Up Against</p>
              <ul className="text-xs space-y-1">
                {vendorProfile.persona.commonChallenges.map((challenge: string, index: number) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 