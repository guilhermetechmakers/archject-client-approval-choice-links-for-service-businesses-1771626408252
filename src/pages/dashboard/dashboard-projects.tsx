import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderKanban, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

const mockProjects = [
  { id: '1', name: 'Kitchen Renovation', client: 'Smith Residence', status: 'active', approvals: 3 },
  { id: '2', name: 'Office Design', client: 'Tech Corp', status: 'active', approvals: 5 },
  { id: '3', name: 'Landscape Plan', client: 'Green Estate', status: 'completed', approvals: 2 },
]

const hasActiveFilters = (searchQuery: string, statusFilter: string) =>
  searchQuery.trim() !== '' || statusFilter !== 'all'

export function DashboardProjects() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading] = useState(false)
  const [hasError] = useState(false)

  const filteredProjects = useMemo(() => {
    let result = mockProjects
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }
    return result
  }, [searchQuery, statusFilter])

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">Projects</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage your projects and approval requests
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/projects/new">
            <Plus className="h-5 w-5" />
            New Project
          </Link>
        </Button>
      </header>

      <section aria-labelledby="projects-filters-heading">
        <h2 id="projects-filters-heading" className="sr-only">
          Search and filter projects
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 transition-all duration-200 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'completed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="projects-list-heading">
        <h2 id="projects-list-heading" className="sr-only">
          Projects list
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasError ? (
            <div
              className="col-span-full flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 px-6 text-center"
              role="alert"
            >
              <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-h2 font-semibold text-foreground mb-2">
                Failed to load projects
              </h2>
              <p className="text-body text-muted-foreground max-w-sm mb-6">
                There was a problem loading your projects. Please try again.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="rounded-lg border-border bg-card overflow-hidden">
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div
              className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16 px-6 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <FolderKanban className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-h2 font-semibold text-foreground mb-2">
                {hasActiveFilters(searchQuery, statusFilter)
                  ? 'No matching projects'
                  : 'No projects yet'}
              </h2>
              <p className="text-body text-muted-foreground max-w-sm mb-6">
                {hasActiveFilters(searchQuery, statusFilter)
                  ? 'Try adjusting your search or filter to find projects.'
                  : 'Create your first project to get started with client approvals and branded links.'}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Button asChild>
                  <Link to="/dashboard/projects/new">
                    <Plus className="h-4 w-4" />
                    Create project
                  </Link>
                </Button>
                {hasActiveFilters(searchQuery, statusFilter) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
        filteredProjects.map((project) => (
          <Card key={project.id} className="rounded-lg border-border bg-card transition-all duration-300 hover:shadow-modal">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <FolderKanban className="h-10 w-10 text-primary/80" />
              <span
                className={`rounded-full px-2 py-1 text-caption ${
                  project.status === 'active'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {project.status}
              </span>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-h3">
                <Link
                  to={`/dashboard/projects/${project.id}`}
                  className="hover:underline"
                >
                  {project.name}
                </Link>
              </CardTitle>
              <CardDescription>{project.client}</CardDescription>
              <p className="text-caption text-muted-foreground mt-2">
                {project.approvals} approval{project.approvals !== 1 ? 's' : ''}
              </p>
              <Button variant="outline" size="sm" asChild className="mt-4 w-full">
                <Link to={`/dashboard/projects/${project.id}`}>View project</Link>
              </Button>
            </CardContent>
          </Card>
        ))
        )}
        </div>
      </section>
    </div>
  )
}
