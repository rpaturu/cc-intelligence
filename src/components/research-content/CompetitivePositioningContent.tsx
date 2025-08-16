import React, { useState } from "react";
import { Swords, TrendingUp, Shield, Users, DollarSign, Zap, Target, Award, Globe, BarChart3, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getCompetitivePositioningComprehensive } from "./data/competitive-positioning-data";

export const CompetitivePositioningContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "competitors" | "positioning" | "analysis">("overview");

  // Get competitive positioning data
  const competitiveData = getCompetitivePositioningComprehensive();
  
  // Create mock data for display compatibility
  const competitors = competitiveData.map((position, index) => ({
    id: index + 1,
    name: position.competitor,
    position: position.description,
    marketShare: 15 + (index * 8), // Mock market share data
    threatLevel: position.strategy === "Displacement" ? "high" : position.strategy === "Differentiation" ? "medium" : "low",
    competitiveScore: Math.max(60, 90 - (index * 10)),
    pricing: "$50-150/month",
    customerBase: "Enterprise and Mid-Market",
    products: ["Identity Platform", "Security Suite"],
    strengths: position.ourAdvantages.slice(0, 3),
    weaknesses: position.theirWeaknesses.slice(0, 3),
    recentMoves: [`Recent strategic initiative: ${position.currentStatus}`]
  }));

  const marketAnalysis = {
    totalMarketSize: "$15.2B",
    growthRate: "12.5%",
    keyTrends: [
      "Zero-trust security adoption",
      "Cloud-first identity strategies", 
      "AI-powered threat detection",
      "Passwordless authentication"
    ],
    marketDrivers: [
      "Remote workforce growth",
      "Regulatory compliance requirements",
      "Cybersecurity threat landscape",
      "Digital transformation initiatives"
    ],
    barriers: [
      "High switching costs",
      "Integration complexity",
      "Legacy system dependencies",
      "Security certification requirements"
    ]
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCompetitiveScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const companyName = "Acme Corp";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
          <Swords className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Competitive Landscape Analysis</h1>
          <p className="text-muted-foreground">
            Interactive competitive intelligence and market positioning analysis
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Profiles</TabsTrigger>
          <TabsTrigger value="positioning">Positioning Map</TabsTrigger>
          <TabsTrigger value="analysis">Strategic Analysis</TabsTrigger>
        </TabsList>

        {/* Market Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{marketAnalysis.totalMarketSize}</p>
                    <p className="text-sm text-muted-foreground">Total Market Size</p>
                  </div>
                  <Globe className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{marketAnalysis.growthRate}</p>
                    <p className="text-sm text-muted-foreground">Annual Growth Rate</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{competitors.length}</p>
                    <p className="text-sm text-muted-foreground">Key Competitors</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Share Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Market Share Distribution
              </CardTitle>
              <CardDescription>Current competitive landscape breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.map((competitor) => (
                  <div key={competitor.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{competitor.name}</span>
                      <span className="text-sm text-muted-foreground">{competitor.marketShare}%</span>
                    </div>
                    <Progress value={competitor.marketShare} className="h-2" />
                  </div>
                ))}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-primary">{companyName} (Opportunity)</span>
                    <span className="text-sm text-muted-foreground">
                      {100 - competitors.reduce((sum, comp) => sum + comp.marketShare, 0)}%
                    </span>
                  </div>
                  <Progress 
                    value={100 - competitors.reduce((sum, comp) => sum + comp.marketShare, 0)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Key Trends & Drivers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Market Trends</h4>
                  <ul className="space-y-2">
                    {marketAnalysis.keyTrends.map((trend, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Market Drivers</h4>
                  <ul className="space-y-2">
                    {marketAnalysis.marketDrivers.map((driver, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Market Barriers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {marketAnalysis.barriers.map((barrier, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{barrier}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competitor Profiles Tab */}
        <TabsContent value="competitors" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {competitors.map((competitor) => (
              <Card key={competitor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{competitor.name}</h3>
                        <p className="text-muted-foreground">{competitor.position}</p>
                        <p className="text-sm text-muted-foreground">{competitor.customerBase}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getThreatLevelColor(competitor.threatLevel)}>
                          {competitor.threatLevel.toUpperCase()} THREAT
                        </Badge>
                        <div>
                          <div className={`text-lg font-semibold ${getCompetitiveScoreColor(competitor.competitiveScore)}`}>
                            {competitor.competitiveScore}/100
                          </div>
                          <div className="text-xs text-muted-foreground">Competitive Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Market Share & Pricing */}
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Market Share:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={competitor.marketShare} className="flex-1 h-2" />
                          <span className="font-semibold">{competitor.marketShare}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Pricing:</span>
                        <p className="text-muted-foreground">{competitor.pricing}</p>
                      </div>
                      <div>
                        <span className="font-medium">Products:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {competitor.products.map((product, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {competitor.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Weaknesses
                        </h4>
                        <ul className="space-y-1">
                          {competitor.weaknesses.map((weakness, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recent Moves */}
                    <div>
                      <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Recent Strategic Moves
                      </h4>
                      <ul className="space-y-1">
                        {competitor.recentMoves.map((move, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {move}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Positioning Map Tab */}
        <TabsContent value="positioning" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Positioning Matrix</CardTitle>
              <CardDescription>
                Market position analysis based on capabilities vs. market presence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 bg-muted/50 rounded-lg p-4">
                {/* Axes Labels */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                  Market Presence & Scale
                </div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium">
                  Product Capabilities & Innovation
                </div>
                
                {/* Quadrant Labels */}
                <div className="absolute top-4 left-4 text-xs text-muted-foreground">
                  Niche Leaders
                </div>
                <div className="absolute top-4 right-4 text-xs text-muted-foreground">
                  Market Leaders
                </div>
                <div className="absolute bottom-8 left-4 text-xs text-muted-foreground">
                  Emerging Players
                </div>
                <div className="absolute bottom-8 right-4 text-xs text-muted-foreground">
                  Established Players
                </div>

                {/* Center Lines */}
                <div className="absolute left-1/2 top-4 bottom-8 w-px bg-border"></div>
                <div className="absolute top-1/2 left-4 right-4 h-px bg-border"></div>

                {/* Competitor Positions */}
                <div className="absolute top-16 right-16 w-3 h-3 bg-red-500 rounded-full" title="Market Leader Corp">
                  <div className="absolute -top-6 -left-12 text-xs font-medium whitespace-nowrap">
                    Market Leader Corp
                  </div>
                </div>
                
                <div className="absolute top-24 left-32 w-3 h-3 bg-yellow-500 rounded-full" title="Agile Challenger">
                  <div className="absolute -top-6 -left-8 text-xs font-medium whitespace-nowrap">
                    Agile Challenger
                  </div>
                </div>
                
                <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-500 rounded-full" title="Budget Provider">
                  <div className="absolute -top-6 -left-8 text-xs font-medium whitespace-nowrap">
                    Budget Provider
                  </div>
                </div>
                
                <div className="absolute top-32 right-32 w-3 h-3 bg-blue-500 rounded-full" title="Niche Specialist">
                  <div className="absolute -top-6 -left-8 text-xs font-medium whitespace-nowrap">
                    Niche Specialist
                  </div>
                </div>

                {/* Your Position */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2" title={companyName}>
                  <div className="absolute -top-6 -left-8 text-xs font-medium whitespace-nowrap text-primary">
                    {companyName}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p className="mb-2"><strong>Your Position:</strong> Currently positioned in the center with balanced capabilities and market presence.</p>
                <p><strong>Strategic Opportunity:</strong> Move toward the top-right quadrant by enhancing both product capabilities and market presence.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategic Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Competitive Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Innovation Speed</h4>
                      <p className="text-sm text-muted-foreground">Faster product development cycles than established competitors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Value-Based Pricing</h4>
                      <p className="text-sm text-muted-foreground">Superior ROI compared to market leaders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Customer Experience</h4>
                      <p className="text-sm text-muted-foreground">Modern, intuitive interface with shorter learning curve</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Enterprise Features</h4>
                      <p className="text-sm text-muted-foreground">Need advanced security and compliance capabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Market Presence</h4>
                      <p className="text-sm text-muted-foreground">Limited brand recognition in enterprise segment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Support Infrastructure</h4>
                      <p className="text-sm text-muted-foreground">Scale support team for enterprise accounts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Short-term (6 months)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Enhance enterprise security features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Develop competitive intelligence program</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Strengthen partner ecosystem</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Long-term (12+ months)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Build enterprise sales organization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Expand to international markets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Consider strategic acquisitions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button className="btn-hover-lift">
          <Target className="w-4 h-4 mr-2" />
          Create Competitive Strategy
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Analysis Report
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <TrendingUp className="w-4 h-4 mr-2" />
          Schedule Strategy Review
        </Button>
      </div>
    </div>
  );
};