import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
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
      
      toast({
        title: 'Error',
        description: isIncorrectCredentials 
          ? 'Incorrect email or password. If you just registered, please check your email and confirm your account first.'
          : errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const switchToSignUp = () => {
    navigate('/signup')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
                  <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                                disabled={isLoading}
                  />
              {errors.email && (
                    <Alert variant="destructive">
                  <AlertDescription>{errors.email.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
            
            <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                disabled={isLoading}
                  />
                  {errors.password && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.password.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
            
                <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <button 
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors block w-full"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
            <button 
              type="button"
              onClick={() => navigate('/confirm')}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm block w-full"
              disabled={isLoading}
            >
              Need to confirm your account?
            </button>
          </div>
          
          <Separator />
          
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Don't have an account?</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={switchToSignUp}
              type="button"
              disabled={isLoading}
            >
              Create Account
                </Button>
              </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default LoginPage 