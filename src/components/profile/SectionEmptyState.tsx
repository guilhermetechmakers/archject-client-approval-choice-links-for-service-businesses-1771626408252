import { Link } from 'react-router-dom'
import { type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SectionEmptyStateProps {
  icon: LucideIcon
  heading: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    to?: string
  }
  className?: string
}

/**
 * Empty state for profile sections.
 * Follows Design Reference: icon + heading + description + CTA.
 */
export function SectionEmptyState({
  icon: Icon,
  heading,
  description,
  action,
  className,
}: SectionEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 px-4 text-center',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={`${heading}. ${description}`}
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="text-h3 font-medium text-foreground mb-1">{heading}</h3>
      <p className="text-body text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action && (
        action.to ? (
          <Button asChild variant="default" className="rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Link to={action.to}>{action.label}</Link>
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={action.onClick}
            className="rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
