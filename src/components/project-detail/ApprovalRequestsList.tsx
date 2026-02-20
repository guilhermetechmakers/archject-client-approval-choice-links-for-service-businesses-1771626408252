import { Link } from 'react-router-dom'
import { FileCheck, CheckCircle, XCircle, Clock, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApprovalRequestSummary } from '@/types/project-detail'

interface ApprovalRequestsListProps {
  approvals: ApprovalRequestSummary[]
  isLoading?: boolean
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

function formatDate(dateStr?: string) {
  if (!dateStr) return 'No deadline'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ApprovalRequestsList({ approvals, isLoading }: ApprovalRequestsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!approvals.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Approval Requests
          </CardTitle>
          <CardDescription>No approval requests yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-h3 font-medium mb-1">No approval requests</h3>
            <p className="text-body text-muted-foreground mb-4 max-w-sm">
              Create your first approval request to collect client feedback on options, media, or choices.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Approval Requests
        </CardTitle>
        <CardDescription>Approval requests for this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => {
            const config = statusConfig[approval.status] ?? statusConfig.pending
            const StatusIcon = config.icon
            return (
              <Link
                key={approval.id}
                to={`/dashboard/approvals/${approval.id}`}
                className="block rounded-lg border border-border p-4 transition-all duration-200 hover:bg-accent hover:shadow-popover hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{approval.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={cn('text-caption', config.className)}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
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
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
