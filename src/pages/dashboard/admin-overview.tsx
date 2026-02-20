import { BarChart3, Users, FileCheck, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const mockData = [
  { name: 'Jan', users: 12, links: 45 },
  { name: 'Feb', users: 15, links: 62 },
  { name: 'Mar', users: 18, links: 78 },
]

const metrics = [
  { title: 'Active Users', value: '24', icon: Users },
  { title: 'Links Sent', value: '156', icon: Link2 },
  { title: 'Approvals', value: '89', icon: FileCheck },
]

export function AdminOverviewPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-h1 font-bold">Admin Dashboard</h1>
        <p className="text-body text-muted-foreground mt-1">
          Organization-level metrics and management
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-caption font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-h1 font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Analytics
          </CardTitle>
          <CardDescription>Users and links over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="links" fill="rgb(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
