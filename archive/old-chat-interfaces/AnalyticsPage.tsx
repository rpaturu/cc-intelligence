import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { Layout } from '@/components/Layout';

export function AnalyticsPage() {
  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sales Intelligence Analytics
        </h1>
        <p className="text-lg text-gray-600">
          Track your sales intelligence performance and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Reports Generated</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600">47</div>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Win Rate</h3>
          </div>
          <div className="text-3xl font-bold text-green-600">68%</div>
          <p className="text-sm text-gray-500">+5% from last month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Companies Analyzed</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600">124</div>
          <p className="text-sm text-gray-500">Total</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Avg Deal Size</h3>
          </div>
          <div className="text-3xl font-bold text-orange-600">$45K</div>
          <p className="text-sm text-gray-500">+12% from last month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600 mb-4">
          Analytics features are currently in development. Soon you'll be able to:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center space-x-2">
            <span className="text-green-500">•</span>
            <span>Track win rate improvement over time</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">•</span>
            <span>Analyze most effective talking points</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">•</span>
            <span>View competitive intelligence trends</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">•</span>
            <span>Monitor deal progression patterns</span>
          </li>
        </ul>
      </div>
    </div>
    </Layout>
  );
} 