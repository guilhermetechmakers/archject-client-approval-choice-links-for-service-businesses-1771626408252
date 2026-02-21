import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Globe, Image, Type } from 'lucide-react'
import type { SettingsPreferences } from '@/types/settings-preferences'

interface BrandLinkSettingsProps {
  settings: SettingsPreferences | undefined
  onUpdate: (updates: Partial<SettingsPreferences>) => void
  isUpdating?: boolean
}

export function BrandLinkSettings({
  settings,
  onUpdate,
  isUpdating = false,
}: BrandLinkSettingsProps) {
  if (!settings) return null

  return (
    <Card className="rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Brand & Link Settings
        </CardTitle>
        <CardDescription>
          Branded domain, default logo, and default CTA copy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="branded-domain" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Branded domain
          </Label>
          <Input
            id="branded-domain"
            placeholder="approvals.yourcompany.com"
            value={settings.branded_domain ?? ''}
            onChange={(e) => onUpdate({ branded_domain: e.target.value })}
            disabled={isUpdating}
            className="transition-all focus:ring-2 focus:ring-primary/20"
            aria-label="Branded domain for approval links"
          />
          <p className="text-caption text-muted-foreground">
            Use your own domain for approval links
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Default logo
          </Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-lg border-2 border-border">
              <AvatarImage src={settings.default_logo_url} alt="Logo" />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-h3">
                BR
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Input
                placeholder="https://example.com/logo.png"
                value={settings.default_logo_url ?? ''}
                onChange={(e) => onUpdate({ default_logo_url: e.target.value })}
                disabled={isUpdating}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                aria-label="Default logo URL for approval pages"
              />
              <p className="text-caption text-muted-foreground">
                URL for your default logo on approval pages
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta-copy" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Default CTA copy
          </Label>
          <Input
            id="cta-copy"
            placeholder="Approve"
            value={settings.default_cta_copy ?? 'Approve'}
            onChange={(e) => onUpdate({ default_cta_copy: e.target.value })}
            disabled={isUpdating}
            className="transition-all focus:ring-2 focus:ring-primary/20"
            aria-label="Default CTA button text on approval links"
          />
          <p className="text-caption text-muted-foreground">
            Button text shown on approval links
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
