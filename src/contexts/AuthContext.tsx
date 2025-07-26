import React, { createContext, useEffect, useState } from 'react'
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, fetchAuthSession, resendSignUpCode, fetchUserAttributes } from 'aws-amplify/auth'

interface User {
  userId: string
  username: string
  email: string
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
  signUp: (username: string, password: string, email: string) => Promise<void>
  signOut: () => Promise<void>
  confirmSignUp: (username: string, code: string) => Promise<void>
  resendConfirmationCode: (username: string) => Promise<void>
  getIdToken: () => Promise<string | null>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initial checkAuthState called')
    checkAuthState()
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
        
        const newUser = {
          userId: currentUser.userId,
          username: currentUser.username,
          email: actualEmail,
          attributes: {
            email: actualEmail,
            email_verified: userAttributes.email_verified === 'true',
            sub: currentUser.userId
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
      await signIn({ username, password })
      console.log('Sign in successful, checking auth state...')
      
      // Check auth state immediately without delay
      await checkAuthState()
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const handleSignUp = async (username: string, password: string, email: string) => {
    try {
      console.log('Signing up user:', username, email)
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      })
      console.log('Sign up successful')
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
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

  const value: AuthContextType = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    getIdToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 