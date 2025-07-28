// React import not needed in React 17+
import { 
  Building, 
  Users, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle, 
  ExternalLink,
  Clock,
  Shield,
  ShieldCheck,
  Info,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CredibilityIndicator, SourceTag, SourceVerification } from './SourceCredibility';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import type { SalesIntelligenceResponse, SourcedClaim } from '@/types/api';

// New type for optimized overview response
type CompanyOverviewResponse = {
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
};

interface IntelligenceCardProps {
  data: SalesIntelligenceResponse;
  className?: string;
}

interface OverviewCardProps {
  data: CompanyOverviewResponse;
  className?: string;
}

// Helper component for sourced claims
function SourcedClaimDisplay({ claim }: { claim: SourcedClaim }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-blue-50 to-transparent">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm text-gray-800 font-medium flex-1">{claim.claim}</p>
        <CredibilityIndicator score={claim.confidenceScore} size="sm" />
      </div>
      <SourceVerification 
        sources={claim.sources} 
        confidenceScore={claim.confidenceScore}
        compact 
      />
    </div>
  );
}

// Helper component for enhanced source overview
function SourceOverview({ data }: { data: SalesIntelligenceResponse }) {
  const { enhancedSources, sourceCredibilityScore, totalSources, verifiedSources } = data;
  
  if (!enhancedSources || enhancedSources.length === 0) {
    return null;
  }

  const highCredibilitySources = enhancedSources.filter(s => s.credibilityScore >= 80);
  const officialSources = enhancedSources.filter(s => s.sourceType === 'official_company');

  return (
    <div className="bg-gradient-to-r from-green-50 to-transparent border border-green-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-900">Source Quality</span>
          {sourceCredibilityScore && (
            <CredibilityIndicator score={sourceCredibilityScore} size="sm" />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{totalSources || enhancedSources.length}</div>
          <div className="text-gray-600">Total Sources</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">{verifiedSources || 0}</div>
          <div className="text-gray-600">Verified</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">{highCredibilitySources.length}</div>
          <div className="text-gray-600">High Credibility</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-purple-600">{officialSources.length}</div>
          <div className="text-gray-600">Official</div>
        </div>
      </div>
    </div>
  );
}

// Helper component for parsing inline citations
function CitationText({ 
  text, 
  sources 
}: { 
  text: string; 
  sources: CompanyOverviewResponse['sources'] 
}) {
  const parseInlineCitations = (text: string) => {
    const parts = text.split(/(\[\d+(?:,\d+)*\])/g);
    
    return parts.map((part, index) => {
      const citationMatch = part.match(/\[(\d+(?:,\d+)*)\]/);
      
      if (citationMatch) {
        const sourceIds = citationMatch[1].split(',').map(id => parseInt(id.trim()));
        const sourceNames = sourceIds
          .map(id => sources.find(s => s.id === id)?.domain || `Source ${id}`)
          .join(', ');
        
        return (
          <sup 
            key={index}
            className="citation text-xs text-blue-600 cursor-pointer hover:text-blue-800 ml-0.5"
            title={`Sources: ${sourceNames}`}
            onClick={() => {
              // Could show source details modal here
              console.log('Citation clicked:', sourceIds);
            }}
          >
            {part}
          </sup>
        );
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  return <span>{parseInlineCitations(text)}</span>;
}

// New component for optimized overview display
export function OverviewCard({ data, className }: OverviewCardProps) {
  const { name, industry, size, revenue, sources } = data;
  
  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm text-left", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 text-left">Company Overview</h3>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Fast Overview
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {sources.length} sources
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-left">
        {/* Company Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-left">Basic Information</h4>
          </div>
          <div className="text-sm text-gray-700 pl-6 text-left space-y-1">
            <p className="text-left">
              <strong>Company:</strong> <CitationText text={name} sources={sources} />
            </p>
            <p className="text-left">
              <strong>Industry:</strong> <CitationText text={industry} sources={sources} />
            </p>
            <p className="text-left">
              <strong>Size:</strong> <CitationText text={size} sources={sources} />
            </p>
            <p className="text-left">
              <strong>Revenue:</strong> <CitationText text={revenue} sources={sources} />
            </p>
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-gray-900 text-left">Sources</h4>
          </div>
          <div className="pl-6 space-y-2">
            {sources.map((source) => (
              <div key={source.id} className="flex items-start gap-2 text-sm">
                <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                  [{source.id}]
                </span>
                <div className="flex-1">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-left font-medium"
                  >
                    {source.title}
                  </a>
                  <p className="text-gray-600 text-xs text-left">{source.domain}</p>
                  <p className="text-gray-600 text-xs text-left">{source.snippet}</p>
                </div>
                <div className={cn(
                  "text-xs px-1.5 py-0.5 rounded",
                  source.credibilityScore >= 0.7 ? "bg-green-100 text-green-700" :
                  source.credibilityScore >= 0.5 ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {Math.round(source.credibilityScore * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function IntelligenceCard({ data, className }: IntelligenceCardProps) {
  const { insights, confidenceScore, generatedAt, sources, enhancedSources, sourceCredibilityScore } = data;

  // Calculate source counts for badges
  const totalSources = enhancedSources?.length || sources?.length || 0;
  const totalClaims = (insights.sourcedClaims?.length || 0) + 
                     (insights.companyOverview?.sourcedClaims?.length || 0);
  const sourcesBadge = totalSources > 0 ? totalSources : undefined;

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm text-left", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 text-left">Intelligence Report</h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              confidenceScore >= 80 ? "bg-green-100 text-green-800" :
              confidenceScore >= 60 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}>
              {confidenceScore}% confidence
            </div>
            {sourceCredibilityScore && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-gray-500" />
                <span className={cn(
                  "text-xs font-medium",
                  sourceCredibilityScore >= 80 ? "text-green-600" :
                  sourceCredibilityScore >= 60 ? "text-yellow-600" :
                  "text-red-600"
                )}>
                  {sourceCredibilityScore}% sources
                </span>
              </div>
            )}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {generatedAt.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="intelligence" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="intelligence">
            Intelligence {totalClaims > 0 ? `(${totalClaims} verified)` : ''}
          </TabsTrigger>
          <TabsTrigger value="sources">
            Sources {sourcesBadge ? `(${sourcesBadge})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="intelligence">
          <div className="p-4 space-y-6 text-left">
            {/* Sourced Claims Section */}
            {insights.sourcedClaims && insights.sourcedClaims.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Verified Claims</h4>
                </div>
                <div className="space-y-3 pl-6">
                  {insights.sourcedClaims.map((claim, index) => (
                    <SourcedClaimDisplay key={claim.claimId || index} claim={claim} />
                  ))}
                </div>
              </div>
            )}

            {/* Company Overview */}
            {insights.companyOverview && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Company Overview</h4>
                </div>
                <div className="text-sm text-gray-700 pl-6 text-left">
                  <p className="text-left"><strong>Industry:</strong> {insights.companyOverview.industry}</p>
                  <p className="text-left"><strong>Size:</strong> {insights.companyOverview.size}</p>
                  {insights.companyOverview.revenue && (
                    <p className="text-left"><strong>Revenue:</strong> {insights.companyOverview.revenue}</p>
                  )}
                  {insights.companyOverview.challenges && insights.companyOverview.challenges.length > 0 && (
                    <div className="mt-2 text-left">
                      <p className="text-left"><strong>Challenges:</strong></p>
                      <ul className="list-disc list-inside ml-2 space-y-1 text-left">
                        {insights.companyOverview.challenges.map((challenge, index) => (
                          <li key={index} className="text-left">{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Show sourced claims for company overview */}
                  {insights.companyOverview.sourcedClaims && insights.companyOverview.sourcedClaims.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {insights.companyOverview.sourcedClaims.map((claim, index) => (
                        <SourcedClaimDisplay key={claim.claimId || `company-${index}`} claim={claim} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pain Points */}
            {insights.painPoints && insights.painPoints.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Pain Points</h4>
                </div>
                <ul className="text-sm text-gray-700 pl-6 space-y-1 text-left">
                  {insights.painPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-left">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-left">{typeof point === 'string' ? point : point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Contacts */}
            {insights.keyContacts && insights.keyContacts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Key Contacts</h4>
                </div>
                <div className="pl-6 space-y-2 text-left">
                  {insights.keyContacts.map((contact, index) => (
                    <div key={index} className="text-sm text-left">
                      <p className="font-medium text-gray-900 text-left">{contact.name}</p>
                      <p className="text-gray-600 text-left">{contact.title}</p>
                      {contact.approachStrategy && (
                        <p className="text-gray-700 mt-1 text-left">{contact.approachStrategy}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitive Landscape */}
            {insights.competitiveLandscape && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Competitive Landscape</h4>
                </div>
                <div className="text-sm text-gray-700 pl-6 text-left">
                  <p className="text-left"><strong>Market Position:</strong> {insights.competitiveLandscape.marketPosition}</p>
                  {insights.competitiveLandscape.competitors && insights.competitiveLandscape.competitors.length > 0 && (
                    <p className="text-left"><strong>Competitors:</strong> {insights.competitiveLandscape.competitors.map(c => c.name).join(', ')}</p>
                  )}
                  {insights.competitiveLandscape.differentiators && (
                    <div className="mt-2 text-left">
                      <p className="text-left"><strong>Differentiators:</strong></p>
                      <ul className="list-disc list-inside ml-2 space-y-1 text-left">
                        {insights.competitiveLandscape.differentiators.map((diff, index) => (
                          <li key={index} className="text-left">{diff}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Talking Points */}
            {insights.talkingPoints && insights.talkingPoints.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Talking Points</h4>
                </div>
                <ul className="text-sm text-gray-700 pl-6 space-y-1 text-left">
                  {insights.talkingPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-left">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-left">{typeof point === 'string' ? point : point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Potential Objections with Enhanced Sources */}
            {insights.potentialObjections && insights.potentialObjections.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Potential Objections</h4>
                </div>
                <div className="pl-6 space-y-3 text-left">
                  {insights.potentialObjections.map((objection, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 bg-amber-50">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900"><strong>Objection:</strong> {objection.objection}</p>
                          <p className="text-sm text-gray-700 mt-1"><strong>Response:</strong> {objection.response}</p>
                          {objection.supporting_data && (
                            <p className="text-sm text-gray-600 mt-1"><strong>Supporting Data:</strong> {objection.supporting_data}</p>
                          )}
                        </div>
                        
                        {/* Show source verification for objections */}
                        {objection.sources && objection.sources.length > 0 && (
                          <SourceVerification 
                            sources={objection.sources} 
                            confidenceScore={objection.confidenceScore}
                            compact 
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {insights.recommendedActions && insights.recommendedActions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Recommended Actions</h4>
                </div>
                <ul className="text-sm text-gray-700 pl-6 space-y-1 text-left">
                  {insights.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-left">
                      <span className="text-purple-500 mt-1">•</span>
                      <span className="text-left">{typeof action === 'string' ? action : action.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deal Probability */}
            {insights.dealProbability !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 text-left">Deal Probability</h4>
                </div>
                <div className="pl-6 text-left">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full",
                          insights.dealProbability >= 70 ? "bg-green-500" :
                          insights.dealProbability >= 40 ? "bg-yellow-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${insights.dealProbability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-left">
                      {insights.dealProbability}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sources">
          <div className="p-4 space-y-4">
            {/* Source Quality Overview */}
            <SourceOverview data={data} />

            {/* Verified Claims with Sources */}
            {(insights.sourcedClaims?.length || insights.companyOverview?.sourcedClaims?.length) && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Verified Claims
                </h4>
                <div className="space-y-3">
                  {insights.sourcedClaims?.map((claim, index) => (
                    <SourceVerification
                      key={claim.claimId || index}
                      sources={claim.sources}
                      claim={claim.claim}
                      confidenceScore={claim.confidenceScore}
                    />
                  ))}
                  {insights.companyOverview?.sourcedClaims?.map((claim, index) => (
                    <SourceVerification
                      key={claim.claimId || `company-${index}`}
                      sources={claim.sources}
                      claim={claim.claim}
                      confidenceScore={claim.confidenceScore}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Sources */}
            {enhancedSources && enhancedSources.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                  All Sources ({enhancedSources.length})
                </h4>
                <div className="space-y-2">
                  {enhancedSources.map((source, index) => (
                    <SourceTag key={index} source={source} showDetails={true} />
                  ))}
                </div>
              </div>
            ) : (
              /* Legacy Sources - fallback for backwards compatibility */
              sources && sources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                    Sources
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1 text-left">
                    {sources.map((source, index) => (
                      <p key={index} className="truncate text-left">{source}</p>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 