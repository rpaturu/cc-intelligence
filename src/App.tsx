import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { ThemeProvider } from './components/theme-provider'
import { Navbar } from './components/Navbar'
import { Toaster } from './components/ui/sonner'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ConfirmSignUpPage from './pages/ConfirmSignUpPage'
import { EnhancedIntelligenceExperience } from './pages/EnhancedIntelligenceExperience'
import { ProfilePage } from './pages/ProfilePage'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <ProfileProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/confirm" element={<ConfirmSignUpPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                      <EnhancedIntelligenceExperience />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
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
          </div>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
