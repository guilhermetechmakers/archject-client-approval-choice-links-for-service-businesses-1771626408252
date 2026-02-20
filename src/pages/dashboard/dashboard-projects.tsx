import { Link } from 'react-router-dom'
import { Plus, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const mockProjects = [
  { id: '1', name: 'Kitchen Renovation', client: 'Smith Residence', status: 'active', approvals: 3 },
  { id: '2', name: 'Office Design', client: 'Tech Corp', status: 'active', approvals: 5 },
  { id: '3', name: 'Landscape Plan', client: 'Green Estate', status: 'completed', approvals: 2 },
]

export function DashboardProjects() {
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

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Input placeholder="Search projects..." className="pl-9" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
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
        ))}
      </div>
    </div>
  )
}
