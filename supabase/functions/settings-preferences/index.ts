import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SettingsPreferences {
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let body: Record<string, unknown> = {}
    if (req.method === 'POST' || req.method === 'PATCH') {
      try {
        body = await req.json()
      } catch {
        body = {}
      }
    }
    const action = (body.action as string) ?? 'get'

    if (action === 'get') {
      const { data, error } = await supabase
        .from('settings_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!data) {
        const { data: inserted, error: insertError } = await supabase
          .from('settings_preferences')
          .insert({
            user_id: user.id,
            title: 'Settings',
            status: 'active',
          })
          .select()
          .single()

        if (insertError) {
          return new Response(
            JSON.stringify({ error: insertError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        return new Response(JSON.stringify(inserted), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update' || action === 'patch') {
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }
      const allowed = [
        'title', 'description', 'status',
        'email_reminders', 'activity_emails', 'webhooks_enabled',
        'branded_domain', 'default_logo_url', 'default_cta_copy',
        'data_retention_days', 'export_enabled', 'consent_default',
        'integrations', 'template_ids',
      ]
      for (const key of allowed) {
        if (body[key] !== undefined) updates[key] = body[key]
      }

      const { data, error } = await supabase
        .from('settings_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
