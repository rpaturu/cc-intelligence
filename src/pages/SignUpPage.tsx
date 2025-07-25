import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Target } from 'lucide-react'

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpForm = z.infer<typeof signUpSchema>

const SignUpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true)
    try {
      console.log('Signing up user:', data.username, data.email)
      await signUp(data.username, data.password, data.email)
      console.log('Signup successful, redirecting to confirmation page')
      toast({
        title: 'Success',
        description: 'Account created successfully. Please check your email for verification.',
      })
      navigate(`/confirm?username=${encodeURIComponent(data.username)}`)
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2 self-center">
          <Avatar>
            <AvatarFallback>
              <Target className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <span>Sales Intelligence</span>
        </div>

        {/* SignUp Form Card */}
        <Card className="w-full max-w-sm">
                  <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start your sales intelligence journey
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register('username')}

              />
                              {errors.username && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.username.message}</AlertDescription>
                  </Alert>
                )}
            </div>
              <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}

              />
                              {errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.email.message}</AlertDescription>
                  </Alert>
                )}
            </div>
              <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}

              />
                              {errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.password.message}</AlertDescription>
                  </Alert>
                )}
            </div>
              <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}

              />
                              {errors.confirmPassword && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.confirmPassword.message}</AlertDescription>
                  </Alert>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            </div>
          </form>
          </CardContent>
          <CardFooter>
            <p>
              Already have an account?{' '}
              <Link to="/login">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
          </div>
    </div>
  )
}

export default SignUpPage 