import React from 'react';
import Navbar from '../components/Navbar';
import PrivacyNotice from '../components/PrivacyNotice';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PrivacyNotice variant="full" />
      </div>
    </div>
  );
};

export default PrivacyPage;
