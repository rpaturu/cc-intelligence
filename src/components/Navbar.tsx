import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "./ui/sheet";
import { Search, ChevronDown, Sparkles,  LogOut, Building2, Clock, Shuffle, Settings, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { getInitials } from "../utils";
import { useNavigate, useLocation } from "react-router-dom";
import { getResearchHistory } from "../lib/api";

interface ResearchSession {
  id: string;
  company: string;
  areasResearched: number;
  totalAreas: number;
  startedAt: Date;
  lastActivity: Date;
  status: "active" | "completed" | "paused";
}

interface CompanyHistory {
  company: string;
  sessions: ResearchSession[];
  totalResearchTime: number;
  insights: number;
}

interface NavbarProps {
  currentCompany?: string;
  areasResearched?: number;
  totalAreas?: number;
  onCompanySwitch?: () => void;
  onHistoryClick?: () => void;
  currentPage?: string;
}

export default function Navbar(props: NavbarProps = {}) {
  const { 
    currentCompany, 
    areasResearched = 0, 
    totalAreas = 13, 
    onCompanySwitch, 
    onHistoryClick,
    currentPage: propCurrentPage
  } = props;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [isDesktopHistoryOpen, setIsDesktopHistoryOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { profile: userProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = propCurrentPage || (location.pathname === '/profile' ? 'profile' : 'research');
  const isResearchPage = currentPage === 'research';
  const hasCompanyContext = isResearchPage && currentCompany;
  const progressPercentage = hasCompanyContext ? (areasResearched / totalAreas) * 100 : 0;
  const isResearchActive = hasCompanyContext && areasResearched > 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const handleMobileHistoryClick = () => {
    setIsMobileHistoryOpen(true);
  };

  const handleHistorySessionSelect = async (session: ResearchSession) => {
    try {
      // Close all dropdowns/sheets
      setIsMobileHistoryOpen(false);
      setIsMobileMenuOpen(false);
      setIsDesktopHistoryOpen(false);
      
      // Navigate to research page with the selected company as URL parameter
      navigate(`/research?company=${encodeURIComponent(session.company)}`);
      
      // Log the selected session for debugging
      console.log('Selected history session:', session.company);
      
      // Call the history click callback if provided
      onHistoryClick?.();
    } catch (error) {
      console.error('Failed to select history session:', error);
    }
  };

  const handleResearchClick = () => {
    navigate('/research');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get user name from profile or fallback to email
  const getUserName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email || user?.email || ''
      };
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      return { firstName, lastName: '', email: user.email };
    }
    return { firstName: 'User', lastName: '', email: '' };
  };

  const userName = getUserName();

  // Real research history data
  const [researchHistory, setResearchHistory] = useState<CompanyHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load research history when component mounts or when history dropdown is opened
  const loadResearchHistory = async () => {
    if (!userProfile) return;
    
    try {
      setIsLoadingHistory(true);
      const response = await getResearchHistory();
      const companies = response.companies || [];
      
      // Convert API response to CompanyHistory format
      const historyData: CompanyHistory[] = companies.map(company => ({
        company: company.company,
        sessions: [
          {
            id: `${company.company}-session-1`,
            company: company.company,
            areasResearched: company.completedAreas,
            totalAreas: 13,
            startedAt: new Date(company.lastUpdated),
            lastActivity: new Date(company.lastUpdated),
            status: company.completedAreas > 0 ? "active" : "paused"
          }
        ],
        totalResearchTime: 0, // Not available in current API
        insights: company.completedAreas
      }));
      
      setResearchHistory(historyData);
    } catch (error) {
      console.error('Failed to load research history:', error);
      setResearchHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load research history when component mounts
  useEffect(() => {
    loadResearchHistory();
  }, [userProfile]);

  // Refresh history when dropdown is opened
  useEffect(() => {
    if (isDesktopHistoryOpen || isMobileHistoryOpen) {
      loadResearchHistory();
    }
  }, [isDesktopHistoryOpen, isMobileHistoryOpen, userProfile]);

  // Refresh history when research progress changes (areasResearched updates)
  useEffect(() => {
    if (areasResearched > 0 && (isDesktopHistoryOpen || isMobileHistoryOpen)) {
      loadResearchHistory();
    }
  }, [areasResearched, isDesktopHistoryOpen, isMobileHistoryOpen]);

  // Reusable history content component
  const HistoryContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`history-content ${isMobile ? 'p-0' : ''}`}>
      {!isMobile && (
        <div className="p-4 border-b">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Research History
          </h4>
          <p className="text-sm text-muted-foreground">
            View and resume previous research sessions
          </p>
        </div>
      )}
      
      <div className={`max-h-80 overflow-y-auto ${isMobile ? 'p-4' : ''}`}>
        {isLoadingHistory ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading history...</p>
          </div>
        ) : researchHistory.length > 0 ? (
          researchHistory.map((companyHistory: CompanyHistory) => (
            <div key={companyHistory.company} className="border-b last:border-b-0">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3" />
                    <span className="font-medium">{companyHistory.company}</span>
                    {companyHistory.company === currentCompany && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {companyHistory.insights} insights
                  </div>
                </div>
                
                <div className="space-y-2">
                  {companyHistory.sessions.map((session: ResearchSession) => (
                    <Button
                      key={session.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-auto p-2 text-left"
                      onClick={() => handleHistorySessionSelect(session)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              session.status === 'active' ? 'bg-green-500' :
                              session.status === 'paused' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`} />
                            <span className="text-sm">
                              {session.areasResearched}/{session.totalAreas} areas
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {session.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Started {formatDate(session.startedAt)}
                          </div>
                        </div>
                        <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No research history yet</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-safe ${
        isScrolled
          ? "pt-safe bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "pt-safe bg-background/95 backdrop-blur-sm border-b border-border/30"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-14" : "h-16"
        }`}>
          {/* Left section - Logo */}
          <div className="flex items-center">
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className={`bg-primary text-primary-foreground rounded-xl flex items-center justify-center transition-all duration-300 ${
                isScrolled ? "p-2" : "p-2"
              }`}>
                <Sparkles className={`transition-all duration-300 ${
                  isScrolled ? "w-5 h-5" : "w-5 h-5"
                }`} />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-semibold text-foreground transition-all duration-300 ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}>
                  AI Intelligence
                </h1>
              </div>
            </motion.div>
          </div>

          {/* Center section - Company Context (Desktop) / Mobile Company Info */}
          <div className="flex items-center justify-center flex-1 px-4">
            {hasCompanyContext && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-2 sm:gap-3 bg-card/50 border border-border/50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 max-w-xs sm:max-w-sm"
              >
                <div className="bg-primary/10 rounded-lg p-1.5">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className={`font-semibold text-foreground truncate transition-all duration-300 ${
                      isScrolled ? "text-sm" : "text-base"
                    }`}>
                      {currentCompany}
                    </h2>
                    {isResearchActive && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5 hidden sm:flex">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{areasResearched}/{totalAreas}</span>
                    <div className="w-12 sm:w-16 h-1 bg-muted rounded-full overflow-hidden flex-shrink-0">
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Center Research Button for non-research pages */}
            {!isResearchPage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hidden sm:block"
              >
                <Button 
                  variant="outline" 
                  size="default"
                  className="gap-2 bg-card/50 hover:bg-card border-border/50 hover:border-primary/50"
                >
                  <Search className="w-4 h-4 text-primary" />
                  <span className="font-medium">Research</span>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Right section - Desktop Controls + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Research page controls */}
              {isResearchPage && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  {/* History Dropdown */}
                  <Popover open={isDesktopHistoryOpen} onOpenChange={setIsDesktopHistoryOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2 bg-card/50 hover:bg-card"
                      >
                        <Clock className="w-4 h-4" />
                        <span className="hidden lg:inline">History</span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="end">
                      <HistoryContent />
                    </PopoverContent>
                  </Popover>

                  {/* Company Switch Button */}
                  {hasCompanyContext && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2 bg-card/50 hover:bg-card"
                      onClick={onCompanySwitch}
                    >
                      <Shuffle className="w-4 h-4" />
                      <span className="hidden lg:inline">Company</span>
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Desktop User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 rounded-full hover:bg-accent/50 px-2 py-1 h-auto"
                  >
                    <Avatar className="w-7 h-7">
                      <AvatarImage src="" alt={userName.firstName && userName.lastName ? `${userName.firstName} ${userName.lastName}` : 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(userName.firstName, userName.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <ChevronDown className="w-4 h-4 text-muted-foreground hidden lg:block" />
                    
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {userName.firstName && userName.lastName && (
                        <p className="font-medium">{userName.firstName} {userName.lastName}</p>
                      )}
                      {userName.email && (
                        <p className="text-xs text-muted-foreground">{userName.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {!isResearchPage && (
                    <>
                      <DropdownMenuItem onClick={handleResearchClick}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>Research Companies</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    <span>Dark Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="flex sm:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Navigate through the application</SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col space-y-6 pt-6">
                    {/* User info */}
                    <div className="flex items-center gap-4 pb-4 border-b ml-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" alt={userName.firstName && userName.lastName ? `${userName.firstName} ${userName.lastName}` : 'User'} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(userName.firstName, userName.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        {userName.firstName && userName.lastName && (
                          <p className="font-medium truncate">{userName.firstName} {userName.lastName}</p>
                        )}
                        {userName.email && (
                          <p className="text-sm text-muted-foreground truncate">{userName.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-2 ml-2">
                      {!isResearchPage && (
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start gap-4 h-12 px-4"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Search className="w-5 h-5" />
                          <span>Research Companies</span>
                        </Button>
                      )}
                      
                      {isResearchPage && (
                        <>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-4 h-12 px-4"
                            onClick={handleMobileHistoryClick}
                          >
                            <Clock className="w-5 h-5" />
                            <span>Research History</span>
                          </Button>
                          
                          {hasCompanyContext && (
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start gap-4 h-12 px-4"
                              onClick={() => {
                                onCompanySwitch?.();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <Shuffle className="w-5 h-5" />
                              <span>Switch Company</span>
                            </Button>
                          )}
                        </>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-4 h-12 px-4"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Profile Settings</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-4 h-12 px-4"
                        onClick={toggleTheme}
                      >
                        {theme === "dark" ? (
                          <Sun className="w-5 h-5" />
                        ) : (
                          <Moon className="w-5 h-5" />
                        )}
                        <span>Dark Mode</span>
                      </Button>
                    </div>

                    {/* Logout */}
                    <div className="pt-4 border-t ml-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-4 h-12 px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile History Sheet */}
      <Sheet open={isMobileHistoryOpen} onOpenChange={setIsMobileHistoryOpen}>
        <SheetContent side="right" className="w-full sm:w-96">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Research History
            </SheetTitle>
            <SheetDescription>
              View and resume previous research sessions
            </SheetDescription>
          </SheetHeader>
          <HistoryContent isMobile={true} />
        </SheetContent>
      </Sheet>
    </motion.nav>
  );
} 