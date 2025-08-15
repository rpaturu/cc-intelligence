export const parseCompanyFromInput = (input: string): string => {
  const patterns = [
    /research\s+(.+)/i,
    /analyze\s+(.+)/i,
    /tell me about\s+(.+)/i,
    /lookup\s+(.+)/i,
    /find\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return input.trim();
};

export const isResearchQuery = (input: string): boolean => {
  const researchKeywords = [
    'research',
    'analyze',
    'tell me about',
    'lookup',
    'find',
    'investigate',
  ];
  const lowerInput = input.toLowerCase();
  return (
    researchKeywords.some((keyword) => lowerInput.includes(keyword)) ||
    lowerInput.length > 2
  );
};


