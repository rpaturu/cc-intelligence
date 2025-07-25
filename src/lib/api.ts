import type { 
  SalesIntelligenceRequest, 
  SalesIntelligenceResponse, 
  HealthCheckResponse, 
  SearchResponse, 
  ApiError,
  UserProfile 
} from '../types/api';
import { API_CONFIG } from './config';

class SalesIntelligenceApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse Date objects
    if (data.generatedAt) {
      data.generatedAt = new Date(data.generatedAt);
    }

    return data;
  }

  async generateIntelligence(request: SalesIntelligenceRequest): Promise<SalesIntelligenceResponse> {
    return this.makeRequest<SalesIntelligenceResponse>('/intelligence', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // New optimized endpoints
  async getCompanyOverview(domain: string): Promise<{
    name: string;
    industry: string;
    size: string;
    revenue: string;
    domain: string;
    sources: Array<{
      id: number;
      url: string;
      title: string;
      domain: string;
      sourceType: string;
      snippet: string;
      credibilityScore: number;
      lastUpdated: string;
    }>;
    requestId: string;
  }> {
    // Step 1: Start the async overview request
    const asyncResponse = await this.makeRequest<{
      requestId: string;
      status: string;
      message: string;
      statusCheckEndpoint: string;
    }>(`/company/${encodeURIComponent(domain)}/overview`);

    // Step 2: Poll for results
    return this.pollForAsyncResult<{
      name: string;
      industry: string;
      size: string;
      revenue: string;
      domain: string;
      sources: Array<{
        id: number;
        url: string;
        title: string;
        domain: string;
        sourceType: string;
        snippet: string;
        credibilityScore: number;
        lastUpdated: string;
      }>;
      requestId: string;
    }>(asyncResponse.requestId, 180000); // 3 minute timeout
  }

  private async pollForAsyncResult<T = unknown>(requestId: string, timeoutMs: number): Promise<T> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < timeoutMs) {
      try {
        const result = await this.makeRequest<{
          requestId: string;
          status: string;
          result?: T;
          error?: string;
        }>(`/requests/${requestId}`);

        if (result.status === 'completed' && result.result) {
          return result.result;
        }

        if (result.status === 'failed') {
          throw new Error(result.error || 'Request failed');
        }

        // Still processing, wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error('Error polling for async result:', error);
        throw error;
      }
    }

    throw new Error('Request timeout - processing took longer than 3 minutes. The orchestrator may still be working on this request.');
  }

  async getCompanySearch(domain: string): Promise<{
    queries: string[];
    results: Array<{
      results: Array<{
        url: string;
        title: string;
        snippet: string;
        sourceDomain: string;
      }>;
      totalResults: number;
      searchTime: number;
      query: string;
    }>;
    totalResults: number;
    searchTime: number;
    requestId: string;
  }> {
    return this.makeRequest(`/company/${encodeURIComponent(domain)}/search`);
  }

  async getCompanyAnalysis(domain: string, context: string, searchResults: unknown): Promise<SalesIntelligenceResponse> {
    // Step 1: Start the async analysis request
    const asyncResponse = await this.makeRequest<{
      requestId: string;
      status: string;
      message: string;
      statusCheckEndpoint: string;
    }>(`/company/${encodeURIComponent(domain)}/analysis`, {
      method: 'POST',
      body: JSON.stringify({
        context,
        searchResults
      }),
    });

    // Step 2: Poll for results
    return this.pollForAsyncResult<SalesIntelligenceResponse>(asyncResponse.requestId, 180000); // 3 minute timeout
  }

  async getDiscoveryInsights(domain: string): Promise<{
    painPoints: string[];
    opportunities: string[];
    keyContacts: string[];
    technologyStack: string[];
    sources: Array<{
      id: number;
      url: string;
      title: string;
      domain: string;
      sourceType: string;
      snippet: string;
      credibilityScore: number;
      lastUpdated: string;
    }>;
    requestId: string;
  }> {
    // Step 1: Start the async discovery request
    const asyncResponse = await this.makeRequest<{
      requestId: string;
      status: string;
      message: string;
      statusCheckEndpoint: string;
    }>(`/company/${encodeURIComponent(domain)}/discovery`);

    // Step 2: Poll for results
    return this.pollForAsyncResult<{
      painPoints: string[];
      opportunities: string[];
      keyContacts: string[];
      technologyStack: string[];
      sources: Array<{
        id: number;
        url: string;
        title: string;
        domain: string;
        sourceType: string;
        snippet: string;
        credibilityScore: number;
        lastUpdated: string;
      }>;
      requestId: string;
    }>(asyncResponse.requestId, 180000); // 3 minute timeout
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    return this.makeRequest<HealthCheckResponse>('/health');
  }

  async search(query: string, maxResults: number = 5): Promise<SearchResponse> {
    return this.makeRequest<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify({ query, maxResults }),
    });
  }

  // Company Lookup APIs - Dynamic data for onboarding
  async lookupCompanies(query: string, limit: number = 5): Promise<{
    companies: Array<{
      name: string;
      domain?: string;        // ENHANCED: Now includes domain from trusted sources
      description?: string;
      industry?: string;
      sources?: string[];     // ENHANCED: Source credibility tracking
    }>;
    total: number;
    query: string;
    cached: boolean;
  }> {
    const params = new URLSearchParams({ query, limit: limit.toString() });
    return this.makeRequest(`/companies/lookup?${params}`);
  }

  // REMOVED: enrichCompany, suggestDomain, suggestProducts, findCompetitors
  // These endpoints were removed in the ultra-clean backend
  // Use vendorContext() and customerIntelligence() for context-aware intelligence instead

  // Profile management methods
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await this.makeRequest<{ profile: UserProfile }>(`/profile/${encodeURIComponent(userId)}`);
      return response.profile;
    } catch (error: unknown) {
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('Profile not found'))) {
        return null; // Profile not found
      }
      throw error;
    }
  }

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const response = await this.makeRequest<{ profile: UserProfile }>(`/profile/${encodeURIComponent(profile.userId)}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    return response.profile;
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.makeRequest<{ message: string }>(`/profile/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
  }

  // Helper function to create empty profile for new users
  async createEmptyProfile(userId: string): Promise<UserProfile> {
    const emptyProfile: UserProfile = {
      userId,
      name: '', // Empty - user will fill during onboarding
      role: '', // Empty - user will fill during onboarding  
      company: '', // Empty - user will fill during onboarding
      industry: '', // Empty initially
      primaryProducts: [], // Empty initially - will be populated dynamically
      keyValueProps: [], // Empty initially
      mainCompetitors: [], // Empty initially - will be populated dynamically
      targetIndustries: [], // Empty initially
      salesFocus: 'enterprise', // Default value
      defaultResearchContext: 'discovery', // Default value
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = await this.makeRequest<{ profile: UserProfile }>(`/profile/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      body: JSON.stringify(emptyProfile),
    });

    return response.profile;
  }

  // Context-Aware Intelligence APIs - Ultra-Clean Backend
  async vendorContext(companyName: string, context?: any): Promise<{
    success: boolean;
    companyName: string;
    vendorContext: {
      companyName: string;
      industry?: string;
      products?: string[];
      targetMarkets?: string[];
      competitors?: string[];
      valuePropositions?: string[];
      positioningStrategy?: string;
      pricingModel?: string;
      lastUpdated: string;
    };
    metadata: {
      requestId: string;
      timestamp: string;
      fromCache: boolean;
      processingTimeMs: number;
      datasetsCollected: number;
      totalCost: number;
    };
  }> {
    return this.makeRequest('/vendor/context', {
      method: 'POST',
      body: JSON.stringify({ companyName, context })
    });
  }

  async customerIntelligence(prospectCompany: string, vendorCompany?: string): Promise<{
    success: boolean;
    prospectCompany: string;
    vendorCompany?: string;
    customerIntelligence: {
      companyOverview: {
        name: string;
        industry?: string;
        size?: string;
        description?: string;
      };
      contextualInsights: {
        relevantDecisionMakers?: string[];
        techStackRelevance?: string[];
        businessChallenges?: string[];
        buyingSignals?: string[];
        competitiveUsage?: string[];
        growthIndicators?: string[];
      };
      positioningGuidance: {
        recommendedApproach?: string;
        keyValueProps?: string[];
        potentialPainPoints?: string[];
        bestContactStrategy?: string;
      };
    };
    metadata: {
      requestId: string;
      timestamp: string;
      fromCache: boolean;
      processingTimeMs: number;
    };
  }> {
    const payload: any = { prospectCompany };
    if (vendorCompany) {
      payload.vendorCompany = vendorCompany;
    }
    return this.makeRequest('/customer/intelligence', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

// Create and export a singleton instance
const apiClient = new SalesIntelligenceApiClient(
  API_CONFIG.baseUrl,
  API_CONFIG.apiKey
);

export default apiClient;

// Export individual methods with proper binding to preserve 'this' context
export const generateIntelligence = apiClient.generateIntelligence.bind(apiClient);
export const getCompanyOverview = apiClient.getCompanyOverview.bind(apiClient);
export const getCompanySearch = apiClient.getCompanySearch.bind(apiClient);
export const getCompanyAnalysis = apiClient.getCompanyAnalysis.bind(apiClient);
export const getDiscoveryInsights = apiClient.getDiscoveryInsights.bind(apiClient);
export const healthCheck = apiClient.healthCheck.bind(apiClient);
export const search = apiClient.search.bind(apiClient);

// Company Lookup methods - Ultra-Clean API  
export const lookupCompanies = apiClient.lookupCompanies.bind(apiClient);

// Context-Aware Intelligence - Ultra-Clean API
export const vendorContext = apiClient.vendorContext.bind(apiClient);
export const customerIntelligence = apiClient.customerIntelligence.bind(apiClient);

// Legacy aliases for backward compatibility
export const enrichVendor = apiClient.vendorContext.bind(apiClient);
export const getCustomerIntelligence = apiClient.customerIntelligence.bind(apiClient);

// Profile management methods
export const getProfile = apiClient.getProfile.bind(apiClient);
export const saveProfile = apiClient.saveProfile.bind(apiClient);
export const deleteProfile = apiClient.deleteProfile.bind(apiClient);
export const createEmptyProfile = apiClient.createEmptyProfile.bind(apiClient);

// Export types for convenience
export type { 
  SalesIntelligenceRequest, 
  SalesIntelligenceResponse, 
  HealthCheckResponse,
  SearchResponse,
  UserProfile 
} from '../types/api'; 