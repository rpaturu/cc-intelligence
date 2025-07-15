import type { 
  SalesIntelligenceRequest, 
  SalesIntelligenceResponse, 
  HealthCheckResponse, 
  SearchResponse, 
  ApiError 
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
    return this.makeRequest(`/company/${encodeURIComponent(domain)}/overview`);
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
    return this.makeRequest(`/company/${encodeURIComponent(domain)}/analysis`, {
      method: 'POST',
      body: JSON.stringify({
        context,
        searchResults
      }),
    });
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
    return this.makeRequest(`/company/${encodeURIComponent(domain)}/discovery`);
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

// Export types for convenience
export type { 
  SalesIntelligenceRequest, 
  SalesIntelligenceResponse, 
  HealthCheckResponse,
  SearchResponse 
} from '../types/api'; 