import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  last_sign_in_at?: string
}

interface AdminUsersResponse {
  users: AdminUser[]
  total: number
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

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: requesterProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = requesterProfile?.role === 'Admin'

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let body: Record<string, unknown> = {}
    if (req.method === 'POST') {
      try {
        body = await req.json()
      } catch {
        // Use empty body
      }
    }

    const action = (body.action as string) ?? (new URL(req.url).searchParams.get('action') ?? 'list')
    const search = (body.search as string) ?? new URL(req.url).searchParams.get('search') ?? ''
    const page = Math.max(1, parseInt(String(body.page ?? new URL(req.url).searchParams.get('page') ?? 1), 10))
    const pageSize = Math.min(50, Math.max(10, parseInt(String(body.pageSize ?? new URL(req.url).searchParams.get('pageSize') ?? 10), 10)))
    const offset = (page - 1) * pageSize

    if (action === 'list') {
      let query = supabaseAdmin
        .from('profiles')
        .select('id, email, full_name, role, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (search.trim()) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
      }

      const { data: profiles, error: profilesError, count } = await query
        .range(offset, offset + pageSize - 1)

      if (profilesError) {
        return new Response(
          JSON.stringify({ error: profilesError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const users: AdminUser[] = (profiles ?? []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        email: (p.email as string) ?? '',
        full_name: p.full_name as string | null,
        role: (p.role as string) ?? 'Member',
        created_at: p.created_at as string,
      }))

      const response: AdminUsersResponse = {
        users,
        total: count ?? users.length,
      }

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update_role' && req.method === 'POST') {
      const userId = body.userId as string | undefined
      const role = body.role as string | undefined
      if (!userId || !role) {
        return new Response(
          JSON.stringify({ error: 'userId and role are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const validRoles = ['Admin', 'Member', 'Viewer']
      if (!validRoles.includes(role)) {
        return new Response(
          JSON.stringify({ error: 'Invalid role' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      await supabaseAdmin.from('admin_audit_logs').insert({
        user_id: user.id,
        action: 'user_role_updated',
        resource_type: 'user',
        resource_id: userId,
        details: { role },
      })

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'invite' && req.method === 'POST') {
      const email = body.email as string | undefined
      const role = (body.role as string) ?? 'Member'
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const validRoles = ['Admin', 'Member', 'Viewer']
      if (!validRoles.includes(role)) {
        return new Response(
          JSON.stringify({ error: 'Invalid role' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        { data: { role } }
      )

      if (inviteError) {
        return new Response(
          JSON.stringify({ error: inviteError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      await supabaseAdmin.from('admin_audit_logs').insert({
        user_id: user.id,
        action: 'user_invited',
        resource_type: 'user',
        resource_id: inviteData?.user?.id ?? null,
        details: { email, role },
      })

      return new Response(
        JSON.stringify({ success: true, userId: inviteData?.user?.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
