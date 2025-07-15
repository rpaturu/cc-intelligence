import { Key, Database, Bell, User } from 'lucide-react';
import { Layout } from '@/components/Layout';

export function SettingsPage() {
  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-lg text-gray-600">
          Configure your sales intelligence preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* API Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Endpoint
              </label>
              <input
                type="text"
                placeholder="https://your-api-gateway-url.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* AI Model Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Model Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Model
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
                <option value="llama-2">Llama 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: 0.3
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.3"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-500">Get notified when reports are ready</div>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Weekly Summary</div>
                <div className="text-sm text-gray-500">Receive weekly analytics summary</div>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                placeholder="Your company"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="account-executive">Account Executive</option>
                <option value="sales-development">Sales Development Rep</option>
                <option value="account-manager">Account Manager</option>
                <option value="sales-engineer">Sales Engineer</option>
                <option value="sales-manager">Sales Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
} 