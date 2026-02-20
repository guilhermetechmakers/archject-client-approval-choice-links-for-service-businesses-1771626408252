import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderKanban, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const mockProjects = [
  { id: '1', name: 'Kitchen Renovation', client: 'Smith Residence', status: 'active', approvals: 3 },
  { id: '2', name: 'Office Design', client: 'Tech Corp', status: 'active', approvals: 5 },
  { id: '3', name: 'Landscape Plan', client: 'Green Estate', status: 'completed', approvals: 2 },
]

export function DashboardProjects() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
      </div>

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-h3 font-medium mb-1">No matching projects</h3>
            <p className="text-body text-muted-foreground max-w-sm mb-4">
              Try adjusting your search or filter to find projects.
            </p>
          </div>
        ) : (
        filteredProjects.map((project) => (
          <Card key={project.id} className="transition-all duration-300 hover:shadow-modal">
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
    </div>
  )
}
