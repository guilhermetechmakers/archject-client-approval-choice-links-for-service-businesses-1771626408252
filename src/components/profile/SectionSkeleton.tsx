import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface SectionSkeletonProps {
  rows?: number
  className?: string
}

/**
 * Skeleton loader for profile sections.
 */
export function SectionSkeleton({ rows = 3, className }: SectionSkeletonProps) {
  return (
    <div
      className={cn('space-y-4', className)}
      role="status"
      aria-label="Loading content"
      aria-busy
    >
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-16 w-full rounded-lg"
          aria-hidden
        />
      ))}
    </div>
  )
}
