import { Clock, Mail, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApprovalRequestDetail } from '@/types/approval-request-detail'

interface RequestSummaryProps {
  request: ApprovalRequestDetail
  className?: string
}

const statusVariantMap = {
  active: 'default' as const,
  pending: 'warning' as const,
  approved: 'success' as const,
  revoked: 'destructive' as const,
  expired: 'secondary' as const,
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function RequestSummary({ request, className }: RequestSummaryProps) {
  const statusVariant = statusVariantMap[request.status] ?? 'default'

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-popover', className)}>
      <CardHeader>
        <CardTitle>Request Summary</CardTitle>
        <CardDescription>Status and metadata</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant} className="capitalize">
            {request.status}
          </Badge>
          {request.project_name && (
            <Badge variant="outline">{request.project_name}</Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-body">
            <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span>
              <span className="text-muted-foreground">Deadline:</span>{' '}
              {formatDate(request.deadline)}
            </span>
          </div>
          <div className="flex items-start gap-3 text-body">
            <Mail className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-muted-foreground">Recipients:</span>{' '}
              {request.recipients?.length
                ? request.recipients.join(', ')
                : '—'}
            </div>
          </div>
          <div className="flex items-center gap-3 text-body">
            <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span>
              <span className="text-muted-foreground">Sent:</span>{' '}
              {formatDateTime(request.sent_at)}
            </span>
          </div>
          {request.description && (
            <div className="flex items-start gap-3 text-body">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
              <p className="text-muted-foreground">{request.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
