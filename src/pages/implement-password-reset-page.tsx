/**
 * Password Reset Page - Unified flow for request form and token validation.
 * Handles: Request Form (email) → Token Validation (new password) → Success Confirmation
 */

import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle,
  KeyRound,
  XCircle,
  Loader2,
  Mail,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LandingHeader } from '@/components/layout/landing-header'
import {
  PasswordStrengthMeter,
  SupportLink,
} from '@/components/password-reset'
import {
  getPasswordStrength,
  meetsMinimumPasswordRequirements,
} from '@/lib/password-strength'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// --- Schemas ---

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => meetsMinimumPasswordRequirements(data.password), {
    message: 'Password must include uppercase, lowercase, and a number',
    path: ['password'],
  })

type RequestFormData = z.infer<typeof requestSchema>
type ResetFormData = z.infer<typeof resetSchema>

type TokenState = 'loading' | 'valid' | 'invalid' | null
type FlowStep = 'request' | 'request-success' | 'validate' | 'success'

export function PasswordResetPage() {
  const location = useLocation()
  const [flowStep, setFlowStep] = useState<FlowStep>('request')
  const [tokenState, setTokenState] = useState<TokenState>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Request form ---
  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  })

  // --- Reset form ---
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const password = resetForm.watch('password', '')
  const strengthResult = getPasswordStrength(password)

  const hasRecoveryHash = useCallback(() => {
    const hash = location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    return (
      params.get('type') === 'recovery' &&
      (params.get('access_token') || params.get('refresh_token'))
    )
  }, [location.hash])

  const validateRecoverySession = useCallback(async () => {
    if (!supabase) {
      setTokenState(hasRecoveryHash() ? 'invalid' : null)
      return
    }

    if (!hasRecoveryHash()) {
      setTokenState(null)
      return
    }

    setTokenState('loading')

    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        setTokenState('invalid')
        return
      }
      if (session?.user) {
        setTokenState('valid')
        setFlowStep('validate')
        return
      }
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)))
    }

    const { data: { session } } = await supabase.auth.getSession()
    setTokenState(session?.user ? 'valid' : 'invalid')
    if (session?.user) {
      setFlowStep('validate')
    }
  }, [hasRecoveryHash])

  useEffect(() => {
    if (hasRecoveryHash()) {
      validateRecoverySession()
    } else {
      setTokenState(null)
      setFlowStep('request')
    }
  }, [hasRecoveryHash, validateRecoverySession])

  useEffect(() => {
    document.title = 'Reset Password | Archject'
    return () => {
      document.title = 'Archject'
    }
  }, [])

  const onRequestSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true)
    try {
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) {
          toast.error(error.message)
          return
        }
        setFlowStep('request-success')
        toast.success('Check your email for the reset link')
      } else {
        await new Promise((r) => setTimeout(r, 1000))
        setFlowStep('request-success')
        toast.success('Check your email for the reset link')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onResetSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true)
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ password: data.password })
        if (error) {
          toast.error(error.message)
          return
        }
        await supabase.auth.signOut()
        toast.success('Password updated successfully')
        setFlowStep('success')
      } else {
        await new Promise((r) => setTimeout(r, 1000))
        toast.success('Password updated successfully')
        setFlowStep('success')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Loading: validating token ---
  if (tokenState === 'loading') {
    return (
      <div
        className="min-h-screen flex flex-col hero-gradient-bg"
        aria-busy="true"
        aria-live="polite"
        aria-label="Validating password reset link"
      >
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md animate-in shadow-card">
            <CardHeader className="space-y-1 text-center">
              <Skeleton className="mx-auto mb-4 h-16 w-16 rounded-full skeleton-shimmer animate-none" />
              <Skeleton className="mx-auto h-8 w-48 skeleton-shimmer animate-none" />
              <Skeleton className="mx-auto h-4 w-64 skeleton-shimmer animate-none" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 skeleton-shimmer animate-none" />
                <Skeleton className="h-10 w-full rounded-md skeleton-shimmer animate-none" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 skeleton-shimmer animate-none" />
                <Skeleton className="h-10 w-full rounded-md skeleton-shimmer animate-none" />
              </div>
              <Skeleton className="h-10 w-full rounded-md skeleton-shimmer animate-none" />
              <div className="flex items-center justify-center gap-2 pt-2">
                <Loader2
                  className="h-4 w-4 animate-spin text-primary"
                  aria-hidden
                />
                <span className="text-caption text-muted-foreground">
                  Validating reset link...
                </span>
              </div>
            </CardContent>
          </Card>
          <p className="sr-only" role="status">
            Validating your password reset link. Please wait.
          </p>
        </main>
      </div>
    )
  }

  // --- Invalid token ---
  if (tokenState === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col hero-gradient-bg">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md animate-in shadow-card hover:shadow-popover transition-shadow duration-300">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-10 w-10 text-destructive" aria-hidden />
              </div>
              <CardTitle className="text-h1">Link expired or invalid</CardTitle>
              <CardDescription>
                This password reset link has expired or is invalid. Please
                request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                asChild
                className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-popover"
                aria-label="Request a new password reset link"
              >
                <Link to="/forgot-password">Request new reset link</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full"
                aria-label="Return to login page"
              >
                <Link to="/login">Back to login</Link>
              </Button>
              <SupportLink variant="reset" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // --- Success: password updated ---
  if (flowStep === 'success') {
    return (
      <div className="min-h-screen flex flex-col hero-gradient-bg">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md animate-in shadow-card hover:shadow-popover transition-shadow duration-300 border-success/30">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-10 w-10 text-success" aria-hidden />
              </div>
              <CardTitle className="text-h1">Password reset</CardTitle>
              <CardDescription>
                Your password has been updated successfully. You can now sign
                in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                asChild
                className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-popover"
                aria-label="Return to login page"
              >
                <Link to="/login">Back to login</Link>
              </Button>
              <SupportLink variant="reset" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // --- Request success: check email ---
  if (flowStep === 'request-success') {
    return (
      <div className="min-h-screen flex flex-col hero-gradient-bg">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md animate-in shadow-card hover:shadow-popover transition-shadow duration-300">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <Mail className="h-10 w-10 text-success" aria-hidden />
              </div>
              <CardTitle className="text-h1">Check your email</CardTitle>
              <CardDescription>
                We&apos;ve sent a reset link to your email. The link will expire
                in 1 hour.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 text-center animate-in">
                <Button
                  asChild
                  className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-popover"
                  aria-label="Return to login page"
                >
                  <Link to="/login">Back to login</Link>
                </Button>
                <p className="text-caption text-muted-foreground">
                  Didn&apos;t receive the email?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setFlowStep('request')}
                  >
                    Try again
                  </button>
                </p>
                <SupportLink variant="reset" />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // --- Token validation: set new password ---
  if (flowStep === 'validate') {
    const { register, handleSubmit, formState: { errors } } = resetForm
    return (
      <div className="min-h-screen flex flex-col hero-gradient-bg">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md animate-in shadow-card hover:shadow-popover transition-shadow duration-300">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <KeyRound className="h-10 w-10 text-primary" aria-hidden />
              </div>
              <CardTitle className="text-h1">Set new password</CardTitle>
              <CardDescription>
                Enter your new password below. Make sure it meets the strength
                requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onResetSubmit)}
                className={cn(
                  'space-y-4',
                  (errors.password || errors.confirmPassword) && 'animate-shake'
                )}
                aria-label="Set new password form"
              >
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={
                      errors.password
                        ? 'border-destructive focus-visible:ring-destructive/20'
                        : ''
                    }
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password
                        ? 'password-error'
                        : password
                          ? 'password-strength'
                          : undefined
                    }
                    aria-label="New password"
                  />
                  {password && (
                    <PasswordStrengthMeter
                      result={strengthResult}
                      id="password-strength"
                    />
                  )}
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-caption text-destructive"
                      role="alert"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className={
                      errors.confirmPassword
                        ? 'border-destructive focus-visible:ring-destructive/20'
                        : ''
                    }
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword
                        ? 'confirmPassword-error'
                        : undefined
                    }
                    aria-label="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="text-caption text-destructive"
                      role="alert"
                    >
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-popover"
                  disabled={isSubmitting}
                  aria-label={
                    isSubmitting ? 'Updating password' : 'Update password'
                  }
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Updating...
                    </>
                  ) : (
                    'Update password'
                  )}
                </Button>
                <p className="text-center">
                  <Link
                    to="/login"
                    className="text-caption text-primary hover:underline"
                    aria-label="Return to login page"
                  >
                    Back to login
                  </Link>
                </p>
                <SupportLink variant="reset" />
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // --- Request form: email input ---
  const { register, handleSubmit, formState: { errors } } = requestForm
  return (
    <div className="min-h-screen flex flex-col hero-gradient-bg">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md animate-in shadow-card hover:shadow-popover transition-all duration-300">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-10 w-10 text-primary" aria-hidden />
            </div>
            <CardTitle className="text-h1">Reset password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit(onRequestSubmit)}
              className={cn('space-y-4', errors.email && 'animate-shake')}
              aria-label="Request password reset form"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  {...register('email')}
                  className={
                    errors.email
                      ? 'border-destructive focus-visible:ring-destructive/20'
                      : ''
                  }
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-label="Email address"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-caption text-destructive"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-popover"
                disabled={isSubmitting}
                aria-label={
                  isSubmitting ? 'Sending reset link' : 'Send reset link'
                }
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
              <p className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-caption text-primary hover:underline"
                  aria-label="Return to login page"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to login
                </Link>
              </p>
              <SupportLink variant="reset" />
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
