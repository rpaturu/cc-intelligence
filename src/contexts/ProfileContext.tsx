import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProfile, saveProfile, deleteProfile, createEmptyProfile } from '../lib/api';
import type { UserProfile } from '../lib/api';

// Re-export UserProfile for convenience
export type { UserProfile };

interface ProfileContextType {
  profile: UserProfile | null;
  hasProfile: boolean;
  loading: boolean;
  error: string | null;
  updateProfile: (profile: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  clearProfile: () => Promise<void>;
  isProfileComplete: () => boolean;
  refreshProfile: () => Promise<void>;
  ensureProfileExists: () => Promise<void>;
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
      const userProfile = await getProfile();
      console.log('ProfileContext: Profile loaded successfully:', {
        hasProfile: !!userProfile,
        profileData: userProfile ? {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          role: userProfile.role,
          company: userProfile.company
        } : null
      });
      setProfile(userProfile);
      setProfileLoaded(true);
    } catch (error) {
      console.error('ProfileContext: Error loading profile from API:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
      setProfile(null);
      setProfileLoaded(true); // Mark as loaded even on error to prevent retries
    } finally {
      setLoading(false);
      console.log('ProfileContext: Profile loading completed');
    }
  }, [user?.userId]);

  const ensureProfileExists = useCallback(async () => {
    if (!user?.userId) {
      console.log('ProfileContext: No user ID available for profile creation');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // First try to load existing profile
      const existingProfile = await getProfile();
      if (existingProfile) {
        console.log('ProfileContext: Profile already exists for user');
        setProfile(existingProfile);
        setProfileLoaded(true);
        return;
      }

      // No profile exists, create empty one
      console.log('ProfileContext: No profile found, creating empty profile for user:', user.userId);
      const emptyProfile = await createEmptyProfile();
      console.log('ProfileContext: Empty profile created successfully:', emptyProfile);
      setProfile(emptyProfile);
      setProfileLoaded(true);
    } catch (error) {
      console.error('ProfileContext: Error ensuring profile exists:', error);
      setError(error instanceof Error ? error.message : 'Failed to create profile');
      setProfile(null);
      setProfileLoaded(true);
    } finally {
      setLoading(false);
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
      shouldLoadProfile: user && !authLoading && !profileLoaded && !loading
    });
    
    // Wait for auth to complete, then ensure profile exists
    if (user && !authLoading && !profileLoaded && !loading) {
      console.log('ProfileContext: Conditions met, ensuring profile exists');
      ensureProfileExists();
    }
  }, [user, authLoading, profileLoaded, loading, ensureProfileExists]);

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

      console.log('ProfileContext: Saving profile:', fullProfile);
      const savedProfile = await saveProfile(fullProfile);
      console.log('ProfileContext: Profile saved successfully:', savedProfile);
      setProfile(savedProfile);
      setProfileLoaded(true);
    } catch (error) {
      console.error('ProfileContext: Error saving profile:', error);
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
      await deleteProfile();
      setProfile(null);
      setProfileLoaded(true); // Profile successfully deleted, so we know the state
    } catch (error) {
      console.error('ProfileContext: Error deleting profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = () => {
    if (!profile) return false;
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.role &&
      profile.company
    );
  };

  const hasProfile = !!profile;

  return (
    <ProfileContext.Provider value={{
      profile,
      hasProfile,
      loading,
      error,
      updateProfile,
      clearProfile,
      isProfileComplete,
      refreshProfile,
      ensureProfileExists
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

 