import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { 
  User, 
  Bell, 
  Database, 
  ArrowLeft, 
  Save,
  Trash2,
  Shield
} from 'lucide-react';

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  dataRetention: '30d' | '90d' | '1y' | 'forever';
  defaultSalesContext: 'discovery' | 'competitive' | 'renewal' | 'demo' | 'negotiation' | 'closing';
  autoSaveChatHistory: boolean;
  companyHistoryLimit: number;
}

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    dataRetention: '90d',
    defaultSalesContext: 'discovery',
    autoSaveChatHistory: true,
    companyHistoryLimit: 10
  });

  const [profile, setProfile] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    company: '',
    role: ''
  });

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('cc-intelligence-preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    // Load profile from localStorage
    const savedProfile = localStorage.getItem('cc-intelligence-profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('cc-intelligence-profile', JSON.stringify(profile));
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('cc-intelligence-preferences', JSON.stringify(preferences));
      toast.success('Preferences saved successfully');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem('cc-intelligence-hybrid-chat');
      localStorage.removeItem('cc-intelligence-company-history');
      localStorage.removeItem('cc-intelligence-hybrid-dashboard');
      localStorage.removeItem('cc-intelligence-profile');
      localStorage.removeItem('cc-intelligence-preferences');
      toast.success('All data cleared successfully');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Intelligence
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Profile & Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Your job title"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <CardTitle>App Preferences</CardTitle>
              </div>
              <CardDescription>
                Customize your intelligence experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive email updates about your research</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked: boolean) => 
                      setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-save Chat History</Label>
                    <p className="text-sm text-gray-600">Automatically save conversations for future reference</p>
                  </div>
                  <Switch
                    checked={preferences.autoSaveChatHistory}
                    onCheckedChange={(checked: boolean) => 
                      setPreferences(prev => ({ ...prev, autoSaveChatHistory: checked }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Default Sales Context</Label>
                  <Select 
                    value={preferences.defaultSalesContext}
                    onValueChange={(value: string) => 
                      setPreferences(prev => ({ ...prev, defaultSalesContext: value as UserPreferences['defaultSalesContext'] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery Call</SelectItem>
                      <SelectItem value="competitive">Competitive Analysis</SelectItem>
                      <SelectItem value="renewal">Renewal Discussion</SelectItem>
                      <SelectItem value="demo">Product Demo</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closing">Closing Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Company History Limit</Label>
                  <Select 
                    value={preferences.companyHistoryLimit.toString()}
                    onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, companyHistoryLimit: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 companies</SelectItem>
                      <SelectItem value="10">10 companies</SelectItem>
                      <SelectItem value="25">25 companies</SelectItem>
                      <SelectItem value="50">50 companies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Data Retention</Label>
                <Select 
                  value={preferences.dataRetention}
                  onValueChange={(value: string) => 
                    setPreferences(prev => ({ ...prev, dataRetention: value as UserPreferences['dataRetention'] }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  How long to keep your research data and chat history
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <CardTitle>Data Management</CardTitle>
              </div>
              <CardDescription>
                Manage your stored data and research history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Data Privacy</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Your research data is stored locally in your browser. We recommend 
                  periodically backing up important research before clearing data.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Clear All Data</h4>
                  <p className="text-sm text-gray-600">
                    Remove all chat history, company research, and saved preferences
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleClearAllData}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Sign Out</h4>
                  <p className="text-sm text-gray-600">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 