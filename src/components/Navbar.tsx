import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
import { 
  Brain,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Don't show navbar on auth pages
  if (['/login', '/signup', '/confirm'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Intelligence Assistant</h1>
            <p className="text-sm text-muted-foreground">Guided company research with contextual insights</p>
          </div>
        </div>

        {/* Right side - Actions and User Menu */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <ModeToggle />
          
          {/* User Menu */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user?.username || profile?.name || 'User'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || profile?.email || 'No email'}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Settings className="w-4 h-4" />
                      {profile ? 'Edit Profile' : 'Setup Profile'}
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 