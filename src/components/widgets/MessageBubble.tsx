import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Message } from '../../types/research-types';
import { getInitials } from '../../utils';
import { VendorProfileCard } from './VendorProfileCard';
import { CompanySummaryCard } from './CompanySummaryCard';
import { ResearchProgressTracker } from './ResearchProgressTracker';
import { ResearchFindingsCard } from './ResearchFindingsCard';

import { getResearchAreas } from '../../data';

interface MessageBubbleProps {
  message: Message;
  userFirstName: string;
  userLastName: string;
  userRole?: string;
  profile?: any;
  completedResearchIds?: string[];
  onResearchAreaClick: (areaId: string, areaTitle: string) => void;
  onFollowUpClick: (optionId: string, optionText: string) => void;
  onCitationClick?: (messageId: string, sourceId: number) => void;
  highlightedSource?: number | null;
  activeTabsState?: Record<string, string>;
  onTabChange?: (messageId: string, tab: string) => void;
}

export function MessageBubble({ 
  message, 
  userFirstName, 
  userLastName,
  userRole = 'account-executive',
  onResearchAreaClick,
  onFollowUpClick,
  onCitationClick,
  highlightedSource,
  activeTabsState = {},
  onTabChange
}: MessageBubbleProps) {
  return (
    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 sm:gap-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
          {message.type === "user" ? (
            <>
              <AvatarImage src="" alt={`${userFirstName} ${userLastName}`} />
              <AvatarFallback className="text-xs">
                {getInitials(userFirstName, userLastName)}
              </AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AI
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className={`space-y-2 ${message.type === "user" ? "text-right" : "text-left"}`}>
          {/* Vendor Profile Card */}
          {message.vendorProfile && (
            <VendorProfileCard 
              vendorProfile={message.vendorProfile} 
              userName={userFirstName}
            />
          )}

          {/* Company Summary Card */}
          {message.companySummary && (
            <CompanySummaryCard companySummary={message.companySummary} />
          )}

          {/* Research Findings */}
          {message.researchFindings && (
            <ResearchFindingsCard
              researchFindings={message.researchFindings}
              sources={message.sources}
              messageId={message.id}
              activeTab={activeTabsState[message.id] || "findings"}
              onTabChange={(value) => onTabChange?.(message.id, value)}
              onCitationClick={onCitationClick}
              highlightedSource={highlightedSource}
            />
          )}

          {/* Research Progress Tracker */}
          {message.researchProgress && (
            <ResearchProgressTracker 
              progress={message.researchProgress}
              allResearchAreas={getResearchAreas(userRole)}
              onAreaClick={onResearchAreaClick}
            />
          )}

          {/* Regular Message Content */}
          {message.content && (
            <Card className={message.type === "user" ? "bg-primary text-primary-foreground" : ""}>
              <CardContent className={message.type === "user" ? "p-0 [&:last-child]:pb-0 h-10 sm:h-12 flex items-center justify-center px-2 sm:px-3" : "p-2.5 sm:p-3"}>
                {message.type === "user" ? (
                  <span>{message.content}</span>
                ) : (
                  <p>{message.content}</p>
                )}
                
                {/* Streaming Steps */}
                {message.isStreaming && message.streamingSteps && (
                  <div className="mt-3 space-y-2">
                    {message.streamingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />
                        )}
                        <span className={step.completed ? "text-foreground" : "text-muted-foreground"}>
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Research Areas Selection */}
                {message.options && !message.isStreaming && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {message.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => onResearchAreaClick(option.id, option.text)}
                      >
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        {option.text}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Follow-up Options */}
          {message.followUpOptions && (
            <Card className="bg-accent/10 border">
              <CardContent className="p-2.5">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-sm">What would you like to do next?</span>
                </div>
                <div className="space-y-1">
                  {message.followUpOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-1.5"
                      onClick={() => onFollowUpClick(option.id, option.text)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.text}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {option.category}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Timestamp */}
          <div className="text-xs text-muted-foreground">
            {/* {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit'
            }) + '.' + message.timestamp.getMilliseconds().toString().padStart(3, '0')}
          </div>
        </div>
      </div>
    </div>
  );
} 