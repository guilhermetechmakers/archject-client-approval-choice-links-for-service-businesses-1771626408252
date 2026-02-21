import { CheckCircle2, User, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SelectionSnapshot as SelectionSnapshotType } from '@/types/approval-request-detail'

interface SelectionSnapshotProps {
  selections: SelectionSnapshotType[]
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

export function SelectionSnapshot({ selections, className }: SelectionSnapshotProps) {
  if (selections.length === 0) {
    return (
      <Card
        className={cn(
          'transition-all duration-300 hover:shadow-popover hover:-translate-y-0.5',
          'border-l-4 border-l-primary/30',
          className
        )}
      >
        <CardHeader>
          <CardTitle>Selection Snapshot</CardTitle>
          <CardDescription>Current chosen options with timestamps and who selected them</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
              <CheckCircle2 className="h-8 w-8 text-primary/60" />
            </div>
            <h3 className="text-h3 font-medium mt-4">No selections yet</h3>
            <p className="text-body text-muted-foreground mt-2 max-w-sm">
              Client selections will appear here once they make their choices.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-popover hover:-translate-y-0.5',
        'border-l-4 border-l-primary/30',
        className
      )}
    >
      <CardHeader>
        <CardTitle>Selection Snapshot</CardTitle>
        <CardDescription>Current chosen options with timestamps and who selected them</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selections.map((selection, index) => (
            <div
              key={selection.id}
              className={cn(
                'rounded-lg border border-border bg-muted/30 p-4 transition-all duration-200',
                'hover:bg-muted/50 hover:shadow-sm hover:border-primary/10',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-body font-medium">{selection.option_title}</h4>
                  {selection.option_description && (
                    <p className="text-caption text-muted-foreground mt-1">
                      {selection.option_description}
                    </p>
                  )}
                  {selection.cost && (
                    <p className="text-body font-medium text-primary mt-2">{selection.cost}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-caption text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{selection.selected_by}</span>
                </div>
                <div className="flex items-center gap-2 text-caption text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDateTime(selection.selected_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
