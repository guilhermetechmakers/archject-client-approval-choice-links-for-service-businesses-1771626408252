import { Link } from 'react-router-dom'
import { FileCheck, CheckCircle, XCircle, Clock, Send, Filter, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ApprovalRequestSummary } from '@/types/project-detail'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
] as const

const ICON_SIZE = {
  badge: 'h-4 w-4',
  header: 'h-5 w-5',
  empty: 'h-10 w-10',
} as const

interface ApprovalRequestsListProps {
  approvals: ApprovalRequestSummary[]
  isLoading?: boolean
  error?: Error | null
  searchQuery?: string
  statusFilter?: string
  onStatusFilterChange?: (status: string) => void
  onRetry?: () => void
}

const statusConfig: Record<
  string,
  { icon: typeof FileCheck; label: string; className: string }
> = {
  sent: { icon: Send, label: 'Sent', className: 'bg-info/10 text-info' },
  pending: { icon: Clock, label: 'Pending', className: 'bg-warning/10 text-warning' },
  approved: { icon: CheckCircle, label: 'Approved', className: 'bg-success/10 text-success' },
  declined: { icon: XCircle, label: 'Declined', className: 'bg-danger/10 text-danger' },
}

const getStatusFilterAriaLabel = (value: string, label: string) =>
  `Filter approval requests by status: ${label}${value === 'all' ? ' (show all)' : ''}`

function formatDate(dateStr?: string) {
  if (!dateStr) return 'No deadline'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function filterApprovals(
  approvals: ApprovalRequestSummary[],
  searchQuery?: string,
  statusFilter?: string
): ApprovalRequestSummary[] {
  let filtered = approvals
  if (searchQuery?.trim()) {
    const q = searchQuery.trim().toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    )
  }
  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter((a) => a.status === statusFilter)
  }
  return filtered
}

export function ApprovalRequestsList({
  approvals,
  isLoading,
  error,
  searchQuery,
  statusFilter = 'all',
  onStatusFilterChange,
  onRetry,
}: ApprovalRequestsListProps) {
  const filteredApprovals = filterApprovals(approvals, searchQuery, statusFilter)

  if (error) {
    return (
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className={ICON_SIZE.header} aria-hidden />
            Approval Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 px-4 text-center"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className={cn(ICON_SIZE.empty, 'text-destructive mb-4')} aria-hidden />
            <h3 className="text-h3 font-medium text-foreground mb-1">Unable to load approval requests</h3>
            <p className="text-body text-muted-foreground mb-4 max-w-sm">
              {error.message}
            </p>
            {onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                aria-label="Retry loading approval requests"
              >
                Try again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="rounded-lg">
        <CardHeader>
          <div
            className="h-6 w-32 animate-pulse rounded-md bg-muted"
            aria-hidden
          />
          <div
            className="h-4 w-48 animate-pulse rounded-md bg-muted mt-2"
            aria-hidden
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4" role="status" aria-label="Loading approval requests">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg bg-muted"
                aria-hidden
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!approvals.length && !searchQuery) {
    return (
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className={ICON_SIZE.header} aria-hidden />
            Approval Requests
          </CardTitle>
          <CardDescription>No approval requests yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 px-4 text-center"
            role="status"
          >
            <FileCheck className={cn(ICON_SIZE.empty, 'text-muted-foreground mb-4')} aria-hidden />
            <h3 className="text-h3 font-medium text-foreground mb-1">No approval requests</h3>
            <p className="text-body text-muted-foreground mb-4 max-w-sm">
              Create your first approval request to collect client feedback on options, media, or choices.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className={ICON_SIZE.header} aria-hidden />
              Approval Requests
            </CardTitle>
            <CardDescription>Approval requests for this project</CardDescription>
          </div>
          {approvals.length > 0 && onStatusFilterChange && (
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Filter approval requests by status"
            >
              <Filter className={cn(ICON_SIZE.badge, 'text-muted-foreground shrink-0')} aria-hidden />
              <div className="flex flex-wrap gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={statusFilter === opt.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterChange?.(opt.value)}
                    aria-label={getStatusFilterAriaLabel(opt.value, opt.label)}
                    aria-pressed={statusFilter === opt.value}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!filteredApprovals.length && (searchQuery || statusFilter !== 'all') ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 px-4 text-center"
            role="status"
          >
            <FileCheck className={cn(ICON_SIZE.empty, 'text-muted-foreground mb-4')} aria-hidden />
            <h3 className="text-h3 font-medium text-foreground mb-1">No matching requests</h3>
            <p className="text-body text-muted-foreground max-w-sm">
              Try adjusting your search or filter to find what you need.
            </p>
          </div>
        ) : (
          <ul className="space-y-4 list-none p-0 m-0" role="list">
            {filteredApprovals.map((approval) => {
              const config = statusConfig[approval.status] ?? statusConfig.pending
              const StatusIcon = config.icon
              const linkAriaLabel = `View approval request: ${approval.title}, status ${config.label}, due ${formatDate(approval.deadline)}, ${approval.response_count} of ${approval.total_recipients} responded`
              return (
                <li key={approval.id}>
                  <Link
                    to={`/dashboard/approvals/${approval.id}`}
                    className="block rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:bg-accent hover:shadow-popover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={linkAriaLabel}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{approval.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={cn('text-caption', config.className)}
                          >
                            <StatusIcon className={cn(ICON_SIZE.badge, 'mr-1')} aria-hidden />
                            {config.label}
                          </Badge>
                          <span className="text-caption text-muted-foreground">
                            Due {formatDate(approval.deadline)}
                          </span>
                        </div>
                      </div>
                      <div className="text-caption text-muted-foreground">
                        {approval.response_count}/{approval.total_recipients} responded
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
