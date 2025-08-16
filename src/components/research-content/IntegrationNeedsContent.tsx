import React from "react";
import { Puzzle, GitBranch, Database, Cloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getIntegrationNeedsComprehensive, getIntegrationNeedsStats } from "./data/integration-needs-data";

export const IntegrationNeedsContent: React.FC = () => {
  // Get integration needs data
  const integrationData = getIntegrationNeedsComprehensive();
  const stats = getIntegrationNeedsStats();
  
  // Transform data for display compatibility
  const integrationRequirements = integrationData.map(need => ({
    system: need.title,
    timeline: need.timeline,
    priority: need.priority,
    complexity: need.complexity
  }));

  const integrationStats = {
    totalSystems: stats.totalApplications,
    criticalIntegrations: stats.criticalNeeds,
    implementationTimeline: "3-6 months"
  };

  const architectureRequirements = [
    {
      id: "api-architecture",
      type: "API Architecture",
      title: "API Gateway Integration",
      description: "Centralized API management for secure access control"
    },
    {
      id: "data-sync",
      type: "Data Synchronization", 
      title: "Real-time Data Synchronization",
      description: "Seamless data flow between integrated systems"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Puzzle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Integration Requirements</h1>
          <p className="text-muted-foreground">
            System integration needs and technical requirements for Acme Corporation
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{integrationStats.totalSystems}+</p>
                <p className="text-sm text-muted-foreground">Systems to Integrate</p>
              </div>
              <Puzzle className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{integrationStats.criticalIntegrations}</p>
                <p className="text-sm text-muted-foreground">Critical Integrations</p>
              </div>
              <GitBranch className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{integrationStats.implementationTimeline}</p>
                <p className="text-sm text-muted-foreground">Implementation Timeline</p>
              </div>
              <Cloud className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {integrationRequirements.map((req, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{req.system}</h3>
                    <p className="text-sm text-muted-foreground">Timeline: {req.timeline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={
                      req.priority === "Critical" 
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : req.priority === "High"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }
                  >
                    {req.priority}
                  </Badge>
                  <Badge variant="outline">
                    {req.complexity} Complexity
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
            <GitBranch className="w-5 h-5 text-primary" />
            Integration Architecture Requirements
          </CardTitle>
          <CardDescription>Technical requirements and integration patterns needed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {architectureRequirements.slice(0, 2).map((requirement) => (
              <div key={requirement.id} className="flex items-start gap-3">
                {requirement.type === "API Architecture" ? (
                  <Cloud className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                ) : (
                  <Database className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-medium">{requirement.title}</h4>
                  <p className="text-sm text-muted-foreground">{requirement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};