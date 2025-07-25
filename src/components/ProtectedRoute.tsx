import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireProfileComplete?: boolean;
}

export function ProtectedRoute({ children, requireProfileComplete = true }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();
  const [profileCheckDelay, setProfileCheckDelay] = useState(true);

  // Add a small delay after auth completes to allow profile to load
  useEffect(() => {
    if (user && !authLoading) {
      const timer = setTimeout(() => {
        setProfileCheckDelay(false);
      }, 500); // 500ms delay to allow profile to load

      return () => clearTimeout(timer);
    } else {
      setProfileCheckDelay(true);
    }
  }, [user, authLoading]);

  // Show loading while checking authentication or during profile check delay
  if (authLoading || profileLoading || profileCheckDelay) {
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

  // Check if profile is complete (only if required)
  if (requireProfileComplete && user) {
    const isProfileComplete = profile?.role && profile?.company && profile?.defaultResearchContext;
    
    console.log('ProtectedRoute: Profile completion check', {
      requireProfileComplete,
      hasProfile: !!profile,
      isProfileComplete,
      profileCheckDelay,
      profileData: profile ? {
        hasRole: !!profile.role,
        hasCompany: !!profile.company,
        hasDefaultResearchContext: !!profile.defaultResearchContext
      } : null,
      redirectPath: location.pathname
    });

    // Only redirect if we're not in delay period and profile is actually incomplete
    if (!profileCheckDelay && !isProfileComplete) {
      return <Navigate to="/onboarding" state={{ from: location }} replace />;
    }

    // Redirect away from onboarding if profile is complete
    if (!profileCheckDelay && isProfileComplete && location.pathname === '/onboarding') {
      console.log('ProtectedRoute: Redirecting away from onboarding (profile complete)');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
} 