import React, { createContext, useEffect, useState } from 'react'
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, fetchAuthSession, resendSignUpCode, fetchUserAttributes } from 'aws-amplify/auth'
import { sessionService } from '../services/SessionService'

interface User {
  userId: string
  username: string
  email: string
  sessionId?: string // NEW: Optional sessionId (non-breaking change)
  attributes?: {
    email: string
    email_verified: boolean
    sub: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signUp: (password: string, email: string) => Promise<string>
  signOut: () => Promise<void>
  confirmSignUp: (username: string, code: string) => Promise<void>
  resendConfirmationCode: (username: string) => Promise<void>
  getIdToken: () => Promise<string | null>
  clearAuthState: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initial checkAuthState called')
    checkAuthState()
    
        // Listen for session expiration events
    const handleSessionExpired = async () => {
      console.log('AuthProvider: Session expired event received, signing out user')
      
      try {
        // Properly sign out from Cognito to clear all tokens
        await signOut()
        await sessionService.destroySession()
        console.log('AuthProvider: Cognito and session service sign out completed')
      } catch (error) {
        console.error('AuthProvider: Error during session expiry sign out:', error)
        // Even if signOut fails, we should still clear the local state
      }
      
      // Clear local user state
      setUser(null)
      
      // Redirect to login page
      window.location.href = '/login'
    }
    
    window.addEventListener('sessionExpired', handleSessionExpired)
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired)
    }
  }, [])

  const checkAuthState = async () => {
    try {
      const session = await fetchAuthSession()
      console.log('Auth session:', session)
      
      if (session.tokens) {
        const currentUser = await getCurrentUser()
        console.log('Current user data:', currentUser)
        
        // Fetch user attributes to get the actual email address
        const userAttributes = await fetchUserAttributes()
        console.log('User attributes:', userAttributes)
        
        const actualEmail = userAttributes.email || currentUser.signInDetails?.loginId || ''
        
        // Create session for sessionId-based authentication
        const sessionId = await sessionService.createSession({
          userId: actualEmail,
          email: actualEmail,
          firstName: userAttributes.given_name || '',
          lastName: userAttributes.family_name || ''
        })

        const newUser = {
          userId: actualEmail, // Use email as the primary identifier instead of UUID
          username: currentUser.username,
          email: actualEmail,
          sessionId, // NEW: Add sessionId to user object
          attributes: {
            email: actualEmail,
            email_verified: userAttributes.email_verified === 'true',
            sub: currentUser.userId // Keep the original Cognito UUID as 'sub' for reference
          }
        }
        
        console.log('Setting user state to:', newUser)
        setUser(newUser)
        console.log('User state set successfully')
      } else {
        console.log('No valid session found, setting user to null')
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth state:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (username: string, password: string) => {
    try {
      console.log('Signing in with:', username)
      
      // Check if user is already authenticated
      try {
        const currentSession = await fetchAuthSession()
        if (currentSession.tokens) {
          console.log('User is already authenticated, signing out first...')
          await signOut()
          await sessionService.destroySession()
          console.log('Previous session cleared, proceeding with new sign in')
        }
      } catch (sessionCheckError) {
        console.log('No existing session found, proceeding with sign in')
      }
      
      // Since user pool is configured for email aliases, users can sign in with email
      await signIn({ username, password })
      console.log('Sign in successful, checking auth state...')
      
      // Check auth state immediately without delay
      await checkAuthState()
    } catch (error: any) {
      console.error('Sign in error:', error)
      
      // Handle specific case where user is already authenticated
      if (error.name === 'UserAlreadyAuthenticatedException') {
        console.log('User already authenticated, attempting to clear session and retry...')
        try {
          await signOut()
          await sessionService.destroySession()
          console.log('Session cleared, retrying sign in...')
          
          // Retry the sign in
          await signIn({ username, password })
          await checkAuthState()
          return
        } catch (retryError) {
          console.error('Failed to retry sign in after clearing session:', retryError)
          throw new Error('Authentication failed. Please refresh the page and try again.')
        }
      }
      
      throw error
    }
  }

  const handleSignUp = async (password: string, email: string): Promise<string> => {
    try {
      console.log('Signing up user:', email)
      // Generate a unique username since the user pool is configured for email aliases
      const uniqueUsername = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      
      await signUp({
        username: uniqueUsername,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      })
      console.log('Sign up successful')
      return uniqueUsername
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      await sessionService.destroySession() // Clean up session
      setUser(null)
      console.log('Sign out successful')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const handleConfirmSignUp = async (username: string, code: string) => {
    try {
      await confirmSignUp({ username, confirmationCode: code })
      console.log('Confirmation successful')
    } catch (error) {
      console.error('Confirmation error:', error)
      throw error
    }
  }

  const handleResendConfirmationCode = async (username: string) => {
    try {
      await resendSignUpCode({ username })
      console.log('Confirmation code resent')
    } catch (error) {
      console.error('Resend confirmation code error:', error)
      throw error
    }
  }

  const getIdToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.idToken?.toString() || null
    } catch (error) {
      console.error('Error getting ID token:', error)
      return null
    }
  }

  const clearAuthState = async (): Promise<void> => {
    try {
      console.log('Clearing all authentication state...')
      
      // Sign out from Cognito
      await signOut()
      
      // Clear session service
      await sessionService.destroySession()
      
      // Clear local user state
      setUser(null)
      
      // Clear any additional storage
      localStorage.removeItem('userId')
      localStorage.removeItem('userData')
      sessionStorage.clear()
      
      console.log('Authentication state cleared successfully')
    } catch (error) {
      console.error('Error clearing auth state:', error)
      // Force clear local state even if signOut fails
      setUser(null)
      sessionStorage.clear()
      localStorage.removeItem('userId')
      localStorage.removeItem('userData')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    getIdToken,
    clearAuthState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 