import { Link } from 'react-router-dom'
import { Plus, FileCheck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProjectDetailPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/dashboard/projects"
            className="text-caption text-muted-foreground hover:text-foreground"
          >
            ← Back to projects
          </Link>
          <h1 className="text-h1 font-bold mt-2">Kitchen Renovation</h1>
          <p className="text-body text-muted-foreground">Smith Residence</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/approvals/new">
            <Plus className="h-5 w-5" />
            New Approval
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
              {['Cabinet Selection', 'Flooring Options', 'Color Palette'].map(
                (title) => (
                  <Link
                    key={title}
                    to={`/dashboard/approvals/1`}
                    className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                  >
                    <p className="font-medium">{title}</p>
                    <p className="text-caption text-muted-foreground">
                      Pending • Due Feb 25
                    </p>
                  </Link>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Contacts
            </CardTitle>
            <CardDescription>Contacts for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">
              john@smithresidence.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
