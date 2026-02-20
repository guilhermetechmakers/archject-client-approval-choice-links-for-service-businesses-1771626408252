import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const mockExports = [
  { id: '1', name: 'Approvals Q1 2025', date: '2025-02-15', type: 'PDF' },
  { id: '2', name: 'Project Records', date: '2025-02-10', type: 'CSV' },
]

export function DashboardExports() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">Exports & Records</h1>
          <p className="text-body text-muted-foreground mt-1">
            View and download your approval records
          </p>
        </div>
        <Button>
          <Download className="h-5 w-5" />
          New Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>Your exported approval records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockExports.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">{exp.name}</p>
                  <p className="text-caption text-muted-foreground">
                    {exp.date} • {exp.type}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
