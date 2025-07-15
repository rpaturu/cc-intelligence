/**
 * Frontend Configuration
 * Centralizes all environment-specific settings
 */

// Get environment variables with optional fallbacks
const getEnvVar = (name: string, fallback?: string): string => {
  const value = import.meta.env[name];
  if (!value && !fallback) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value || fallback!;
};

// API Configuration
export const API_CONFIG = {
  // Main API Gateway URL
  baseUrl: getEnvVar('VITE_API_BASE_URL'),
  
  // API Key for authenticated endpoints
  apiKey: getEnvVar('VITE_API_KEY'),
  
  // Request timeout
  timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000')),
};

// Application Configuration
export const APP_CONFIG = {
  // Environment
  environment: getEnvVar('VITE_NODE_ENV', 'development'),
  
  // Feature flags
  enableBedrock: getEnvVar('VITE_ENABLE_BEDROCK', 'true') === 'true',
  enableCaching: getEnvVar('VITE_ENABLE_CACHING', 'true') === 'true',
  
  // Debug mode
  debug: getEnvVar('VITE_DEBUG', 'false') === 'true',
};

// Endpoint URLs
export const ENDPOINTS = {
  health: `${API_CONFIG.baseUrl}/health`,
  intelligence: `${API_CONFIG.baseUrl}/intelligence`,
  companyOverview: (domain: string) => `${API_CONFIG.baseUrl}/company/${domain}/overview`,
  companySearch: (domain: string) => `${API_CONFIG.baseUrl}/company/${domain}/search`,
  companyAnalysis: (domain: string) => `${API_CONFIG.baseUrl}/company/${domain}/analysis`,
  discoveryInsights: (domain: string) => `${API_CONFIG.baseUrl}/company/${domain}/discovery`,
  bedrockParse: `${API_CONFIG.baseUrl}/api/bedrock-parse`,
};

// Export commonly used values
export const { baseUrl: API_BASE_URL, apiKey: API_KEY } = API_CONFIG;
export const { environment: NODE_ENV, debug: DEBUG_MODE } = APP_CONFIG;

// Utility function to check if we're in development
export const isDevelopment = () => NODE_ENV === 'development';
export const isProduction = () => NODE_ENV === 'production'; 