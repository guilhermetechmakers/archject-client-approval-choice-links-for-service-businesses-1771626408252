import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileCheck, Clock, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const mockApprovals = [
  { id: '1', title: 'Cabinet Selection', project: 'Kitchen Renovation', status: 'pending', deadline: '2025-02-25' },
  { id: '2', title: 'Flooring Options', project: 'Kitchen Renovation', status: 'approved', deadline: '2025-02-20' },
  { id: '3', title: 'Color Palette', project: 'Office Design', status: 'pending', deadline: '2025-02-28' },
]

export function DashboardApprovals() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApprovals = useMemo(() => {
    if (!searchQuery.trim()) return mockApprovals
    const q = searchQuery.trim().toLowerCase()
    return mockApprovals.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.project.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Approval Requests</h1>
          <h2 className="text-body text-muted-foreground mt-1 font-normal">
            Create and manage client approval links
          </h2>
        </div>
        <Button asChild>
          <Link to="/dashboard/approvals/new">
            <Plus className="h-5 w-5" aria-hidden />
            New Approval
          </Link>
        </Button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          placeholder="Search approvals..."
          className="pl-9 transition-all duration-200 focus:border-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search approvals"
        />
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredApprovals.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-16 px-4 text-center"
                role="status"
                aria-live="polite"
                aria-label="No matching approvals. Try adjusting your search or create a new approval."
              >
                <div className="rounded-full bg-muted p-4 mb-4">
                  <FileCheck className="h-10 w-10 text-muted-foreground" aria-hidden />
                </div>
                <h3 className="text-h3 font-medium text-foreground mb-1">No matching approvals</h3>
                <p className="text-body text-muted-foreground max-w-sm mb-6">
                  Try adjusting your search to find approval requests, or create your first approval link.
                </p>
                <Button asChild className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <Link to="/dashboard/approvals/new">
                    <Plus className="h-5 w-5" aria-hidden />
                    Create New Approval
                  </Link>
                </Button>
              </div>
            ) : (
              filteredApprovals.map((approval) => (
                <Card
                  key={approval.id}
                  className={cn(
                    'rounded-2xl transition-all duration-300',
                    'hover:shadow-popover hover:-translate-y-0.5'
                  )}
                >
                  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileCheck className="h-5 w-5 text-primary" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/dashboard/approval-request-detail/${approval.id}`}
                          className="text-h3 font-medium text-foreground hover:underline"
                        >
                          {approval.title}
                        </Link>
                        <p className="text-caption text-muted-foreground">
                          {approval.project}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-caption font-medium',
                          approval.status === 'approved'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        )}
                      >
                        {approval.status}
                      </span>
                      <div className="flex items-center gap-1 text-caption text-muted-foreground">
                        <Clock className="h-5 w-5 shrink-0" aria-hidden />
                        {approval.deadline}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/approval-request-detail/${approval.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="pending">Pending approvals list</TabsContent>
        <TabsContent value="approved">Approved list</TabsContent>
      </Tabs>
    </div>
  )
}
