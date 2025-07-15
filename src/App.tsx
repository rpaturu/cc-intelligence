import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from './components/ui/sonner'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import { HybridIntelligenceExperience } from './pages/HybridIntelligenceExperience'
import { ProfilePage } from './pages/ProfilePage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HybridIntelligenceExperience />
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
    </AuthProvider>
  )
}

export default App
