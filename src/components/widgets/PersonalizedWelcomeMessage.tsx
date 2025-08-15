import React, { useEffect } from 'react';
import { motion, AnimatePresence, stagger, useAnimate } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ExternalLink, Calendar } from 'lucide-react';
import { UserProfile } from '../../types/api';
import { getWelcomeSources } from '../../utils/personalizedWelcome';

interface PersonalizedWelcomeMessageProps {
  content: string;
  profile: UserProfile | null;
  messageId: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  onCitationClick: (messageId: string, sourceId: number) => void;
  highlightedSource: number | null;
}

// EXACT FIGMA IMPLEMENTATION - citation rendering function
const renderTextWithCitations = (text: string, messageId: string, onCitationClick: (messageId: string, sourceId: number) => void): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Combined regex to match both bold text and citations - Fixed the citation pattern
  const combinedPattern = /(\*\*([^*]+)\*\*)|(\[(\d+)\])/g;
  let match;
  
  while ((match = combinedPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      if (beforeText) {
        parts.push(beforeText);
      }
    }
    
    if (match[1]) {
      // Bold text match (**text**)
      const boldText = match[2];
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {boldText}
        </strong>
      );
    } else if (match[3]) {
      // Citation match [number] - Fixed the sourceId extraction
      const sourceId = parseInt(match[4]);
      parts.push(
        <span key={`citation-${match.index}`}>
          {" "}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Citation clicked:", sourceId, "for message:", messageId);
              onCitationClick(messageId, sourceId);
            }}
            className="inline-flex items-center justify-center w-5 h-5 text-xs bg-muted text-muted-foreground border-muted rounded border hover:bg-muted/80 hover:text-foreground hover:border-foreground/20 cursor-pointer transition-all duration-150 align-baseline font-medium shadow-sm hover:shadow-md"
            title={`View source ${sourceId}`}
          >
            {sourceId}
          </button>
        </span>
      );
    }
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts;
};

// Function to get relevance color
const getRelevanceColor = (relevance: string) => {
  switch (relevance) {
    case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

// Function to get type icon (uses emojis like Figma)
const getTypeIcon = (type: string) => {
  switch (type) {
    case "article": return <div className="w-4 h-4">📄</div>;
    case "press_release": return <div className="w-4 h-4">📢</div>;
    case "report": return <div className="w-4 h-4">📊</div>;
    case "social": return <div className="w-4 h-4">👥</div>;
    case "company_page": return <div className="w-4 h-4">🏢</div>;
    case "news": return <div className="w-4 h-4">🌐</div>;
    case "research_report": return <div className="w-4 h-4">📊</div>;
    case "news_article": return <div className="w-4 h-4">📰</div>;
    default: return <div className="w-4 h-4">🌐</div>;
  }
};

export default function PersonalizedWelcomeMessage({
  content,
  profile,
  messageId,
  activeTab,
  onTabChange,
  onCitationClick,
  highlightedSource
}: PersonalizedWelcomeMessageProps) {
  const [scope, animate] = useAnimate();
  const sources = getWelcomeSources(profile?.company || 'your company');

  // EXACT FIGMA ANIMATION SEQUENCE
  useEffect(() => {
    const animateWelcomeMessage = async () => {
      // First animate the card container
      await animate(
        ".welcome-card",
        { opacity: 1, scale: 1, y: 0 },
        { duration: 0.5, ease: "easeOut" }
      );
      
      // Then animate the header with stagger
      await animate(
        ".welcome-header",
        { opacity: 1, y: 0 },
        { duration: 0.4, delay: 0.2 }
      );
      
      // Animate tabs with slight delay
      await animate(
        ".welcome-tabs",
        { opacity: 1, x: 0 },
        { duration: 0.3, delay: 0.1 }
      );
      
      // Finally animate content with stagger
      animate(
        ".welcome-paragraph",
        { opacity: 1, y: 0 },
        { duration: 0.4, delay: stagger(0.1), ease: "easeOut" }
      );
    };

    animateWelcomeMessage();
  }, [animate]);

  // EXACT FIGMA CONTENT SPLITTING
  const contentParagraphs = content.split('\n\n');
  const sections = [];
  let currentSection = [];
  
  for (const paragraph of contentParagraphs) {
    if (paragraph.match(/^(How You Win|Latest.*Highlights|Recent.*Updates|Ready to Research\?)/)) {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
    }
    currentSection.push(paragraph);
  }
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  return (
    <div ref={scope}>
      <motion.div
        className="welcome-card"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
      >
        <Card className="overflow-hidden border-l-4 border-l-primary bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-0">
            <Tabs 
              value={activeTab || "overview"} 
              onValueChange={onTabChange}
              className="w-full"
            >
              <div className="flex items-center justify-between p-4 pb-0">
                <motion.h3 
                  className="welcome-header flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                >
                  <motion.span 
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  Welcome Message
                </motion.h3>
                
                <motion.div
                  className="welcome-tabs"
                  initial={{ opacity: 0, x: 20 }}
                >
                  <TabsList className="grid w-auto grid-cols-2 bg-muted/50 backdrop-blur-sm">
                    <TabsTrigger 
                      value="overview" 
                      className="text-xs transition-all hover:scale-105"
                    >
                      Message
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sources" 
                      className="text-xs transition-all hover:scale-105"
                    >
                      Sources
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      >
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {sources.length}
                        </Badge>
                      </motion.div>
                    </TabsTrigger>
                  </TabsList>
                </motion.div>
              </div>
              
              <TabsContent value="overview" className="p-4 pt-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {sections.map((section, sectionIndex) => (
                      <motion.div 
                        key={sectionIndex}
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.3 + sectionIndex * 0.2, 
                          duration: 0.5,
                          ease: "easeOut" 
                        }}
                      >
                        {section.map((paragraph, paragraphIndex) => {
                          const isHeading = paragraph.match(/^(How You Win|Latest.*Highlights|Recent.*Updates|Ready to Research\?)/);
                          const isSubPoint = paragraph.startsWith('• ') || paragraph.startsWith('- ') || paragraph.match(/^[✅🚀📊💡]/);
                          
                          return (
                            <motion.div
                              key={`${sectionIndex}-${paragraphIndex}`}
                              className="welcome-paragraph"
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ 
                                delay: paragraphIndex * 0.05,
                                duration: 0.4,
                                ease: "easeOut" 
                              }}
                            >
                              {isHeading ? (
                                <motion.div
                                  initial={{ scale: 0.98 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                    <motion.div 
                                      className="w-1 h-4 bg-primary rounded-full"
                                      initial={{ height: 0 }}
                                      animate={{ height: "1rem" }}
                                      transition={{ delay: 0.2, duration: 0.3 }}
                                    />
                                    {paragraph}
                                  </h4>
                                </motion.div>
                              ) : isSubPoint ? (
                                <motion.div
                                  className="pl-4 border-l-2 border-primary/20 bg-primary/5 rounded-r-lg py-2 px-3"
                                  whileHover={{ 
                                    borderColor: "var(--primary)", 
                                    backgroundColor: "var(--primary)/10",
                                    scale: 1.01 
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="whitespace-pre-line text-sm">
                                    {renderTextWithCitations(paragraph, messageId, onCitationClick)}
                                  </p>
                                </motion.div>
                              ) : paragraph === '---' ? (
                                <motion.div 
                                  className="flex items-center gap-4 my-4"
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                                  <motion.div 
                                    className="w-2 h-2 bg-primary rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  />
                                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                                </motion.div>
                              ) : (
                                <p className="whitespace-pre-line leading-relaxed">
                                  {renderTextWithCitations(paragraph, messageId, onCitationClick)}
                                </p>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>
              
              <TabsContent value="sources" className="p-4 pt-4">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {sources && sources.length > 0 ? (
                    <>
                      <motion.div 
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <h4 className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </motion.div>
                          Sources ({sources.length})
                        </h4>
                        <div className="flex gap-2">
                          {['high', 'medium', 'low'].map((relevance, index) => (
                            <motion.div
                              key={relevance}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                            >
                              <Badge variant="outline" className="text-xs capitalize">
                                {sources.filter(s => s.relevance === relevance).length} {relevance}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                      
                      <div className="space-y-3">
                        <AnimatePresence>
                          {sources.map((source, index) => (
                            <motion.div
                              key={source.id}
                              initial={{ opacity: 0, y: 20, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ 
                                delay: 0.4 + index * 0.1,
                                duration: 0.4,
                                ease: "easeOut" 
                              }}
                              whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2 }
                              }}
                              layout
                            >
                              <Card 
                                className={`transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${
                                  highlightedSource === source.id 
                                    ? 'ring-2 ring-primary ring-offset-2 bg-primary/5 shadow-lg shadow-primary/20' 
                                    : ''
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <motion.div 
                                      className="flex-shrink-0"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.5 + index * 0.05, type: "spring", stiffness: 200 }}
                                    >
                                      <div className="w-8 h-8 rounded bg-accent/50 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                        {getTypeIcon(source.type || 'company_page')}
                                      </div>
                                    </motion.div>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <h5 className="hover:text-primary transition-colors">
                                            <motion.a 
                                              href={source.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-1"
                                              whileHover={{ x: 2 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                              {source.title}
                                              <ExternalLink className="w-3 h-3" />
                                            </motion.a>
                                          </h5>
                                          <p className="text-xs text-muted-foreground">{source.domain || new URL(source.url).hostname}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge 
                                            variant="outline" 
                                            className={`text-xs capitalize ${getRelevanceColor(source.relevance || 'high')}`}
                                          >
                                            {source.relevance || 'High'}
                                          </Badge>
                                          <Badge variant="secondary" className="text-xs capitalize">
                                            {(source.type || 'company_page').replace('_', ' ')}
                                          </Badge>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{source.description}</p>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <motion.span 
                                            className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                                            whileHover={{ scale: 1.2 }}
                                            transition={{ duration: 0.2 }}
                                          >
                                            {source.id}
                                          </motion.span>
                                          Citation #{source.id}
                                        </span>
                                        {source.publishedDate && (
                                          <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {source.publishedDate}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      </motion.div>
                      <h4>No Sources Available</h4>
                      <p className="text-muted-foreground">
                        Sources for this research will appear here.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}