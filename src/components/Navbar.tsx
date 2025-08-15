import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, User, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
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

  const currentPage = location.pathname === '/profile' ? 'profile' : 'research';

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleResearchClick = () => {
    navigate('/research');
  };

  const handleOnboardingClick = () => {
    navigate('/onboarding/personal');
  };

  // Extract user name from user object or email
  const getUserName = () => {
    if (user?.email) {
      // Parse name from profile if available, otherwise use email
      const emailName = user.email.split('@')[0];
      const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      return { firstName, lastName: '' };
    }
    return { firstName: 'User', lastName: '' };
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
            ? 'max-w-3xl mt-4 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/30 border rounded-full shadow-lg' 
            : 'max-w-7xl bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-b'
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



          {/* User Actions - Right */}
          <div className="flex justify-end">
            <div className={`flex items-center ${scrolled ? 'gap-1' : 'gap-2'}`}>
              {/* Onboarding Button - User action */}
              <Button
                variant={location.pathname.startsWith('/onboarding') ? "default" : "ghost"}
                onClick={handleOnboardingClick}
                size={scrolled ? "sm" : "default"}
                className="flex items-center gap-2 transition-all duration-300 ease-in-out"
              >
                <User className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                {!scrolled && "Onboarding"}
              </Button>
              
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                size={scrolled ? "sm" : "default"}
                className="flex items-center gap-2 transition-all duration-300 ease-in-out"
              >
                {theme === "light" ? (
                  <>
                    <Moon className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    {!scrolled && "Dark"}
                  </>
                ) : (
                  <>
                    <Sun className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    {!scrolled && "Light"}
                  </>
                )}
              </Button>
              
              {/* Profile Button */}
              <Button
                variant={currentPage === "profile" ? "secondary" : "ghost"}
                onClick={handleProfileClick}
                size={scrolled ? "sm" : "default"}
                className="flex items-center gap-2 transition-all duration-300 ease-in-out"
              >
                {user ? (
                  <>
                    <Avatar className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-5 h-5' : 'w-6 h-6'}`}>
                      <AvatarImage src="" alt={`${userName.firstName} ${userName.lastName}`} />
                      <AvatarFallback className="text-xs">
                        {getInitials(userName.firstName, userName.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {!scrolled && "Profile"}
                  </>
                ) : (
                  <>
                    <User className={`transition-all duration-300 ease-in-out ${scrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    {!scrolled && "Profile"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
    </div>
    </nav>
  );
} 