import type { SalesContext } from '@/types/api';
import { ENDPOINTS } from '@/lib/config';

export interface ParsedUserInput {
  company?: string;
  salesContext?: SalesContext;
  additionalContext?: string;
  confidence: number;
  originalMessage: string;
}

interface LLMParseResult {
  company?: string;
  salesContext?: SalesContext;
  additionalContext?: string;
  confidence: number;
}

// Sales context keywords (fallback for regex parsing)
const SALES_CONTEXT_KEYWORDS = {
  discovery: ['discovery', 'initial', 'first meeting', 'introduction', 'getting to know', 'pain points', 'challenges'],
  competitive: ['competitive', 'competitor', 'competition', 'versus', 'vs', 'compare', 'battle card', 'positioning'],
  renewal: ['renewal', 'renew', 'contract', 'subscription', 'extending', 'continuing', 'retention'],
  demo: ['demo', 'demonstration', 'show', 'product tour', 'walkthrough', 'presentation', 'technical'],
  negotiation: ['negotiation', 'negotiate', 'pricing', 'contract', 'terms', 'budget', 'procurement'],
  closing: ['closing', 'close', 'final', 'decision', 'signature', 'implementation', 'next steps']
};

// Bedrock-based parsing function
async function parseWithBedrock(message: string): Promise<LLMParseResult> {
  const prompt = `Extract company information from this user input for sales intelligence purposes.

Input: "${message}"

Instructions:
- Extract company name or domain (e.g., "shopify.com", "Microsoft", "Tesla")
- Identify sales context if mentioned
- Return confidence score 0-1 based on clarity
- For domains like "shopify.com", return high confidence
- For company names, return the name as-is

Sales contexts: discovery, competitive, renewal, demo, negotiation, closing

Return ONLY valid JSON in this format:
{
  "company": "string or null",
  "salesContext": "string or null", 
  "additionalContext": "string or null",
  "confidence": number
}

Examples:
- "shopify.com" → {"company": "shopify.com", "salesContext": null, "additionalContext": null, "confidence": 0.95}
- "analyze Tesla for discovery call" → {"company": "Tesla", "salesContext": "discovery", "additionalContext": "discovery call", "confidence": 0.9}
- "Microsoft competitive analysis" → {"company": "Microsoft", "salesContext": "competitive", "additionalContext": "competitive analysis", "confidence": 0.85}`;

  try {
    // Use your existing Bedrock client/service
    // This should match the pattern used in your backend services
    const response = await fetch(ENDPOINTS.bedrockParse, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        message,
        maxTokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Bedrock API failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content || data.response;
    
    // Parse JSON from Bedrock response
    const parsed = JSON.parse(content);
    
    return {
      company: parsed.company || undefined,
      salesContext: parsed.salesContext as SalesContext || undefined,
      additionalContext: parsed.additionalContext || undefined,
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0))
    };
  } catch (error) {
    console.warn('Bedrock parsing failed, using fallback:', error);
    return parseWithFallback(message);
  }
}

// Fallback regex-based parsing (when Bedrock fails)
function parseWithFallback(message: string): LLMParseResult {
  const normalizedMessage = message.trim().toLowerCase();
  let company: string | undefined;
  let salesContext: SalesContext | undefined;
  let additionalContext: string | undefined;
  let confidence = 0;

  // Simple domain detection as fallback
  const domainMatch = message.match(/^([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,})$/);
  if (domainMatch) {
    company = domainMatch[1];
    confidence = 0.85;
  } else {
    // Look for capitalized words that might be company names
    const capitalizedWords = message.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    if (capitalizedWords && capitalizedWords.length > 0) {
      // Filter out common non-company words
      const filteredWords = capitalizedWords.filter(word => 
        !['I', 'AI', 'Analysis', 'Research', 'Intelligence', 'Report', 'Dashboard', 'Company', 'Business'].includes(word)
      );
      if (filteredWords.length > 0) {
        company = filteredWords[0];
        confidence = 0.6;
      }
    }
  }

  // Extract sales context using keywords
  for (const [context, keywords] of Object.entries(SALES_CONTEXT_KEYWORDS)) {
    if (keywords.some(keyword => normalizedMessage.includes(keyword))) {
      salesContext = context as SalesContext;
      confidence += 0.2;
      break;
    }
  }

  // Extract additional context
  if (normalizedMessage.includes('discovery')) {
    additionalContext = 'discovery call preparation';
  } else if (normalizedMessage.includes('competitive')) {
    additionalContext = 'competitive analysis';
  } else if (normalizedMessage.includes('renewal')) {
    additionalContext = 'renewal discussion';
  }

  return {
    company,
    salesContext,
    additionalContext,
    confidence: Math.min(confidence, 1.0)
  };
}

// Main parsing function - now uses Bedrock with fallback
export async function parseUserInput(message: string): Promise<ParsedUserInput> {
  try {
    const result = await parseWithBedrock(message);
    return {
      company: result.company,
      salesContext: result.salesContext,
      additionalContext: result.additionalContext,
      confidence: result.confidence,
      originalMessage: message
    };
  } catch (error) {
    console.warn('Falling back to regex parsing:', error);
    const result = parseWithFallback(message);
    return {
      company: result.company,
      salesContext: result.salesContext,
      additionalContext: result.additionalContext,
      confidence: result.confidence,
      originalMessage: message
    };
  }
}

// Legacy synchronous version for backward compatibility
export function parseUserInputSync(message: string): ParsedUserInput {
  const result = parseWithFallback(message);
  return {
    company: result.company,
    salesContext: result.salesContext,
    additionalContext: result.additionalContext,
    confidence: result.confidence,
    originalMessage: message
  };
}

// Generate suggestions based on input
export function generateSuggestions(input: string): string[] {
  const suggestions = [];
  
  if (input.length < 3) {
    return [
      'shopify.com',
      'analyze Tesla for discovery call',
      'Microsoft competitive analysis',
      'prepare for Salesforce renewal meeting'
    ];
  }

  // Domain suggestions
  if (input.includes('.')) {
    suggestions.push(`${input} analysis`, `${input} competitive intelligence`);
  }
  
  // Company name suggestions
  if (input.match(/^[A-Z][a-z]+/)) {
    suggestions.push(
      `${input} discovery call preparation`,
      `${input} competitive analysis`,
      `${input} renewal discussion`
    );
  }

  return suggestions.slice(0, 4);
}

// Helper function to extract user's company name from self-referential statements
export function extractUserCompany(message: string): string | undefined {
  // Patterns for extracting user company name
  const userCompanyPatterns = [
    /(?:our company is|we are|my company is|i work for|i'm from|i represent)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+and|\s+,|\s+\.|$)/i,
    /(?:we are|we're)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+and|\s+,|\s+competing|\s+looking|\s+want)/i,
    /(?:our company|my company)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+is|\s+wants|\s+needs|\s+,|\s+\.|\s+and|$)/i,
    /([A-Z][a-zA-Z\s&]+?)\s+is\s+(?:our company|my company)/i
  ];

  for (const pattern of userCompanyPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      let companyName = match[1].trim();
      
      // Clean up common suffixes/prefixes
      companyName = companyName.replace(/\s+(and|,|\.|\?|!).*$/, '');
      
      // Validate it's a reasonable company name
      if (companyName.length >= 2 && 
          !['the', 'a', 'an', 'and', 'or', 'but', 'we', 'us', 'our', 'my', 'i', 'me'].includes(companyName.toLowerCase())) {
        return companyName;
      }
    }
  }

  return undefined;
}

// Helper function to check if input is ready for API call
export function isInputReady(parsed: ParsedUserInput): boolean {
  return !!(parsed.company && parsed.confidence >= 0.4);
} 