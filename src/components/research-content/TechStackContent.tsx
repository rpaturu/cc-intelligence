import React, { useState } from "react";
import { Zap, Server, Cloud, Database, Shield, Code, Cpu, Globe, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { techStack } from "./data/tech-stack-data";

export const TechStackContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Technologies", icon: Globe, count: techStack.length },
    { id: "identity", name: "Identity & Security", icon: Shield, count: techStack.filter(t => t.category === "identity" || t.category === "security").length },
    { id: "cloud", name: "Cloud & Infrastructure", icon: Cloud, count: techStack.filter(t => t.category === "cloud").length },
    { id: "development", name: "Development", icon: Code, count: techStack.filter(t => t.category === "development").length },
    { id: "data", name: "Data & Analytics", icon: Database, count: techStack.filter(t => t.category === "data").length },
    { id: "business", name: "Business Apps", icon: Server, count: techStack.filter(t => t.category === "business").length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "legacy": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "underutilized": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case "High": return "text-green-600 dark:text-green-400";
      case "Medium": return "text-yellow-600 dark:text-yellow-400";
      case "Low": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const filteredStack = selectedCategory === "all" 
    ? techStack 
    : techStack.filter(tech => 
        tech.category === selectedCategory || 
        (selectedCategory === "identity" && (tech.category === "identity" || tech.category === "security"))
      );

  const totalSpending = techStack
    .filter(tech => tech.spending !== "$0")
    .reduce((sum, tech) => sum + parseInt(tech.spending.replace(/[^\d]/g, "")), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{techStack.length} Technologies Analyzed - ${(totalSpending / 1000).toFixed(0)}K Annual Spend</h1>
          <p className="text-muted-foreground">Complete infrastructure audit with integration opportunities and replacement recommendations</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{techStack.length}</p>
                <p className="text-sm text-muted-foreground">Technologies</p>
              </div>
              <Globe className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">${(totalSpending / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Annual Spending</p>
              </div>
              <Cpu className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{techStack.filter(t => t.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active Systems</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{techStack.filter(t => t.status === "legacy" || t.status === "underutilized").length}</p>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Technology Grid */}
      <div className="grid gap-6">
        {filteredStack.map((tech) => (
          <Card key={tech.name} className="card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{tech.name}</h3>
                      <Badge className={getStatusColor(tech.status)}>
                        {tech.status.charAt(0).toUpperCase() + tech.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{tech.type}</p>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{tech.spending}</p>
                    <p className="text-sm text-muted-foreground">{tech.contract}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Usage Level</span>
                      <span className={`text-sm font-medium ${getUsageColor(tech.usage)}`}>
                        {tech.usage}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Satisfaction</span>
                      <span className="text-sm font-medium text-foreground">{tech.satisfaction}%</span>
                    </div>
                    <Progress value={tech.satisfaction} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Integrations</span>
                      <span className="text-sm font-medium text-foreground">{tech.integrations}</span>
                    </div>
                  </div>
                </div>

                {/* Concerns and Opportunities */}
                <Tabs defaultValue="concerns" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="concerns">Concerns</TabsTrigger>
                    <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="concerns" className="mt-4">
                    <div className="space-y-2">
                      {tech.concerns.map((concern, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-foreground">{concern}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="opportunities" className="mt-4">
                    <div className="space-y-2">
                      {tech.opportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-foreground">{opportunity}</span>
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
          <Zap className="w-4 h-4 mr-2" />
          Create Integration Plan
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <Server className="w-4 h-4 mr-2" />
          Export Tech Audit
        </Button>
        <Button variant="outline" className="btn-hover-lift">
          <Clock className="w-4 h-4 mr-2" />
          Schedule Technical Review
        </Button>
      </div>
    </div>
  );
};