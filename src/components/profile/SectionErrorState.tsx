import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SectionErrorStateProps {
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

/**
 * Error state for profile sections with retry.
 */
export function SectionErrorState({
  message = 'We couldn\'t load this section. Please try again.',
  onRetry,
  isRetrying = false,
  className,
}: SectionErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-destructive/30 bg-destructive/5 py-12 px-4 text-center',
        className
      )}
      role="alert"
      aria-live="polite"
      aria-label="Error loading content"
    >
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
      </div>
      <h3 className="text-h3 font-medium text-foreground mb-1">Something went wrong</h3>
      <p className="text-body text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          aria-label="Retry loading"
          aria-busy={isRetrying}
          className="rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isRetrying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
              Retrying…
            </>
          ) : (
            'Try again'
          )}
        </Button>
      )}
    </div>
  )
}
