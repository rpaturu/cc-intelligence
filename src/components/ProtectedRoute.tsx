import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  console.log('ProtectedRoute - loading:', loading, 'user:', user)

  if (loading) {
    console.log('ProtectedRoute - showing loading spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute - no user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  console.log('ProtectedRoute - user authenticated, rendering children')
  return <>{children}</>
}

export default ProtectedRoute 