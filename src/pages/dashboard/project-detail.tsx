import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ProjectHeader,
  ApprovalRequestsList,
  TimelineView,
  FilesAttachmentsSection,
  ClientContacts,
  CreateApprovalCTA,
  ProjectSearchBar,
} from '@/components/project-detail'
import { useProjectDetail, useArchiveProject } from '@/hooks/use-project-detail'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ErrorState } from '@/components/loading-success-pages/ErrorState'

function ProjectDetailSkeleton() {
  return (
    <div
      className="space-y-8 animate-fade-in-up"
      role="status"
      aria-label="Loading project details"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full max-w-md rounded-md" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-card">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-56 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-card">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-4 w-52 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch } = useProjectDetail(id)
  const archiveMutation = useArchiveProject(id)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
      <ErrorState
        variant="full"
        heading="Failed to load project"
        description={
          error instanceof Error ? error.message : 'Unable to load project details. Please try again.'
        }
        retryLabel="Try again"
        retryAriaLabel="Retry loading project"
        onRetry={() => refetch()}
        className="min-h-[400px]"
      />
    )
  }

  if (isLoading || !data) {
    return <ProjectDetailSkeleton />
  }

  const { project, approval_requests, timeline, files, contacts } = data

  return (
    <div className="space-y-8 animate-fade-in-up" role="main">
      <section aria-labelledby="project-header-heading">
        <h2 id="project-header-heading" className="sr-only">
          Project overview
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <ProjectHeader
            project={project}
            onArchive={handleArchive}
            isArchiving={archiveMutation.isPending}
          />
          <CreateApprovalCTA projectId={project.id} />
        </div>
      </section>

      <section aria-labelledby="project-search-heading">
        <h2 id="project-search-heading" className="sr-only">
          Search project content
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ProjectSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search approvals, files, contacts, timeline..."
            ariaLabel="Search approvals, files, contacts, and timeline"
          />
        </div>
      </section>

      <section aria-labelledby="approvals-contacts-heading">
        <h2 id="approvals-contacts-heading" className="sr-only">
          Approval requests and client contacts
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ApprovalRequestsList
            approvals={approval_requests}
            isLoading={isLoading}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <ClientContacts
            contacts={contacts}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </div>
      </section>

      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="sr-only">
          Project timeline
        </h2>
        <TimelineView
          events={timeline}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </section>

      <section aria-labelledby="files-heading">
        <h2 id="files-heading" className="sr-only">
          Files and attachments
        </h2>
        <FilesAttachmentsSection
          files={files}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </section>
    </div>
  )
}
