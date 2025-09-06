import { motion } from "motion/react";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { BarChart3, MapPin, TrendingUp, Zap } from "lucide-react";
import { CompanyData } from "../../../types/research";
import MessageFeedback from "../MessageFeedback";

interface CompanyOverviewCardProps {
  companySummary: CompanyData;
  messageId?: string;
  userRole?: string;
}

export function CompanyOverviewCard({ companySummary, messageId, userRole }: CompanyOverviewCardProps) {
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
              className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                <BarChart3 className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-foreground font-medium min-w-0 flex-1">{companySummary.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{companySummary.industry}</Badge>
                <span className="text-muted-foreground hidden sm:inline">|</span>
                <span className="text-muted-foreground text-sm">{companySummary.size}</span>
              </div>
            </motion.div>

            {/* Business Context */}
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                    <span>{companySummary.location}</span>
                  </div>
                  {companySummary.founded && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex-shrink-0">Founded {companySummary.founded}</span>
                    </>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <TrendingUp className="w-4 h-4" />
                    <span>{companySummary.revenue}</span>
                  </div>
                  {companySummary.businessMetrics?.valuation && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex-shrink-0">{companySummary.businessMetrics.valuation}</span>
                    </>
                  )}
                </div>

                {companySummary.businessModel && (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Business Model:</span> {companySummary.businessModel}
                  </div>
                )}

                {companySummary.marketPosition && (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Market Position:</span> {companySummary.marketPosition}
                  </div>
                )}
              </motion.div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {/* Recent News */}
                <div className="text-sm">
                  <span className="text-foreground font-medium">Recent:</span> 
                  <span className="text-muted-foreground ml-1 break-words">{companySummary.recentNews}</span>
                </div>

                {/* Growth and Customers - Two Column Layout */}
                {(companySummary.businessMetrics?.revenueGrowth || companySummary.businessMetrics?.customerCount) && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {companySummary.businessMetrics?.revenueGrowth && (
                      <div className="flex items-center gap-1">
                        <span className="text-foreground font-medium">Growth:</span>
                        <span className="text-green-600">{companySummary.businessMetrics.revenueGrowth}</span>
                      </div>
                    )}
                    {companySummary.businessMetrics?.customerCount && (
                      <div className="flex items-center gap-1">
                        <span className="text-foreground font-medium">Customers:</span>
                        <span className="text-muted-foreground">{companySummary.businessMetrics.customerCount}</span>
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
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Zap className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">Tech Stack:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {companySummary.techStack.map((tech, index) => (
                      <motion.div
                        key={`tech-${tech}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05, duration: 0.2 }}
                      >
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Leadership */}
            {companySummary.keyExecutives && companySummary.keyExecutives.length > 0 && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <span className="text-sm text-foreground font-medium">Key Leadership:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
                  {companySummary.keyExecutives.slice(0, 4).map((exec, index) => (
                    <motion.div 
                      key={`exec-${exec.name}-${index}`}
                      className="text-sm bg-background/50 rounded-lg p-3 card-hover"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      <div className="text-foreground font-medium break-words">{exec.name}</div>
                      <div className="text-xs text-muted-foreground break-words">{exec.role}</div>
                      {exec.background && (
                        <div className="text-xs text-muted-foreground break-words mt-1">{exec.background}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Developments */}
            {companySummary.recentDevelopments && companySummary.recentDevelopments.length > 0 && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.3 }}
              >
                <span className="text-sm text-foreground font-medium">Recent Developments:</span>
                <div className="space-y-2">
                  {companySummary.recentDevelopments.slice(0, 3).map((dev, index) => (
                    <motion.div 
                      key={`dev-${dev.title}-${index}`}
                      className="flex flex-wrap items-start gap-2 text-sm"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                    >
                      <Badge 
                        variant={dev.impact === "high" ? "default" : "secondary"} 
                        className="text-xs capitalize flex-shrink-0"
                      >
                        {dev.type}
                      </Badge>
                      <span className="text-muted-foreground text-xs flex-1 break-words">{dev.title}</span>
                      <span className="text-muted-foreground text-xs flex-shrink-0">({dev.date})</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Competitive Context */}
            {companySummary.competitiveContext && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              >
                <span className="text-sm text-foreground font-medium">Competitive Landscape:</span>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Main Competitors:</span> 
                    <span className="break-words ml-1">
                      {companySummary.competitiveContext.mainCompetitors?.join(", ") || "Not available"}
                    </span>
                  </div>
                  {companySummary.competitiveContext.differentiators?.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">Key Differentiators:</span> 
                      <span className="break-words ml-1">
                        {companySummary.competitiveContext.differentiators?.join(", ") || "Not available"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Add feedback section for company overview */}
          {messageId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              className="mt-6 pt-4 border-t border-border/50"
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