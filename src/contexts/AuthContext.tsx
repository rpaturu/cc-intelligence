import React, { createContext, useContext, useEffect, useState } from 'react'
import { signIn, /* signUp, */ signOut, getCurrentUser, /* confirmSignUp, */ fetchAuthSession, /* resendSignUpCode */ } from 'aws-amplify/auth'

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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

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
        
        const newUser = {
          userId: currentUser.userId,
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId || '',
          attributes: currentUser.signInDetails?.loginId ? {
            email: currentUser.signInDetails.loginId,
            email_verified: true,
            sub: currentUser.userId
          } : undefined
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

  const handleSignUp = async (): Promise<never> => {
    // Signup temporarily disabled
    throw new Error('Registration is currently disabled. Please contact your administrator.')
  }

  const handleSignOut = async () => {
      await signOut()
      setUser(null)
  }

  const handleConfirmSignUp = async (): Promise<never> => {
    // Signup confirmation temporarily disabled
    throw new Error('Registration confirmation is currently disabled.')
  }

  const handleResendConfirmationCode = async (): Promise<never> => {
    // Resend confirmation temporarily disabled
    throw new Error('Resend confirmation is currently disabled.')
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

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    getIdToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 