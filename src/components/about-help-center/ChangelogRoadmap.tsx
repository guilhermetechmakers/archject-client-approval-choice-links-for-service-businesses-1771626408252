import { Sparkles, MapPin, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ChangelogEntry {
  id: string
  version: string
  date: string
  type: 'update' | 'feature' | 'fix'
  title: string
  description?: string
}

export interface RoadmapItem {
  id: string
  title: string
  status: 'planned' | 'in-progress'
  quarter?: string
}

const recentUpdates: ChangelogEntry[] = [
  {
    id: '1',
    version: '1.2.0',
    date: '2025-02-15',
    type: 'feature',
    title: 'Bulk export improvements',
    description: 'Export multiple approval records at once with custom date ranges.',
  },
  {
    id: '2',
    version: '1.1.9',
    date: '2025-02-10',
    type: 'update',
    title: 'Enhanced client review UI',
    description: 'Improved mobile experience for clients reviewing approvals.',
  },
  {
    id: '3',
    version: '1.1.8',
    date: '2025-02-05',
    type: 'fix',
    title: 'Email notification fixes',
    description: 'Resolved delivery issues for reminder emails.',
  },
]

const upcomingFeatures: RoadmapItem[] = [
  { id: '1', title: 'API access for integrations', status: 'in-progress', quarter: 'Q1 2025' },
  { id: '2', title: 'Slack & Teams notifications', status: 'planned', quarter: 'Q2 2025' },
  { id: '3', title: 'Custom branding on approval links', status: 'planned', quarter: 'Q2 2025' },
  { id: '4', title: 'Approval analytics dashboard', status: 'planned', quarter: 'Q3 2025' },
]

const typeConfig = {
  feature: { label: 'Feature', className: 'bg-primary/10 text-primary' },
  update: { label: 'Update', className: 'bg-info/10 text-info' },
  fix: { label: 'Fix', className: 'bg-success/10 text-success' },
}

export function ChangelogRoadmap() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recent updates
          </CardTitle>
          <CardDescription>Latest product improvements and fixes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentUpdates.map((entry, i) => {
            const config = typeConfig[entry.type]
            return (
              <div
                key={entry.id}
                className={cn(
                  'border-l-2 border-primary/30 pl-4 py-2 animate-fade-in-up'
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className={config.className}>
                    {config.label}
                  </Badge>
                  <span className="text-caption text-muted-foreground">
                    v{entry.version} · {entry.date}
                  </span>
                </div>
                <h4 className="text-body font-semibold mt-1">{entry.title}</h4>
                {entry.description && (
                  <p className="text-caption text-muted-foreground mt-1">
                    {entry.description}
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Upcoming features
          </CardTitle>
          <CardDescription>What we&apos;re building next</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingFeatures.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border border-border',
                'hover:bg-accent/30 transition-colors animate-fade-in-up'
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CheckCircle2
                className={cn(
                  'h-5 w-5 shrink-0',
                  item.status === 'in-progress'
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-body font-medium">{item.title}</p>
                {item.quarter && (
                  <p className="text-caption text-muted-foreground">{item.quarter}</p>
                )}
              </div>
              <Badge
                variant="outline"
                className={
                  item.status === 'in-progress'
                    ? 'border-primary text-primary'
                    : ''
                }
              >
                {item.status === 'in-progress' ? 'In progress' : 'Planned'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
