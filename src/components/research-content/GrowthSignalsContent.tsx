import React from "react";
import { TrendingUp, Building2, Users, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getGrowthSignalsComprehensive } from "./data/growth-signals-data";

export const GrowthSignalsContent: React.FC = () => {
  // Get growth signals data
  const growthData = getGrowthSignalsComprehensive();
  
  // Transform data for display compatibility
  const growthMetrics = [
    {
      metric: "Engineering Team",
      value: "50→70",
      growth: "+40%"
    },
    {
      metric: "Series B Funding",
      value: "$50M",
      growth: "Completed"
    },
    {
      metric: "Enterprise Deals",
      value: "150%",
      growth: "Pipeline"
    }
  ];

  const expansionIndicators = growthData.map(signal => ({
    id: signal.id,
    type: signal.category.toLowerCase().includes('team') ? 'hiring' : 'financial',
    title: signal.title,
    description: signal.description
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Growth Signals & Expansion</h1>
          <p className="text-muted-foreground">
            Company growth indicators and expansion signals for Acme Corporation
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {growthMetrics.map((metric, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{metric.growth}</div>
                  <div className="text-xs text-muted-foreground">YoY Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Expansion Indicators
          </CardTitle>
          <CardDescription>Key signals indicating business growth and scaling needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expansionIndicators.slice(0, 2).map((indicator) => (
              <div key={indicator.id} className="flex items-start gap-3">
                {indicator.type === "hiring" ? (
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                ) : (
                  <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-medium">{indicator.title}</h4>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};