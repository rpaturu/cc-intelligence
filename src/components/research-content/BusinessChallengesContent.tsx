import React from "react";
import { AlertTriangle, TrendingDown, DollarSign, Clock, Users, Target, Lightbulb, BarChart3, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { businessChallenges } from "./data/business-challenges-data";

export const BusinessChallengesContent: React.FC = () => {
  const challenges = businessChallenges;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "High": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Operational": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Security": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Risk & Compliance": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "User Experience": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Strategic": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical": return <XCircle className="w-4 h-4" />;
      case "High": return <AlertCircle className="w-4 h-4" />;
      case "Medium": return <AlertTriangle className="w-4 h-4" />;
      case "Low": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const criticalChallenges = challenges.filter(c => c.severity === "Critical").length;
  const totalImpact = challenges.reduce((acc, challenge) => {
    const costMatch = challenge.businessImpact.cost?.match(/\$([0-9.]+)M/);
    return acc + (costMatch ? parseFloat(costMatch[1]) : 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{criticalChallenges} Critical Issues Identified - ${totalImpact.toFixed(1)}M Annual Impact</h1>
          <p className="text-muted-foreground">Prioritized challenges with business impact analysis and actionable solution roadmaps</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{challenges.length}</p>
                <p className="text-sm text-muted-foreground">Total Challenges</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-red-600">{criticalChallenges}</p>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">${totalImpact.toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Annual Impact</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">85%</p>
                <p className="text-sm text-muted-foreground">Solvable Issues</p>
              </div>
              <Target className="w-8 h-8 text-blue-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Analysis */}
      <div className="space-y-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityIcon(challenge.severity)}
                      <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{challenge.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                      <Badge className={getSeverityColor(challenge.severity)}>
                        {challenge.severity} Priority
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {challenge.timeline}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Detailed Tabs */}
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="impact">Impact</TabsTrigger>
                    <TabsTrigger value="pain-points">Pain Points</TabsTrigger>
                    <TabsTrigger value="solutions">Solutions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="mt-4">
                    <div className="space-y-2">
                      {challenge.details.map((detail, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                          <span className="text-sm text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="impact" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(challenge.businessImpact).map(([key, value]) => (
                        <div key={key} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                          </div>
                          <p className="text-sm text-red-700 dark:text-red-300">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pain-points" className="mt-4">
                    <div className="space-y-2">
                      {challenge.painPoints.map((painPoint, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{painPoint}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="solutions" className="mt-4">
                    <div className="space-y-4">
                      {challenge.solutions.map((solution, index) => (
                        <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground mb-1">{solution.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{solution.description}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  <BarChart3 className="w-3 h-3 mr-1" />
                                  {solution.roi}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {solution.timeframe}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button className="btn-hover-lift">
          <Target className="w-4 h-4 mr-2" />
          Create Solution Proposal
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Challenge Analysis
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <Users className="w-4 h-4 mr-2" />
          Schedule Strategy Session
        </Button>
      </div>
    </div>
  );
};