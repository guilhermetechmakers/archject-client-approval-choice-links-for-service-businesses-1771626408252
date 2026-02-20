import { useState } from 'react'
import { Clock, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TimelineEvent } from '@/types/project-detail'

interface TimelineViewProps {
  events: TimelineEvent[]
  isLoading?: boolean
  searchQuery?: string
}

const eventTypeLabels: Record<string, string> = {
  approval_sent: 'Sent',
  approval_approved: 'Approved',
  approval_declined: 'Declined',
  file_uploaded: 'File',
  comment_added: 'Comment',
}

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

export function TimelineView({ events, isLoading, searchQuery }: TimelineViewProps) {
  const [filter, setFilter] = useState<string | null>(null)
  const filteredBySearch = filterEvents(events, searchQuery)
  const eventTypes = [...new Set(filteredBySearch.map((e) => e.type))]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-36 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-4 animate-pulse rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!events.length && !searchQuery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline
          </CardTitle>
          <CardDescription>Chronological project events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-h3 font-medium mb-1">No events yet</h3>
            <p className="text-body text-muted-foreground max-w-sm">
              Events will appear here when you send approvals, receive responses, or upload files.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredEvents = filter
    ? filteredBySearch.filter((e) => e.type === filter)
    : filteredBySearch

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline
            </CardTitle>
            <CardDescription>Chronological events with filters</CardDescription>
          </div>
          {eventTypes.length > 1 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={filter === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(null)}
                >
                  All
                </Button>
                {eventTypes.map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(type)}
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
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-h3 font-medium mb-1">No matching events</h3>
            <p className="text-body text-muted-foreground max-w-sm">
              Try adjusting your search to find timeline events.
            </p>
          </div>
        ) : (
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative flex gap-4">
                <div
                  className={cn(
                    'relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full',
                    eventTypeColors[event.type] ?? 'bg-muted'
                  )}
                />
                <div className="flex-1 pb-2">
                  <p className="font-medium">{event.title}</p>
                  {event.description && (
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {event.description}
                    </p>
                  )}
                  <p className="text-caption text-muted-foreground mt-1">
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
