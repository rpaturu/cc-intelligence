import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Search, User, Sun, Moon, ChevronDown, Settings, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { getInitials } from "../utils";

export default function Navbar() {
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

          {/* Research Button - Center */}
          <div className="flex justify-center">
            <Button
              variant={currentPage === "research" ? "default" : "ghost"}
              onClick={handleResearchClick}
              size={scrolled ? "sm" : "default"}
              className="flex items-center gap-2 transition-all duration-300 ease-in-out"
            >
              <Search className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {!scrolled && "Research"}
            </Button>
          </div>

          {/* User Menu Dropdown - Right */}
          <div className="flex justify-end">
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