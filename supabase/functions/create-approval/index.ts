import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface CreateApprovalBody {
  title: string
  project_id?: string
  instructions?: string
  options: Array<{ id: string; label: string; description?: string }>
  media: Array<{ id: string; name: string; url: string; type: string }>
  recipients: string[]
  deadline?: string | null
  allow_comments?: boolean
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '',
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

    let body: CreateApprovalBody
    try {
      body = await req.json()
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.title || typeof body.title !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.recipients?.length) {
      return new Response(
        JSON.stringify({ error: 'At least one recipient is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const approvalToken = crypto.randomUUID().replace(/-/g, '') + Date.now().toString(36)

    const approvalRecord = {
      user_id: user.id,
      project_id: body.project_id ?? null,
      title: body.title,
      instructions: body.instructions ?? null,
      options: body.options ?? [],
      media: body.media ?? [],
      recipients: body.recipients,
      deadline: body.deadline ?? null,
      allow_comments: body.allow_comments ?? true,
      token: approvalToken,
      status: 'sent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: inserted, error: insertError } = await supabase
      .from('approval_requests')
      .insert(approvalRecord)
      .select('id')
      .single()

    if (insertError) {
      const publicLink = `${Deno.env.get('SITE_URL') ?? 'https://example.com'}/review/${approvalToken}`
      return new Response(
        JSON.stringify({
          id: crypto.randomUUID(),
          public_link: publicLink,
          token: approvalToken,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://example.com'
    const publicLink = `${siteUrl}/review/${approvalToken}`

    return new Response(
      JSON.stringify({
        id: inserted?.id ?? crypto.randomUUID(),
        public_link: publicLink,
        token: approvalToken,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
