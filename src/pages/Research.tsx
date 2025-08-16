import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Send, Search, Building2, History, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import MessageList from "../components/research/MessageList";
import ExportSheet from "../components/research/ExportSheet";
import ResearchAnalysisSheet from "../components/research/ResearchAnalysisSheet";
import CompanySearch from "../components/research/CompanySearch";
import { getResearchAreas } from "../components/research-content/data";
import { getFollowUpOptions } from "../components/research-content/data";
import { getCompanyData } from "../components/research-content/data";
import { getMockSources } from "../utils/researchFindings";
import { getResearchFindings } from "../utils/researchFindings";
import { getStreamingSteps, downloadReport, parseCompanyFromInput, isResearchQuery } from "../utils/research-utils";
import { scrollToBottom, scrollToUserMessage, scrollToStreamingMessage, scrollToResearchFindings } from "../utils/scroll-utils";
import { Message, CompletedResearch } from "../types/research";
import { useProfile } from "../hooks/useProfile";
import { getResearchHistory, getCompanyResearch, saveCompanyResearch } from '../lib/api';

// Import centralized research areas for scroll detection
import { CORE_RESEARCH_AREAS } from "../data/research-areas";

// Define all research areas for scroll detection
const allResearchAreas = CORE_RESEARCH_AREAS.map(area => area.id);



export default function Research() {
  const { profile: userProfile, loading: profileLoading } = useProfile();

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
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load research history when user profile is available
  useEffect(() => {
    if (userProfile) {
      loadResearchHistory();
    }
  }, [userProfile]);

  // Load research history from backend (session-based)
  const loadResearchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      console.log('Loading research history via session...');
      const response = await getResearchHistory();
      console.log('Research history response:', response);
      setResearchHistory(response.companies || []);
    } catch (error) {
      console.error('Failed to load research history:', error);
      setResearchHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Auto-save research session whenever messages or completed research change
  useEffect(() => {
    if (currentCompany && (messages.length > 0 || completedResearch.length > 0)) {
      const timeoutId = setTimeout(() => {
        saveCurrentResearchSession();
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [currentCompany, messages, completedResearch]);

  // Simplified scroll positioning - avoid conflicts with manual research scrolling
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // For company summaries, scroll to show the user's question at the top
      if (lastMessage.type === "assistant" && lastMessage.companySummary) {
        // Find the corresponding user message (should be second to last)
        const userMessage = messages[messages.length - 2];
        if (userMessage && userMessage.type === "user") {
          setTimeout(() => {
            scrollToUserMessage(userMessage.id);
          }, 500); // Longer delay to ensure company card is fully rendered
        }
      }
      // For simple assistant responses (NO research-related scrolling here)
      else if (lastMessage.type === "assistant" && !lastMessage.companySummary && !lastMessage.options) {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    }
  }, [messages]);

  const handleCitationClick = (messageId: string, sourceId: number) => {
    console.log("🔗 Citation clicked! MessageId:", messageId, "SourceId:", sourceId);

    setActiveTabsState(prev => {
      const newState = {
        ...prev,
        [messageId]: "sources"
      };
      console.log("📱 Setting active tab state:", newState);
      return newState;
    });

    setHighlightedSource(sourceId);
    console.log("✨ Highlighting source:", sourceId);

    setTimeout(() => {
      setHighlightedSource(null);
      console.log("🔄 Removing highlight for source:", sourceId);
    }, 3000);
  };

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

  const simulateStreaming = (messageId: string, steps: Array<{ text: string; icon?: React.ReactNode }>, findings: any, researchArea: string) => {
    const streamingSteps = steps.map(step => ({ ...step, completed: false }));

    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, isStreaming: true, streamingSteps }
        : msg
    ));

    // Scroll to show the streaming progress after message is added
    setTimeout(() => {
      console.log("🚀 Triggering scroll to streaming message");
      scrollToStreamingMessage();
    }, 150); // Reduced delay for immediate scroll feedback

    steps.forEach((_, index) => {
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId && msg.streamingSteps
            ? {
              ...msg,
              streamingSteps: msg.streamingSteps.map((step, i) =>
                i === index ? { ...step, completed: true } : step
              )
            }
            : msg
        ));
      }, (index + 1) * 1000);
    });

    setTimeout(() => {
      const completedResearchItem: CompletedResearch = {
        id: messageId,
        title: findings.title,
        completedAt: new Date(),
        findings: findings,
        researchArea: researchArea // Store the research area ID so we can match it in ResearchProgress
      };

      setCompletedResearch(prev => [...prev, completedResearchItem]);

      // Update research history with completed area count - will be saved by the subsequent setMessages call
      // This is now handled by saveCurrentResearchSession

      const sources = getMockSources(currentCompany, researchArea);

      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
            ...msg,
            isStreaming: false,
            content: "",
            researchFindings: { ...findings, researchAreaId: researchArea },
            sources: sources,
            followUpOptions: getFollowUpOptions(researchArea)
          }
          : msg
      ));
      setIsTyping(false);

      // Scroll to show the completed research findings
      setTimeout(() => {
        console.log("✅ Triggering scroll from completed research");
        scrollToResearchFindings();
      }, 800); // Longer delay to ensure findings card is fully rendered and animations complete
    }, steps.length * 1000 + 500);
  };

  const handleSendMessage = (messageContent?: string) => {
    const messageToSend = messageContent || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const messageId = (Date.now() + 1).toString();

      if (isResearchQuery(messageToSend)) {
        const company = parseCompanyFromInput(messageToSend);
        setCurrentCompany(company);
        const companyData = getCompanyData(company);

        const summaryMessage: Message = {
          id: messageId,
          type: "assistant",
          content: "",
          timestamp: new Date(),
          companySummary: companyData,
        };

        setMessages(prev => [...prev, summaryMessage]);

        setTimeout(() => {
          const optionsMessageId = (Date.now() + 2).toString();
          const researchAreas = getResearchAreas(company, userProfile?.role || "Account Manager", userProfile?.company || "your company");

          const optionsMessage: Message = {
            id: optionsMessageId,
            type: "assistant",
            content: researchAreas.intro,
            timestamp: new Date(),
            options: researchAreas.options,
          };

          setMessages(prev => [...prev, optionsMessage]);
          setIsTyping(false);
        }, 2000);
      } else {
        const assistantMessage: Message = {
          id: messageId,
          type: "assistant",
          content: "I can help you research companies and prospects. Try asking me to 'Research [Company Name]' to get started with comprehensive discovery across 12 key areas including competitive positioning.",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }
    }, 1000);
  };

  const handleOptionClick = (optionId: string, optionText: string, format?: string) => {
    if (optionId === "export_report") {
      if (format) {
        handleDownloadReport(format as 'pdf' | 'powerpoint' | 'word' | 'excel' | 'json');
      } else {
        handleExportResearch();
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: optionText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Check if this is a research area for special handling
    const isResearchArea = allResearchAreas.includes(optionId);

    // Immediate scroll to show user message for quick feedback
    setTimeout(() => {
      scrollToBottom("instant");
    }, 50); // Very quick scroll to show user response

    setTimeout(() => {
      const messageId = (Date.now() + 1).toString();

      if (isResearchArea) {
        const streamingMessage: Message = {
          id: messageId,
          type: "assistant",
          content: `🔍 Analyzing ${optionText.toLowerCase()}...`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, streamingMessage]);

        const steps = getStreamingSteps(optionId);
        const findings = getResearchFindings(optionId, currentCompany);
        simulateStreaming(messageId, steps, findings, optionId);
      } else {
        if (optionId === "research_another") {
          // Save current session before switching
          saveCurrentResearchSession();
          setShowCompanySearch(true);
          setCurrentCompany("");
          setMessages([]);
          setCompletedResearch([]);
          setIsTyping(false);
          return;
        }

        const responses = {
          "create_outreach": "I'll help you create personalized outreach based on the decision makers we found...",
          "create_demo": "Let me prepare a technical demo outline based on their tech stack...",
          "create_pitch": "I'll create a solution pitch addressing their specific challenges...",
          "create_battlecard": "I'll create a competitive battle card with key talking points and objection handling...",
          "schedule_meeting": "I'll help you craft a meeting invitation with relevant talking points...",
          "create_proposal": "Let me draft a pricing proposal based on their budget indicators...",
          "schedule_demo": "I'll help you schedule a demo with the right stakeholders...",
          "schedule_followup": "I'll remind you to check for updates in 2 weeks..."
        };

        const assistantMessage: Message = {
          id: messageId,
          type: "assistant",
          content: responses[optionId as keyof typeof responses] || "Let me help you with that...",
          timestamp: new Date(),
          followUpOptions: [
            { id: "research_another", text: "Research another company", iconName: "Search", category: "explore" },
            { id: "export_report", text: "View Full Report", iconName: "Eye", category: "action" },
            { id: "schedule_followup", text: "Schedule follow-up research", iconName: "Calendar", category: "action" }
          ]
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }
    }, 200); // Reduced from 1000ms to 200ms for immediate feedback
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCompanySelect = async (company: any) => {
    console.log('Company selected:', company.name);
    console.log('Current research history:', researchHistory);
    
    setCurrentCompany(company.name);
    setShowCompanySearch(false);
    setMessages([]);
    setCompletedResearch([]);

    // Check if there's an existing session for this company
    const existingSession = researchHistory.find(item => item.company === company.name);
    console.log('Existing session found:', existingSession);
    
    if (existingSession) {
      try {
        console.log('Loading existing session for:', company.name);
        // Load the existing session
        const response = await getCompanyResearch(company.name);
        console.log('Research response:', response);
        
        setMessages(response.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
        setCompletedResearch(response.completedResearch.map((research: any) => ({
          id: research.id,
          title: research.title,
          completedAt: research.completedAt ? new Date(research.completedAt) : new Date(),
          researchArea: research.areaId,
          findings: research.data?.findings || {
            title: research.title,
            items: []
          }
        })));
      } catch (error) {
        console.error('Failed to load existing session:', error);
        // Fall back to creating a new session
        createNewResearchSession(company.name);
      }
    } else {
      console.log('No existing session found, creating new session for:', company.name);
      // Create a new session
      createNewResearchSession(company.name);
    }
    
    // Reload research history to ensure it's up to date
    await loadResearchHistory();
  };

  // Auto-save current research session to backend
  const saveCurrentResearchSession = async () => {
    if (!currentCompany || !userProfile) return;

    try {
      console.log('Saving research session for:', currentCompany);
      const sessionData = {
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        completedResearch: completedResearch.map(research => ({
          id: research.id,
          areaId: research.researchArea || research.id,
          title: research.title,
          status: 'completed' as const,
          completedAt: research.completedAt?.toISOString(),
          data: {
            findings: research.findings
          }
        })),
        metadata: {
          userRole: userProfile.role,
          userCompany: userProfile.company,
          lastActivity: new Date().toISOString(),
        },
      };

      console.log('Session data to save:', sessionData);
      // Always save/update the company research
      await saveCompanyResearch(currentCompany, sessionData);
      console.log('Research session saved successfully');
      
      // Reload research history to include the newly saved session
      await loadResearchHistory();
    } catch (error) {
      console.error('Failed to save research session:', error);
    }
  };

  const createNewResearchSession = (companyName: string) => {
    // Create initial research conversation
    setTimeout(() => {
      const userMessageId = Date.now().toString();
      const userMessage: Message = {
        id: userMessageId,
        type: "user",
        content: `Research ${companyName}`,
        timestamp: new Date(),
      };

      setMessages([userMessage]);

      setTimeout(() => {
        const messageId = (Date.now() + 1).toString();
        const companyData = getCompanyData(companyName);

        const summaryMessage: Message = {
          id: messageId,
          type: "assistant",
          content: "",
          timestamp: new Date(),
          companySummary: companyData,
        };

        setMessages(prev => [...prev, summaryMessage]);

        setTimeout(() => {
          const optionsMessageId = (Date.now() + 2).toString();
          const researchAreas = getResearchAreas(companyName, userProfile?.role || "Account Manager", userProfile?.company || "your company");

          const optionsMessage: Message = {
            id: optionsMessageId,
            type: "assistant",
            content: researchAreas.intro,
            timestamp: new Date(),
            options: researchAreas.options,
          };

          setMessages(prev => [...prev, optionsMessage]);
        }, 500);
      }, 300);
    }, 200);
  };

  const handleLoadPreviousResearch = async (company: string) => {
    if (company === currentCompany) return;

    // Save current session before switching
    if (currentCompany && (messages.length > 0 || completedResearch.length > 0)) {
      await saveCurrentResearchSession();
    }

    // Find the saved research session for this company
    const existingSession = researchHistory.find(item => item.company === company);

    if (existingSession) {
      try {
        // Load the saved session
        const response = await getCompanyResearch(company);
        console.log('Loading previous research response:', response);
        
        setCurrentCompany(company);
        setMessages(response.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
        setCompletedResearch(response.completedResearch.map((research: any) => ({
          id: research.id,
          title: research.title,
          completedAt: research.completedAt ? new Date(research.completedAt) : new Date(),
          researchArea: research.areaId,
          findings: research.data?.findings || {
            title: research.title,
            items: []
          }
        })));
      } catch (error) {
        console.error('Failed to load previous research:', error);
        // Fall back to creating a new session
        createNewResearchSession(company);
      }
    } else {
      // Create a new session
      createNewResearchSession(company);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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

            {/* Research History Dropdown - Always available */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentCompany ? (
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{currentCompany}</h3>
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {completedResearch.length} area{completedResearch.length !== 1 ? 's' : ''} researched
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Started {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Company Research</h3>
                    <p className="text-xs text-muted-foreground">
                      Select a company to begin research
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Research History Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <History className="w-4 h-4" />
                    History
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {(() => {
                    console.log('Rendering research history dropdown. researchHistory:', researchHistory);
                    console.log('researchHistory.length:', researchHistory.length);
                    console.log('isLoadingHistory:', isLoadingHistory);
                    
                    if (isLoadingHistory) {
                      return (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          Loading history...
                        </div>
                      );
                    } else if (researchHistory.length > 0) {
                      return (
                        <>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            Recent Research
                          </div>
                          {researchHistory.slice(0, 5).map((item) => (
                            <DropdownMenuItem
                              key={item.company}
                              className="flex items-center justify-between"
                              onClick={() => handleLoadPreviousResearch(item.company)}
                            >
                              <div>
                                <div className="font-medium">{item.company}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(item.lastUpdated).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.completedAreas} areas
                              </div>
                            </DropdownMenuItem>
                          ))}
                          {researchHistory.length > 5 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-center text-xs text-muted-foreground">
                                +{researchHistory.length - 5} more
                              </DropdownMenuItem>
                            </>
                          )}
                        </>
                      );
                    } else {
                      return (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          No research history yet
                        </div>
                      );
                    }
                  })()}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Switch Company Button - Only show when a company is selected */}
              {currentCompany && (
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Save current session before switching
                    saveCurrentResearchSession();
                    setShowCompanySearch(true);
                    setCurrentCompany("");
                    // Clear current research session
                    setMessages([]);
                    setCompletedResearch([]);
                  }}
                  className="gap-2"
                >
                  <Search className="w-4 h-4" />
                  Switch Company
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

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
                  onCompanySelect={handleCompanySelect}
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
            availableResearchAreas={allResearchAreas}
            completedResearch={completedResearch}
            onTabChange={handleTabChange}
            onCitationClick={handleCitationClick}
            onOptionClick={handleOptionClick}
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
                onKeyPress={handleKeyPress}
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
                <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isTyping}>
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
                    onClick={() => handleSendMessage(text)}
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