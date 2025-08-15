import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import SignUpFormWithErrors from '../components/enhanced-forms/SignUpFormWithErrors'
import { SignUpFormData } from '../lib/auth-schemas'

const SignUpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setSubmitError(null)
    try {
      const username = await signUp(data.password, data.email)
      toast({
        title: 'Success',
        description: 'Account created successfully! Please check your email to confirm your account.',
      })
      navigate(`/confirm?username=${encodeURIComponent(username)}`)
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
      setSubmitError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToLogin = () => {
    navigate('/login')
  }

  return (
    <SignUpFormWithErrors
      onSubmit={onSubmit}
      onSwitchToLogin={switchToLogin}
      isSubmitting={isLoading}
      submitError={submitError}
    />
  )
}

export default SignUpPage