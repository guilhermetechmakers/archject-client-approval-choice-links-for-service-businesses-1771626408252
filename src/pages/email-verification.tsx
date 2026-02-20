import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LandingHeader } from '@/components/layout/landing-header'

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('status') !== 'error'

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            {success ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <CardTitle className="text-h1">Email verified</CardTitle>
                <CardDescription>
                  Your email has been successfully verified. You can now access
                  your account.
                </CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-h1">Verification failed</CardTitle>
                <CardDescription>
                  The verification link may have expired or is invalid. Please
                  request a new verification email.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to={success ? '/dashboard' : '/login'}>
                {success ? 'Go to dashboard' : 'Back to login'}
              </Link>
            </Button>
            {!success && (
              <Button variant="outline" asChild className="w-full">
                <Link to="/resend-verification">Resend verification email</Link>
              </Button>
            )}
            <p className="text-center text-caption text-muted-foreground">
              Need help?{' '}
              <Link to="/help" className="text-primary hover:underline">
                Contact support
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
