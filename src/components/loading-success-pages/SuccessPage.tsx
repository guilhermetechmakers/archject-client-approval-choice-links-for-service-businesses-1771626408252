import { Link } from 'react-router-dom'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface SuccessPageProps {
  /** Optional icon (default: CheckCircle2) */
  icon?: React.ComponentType<{ className?: string }>
  /** Success heading */
  heading: string
  /** Optional description */
  description?: string
  /** Optional primary CTA */
  primaryCta?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** Optional secondary CTA */
  secondaryCta?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** Layout variant */
  variant?: 'full' | 'card'
  /** Heading level for accessibility (1-6). Default 2 for standalone pages. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Loading state - shows skeleton when true */
  isLoading?: boolean
  /** Error state - shows error UI with retry when provided */
  error?: { message: string; onRetry?: () => void }
  /** Additional class names */
  className?: string
}

const HEADING_TAG = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

/**
 * Success state with icon, heading, description, and CTAs.
 * Follows design reference: empty states with icon + heading + description + CTA.
 * Success state with checkmark animation.
 */
export function SuccessPage({
  icon: Icon = CheckCircle2,
  heading,
  description,
  primaryCta,
  secondaryCta,
  variant = 'card',
  headingLevel = 2,
  isLoading = false,
  error,
  className,
}: SuccessPageProps) {
  const HeadingTag = HEADING_TAG[headingLevel - 1]

  const content = (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 text-success animate-in" aria-hidden />
      </div>
      <HeadingTag className="text-h2 font-semibold mt-4 sm:text-h1">{heading}</HeadingTag>
      {description && (
        <p className="text-body text-muted-foreground mt-2 max-w-md">
          {description}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {primaryCta && (
          primaryCta.href ? (
            <Button asChild className="rounded-lg">
              <Link to={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          ) : (
            <Button onClick={primaryCta.onClick} className="rounded-lg">
              {primaryCta.label}
            </Button>
          )
        )}
        {secondaryCta && (
          secondaryCta.href ? (
            <Button asChild variant="outline" className="rounded-lg">
              <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={secondaryCta.onClick} className="rounded-lg">
              {secondaryCta.label}
            </Button>
          )
        )}
      </div>
    </>
  )

  const loadingContent = (
    <>
      <div className="h-12 w-12 rounded-full bg-muted animate-pulse sm:h-14 sm:w-14" aria-hidden />
      <div className="mt-4 h-6 w-48 rounded-md bg-muted animate-pulse sm:h-8" />
      <div className="mt-2 h-4 w-64 max-w-full rounded-md bg-muted animate-pulse" />
      <div className="mt-6 flex gap-4 justify-center">
        <div className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
        <div className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
      </div>
    </>
  )

  const errorContent = error ? (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 sm:h-12 sm:w-12" aria-hidden>
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <HeadingTag className="text-h2 font-semibold mt-4 text-destructive sm:text-h1">
        Something went wrong
      </HeadingTag>
      <p className="text-body text-muted-foreground mt-2 max-w-md">
        {error.message}
      </p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {error.onRetry && (
          <Button onClick={error.onRetry} className="rounded-lg">
            Try again
          </Button>
        )}
      </div>
    </>
  ) : null

  const displayContent = isLoading ? loadingContent : error ? errorContent : content

  const baseClasses = cn(
    'flex flex-col items-center justify-center p-8 text-center animate-fade-in-up sm:p-12',
    variant === 'full' && 'min-h-[400px]',
    className
  )

  return (
    <Card
      className={baseClasses}
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <CardContent className="p-0">{displayContent}</CardContent>
    </Card>
  )
}
