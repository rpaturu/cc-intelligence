import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Search, Sparkles, Settings, Users, BarChart3, Wrench, Link, Building } from 'lucide-react';
import type { UserProfile } from '../lib/api';

interface SelectedCustomer {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  recentNews?: string;
}

interface CustomerSearchStepProps {
  onCustomerSelect: (customer: SelectedCustomer) => void;
}

interface CustomerContextStepProps {
  customer: SelectedCustomer;
  onContinue: () => void;
  userContext: UserProfile | null;
}

interface GuidedQuestionsStepProps {
  customer: SelectedCustomer;
  userProfile: UserProfile | null;
  onQuestionSelect: (questionId: string) => void;
}

interface ChatInterfaceStepProps {
  customer: SelectedCustomer;
  userProfile: UserProfile | null;
  onStartOver: () => void;
}

export const GuidedResearchPage = () => {
  const { profile: userProfile } = useProfile();
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);
  const [researchStep, setResearchStep] = useState<'search' | 'context' | 'questions' | 'chat'>('search');

  return (
    <div>
      {/* Header */}
      <Card>
        <CardHeader>
          <div>
            <Sparkles />
            <CardTitle>Guided Research</CardTitle>
          </div>
          <CardDescription>
            Get contextual intelligence tailored to your role and company
          </CardDescription>
        </CardHeader>
      </Card>

      {/* User Context Display */}
      {userProfile && (
        <Card>
          <CardContent>
            <div>
              <Avatar>
                <AvatarFallback>{userProfile.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p>{userProfile.name}</p>
                <p>{userProfile.role} at {userProfile.company}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Area */}
      <div>
        {researchStep === 'search' && (
          <CustomerSearchStep 
            onCustomerSelect={(customer) => {
              setSelectedCustomer(customer);
              setResearchStep('context');
            }}
          />
        )}

        {researchStep === 'context' && selectedCustomer && (
          <CustomerContextStep 
            customer={selectedCustomer}
            onContinue={() => setResearchStep('questions')}
            userContext={userProfile}
          />
        )}

        {researchStep === 'questions' && selectedCustomer && userProfile && (
          <GuidedQuestionsStep 
            customer={selectedCustomer}
            userProfile={userProfile}
            onQuestionSelect={(questionId) => {
              console.log('Selected question:', questionId);
              setResearchStep('chat');
            }}
          />
        )}

        {researchStep === 'chat' && selectedCustomer && userProfile && (
          <ChatInterfaceStep 
            customer={selectedCustomer}
            userProfile={userProfile}
            onStartOver={() => {
              setSelectedCustomer(null);
              setResearchStep('search');
            }}
          />
        )}
      </div>
    </div>
  );
};

// Phase 1 Step Components - Pure shadcn components only
const CustomerSearchStep = ({ onCustomerSelect }: CustomerSearchStepProps) => (
  <Card>
    <CardHeader>
      <div>
        <Search />
      </div>
      <CardTitle>Search for a company</CardTitle>
      <CardDescription>
        Start by selecting the company you want to research
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div>
        <Input placeholder="Type company name..." />
        
        <div>
          <p>Popular companies:</p>
          {[
            { name: 'Acme Corp', industry: 'FinTech', size: '500 employees', location: 'San Francisco, CA' },
            { name: 'TechStart Inc', industry: 'SaaS', size: '150 employees', location: 'Austin, TX' },
            { name: 'Global Finance Ltd', industry: 'Financial Services', size: '2,000 employees', location: 'New York, NY' }
          ].map((company, idx) => (
            <Card key={idx}>
              <CardContent>
                <Button 
                  variant="ghost" 
                  onClick={() => onCustomerSelect({ id: `demo-${idx}`, ...company })}
                >
                  <div>
                    <div>{company.name}</div>
                    <div>
                      <Badge variant="secondary">{company.industry}</Badge>
                      <Badge variant="outline">{company.size}</Badge>
                      <Badge variant="outline">{company.location}</Badge>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const CustomerContextStep = ({ customer, onContinue, userContext }: CustomerContextStepProps) => (
  <Card>
    <CardHeader>
      <div>
        <Avatar>
          <AvatarFallback>{customer.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{customer.name}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">{customer.industry}</Badge>
            <Badge variant="outline">{customer.size}</Badge>
            <Badge variant="outline">{customer.location}</Badge>
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
             <Alert>
         <Building />
         <AlertDescription>
           Quick Context: {customer.industry} company with {customer.size} based in {customer.location}
           {customer.recentNews && ` - Recent: ${customer.recentNews}`}
         </AlertDescription>
       </Alert>
       
              <div>
         <p>
           Perfect! I'll help you research this {customer.industry} prospect with {userContext?.company}-specific intelligence tailored for your role as a {userContext?.role}.
         </p>
        <Button onClick={onContinue}>
          Start Guided Research
        </Button>
      </div>
    </CardContent>
  </Card>
);

const GuidedQuestionsStep = ({ customer, userProfile, onQuestionSelect }: GuidedQuestionsStepProps) => {
  // Context-aware questions based on user role (2-3 core questions per Phase 1)
  const getContextualQuestions = () => {
    const roleQuestions = {
      'AE': [
        { id: 'current_identity_solution', text: "What's their current identity management setup?", icon: Settings },
        { id: 'decision_makers', text: "Who are the key decision makers for security/IT?", icon: Users }
      ],
      'CSM': [
        { id: 'current_usage', text: "How are they currently using our products?", icon: BarChart3 },
        { id: 'expansion_ops', text: "What expansion opportunities exist?", icon: Sparkles }
      ],
      'SE': [
        { id: 'tech_integration', text: "How would our solution integrate with their stack?", icon: Wrench },
        { id: 'technical_challenges', text: "What technical challenges are they facing?", icon: Link }
      ]
    };
    
    return roleQuestions[userProfile?.role as keyof typeof roleQuestions] || roleQuestions.AE;
  };

  const questions = getContextualQuestions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Researching {customer.name}</CardTitle>
        <CardDescription>
          As an <strong>{userProfile?.role}</strong> at <strong>{userProfile?.company}</strong>, here are key areas to research about this {customer.industry} prospect:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {questions.map((question) => {
            const IconComponent = question.icon;
            return (
              <Button
                key={question.id}
                variant="outline"
                onClick={() => onQuestionSelect(question.id)}
              >
                <IconComponent />
                {question.text}
              </Button>
            );
          })}
        </div>
        
                 <Alert>
           <Sparkles />
           <AlertDescription>
             <strong>Pro tip:</strong> Understanding their current identity solution helps you position {userProfile?.company}'s unique value proposition and competitive advantages.
           </AlertDescription>
         </Alert>
      </CardContent>
    </Card>
  );
};

const ChatInterfaceStep = ({ customer, userProfile, onStartOver }: ChatInterfaceStepProps) => (
  <Card>
    <CardHeader>
      <div>
        <CardTitle>Interactive Research</CardTitle>
        <Button variant="outline" onClick={onStartOver}>
          New Search
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div>
        <div>
          <Avatar>
            <AvatarFallback>
              <Sparkles />
            </AvatarFallback>
          </Avatar>
        </div>
                 <div>
           <CardTitle>Vendor-Aware Intelligence Coming Soon</CardTitle>
           <CardDescription>
             This will stream {userProfile?.company}-specific insights about {customer.name}, including competitive positioning, integration opportunities, and sales talking points.
           </CardDescription>
         </div>
         <div>
           <Card>
             <CardContent>
               <div>Question asked:</div>
               <div>What's their current identity management setup?</div>
             </CardContent>
           </Card>
           <Card>
             <CardContent>
               <div>SSE Response (simulated):</div>
               <div>🔍 Analyzing {customer.name}'s identity infrastructure and competitive positioning for {userProfile?.company}...</div>
             </CardContent>
           </Card>
         </div>
      </div>
    </CardContent>
  </Card>
); 