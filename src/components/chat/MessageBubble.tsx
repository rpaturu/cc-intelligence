import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SourceVerification, CredibilityIndicator, SourceTag } from './SourceCredibility';
import { ShieldCheck, ExternalLink, ChevronDown, ChevronUp, User, Bot } from 'lucide-react';
import type { EnhancedSource, SourcedClaim } from '@/types/api';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  sourcedClaims?: SourcedClaim[];
  enhancedSources?: EnhancedSource[];
  confidenceScore?: number;
}

export function MessageBubble({ 
  message, 
  isUser, 
  timestamp, 
  sourcedClaims,
  enhancedSources,
  confidenceScore 
}: MessageBubbleProps) {
  const [showSources, setShowSources] = useState(false);

  // Validate props
  if (typeof message !== 'string') {
    console.warn('MessageBubble: Invalid message prop:', message);
    return null;
  }

  if (!timestamp || !(timestamp instanceof Date)) {
    console.warn('MessageBubble: Invalid timestamp prop:', timestamp);
    return null;
  }

  // Validate and filter sources
  const validSourcedClaims = Array.isArray(sourcedClaims) ? 
    sourcedClaims.filter(claim => claim && typeof claim.claim === 'string') : 
    undefined;

  const validEnhancedSources = Array.isArray(enhancedSources) ? 
    enhancedSources.filter(source => source && source.url && source.title) : 
    undefined;

  const validConfidenceScore = typeof confidenceScore === 'number' && 
    confidenceScore >= 0 && confidenceScore <= 100 ? confidenceScore : undefined;

  const hasSources = !isUser && (
    (validSourcedClaims && validSourcedClaims.length > 0) || 
    (validEnhancedSources && validEnhancedSources.length > 0) ||
    validConfidenceScore
  );

  return (
    <div className={cn("flex gap-3 group", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
        isUser ? "bg-blue-500" : "bg-gray-600"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {/* Main Message Bubble */}
        <div className={cn(
          "px-3 py-2 rounded-2xl text-sm leading-relaxed",
          isUser 
            ? "bg-blue-500 text-white ml-auto" 
            : "bg-gray-100 text-gray-900"
        )}>
          <div className="whitespace-pre-wrap break-words">
            {message}
          </div>
        </div>

        {/* Metadata Row */}
        <div className={cn(
          "flex items-center gap-2 mt-1 text-xs text-gray-500",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {/* Confidence Score for AI messages */}
          {!isUser && validConfidenceScore && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CredibilityIndicator score={validConfidenceScore} size="sm" showText={false} />
                <span>{validConfidenceScore}% confidence</span>
              </div>
            </>
          )}

          {/* Sources Toggle for AI messages */}
          {!isUser && hasSources && (
            <>
              <span>•</span>
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>
                  {(validSourcedClaims?.length || 0) + (validEnhancedSources?.length || 0)} sources
                </span>
                {showSources ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </>
          )}
        </div>

        {/* Expandable Sources Section */}
        {!isUser && hasSources && showSources && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border text-sm space-y-3">
                         {/* Verified Claims */}
             {validSourcedClaims && validSourcedClaims.length > 0 && (
               <div>
                 <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                   <ShieldCheck className="w-3 h-3 text-green-600" />
                   Verified Claims ({validSourcedClaims.length})
                 </h4>
                 <div className="space-y-2">
                   {validSourcedClaims.slice(0, 2).map((claim, index) => (
                     <SourceVerification
                       key={claim.claimId || index}
                       sources={claim.sources}
                       claim={claim.claim}
                       confidenceScore={claim.confidenceScore}
                       compact={false}
                     />
                   ))}
                   {validSourcedClaims.length > 2 && (
                     <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                       +{validSourcedClaims.length - 2} more verified claims available
                     </div>
                   )}
                 </div>
               </div>
             )}
            
                         {/* Enhanced Sources */}
             {validEnhancedSources && validEnhancedSources.length > 0 && (
               <div>
                 <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                   <ExternalLink className="w-3 h-3 text-gray-600" />
                   Sources ({validEnhancedSources.length})
                 </h4>
                 <div className="space-y-1">
                   {validEnhancedSources.slice(0, 3).map((source, index) => (
                     <SourceTag 
                       key={index} 
                       source={source} 
                       compact={true} 
                       showDetails={false} 
                     />
                   ))}
                   {validEnhancedSources.length > 3 && (
                     <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                       +{validEnhancedSources.length - 3} more sources • 
                       <span className="font-medium">
                         {validEnhancedSources.filter(s => s.credibilityScore >= 80).length} high credibility
                       </span>
                     </div>
                   )}
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
} 