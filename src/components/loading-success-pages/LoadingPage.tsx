import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface LoadingPageProps {
  /** Optional icon to show during loading */
  icon?: React.ComponentType<{ className?: string }>
  /** Layout variant: 'full' for full-page, 'card' for card-contained */
  variant?: 'full' | 'card'
  /** Additional class names */
  className?: string
}

/**
 * Full-page or card-contained loading skeleton.
 * Follows design reference: skeleton screens matching content layout, shimmer effects.
 */
export function LoadingPage({
  icon: Icon = BarChart3,
  variant = 'full',
  className,
}: LoadingPageProps) {
  const content = (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full animate-pulse" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
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
        className={cn('flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center', className)}
        role="status"
        aria-label="Loading"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon className="h-8 w-8 animate-pulse text-muted-foreground" />
        </div>
        <Skeleton className="h-6 w-48 mt-4" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
    )
  }

  return (
    <div className={cn('min-h-[400px]', className)} role="status" aria-label="Loading">
      {content}
    </div>
  )
}
