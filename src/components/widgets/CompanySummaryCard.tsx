import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { CompanySummary } from '../../types/research-types';

interface CompanySummaryCardProps {
  companySummary: CompanySummary;
  className?: string;
}

export function CompanySummaryCard({ companySummary, className = "" }: CompanySummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className={`bg-accent/50 border-l-4 border-l-primary card-hover ${className}`}>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Company Header - Exact Figma Layout */}
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
              <span className="text-foreground font-medium">{companySummary.name}</span>
              <Badge variant="secondary">{companySummary.industry}</Badge>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{companySummary.size}</span>
            </motion.div>

            {/* Business Context - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {/* Location & Founded - Exact Figma Format */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{companySummary.location}</span>
                  {companySummary.founded && (
                    <>
                      <span>•</span>
                      <span>Founded {companySummary.founded}</span>
                    </>
                  )}
                </div>
                
                {/* Revenue & Valuation - Exact Figma Format */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold text-foreground">{companySummary.revenue}</span>
                  {companySummary.businessMetrics?.valuation && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-foreground">{companySummary.businessMetrics.valuation}</span>
                    </>
                  )}
                </div>

                {/* Business Model - Exact Figma Format */}
                {companySummary.businessModel && (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Business Model:</span> {companySummary.businessModel}
                  </div>
                )}

                {/* Market Position - Exact Figma Format */}
                {companySummary.marketPosition && (
                  <div className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Market Position:</span> {companySummary.marketPosition}
                  </div>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {/* Recent News - Exact Figma Format */}
                <div className="text-sm">
                  <span className="text-foreground font-medium">Recent:</span> 
                  <span className="text-muted-foreground ml-1">{companySummary.recentNews}</span>
                </div>

                {/* Growth & Customers - Exact Figma Format */}
                {companySummary.businessMetrics && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    {companySummary.businessMetrics.employeeGrowth && (
                      <div>
                        <span className="text-foreground font-medium">Growth:</span>
                        <span className="text-green-600 ml-1 font-semibold">{companySummary.businessMetrics.employeeGrowth}</span>
                      </div>
                    )}
                    {companySummary.businessMetrics.customerCount && (
                      <div>
                        <span className="text-foreground font-medium">Customers:</span>
                        <span className="text-muted-foreground ml-1 font-semibold">{companySummary.businessMetrics.customerCount}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Growth Stage - Exact Figma Format */}
                {companySummary.growthStage && (
                  <div className="text-sm">
                    <Badge variant="outline" className="text-xs">
                      {companySummary.growthStage}
                    </Badge>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Technology Stack - Exact Figma Format */}
            <motion.div 
              className="flex items-start gap-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Zap className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground text-sm font-medium">Tech Stack:</span>
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

            {/* Key Leadership - Exact Figma Format */}
            {companySummary.keyExecutives && companySummary.keyExecutives.length > 0 && (
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <span className="text-sm text-foreground font-medium">Key Leadership:</span>
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
                      <div className="text-foreground font-medium">{exec.name}</div>
                      <div className="text-xs text-muted-foreground">{exec.role}</div>
                      {exec.background && (
                        <div className="text-xs text-muted-foreground">{exec.background}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Developments - Exact Figma Format */}
            {companySummary.recentDevelopments && companySummary.recentDevelopments.length > 0 && (
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.3 }}
              >
                <span className="text-sm text-foreground font-medium">Recent Developments:</span>
                <div className="space-y-1">
                  {companySummary.recentDevelopments.slice(0, 3).map((dev, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                    >
                      <Badge variant="outline" className="text-xs capitalize">
                        {dev.type}
                      </Badge>
                      <span className="text-foreground">{dev.title}</span>
                      <span className="text-xs text-muted-foreground">({dev.date})</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Competitive Landscape - Exact Figma Format */}
            {companySummary.competitiveContext && (
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              >
                <span className="text-sm text-foreground font-medium">Competitive Landscape:</span>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-foreground font-medium">Main Competitors:</span>{' '}
                    <span className="text-muted-foreground">{companySummary.competitiveContext.mainCompetitors.slice(0, 4).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-foreground font-medium">Key Differentiators:</span>{' '}
                    <span className="text-muted-foreground">{companySummary.competitiveContext.differentiators.slice(0, 3).join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}