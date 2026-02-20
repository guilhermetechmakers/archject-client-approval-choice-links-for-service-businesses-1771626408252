import { supabase } from '@/lib/supabase'
import type {
  SettingsPreferences,
  UpdateSettingsPreferencesRequest,
} from '@/types/settings-preferences'

const DEFAULT_SETTINGS: SettingsPreferences = {
  id: '',
  user_id: '',
  title: 'Settings',
  status: 'active',
  email_reminders: true,
  activity_emails: true,
  webhooks_enabled: false,
  branded_domain: '',
  default_logo_url: '',
  default_cta_copy: 'Approve',
  data_retention_days: 365,
  export_enabled: true,
  consent_default: 'opt_in',
  integrations: {},
  template_ids: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

/**
 * Fetches settings preferences from Supabase Edge Function.
 * Falls back to default settings when Supabase is not configured.
 */
export async function fetchSettingsPreferences(): Promise<SettingsPreferences> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { data, error } = await supabase.functions.invoke<SettingsPreferences>(
        'settings-preferences',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: { action: 'get' },
        }
      )

      if (error) throw new Error(error.message ?? 'Failed to fetch settings')
      if (data) return data
    }
  }

  return { ...DEFAULT_SETTINGS, id: 'local', user_id: 'local' }
}

/**
 * Updates settings preferences via Supabase Edge Function.
 */
export async function updateSettingsPreferences(
  request: UpdateSettingsPreferencesRequest
): Promise<SettingsPreferences> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { data, error } = await supabase.functions.invoke<SettingsPreferences>(
        'settings-preferences',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: { action: 'update', ...request },
        }
      )

      if (error) throw new Error(error.message ?? 'Failed to update settings')
      if (data) return data
    }
  }
  throw new Error('Not authenticated')
}
