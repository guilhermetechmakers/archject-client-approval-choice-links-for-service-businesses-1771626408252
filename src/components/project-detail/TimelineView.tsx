import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Filter, Plus, SearchX } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { TimelineEvent } from '@/types/project-detail'

interface TimelineViewProps {
  events: TimelineEvent[]
  isLoading?: boolean
  searchQuery?: string
  projectId?: string
  onClearSearch?: () => void
}

const eventTypeLabels: Record<string, string> = {
  approval_sent: 'Sent',
  approval_approved: 'Approved',
  approval_declined: 'Declined',
  file_uploaded: 'File',
  comment_added: 'Comment',
}

/** Uses design tokens: primary, success, danger, info, muted from CSS variables */
const eventTypeColors: Record<string, string> = {
  approval_sent: 'bg-info/10 text-info',
  approval_approved: 'bg-success/10 text-success',
  approval_declined: 'bg-danger/10 text-danger',
  file_uploaded: 'bg-primary/10 text-primary',
  comment_added: 'bg-muted text-muted-foreground',
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffDays > 7) return date.toLocaleDateString()
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  return 'Just now'
}

function filterEvents(events: TimelineEvent[], searchQuery?: string): TimelineEvent[] {
  if (!searchQuery?.trim()) return events
  const q = searchQuery.trim().toLowerCase()
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      (e.description?.toLowerCase().includes(q) ?? false)
  )
}

export function TimelineView({
  events,
  isLoading,
  searchQuery,
  projectId,
  onClearSearch,
}: TimelineViewProps) {
  const [filter, setFilter] = useState<string | null>(null)
  const filteredBySearch = filterEvents(events, searchQuery)
  const eventTypes = [...new Set(filteredBySearch.map((e) => e.type))]

  if (isLoading) {
    return (
      <Card className="rounded-lg border-border bg-card shadow-card" aria-busy="true" role="status" aria-label="Loading timeline events">
        <CardHeader className="rounded-t-lg">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md shrink-0 skeleton-shimmer" />
            <Skeleton className="h-6 w-24 rounded-md skeleton-shimmer" />
          </div>
          <Skeleton className="h-4 w-48 rounded-md mt-2 skeleton-shimmer" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-4 rounded-full shrink-0 skeleton-shimmer" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-4 w-full max-w-[12rem] rounded-md skeleton-shimmer" />
                  <Skeleton className="h-3 w-20 rounded-md skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
          <p className="sr-only">Loading timeline events...</p>
        </CardContent>
      </Card>
    )
  }

  if (!events.length && !searchQuery) {
    const createUrl = projectId ? `/dashboard/approvals/new?project=${projectId}` : '/dashboard/approvals/new'

    return (
      <Card className="rounded-lg border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" id="timeline-empty-heading">
            <Clock className="h-5 w-5 text-muted-foreground" aria-hidden />
            Timeline
          </CardTitle>
          <CardDescription>Chronological project events</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 px-4 text-center bg-muted/30"
            role="status"
            aria-live="polite"
            aria-labelledby="timeline-empty-heading"
            aria-label="No events yet. Events will appear when you send approvals, receive responses, or upload files."
          >
            <div className="rounded-full bg-muted p-4 mb-4">
              <Clock className="h-12 w-12 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="text-h3 font-medium text-foreground mb-1">No events yet</h3>
            <p className="text-body text-muted-foreground max-w-sm mb-6">
              Events will appear here when you send approvals, receive responses, or upload files.
            </p>
            <Button
              asChild
              variant="default"
              className="rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-card hover:shadow-popover"
              aria-label="Create approval request to add first timeline event"
            >
              <Link to={createUrl}>
                <Plus className="h-5 w-5 mr-2" aria-hidden />
                Create Approval Request
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredEvents = filter
    ? filteredBySearch.filter((e) => e.type === filter)
    : filteredBySearch

  return (
    <Card className="rounded-lg border-border bg-card shadow-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2" id="timeline-heading">
              <Clock className="h-5 w-5 text-muted-foreground" aria-hidden />
              Timeline
            </CardTitle>
            <CardDescription>Chronological events with filters</CardDescription>
          </div>
          {eventTypes.length > 1 && (
            <div className="flex items-center gap-2" role="group" aria-label="Filter timeline by event type">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={filter === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(null)}
                  aria-pressed={filter === null}
                  aria-label="Show all event types"
                  className="rounded-md"
                >
                  All
                </Button>
                {eventTypes.map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(type)}
                    aria-pressed={filter === type}
                    aria-label={`Filter by ${eventTypeLabels[type] ?? type} events`}
                    className="rounded-md"
                  >
                    {eventTypeLabels[type] ?? type}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!filteredEvents.length && searchQuery ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 px-4 text-center bg-muted/30"
            role="status"
            aria-live="polite"
            aria-label="No matching events. Try adjusting your search."
          >
            <div className="rounded-full bg-muted p-4 mb-4">
              <SearchX className="h-12 w-12 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="text-h3 font-medium text-foreground mb-1">No matching events</h3>
            <p className="text-body text-muted-foreground max-w-sm mb-6">
              Try adjusting your search to find timeline events.
            </p>
            {onClearSearch && (
              <Button
                variant="outline"
                onClick={onClearSearch}
                className="rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Clear search to show all timeline events"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="relative">
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-border rounded-full"
              aria-hidden
            />
            <div className="space-y-6" role="list" aria-label="Timeline events">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative flex gap-4 rounded-lg p-3 transition-colors duration-200 hover:bg-muted/30"
                  role="listitem"
                >
                  <div
                    className={cn(
                      'relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full',
                      eventTypeColors[event.type] ?? 'bg-muted text-muted-foreground'
                    )}
                    aria-hidden
                  />
                  <div className="flex-1 pb-2 min-w-0">
                    <p className="font-medium text-foreground">{event.title}</p>
                    {event.description && (
                      <p className="text-caption text-muted-foreground mt-0.5">
                        {event.description}
                      </p>
                    )}
                    <p className="text-caption text-muted-foreground mt-1" aria-label={`Event occurred ${formatRelativeTime(event.created_at)}`}>
                      {formatRelativeTime(event.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
