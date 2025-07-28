import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import { ThemeProvider } from './components/ThemeProvider'
import DashboardLayout from './components/Layout'
import { Toaster } from './components/ui/sonner'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ConfirmSignUpPage from './pages/ConfirmSignUpPage'
import { ProfilePage } from './pages/ProfilePage'
import PersonalInfoPage from './pages/onboarding/PersonalInfoPage'
import CompanyInfoPage from './pages/onboarding/CompanyInfoPage'
import SalesContextPage from './pages/onboarding/SalesContextPage'
import { GuidedResearchPage } from './pages/GuidedResearchPage'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <ProfileProvider>
          <OnboardingProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/confirm" element={<ConfirmSignUpPage />} />
              
              {/* Multi-page onboarding flow */}
              <Route 
                path="/onboarding/personal" 
                element={
                  <ProtectedRoute requireProfileComplete={false}>
                    <PersonalInfoPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/onboarding/company" 
                element={
                  <ProtectedRoute requireProfileComplete={false}>
                    <CompanyInfoPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/onboarding/context" 
                element={
                  <ProtectedRoute requireProfileComplete={false}>
                    <SalesContextPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect old onboarding route to first step */}
              <Route path="/onboarding" element={<Navigate to="/onboarding/personal" replace />} />
              
              {/* All authenticated routes use DashboardLayout */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <GuidedResearchPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/research" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <GuidedResearchPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect any old routes to the main experience */}
              <Route path="/intelligence" element={<Navigate to="/" replace />} />
              <Route path="/chat/*" element={<Navigate to="/" replace />} />
              <Route path="/analytics" element={<Navigate to="/" replace />} />
              <Route path="/settings" element={<Navigate to="/profile" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </OnboardingProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
