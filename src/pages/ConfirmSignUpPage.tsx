import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Target } from 'lucide-react'
import { createProfileWithSignupData } from '../lib/api'

const confirmSchema = z.object({
  code: z.string().min(6, 'Confirmation code must be at least 6 characters'),
})

type ConfirmForm = z.infer<typeof confirmSchema>

const ConfirmSignUpPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const username = searchParams.get('username') || ''
  const email = searchParams.get('email') || ''
  const firstName = searchParams.get('firstName') || ''
  const lastName = searchParams.get('lastName') || ''
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { confirmSignUp, resendConfirmationCode } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
  })

  const onSubmit = async (data: ConfirmForm) => {
    setIsLoading(true)
    try {
      await confirmSignUp(username, data.code)
      
      // Create profile with signup data immediately after confirmation using email as ID
      if (firstName && lastName && email) {
        try {
          await createProfileWithSignupData(email, firstName, lastName, email)
          console.log('Profile created with signup data for user:', email)
        } catch (profileError) {
          console.error('Failed to create profile after confirmation:', profileError)
          // Don't fail the confirmation if profile creation fails - ProfileContext will handle it
        }
      }
      
      toast({
        title: 'Success',
        description: 'Account verified successfully!',
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to verify account',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      await resendConfirmationCode(username)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      toast({
        title: 'Success',
        description: 'Confirmation code resent successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend confirmation code',
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  const onBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Target className="size-5" />
          </div>
          <span className="text-xl font-semibold">Sales Intelligence</span>
        </div>
        
        {/* Confirmation Form Card */}
              <Card>
        <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Verify your account</CardTitle>
            <CardDescription className="text-center">
            Enter the confirmation code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
            {email && (
              <Alert className="mb-4">
                <AlertDescription>
                  Verification code sent to: <strong>{email}</strong>
                </AlertDescription>
              </Alert>
            )}

            {showSuccess && (
              <Alert className="mb-4 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                <AlertDescription>
                  Confirmation code resent successfully!
                </AlertDescription>
              </Alert>
            )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Confirmation Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter your confirmation code"
                {...register('code')}
                className={errors.code ? 'border-red-500' : ''}
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={isLoading}
              />
                              {errors.code && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.code.message}</AlertDescription>
                  </Alert>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify account'}
            </Button>
          </form>
            
          <div className="mt-4 space-y-2">
            <div className="text-center">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={isResending}
                  type="button"
              >
                {isResending ? 'Resending...' : 'Resend confirmation code'}
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                  <button 
                    onClick={onBackToLogin}
                    className="text-primary hover:underline"
                    type="button"
                  >
                  Sign in
                  </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default ConfirmSignUpPage 