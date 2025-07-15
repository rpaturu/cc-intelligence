import { useState } from 'react';
import { 
  Brain, 
  Search, 
  Loader, 
  AlertCircle, 
  CheckCircle,
  Building,
  Users,
  Target,
  MessageSquare,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { generateIntelligence } from '../lib/api';
import type { SalesIntelligenceRequest, SalesIntelligenceResponse } from '../lib/api';
import type { SalesContext } from '../types/api';

export function IntelligencePage() {
  const [request, setRequest] = useState<SalesIntelligenceRequest>({
    companyDomain: '',
    salesContext: 'discovery',
    additionalContext: '',
  });
  const [response, setResponse] = useState<SalesIntelligenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const salesContexts: { value: SalesContext; label: string; description: string }[] = [
    { value: 'discovery', label: 'Discovery', description: 'Initial research and pain point identification' },
    { value: 'competitive', label: 'Competitive', description: 'Competitor analysis and positioning' },
    { value: 'renewal', label: 'Renewal', description: 'Contract renewal and satisfaction analysis' },
    { value: 'demo', label: 'Demo', description: 'Technical requirements and use cases' },
    { value: 'negotiation', label: 'Negotiation', description: 'Procurement and budget approval' },
    { value: 'closing', label: 'Closing', description: 'Final decision and implementation planning' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.companyDomain) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateIntelligence(request);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate intelligence');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sales Intelligence Generator
        </h1>
        <p className="text-lg text-gray-600">
          Generate comprehensive sales intelligence reports with AI-powered analysis
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Domain
              </label>
              <input
                type="text"
                value={request.companyDomain}
                onChange={(e) => setRequest(prev => ({ ...prev, companyDomain: e.target.value }))}
                placeholder="e.g., shopify.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales Context
              </label>
              <select
                value={request.salesContext}
                onChange={(e) => setRequest(prev => ({ ...prev, salesContext: e.target.value as SalesContext }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {salesContexts.map(context => (
                  <option key={context.value} value={context.value}>
                    {context.label} - {context.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={request.additionalContext}
              onChange={(e) => setRequest(prev => ({ ...prev, additionalContext: e.target.value }))}
              placeholder="Any additional context about the meeting, opportunity, or specific areas of interest..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !request.companyDomain}
            className="w-full md:w-auto inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating Intelligence...</span>
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                <span>Generate Intelligence</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {response && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Intelligence Report Generated
                  </h2>
                  <p className="text-sm text-gray-500">
                    Generated on {formatDate(response.generatedAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Confidence Score</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(response.confidenceScore * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Company Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Company</div>
                <div className="font-medium">{response.insights.companyOverview.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Industry</div>
                <div className="font-medium">{response.insights.companyOverview.industry}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Size</div>
                <div className="font-medium">{response.insights.companyOverview.size}</div>
              </div>
            </div>
            {response.insights.companyOverview.revenue && (
              <div className="mt-4">
                <div className="text-sm text-gray-500">Revenue</div>
                <div className="font-medium">{response.insights.companyOverview.revenue}</div>
              </div>
            )}
          </div>

          {/* Pain Points */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pain Points</h3>
            </div>
            <ul className="space-y-2">
              {response.insights.painPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700">{typeof point === 'string' ? point : point.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Contacts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Key Contacts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {response.insights.keyContacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.influence === 'high' ? 'bg-red-100 text-red-800' :
                      contact.influence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {contact.influence} influence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{contact.title}</p>
                  <p className="text-sm text-gray-500">{contact.approachStrategy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Talking Points */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Talking Points</h3>
            </div>
            <ul className="space-y-2">
              {response.insights.talkingPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-gray-700">{typeof point === 'string' ? point : point.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deal Probability */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Deal Probability</h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${response.insights.dealProbability}%` }}
                />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {response.insights.dealProbability}%
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Sources</h3>
            </div>
            <div className="space-y-2">
              {response.sources.slice(0, 5).map((source, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <a 
                    href={source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm truncate"
                  >
                    {source}
                  </a>
                </div>
              ))}
              {response.sources.length > 5 && (
                <p className="text-sm text-gray-500 mt-2">
                  + {response.sources.length - 5} more sources
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
} 