import React from "react";
import { Shield, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { getComplianceRequirementsComprehensive } from "./data/compliance-requirements-data";

export const ComplianceRequirementsContent: React.FC = () => {
  // Get compliance requirements data
  const complianceData = getComplianceRequirementsComprehensive();
  
  // Transform data for display compatibility
  const complianceItems = complianceData.map(requirement => ({
    name: requirement.framework,
    status: requirement.status === "Gaps Identified" ? "In Progress" : "Achieved",
    priority: requirement.riskLevel,
    progress: requirement.status === "Gaps Identified" ? 35 : requirement.status === "In Progress" ? 65 : 85
  }));

  const upcomingAudits = [
    {
      id: "q2-soc2",
      quarter: "Q2", 
      type: "SOC 2 Type II Remediation",
      description: "Address identified gaps from recent audit findings"
    },
    {
      id: "q4-iso",
      quarter: "Q4",
      type: "ISO 27001 Certification",
      description: "Complete certification process for information security management"
    },
    {
      id: "q3-gdpr",
      quarter: "Q3", 
      type: "GDPR Readiness Review",
      description: "Prepare for European expansion compliance requirements"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Compliance Requirements</h1>
          <p className="text-muted-foreground">
            Regulatory compliance status and requirements analysis for Acme Corporation
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {complianceItems.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {item.status === "Achieved" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                  </div>
                </div>
                <Badge 
                  className={
                    item.priority === "Critical" 
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : item.priority === "High"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }
                >
                  {item.priority}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Progress</span>
                  <span className="text-sm font-semibold text-primary">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Upcoming Audit Requirements
          </CardTitle>
          <CardDescription>Scheduled compliance audits and preparation requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAudits.map((audit) => (
              <div key={audit.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-xs font-semibold">{audit.quarter}</span>
                </div>
                <div>
                  <h4 className="font-medium">{audit.type}</h4>
                  <p className="text-sm text-muted-foreground">{audit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};