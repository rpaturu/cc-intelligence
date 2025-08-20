import { motion } from "motion/react";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Building, Layers, GitBranch, Star } from "lucide-react";
import { VendorProfile } from "../../../types/research";

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
