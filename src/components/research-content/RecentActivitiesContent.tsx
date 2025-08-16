import React, { useState } from "react";
import { Activity,  TrendingUp, Zap, Users, Globe, Building2, AlertCircle, CheckCircle2, Clock, ExternalLink, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { getRecentActivitiesComprehensive } from "./data/recent-activities-data";



const getActivityIcon = (type: string) => {
  switch (type) {
    case "funding": return TrendingUp;
    case "hiring": return Users;
    case "product": return Zap;
    case "partnership": return Building2;
    case "compliance": return CheckCircle2;
    case "executive": return Globe;
    default: return Activity;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "increasing": return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "decreasing": return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    default: return <Activity className="w-4 h-4 text-gray-500" />;
  }
};



export const RecentActivitiesContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"timeline" | "signals" | "analysis">("timeline");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const companyName = "Acme Corporation";

  // Get recent activities data
  const activitiesData = getRecentActivitiesComprehensive();
  
  // Transform data for display compatibility
  const recentActivities = activitiesData.map(activity => ({
    id: activity.id,
    type: activity.category.toLowerCase(),
    category: activity.category,
    title: activity.title,
    description: activity.description,
    date: activity.date,
    impact: activity.impact,
    importance: activity.impact === "High" ? "85%" : activity.impact === "Medium" ? "60%" : "35%",
    source: activity.sources[0] || "Internal",
    details: {
      implications: activity.businessImplications
    },
    opportunities: activity.salesImplications,
    businessImpact: {
      opportunity: activity.businessImplications[0] || "",
      risk: "",
      budget: ""
    }
  }));

  const signalCategories = [
    {
      category: "Financial Signals",
      signalCount: 3,
      strengthScore: 85,
      trend: "increasing",
      recentSignals: [
        "Series B funding completed - $50M raised",
        "Budget increased for technology investments",
        "Board pressure for rapid growth"
      ]
    },
    {
      category: "Executive Changes", 
      signalCount: 2,
      strengthScore: 75,
      trend: "increasing",
      recentSignals: [
        "New CTO hired from Stripe with identity expertise",
        "VP Engineering position posted",
        "CISO expanding security team"
      ]
    },
    {
      category: "Compliance & Risk",
      signalCount: 4,
      strengthScore: 70,
      trend: "increasing", 
      recentSignals: [
        "SOC 2 Type II audit completed with gaps",
        "ISO 27001 certification in progress",
        "GDPR compliance for European expansion",
        "Identity governance gaps identified"
      ]
    }
  ];

  const filteredActivities = selectedCategory === "all" 
    ? recentActivities 
    : recentActivities.filter(activity => activity.category === selectedCategory);

  const categories = ["all", ...Array.from(new Set(recentActivities.map(a => a.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Recent Activities & Signals</h1>
          <p className="text-muted-foreground">
            Real-time intelligence on {companyName} activities and market signals
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
          <TabsTrigger value="signals">Signal Analysis</TabsTrigger>
          <TabsTrigger value="analysis">Strategic Analysis</TabsTrigger>
        </TabsList>

        {/* Activity Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{recentActivities.length}</p>
                    <p className="text-sm text-muted-foreground">Recent Activities</p>
                  </div>
                  <Activity className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">3</p>
                    <p className="text-sm text-muted-foreground">High Impact</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">7 days</p>
                    <p className="text-sm text-muted-foreground">Avg Frequency</p>
                  </div>
                  <Clock className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">82%</p>
                    <p className="text-sm text-muted-foreground">Signal Strength</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by category:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {category === "all" ? "All Activities" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Timeline Icon */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        {index < filteredActivities.length - 1 && (
                          <div className="w-px h-12 bg-border mt-2" />
                        )}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getImpactColor(activity.impact)}>
                              {activity.impact.toUpperCase()} IMPACT
                            </Badge>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {activity.date}
                            </span>
                          </div>
                        </div>

                        {/* Importance Level */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Importance Level</span>
                            <span className="text-sm font-semibold text-primary">{activity.importance}</span>
                          </div>
                        </div>

                        {/* Implications */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Implications</h4>
                          <ul className="space-y-1">
                            {activity.details.implications?.map((implication, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                {implication}
                              </li>
                            )) || activity.opportunities?.map((opportunity, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Source & Business Impact */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Source: {activity.source}</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                          <div className="text-sm text-primary font-medium">
                            {activity.businessImpact?.opportunity || activity.businessImpact?.risk || activity.businessImpact?.budget}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Signal Analysis Tab */}
        <TabsContent value="signals" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {signalCategories.map((signalCategory, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getTrendIcon(signalCategory.trend)}
                        {signalCategory.category}
                      </CardTitle>
                      <CardDescription>
                        {signalCategory.signalCount} signals detected
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-primary">
                        {signalCategory.strengthScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Strength Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Signal Strength</span>
                      <span className="text-sm text-muted-foreground">{signalCategory.strengthScore}%</span>
                    </div>
                    <Progress value={signalCategory.strengthScore} className="h-2" />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Signals</h4>
                    <ul className="space-y-2">
                      {signalCategory.recentSignals.map((signal, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Strategic Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Positive Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Strong Funding Position</h4>
                      <p className="text-sm text-muted-foreground">Recent $50M Series B provides expansion capital</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Leadership Expansion</h4>
                      <p className="text-sm text-muted-foreground">New VP of Engineering indicates technical growth</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Compliance Ready</h4>
                      <p className="text-sm text-muted-foreground">SOC 2 certification shows enterprise readiness</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Competitive Evaluation</h4>
                      <p className="text-sm text-muted-foreground">Actively evaluating multiple identity solutions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Product Development</h4>
                      <p className="text-sm text-muted-foreground">Internal beta suggests build vs. buy consideration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Timeline Pressure</h4>
                      <p className="text-sm text-muted-foreground">Q1 decision timeline requires quick engagement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Immediate (This Week)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Reach out to new VP of Engineering Sarah Chen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Congratulate on recent funding and compliance achievements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Position identity platform for scaling needs</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Near-term (Next 2 Weeks)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Schedule competitive analysis presentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Demonstrate enterprise security capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Attend FinTech Summit for CEO engagement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};