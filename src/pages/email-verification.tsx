import { useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

const PAGE_TITLE = 'Email Verification | Archject — Client Approval & Choice Links'
import { LandingHeader } from '@/components/layout/landing-header'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  VerificationStatusBanner,
  PrimaryCTA,
  SupportLink,
} from '@/components/email-verification-page'
import type { VerificationStatus } from '@/components/email-verification-page'
import { useResendVerification } from '@/hooks/use-email-verification'
import { supabase } from '@/lib/supabase'

const PENDING_VERIFIED_EMAIL_KEY = 'archject_pending_verified_email'

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const statusParam = searchParams.get('status')
  const emailParam = searchParams.get('email')
  const success = statusParam === 'success'
  const pending = statusParam === 'pending' || (statusParam !== 'error' && statusParam !== 'success')
  const error = statusParam === 'error'

  const status: VerificationStatus = success
    ? 'success'
    : error
      ? 'error'
      : 'pending'

  const resendMutation = useResendVerification()

  useEffect(() => {
    document.title = PAGE_TITLE
    return () => {
      document.title = 'Archject — Client Approval & Choice Links'
    }
  }, [])

  useEffect(() => {
    const email = emailParam ?? sessionStorage.getItem(PENDING_VERIFIED_EMAIL_KEY)
    if (email) setPendingEmail(email)
    else if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const email = session?.user?.email ?? null
        if (email) setPendingEmail(email)
      })
    }
  }, [emailParam])

  const handleResend = useCallback(
    (email?: string) => {
      const resolvedEmail = email ?? emailParam ?? pendingEmail
      if (resolvedEmail) {
        resendMutation.mutate(resolvedEmail)
      }
    },
    [emailParam, pendingEmail, resendMutation]
  )

  const hasEmail = !!(emailParam ?? pendingEmail)

  const title = success
    ? 'Email verified'
    : pending
      ? 'Check your email'
      : 'Verification failed'
  const description = success
    ? 'Your email has been successfully verified. You can now access your account.'
    : pending
      ? 'We sent a verification link to your email. Click the link to verify your account.'
      : 'The verification link may have expired or is invalid. Please request a new verification email.'

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-2xl shadow-card hover:shadow-popover transition-shadow duration-300 animate-in">
          <CardContent className="pt-6 space-y-6">
            <VerificationStatusBanner
              status={status}
              title={title}
              description={description}
            />
            <PrimaryCTA
              mode={
                success
                  ? 'go-to-dashboard'
                  : pending
                    ? 'pending'
                    : 'resend-verification'
              }
              onResend={handleResend}
              isResending={resendMutation.isPending}
              hasEmail={hasEmail}
            />
            <SupportLink />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export function EmailVerificationPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-2xl shadow-card">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4 text-center">
              <Skeleton className="mx-auto h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export function setPendingVerifiedEmail(email: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(PENDING_VERIFIED_EMAIL_KEY, email)
  }
}

export function clearPendingVerifiedEmail() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PENDING_VERIFIED_EMAIL_KEY)
  }
}
