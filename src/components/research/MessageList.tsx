import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Clock, Sparkles } from "lucide-react";
import { ResearchFindingsCard, CompanySummaryCard } from "./components";
import { getInitials } from "../../utils/research-utils";
import { Icon } from "../ui/icon";
import ResearchProgress from "./ResearchProgress";
import MessageFeedback from "./MessageFeedback";
import { Message } from "../../types/research";

interface MessageListProps {
  messages: Message[];
  user: any;
  activeTabsState: Record<string, string>;
  highlightedSource: number | null;
  availableResearchAreas: any[];
  completedResearch: any[];
  onTabChange: (messageId: string, value: string) => void;
  onCitationClick: (messageId: string, sourceId: number) => void;
  onOptionClick: (optionId: string, optionText: string) => void;
  onFullAnalysisClick?: (researchAreaId: string) => void;
}

// Enhanced markdown renderer with animation support
const renderMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  const boldPattern = /\*\*([^*]+)\*\*/g;
  let match;
  
  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      if (beforeText) {
        parts.push(beforeText);
      }
    }
    
    const boldText = match[1];
    parts.push(
      <motion.strong 
        key={`bold-${match.index}`} 
        className="font-semibold text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {boldText}
      </motion.strong>
    );
    
    currentIndex = match.index + match[0].length;
  }
  
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

export default function MessageList({
  messages,
  user,
  activeTabsState,
  highlightedSource,
  availableResearchAreas,
  completedResearch,
  onTabChange,
  onCitationClick,
  onOptionClick,
  onFullAnalysisClick
}: MessageListProps) {
  const [contentStable, setContentStable] = useState(false);

  // Ensure content is stable before enabling smooth scrolling
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentStable(true);
    }, 1000); // Wait for initial animations to complete

    return () => clearTimeout(timer);
  }, [messages.length]);

  // Reset stability when new messages are added
  useEffect(() => {
    setContentStable(false);
    const timer = setTimeout(() => {
      setContentStable(true);
    }, 1200); // Longer wait for new content to fully render

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className={`space-y-6 message-list-container ${contentStable ? 'content-stable' : ''}`}>
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div 
            key={message.id} 
            className={`flex research-message-container ${message.type === "user" ? "justify-end" : "justify-start"}`}
            data-message-id={message.id}
            data-message-type={message.type}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.5, 
              delay: message.id === "welcome" ? 0.3 : index * 0.1,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            onAnimationComplete={() => {
              // Ensure content is considered stable after animations
              if (index === messages.length - 1) {
                setTimeout(() => setContentStable(true), 300);
              }
            }}
          >
            <div className={`flex gap-4 w-full ${
              message.type === "user" 
                ? "flex-row-reverse max-w-lg ml-auto" 
                : "flex-row max-w-2xl"
            }`}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2 + index * 0.05, 
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
                <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-background shadow-lg">
                  {message.type === "user" ? (
                    <>
                      <AvatarImage src="" alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm">
                      <div className="icon-container">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          style={{ transformOrigin: "center center" }}
                          className="icon-rotation"
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </AvatarFallback>
                  )}
                </Avatar>
              </motion.div>

              <motion.div 
                className={`space-y-3 flex-1 ${message.type === "user" ? "text-right" : "text-left"}`}
                initial={{ opacity: 0, x: message.type === "user" ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.5, ease: "easeOut" }}
              >
                {message.companySummary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                  >
                    <CompanySummaryCard 
                      companySummary={message.companySummary} 
                      messageId={message.id}
                      userRole={user?.role}
                    />
                  </motion.div>
                )}
                
                {message.researchFindings && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                    data-research-findings="true"
                  >
                    <ResearchFindingsCard
                      researchFindings={message.researchFindings}
                      sources={message.sources}
                      messageId={message.id}
                      activeTab={activeTabsState[message.id] || "findings"}
                      onTabChange={(value) => onTabChange(message.id, value)}
                      onCitationClick={onCitationClick}
                      highlightedSource={highlightedSource}
                      onFullAnalysisClick={onFullAnalysisClick}
                      userRole={user?.role}
                      companyName={message.companySummary?.name}
                    />
                  </motion.div>
                )}

                {message.content && (
                  <>
                    {message.sources && message.sources.length > 0 && !message.researchFindings ? (
                      // Welcome message with sources - simplified display
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      >
                        <Card className="card-hover">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {message.content.split('\n\n').map((paragraph, paragraphIndex) => (
                                <motion.p 
                                  key={paragraphIndex} 
                                  className="whitespace-pre-line leading-relaxed"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ 
                                    delay: 0.4 + index * 0.05 + paragraphIndex * 0.1, 
                                    duration: 0.4 
                                  }}
                                >
                                  {renderMarkdown(paragraph)}
                                </motion.p>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      // Regular message content
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                        whileHover={message.type !== "user" ? { 
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        } : undefined}
                      >
                        <Card className={`overflow-hidden ${
                          message.type === "user" 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "card-hover"
                        }`}>
                          <CardContent className={
                            message.type === "user" 
                              ? "!p-0 py-2 px-4 flex items-center justify-center min-h-[2.5rem]" 
                              : "p-4"
                          }>
                            {message.type === "user" ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="text-sm font-medium"
                              >
                                {message.content}
                              </motion.div>
                            ) : (
                              <div className="space-y-3">
                                {message.content.split('\n\n').map((paragraph, paragraphIndex) => (
                                  <motion.p 
                                    key={paragraphIndex} 
                                    className="whitespace-pre-line leading-relaxed"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                      delay: 0.4 + index * 0.05 + paragraphIndex * 0.1, 
                                      duration: 0.4 
                                    }}
                                  >
                                    {renderMarkdown(paragraph)}
                                  </motion.p>
                                ))}
                              </div>
                            )}
                            
                            {message.isStreaming && message.streamingSteps && (
                              <motion.div 
                                className="mt-3 space-y-1.5"
                                data-research-streaming="true"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                              >
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Sparkles className="w-4 h-4 text-primary" />
                                  </motion.div>
                                  <span>Researching...</span>
                                </div>
                                
                                <AnimatePresence>
                                  {message.streamingSteps.map((step, stepIndex) => (
                                    <motion.div 
                                      key={stepIndex} 
                                      className="flex items-center gap-2.5 text-sm bg-accent/30 rounded-lg py-1.5 px-3"
                                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                      animate={{ opacity: 1, x: 0, scale: 1 }}
                                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                      transition={{ 
                                        delay: stepIndex * 0.2, 
                                        duration: 0.4,
                                        ease: "easeOut" 
                                      }}
                                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                    >
                                      <motion.div
                                        initial={false}
                                        animate={{ 
                                          scale: step.completed ? [1, 1.2, 1] : 1,
                                          rotate: step.completed ? [0, 360] : 0 
                                        }}
                                        transition={{ 
                                          duration: step.completed ? 0.5 : 0,
                                          ease: "easeOut"
                                        }}
                                        className="flex-shrink-0"
                                      >
                                        {step.completed ? (
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                          <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                          >
                                            <Clock className="w-4 h-4 text-primary" />
                                          </motion.div>
                                        )}
                                      </motion.div>
                                      <motion.span 
                                        className={`text-sm leading-tight ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                                        animate={{ 
                                          color: step.completed ? "var(--foreground)" : "var(--muted-foreground)",
                                          x: step.completed ? [0, 3, 0] : 0
                                        }}
                                        transition={{ duration: 0.4 }}
                                      >
                                        {step.text}
                                      </motion.span>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </motion.div>
                            )}
                            
                            {message.options && !message.isStreaming && (
                              <motion.div 
                                className="mt-4 grid grid-cols-1 gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                              >
                                {message.options.map((option, optionIndex) => (
                                  <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ 
                                      delay: 0.6 + optionIndex * 0.1, 
                                      duration: 0.4,
                                      ease: "easeOut" 
                                    }}
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full justify-start text-left transition-all duration-200 bg-card/50 border-border/60 hover:bg-accent hover:text-accent-foreground hover:border-primary/50 active:bg-accent/80 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-card/80 dark:border-border dark:hover:bg-accent/80 dark:hover:border-primary/60 dark:hover:text-foreground dark:active:bg-accent/60"
                                      onClick={(e) => {
                                        onOptionClick(option.id, option.text);
                                        // Immediate visual feedback and focus management
                                        e.currentTarget.blur();
                                      }}
                                    >
                                      {option.iconName && (
                                        <motion.span 
                                          className="mr-2 flex-shrink-0"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.7 + optionIndex * 0.1, type: "spring", stiffness: 200 }}
                                        >
                                          <Icon name={option.iconName} size="sm" />
                                        </motion.span>
                                      )}
                                      <span className="flex-1 text-left">{option.text}</span>
                                    </Button>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                            
                            {/* Add feedback for assistant messages */}
                            {message.type === "assistant" && !message.isStreaming && message.content && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                                className="mt-3 pt-3 border-t border-border/50"
                              >
                                <MessageFeedback
                                  messageId={message.id}
                                  researchArea={message.researchFindings?.researchAreaId}
                                  companyName={message.companySummary?.name}
                                  userRole={user?.role}
                                />
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Research Progress - only show when there are followUpOptions */}
                {message.followUpOptions && availableResearchAreas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.5 }}
                  >
                    <ResearchProgress
                      availableResearchAreas={availableResearchAreas}
                      completedResearch={completedResearch}
                      followUpOptions={message.followUpOptions.map(option => ({
                        ...option,
                        icon: option.iconName || ''
                      }))}
                      onOptionClick={onOptionClick}
                    />
                  </motion.div>
                )}
                
                <motion.div 
                  className="text-xs text-muted-foreground flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
                >
                  <motion.div 
                    className="w-1 h-1 bg-primary rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}