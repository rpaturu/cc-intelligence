import React from "react";
import { Target, Star, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { valuePropositions, positioningSummary } from "./data/competitive-positioning-value-props-data";

export const CompetitivePositioningValuePropsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Competitive Value Propositions</h1>
          <p className="text-muted-foreground">
            Key differentiators and competitive advantages positioning
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {valuePropositions.slice(0, 3).map((prop, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{prop.title}</h3>
                    <p className="text-sm text-muted-foreground">{prop.competitiveAdvantage}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Evidence: {prop.evidencePoints[0]}
                    </p>
                  </div>
                </div>
                <Badge 
                  className={
                    prop.category === "Security" 
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  }
                >
                  {prop.category} Category
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Competitive Positioning Summary
          </CardTitle>
          <CardDescription>Strategic positioning against key competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {positioningSummary.slice(0, 2).map((positioning) => (
              <div key={positioning.id} className="flex items-start gap-3">
                {positioning.category === "Performance" ? (
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Award className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-medium">{positioning.title}</h4>
                  <p className="text-sm text-muted-foreground">{positioning.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};