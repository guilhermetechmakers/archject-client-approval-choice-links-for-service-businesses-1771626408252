import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ProjectHeader,
  ApprovalRequestsList,
  TimelineView,
  FilesAttachmentsSection,
  ClientContacts,
  CreateApprovalCTA,
} from '@/components/project-detail'
import { useProjectDetail, useArchiveProject } from '@/hooks/use-project-detail'
import { Skeleton } from '@/components/ui/skeleton'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch } = useProjectDetail(id)
  const archiveMutation = useArchiveProject(id)

  const handleArchive = () => {
    if (!id) return
    archiveMutation.mutate(
      { status: 'archived' },
      {
        onSuccess: () => toast.success('Project archived'),
        onError: () => toast.error('Failed to archive project'),
      }
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border py-16 text-center animate-fade-in-up">
        <h2 className="text-h2 font-semibold mb-2">Something went wrong</h2>
        <p className="text-body text-muted-foreground mb-4 max-w-md">
          {error instanceof Error ? error.message : 'Failed to load project'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-80" />
      </div>
    )
  }

  const { project, approval_requests, timeline, files, contacts } = data

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ProjectHeader
          project={project}
          onArchive={handleArchive}
          isArchiving={archiveMutation.isPending}
        />
        <CreateApprovalCTA projectId={project.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ApprovalRequestsList
          approvals={approval_requests}
          isLoading={isLoading}
        />
        <ClientContacts contacts={contacts} isLoading={isLoading} />
      </div>

      <TimelineView events={timeline} isLoading={isLoading} />

      <FilesAttachmentsSection files={files} isLoading={isLoading} />
    </div>
  )
}
