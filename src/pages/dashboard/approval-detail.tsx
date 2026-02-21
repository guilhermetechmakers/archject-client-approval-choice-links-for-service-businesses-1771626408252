import { useParams, Link } from 'react-router-dom'
import { Clock, Mail, Download, ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/loading-success-pages/ErrorState'
import { useApprovalRequestDetail, useSendReminder } from '@/hooks/use-approval-request-detail'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ICON_SIZE = 'h-5 w-5'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ApprovalDetailSkeleton() {
  return (
    <div
      className="space-y-8 animate-fade-in-up"
      role="status"
      aria-label="Loading approval details"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-4 w-56 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch } =
    useApprovalRequestDetail(id)
  const sendReminder = useSendReminder(id)

  const handleRemind = async () => {
    try {
      await sendReminder.mutateAsync()
      toast.success('Reminder sent successfully')
    } catch {
      toast.error('Failed to send reminder')
    }
  }

  const handleExport = () => {
    toast.info('Export feature coming soon')
  }

  if (isError) {
    return (
      <ErrorState
        variant="full"
        heading="Failed to load approval"
        description={
          error instanceof Error
            ? error.message
            : 'Unable to load approval details. Please try again.'
        }
        retryLabel="Try again"
        retryAriaLabel="Retry loading approval details"
        onRetry={() => refetch()}
        className="min-h-[400px]"
      />
    )
  }

  if (isLoading || !data) {
    return <ApprovalDetailSkeleton />
  }

  const { request, audit_trail } = data
  const primaryRecipient =
    request.recipients && request.recipients.length > 0
      ? request.recipients[0]
      : null

  return (
    <div
      className="space-y-8 animate-fade-in-up"
      role="main"
      aria-label="Approval request details"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/dashboard/approvals"
            className={cn(
              'inline-flex items-center gap-1.5 text-caption text-muted-foreground',
              'hover:text-foreground transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md'
            )}
            aria-label="Back to approvals list"
          >
            <ArrowLeft className={ICON_SIZE} aria-hidden />
            Back to approvals
          </Link>
          <h1 className="text-h1 font-bold mt-2">{request.title}</h1>
          <p className="text-body text-muted-foreground">
            {request.project_name ?? 'Project'}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={handleRemind}
            disabled={sendReminder.isPending}
            aria-label="Send reminder email to recipients"
          >
            <Mail className={ICON_SIZE} aria-hidden />
            {sendReminder.isPending ? 'Sending…' : 'Remind'}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            aria-label="Export approval record"
          >
            <Download className={ICON_SIZE} aria-hidden />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border bg-card shadow-card transition-all duration-300 hover:shadow-popover hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle>Request Summary</CardTitle>
            <CardDescription>Status and metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-caption font-medium',
                  request.status === 'pending' && 'bg-warning/10 text-warning',
                  request.status === 'approved' && 'bg-success/10 text-success',
                  (request.status === 'revoked' || request.status === 'expired') &&
                    'bg-destructive/10 text-destructive',
                  request.status === 'active' && 'bg-info/10 text-info'
                )}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            <div
              className="flex items-center gap-2 text-body"
              aria-label={`Deadline: ${request.deadline ? formatDate(request.deadline) : 'Not set'}`}
            >
              <Clock className={cn(ICON_SIZE, 'text-muted-foreground shrink-0')} aria-hidden />
              <span>
                Deadline:{' '}
                {request.deadline
                  ? formatDate(request.deadline)
                  : 'Not set'}
              </span>
            </div>
            <div
              className="flex items-center gap-2 text-body"
              aria-label={`Sent to: ${primaryRecipient ?? 'No recipients'}`}
            >
              <Mail className={cn(ICON_SIZE, 'text-muted-foreground shrink-0')} aria-hidden />
              <span>
                Sent to:{' '}
                {primaryRecipient ??
                  (request.recipients?.length
                    ? `${request.recipients.length} recipient(s)`
                    : 'No recipients')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-card transition-all duration-300 hover:shadow-popover hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>Chronological activity log</CardDescription>
          </CardHeader>
          <CardContent>
            {audit_trail.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" aria-hidden />
                </div>
                <h3 className="text-h3 font-medium mt-4">No activity yet</h3>
                <p className="text-body text-muted-foreground mt-2 max-w-sm">
                  Audit trail entries will appear here as actions are taken on
                  this request.
                </p>
              </div>
            ) : (
              <div className="space-y-4" role="list" aria-label="Audit trail entries">
                {audit_trail.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex gap-4"
                    role="listitem"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" aria-hidden />
                    <div>
                      <p className="text-body font-medium">{entry.action}</p>
                      <p className="text-caption text-muted-foreground">
                        {formatDateTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
