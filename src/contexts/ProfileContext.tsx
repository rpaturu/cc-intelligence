import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProfile, saveProfile, deleteProfile } from '../lib/api';
import type { UserProfile } from '../lib/api';

// Re-export UserProfile for convenience
export type { UserProfile };

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (profile: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  clearProfile: () => Promise<void>;
  isProfileComplete: () => boolean;
  refreshProfile: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const refreshProfile = useCallback(async () => {
    if (!user?.userId) {
      console.log('ProfileContext: No user ID available for profile loading');
      return;
    }

    console.log('ProfileContext: Starting profile load for user:', user.userId);
    try {
      setLoading(true);
      setError(null);
      const userProfile = await getProfile(user.userId);
      console.log('ProfileContext: Profile loaded successfully:', {
        hasProfile: !!userProfile,
        profileData: userProfile ? {
          name: userProfile.name,
          role: userProfile.role,
          company: userProfile.company
        } : null
      });
      setProfile(userProfile);
      setProfileLoaded(true);
    } catch (error) {
      console.error('ProfileContext: Error loading profile from API:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
      setProfileLoaded(true); // Mark as loaded even on error to prevent retries
    } finally {
      setLoading(false);
      console.log('ProfileContext: Profile loading completed');
    }
  }, [user?.userId]);

  // Reset profile when user changes
  useEffect(() => {
    setProfile(null);
    setError(null);
    setProfileLoaded(false);
  }, [user?.userId]);

  // Load profile from API when user is authenticated (only once per user)
  useEffect(() => {
    console.log('ProfileContext: useEffect triggered', {
      hasUser: !!user,
      authLoading,
      profileLoaded,
      loading,
      shouldLoadProfile: user && !profileLoaded && !loading
    });
    
    // Load profile as soon as user is available, don't wait for authLoading to complete
    if (user && !profileLoaded && !loading) {
      console.log('ProfileContext: Conditions met, calling refreshProfile');
      refreshProfile();
    }
  }, [user, authLoading, profileLoaded, loading, refreshProfile]);

  const updateProfile = async (profileData: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.userId) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);
      
      const fullProfile: UserProfile = {
        ...profileData,
        userId: user.userId,
        createdAt: profile?.createdAt,
        updatedAt: profile?.updatedAt,
      };

      const savedProfile = await saveProfile(fullProfile);
      setProfile(savedProfile);
      setProfileLoaded(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);
      await deleteProfile(user.userId);
      setProfile(null);
      setProfileLoaded(true); // Profile successfully deleted, so we know the state
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = () => {
    if (!profile) return false;
    return !!(
      profile.name &&
      profile.role &&
      profile.company
    );
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      error,
      updateProfile,
      clearProfile,
      isProfileComplete,
      refreshProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

 