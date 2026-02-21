import { Link } from 'react-router-dom'
import {
  BarChart3,
  Users,
  FileCheck,
  Link2,
  LayoutTemplate,
  Download,
  ChevronRight,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { ErrorState } from '@/components/loading-success-pages'
import type { AdminAnalyticsResponse, AdminAuditLog } from '@/types/admin-analytics'

const METRIC_CONFIG = [
  {
    key: 'activeUsers' as const,
    title: 'Active Users',
    icon: Users,
    href: '/dashboard/admin/users',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    key: 'linksSent' as const,
    title: 'Links Sent',
    icon: Link2,
    href: '/dashboard/approvals',
    gradient: 'from-info/20 to-info/5',
  },
  {
    key: 'approvals' as const,
    title: 'Approvals',
    icon: FileCheck,
    href: '/dashboard/approvals',
    gradient: 'from-success/20 to-success/5',
  },
  {
    key: 'templatesCount' as const,
    title: 'Templates',
    icon: LayoutTemplate,
    href: '/dashboard/approvals',
    gradient: 'from-warning/20 to-warning/5',
  },
]

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function formatAuditAction(action: string): string {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export interface AdminAnalyticsProps {
  data?: AdminAnalyticsResponse | null
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onExport?: (format: 'csv' | 'json') => void
  isExporting?: boolean
  /** Show success banner when export completes */
  showExportSuccess?: boolean
  onExportSuccessDismiss?: () => void
}

export function AdminAnalytics({
  data,
  isLoading,
  isError,
  onRetry,
  onExport,
  isExporting,
  showExportSuccess,
  onExportSuccessDismiss,
}: AdminAnalyticsProps) {
  if (isLoading) {
    return <AdminAnalyticsSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        heading="Failed to load analytics"
        description="There was a problem loading the admin dashboard. Please try again."
        retryLabel="Try again"
        onRetry={onRetry}
      />
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center animate-fade-in-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-h3 font-semibold mt-4">No analytics data</h3>
        <p className="text-body text-muted-foreground mt-2 max-w-md">
          Analytics will appear here once you start using the platform.
        </p>
      </div>
    )
  }

  const { metrics, usageData, auditLogs } = data
  const trendKeys = ['trendUsers', 'trendLinks', 'trendApprovals'] as const

  return (
    <div className="space-y-8 animate-fade-in-up">
      {showExportSuccess && onExportSuccessDismiss && (
        <div
          className="flex items-center justify-between rounded-lg border border-success/30 bg-success/5 p-4 animate-fade-in-up"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <FileCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-body font-medium">Report exported successfully</p>
              <p className="text-caption text-muted-foreground">
                Your file has been downloaded.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onExportSuccessDismiss}>
            Dismiss
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">Admin Dashboard</h1>
          <p className="text-body text-muted-foreground mt-1">
            Organization-level metrics, usage analytics, and audit tools
          </p>
        </div>
        {onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting}>
                <Download className="h-5 w-5" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('json')}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {METRIC_CONFIG.map((config, idx) => {
          const value = metrics[config.key]
          const trendKey = trendKeys[idx]
          const trend = trendKey ? metrics[trendKey] : 0
          const Icon = config.icon
          return (
            <Link key={config.key} to={config.href}>
              <Card
                className={cn(
                  'h-full transition-all duration-300 hover:shadow-modal hover:-translate-y-0.5 hover:border-primary/30',
                  `bg-gradient-to-br ${config.gradient}`
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-caption font-medium text-muted-foreground">
                    {config.title}
                  </CardTitle>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/60">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-h1 font-bold">{value}</div>
                  {typeof trend === 'number' && (
                    <p className="text-caption text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-success">+{trend}</span> from last period
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Analytics
              </CardTitle>
              <CardDescription>Users, links, and approvals over time</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/admin">
                View details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <defs>
                    <linearGradient id="barUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="barLinks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(var(--muted-foreground))" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="rgb(var(--muted-foreground))" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-caption" />
                  <YAxis className="text-caption" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid rgb(var(--border))',
                    }}
                  />
                  <Bar dataKey="users" fill="url(#barUsers)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="links" fill="url(#barLinks)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Audit Log
              </CardTitle>
              <CardDescription>Recent admin actions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/admin/users">
                Manage Users
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {auditLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-body text-muted-foreground mt-4">No audit events yet</p>
                <p className="text-caption text-muted-foreground mt-1">
                  Admin actions will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {auditLogs.map((log: AdminAuditLog) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium">
                        {formatAuditAction(log.action)}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-caption text-muted-foreground mt-0.5">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                      <p className="text-caption text-muted-foreground mt-1">
                        {formatRelativeTime(log.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button asChild variant="outline">
          <Link to="/dashboard/admin/users">
            <Users className="h-5 w-5" />
            Manage Users & Roles
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard/orders">View Transactions</Link>
        </Button>
      </div>
    </div>
  )
}

function AdminAnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
