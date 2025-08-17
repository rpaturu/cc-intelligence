import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Search, User, Sun, Moon, ChevronDown, Settings, LogOut, Building2, Clock, Shuffle } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { getInitials } from "../utils";

interface NavbarProps {
  currentCompany?: string;
  areasResearched?: number;
  totalAreas?: number;
  onCompanySwitch?: () => void;
  onHistoryClick?: () => void;
}

export default function Navbar(props: NavbarProps = {}) {
  const { 
    currentCompany, 
    areasResearched = 0, 
    totalAreas = 13, 
    onCompanySwitch, 
    onHistoryClick 
  } = props;
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { profile: userProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      setScrolled(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const currentPage = location.pathname === '/profile' ? 'profile' : 'research';

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleResearchClick = () => {
    navigate('/research');
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
      // Parse name from email as fallback
      const emailName = user.email.split('@')[0];
      const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      return { firstName, lastName: '', email: user.email };
    }
    return { firstName: 'User', lastName: '', email: '' };
  };

  const userName = getUserName();

  // Don't show navbar on auth pages only (temporarily allowing onboarding for testing)
  if (['/login', '/signup', '/confirm'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-safe transition-all duration-300 ease-in-out">
      <div 
        className={`
          transition-all duration-300 ease-in-out mx-auto px-4 sm:px-6 lg:px-8
          ${scrolled 
            ? 'max-w-3xl mt-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-full shadow-lg' 
            : 'max-w-7xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'
          }
        `}
      >
        <div className={`grid items-center transition-all duration-300 ease-in-out ${scrolled ? 'grid-cols-3 h-12' : 'grid-cols-3 h-16'}`}>
          {/* Logo - Left */}
          <div className="flex justify-start">
            <div className="flex items-center">
              <div className={`bg-primary rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out ${scrolled ? 'w-6 h-6' : 'w-8 h-8'}`}>
                <span className={`text-primary-foreground font-bold transition-all duration-300 ease-in-out ${scrolled ? 'text-xs' : 'text-sm'}`}>AI</span>
              </div>
              <span className={`ml-2 font-semibold text-foreground transition-all duration-300 ease-in-out ${scrolled ? 'text-sm' : 'text-base'}`}>
                Intelligence
              </span>
            </div>
          </div>

          {/* Center Section - Company Context or Research Button */}
          <div className="flex justify-center">
            {currentCompany && currentPage === "research" ? (
              // Company Context Display - Figma-style font sizing
              <div className="flex items-center gap-2">
                <div className={`bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-300 ${scrolled ? 'p-1.5' : 'p-2'}`}>
                  <Building2 className={`text-primary transition-all duration-300 ${scrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium truncate transition-all duration-300 ${scrolled ? 'text-sm' : 'text-lg'}`}>
                      {currentCompany}
                    </h3>
                  </div>
                  <div className={`flex items-center gap-2 text-muted-foreground transition-all duration-300 ${scrolled ? 'text-xs' : 'text-sm'}`}>
                    <span className={scrolled ? 'hidden lg:inline' : 'inline'}>
                      {areasResearched} of {totalAreas} areas researched
                    </span>
                    <div className={`bg-muted rounded-full overflow-hidden transition-all duration-300 ${scrolled ? 'w-12 h-1' : 'w-16 h-1.5'}`}>
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(areasResearched / totalAreas) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Default Research Button
              <Button
                variant={currentPage === "research" ? "default" : "ghost"}
                onClick={handleResearchClick}
                size={scrolled ? "sm" : "default"}
                className="flex items-center gap-2 transition-all duration-300 ease-in-out"
              >
                <Search className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                {!scrolled && "Research"}
              </Button>
            )}
          </div>

          {/* Right Section - Research Controls + User Menu */}
          <div className="flex justify-end items-center gap-2">
            {/* Research Controls - Show when company is selected */}
            {currentCompany && currentPage === "research" && (
              <div className="flex items-center gap-1.5">
                {/* History Button */}
                <Button
                  variant="outline"
                  size={scrolled ? "sm" : "sm"}
                  className="gap-1 px-2"
                  onClick={onHistoryClick}
                >
                  <Clock className={scrolled ? 'w-3 h-3' : 'w-4 h-4'} />
                  <span className={scrolled ? 'hidden' : 'hidden sm:inline'}>History</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>

                {/* Switch Company Button */}
                <Button
                  variant="outline"
                  size={scrolled ? "sm" : "sm"}
                  className="gap-1 px-2"
                  onClick={onCompanySwitch}
                >
                  <Shuffle className={scrolled ? 'w-3 h-3' : 'w-4 h-4'} />
                  <span className={scrolled ? 'hidden' : 'hidden sm:inline'}>Switch</span>
                </Button>
              </div>
            )}

            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size={scrolled ? "sm" : "default"}
                  className="flex items-center gap-2 transition-all duration-300 ease-in-out"
                >
                  {user ? (
                    <>
                      <Avatar className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-5 h-5' : 'w-6 h-6'}`}>
                        <AvatarImage src="" alt={`${userName.firstName} ${userName.lastName}`} />
                        <AvatarFallback className={`bg-muted text-gray-700 dark:text-gray-300 font-semibold transition-all duration-300 ease-in-out ${scrolled ? 'text-[10px]' : 'text-xs'}`}>
                          {getInitials(userName.firstName, userName.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      {!scrolled && (
                        <>
                          <span>{userName.firstName}</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <User className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      {!scrolled && (
                        <>
                          <span>Menu</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 animate-in slide-in-from-top-2" align="end">
                {user && (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userName.firstName} {userName.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem
                  onClick={toggleTheme}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      Light Mode
                    </>
                  )}
                </DropdownMenuItem>
                
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
} 