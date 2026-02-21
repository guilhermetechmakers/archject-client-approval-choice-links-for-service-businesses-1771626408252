import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, KeyRound, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LandingHeader } from '@/components/layout/landing-header'
import { PasswordStrengthMeter, SupportLink } from '@/components/password-reset'
import { getPasswordStrength, meetsMinimumPasswordRequirements } from '@/lib/password-strength'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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

type ResetFormData = z.infer<typeof resetSchema>

type PageState = 'loading' | 'valid' | 'invalid' | 'success'

export function ResetPasswordPage() {
  const location = useLocation()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const password = watch('password', '')
  const strengthResult = getPasswordStrength(password)

  const validateRecoverySession = useCallback(async () => {
    if (!supabase) {
      setPageState('valid')
      return
    }

    const hash = location.hash
    const params = new URLSearchParams(hash.replace('#', ''))

    if (params.get('type') === 'recovery' && (params.get('access_token') || params.get('refresh_token'))) {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        setPageState('invalid')
        return
      }
      if (session) {
        setPageState('valid')
        return
      }
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setPageState('valid')
      return
    }

    setPageState('invalid')
  }, [location.hash])

  useEffect(() => {
    validateRecoverySession()
  }, [validateRecoverySession])

  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true)
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ password: data.password })
        if (error) {
          toast.error(error.message)
          return
        }
        await supabase.auth.signOut()
        setPageState('success')
        toast.success('Password updated successfully')
      } else {
        await new Promise((r) => setTimeout(r, 1000))
        setPageState('success')
        toast.success('Password updated successfully')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex flex-col hero-gradient-bg">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md animate-in">
            <CardContent className="pt-6 flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
              <p className="text-body text-muted-foreground">Validating reset link...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col hero-gradient-bg">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md animate-in shadow-card">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-10 w-10 text-destructive" aria-hidden />
              </div>
              <CardTitle className="text-h1">Link expired or invalid</CardTitle>
              <CardDescription>
                This password reset link has expired or is invalid. Please request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <Link to="/forgot-password">Request new reset link</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/login">Back to login</Link>
              </Button>
              <SupportLink variant="reset" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'success') {
    return (
      <div className="min-h-screen flex flex-col hero-gradient-bg">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md animate-in shadow-card border-success/30">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-10 w-10 text-success" aria-hidden />
              </div>
              <CardTitle className="text-h1">Password reset</CardTitle>
              <CardDescription>
                Your password has been updated successfully. You can now sign in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                <Link to="/login">Back to login</Link>
              </Button>
              <SupportLink variant="reset" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col hero-gradient-bg">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md animate-in shadow-card hover:shadow-popover transition-all duration-300">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-10 w-10 text-primary" aria-hidden />
            </div>
            <CardTitle className="text-h1">Set new password</CardTitle>
            <CardDescription>
              Enter your new password below. Make sure it meets the strength requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={cn(
                'space-y-4',
                (errors.password || errors.confirmPassword) && 'animate-shake'
              )}
            >
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                  className={errors.password ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                  autoComplete="new-password"
                />
                {passwordValue && (
                  <PasswordStrengthMeter result={strengthResult} />
                )}
                {errors.password && (
                  <p className="text-caption text-destructive">
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
                  className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-caption text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                disabled={isSubmitting}
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
