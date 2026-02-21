import { BarChart3, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface LoadingPageProps {
  /** Optional icon to show during loading */
  icon?: React.ComponentType<{ className?: string }>
  /** Layout variant: 'full' for full-page, 'card' for card-contained */
  variant?: 'full' | 'card'
  /** Optional retry callback - when provided, shows retry button */
  onRetry?: () => void | Promise<void>
  /** Retry button label */
  retryLabel?: string
  /** Retry button aria-label for accessibility */
  retryAriaLabel?: string
  /** When true, shows loading state on retry button during async action */
  isRetrying?: boolean
  /** Accessible description for screen readers */
  loadingMessage?: string
  /** Additional class names */
  className?: string
}

/**
 * Full-page or card-contained loading skeleton.
 * Follows design reference: skeleton screens matching content layout, shimmer effects.
 * Uses design tokens for all colors. Supports optional retry with loading state.
 */
export function LoadingPage({
  icon: Icon = BarChart3,
  variant = 'full',
  onRetry,
  retryLabel = 'Try again',
  retryAriaLabel,
  isRetrying = false,
  loadingMessage = 'Loading page content, please wait',
  className,
}: LoadingPageProps) {
  const content = (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-64 skeleton-shimmer" />
          <Skeleton className="h-5 w-96 mt-2 skeleton-shimmer" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24 skeleton-shimmer" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-16 skeleton-shimmer" />
              <Skeleton className="h-4 w-32 mt-2 skeleton-shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 skeleton-shimmer" />
            <Skeleton className="h-4 w-64 mt-1 skeleton-shimmer" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full skeleton-shimmer" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 skeleton-shimmer" />
            <Skeleton className="h-4 w-48 mt-1 skeleton-shimmer" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full skeleton-shimmer" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-center sm:p-12',
          className
        )}
        role="status"
        aria-label={loadingMessage}
        aria-busy="true"
        aria-live="polite"
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"
          aria-hidden
        >
          <Icon
            className="h-8 w-8 animate-pulse text-muted-foreground"
            aria-hidden
          />
        </div>
        <Skeleton className="h-6 w-48 mt-4 skeleton-shimmer" />
        <Skeleton className="h-4 w-64 mt-2 skeleton-shimmer" />
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-6"
            disabled={isRetrying}
            aria-label={retryAriaLabel ?? (isRetrying ? 'Retrying, please wait' : retryLabel)}
          >
            {isRetrying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>Retrying...</span>
              </>
            ) : (
              retryLabel
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn('min-h-[400px]', className)}
      role="status"
      aria-label={loadingMessage}
      aria-busy="true"
      aria-live="polite"
    >
      {content}
      {onRetry && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onRetry}
            variant="outline"
            disabled={isRetrying}
            aria-label={retryAriaLabel ?? (isRetrying ? 'Retrying, please wait' : retryLabel)}
          >
            {isRetrying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>Retrying...</span>
              </>
            ) : (
              retryLabel
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
