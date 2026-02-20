import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type PrimaryCTAMode = 'go-to-dashboard' | 'resend-verification' | 'pending'

export interface PrimaryCTAProps {
  mode: PrimaryCTAMode
  onResend?: (email?: string) => void
  isResending?: boolean
  hasEmail?: boolean
  className?: string
}

export function PrimaryCTA({
  mode,
  onResend,
  isResending = false,
  hasEmail = true,
  className,
}: PrimaryCTAProps) {
  const isSuccess = mode === 'go-to-dashboard'
  const isPending = mode === 'pending'

  if (isSuccess) {
    return (
      <Button
        asChild
        className={cn(
          'w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
          className
        )}
      >
        <Link to="/dashboard">Go to dashboard</Link>
      </Button>
    )
  }

  if (isPending) {
    return (
      <div className={cn('space-y-3', className)}>
        <Button
          onClick={() => onResend?.()}
          disabled={isResending}
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        >
          {isResending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending...
            </>
          ) : (
            'Resend verification email'
          )}
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link to="/login">Back to login</Link>
        </Button>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')
    const email = emailInput?.value?.trim()
    onResend?.(email)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {!hasEmail && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Label htmlFor="resend-email">Email address</Label>
          <Input
            id="resend-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            disabled={isResending}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="submit"
            disabled={isResending}
            className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sending...
              </>
            ) : (
              'Resend verification email'
            )}
          </Button>
        </form>
      )}
      {hasEmail && (
        <Button
          onClick={() => onResend?.()}
          disabled={isResending}
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        >
          {isResending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending...
            </>
          ) : (
            'Resend verification email'
          )}
        </Button>
      )}
      <Button variant="outline" asChild className="w-full">
        <Link to="/login">Back to login</Link>
      </Button>
    </div>
  )
}
