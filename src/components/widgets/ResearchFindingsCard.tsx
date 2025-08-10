import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckCircle, ExternalLink, Users, Phone, Mail, Linkedin, Swords, Calendar } from "lucide-react";

interface ResearchFindingsCardProps {
  researchFindings: any;
  sources?: any[];
  messageId: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onCitationClick?: (messageId: string, sourceId: number) => void;
  highlightedSource?: number | null;
}

const renderTextWithCitations = (
  text: string, 
  messageId: string, 
  onCitationClick?: (messageId: string, sourceId: number) => void
) => {
  if (!onCitationClick) return text;
  
  const citationPattern = /\[(\d+)\]/g;
  const parts = text.split(citationPattern);
  
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const sourceId = parseInt(part);
      return (
        <button
          key={index}
          onClick={() => onCitationClick(messageId, sourceId)}
          className="inline-flex items-center justify-center w-5 h-5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded border border-primary/20 hover:border-primary/40 transition-colors mx-0.5 align-baseline"
          title={`View source ${sourceId}`}
        >
          {sourceId}
        </button>
      );
    }
    return part;
  });
};

const getRelevanceColor = (relevance: string): string => {
  switch (relevance) {
    case "high": return "text-green-600 bg-green-50 border-green-200";
    case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low": return "text-gray-600 bg-gray-50 border-gray-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "article": return <div className="w-4 h-4">📄</div>;
    case "press_release": return <div className="w-4 h-4">📢</div>;
    case "report": return <div className="w-4 h-4">📊</div>;
    case "social": return <div className="w-4 h-4">👥</div>;
    case "company_page": return <div className="w-4 h-4">🏢</div>;
    case "news": return <div className="w-4 h-4">🌐</div>;
    default: return <div className="w-4 h-4">🌐</div>;
  }
};

export function ResearchFindingsCard({ 
  researchFindings, 
  sources, 
  messageId, 
  activeTab = "findings", 
  onTabChange = () => {}, 
  onCitationClick = () => {},
  highlightedSource 
}: ResearchFindingsCardProps) {
  const [scope, animate] = useAnimate();

  // Early return if no research findings
  if (!researchFindings) {
    return null;
  }

  // Simple entrance animation to prevent conflicts
  useEffect(() => {
    const animateFindings = async () => {
      // Simple card entrance
      await animate(
        ".findings-card",
        { opacity: 1, scale: 1, y: 0 },
        { duration: 0.3, ease: "easeOut" }
      );
    };

    animateFindings();
  }, [animate]);

  return (
    <div ref={scope}>
      <motion.div
        className="findings-card"
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
      >
        <Card className="bg-background border-l-4 border-l-primary overflow-hidden card-hover">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full min-h-[300px]">
              <div className="flex items-center justify-between p-4 pb-0">
                <motion.h3 
                  className="findings-header flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{researchFindings.title}</span>
                </motion.h3>
                
                <motion.div 
                  className="findings-tabs"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <TabsList className="grid w-auto grid-cols-2 bg-muted/50">
                    <TabsTrigger 
                      value="findings" 
                      className="text-xs transition-colors focus-ring"
                    >
                      Findings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sources" 
                      className="text-xs transition-colors focus-ring"
                    >
                      Sources
                      {sources && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {sources.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </motion.div>
              </div>
          
          <AnimatePresence mode="wait">
            <TabsContent value="findings" className="p-4 pt-4 min-h-[200px]">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {researchFindings.items.map((item: any, index: number) => (
                  <motion.div 
                    key={index} 
                    className="research-item border-l-2 border-primary/20 pl-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.4,
                      ease: "easeOut" 
                    }}
                  >
                    <motion.h4 
                      className="text-foreground mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                    >
                      {item.title}
                    </motion.h4>
                    
                    <motion.p 
                      className="text-muted-foreground text-sm mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    >
                      {item.description}
                    </motion.p>
                  
                  {item.contact && (
                    <motion.div 
                      className="bg-accent/30 rounded p-3 mb-2 card-hover"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                        >
                          <Users className="w-4 h-4" />
                        </motion.div>
                        <span className="text-sm">{item.contact.name} - {item.contact.role}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {item.contact.email && (
                          <motion.div 
                            className="flex items-center gap-1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.2 }}
                            whileHover={{ x: 5, transition: { duration: 0.2 } }}
                          >
                            <Mail className="w-3 h-3" />
                            <span>{item.contact.email}</span>
                          </motion.div>
                        )}
                        {item.contact.phone && (
                          <motion.div 
                            className="flex items-center gap-1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65 + index * 0.1, duration: 0.2 }}
                            whileHover={{ x: 5, transition: { duration: 0.2 } }}
                          >
                            <Phone className="w-3 h-3" />
                            <span>{item.contact.phone}</span>
                          </motion.div>
                        )}
                        {item.contact.linkedin && (
                          <motion.div 
                            className="flex items-center gap-1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1, duration: 0.2 }}
                            whileHover={{ x: 5, transition: { duration: 0.2 } }}
                          >
                            <Linkedin className="w-3 h-3" />
                            <span>{item.contact.linkedin}</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {item.valueProps && (
                    <div className="space-y-3 mb-2">
                      {item.valueProps.map((valueProp: any, vpIndex: number) => (
                        <motion.div 
                          key={vpIndex} 
                          className="bg-primary/5 rounded p-3 border-l-4 border-l-primary card-hover"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 + vpIndex * 0.05, duration: 0.3 }}
                          whileHover={{ 
                            x: 5,
                            backgroundColor: "var(--primary)/10",
                            transition: { duration: 0.2 }
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.9 + index * 0.1 + vpIndex * 0.05, type: "spring", stiffness: 200 }}
                            >
                              <Swords className="w-4 h-4 text-primary" />
                            </motion.div>
                            <span className="text-sm">{valueProp.ourAdvantage}</span>
                            <Badge variant="outline" className="text-xs">vs {valueProp.competitor}</Badge>
                          </div>
                          
                          <div className="mb-2">
                            <p className="text-xs text-muted-foreground mb-1">Key Talking Points:</p>
                            <ul className="text-xs space-y-0.5">
                              {valueProp.talkingPoints.map((point: string, pointIndex: number) => (
                                <motion.li 
                                  key={pointIndex} 
                                  className="flex items-start gap-1"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1.0 + index * 0.1 + vpIndex * 0.05 + pointIndex * 0.02, duration: 0.2 }}
                                >
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>{renderTextWithCitations(point, messageId, onCitationClick)}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>

                          {valueProp.objectionHandling && (
                            <motion.div 
                              className="bg-accent/50 rounded p-2"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.2 + index * 0.1 + vpIndex * 0.05, duration: 0.2 }}
                            >
                              <p className="text-xs text-muted-foreground mb-1">Objection Handling:</p>
                              <p className="text-xs">{renderTextWithCitations(valueProp.objectionHandling, messageId, onCitationClick)}</p>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {item.details && (
                    <motion.ul 
                      className="text-sm text-muted-foreground space-y-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.3 }}
                    >
                      {item.details.map((detail: string, i: number) => (
                        <motion.li 
                          key={i} 
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5 + index * 0.1 + i * 0.03, duration: 0.2 }}
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{renderTextWithCitations(detail, messageId, onCitationClick)}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <TabsContent value="sources" className="p-4 pt-4 min-h-[200px]">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {sources && sources.length > 0 ? (
                  <>
                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
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
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
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
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ 
                              delay: 0.3 + index * 0.05,
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
                              className={`transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 card-hover ${
                                highlightedSource === source.id 
                                  ? 'ring-2 ring-primary ring-offset-2 bg-primary/5 shadow-lg shadow-primary/20 glow-pulse' 
                                  : ''
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <motion.div 
                                    className="flex-shrink-0"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05, type: "spring", stiffness: 200 }}
                                  >
                                    <div className="w-8 h-8 rounded bg-accent/50 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                      {getTypeIcon(source.type)}
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
                                        <p className="text-xs text-muted-foreground">{source.domain}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs capitalize ${getRelevanceColor(source.relevance)}`}
                                        >
                                          {source.relevance}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs capitalize">
                                          {source.type.replace('_', ' ')}
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
                    transition={{ delay: 0.2, duration: 0.4 }}
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
          </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 