import { Link } from 'react-router-dom'
import { Clock, Mail, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ApprovalDetailPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/dashboard/approvals"
            className="text-caption text-muted-foreground hover:text-foreground"
          >
            ← Back to approvals
          </Link>
          <h1 className="text-h1 font-bold mt-2">Cabinet Selection</h1>
          <p className="text-body text-muted-foreground">Kitchen Renovation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-5 w-5" />
            Remind
          </Button>
          <Button variant="outline">
            <Download className="h-5 w-5" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Summary</CardTitle>
            <CardDescription>Status and metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-warning/10 px-2 py-1 text-caption text-warning">
                Pending
              </span>
            </div>
            <div className="flex items-center gap-2 text-body">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Deadline: Feb 25, 2025
            </div>
            <div className="flex items-center gap-2 text-body">
              <Mail className="h-5 w-5 text-muted-foreground" />
              Sent to: john@smithresidence.com
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>Chronological activity log</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                <div>
                  <p className="text-body font-medium">Request sent</p>
                  <p className="text-caption text-muted-foreground">
                    Feb 18, 2025 at 2:30 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
