import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  /** Additional class names */
  className?: string
}

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
  className,
}: SuccessPageProps) {
  const content = (
    <>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <Icon className="h-8 w-8 text-success animate-in" />
      </div>
      <h3 className="text-h3 font-semibold mt-4">{heading}</h3>
      {description && (
        <p className="text-body text-muted-foreground mt-2 max-w-md">
          {description}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {primaryCta && (
          primaryCta.href ? (
            <Button asChild>
              <Link to={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          ) : (
            <Button onClick={primaryCta.onClick}>{primaryCta.label}</Button>
          )
        )}
        {secondaryCta && (
          secondaryCta.href ? (
            <Button asChild variant="outline">
              <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={secondaryCta.onClick}>
              {secondaryCta.label}
            </Button>
          )
        )}
      </div>
    </>
  )

  const baseClasses = cn(
    'flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center animate-fade-in-up',
    variant === 'full' && 'min-h-[400px]', className
  )

  return (
    <div className={baseClasses} role="status" aria-live="polite">
      {content}
    </div>
  )
}
