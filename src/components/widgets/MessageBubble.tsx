import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import OptionsPanel from '../../features/guided/components/OptionsPanel';
import { CheckCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '../../types/research-types';
import { getInitials } from '../../utils';
import { VendorProfileCard } from './VendorProfileCard';
import { CompanySummaryCard } from './CompanySummaryCard';
import { ResearchProgressTracker } from './ResearchProgressTracker';
import { ResearchFindingsCard } from './ResearchFindingsCard';
import PersonalizedWelcomeMessage from './PersonalizedWelcomeMessage';
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
  profile,
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
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
          style={{ transformOrigin: "center center" }}
          className="avatar-container"
        >
          <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 ring-2 ring-background shadow-lg">
            {message.type === "user" ? (
              <>
                <AvatarImage src="" alt={`${userFirstName} ${userLastName}`} />
                <AvatarFallback className="text-xs">
                  {getInitials(userFirstName, userLastName)}
                </AvatarFallback>
              </>
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                <div className="icon-container">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "center center" }}
                    className="icon-rotation"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </motion.div>
        
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

          {/* Personalized Welcome Message */}
          {message.isPersonalizedWelcome && (
            <PersonalizedWelcomeMessage
              content={message.content || ''}
              profile={profile}
              messageId={message.id}
              activeTab={activeTabsState[message.id] || "overview"}
              onTabChange={(value) => onTabChange?.(message.id, value)}
              onCitationClick={onCitationClick || (() => {})}
              highlightedSource={highlightedSource || null}
            />
          )}

          {/* Regular Message Content */}
          {message.content && !message.isPersonalizedWelcome && (
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
                        {/* Status Icon (Left) */}
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />
                        )}
                        
                        {/* Activity Type Icon (Right) */}
                        {step.icon ? (
                          <div className={step.completed ? "text-green-500" : "text-muted-foreground"}>
                            {step.icon}
                          </div>
                        ) : (
                          <div className={step.completed ? "text-green-500" : "text-muted-foreground"}>
                            <CheckCircle className="w-4 h-4" />
                          </div>
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
                  <OptionsPanel
                    options={message.options}
                    onSelect={onResearchAreaClick}
                  />
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
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
} 