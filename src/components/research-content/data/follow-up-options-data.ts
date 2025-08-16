import { FollowUpOption } from "../../../types/research";

export const getFollowUpOptions = (researchArea: string): FollowUpOption[] => {
  const followUpOptions: Record<string, FollowUpOption[]> = {
    "decision_makers": [
      { id: "tech_stack", text: "Research their tech stack", iconName: "zap", category: "research" },
      { id: "business_challenges", text: "Identify pain points", iconName: "target", category: "research" },
      { id: "create_outreach", text: "Create personalized outreach", iconName: "message-square", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "tech_stack": [
      { id: "integration_needs", text: "Analyze integration needs", iconName: "link", category: "research" },
      { id: "competitive_positioning", text: "Check competitive positioning", iconName: "swords", category: "research" },
      { id: "create_demo", text: "Prepare technical demo", iconName: "eye", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "business_challenges": [
      { id: "buying_signals", text: "Look for buying signals", iconName: "trending-up", category: "research" },
      { id: "competitive_positioning", text: "Build competitive strategy", iconName: "swords", category: "research" },
      { id: "create_pitch", text: "Build solution pitch", iconName: "message-square", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "competitive_positioning": [
      { id: "competitive_positioning_value_props", text: "Analyze value propositions", iconName: "target", category: "research" },
      { id: "decision_makers", text: "Find decision makers", iconName: "users", category: "research" },
      { id: "business_challenges", text: "Identify pain points", iconName: "target", category: "research" },
      { id: "create_battlecard", text: "Create competitive battle card", iconName: "file-check", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "competitive_positioning_value_props": [
      { id: "competitive_positioning", text: "View competitive landscape", iconName: "swords", category: "research" },
      { id: "decision_makers", text: "Find decision makers", iconName: "users", category: "research" },
      { id: "business_challenges", text: "Identify pain points", iconName: "target", category: "research" },
      { id: "create_battlecard", text: "Create competitive battle card", iconName: "file-check", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "recent_activities": [
      { id: "buying_signals", text: "Analyze buying signals", iconName: "trending-up", category: "research" },
      { id: "decision_makers", text: "Find key contacts", iconName: "users", category: "research" },
      { id: "schedule_meeting", text: "Schedule discovery call", iconName: "calendar", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "budget_indicators": [
      { id: "buying_signals", text: "Find purchase intent", iconName: "trending-up", category: "research" },
      { id: "decision_makers", text: "Identify budget holders", iconName: "users", category: "research" },
      { id: "create_proposal", text: "Create pricing proposal", iconName: "file-check", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "buying_signals": [
      { id: "decision_makers", text: "Contact decision makers", iconName: "users", category: "research" },
      { id: "competitive_positioning", text: "Review competitive positioning", iconName: "swords", category: "research" },
      { id: "schedule_demo", text: "Schedule product demo", iconName: "calendar", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "competitive_usage": [
      { id: "competitive_positioning", text: "Analyze competitive positioning", iconName: "swords", category: "research" },
      { id: "integration_needs", text: "Check integration requirements", iconName: "link", category: "research" },
      { id: "create_replacement_strategy", text: "Build replacement strategy", iconName: "file-check", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "digital_footprint": [
      { id: "growth_signals", text: "Identify growth signals", iconName: "bar-chart", category: "research" },
      { id: "buying_signals", text: "Look for buying signals", iconName: "trending-up", category: "research" },
      { id: "create_social_outreach", text: "Plan social engagement", iconName: "message-square", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "growth_signals": [
      { id: "decision_makers", text: "Find hiring managers", iconName: "users", category: "research" },
      { id: "compliance_requirements", text: "Check compliance needs", iconName: "shield", category: "research" },
      { id: "create_expansion_pitch", text: "Create growth pitch", iconName: "message-square", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "compliance_requirements": [
      { id: "tech_stack", text: "Review current security stack", iconName: "zap", category: "research" },
      { id: "integration_needs", text: "Analyze compliance integrations", iconName: "link", category: "research" },
      { id: "create_compliance_roadmap", text: "Build compliance roadmap", iconName: "file-check", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ],
    "integration_needs": [
      { id: "tech_stack", text: "Deep dive into tech stack", iconName: "zap", category: "research" },
      { id: "competitive_usage", text: "Review current vendors", iconName: "briefcase", category: "research" },
      { id: "create_integration_plan", text: "Create integration plan", iconName: "file-check", category: "action" },
      { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" }
    ]
  };

  return followUpOptions[researchArea] || [
    { id: "export_report", text: "View Full Report", iconName: "eye", category: "action" },
    { id: "schedule_followup", text: "Schedule follow-up", iconName: "calendar", category: "action" },
    { id: "research_another", text: "Research another company", iconName: "search", category: "explore" }
  ];
};
