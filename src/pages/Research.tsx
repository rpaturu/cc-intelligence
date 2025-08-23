import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Send, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import MessageList from "../components/research/MessageList";
import ExportSheet from "../components/research/ExportSheet";
import ResearchAnalysisSheet from "../components/research/ResearchAnalysisSheet";
import CompanySearch from "../components/research/CompanySearch";
import { getResearchAreas } from "../components/research-content/data";
import { downloadReport } from "../utils/research-utils";
import { researchProgressManager } from "../components/research/ResearchProgressManager";
import { ResearchService } from "../services/ResearchService";
import { SessionService } from "../services/SessionService";
import { EventHandlerService } from "../services/EventHandlerService";
import { MessageService } from "../services/MessageService";
// import { scrollToBottom, scrollToUserMessage } from "../utils/scroll-utils"; // Moved to MessageService
import { Message, CompletedResearch } from "../types/research";
import { useProfile } from "../hooks/useProfile";
import { /* getResearchHistory, */ } from '../lib/api';

// Import centralized research areas for scroll detection
import { CORE_RESEARCH_AREAS } from "../data/research-areas";

// Define all research areas for scroll detection (full objects for ResearchProgress)
// const allResearchAreaIds = CORE_RESEARCH_AREAS.map(area => area.id); // Moved to EventHandlerService

export default function Research() {
  const { profile: userProfile, loading: profileLoading } = useProfile();
  const [searchParams] = useSearchParams();

  // Early return with loading state if profile is not yet available
  if (profileLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your research profile...</p>
        </div>
      </div>
    );
  }

  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<string>("");
  const [completedResearch, setCompletedResearch] = useState<CompletedResearch[]>([]);
  const [isExportSheetOpen, setIsExportSheetOpen] = useState(false);
  const [isAnalysisSheetOpen, setIsAnalysisSheetOpen] = useState(false);
  const [selectedResearchAreaId, setSelectedResearchAreaId] = useState<string | null>(null);
  const [activeTabsState, setActiveTabsState] = useState<Record<string, string>>({});
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);
  const [showCompanySearch, setShowCompanySearch] = useState(true);
  const [researchHistory, setResearchHistory] = useState<Array<{
    company: string;
    lastUpdated: string;
    completedAreas: number;
    lastActivity?: string;
  }>>([]);
  // Calculate available research areas dynamically as all areas minus completed ones
  const availableResearchAreas = CORE_RESEARCH_AREAS.filter(area => 
    !completedResearch.some(completed => completed.researchArea === area.id)
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load research history when user profile is available
  useEffect(() => {
    if (userProfile) {
      loadResearchHistory();
      
      // Check for pending research data that might have been saved during session expiry
      const sessionService = new SessionService({
        setMessages,
        setCompletedResearch,
        setCurrentCompany,
        setShowCompanySearch,
        setResearchHistory,
        userProfile,
        messages,
        completedResearch,
        currentCompany
      });
      
      sessionService.processPendingResearchData();
    }
  }, [userProfile]);

  // Use SessionService for session expiry handling
  useEffect(() => {
    const sessionService = new SessionService({
      setMessages,
      setCompletedResearch,
      setCurrentCompany,
      setShowCompanySearch,
      setResearchHistory,
      userProfile,
      messages,
      completedResearch,
      currentCompany
    });

    const handleSessionExpired = async () => {
      console.log('Research: Session expired event received, saving research before logout');
      
      try {
        await sessionService.handleSessionExpired();
        console.log('Research: Research session saved successfully before logout');
      } catch (error) {
        console.error('Research: Error saving research session before logout:', error);
      }
      
      // Force redirect to login after attempting to save
      window.location.href = '/login';
    };

    const handleBeforeUnload = async () => {
      if (currentCompany && (messages.length > 0 || completedResearch.length > 0)) {
        console.log('Research: Page unload detected, saving research data');
        await sessionService.handleBeforeUnload();
      }
    };

    // Add event listeners
    window.addEventListener('sessionExpired', handleSessionExpired);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentCompany, messages, completedResearch, userProfile]);

  // Check for company parameter in URL and load company research
  useEffect(() => {
    if (userProfile) {
      const companyParam = searchParams.get('company');
      if (companyParam) {
        const decodedCompany = decodeURIComponent(companyParam);
        console.log('Loading company from URL parameter:', decodedCompany);
        loadCompanyResearch(decodedCompany);
      }
    }
  }, [userProfile, searchParams]);

  // Initialize progress manager
  useEffect(() => {
    researchProgressManager.initialize(setMessages);
  }, []);

  const loadResearchHistory = async () => {
    const sessionService = new SessionService({
      setMessages,
      setCompletedResearch,
      setCurrentCompany,
      setShowCompanySearch,
      setResearchHistory,
      userProfile,
      messages,
      completedResearch,
      currentCompany
    });
    
    await sessionService.loadResearchHistory();
  };

  const loadCompanyResearch = async (companyName: string) => {
    const sessionService = new SessionService({
      setMessages,
      setCompletedResearch,
      setCurrentCompany,
      setShowCompanySearch,
      setResearchHistory,
      userProfile,
      messages,
      completedResearch,
      currentCompany
    });
    
    await sessionService.loadCompanyResearch(companyName);
  };

  // Auto-save research session whenever messages or completed research change
  // const [isLoadingExistingData, setIsLoadingExistingData] = useState(false); // COMMENTED OUT for testing
  
  // COMMENTED OUT: Auto-save research session for testing
  // useEffect(() => {
  //   if (currentCompany && (messages.length > 0 || completedResearch.length > 0) && !isLoadingExistingData) {
  //     const timeoutId = setTimeout(() => {
  //       saveCurrentResearchSession();
  //     }, 1000); // Debounce saves by 1 second

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [currentCompany, messages, completedResearch, isLoadingExistingData]);


  const handleTabChange = (messageId: string, value: string) => {
    console.log("🔄 Tab changed for message:", messageId, "to:", value);
    setActiveTabsState(prev => ({
      ...prev,
      [messageId]: value
    }));
  };

  const handleExportResearch = () => {
    setIsExportSheetOpen(true);
  };

  const handleDownloadReport = (format: 'pdf' | 'powerpoint' | 'word' | 'excel' | 'json') => {
    if (userProfile) {
      downloadReport(currentCompany, userProfile, completedResearch, format);
    }
  };

  const handleFullAnalysisClick = (researchAreaId: string) => {
    setSelectedResearchAreaId(researchAreaId);
    setIsAnalysisSheetOpen(true);
  };

  const startRealResearch = async (messageId: string, researchAreaId: string, companyName?: string) => {
    const researchService = new ResearchService({
      setMessages,
      setCompletedResearch,
      setIsTyping,
      userProfile,
      currentCompany
    });
    
    await researchService.startRealResearch(messageId, researchAreaId, companyName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      eventHandlerService.handleSendMessage();
    }
  };

  const saveCurrentResearchSession = async () => {
    const sessionService = new SessionService({
      setMessages,
      setCompletedResearch,
      setCurrentCompany,
      setShowCompanySearch,
      setResearchHistory,
      userProfile,
      messages,
      completedResearch,
      currentCompany
    });
    
    await sessionService.saveCurrentResearchSession();
  };

  // Create EventHandlerService instance after all function declarations
  const eventHandlerService = new EventHandlerService({
    setMessages,
    setInputValue,
    setIsTyping,
    setCurrentCompany,
    setShowCompanySearch,
    setCompletedResearch,
    setResearchHistory,
    inputValue,
    messages,
    completedResearch,
    researchHistory,
    userProfile,
    startRealResearch,
    handleDownloadReport,
    handleExportResearch
  });

  // Create MessageService instance for message handling
  const messageService = new MessageService({
    setMessages,
    setActiveTabsState,
    setHighlightedSource,
    messages,
    currentCompany
  });

  // Use MessageService for message scrolling
  useEffect(() => {
    messageService.handleMessageScrolling();
  }, [messages]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        currentCompany={currentCompany}
        areasResearched={completedResearch.length}
        totalAreas={13}
        onCompanySwitch={() => {
          setShowCompanySearch(true);
          setCurrentCompany("");
          setMessages([]);
          setCompletedResearch([]);
        }}
        onHistoryClick={() => {
          // This will be called when user selects a company from history
          // We can add logic here to handle the selection if needed
          console.log('History company selected');
        }}
      />

      <ExportSheet
        isOpen={isExportSheetOpen}
        onOpenChange={setIsExportSheetOpen}
        currentCompany={currentCompany}
        user={userProfile}
        messages={messages}
        completedResearch={completedResearch}
        onDownloadReport={handleDownloadReport}
      />

      <ResearchAnalysisSheet
        isOpen={isAnalysisSheetOpen}
        onClose={() => setIsAnalysisSheetOpen(false)}
        researchAreaId={selectedResearchAreaId}
        onResearchAreaNavigation={(areaId) => {
          // Handle research area navigation
          console.log('Navigating to research area:', areaId);
        }}
      />

      {/* Chat Interface */}
      <motion.div
        className={`max-w-4xl mx-auto px-4 pb-4 ${currentCompany ? 'pt-20' : 'pt-24'} min-h-screen flex flex-col`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={`flex-1 overflow-y-auto space-y-4 ${currentCompany ? 'mb-4' : ''} pt-4`}>
          {/* Company Search - Show prominently when no company is being researched */}
          <AnimatePresence>
            {showCompanySearch && !currentCompany && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <CompanySearch
                  onCompanySelect={(company) => eventHandlerService.handleCompanySelect(company)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced welcome text when no company is selected */}
          {!currentCompany && !showCompanySearch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="mb-6">
                <div className="bg-primary/10 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Search className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Start Your Research</h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-lg mb-6">
                  Search for any company to begin comprehensive research across 12 key intelligence areas with AI-powered insights and source references.
                </p>
                <Button
                  onClick={() => setShowCompanySearch(true)}
                  className="gap-2"
                  size="lg"
                >
                  <Search className="w-4 h-4" />
                  Search Companies
                </Button>
              </div>
            </motion.div>
          )}

          <MessageList
            messages={messages}
            user={userProfile}
            activeTabsState={activeTabsState}
            highlightedSource={highlightedSource}
            availableResearchAreas={availableResearchAreas}
            completedResearch={completedResearch}
            onTabChange={handleTabChange}
            onCitationClick={(messageId: string, sourceId: number) => messageService.handleCitationClick(messageId, sourceId)}
                            onOptionClick={(optionId: string, optionText: string) => eventHandlerService.handleOptionClick(optionId, optionText)}
            onFullAnalysisClick={handleFullAnalysisClick}
          />

          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex gap-3 max-w-3xl">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} className="messages-end-marker" />
        </div>

        {/* Only show bottom interface when a company is selected */}
        {currentCompany && (
          <motion.div
            className="border-t pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={currentCompany ? `Ask me about ${currentCompany}...` : "Ask me to research a company, e.g., 'Research Acme Corp'"}
                className="flex-1"
                disabled={isTyping}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentCompany) {
                      // Save current session before switching
                      saveCurrentResearchSession();
                    }
                    setShowCompanySearch(true);
                    setCurrentCompany("");
                    setMessages([]);
                    setCompletedResearch([]);
                  }}
                  disabled={isTyping}
                  className="px-3"
                  title={currentCompany ? "Research another company" : "Search companies"}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => eventHandlerService.handleSendMessage()} disabled={!inputValue.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="mt-2 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {(() => {
                // Generate contextual suggestions based on current state
                const getContextualSuggestions = () => {
                  // If a company is currently being researched, show progressive suggestions
                  if (currentCompany) {
                    // Get completed research areas
                    const completedAreas = completedResearch.map(r => r.researchArea);

                    // If no research completed yet, show entry-level questions
                    if (completedResearch.length === 0) {
                      return [
                        `Who are the key decision makers at ${currentCompany}?`,
                        `What challenges is ${currentCompany} facing?`,
                        `What's ${currentCompany}'s current tech stack?`
                      ];
                    }

                    // If some research completed, suggest follow-up areas
                    if (completedResearch.length > 0) {
                      // Get available research areas that haven't been completed
                      const researchAreas = getResearchAreas(currentCompany, userProfile?.role || "Account Manager", userProfile?.company || "your company");
                      const availableAreas = researchAreas.options.filter(area => !completedAreas.includes(area.id));

                      if (availableAreas.length > 0) {
                        const nextAreas = availableAreas.slice(0, 3);
                        return nextAreas.map(area => area.text);
                      }
                    }

                    // If most research completed, show synthesis questions
                    if (completedResearch.length >= 3) {
                      return [
                        `Create outreach strategy for ${currentCompany}`,
                        `Summarize key findings for ${currentCompany}`,
                        `What's the best approach for ${currentCompany}?`
                      ];
                    }

                    // Default company-specific questions
                    return [
                      `Tell me more about ${currentCompany}`,
                      `What should I know about ${currentCompany}?`,
                      `How can I approach ${currentCompany}?`
                    ];
                  }

                  // If no company selected, show research suggestions based on user context
                  const userCompany = userProfile?.company?.toLowerCase();
                  const userFocus = userProfile?.salesFocus;
                  const userTerritory = userProfile?.territory;

                  // Company-specific competitive intelligence suggestions
                  if (userCompany === 'okta') {
                    return ["Research Microsoft", "Research CrowdStrike", "Research Auth0"];
                  } else if (userCompany === 'salesforce') {
                    return ["Research Microsoft", "Research HubSpot", "Research Oracle"];
                  } else if (userCompany === 'hubspot') {
                    return ["Research Salesforce", "Research Marketo", "Research Pipedrive"];
                  }

                  // Focus-based suggestions
                  if (userFocus === 'enterprise') {
                    return ["Research Microsoft", "Research Oracle", "Research IBM"];
                  } else if (userFocus === 'mid-market') {
                    return ["Research HubSpot", "Research Zendesk", "Research Slack"];
                  } else if (userFocus === 'smb') {
                    return ["Research Shopify", "Research Square", "Research Zoom"];
                  }

                  // Territory-based suggestions
                  if (userTerritory === 'europe') {
                    return ["Research SAP", "Research Spotify", "Research ASML"];
                  } else if (userTerritory === 'asia-pacific') {
                    return ["Research Toyota", "Research Samsung", "Research Alibaba"];
                  }

                  // Default suggestions
                  return ["Research Microsoft", "Research Tesla", "Research Shopify"];
                };

                return getContextualSuggestions();
              })().map((text, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => eventHandlerService.handleSendMessage(text)}
                    disabled={isTyping}
                  >
                    {text}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}