import { useCallback, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  NotificationPreferences,
  TemplateLibrary,
  BrandLinkSettings,
  SecurityCompliance,
  Integrations,
} from '@/components/settings-preferences'
import { useSettingsPreferences, useUpdateSettingsPreferences } from '@/hooks/use-settings-preferences'
import { Bell, FileText, Globe, Shield, Plug, AlertCircle, Loader2 } from 'lucide-react'
import type { SettingsPreferences } from '@/types/settings-preferences'

function PreferencesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  )
}

function PreferencesError({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void
  isRetrying?: boolean
}) {
  return (
    <Card className="rounded-2xl border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
        <h3 className="text-h3 font-medium">Something went wrong</h3>
        <p className="text-body text-muted-foreground mt-2 max-w-sm">
          We couldn&apos;t load your settings. Please try again.
        </p>
        <Button
          onClick={onRetry}
          className="mt-6"
          disabled={isRetrying}
          aria-label="Retry loading settings"
          aria-busy={isRetrying}
        >
          {isRetrying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading…
            </>
          ) : (
            'Try again'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function PreferencesPage() {
  const { data: settings, isLoading, isError, isRefetching, refetch } = useSettingsPreferences()
  const updateMutation = useUpdateSettingsPreferences()

  useEffect(() => {
    document.title = 'Settings & Preferences | Archject'
  }, [])

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleUpdate = useCallback(
    (updates: Partial<SettingsPreferences>) => {
      const isImmediate = 'email_reminders' in updates || 'activity_emails' in updates || 'webhooks_enabled' in updates
        || 'export_enabled' in updates || 'data_retention_days' in updates || 'consent_default' in updates
      if (isImmediate) {
        updateMutation.mutate(updates)
        return
      }
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        updateMutation.mutate(updates)
        debounceRef.current = null
      }, 500)
    },
    [updateMutation]
  )

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <PreferencesSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-h1 font-bold">Settings & Preferences</h1>
          <p className="text-body text-muted-foreground mt-1">
            Global application settings and default behaviors
          </p>
        </div>
        <PreferencesError onRetry={() => refetch()} isRetrying={isRefetching} />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">Settings & Preferences</h1>
          <p className="text-body text-muted-foreground mt-1">
            Global application settings, notification preferences, template library, and default behaviors
          </p>
        </div>
        {updateMutation.isPending && (
          <div
            className="flex items-center gap-2 text-caption text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-label="Saving settings"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Saving…
          </div>
        )}
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList
          className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2 p-1 h-auto rounded-2xl"
          aria-label="Settings navigation tabs"
        >
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 py-2 rounded-xl"
            aria-label="Notifications settings"
          >
            <Bell className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="flex items-center gap-2 py-2 rounded-xl"
            aria-label="Template library"
          >
            <FileText className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger
            value="brand"
            className="flex items-center gap-2 py-2 rounded-xl"
            aria-label="Brand and link settings"
          >
            <Globe className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Brand</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 py-2 rounded-xl"
            aria-label="Security and compliance"
          >
            <Shield className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="flex items-center gap-2 py-2 rounded-xl"
            aria-label="Integrations"
          >
            <Plug className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <NotificationPreferences
            settings={settings}
            onUpdate={handleUpdate}
            isUpdating={updateMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <TemplateLibrary
            onImport={() => {}}
            onExport={() => {}}
            onCreateDefault={() => {}}
          />
        </TabsContent>

        <TabsContent value="brand" className="mt-6">
          <BrandLinkSettings
            settings={settings}
            onUpdate={handleUpdate}
            isUpdating={updateMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecurityCompliance
            settings={settings}
            onUpdate={handleUpdate}
            isUpdating={updateMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Integrations />
        </TabsContent>
      </Tabs>
    </div>
  )
}
