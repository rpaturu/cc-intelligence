import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Target, Wrench, Phone, Handshake, BarChart3, Users, Zap, Globe, CheckCircle } from 'lucide-react';

interface RoleInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  keyAreas: string[];
}

interface RoleIntelligenceWidgetProps {
  role: string;
  department?: string;
  territory?: string;
  salesFocus?: string;
  showFullDetails?: boolean; // true for ProfilePage, false for PersonalInfoPage
  className?: string;
}

const getRoleDescription = (role: string): RoleInfo | null => {
  const descriptions: Record<string, RoleInfo> = {
    "account-executive": {
      title: "Revenue-Focused (AE)",
      description: "AI configured for deal velocity, competitive intel, and revenue opportunities. Focus on buying signals, decision maker identification, and closing strategies.",
      icon: <Target className="w-4 h-4" />,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-950",
      keyAreas: ["Buying signals detection", "Decision maker mapping", "Competitive intelligence", "Revenue opportunities"]
    },
    "solutions-engineer": {
      title: "Technical-Focused (SE)",
      description: "AI tailored for technical requirements, solution fit analysis, and implementation insights. Focus on tech stack compatibility, integration needs, and technical stakeholders.",
      icon: <Wrench className="w-4 h-4" />,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-950",
      keyAreas: ["Technical requirements", "Solution architecture", "Integration planning", "Implementation timeline"]
    },
    "sales-development": {
      title: "Prospecting-Focused (SDR)",
      description: "AI designed for lead qualification, outreach personalization, and pipeline generation. Focus on contact discovery, engagement strategies, and qualification criteria.",
      icon: <Phone className="w-4 h-4" />,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-950",
      keyAreas: ["Lead scoring", "Outreach personalization", "Qualification criteria", "Pipeline optimization"]
    },
    "business-development": {
      title: "Partnership-Focused (BDR)",
      description: "AI configured for strategic partnerships, market expansion, and business opportunities. Focus on partner ecosystem, market analysis, and strategic initiatives.",
      icon: <Handshake className="w-4 h-4" />,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-950",
      keyAreas: ["Partnership mapping", "Market analysis", "Strategic opportunities", "Competitive landscape"]
    },
    "sales-manager": {
      title: "Team-Focused (SM)",
      description: "AI optimized for team performance, forecast accuracy, and strategic insights. Focus on team metrics, market trends, and coaching opportunities.",
      icon: <BarChart3 className="w-4 h-4" />,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-950",
      keyAreas: ["Team performance", "Forecast accuracy", "Market trends", "Coaching insights"]
    },
    "customer-success": {
      title: "Retention-Focused (CSM)",
      description: "AI tailored for customer health, expansion opportunities, and renewal strategies. Focus on usage analytics, satisfaction signals, and growth potential.",
      icon: <Users className="w-4 h-4" />,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-950",
      keyAreas: ["Customer health monitoring", "Expansion opportunities", "Renewal strategies", "Satisfaction analysis"]
    }
  };
  
  return descriptions[role] || null;
};

// Helper functions for display names
const getDepartmentDisplayName = (department: string): string => {
  const departmentMap: Record<string, string> = {
    'sales': 'Sales',
    'business-development': 'Business Development',
    'customer-success': 'Customer Success',
    'marketing': 'Marketing',
    'partnerships': 'Partnerships'
  };
  return departmentMap[department] || department;
};

const getTerritoryDisplayName = (territory: string): string => {
  const territoryMap: Record<string, string> = {
    'north-america': 'North America',
    'europe': 'Europe',
    'asia-pacific': 'Asia Pacific',
    'global': 'Global'
  };
  return territoryMap[territory] || territory;
};

const getFocusDisplayName = (focus: string): string => {
  const focusMap: Record<string, string> = {
    'enterprise': 'Enterprise',
    'smb': 'SMB',
    'mid-market': 'Mid-Market',
    'startup': 'Startup'
  };
  return focusMap[focus] || focus;
};

export function RoleIntelligenceWidget({ 
  role, 
  department,
  territory,
  salesFocus,
  showFullDetails = false,
  className = "" 
}: RoleIntelligenceWidgetProps) {
  const roleInfo = getRoleDescription(role);
  
  if (!roleInfo) {
    return null;
  }

  if (!showFullDetails) {
    // Simple version for PersonalInfoPage
    return (
      <Card className={`${roleInfo.bgColor} border-slate-200 dark:border-slate-800 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`${roleInfo.color} bg-white dark:bg-gray-800 rounded-lg p-2 border flex-shrink-0`}>
              {roleInfo.icon}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${roleInfo.color} mb-1`}>
                {roleInfo.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {roleInfo.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full details version for ProfilePage
  return (
    <Card className={`bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-slate-200 dark:border-slate-800 ${className}`}>
      <CardContent className="p-6">
        {/* Role Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`${roleInfo.color} bg-white dark:bg-gray-800 rounded-lg p-2 border`}>
            {roleInfo.icon}
          </div>
          <div>
            <h3 className={`font-semibold text-lg ${roleInfo.color}`}>
              {roleInfo.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {department ? getDepartmentDisplayName(department) : 'Sales'}
              </Badge>
              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </div>

        {/* AI Configuration Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="font-medium text-slate-900 dark:text-slate-100">
              AI Intelligence Configuration
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            {roleInfo.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {roleInfo.keyAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Territory and Focus Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-muted-foreground">Territory</span>
            </div>
            <p className="text-sm font-medium">
              {territory ? getTerritoryDisplayName(territory) : 'Global'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-muted-foreground">Focus</span>
            </div>
            <p className="text-sm font-medium">
              {salesFocus ? getFocusDisplayName(salesFocus) : 'Enterprise'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 