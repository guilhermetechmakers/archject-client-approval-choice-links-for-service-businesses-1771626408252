import { Link } from 'react-router-dom'
import { Plus, FileCheck, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockApprovals = [
  { id: '1', title: 'Cabinet Selection', project: 'Kitchen Renovation', status: 'pending', deadline: '2025-02-25' },
  { id: '2', title: 'Flooring Options', project: 'Kitchen Renovation', status: 'approved', deadline: '2025-02-20' },
  { id: '3', title: 'Color Palette', project: 'Office Design', status: 'pending', deadline: '2025-02-28' },
]

export function DashboardApprovals() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">Approval Requests</h1>
          <p className="text-body text-muted-foreground mt-1">
            Create and manage client approval links
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/approvals/new">
            <Plus className="h-5 w-5" />
            New Approval
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {mockApprovals.map((approval) => (
              <Card key={approval.id} className="transition-all duration-300 hover:shadow-popover">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Link
                        to={`/dashboard/approvals/${approval.id}`}
                        className="text-h3 font-medium hover:underline"
                      >
                        {approval.title}
                      </Link>
                      <p className="text-caption text-muted-foreground">
                        {approval.project}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-2 py-1 text-caption ${
                        approval.status === 'approved'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {approval.status}
                    </span>
                    <div className="flex items-center gap-1 text-caption text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {approval.deadline}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/approvals/${approval.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending">Pending approvals list</TabsContent>
        <TabsContent value="approved">Approved list</TabsContent>
      </Tabs>
    </div>
  )
}
