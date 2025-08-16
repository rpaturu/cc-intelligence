import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Building2, Search, MapPin, Users, DollarSign, Zap, ArrowRight, Globe, X } from "lucide-react";

interface CompanySearchProps {
  onCompanySelect: (company: CompanyResult) => void;
  onClose?: () => void;
  placeholder?: string;
}

interface CompanyResult {
  id: string;
  name: string;
  domain: string;
  industry: string;
  description: string;
  location: string;
  employees: string;
  revenue?: string;
  logo?: string;
  verified: boolean;
  marketCap?: string;
  founded?: string;
}

// Mock company data - in real app this would come from an external API
const mockCompanyResults: CompanyResult[] = [
  {
    id: "microsoft",
    name: "Microsoft",
    domain: "microsoft.com",
    industry: "Technology - Cloud & Productivity Software",
    description: "Global technology leader focusing on cloud services, productivity software, and enterprise solutions.",
    location: "Redmond, WA",
    employees: "221,000 employees",
    revenue: "$211B",
    verified: true,
    marketCap: "$2.8T",
    founded: "1975"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    domain: "salesforce.com", 
    industry: "Technology - CRM & Cloud Software",
    description: "Leading customer relationship management platform with comprehensive business automation tools.",
    location: "San Francisco, CA",
    employees: "79,000 employees",
    revenue: "$31.4B",
    verified: true,
    marketCap: "$215B",
    founded: "1999"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    domain: "hubspot.com",
    industry: "Technology - Marketing Automation",
    description: "Inbound marketing, sales, and customer service platform for growing businesses.",
    location: "Cambridge, MA", 
    employees: "7,800 employees",
    revenue: "$1.7B",
    verified: true,
    marketCap: "$26B",
    founded: "2006"
  },
  {
    id: "okta",
    name: "Okta",
    domain: "okta.com",
    industry: "Technology - Identity & Access Management",
    description: "Leading identity and access management platform for secure digital transformation.",
    location: "San Francisco, CA",
    employees: "5,600 employees", 
    revenue: "$1.9B",
    verified: true,
    marketCap: "$12B",
    founded: "2009"
  },
  {
    id: "zoom",
    name: "Zoom",
    domain: "zoom.us",
    industry: "Technology - Video Communications",
    description: "Video-first unified communications platform for modern distributed workforce.",
    location: "San Jose, CA",
    employees: "8,400 employees",
    revenue: "$4.4B", 
    verified: true,
    marketCap: "$20B",
    founded: "2011"
  },
  {
    id: "slack",
    name: "Slack",
    domain: "slack.com",
    industry: "Technology - Workplace Collaboration",
    description: "Business communication platform bringing teams together through organized conversations.",
    location: "San Francisco, CA",
    employees: "2,500 employees",
    revenue: "$1.5B",
    verified: true,
    founded: "2009"
  },
  {
    id: "stripe",
    name: "Stripe",
    domain: "stripe.com",
    industry: "Financial Technology - Payments",
    description: "Online payment processing platform for internet businesses of all sizes.",
    location: "San Francisco, CA",
    employees: "4,000 employees",
    revenue: "$12B",
    verified: true,
    marketCap: "$95B",
    founded: "2010"
  },
  {
    id: "figma",
    name: "Figma",
    domain: "figma.com",
    industry: "Technology - Design & Collaboration",
    description: "Web-based vector graphics editor and prototyping tool for UI/UX design.",
    location: "San Francisco, CA",
    employees: "800 employees",
    revenue: "$400M",
    verified: true,
    marketCap: "$20B",
    founded: "2012"
  },
  {
    id: "notion",
    name: "Notion",
    domain: "notion.so",
    industry: "Technology - Productivity Software",
    description: "All-in-one workspace for notes, docs, databases, and project management.",
    location: "San Francisco, CA",
    employees: "400 employees",
    revenue: "$120M",
    verified: true,
    marketCap: "$10B",
    founded: "2016"
  },
  {
    id: "airbnb",
    name: "Airbnb",
    domain: "airbnb.com",
    industry: "Technology - Travel & Hospitality",
    description: "Online marketplace for short-term lodging and tourism experiences.",
    location: "San Francisco, CA",
    employees: "6,800 employees",
    revenue: "$8.4B",
    verified: true,
    marketCap: "$75B",
    founded: "2008"
  }
];

export { type CompanyResult };

export default function CompanySearch({ onCompanySelect, onClose, placeholder = "Enter company name or domain..." }: CompanySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Mock search function - in real app this would call external API
  const searchCompanies = async (query: string): Promise<CompanyResult[]> => {
    if (!query || query.length < 2) return [];
    
    // Simulate external API call with realistic filtering
    const filtered = mockCompanyResults.filter(company => 
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.domain.toLowerCase().includes(query.toLowerCase()) ||
      company.industry.toLowerCase().includes(query.toLowerCase())
    );
    
    // Simulate API delay and network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return filtered.slice(0, 8); // Limit results like a real API would
  };

  const handleSearchClick = async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      return;
    }

    // Immediately clear old results to prevent flashing
    setResults([]);
    setIsSearching(true);
    setShowResults(true);
    setHasSearched(true);
    
    try {
      console.log("🔍 Triggering external API search for:", searchTerm);
      const searchResults = await searchCompanies(searchTerm);
      setResults(searchResults);
      console.log("✅ API search completed. Results:", searchResults.length);
    } catch (error) {
      console.error("❌ External API search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handleCompanySelect = (company: CompanyResult) => {
    console.log("🏢 Company selected:", company.name);
    onCompanySelect(company);
    clearSearch();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const startNewSearch = () => {
    clearSearch();
  };

  const popularSuggestions = mockCompanyResults.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 pb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  Company Research
                  <motion.span 
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasSearched ? "Search again or select from results below" : "Enter a company name and click search to begin"}
                </p>
              </div>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Search Input with Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className="pl-10 pr-4 py-3 bg-background border-border/50 focus:border-primary transition-colors"
                  disabled={isSearching}
                />
              </div>
              
              <Button
                onClick={handleSearchClick}
                disabled={!searchTerm.trim() || searchTerm.length < 2 || isSearching}
                className="px-6 py-3 gap-2 min-w-[120px]"
                size="default"
              >
                {isSearching ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </Button>

              {/* New Search button when there are results */}
              {hasSearched && !isSearching && (
                <Button
                  onClick={startNewSearch}
                  variant="outline"
                  size="default"
                  className="px-4"
                >
                  New Search
                </Button>
              )}
            </div>

            {/* Search guidance */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-muted-foreground mt-2 flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              {isSearching ? (
                "Connecting to external API for real-time company data..."
              ) : hasSearched ? (
                `Found ${results.length} ${results.length === 1 ? 'company' : 'companies'} matching "${searchTerm}"`
              ) : (
                "Press Enter or click Search • Minimum 2 characters required"
              )}
            </motion.div>
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="border-t border-border/50"
              >
                <div className="p-4 pt-3 max-h-96 overflow-y-auto export-sheet-scroll">
                  {results.length > 0 ? (
                    <div className="space-y-2">
                      <motion.h4 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4" />
                        Search Results ({results.length})
                        <Badge variant="secondary" className="text-xs">
                          Live Data
                        </Badge>
                      </motion.h4>
                      
                      <AnimatePresence mode="wait">
                        {results.map((company, index) => (
                          <motion.div
                            key={company.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ 
                              delay: index * 0.03,
                              duration: 0.25,
                              ease: "easeOut" 
                            }}
                            whileHover={{ 
                              scale: 1.02,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <Button
                              variant="ghost"
                              className="w-full p-4 h-auto text-left justify-start bg-card/50 border border-border/30 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 overflow-hidden"
                              onClick={() => handleCompanySelect(company)}
                            >
                              <div className="flex items-start gap-3 w-full">
                                <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                                  <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                
                                <div className="flex-1 space-y-2 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-medium">{company.name}</h5>
                                        {company.verified && (
                                          <Badge variant="secondary" className="text-xs">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                                            Verified
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">{company.domain}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                                  </div>
                                  
                                  <p className="text-xs text-muted-foreground break-words whitespace-normal">{company.description}</p>
                                  
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <MapPin className="w-3 h-3" />
                                      <span>{company.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Users className="w-3 h-3" />
                                      <span>{company.employees}</span>
                                    </div>
                                    {company.revenue && (
                                      <div className="flex items-center gap-1 text-muted-foreground">
                                        <DollarSign className="w-3 h-3" />
                                        <span>{company.revenue}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Globe className="w-3 h-3" />
                                      <span>{company.industry.split(' - ')[0]}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : isSearching ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-3"
                      >
                        <Zap className="w-8 h-8 text-primary" />
                      </motion.div>
                      <p className="font-medium">Searching external API...</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Finding companies matching "{searchTerm}"
                      </p>
                      <div className="mt-3 text-xs text-muted-foreground bg-muted/30 rounded px-3 py-2 max-w-sm mx-auto">
                        💡 This search uses real external API calls
                      </div>
                    </motion.div>
                  ) : hasSearched ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No companies found</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        No results for "{searchTerm}". Try a different company name or domain.
                      </p>
                      <Button onClick={startNewSearch} variant="outline" size="sm">
                        Try Another Search
                      </Button>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Popular Companies - Only show when not searching/showing results */}
          {!showResults && !hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="border-t border-border/50"
            >
              <div className="p-4 pt-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Popular Companies
                  <Badge variant="outline" className="text-xs">
                    Quick Start
                  </Badge>
                </h4>
                <div className="grid gap-2">
                  {popularSuggestions.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.3 + index * 0.1,
                        duration: 0.3,
                        ease: "easeOut" 
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3 bg-card/30 border border-border/20 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                        onClick={() => handleCompanySelect(company)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="bg-primary/10 rounded-lg p-2">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{company.name}</span>
                                  {company.verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground break-words">
                                  {company.industry.split(' - ')[1] || company.industry}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 Can't find your company? Use the search above to access our comprehensive database
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}