import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SupportLinkProps {
  className?: string
  variant?: 'default' | 'reset'
}

export function SupportLink({ className, variant = 'default' }: SupportLinkProps) {
  const isReset = variant === 'reset'
  const linkText = isReset ? 'Contact support if reset fails' : 'Contact support'
  const ariaLabel = isReset
    ? 'Contact support for help if password reset fails'
    : 'Contact support for help'

  return (
    <p
      className={cn(
        'text-center text-caption text-muted-foreground',
        className
      )}
    >
      Need help?{' '}
      <Link
        to="/about/help-center"
        aria-label={ariaLabel}
        className="inline-flex items-center gap-1.5 text-primary ring-offset-background transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm underline-offset-4"
      >
        <HelpCircle className="h-4 w-4 shrink-0" aria-hidden />
        {linkText}
      </Link>
    </p>
  )
}
