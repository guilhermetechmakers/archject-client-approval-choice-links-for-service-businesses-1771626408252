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
  /** Retry button aria-label for accessibility */
  retryAriaLabel?: string
  /** Retry callback */
  onRetry?: () => void
  /** Layout variant */
  variant?: 'full' | 'card'
  /** Heading level for accessibility (1-6). Default h3 for proper document outline. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Additional class names */
  className?: string
}

const HEADING_TAG = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

/**
 * Error state with icon, heading, description, and retry button.
 * Follows design reference: error states with retry buttons.
 * Uses design tokens for all colors and proper heading semantics for accessibility.
 */
export function ErrorState({
  icon: Icon = AlertCircle,
  heading = 'Something went wrong',
  description = 'There was a problem loading this content. Please try again.',
  retryLabel = 'Try again',
  retryAriaLabel,
  onRetry,
  variant = 'card',
  headingLevel = 3,
  className,
}: ErrorStateProps) {
  const HeadingTag = HEADING_TAG[headingLevel - 1]

  const content = (
    <>
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
        aria-hidden
      >
        <Icon
          className="h-8 w-8 text-destructive"
          aria-hidden
        />
      </div>
      <HeadingTag className="mt-4 text-h3 font-semibold text-foreground">
        {heading}
      </HeadingTag>
      <p className="mt-2 max-w-md text-body text-muted-foreground">
        {description}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="mt-6"
          variant="outline"
          aria-label={retryAriaLabel ?? retryLabel}
        >
          {retryLabel}
        </Button>
      )}
    </>
  )

  const baseClasses = cn(
    'flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-center animate-fade-in-up sm:p-12',
    variant === 'full' && 'min-h-[min(25rem,100vh-12rem)]',
    className
  )

  return (
    <div
      className={baseClasses}
      role="alert"
      aria-live="assertive"
    >
      {content}
    </div>
  )
}
