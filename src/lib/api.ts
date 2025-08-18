import type { 
  SalesIntelligenceRequest, 
  SalesIntelligenceResponse, 
  HealthCheckResponse, 
  SearchResponse, 
  ApiError,
  UserProfile 
} from '../types/api';
import { API_CONFIG } from './config';
import { sessionService } from '../services/SessionService';
import { getApiHeaders } from '../utils/apiHeaders';

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
    
    console.log('API Request:', { url, method: options.method || 'GET' });
    
    // Use the centralized apiHeaders utility (auto-detects userId and sessionId)
    const baseHeaders = getApiHeaders({
      contentType: 'application/json',
      includeSession: true,
    });
    
    const headers = {
      ...baseHeaders,
      'X-API-Key': this.apiKey,
      ...(options.headers as Record<string, string>),
    };
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      // Handle session expiration
      if (response.status === 401) {
        console.log('Session expired, handling logout');
        await sessionService.handleSessionExpiration();
        // Let the error propagate so components can handle redirect to login
      }
      
      const errorData: ApiError = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
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

  private async pollForAsyncResult<T = unknown>(requestId: string, timeoutMs: number, endpointType: 'requests' | 'workflows' = 'requests'): Promise<T> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < timeoutMs) {
      try {
        const result = await this.makeRequest<{
          requestId: string;
          status: string;
          result?: T;
          error?: string;
          output?: string;
          cause?: string;
        }>(`/${endpointType}/${requestId}/status`);

        // Check for Step Functions workflow completion
        if (result.status === 'SUCCEEDED' || result.status === 'completed') {
          // For Step Functions, the result might be in the output field
          if (result.output) {
            try {
              const parsedOutput = JSON.parse(result.output);
              return parsedOutput as T;
            } catch {
              return result.output as T;
            }
          }
          // If no output, return the entire result
          return result as T;
        }

        // Check for Step Functions workflow failure
        if (result.status === 'FAILED' || result.status === 'failed') {
          throw new Error(result.error || result.cause || 'Workflow failed');
        }

        // Check for Step Functions workflow termination
        if (result.status === 'ABORTED' || result.status === 'TIMED_OUT') {
          throw new Error(`Workflow ${result.status.toLowerCase()}`);
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
    message: string;
    data: {
    companies: Array<{
      name: string;
      domain?: string;        // ENHANCED: Now includes domain from trusted sources
      description?: string;
      industry?: string;      // ENHANCED: Industry data from Google Knowledge Graph
      location?: string;      // ENHANCED: Company headquarters location
      employees?: string;     // ENHANCED: Employee count with year
      size?: string;          // ENHANCED: Company size/revenue information
      founded?: string;       // ENHANCED: Founding year
      headquarters?: string;  // ENHANCED: Detailed headquarters address
      sources?: string[];     // ENHANCED: Source credibility tracking
    }>;
    total: number;
    query: string;
    cached: boolean;
      generatedAt: string;
    };
    requestId: string;
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
      const response = await this.makeRequest<{ profile: UserProfile }>(`/profile/${encodeURIComponent(userId)}`, {
        method: 'GET',
      });
      return response.profile;
    } catch (error) {
      // Handle 404 specifically for profile not found
      if (error instanceof Error && error.message.includes('404')) {
        return null;
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
      firstName: '', // Empty - user will fill during onboarding
      lastName: '', // Empty - user will fill during onboarding
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

  // Helper function to create profile with signup data
  async createProfileWithSignupData(userId: string, firstName: string, lastName: string, email: string): Promise<UserProfile> {
    const profileWithSignupData: UserProfile = {
      userId,
      firstName, // Pre-filled from signup
      lastName, // Pre-filled from signup
      email, // Pre-filled from signup
      role: '', // Still empty - user will fill during onboarding  
      company: '', // Still empty - user will fill during onboarding
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
      body: JSON.stringify(profileWithSignupData),
    });

    return response.profile;
  }

  // Helper function to update existing profile with signup data
  async updateProfileWithSignupData(userId: string, firstName: string, lastName: string, email: string): Promise<UserProfile> {
    // First get the existing profile
    const existingProfile = await this.getProfile(userId)
    if (!existingProfile) {
      throw new Error('Profile not found')
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      firstName, // Update with signup data
      lastName, // Update with signup data
      email, // Update with signup data
    }

    const response = await this.makeRequest<{ profile: UserProfile }>(`/profile/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProfile),
    })

    return response.profile
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
      companySize?: string;
      marketPresence?: string;
      recentNews?: string[];
      keyExecutives?: string[];
      businessChallenges?: string[];
      growthIndicators?: string[];
      techStack?: string[];
      partnerships?: string[];
      lastUpdated: string;
      dataQuality?: {
        completeness: number;
        freshness: number;
        reliability: number;
        overall: number;
      };
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
    const response = await this.makeRequest<{
      status: string;
      data?: any;
      analysis?: any;
      cached?: boolean;
      generatedAt?: string;
      requestId: string;
      statusEndpoint?: string;
      workflow?: any;
      metrics?: any;
    }>('/vendor/context', {
      method: 'POST',
      body: JSON.stringify({ companyName, context })
    });

    // Handle immediate cache hit response (200)
    if (response.status === 'completed' && response.data) {
      const analysis = response.data.analysis || response.analysis || {};
      
      return {
        success: true,
        companyName,
        vendorContext: {
          companyName,
          industry: analysis.industry_focus || analysis.industry || analysis.companyIndustry,
          products: analysis.product_portfolio || analysis.products || analysis.primaryProducts || [],
          targetMarkets: analysis.target_markets || analysis.targetMarkets || analysis.targetIndustries || [],
          competitors: analysis.competitive_landscape || analysis.competitors || analysis.mainCompetitors || [],
          valuePropositions: analysis.value_propositions || analysis.valuePropositions || analysis.keyValueProps || [],
          positioningStrategy: analysis.positioning_strategy || analysis.positioningStrategy || '',
          pricingModel: analysis.pricing_model || analysis.pricingModel || '',
          companySize: analysis.companySize || '',
          marketPresence: analysis.marketPresence || '',
          recentNews: analysis.recentNews || [],
          keyExecutives: analysis.keyExecutives || [],
          businessChallenges: analysis.businessChallenges || [],
          growthIndicators: analysis.growthIndicators || [],
          techStack: analysis.techStack || [],
          partnerships: analysis.partnerships || [],
          lastUpdated: analysis.last_updated || response.generatedAt || new Date().toISOString(),
          dataQuality: analysis.data_quality || null
        },
        metadata: {
          requestId: response.requestId,
          timestamp: response.generatedAt || new Date().toISOString(),
          fromCache: response.cached || false,
          processingTimeMs: response.metrics?.processingTimeMs || 0,
          datasetsCollected: response.metrics?.datasetsCollected || 0,
          totalCost: response.metrics?.totalCost || 0
        }
      };
    }

    // Handle async processing response (202)
    if (response.statusEndpoint && response.workflow) {
      // Use workflows endpoint for Step Functions-based async operations
      const polledResult = await this.pollForAsyncResult<{
        status: string;
        data?: any;
        analysis?: any;
        cached?: boolean;
        generatedAt?: string;
        requestId: string;
        metrics?: any;
      }>(response.requestId, 180000, 'workflows'); // 3 minute timeout, use workflows endpoint

      // Process the polled result same as immediate response
      const analysis = polledResult.data?.analysis || polledResult.analysis || {};
      
      return {
        success: true,
        companyName,
        vendorContext: {
          companyName,
          industry: analysis.industry_focus || analysis.industry || analysis.companyIndustry || '',
          products: analysis.product_portfolio || analysis.products || analysis.primaryProducts || [],
          targetMarkets: analysis.target_markets || analysis.targetMarkets || analysis.targetIndustries || [],
          competitors: analysis.competitive_landscape || analysis.competitors || analysis.mainCompetitors || [],
          valuePropositions: analysis.value_propositions || analysis.valuePropositions || analysis.keyValueProps || [],
          positioningStrategy: analysis.positioning_strategy || analysis.positioningStrategy || '',
          pricingModel: analysis.pricing_model || analysis.pricingModel || '',
          companySize: analysis.companySize || '',
          marketPresence: analysis.marketPresence || '',
          recentNews: analysis.recentNews || [],
          keyExecutives: analysis.keyExecutives || [],
          businessChallenges: analysis.businessChallenges || [],
          growthIndicators: analysis.growthIndicators || [],
          techStack: analysis.techStack || [],
          partnerships: analysis.partnerships || [],
          lastUpdated: analysis.last_updated || polledResult.generatedAt || new Date().toISOString(),
          dataQuality: analysis.data_quality || null
        },
        metadata: {
          requestId: response.requestId,
          timestamp: polledResult.generatedAt || new Date().toISOString(),
          fromCache: polledResult.cached || false,
          processingTimeMs: polledResult.metrics?.processingTimeMs || 0,
          datasetsCollected: polledResult.metrics?.datasetsCollected || 0,
          totalCost: polledResult.metrics?.totalCost || 0
        }
      };
    }

    // Fallback for unexpected response format
    throw new Error(`Unexpected vendor context response format: ${JSON.stringify(response)}`);
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

    const response = await this.makeRequest<{
      status: string;
      data?: any;
      analysis?: any;
      cached?: boolean;
      generatedAt?: string;
      requestId: string;
      statusEndpoint?: string;
      workflow?: any;
      metrics?: any;
    }>('/customer/intelligence', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Handle immediate cache hit response (200)
    if (response.status === 'completed' && response.data) {
      const analysis = response.data.analysis || response.analysis || {};
      
      return {
        success: true,
        prospectCompany,
        vendorCompany,
        customerIntelligence: {
          companyOverview: {
            name: prospectCompany,
            industry: analysis.industry || analysis.companyIndustry || '',
            size: analysis.companySize || '',
            description: analysis.description || ''
          },
          contextualInsights: {
            relevantDecisionMakers: analysis.relevantDecisionMakers || [],
            techStackRelevance: analysis.techStackRelevance || [],
            businessChallenges: analysis.businessChallenges || [],
            buyingSignals: analysis.buyingSignals || [],
            competitiveUsage: analysis.competitiveUsage || [],
            growthIndicators: analysis.growthIndicators || []
          },
          positioningGuidance: {
            recommendedApproach: analysis.recommendedApproach || '',
            keyValueProps: analysis.keyValueProps || [],
            potentialPainPoints: analysis.potentialPainPoints || [],
            bestContactStrategy: analysis.bestContactStrategy || ''
          }
        },
        metadata: {
          requestId: response.requestId,
          timestamp: response.generatedAt || new Date().toISOString(),
          fromCache: response.cached || false,
          processingTimeMs: response.metrics?.processingTimeMs || 0
        }
      };
    }

    // Handle async processing response (202) - use workflows endpoint for Step Functions
    if (response.statusEndpoint && response.workflow) {
      const polledResult = await this.pollForAsyncResult<{
        status: string;
        data?: any;
        analysis?: any;
        cached?: boolean;
        generatedAt?: string;
        requestId: string;
        metrics?: any;
      }>(response.requestId, 180000, 'workflows'); // Use workflows endpoint for Step Functions

      const analysis = polledResult.data?.analysis || polledResult.analysis || {};
      
      return {
        success: true,
        prospectCompany,
        vendorCompany,
        customerIntelligence: {
          companyOverview: {
            name: prospectCompany,
            industry: analysis.industry || analysis.companyIndustry || '',
            size: analysis.companySize || '',
            description: analysis.description || ''
          },
          contextualInsights: {
            relevantDecisionMakers: analysis.relevantDecisionMakers || [],
            techStackRelevance: analysis.techStackRelevance || [],
            businessChallenges: analysis.businessChallenges || [],
            buyingSignals: analysis.buyingSignals || [],
            competitiveUsage: analysis.competitiveUsage || [],
            growthIndicators: analysis.growthIndicators || []
          },
          positioningGuidance: {
            recommendedApproach: analysis.recommendedApproach || '',
            keyValueProps: analysis.keyValueProps || [],
            potentialPainPoints: analysis.potentialPainPoints || [],
            bestContactStrategy: analysis.bestContactStrategy || ''
          }
        },
        metadata: {
          requestId: response.requestId,
          timestamp: polledResult.generatedAt || new Date().toISOString(),
          fromCache: polledResult.cached || false,
          processingTimeMs: polledResult.metrics?.processingTimeMs || 0
        }
      };
    }

    // Fallback for unexpected response format
    throw new Error(`Unexpected customer intelligence response format: ${JSON.stringify(response)}`);
  }

  /**
   * Research History API Methods
   */

  /**
   * Get all researched companies for the current user (GDPR-compliant)
   */
  async getResearchHistory(): Promise<{
    companies: Array<{
      company: string;
      lastUpdated: string;
      completedAreas: number;
      lastActivity?: string;
    }>;
  }> {
    console.log('getResearchHistory - using legacy endpoint');
    
    // Use legacy endpoint that works perfectly
    const endpoint = `/api/research-history/companies`;
    
    return this.makeRequest(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Get research data for a specific company (GDPR-compliant)
   */
  async getCompanyResearch(companyName: string): Promise<{
    success: boolean;
    data: {
      userHash: string;
      userId: string;
      company: string;
      lastUpdated: string;
      messages: Array<{
        id: string;
        type: 'user' | 'assistant';
        content: string;
        timestamp: string;
        companySummary?: any;
        options?: any;
      }>;
      completedResearch: Array<{
        id: string;
        areaId: string;
        title: string;
        status: 'completed' | 'in_progress';
        completedAt?: string;
        data?: any;
      }>;
      metadata?: {
        userRole?: string;
        userCompany?: string;
        lastActivity?: string;
        gdprConsentVersion?: string;
      };
    };
  }> {
    console.log('getCompanyResearch - using legacy endpoint');
    
    // Use legacy endpoint that works perfectly
    const endpoint = `/api/research-history/companies/${encodeURIComponent(companyName)}`;
    
    return this.makeRequest(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Save/update research data for a company (GDPR-compliant)
   */
  async saveCompanyResearch(companyName: string, data: {
    messages?: Array<{
      id: string;
      type: 'user' | 'assistant';
      content: string;
      timestamp: string;
      companySummary?: any;
      options?: any;
    }>;
    completedResearch?: Array<{
      id: string;
      areaId: string;
      title: string;
      status: 'completed' | 'in_progress';
      completedAt?: string;
      data?: any;
    }>;
    metadata?: {
      userRole?: string;
      userCompany?: string;
      lastActivity?: string;
    };
  }): Promise<{
    message: string;
  }> {
    console.log('saveCompanyResearch - using legacy endpoint');
    
    // Use legacy endpoint that works perfectly
    const endpoint = `/api/research-history/companies/${encodeURIComponent(companyName)}`;
    
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete research data for a company (GDPR Right to Erasure)
   */
  async deleteCompanyResearch(companyName: string): Promise<{
    message: string;
  }> {
    console.log('deleteCompanyResearch - using legacy endpoint');
    
    // Use legacy endpoint that works perfectly
    const endpoint = `/api/research-history/companies/${encodeURIComponent(companyName)}`;
    
    return this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * GDPR Right to Erasure: Delete all user data
   */
  async deleteAllUserData(): Promise<{
    message: string;
  }> {
    console.log('deleteAllUserData - using research history endpoint');
    
    // Use research history endpoint for data deletion
    const endpoint = `/api/research-history/all-data`;
    
    return this.makeRequest(endpoint, {
      method: 'DELETE',
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
export const createProfileWithSignupData = apiClient.createProfileWithSignupData.bind(apiClient);
export const updateProfileWithSignupData = apiClient.updateProfileWithSignupData.bind(apiClient);

// Research History API methods
export const getResearchHistory = apiClient.getResearchHistory.bind(apiClient);
export const getCompanyResearch = apiClient.getCompanyResearch.bind(apiClient);
export const saveCompanyResearch = apiClient.saveCompanyResearch.bind(apiClient);
export const deleteCompanyResearch = apiClient.deleteCompanyResearch.bind(apiClient);
export const deleteAllUserData = apiClient.deleteAllUserData.bind(apiClient);

// Export types for convenience
export type { 
  SalesIntelligenceRequest, 
  SalesIntelligenceResponse, 
  HealthCheckResponse,
  SearchResponse,
  UserProfile 
} from '../types/api'; 