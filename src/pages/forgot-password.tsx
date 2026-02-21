import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LandingHeader } from '@/components/layout/landing-header'
import { SupportLink } from '@/components/password-reset'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Reset Password | Archject'
    return () => {
      document.title = 'Archject'
    }
  }, [])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) {
          toast.error(error.message)
          return
        }
        setSubmitted(true)
        toast.success('Check your email for the reset link')
      } else {
        await new Promise((r) => setTimeout(r, 1000))
        setSubmitted(true)
        toast.success('Check your email for the reset link')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col hero-gradient-bg">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-6">
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
            {submitted ? (
              <div className="space-y-4 text-center animate-in">
                <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-success">
                  Check your email for a reset link. The link will expire in 1 hour.
                </div>
                <Button asChild className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                  <Link to="/login">Back to login</Link>
                </Button>
                <p className="text-caption text-muted-foreground">
                  Didn&apos;t receive the email?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setSubmitted(false)}
                  >
                    Try again
                  </button>
                </p>
                <SupportLink variant="reset" />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={cn('space-y-4', errors.email && 'animate-shake')}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-caption text-destructive" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
                <p className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-caption text-primary hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back to login
                  </Link>
                </p>
                <SupportLink variant="reset" />
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
