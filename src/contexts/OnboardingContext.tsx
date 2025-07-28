import { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  company: string;
  companyDomain: string;
  territory: string;
  salesFocus: string;
  defaultResearchContext: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const initialData: OnboardingData = {
  firstName: '',
  lastName: '',
  role: '',
  department: '',
  company: '',
  companyDomain: '',
  territory: '',
  salesFocus: 'enterprise',
  defaultResearchContext: 'discovery'
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
    setCurrentStep(0);
  };

  return (
    <OnboardingContext.Provider value={{
      data,
      updateData,
      resetData,
      currentStep,
      setCurrentStep
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 