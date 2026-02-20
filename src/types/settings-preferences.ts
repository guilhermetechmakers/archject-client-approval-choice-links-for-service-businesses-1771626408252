export interface SettingsPreferences {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  email_reminders?: boolean
  activity_emails?: boolean
  webhooks_enabled?: boolean
  branded_domain?: string
  default_logo_url?: string
  default_cta_copy?: string
  data_retention_days?: number
  export_enabled?: boolean
  consent_default?: string
  integrations?: Record<string, unknown>
  template_ids?: string[]
  created_at: string
  updated_at: string
}

export interface UpdateSettingsPreferencesRequest {
  title?: string
  description?: string
  status?: string
  email_reminders?: boolean
  activity_emails?: boolean
  webhooks_enabled?: boolean
  branded_domain?: string
  default_logo_url?: string
  default_cta_copy?: string
  data_retention_days?: number
  export_enabled?: boolean
  consent_default?: string
  integrations?: Record<string, unknown>
  template_ids?: string[]
}

export interface TemplateItem {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface IntegrationItem {
  id: string
  name: string
  type: 'email' | 'storage' | 'payment'
  connected: boolean
  config?: Record<string, unknown>
}
