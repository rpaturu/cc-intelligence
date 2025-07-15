import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ExternalLink, 
  Info, 
  Building, 
  FileText, 
  User,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EnhancedSource, SourceType, DomainAuthority } from '@/types/api';

// Source type icons mapping
const sourceTypeIcons: Record<SourceType, React.ComponentType<{ className?: string }>> = {
  official_company: Building,
  news_tier1: FileText,
  news_tier2: FileText,
  financial_filing: FileText,
  industry_report: FileText,
  press_release: FileText,
  social_media: User,
  blog: User,
  unknown: Info,
};

// Source type colors
const sourceTypeColors: Record<SourceType, string> = {
  official_company: 'bg-blue-100 text-blue-800 border-blue-200',
  news_tier1: 'bg-green-100 text-green-800 border-green-200',
  news_tier2: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  financial_filing: 'bg-purple-100 text-purple-800 border-purple-200',
  industry_report: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  press_release: 'bg-orange-100 text-orange-800 border-orange-200',
  social_media: 'bg-pink-100 text-pink-800 border-pink-200',
  blog: 'bg-gray-100 text-gray-800 border-gray-200',
  unknown: 'bg-gray-100 text-gray-600 border-gray-200',
};

// Domain authority colors
const authorityColors: Record<DomainAuthority, string> = {
  high: 'text-green-600',
  medium: 'text-yellow-600',
  low: 'text-red-600',
};

interface CredibilityIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function CredibilityIndicator({ score, size = 'md', showText = true }: CredibilityIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return ShieldCheck;
    if (score >= 60) return Shield;
    return Info;
  };

  const Icon = getScoreIcon(score);

  return (
    <div className="flex items-center gap-1">
      <Icon className={cn(sizeClasses[size], getScoreColor(score))} />
      {showText && (
        <span className={cn('font-medium', getScoreColor(score))}>
          {score}%
        </span>
      )}
    </div>
  );
}

interface SourceTagProps {
  source: EnhancedSource;
  compact?: boolean;
  showDetails?: boolean;
}

export function SourceTag({ source, compact = false, showDetails = false }: SourceTagProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = sourceTypeIcons[source.sourceType];

  const handleSourceClick = () => {
    window.open(source.url, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <button
        onClick={handleSourceClick}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors hover:bg-opacity-80',
          sourceTypeColors[source.sourceType]
        )}
        title={`${source.title} - Credibility: ${source.credibilityScore}%`}
      >
        <Icon className="w-3 h-3" />
        <span className="truncate max-w-24">{source.domain}</span>
        <CredibilityIndicator score={source.credibilityScore} size="sm" showText={false} />
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className={cn(
                'px-2 py-0.5 rounded text-xs font-medium border',
                sourceTypeColors[source.sourceType]
              )}>
                {source.sourceType.replace('_', ' ').toUpperCase()}
              </span>
                             {source.isVerified && (
                 <div title="Verified Source">
                   <ShieldCheck className="w-4 h-4 text-green-600" />
                 </div>
               )}
            </div>
            
            <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
              {source.title}
            </h4>
            
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <span className="font-medium">{source.domain}</span>
              {source.author && (
                <>
                  <span>•</span>
                  <span>{source.author}</span>
                </>
              )}
              {source.publicationDate && (
                <>
                  <span>•</span>
                  <span>{new Date(source.publicationDate).toLocaleDateString()}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Credibility:</span>
                <CredibilityIndicator score={source.credibilityScore} size="sm" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Authority:</span>
                <span className={cn('text-xs font-medium', authorityColors[source.domainAuthority])}>
                  {source.domainAuthority.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Relevance:</span>
                <span className="text-xs font-medium text-gray-700">{source.relevanceScore}%</span>
              </div>
            </div>

            {source.excerpt && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {source.excerpt}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleSourceClick}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View Source
          </button>

          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-3 h-3" />
              Details
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {isExpanded && showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>Authority Score: {source.authorityScore}/100</div>
              <div>Relevance Score: {source.relevanceScore}/100</div>
              <div>Source Type: {source.sourceType}</div>
              <div>Verified: {source.isVerified ? 'Yes' : 'No'}</div>
            </div>
            {source.excerpt && (
              <div className="mt-2">
                <span className="font-medium">Excerpt:</span>
                <p className="mt-1 text-gray-600">{source.excerpt}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface SourceVerificationProps {
  sources: EnhancedSource[];
  claim?: string;
  confidenceScore?: number;
  compact?: boolean;
}

export function SourceVerification({ 
  sources, 
  claim, 
  confidenceScore, 
  compact = false 
}: SourceVerificationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const highCredibilitySources = sources.filter(s => s.credibilityScore >= 80);
  const verifiedSources = sources.filter(s => s.isVerified);
  const officialSources = sources.filter(s => s.sourceType === 'official_company');

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1">
        <span className="text-xs text-gray-500">{sources.length} source{sources.length !== 1 ? 's' : ''}</span>
        {confidenceScore && (
          <CredibilityIndicator score={confidenceScore} size="sm" showText={false} />
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Source Verification</span>
          {confidenceScore && (
            <CredibilityIndicator score={confidenceScore} size="sm" />
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {sources.length} source{sources.length !== 1 ? 's' : ''}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className="text-xs text-gray-600 flex items-center gap-4 mb-2">
        <span>High Credibility: {highCredibilitySources.length}</span>
        <span>Verified: {verifiedSources.length}</span>
        <span>Official: {officialSources.length}</span>
      </div>

      {claim && (
        <div className="text-sm text-gray-700 mb-3 p-2 bg-white rounded border-l-2 border-blue-200">
          "{claim}"
        </div>
      )}

      {isExpanded && (
        <div className="space-y-2">
          {sources.map((source, index) => (
            <SourceTag key={index} source={source} showDetails={false} />
          ))}
        </div>
      )}

      {!isExpanded && sources.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {sources.slice(0, 3).map((source, index) => (
            <SourceTag key={index} source={source} compact />
          ))}
          {sources.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{sources.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
} 