import { Link } from 'react-router-dom'
import { FolderKanban, FileCheck, TrendingUp, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const mockData = [
  { name: 'Mon', approvals: 4 },
  { name: 'Tue', approvals: 3 },
  { name: 'Wed', approvals: 5 },
  { name: 'Thu', approvals: 2 },
  { name: 'Fri', approvals: 6 },
  { name: 'Sat', approvals: 1 },
  { name: 'Sun', approvals: 0 },
]

const metrics = [
  { title: 'Active Projects', value: '12', icon: FolderKanban, href: '/dashboard/projects', trend: '+2' },
  { title: 'Pending Approvals', value: '5', icon: FileCheck, href: '/dashboard/approvals', trend: '-1' },
  { title: 'Approvals This Week', value: '21', icon: TrendingUp, href: '/dashboard/approvals', trend: '+12%' },
]

export function DashboardOverview() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-h1 font-bold">Overview</h1>
        <p className="text-body text-muted-foreground mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your approvals.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="transition-all duration-300 hover:shadow-modal">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-caption font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-h1 font-bold">{metric.value}</div>
              <p className="text-caption text-muted-foreground mt-1">
                <span className="text-success">{metric.trend}</span> from last week
              </p>
              <Button variant="link" asChild className="mt-2 h-auto p-0">
                <Link to={metric.href}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Approval Activity</CardTitle>
            <CardDescription>Approvals received over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-caption" />
                  <YAxis className="text-caption" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="approvals"
                    stroke="rgb(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorApprovals)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest approval updates</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/approvals">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { project: 'Kitchen Renovation', client: 'Smith Residence', time: '2 hours ago' },
                { project: 'Office Design', client: 'Tech Corp', time: '5 hours ago' },
                { project: 'Landscape Plan', client: 'Green Estate', time: '1 day ago' },
              ].map((item) => (
                <div
                  key={item.project}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-body font-medium">{item.project}</p>
                    <p className="text-caption text-muted-foreground">
                      {item.client} • {item.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-caption text-success">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Quick Create</CardTitle>
            <CardDescription>Get started with a new approval request</CardDescription>
          </div>
          <Button asChild>
            <Link to="/dashboard/approvals/new">
              <Plus className="h-5 w-5" />
              New Approval
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-body text-muted-foreground">
            Create a new approval request, or use a template from your library to
            get started faster.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
