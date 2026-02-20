import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Mail, Bell, Webhook } from 'lucide-react'
import type { SettingsPreferences } from '@/types/settings-preferences'

interface NotificationPreferencesProps {
  settings: SettingsPreferences | undefined
  onUpdate: (updates: Partial<SettingsPreferences>) => void
  isUpdating?: boolean
}

export function NotificationPreferences({
  settings,
  onUpdate,
  isUpdating = false,
}: NotificationPreferencesProps) {
  if (!settings) return null

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Email reminders, activity emails, and webhook toggles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="email-reminders" className="text-body font-medium cursor-pointer">
                Email reminders
              </Label>
              <p className="text-caption text-muted-foreground mt-0.5">
                Receive reminder emails for pending approvals
              </p>
            </div>
          </div>
          <Switch
            id="email-reminders"
            checked={settings.email_reminders ?? true}
            onCheckedChange={(checked) => onUpdate({ email_reminders: checked })}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="activity-emails" className="text-body font-medium cursor-pointer">
                Activity emails
              </Label>
              <p className="text-caption text-muted-foreground mt-0.5">
                Get notified when clients take action on approvals
              </p>
            </div>
          </div>
          <Switch
            id="activity-emails"
            checked={settings.activity_emails ?? true}
            onCheckedChange={(checked) => onUpdate({ activity_emails: checked })}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
          <div className="flex items-center gap-3">
            <Webhook className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="webhooks" className="text-body font-medium cursor-pointer">
                Webhooks
              </Label>
              <p className="text-caption text-muted-foreground mt-0.5">
                Send real-time events to your external systems
              </p>
            </div>
          </div>
          <Switch
            id="webhooks"
            checked={settings.webhooks_enabled ?? false}
            onCheckedChange={(checked) => onUpdate({ webhooks_enabled: checked })}
            disabled={isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  )
}
