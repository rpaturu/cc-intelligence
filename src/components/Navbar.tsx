import { useNavigate, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { 
  Target,
  User,
  Settings,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from './ThemeProvider';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
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
    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
      {/* Logo/Brand */}
      <a href="/" className="flex items-center gap-2 hover:opacity-80">
        <div className="p-2 bg-primary rounded-lg">
          <Target className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">Sales Intelligence</span>
      </a>

      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href="/">Dashboard</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger>Research</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                <li>
                  <NavigationMenuLink asChild>
                    <a href="/research/companies">
                      <div className="text-sm font-medium leading-none">Company Research</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Deep dive into company insights
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="/research/markets">
                      <div className="text-sm font-medium leading-none">Market Analysis</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Industry trends and competition
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href="/analytics">Analytics</a>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* User Menu as part of the main navigation */}
          {user && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user?.username || profile?.name || 'User'}
                </span>
              </NavigationMenuTrigger>
              
              <NavigationMenuContent>
                <ul className="grid w-[240px] gap-3 p-4">
                  {/* User Info Header */}
                  <li className="pb-2 border-b">
                    <div className="text-sm font-medium">
                      {user?.username || 'User'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email || profile?.email || 'No email'}
                    </div>
                  </li>
                  
                  {/* Menu Items */}
                  <li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        {profile ? 'Edit Profile' : 'Setup Profile'}
                      </button>
                    </NavigationMenuLink>
                  </li>
                  
                  <li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          {/* Theme Toggle */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </NavigationMenuTrigger>
            
            <NavigationMenuContent>
              <ul className="grid w-[120px] gap-2 p-2">
                <li>
                  <NavigationMenuLink asChild>
                    <button
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-2 w-full"
                    >
                      Light
                    </button>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <button
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-2 w-full"
                    >
                      Dark
                    </button>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <button
                      onClick={() => setTheme("system")}
                      className="flex items-center gap-2 w-full"
                    >
                      System
                    </button>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
} 