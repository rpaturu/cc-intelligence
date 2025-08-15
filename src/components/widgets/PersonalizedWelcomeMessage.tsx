import React, { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ExternalLink, Calendar, Building, Target, TrendingUp } from 'lucide-react';
import { UserProfile } from '../../types/api';
import { getCompanyIntelligence, getRoleFocusAreas, getWelcomeSources } from '../../utils/personalizedWelcome';

interface PersonalizedWelcomeMessageProps {
  content: string;
  profile: UserProfile | null;
  messageId: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  onCitationClick: (messageId: string, sourceId: number) => void;
  highlightedSource: number | null;
}

const renderTextWithCitations = (text: string, onCitationClick: (sourceId: number) => void): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Pattern to match citations like [1], [2], etc.
  const citationPattern = /\[(\d+)\]/g;
  let match;
  
  while ((match = citationPattern.exec(text)) !== null) {
    // Add text before citation
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      parts.push(...renderMarkdown(beforeText));
    }
    
    // Add clickable citation
    const citationNumber = parseInt(match[1]);
    parts.push(
      <motion.button
        key={`citation-${match.index}`}
        className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors cursor-pointer mx-0.5"
        onClick={() => onCitationClick(citationNumber)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {citationNumber}
      </motion.button>
    );
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(...renderMarkdown(text.slice(currentIndex)));
  }
  
  return parts.length > 0 ? parts : renderMarkdown(text);
};

const renderMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Bold pattern
  const boldPattern = /\*\*([^*]+)\*\*/g;
  let match;
  
  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > currentIndex) {
      const beforeText = text.slice(currentIndex, match.index);
      if (beforeText) {
        parts.push(beforeText);
      }
    }
    
    parts.push(
      <motion.strong 
        key={`bold-${match.index}`} 
        className="font-semibold text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {match[1]}
      </motion.strong>
    );
    
    currentIndex = match.index + match[0].length;
  }
  
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

const getRelevanceColor = (relevance: string) => {
  switch (relevance) {
    case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'company_page': return <Building className="w-3 h-3" />;
    case 'article': return <TrendingUp className="w-3 h-3" />;
    case 'report': return <Target className="w-3 h-3" />;
    default: return <ExternalLink className="w-3 h-3" />;
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

  const companyName = profile?.company || 'your company';
  const userRole = profile?.role || 'account-executive';
  const companyIntelligence = getCompanyIntelligence(companyName, profile?.territory);
  const roleFocusAreas = getRoleFocusAreas(userRole);
  const sources = getWelcomeSources(companyName);

  // Animation sequence for welcome message
  useEffect(() => {
    const animateWelcomeMessage = async () => {
      // First animate the card container
      await animate(
        ".welcome-card",
        { opacity: 1, scale: 1, y: 0 },
        { duration: 0.5, ease: "easeOut" }
      );
      
      // Then animate the content sections in sequence
      await animate(
        ".welcome-content",
        { opacity: 1, y: 0 },
        { duration: 0.4, delay: stagger(0.1) }
      );
    };

    animateWelcomeMessage();
  }, [animate]);

  const handleCitationClick = (sourceId: number) => {
    onTabChange("sources");
    onCitationClick(messageId, sourceId);
  };

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      className="welcome-card"
    >
      <Card className="bg-gradient-to-br from-primary/5 to-accent/30 border-l-4 border-l-primary">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <motion.div
                className="welcome-content space-y-4"
                initial={{ opacity: 0, y: 10 }}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {renderTextWithCitations(content, handleCitationClick)}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="intelligence" className="mt-4">
              <motion.div
                className="welcome-content space-y-6"
                initial={{ opacity: 0, y: 10 }}
              >
                {/* Company Competitive Edge */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-foreground">Your Company's Competitive Edge</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {companyIntelligence.competitiveEdge.map((edge, index) => (
                      <motion.div
                        key={index}
                        className="bg-background/50 rounded p-3 border"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{edge.platform}</Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">{edge.description}</p>
                        <p className="text-xs text-muted-foreground">{edge.keyPoints[0]}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Role-Specific Intelligence */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-primary" />
                    <h4 className="font-medium text-foreground">How You Win in Your Role</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">What You Focus On</p>
                      <ul className="space-y-1">
                        {roleFocusAreas.map((area, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-2 text-xs text-muted-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{area}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">How You're Measured</p>
                      <ul className="space-y-1">
                        <li className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>Quota attainment ({companyIntelligence.metrics.quotaTarget})</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>Average deal size ({companyIntelligence.metrics.dealSize})</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>Sales cycle velocity ({companyIntelligence.metrics.salesCycle})</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{companyIntelligence.metrics.growth}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">What You're Up Against</p>
                      <ul className="space-y-1">
                        {companyIntelligence.challenges.map((challenge, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-2 text-xs text-muted-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{challenge}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="sources" className="mt-4">
              <motion.div
                className="welcome-content space-y-3"
                initial={{ opacity: 0, y: 10 }}
              >
                {sources.map((source, index) => (
                  <motion.div
                    key={source.id}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      highlightedSource === source.id 
                        ? 'bg-primary/10 border-primary shadow-md' 
                        : 'bg-background/50 border-border hover:bg-background/80'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(source.type)}
                          <h4 className="text-sm font-medium text-foreground line-clamp-2">
                            {source.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getRelevanceColor(source.relevance)}`}>
                            {source.relevance}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{source.domain}</span>
                          {source.publishedDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {source.publishedDate}
                            </div>
                          )}
                        </div>
                      </div>
                      <motion.button
                        className="text-muted-foreground hover:text-primary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}