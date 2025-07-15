import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  Brain, 
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { cn } from '@/lib/utils';

interface ExperienceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  features: string[];
  bestFor: string[];
}

const experiences: ExperienceOption[] = [
  {
    id: 'option1',
    title: 'Pure Natural Language',
    description: 'Chat naturally with AI - just describe what you need and let the AI figure out the details.',
    icon: MessageCircle,
    route: '/chat/natural',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    features: [
      'Natural conversation flow',
      'AI parses everything automatically',
      'No forms or structured input',
      'Most flexible interaction'
    ],
    bestFor: [
      'Users who prefer casual conversation',
      'Quick questions and exploration',
      'When you want to talk naturally'
    ]
  },
  {
    id: 'option2',
    title: 'Guided Conversation',
    description: 'Step-by-step conversational flow that ensures we get all the information needed.',
    icon: Users,
    route: '/chat/guided',
    color: 'bg-green-50 border-green-200 text-green-800',
    features: [
      'Structured conversation steps',
      'AI guides you through questions',
      'Ensures complete information',
      'Friendly and systematic'
    ],
    bestFor: [
      'First-time users',
      'Comprehensive analysis needs',
      'When you want thorough guidance'
    ]
  },
  {
    id: 'option3',
    title: 'Smart Context Recognition',
    description: 'Flexible AI that adapts to your input style and asks follow-up questions as needed.',
    icon: Brain,
    route: '/chat/smart',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    features: [
      'Adapts to your communication style',
      'Smart follow-up questions',
      'Context-aware responses',
      'Best of both worlds'
    ],
    bestFor: [
      'Power users',
      'Varied input styles',
      'When you want AI to be smart about context'
    ]
  },
  {
    id: 'option4',
    title: 'Dashboard + Chat Hybrid',
    description: 'Multi-panel interface with chat, results display, and conversation history.',
    icon: LayoutDashboard,
    route: '/chat/dashboard',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
    features: [
      'Multi-panel interface',
      'Rich results display',
      'Conversation history sidebar',
      'Professional dashboard feel'
    ],
    bestFor: [
      'Business users',
      'Complex analysis workflows',
      'When you need rich data display'
    ]
  }
];

export function ExperienceSelector() {
  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Choose Your AI Experience
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Try different conversational interfaces to find your preferred way of 
            interacting with AI-powered sales intelligence. Each approach offers 
            unique benefits for different use cases.
          </p>
        </div>

        {/* Experience Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {experiences.map((experience) => {
            const Icon = experience.icon;
            return (
              <Link
                key={experience.id}
                to={experience.route}
                className="group block p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-3 rounded-lg", experience.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {experience.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {experience.description}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Key Features
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {experience.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Best For
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {experience.bestFor.map((use, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Beta Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">
              A/B Testing in Progress
            </h3>
          </div>
          <p className="text-yellow-700">
            These are experimental interfaces designed to test different conversation patterns. 
            Try multiple options and let us know which feels most natural for your workflow.
          </p>
        </div>

        {/* Quick Start Examples */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Start Examples
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Discovery Call</h4>
              <p className="text-sm text-gray-600">
                "Analyze Shopify for a discovery call focusing on e-commerce scaling challenges"
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Competitive Analysis</h4>
              <p className="text-sm text-gray-600">
                "Compare Tesla vs Ford in the EV market for competitive positioning"
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Renewal Meeting</h4>
              <p className="text-sm text-gray-600">
                "Prepare for Microsoft renewal discussion with focus on cloud services"
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 