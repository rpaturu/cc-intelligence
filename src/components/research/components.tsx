import { motion, AnimatePresence, useAnimate } from "motion/react";
import { useEffect } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Building, Layers, GitBranch, Star, BarChart3, MapPin, TrendingUp, Zap, CheckCircle, ExternalLink, Users, Phone, Mail, Linkedin, Swords, Calendar, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { VendorProfile, CompanyData, Source } from "../../types/research";
import { getRelevanceColor, getTypeIcon, renderTextWithCitations } from "../../utils/research-utils";
import MessageFeedback from "./MessageFeedback";

interface VendorProfileCardProps {
  vendorProfile: VendorProfile;
}

export function VendorProfileCard({ vendorProfile }: VendorProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-accent/30 border-l-4 border-l-primary card-hover">
        <CardHeader className="pb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <CardTitle className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Building className="w-5 h-5 text-primary" />
              </motion.div>
              {vendorProfile.company} Intelligence Dashboard
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">{vendorProfile.overview}</p>
          </motion.div>

          {/* Product Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <h4 className="mb-3 flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                <Layers className="w-4 h-4 text-primary" />
              </motion.div>
              Product Portfolio
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
              {vendorProfile.products.map((product, index) => (
                <motion.div 
                  key={index} 
                  className="bg-background/50 rounded p-3 card-hover"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Competitive Landscape */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <h4 className="mb-3 flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              >
                <GitBranch className="w-4 h-4 text-primary" />
              </motion.div>
              Competitive Landscape
            </h4>
            <div className="space-y-3">
              {vendorProfile.competitors.map((competitor, index) => (
                <motion.div 
                  key={index} 
                  className="bg-background/50 rounded p-3 card-hover"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{competitor.name}</span>
                    <Badge variant="secondary" className="text-xs">{competitor.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{competitor.strength}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Persona Insights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <h4 className="mb-3 flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
              >
                <Star className="w-4 h-4 text-primary" />
              </motion.div>
              {vendorProfile.persona.role} Success Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Key Focus Areas", items: vendorProfile.persona.keyFocus },
                { title: "Success Metrics", items: vendorProfile.persona.successMetrics },
                { title: "Common Challenges", items: vendorProfile.persona.commonChallenges }
              ].map((section, sectionIndex) => (
                <motion.div 
                  key={section.title}
                  className="bg-background/50 rounded p-3 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + sectionIndex * 0.1, duration: 0.3 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <p className="text-xs text-muted-foreground mb-2">{section.title}</p>
                  <ul className="text-xs space-y-1">
                    {section.items.map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + sectionIndex * 0.1 + index * 0.05, duration: 0.2 }}
                      >
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface CompanySummaryCardProps {
  companySummary: CompanyData;
  messageId?: string;
  userRole?: string;
}

export function CompanySummaryCard({ companySummary, messageId, userRole }: CompanySummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-accent/50 border-l-4 border-l-primary card-hover">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Company Header */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <BarChart3 className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-foreground">{companySummary.name}</span>
              <Badge variant="secondary">{companySummary.industry}</Badge>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{companySummary.size}</span>
            </motion.div>

            {/* Business Context */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{companySummary.location}</span>
                  {companySummary.founded && (
                    <>
                      <span>•</span>
                      <span>Founded {companySummary.founded}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>{companySummary.revenue}</span>
                  {companySummary.businessMetrics?.valuation && (
                    <>
                      <span>•</span>
                      <span>{companySummary.businessMetrics.valuation}</span>
                    </>
                  )}
                </div>

                {companySummary.businessModel && (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-foreground">Business Model:</span> {companySummary.businessModel}
                  </div>
                )}

                {companySummary.marketPosition && (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-foreground">Market Position:</span> {companySummary.marketPosition}
                  </div>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {/* Recent News */}
                <div className="text-sm">
                  <span className="text-foreground">Recent:</span> 
                  <span className="text-muted-foreground ml-1">{companySummary.recentNews}</span>
                </div>

                {/* Key Metrics */}
                {companySummary.businessMetrics && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    {companySummary.businessMetrics.employeeGrowth && (
                      <div>
                        <span className="text-foreground">Growth:</span>
                        <span className="text-green-600 ml-1">{companySummary.businessMetrics.employeeGrowth}</span>
                      </div>
                    )}
                    {companySummary.businessMetrics.customerCount && (
                      <div>
                        <span className="text-foreground">Customers:</span>
                        <span className="text-muted-foreground ml-1">{companySummary.businessMetrics.customerCount}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Growth Stage */}
                {companySummary.growthStage && (
                  <div className="text-sm">
                    <Badge variant="outline" className="text-xs">
                      {companySummary.growthStage}
                    </Badge>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Technology Stack */}
            <motion.div 
              className="flex items-start gap-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Zap className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground text-sm">Tech Stack:</span>
                {companySummary.techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.2 }}
                  >
                    <Badge variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Key Leadership */}
            {companySummary.keyExecutives && companySummary.keyExecutives.length > 0 && (
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <span className="text-sm text-foreground">Key Leadership:</span>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {companySummary.keyExecutives.slice(0, 4).map((exec, index) => (
                    <motion.div 
                      key={index} 
                      className="text-sm bg-background/50 rounded p-2 card-hover"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <div className="text-foreground">{exec.name}</div>
                      <div className="text-xs text-muted-foreground">{exec.role}</div>
                      {exec.background && (
                        <div className="text-xs text-muted-foreground">{exec.background}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Developments */}
            {companySummary.recentDevelopments && companySummary.recentDevelopments.length > 0 && (
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.3 }}
              >
                <span className="text-sm text-foreground">Recent Developments:</span>
                <div className="space-y-1">
                  {companySummary.recentDevelopments.slice(0, 3).map((dev, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                    >
                      <Badge 
                        variant={dev.impact === "high" ? "default" : "secondary"} 
                        className="text-xs capitalize"
                      >
                        {dev.type}
                      </Badge>
                      <span className="text-muted-foreground text-xs">{dev.title}</span>
                      <span className="text-muted-foreground text-xs">({dev.date})</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Competitive Context */}
            {companySummary.competitiveContext && (
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              >
                <span className="text-sm text-foreground">Competitive Landscape:</span>
                <div className="text-xs text-muted-foreground">
                  <span className="text-foreground">Main Competitors:</span> {companySummary.competitiveContext.mainCompetitors.join(", ")}
                </div>
                {companySummary.competitiveContext.differentiators.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground">Key Differentiators:</span> {companySummary.competitiveContext.differentiators.join(", ")}
                  </div>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Add feedback section for company overview */}
          {messageId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              className="mt-4 pt-4 border-t border-border/50"
            >
              <MessageFeedback
                messageId={messageId}
                researchArea="company_overview"
                companyName={companySummary.name}
                userRole={userRole}
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ResearchFindingsCardProps {
  researchFindings?: any;
  sources?: Source[];
  messageId: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  onCitationClick: (messageId: string, sourceId: number) => void;
  highlightedSource: number | null;
  onFullAnalysisClick?: (researchAreaId: string) => void;
  userRole?: string;
  companyName?: string;
}

export function ResearchFindingsCard({ 
  researchFindings, 
  sources, 
  messageId, 
  activeTab, 
  onTabChange, 
  onCitationClick,
  highlightedSource,
  onFullAnalysisClick,
  userRole,
  companyName
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
        <Card className="bg-background border-l-4 border-l-primary overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full min-h-[300px]">
              <div className="flex items-center justify-between p-4 pb-0">
                <h3 className="findings-header flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{researchFindings.title}</span>
                </h3>
                
                <div className="flex items-center gap-3">
                  {onFullAnalysisClick && researchFindings.researchAreaId && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onFullAnalysisClick(researchFindings.researchAreaId)}
                        className="gap-2 text-xs h-8 btn-hover-lift"
                      >
                        <Eye className="w-3 h-3" />
                        Full Analysis
                      </Button>
                    </motion.div>
                  )}
                  
                  <div className="findings-tabs">
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
                  </div>
                </div>
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
                                className="bg-accent/30 rounded-lg p-4 card-hover"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 + vpIndex * 0.05, duration: 0.3 }}
                                whileHover={{ 
                                  scale: 1.01,
                                  backgroundColor: "var(--accent)/40",
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
            
            {/* Add feedback section for research findings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
              className="px-4 pb-4 pt-3 border-t border-border/50"
            >
              <MessageFeedback
                messageId={messageId}
                researchArea={researchFindings.researchAreaId}
                companyName={companyName}
                userRole={userRole}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}