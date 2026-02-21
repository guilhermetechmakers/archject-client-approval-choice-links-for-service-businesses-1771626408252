import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  /** Optional icon to show */
  icon?: React.ComponentType<{ className?: string }>
  /** Error heading */
  heading?: string
  /** Error description */
  description?: string
  /** Retry button label */
  retryLabel?: string
  /** Retry callback */
  onRetry?: () => void
  /** Layout variant */
  variant?: 'full' | 'card'
  /** Additional class names */
  className?: string
}

/**
 * Error state with icon, heading, description, and retry button.
 * Follows design reference: error states with retry buttons.
 */
export function ErrorState({
  icon: Icon = AlertCircle,
  heading = 'Something went wrong',
  description = 'There was a problem loading this content. Please try again.',
  retryLabel = 'Try again',
  onRetry,
  variant = 'card',
  className,
}: ErrorStateProps) {
  const content = (
    <>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-h3 font-semibold mt-4">{heading}</h3>
      <p className="text-body text-muted-foreground mt-2 max-w-md">
        {description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-6" variant="outline">
          {retryLabel}
        </Button>
      )}
    </>
  )

  const baseClasses = cn(
    'flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center animate-fade-in-up',
    variant === 'full' && 'min-h-[400px]', className
  )

  return (
    <div className={baseClasses} role="alert" aria-live="assertive">
      {content}
    </div>
  )
}
