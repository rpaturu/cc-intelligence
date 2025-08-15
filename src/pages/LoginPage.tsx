import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import LoginFormWithErrors from '../components/enhanced-forms/LoginFormWithErrors'
import { LoginFormData } from '../lib/auth-schemas'

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setSubmitError(null)
    try {
      await signIn(data.email, data.password)
      toast({
        title: 'Success',
        description: 'Signed in successfully',
      })
      navigate('/')
    } catch (error: any) {
      // Provide helpful error message for potential unconfirmed users
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      const isIncorrectCredentials = errorMessage.includes('Incorrect username or password')
      
      const finalMessage = isIncorrectCredentials 
        ? 'Incorrect email or password. If you just registered, please check your email and confirm your account first.'
        : errorMessage
      
      setSubmitError(finalMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToSignUp = () => {
    navigate('/signup')
  }

  return (
    <LoginFormWithErrors
      onSubmit={onSubmit}
      onSwitchToSignUp={switchToSignUp}
      isSubmitting={isLoading}
      submitError={submitError}
    />
  )
}

export default LoginPage