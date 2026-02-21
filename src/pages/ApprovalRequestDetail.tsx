import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  RequestSummary,
  SelectionSnapshot,
  AuditTrail,
  CommentsThread,
  AdminActions,
  Exports,
} from '@/components/approval-request-detail'
import {
  useApprovalRequestDetail,
  useSendReminder,
  useRevokeLink,
  useDuplicateRequest,
  useAddComment,
  useUpdateComment,
} from '@/hooks/use-approval-request-detail'
import { toast } from 'sonner'

export default function ApprovalRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useApprovalRequestDetail(id)

  useEffect(() => {
    if (data?.request) {
      document.title = `${data.request.title} | Approval Request | Archject`
    }
    return () => {
      document.title = 'Archject — Client Approval & Choice Links'
    }
  }, [data?.request?.title])
  const sendReminder = useSendReminder(id)
  const revokeLink = useRevokeLink(id)
  const duplicateRequest = useDuplicateRequest(id)
  const addComment = useAddComment(id)
  const updateComment = useUpdateComment(id)

  const handleSendReminder = async () => {
    try {
      await sendReminder.mutateAsync()
      toast.success('Reminder sent successfully')
    } catch {
      toast.error('Failed to send reminder')
    }
  }

  const handleRevokeLink = async () => {
    try {
      await revokeLink.mutateAsync()
      toast.success('Link revoked')
    } catch {
      toast.error('Failed to revoke link')
    }
  }

  const handleDuplicateRequest = async () => {
    try {
      await duplicateRequest.mutateAsync()
      toast.success('Request duplicated')
    } catch {
      toast.error('Failed to duplicate request')
    }
  }

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      await addComment.mutateAsync({ content, parent_id: parentId })
      toast.success('Comment added')
    } catch {
      toast.error('Failed to add comment')
    }
  }

  const handleResolveComment = async (commentId: string, resolved: boolean) => {
    try {
      await updateComment.mutateAsync({ commentId, resolved })
      toast.success(resolved ? 'Comment resolved' : 'Comment unresolved')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  const handleFlagComment = async (commentId: string, flagged: boolean) => {
    try {
      await updateComment.mutateAsync({ commentId, flagged })
      toast.success(flagged ? 'Comment flagged' : 'Comment unflagged')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  const handleExportAuditTrail = () => {
    if (!data) return
    const csv = [
      ['Action', 'Timestamp', 'Actor', 'IP', 'User Agent', 'Details'].join(','),
      ...data.audit_trail.map((e) =>
        [
          e.action,
          e.timestamp,
          e.actor ?? '',
          e.ip_address ?? '',
          `"${(e.user_agent ?? '').replace(/"/g, '""')}"`,
          `"${(e.details ?? '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-trail-${id}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit trail exported')
  }

  const handleExportPDF = () => {
    toast.info('PDF export will be available when backend is configured')
  }

  const handleExportCSV = () => {
    if (!data) return
    const rows = [
      ['Request', 'Status', 'Deadline', 'Sent At', 'Recipients'].join(','),
      [
        data.request.title,
        data.request.status,
        data.request.deadline ?? '',
        data.request.sent_at ?? '',
        data.request.recipients?.join('; ') ?? '',
      ].join(','),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `approval-request-${id}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Request exported to CSV')
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-h2 font-semibold">Something went wrong</h2>
          <p className="text-body text-muted-foreground mt-2 max-w-md">
            We couldn&apos;t load this approval request. Please try again.
          </p>
          <Button className="mt-6" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  const { request, selections, audit_trail, comments } = data

  return (
    <div className="space-y-8 animate-fade-in-up">
      <nav
        className="flex items-center gap-2 text-caption text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link
          to="/dashboard/overview"
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <Link
          to="/dashboard/approvals"
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Approvals
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
          {request.title}
        </span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/dashboard/approvals"
            className="inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to approvals
          </Link>
          <h1 className="text-h1 font-bold mt-2">{request.title}</h1>
          {request.project_name && (
            <p className="text-body text-muted-foreground">{request.project_name}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RequestSummary request={request} />
        <SelectionSnapshot selections={selections} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AuditTrail
          entries={audit_trail}
          onExport={handleExportAuditTrail}
        />
        <Exports
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
          onPrint={() => window.print()}
        />
      </div>

      <AdminActions
        onSendReminder={handleSendReminder}
        onRevokeLink={handleRevokeLink}
        onDuplicateRequest={handleDuplicateRequest}
        onConvertToChangeOrder={() => toast.info('Convert to change order - coming soon')}
        onConvertToInvoice={() => toast.info('Convert to invoice - coming soon')}
        isSendingReminder={sendReminder.isPending}
        isRevoking={revokeLink.isPending}
        isDuplicating={duplicateRequest.isPending}
        isRevoked={request.status === 'revoked'}
      />

      <CommentsThread
        comments={comments}
        onAddComment={handleAddComment}
        onResolve={handleResolveComment}
        onFlag={handleFlagComment}
        isSubmitting={addComment.isPending}
      />
    </div>
  )
}
