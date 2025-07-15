import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Home, 
  BarChart3, 
  Settings, 
  Target,
  Activity,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/intelligence', label: 'Intelligence', icon: Brain },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sales Intelligence</h1>
              <p className="text-sm text-gray-500">AI-Powered Insights</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          {user && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">{user.username}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>System Status: Online</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 