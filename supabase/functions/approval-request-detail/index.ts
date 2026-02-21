import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ApprovalRequestDetailResponse {
  request: {
    id: string
    user_id: string
    title: string
    description?: string
    status: string
    created_at: string
    updated_at: string
    deadline?: string
    sent_at?: string
    recipients?: string[]
    project_name?: string
  }
  selections: Array<{
    id: string
    option_id: string
    option_title: string
    option_description?: string
    selected_by: string
    selected_at: string
    cost?: string
  }>
  audit_trail: Array<{
    id: string
    action: string
    timestamp: string
    ip_address?: string
    user_agent?: string
    actor?: string
    details?: string
  }>
  comments: Array<{
    id: string
    content: string
    author: string
    author_email?: string
    created_at: string
    resolved: boolean
    flagged: boolean
    parent_id?: string
    replies?: unknown[]
  }>
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

    const url = new URL(req.url)
    let id = url.searchParams.get('id') ?? url.pathname.split('/').pop()
    if ((!id || id === 'approval-request-detail') && req.method === 'POST') {
      try {
        const body = await req.json()
        id = (body as { id?: string }).id ?? id
      } catch {
        // ignore
      }
    }
    if (!id || id === 'approval-request-detail') {
      return new Response(
        JSON.stringify({ error: 'Approval request ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: approval, error: approvalError } = await supabase
      .from('approval_requests')
      .select('id, user_id, title, instructions, status, deadline, recipients, created_at, updated_at, project_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (approvalError || !approval) {
      return new Response(
        JSON.stringify({ error: 'Approval request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let projectName: string | null = null
    if (approval.project_id) {
      const { data: project } = await supabase
        .from('projects')
        .select('title')
        .eq('id', approval.project_id)
        .single()
      projectName = project?.title ?? null
    }

    const response: ApprovalRequestDetailResponse = {
      request: {
        id: approval.id,
        user_id: approval.user_id,
        title: approval.title,
        description: approval.instructions ?? undefined,
        status: approval.status ?? 'active',
        created_at: approval.created_at,
        updated_at: approval.updated_at,
        deadline: approval.deadline ?? undefined,
        sent_at: approval.created_at,
        recipients: approval.recipients ?? [],
        project_name: projectName ?? undefined,
      },
      selections: [],
      audit_trail: [],
      comments: [],
    }

    const { data: selections } = await supabase
      .from('approval_selections')
      .select('*')
      .eq('approval_request_id', id)
      .order('selected_at', { ascending: false })

    if (selections?.length) {
      response.selections = selections.map((s: Record<string, unknown>) => ({
        id: String(s.id),
        option_id: String(s.option_id ?? ''),
        option_title: String(s.option_title ?? ''),
        option_description: s.option_description ? String(s.option_description) : undefined,
        selected_by: String(s.selected_by ?? ''),
        selected_at: String(s.selected_at ?? ''),
        cost: s.cost ? String(s.cost) : undefined,
      }))
    }

    const { data: auditEntries } = await supabase
      .from('approval_audit_trail')
      .select('*')
      .eq('approval_request_id', id)
      .order('timestamp', { ascending: false })

    if (auditEntries?.length) {
      response.audit_trail = auditEntries.map((e: Record<string, unknown>) => ({
        id: String(e.id),
        action: String(e.action ?? ''),
        timestamp: String(e.timestamp ?? ''),
        ip_address: e.ip_address ? String(e.ip_address) : undefined,
        user_agent: e.user_agent ? String(e.user_agent) : undefined,
        actor: e.actor ? String(e.actor) : undefined,
        details: e.details ? String(e.details) : undefined,
      }))
    }

    const { data: comments } = await supabase
      .from('approval_comments')
      .select('*')
      .eq('approval_request_id', id)
      .order('created_at', { ascending: true })

    if (comments?.length) {
      const topLevel = comments.filter((c: Record<string, unknown>) => !c.parent_id)
      const replies = comments.filter((c: Record<string, unknown>) => c.parent_id)
      response.comments = topLevel.map((c: Record<string, unknown>) => ({
        id: String(c.id),
        content: String(c.content ?? ''),
        author: String(c.author ?? ''),
        author_email: c.author_email ? String(c.author_email) : undefined,
        created_at: String(c.created_at ?? ''),
        resolved: Boolean(c.resolved),
        flagged: Boolean(c.flagged),
        parent_id: c.parent_id ? String(c.parent_id) : undefined,
        replies: replies
          .filter((r: Record<string, unknown>) => r.parent_id === c.id)
          .map((r: Record<string, unknown>) => ({
            id: String(r.id),
            content: String(r.content ?? ''),
            author: String(r.author ?? ''),
            created_at: String(r.created_at ?? ''),
            resolved: Boolean(r.resolved),
            flagged: Boolean(r.flagged),
            parent_id: r.parent_id ? String(r.parent_id) : undefined,
          })),
      }))
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
