import React from "react";
import { Activity, Target, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getVendorRelationshipsComprehensive, getReplacementOpportunities } from "./data/competitive-usage-data";

export const CompetitiveUsageContent: React.FC = () => {
  // Get vendor relationships data
  const vendorData = getVendorRelationshipsComprehensive();
  const displacementOpportunities = getReplacementOpportunities();
  
  // Transform data for display compatibility
  const competitorUsage = vendorData.map(vendor => ({
    name: vendor.vendor,
    usage: vendor.type,
    status: vendor.status === "At Risk" ? "At Risk" : "Active",
    risk: vendor.replacementPriority
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Competitive Usage Analysis</h1>
          <p className="text-muted-foreground">
            Current competitor solutions and usage patterns at Acme Corporation
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {competitorUsage.map((competitor, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                  <p className="text-sm text-muted-foreground">{competitor.usage}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={competitor.status === "Active" ? "default" : "secondary"}>
                    {competitor.status}
                  </Badge>
                  <Badge 
                    className={
                      competitor.risk === "High" 
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : competitor.risk === "Medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }
                  >
                    {competitor.risk} Risk
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Competitive Displacement Opportunity
          </CardTitle>
          <CardDescription>Analysis of replacement opportunities and competitive advantages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displacementOpportunities.slice(0, 2).map((opportunity, index) => (
              <div key={index} className="flex items-start gap-3">
                {opportunity.vendor === "Auth0" ? (
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-medium">Replace {opportunity.vendor}</h4>
                  <p className="text-sm text-muted-foreground">{opportunity.keyOpportunity}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};