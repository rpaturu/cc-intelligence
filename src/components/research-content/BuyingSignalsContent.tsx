import React, { useState } from "react";
import { TrendingUp, Target, Zap, Clock, Users, Star, Activity, Sparkles, DollarSign, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { buyingSignals, intentScore } from "./data/buying-signals-data";

const getSignalTypeIcon = (type: string) => {
  switch (type) {
    case "budget": return DollarSign;
    case "evaluation": return Target;
    case "stakeholder": return Users;
    case "urgency": return Clock;
    case "competition": return Activity;
    case "growth": return TrendingUp;
    default: return Zap;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export const BuyingSignalsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "signals" | "cycle" | "actions">("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Buying Signals & Purchase Intent</h1>
          <p className="text-muted-foreground">
            Real-time purchase intent analysis and buying signal detection for Acme Corporation
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Intent Overview</TabsTrigger>
          <TabsTrigger value="signals">Active Signals</TabsTrigger>
          <TabsTrigger value="cycle">Buying Cycle</TabsTrigger>
          <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
        </TabsList>

        {/* Intent Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Intent Score Header */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-muted/30 to-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Purchase Intent Score
                  </h2>
                  <p className="text-sm text-muted-foreground">Real-time analysis of buying readiness</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{intentScore.overall}/100</div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {intentScore.category}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Intent Strength</span>
                    <span className="font-semibold text-primary">{intentScore.overall}%</span>
                  </div>
                  <Progress value={intentScore.overall} className="h-3" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-card/60 border rounded-lg">
                    <div className="font-semibold text-primary">{intentScore.confidence}%</div>
                    <div className="text-sm text-muted-foreground">Confidence</div>
                  </div>
                  <div className="text-center p-3 bg-card/60 border rounded-lg">
                    <div className="font-semibold text-primary">{intentScore.timeframe}</div>
                    <div className="text-sm text-muted-foreground">Expected Timeline</div>
                  </div>
                  <div className="text-center p-3 bg-card/60 border rounded-lg">
                    <div className="font-semibold text-primary flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {intentScore.trend}
                    </div>
                    <div className="text-sm text-muted-foreground">Trend</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Intent Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Key Intent Factors
              </CardTitle>
              <CardDescription>Primary drivers of high purchase intent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {intentScore.keyFactors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-xs font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{factor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signal Categories Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Financial Readiness</h3>
                    <p className="text-sm text-muted-foreground">Budget & procurement signals</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Approved</span>
                    <span className="font-semibold text-primary">✓ Yes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>RFP Process</span>
                    <span className="font-semibold text-primary">✓ Active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Procurement Timeline</span>
                    <span className="font-semibold">60 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Stakeholder Engagement</h3>
                    <p className="text-sm text-muted-foreground">Decision maker activity</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Champions Identified</span>
                    <span className="font-semibold text-primary">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Demo Attendance</span>
                    <span className="font-semibold text-primary">85%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Engagement Level</span>
                    <span className="font-semibold text-primary">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Urgency Indicators</h3>
                    <p className="text-sm text-muted-foreground">Timeline & pressure factors</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Deadline</span>
                    <span className="font-semibold text-primary">Q2 2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current Solution</span>
                    <span className="font-semibold text-destructive">Expiring</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Urgency Level</span>
                    <span className="font-semibold text-primary">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Signals Tab */}
        <TabsContent value="signals" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {buyingSignals.filter(signal => signal.strength).map((signal) => {
              const IconComponent = getSignalTypeIcon(signal.type);
              return (
                <Card key={signal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{signal.title || signal.signal || 'Buying Signal'}</h3>
                            <p className="text-sm text-muted-foreground">{signal.category} • Detected {signal.detected}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className={getImpactColor(signal.impact || 'medium')}>
                            {(signal.impact || 'medium').toUpperCase()} IMPACT
                          </Badge>
                          <div className="text-sm font-semibold text-primary">{signal.strength}% strength</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Signal Strength</span>
                            <span className="text-sm font-semibold">{signal.strength}%</span>
                          </div>
                          <Progress value={signal.strength} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Confidence Level</span>
                            <span className="text-sm font-semibold">{typeof signal.confidence === 'number' ? signal.confidence : 85}%</span>
                          </div>
                          <Progress value={typeof signal.confidence === 'number' ? signal.confidence : 85} className="h-2" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          Key Implications
                        </h4>
                        <ul className="space-y-1">
                          {(signal.implications || []).map((implication, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{implication}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          Source: {signal.source}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">{signal.nextAction}</span>
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Buying Cycle Tab */}
        <TabsContent value="cycle" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Buying Cycle Progress
              </CardTitle>
              <CardDescription>Current position in the purchase decision journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comprehensive buying cycle analysis and timeline tracking will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommended Actions Tab */}
        <TabsContent value="actions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Recommended Actions
              </CardTitle>
              <CardDescription>Strategic engagement recommendations based on current signals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed action recommendations and engagement strategies will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};