import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SupportLinkProps {
  className?: string
  variant?: 'default' | 'reset'
}

export function SupportLink({ className, variant = 'default' }: SupportLinkProps) {
  const isReset = variant === 'reset'

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
        className="inline-flex items-center gap-1.5 text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
        {isReset ? 'Contact support if reset fails' : 'Contact support'}
      </Link>
    </p>
  )
}
