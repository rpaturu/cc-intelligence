import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { healthCheck } from '../lib/api';
import type { HealthCheckResponse } from '../lib/api';

export function HomePage() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthCheck();
        setHealth(response);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Get comprehensive company insights powered by advanced AI analysis",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Target,
      title: "Context-Aware Analysis",
      description: "Tailored insights based on your specific sales context and meeting type",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Competitive Intelligence",
      description: "Real-time competitive positioning and battle cards for your deals",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Users,
      title: "Stakeholder Mapping",
      description: "Identify key contacts and optimal approach strategies",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Generate Intelligence",
      description: "Create a comprehensive sales intelligence report",
      path: "/intelligence",
      icon: Brain,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "View Analytics",
      description: "Analyze your sales intelligence performance",
      path: "/analytics",
      icon: TrendingUp,
      color: "bg-green-600 hover:bg-green-700"
    }
  ];

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Sales Intelligence
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered insights to help you prepare for customer meetings and close more deals
          </p>
        </div>

        {/* System Status */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <Clock className="h-5 w-5 text-gray-500 animate-pulse" />
                ) : health ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium text-gray-900">System Status</span>
              </div>
              <div className="text-sm text-gray-500">
                {isLoading ? 'Checking...' : health ? 'Online' : 'Offline'}
              </div>
            </div>
            {health && (
              <div className="text-sm text-gray-500">
                Region: {health.region} | Model: {health.model}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className={`${action.color} text-white p-6 rounded-lg transition-colors group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-white/90">{action.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-8 w-8" />
                      <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Generate your first sales intelligence report by entering a company domain and 
              selecting your sales context. Our AI will analyze the latest information to provide 
              you with actionable insights.
            </p>
            <Link
              to="/intelligence"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Brain className="h-5 w-5" />
              <span>Generate Intelligence</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 