import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

interface ProtectedRouteProps {
  children: ReactNode;
  requireProfileComplete?: boolean;
}

export function ProtectedRoute({ children, requireProfileComplete = true }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if profile is complete (if required)
  if (requireProfileComplete && user) {
    const isProfileComplete = profile && 
      profile.name && 
      profile.role && 
      profile.company && 
      profile.primaryProducts.length > 0 && 
      profile.mainCompetitors.length > 0;

    // Don't redirect if already on onboarding page
    if (!isProfileComplete && location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }

    // Redirect to main app if profile is complete and user is on onboarding page
    if (isProfileComplete && location.pathname === '/onboarding') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
} 