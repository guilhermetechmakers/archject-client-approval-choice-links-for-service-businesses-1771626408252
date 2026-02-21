import { CheckCircle, XCircle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export type VerificationStatus = 'success' | 'error' | 'pending'

export interface VerificationStatusBannerProps {
  status: VerificationStatus
  title: string
  description: string
  className?: string
}

export function VerificationStatusBanner({
  status,
  title,
  description,
  className,
}: VerificationStatusBannerProps) {
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isPending = status === 'pending'

  const statusLabel =
    isSuccess ? 'succeeded' : isError ? 'failed' : 'pending'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Verification ${statusLabel}`}
      className={cn(
        'rounded-2xl border p-6 text-center shadow-card transition-all duration-300',
        'animate-in',
        isSuccess && 'border-success/30 bg-success/5',
        isError && 'border-destructive/30 bg-destructive/5',
        isPending && 'border-primary/30 bg-primary/5',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
          isSuccess && 'bg-success/10',
          isError && 'bg-destructive/10',
          isPending && 'bg-primary/10'
        )}
      >
        {isSuccess && (
          <CheckCircle className="h-10 w-10 text-success" aria-hidden />
        )}
        {isError && (
          <XCircle className="h-10 w-10 text-destructive" aria-hidden />
        )}
        {isPending && (
          <Mail className="h-10 w-10 text-primary" aria-hidden />
        )}
      </div>
      <h2 className="text-h1 mb-2 text-foreground">{title}</h2>
      <p className="text-body text-muted-foreground">{description}</p>
    </div>
  )
}
