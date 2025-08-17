import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import PrivacyNotice from '../components/PrivacyNotice';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>
        <PrivacyNotice variant="full" />
      </div>
    </div>
  );
};

export default PrivacyPage;
