import React from "react";
import { DollarSign, TrendingUp, PieChart, Calculator, Target, CheckCircle, Clock, Users, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { budgetIndicators } from "./data/budget-indicators-data";

export const BudgetIndicatorsContent: React.FC = () => {
  // Calculate total budget from amount strings
  const totalBudget = budgetIndicators.reduce((sum, indicator) => {
    const amount = indicator.amount.match(/\$(\d+(?:\.\d+)?)([MK]?)/);
    if (amount) {
      let value = parseFloat(amount[1]);
      const unit = amount[2];
      if (unit === 'M') value *= 1000000;
      else if (unit === 'K') value *= 1000;
      return sum + value;
    }
    return sum;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Allocated": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Under Review": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Spent": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">${(totalBudget / 1000000).toFixed(1)}M Total Budget</h1>
          <p className="text-muted-foreground">Financial readiness analysis with procurement timelines and budget allocation insights</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">${(totalBudget / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{budgetIndicators.filter(b => b.confidence === "High" || b.confidence === "Confirmed").length}</p>
                <p className="text-sm text-muted-foreground">High Confidence</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{budgetIndicators.filter(b => b.status === "Approved" || b.status === "Allocated").length}</p>
                <p className="text-sm text-muted-foreground">Approved Budgets</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">Q1 2025</p>
                <p className="text-sm text-muted-foreground">Primary Timeline</p>
              </div>
              <Clock className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Analysis */}
      <div className="space-y-6">
        {budgetIndicators.map((budget) => (
          <Card key={budget.id} className="card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{budget.category}</h3>
                      <Badge className={getStatusColor(budget.status)}>
                        {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                      </Badge>
                      <Badge className={getConfidenceColor(budget.confidence)}>
                        {budget.confidence} Confidence
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{budget.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{budget.timeline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{budget.details.stakeholders?.length || 0} stakeholders</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-foreground">{budget.amount}</p>
                    <p className="text-sm text-muted-foreground">Budget allocated</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Tabs */}
                <Tabs defaultValue="breakdown" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="breakdown">Budget Breakdown</TabsTrigger>
                    <TabsTrigger value="implications">Implications</TabsTrigger>
                    <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="breakdown" className="mt-4">
                    <div className="space-y-3">
                      {budget.details.breakdown?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground">{item.category}</span>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${item.percentage || 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-semibold text-foreground">{item.amount}</p>
                            <p className="text-xs text-muted-foreground">{item.percentage || 0}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="implications" className="mt-4">
                    <div className="space-y-2">
                      {budget.implications.map((implication, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-foreground">{implication}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stakeholders" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">Key Stakeholders</h4>
                          <div className="space-y-2">
                            {budget.details.stakeholders?.map((stakeholder, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {stakeholder}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">Approval Process</h4>
                          <div className="space-y-2">
                            {budget.details.approvalProcess?.map((process, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {process}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">Constraints</h4>
                          <div className="space-y-2">
                            {budget.details.constraints?.map((constraint, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {constraint}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">Requirements</h4>
                          <div className="space-y-2">
                            {budget.details.requirements?.map((requirement, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {requirement}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="mt-4">
                    <div className="space-y-3">
                      {budget.details.timeline?.map((timelineItem, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{timelineItem.phase}</div>
                            <div className="text-xs text-muted-foreground">{timelineItem.date}</div>
                            <div className="text-xs text-muted-foreground">{timelineItem.milestone}</div>
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
          Create Budget Proposal
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <PieChart className="w-4 h-4 mr-2" />
          Export Budget Analysis
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <Calculator className="w-4 h-4 mr-2" />
          Schedule Budget Review
        </Button>
      </div>
    </div>
  );
};