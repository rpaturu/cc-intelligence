import { ResearchArea } from "../../../types/research";

export const getResearchAreas = (company: string, role: string, userCompanyName?: string): { intro: string; options: ResearchArea[] } => {
  const baseAreas: ResearchArea[] = [
    { id: "company_overview", text: "Company overview and profile", iconName: "building", category: "research" },
    { id: "decision_makers", text: "Key contacts and decision makers", iconName: "users", category: "research" },
    { id: "tech_stack", text: "Current technology usage and preferences", iconName: "zap", category: "research" },
    { id: "business_challenges", text: "Pain points and operational challenges", iconName: "target", category: "research" },
    { id: "competitive_positioning", text: "Competitive landscape analysis", iconName: "swords", category: "research" },
    { id: "competitive_positioning_value_props", text: "Competitive positioning & value propositions", iconName: "target", category: "research" },
    { id: "recent_activities", text: "News, hiring, expansion signals", iconName: "activity", category: "research" },
    { id: "budget_indicators", text: "Financial health and spending signals", iconName: "dollar-sign", category: "research" },
    { id: "buying_signals", text: "Intent data and purchase indicators", iconName: "trending-up", category: "research" },
    { id: "competitive_usage", text: "Current vendor relationships", iconName: "briefcase", category: "research" },
    { id: "digital_footprint", text: "Online presence and marketing activity", iconName: "globe", category: "research" },
    { id: "growth_signals", text: "Expansion and scaling indicators", iconName: "bar-chart", category: "research" },
    { id: "compliance_requirements", text: "Regulatory and security needs", iconName: "shield", category: "research" },
    { id: "integration_needs", text: "Technical integration requirements", iconName: "link", category: "research" }
  ];

  const roleIntros = {
    "Account Manager": `I see you're a ${userCompanyName} AE. Here are key research areas for ${company}:`,
    "Solutions Engineer": `I see you're a ${userCompanyName} SE. Here are technical research areas for ${company}:`,
    "Customer Success Executive": `I see you're a ${userCompanyName} CSE. Here are success-focused research areas for ${company}:`
  };

  const finTechCompanies = [
    "acme corp", "acme", "stripe", "square", "paypal", "robinhood", 
    "coinbase", "plaid", "chime", "lending club", "sofi", "affirm",
    "klarna", "nubank", "revolut", "transferwise", "wise", "brex",
    "marqeta", "adyen", "checkout.com", "rapyd"
  ];

  const isFinTechCompany = finTechCompanies.some(fintech => 
    company.toLowerCase().includes(fintech)
  );

  const isOktaUser = userCompanyName?.toLowerCase().includes("okta");

  if (isOktaUser && isFinTechCompany) {
    return {
      intro: `I see you're an Okta AE researching a FinTech company. Here are key research areas for ${company}:`,
      options: baseAreas
    };
  }

  return {
    intro: roleIntros[role as keyof typeof roleIntros] || roleIntros["Account Manager"],
    options: baseAreas
  };
};
