import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { ThemeProvider } from './components/ThemeProvider'
import DashboardLayout from './components/Layout'
import { Toaster } from './components/ui/sonner'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ConfirmSignUpPage from './pages/ConfirmSignUpPage'
import { ProfilePage } from './pages/ProfilePage'
import { OnboardingFlow } from './pages/OnboardingFlow'
import { GuidedResearchPage } from './pages/GuidedResearchPage'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/confirm" element={<ConfirmSignUpPage />} />
            
            {/* All authenticated routes use DashboardLayout */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute requireProfileComplete={false}>
                  <DashboardLayout>
                    <OnboardingFlow />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
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
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
