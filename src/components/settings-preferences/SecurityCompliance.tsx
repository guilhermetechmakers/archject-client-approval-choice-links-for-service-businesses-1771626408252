import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield, Database, Download, FileCheck } from 'lucide-react'
import type { SettingsPreferences } from '@/types/settings-preferences'

interface SecurityComplianceProps {
  settings: SettingsPreferences | undefined
  onUpdate: (updates: Partial<SettingsPreferences>) => void
  isUpdating?: boolean
}

const RETENTION_OPTIONS = [
  { value: '90', label: '90 days' },
  { value: '180', label: '180 days' },
  { value: '365', label: '1 year' },
  { value: '730', label: '2 years' },
]

const CONSENT_OPTIONS = [
  { value: 'opt_in', label: 'Opt-in (explicit consent required)' },
  { value: 'opt_out', label: 'Opt-out (consent assumed unless declined)' },
]

export function SecurityCompliance({
  settings,
  onUpdate,
  isUpdating = false,
}: SecurityComplianceProps) {
  if (!settings) return null

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security & Compliance
        </CardTitle>
        <CardDescription>
          Data retention policy, export settings, and consent defaults
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="retention" className="text-body font-medium cursor-pointer">
                Data retention policy
              </Label>
              <p className="text-caption text-muted-foreground mt-0.5">
                How long to keep approval data
              </p>
            </div>
          </div>
          <Select
            value={String(settings.data_retention_days ?? 365)}
            onValueChange={(v) => onUpdate({ data_retention_days: parseInt(v, 10) })}
            disabled={isUpdating}
          >
            <SelectTrigger id="retention" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RETENTION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="export-enabled" className="text-body font-medium cursor-pointer">
                Export settings
              </Label>
              <p className="text-caption text-muted-foreground mt-0.5">
                Allow users to export their data
              </p>
            </div>
          </div>
          <Switch
            id="export-enabled"
            checked={settings.export_enabled ?? true}
            onCheckedChange={(checked) => onUpdate({ export_enabled: checked })}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consent-default" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Consent defaults
          </Label>
          <Select
            value={settings.consent_default ?? 'opt_in'}
            onValueChange={(v) => onUpdate({ consent_default: v })}
            disabled={isUpdating}
          >
            <SelectTrigger id="consent-default">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONSENT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-caption text-muted-foreground">
            Default consent behavior for new clients
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
