import React from "react";
import { Globe, Search, TrendingUp, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getDigitalFootprintComprehensive } from "./data/digital-footprint-data";

export const DigitalFootprintContent: React.FC = () => {
  // Get digital footprint data
  const digitalData = getDigitalFootprintComprehensive();
  
  // Transform data for display compatibility
  const digitalPresence = digitalData.map(footprint => ({
    platform: footprint.channel,
    traffic: Object.values(footprint.metrics)[0] || "Growing",
    updates: footprint.lastUpdated,
    engagement: footprint.engagement
  }));

  const digitalMetrics = {
    monthlyVisits: "45K",
    socialFollowers: "8.5K",
    brandSentiment: "Positive"
  };

  const digitalTrends = digitalData.map(footprint => ({
    id: footprint.id,
    category: footprint.title,
    description: footprint.description
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Digital Footprint Analysis</h1>
          <p className="text-muted-foreground">
            Online presence and digital engagement patterns for Acme Corporation
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{digitalMetrics.monthlyVisits}</p>
                <p className="text-sm text-muted-foreground">Monthly Website Visits</p>
              </div>
              <Globe className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{digitalMetrics.socialFollowers}</p>
                <p className="text-sm text-muted-foreground">Social Media Followers</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{digitalMetrics.brandSentiment}</p>
                <p className="text-sm text-muted-foreground">Brand Sentiment</p>
              </div>
              <Search className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {digitalPresence.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{item.platform}</h3>
                  <p className="text-sm text-muted-foreground">Traffic: {item.traffic} • Updates: {item.updates}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary">
                    {item.engagement} Engagement
                  </Badge>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Digital Engagement Trends
          </CardTitle>
          <CardDescription>Analysis of online activity and engagement patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {digitalTrends.slice(0, 2).map((trend) => (
              <div key={trend.id}>
                <h4 className="font-medium text-sm">{trend.category}</h4>
                <p className="text-muted-foreground text-sm">{trend.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};