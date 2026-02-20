import { History, Monitor, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AuditTrailEntry } from '@/types/approval-request-detail'

interface AuditTrailProps {
  entries: AuditTrailEntry[]
  onExport?: () => void
  isExporting?: boolean
  className?: string
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function AuditTrail({
  entries,
  onExport,
  isExporting = false,
  className,
}: AuditTrailProps) {
  if (entries.length === 0) {
    return (
      <Card className={cn('transition-all duration-300 hover:shadow-popover', className)}>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Chronological, exportable log with IP, user-agent, and timestamp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-h3 font-medium mt-4">No activity yet</h3>
            <p className="text-body text-muted-foreground mt-2 max-w-sm">
              Audit trail entries will appear here as actions are taken on this request.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-popover', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Chronological log with IP, user-agent, and timestamp</CardDescription>
        </div>
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex gap-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  {index < entries.length - 1 && (
                    <div className="w-px flex-1 min-h-[24px] bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-4">
                  <p className="text-body font-medium">{entry.action}</p>
                  {entry.details && (
                    <p className="text-caption text-muted-foreground mt-0.5">{entry.details}</p>
                  )}
                  {entry.actor && (
                    <p className="text-caption text-muted-foreground mt-1">By: {entry.actor}</p>
                  )}
                  <p className="text-caption text-muted-foreground mt-1">
                    {formatDateTime(entry.timestamp)}
                  </p>
                  {(entry.ip_address || entry.user_agent) && (
                    <div className="flex flex-wrap gap-3 mt-2 text-caption text-muted-foreground">
                      {entry.ip_address && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5" />
                          {entry.ip_address}
                        </span>
                      )}
                      {entry.user_agent && (
                        <span className="flex items-center gap-1 truncate max-w-[200px]" title={entry.user_agent}>
                          <Monitor className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{entry.user_agent}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
