import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, Bell, Webhook } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SettingsPreferences } from '@/types/settings-preferences'

interface NotificationPreferencesProps {
  settings: SettingsPreferences | undefined
  onUpdate: (updates: Partial<SettingsPreferences>) => void
  isUpdating?: boolean
  isLoading?: boolean
}

function NotificationPreferencesSkeleton() {
  return (
    <Card
      className="rounded-lg transition-all duration-300"
      role="status"
      aria-label="Loading notification preferences"
    >
      <CardHeader>
        <Skeleton className="h-6 w-48 skeleton-shimmer" />
        <Skeleton className="h-4 w-72 mt-2 skeleton-shimmer" />
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full skeleton-shimmer" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 skeleton-shimmer" />
                <Skeleton className="h-3 w-48 skeleton-shimmer" />
              </div>
            </div>
            <Skeleton className="h-6 w-11 rounded-full skeleton-shimmer self-start sm:self-center" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function NotificationPreferences({
  settings,
  onUpdate,
  isUpdating = false,
  isLoading = false,
}: NotificationPreferencesProps) {
  if (isLoading || !settings) {
    return <NotificationPreferencesSkeleton />
  }

  return (
    <Card
      className={cn(
        'rounded-lg transition-all duration-300',
        'hover:shadow-popover',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background'
      )}
      role="region"
      aria-labelledby="notification-preferences-heading"
      aria-describedby="notification-preferences-description"
      aria-busy={isUpdating}
    >
      <CardHeader>
        <CardTitle
          id="notification-preferences-heading"
          className="flex items-center gap-2"
        >
          <Bell className="h-5 w-5 text-primary" aria-hidden />
          Notification Preferences
        </CardTitle>
        <CardDescription id="notification-preferences-description">
          Email reminders, activity emails, and webhook toggles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          role="group"
          aria-labelledby="email-reminders-label"
          aria-describedby="email-reminders-desc"
          className={cn(
            'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
            'rounded-lg border border-border p-4 transition-colors duration-200',
            'hover:bg-accent/50 hover:shadow-sm'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Mail className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0">
              <Label
                id="email-reminders-label"
                htmlFor="email-reminders"
                className="text-body font-medium cursor-pointer"
              >
                Email reminders
              </Label>
              <p
                id="email-reminders-desc"
                className="text-caption text-muted-foreground mt-0.5"
              >
                Receive reminder emails for pending approvals
              </p>
            </div>
          </div>
          <Switch
            id="email-reminders"
            checked={settings.email_reminders ?? true}
            onCheckedChange={(checked) => onUpdate({ email_reminders: checked })}
            disabled={isUpdating}
            aria-label="Toggle email reminders for pending approvals"
          />
        </div>

        <div
          role="group"
          aria-labelledby="activity-emails-label"
          aria-describedby="activity-emails-desc"
          className={cn(
            'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
            'rounded-lg border border-border p-4 transition-colors duration-200',
            'hover:bg-accent/50 hover:shadow-sm'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Bell className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0">
              <Label
                id="activity-emails-label"
                htmlFor="activity-emails"
                className="text-body font-medium cursor-pointer"
              >
                Activity emails
              </Label>
              <p
                id="activity-emails-desc"
                className="text-caption text-muted-foreground mt-0.5"
              >
                Get notified when clients take action on approvals
              </p>
            </div>
          </div>
          <Switch
            id="activity-emails"
            checked={settings.activity_emails ?? true}
            onCheckedChange={(checked) => onUpdate({ activity_emails: checked })}
            disabled={isUpdating}
            aria-label="Toggle activity emails when clients take action"
          />
        </div>

        <div
          role="group"
          aria-labelledby="webhooks-label"
          aria-describedby="webhooks-desc"
          className={cn(
            'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
            'rounded-lg border border-border p-4 transition-colors duration-200',
            'hover:bg-accent/50 hover:shadow-sm'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Webhook className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0">
              <Label
                id="webhooks-label"
                htmlFor="webhooks"
                className="text-body font-medium cursor-pointer"
              >
                Webhooks
              </Label>
              <p
                id="webhooks-desc"
                className="text-caption text-muted-foreground mt-0.5"
              >
                Send real-time events to your external systems
              </p>
            </div>
          </div>
          <Switch
            id="webhooks"
            checked={settings.webhooks_enabled ?? false}
            onCheckedChange={(checked) => onUpdate({ webhooks_enabled: checked })}
            disabled={isUpdating}
            aria-label="Toggle webhooks for real-time events"
          />
        </div>
      </CardContent>
    </Card>
  )
}
