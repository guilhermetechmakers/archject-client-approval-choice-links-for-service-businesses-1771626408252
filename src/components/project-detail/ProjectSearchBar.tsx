import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProjectSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Accessible label for the search input */
  ariaLabel?: string
  className?: string
}

export function ProjectSearchBar({
  value,
  onChange,
  placeholder = 'Search approvals, files, contacts...',
  ariaLabel = 'Search approvals, files, contacts, and timeline',
  className,
}: ProjectSearchBarProps) {
  return (
    <div className={cn('relative flex-1 max-w-md', className)} role="search">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9 transition-all duration-200 focus:border-primary"
        aria-label={ariaLabel}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
