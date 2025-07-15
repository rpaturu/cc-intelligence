// API Types for Sales Intelligence Platform
export type SalesContext = 
  | 'discovery' 
  | 'competitive' 
  | 'renewal' 
  | 'demo' 
  | 'negotiation' 
  | 'closing';

export interface SalesIntelligenceRequest {
  companyDomain: string;
  salesContext: SalesContext;
  meetingType?: string;
  additionalContext?: string;
  urgency?: 'low' | 'medium' | 'high';
}

// Interface for text content with citations
export interface TextWithCitations {
  text: string;
  citations: string[];
}

// Enhanced source credibility types
export type SourceType = 
  | 'official_company' 
  | 'news_tier1' 
  | 'news_tier2' 
  | 'financial_filing' 
  | 'industry_report' 
  | 'press_release' 
  | 'social_media' 
  | 'blog' 
  | 'unknown';

export type DomainAuthority = 'high' | 'medium' | 'low';

export interface EnhancedSource {
  url: string;
  title: string;
  domain: string;
  sourceType: SourceType;
  domainAuthority: DomainAuthority;
  authorityScore: number; // 0-100
  publicationDate?: string;
  credibilityScore: number; // 0-100
  relevanceScore: number; // 0-100
  excerpt?: string;
  author?: string;
  isVerified: boolean;
}

export interface SourcedClaim {
  claim: string;
  sources: EnhancedSource[];
  confidenceScore: number; // 0-100 based on source credibility
  claimId?: string; // Unique identifier for traceability
}

export interface NewsItem {
  title: string;
  summary: string;
  date: string;
  source: string;
  relevance: 'high' | 'medium' | 'low';
  // Enhanced with source metadata
  enhancedSource?: EnhancedSource;
}

export interface GrowthIndicators {
  hiring: boolean;
  hiringCitations?: string[];
  funding: boolean;
  fundingCitations?: string[];
  expansion: boolean;
  expansionCitations?: string[];
  newProducts: boolean;
  partnerships: boolean;
}

export interface CompanyInsights {
  name: string;
  size: string;
  sizeCitations?: string[];
  industry: string;
  revenue?: string;
  revenueCitations?: string[];
  recentNews: NewsItem[];
  growth: GrowthIndicators;
  challenges: string[];
  // Enhanced with sourced claims
  sourcedClaims?: SourcedClaim[];
}

export interface TechStack {
  current: string[];
  planned: string[];
  vendors: string[];
  modernizationAreas: string[];
}

export interface Contact {
  name: string;
  title: string;
  department: string;
  linkedin?: string;
  email?: string;
  influence: 'high' | 'medium' | 'low';
  approachStrategy: string;
}

export interface Competitor {
  name: string;
  strength: 'high' | 'medium' | 'low';
  marketShare?: string;
  advantages: string[];
  weaknesses: string[];
}

export interface BattleCard {
  competitor: string;
  keyMessages: string[];
  objectionHandling: string[];
  winStrategies: string[];
}

export interface CompetitiveIntel {
  competitors: Competitor[];
  marketPosition: string;
  differentiators: string[];
  vulnerabilities: string[];
  battleCards: BattleCard[];
}

export interface Objection {
  objection: string;
  response: string;
  supporting_data?: string;
  // Enhanced with source backing
  sources?: EnhancedSource[];
  confidenceScore?: number;
}

export interface SalesInsights {
  companyOverview: CompanyInsights;
  painPoints: TextWithCitations[]; // Updated to match API response
  technologyStack: TechStack;
  keyContacts: Contact[];
  competitiveLandscape: CompetitiveIntel;
  talkingPoints: TextWithCitations[]; // Updated to match API response
  potentialObjections: Objection[];
  recommendedActions: TextWithCitations[]; // Updated to match API response
  dealProbability: number;
  dealProbabilityCitations?: string[];
  // Enhanced with sourced claims for transparency
  sourcedClaims?: SourcedClaim[];
}

export interface ContentAnalysis {
  insights: SalesInsights;
  sources: string[]; // Legacy support
  enhancedSources?: EnhancedSource[]; // New enhanced sources
  confidenceScore: number;
  generatedAt: Date;
  cacheKey: string;
  totalSources?: number;
  citationMap?: Record<string, unknown>;
  // Enhanced with source credibility metadata
  sourceCredibilityScore?: number; // Overall credibility based on source quality
  verifiedSources?: number;
}

export interface SalesIntelligenceResponse extends ContentAnalysis {
  requestId: string;
  cached?: boolean;
}

export interface HealthCheckResponse {
  status: string;
  model: string;
  region: string;
  timestamp: string;
  requestId: string;
}

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  sourceDomain: string;
  relevanceScore?: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  error: string;
  message?: string;
  requestId: string;
  timestamp?: string;
} 