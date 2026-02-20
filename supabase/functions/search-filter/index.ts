import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SearchFilterParams {
  q?: string
  entity_type?: 'projects' | 'approvals' | 'templates'
  status?: string | string[]
  project_id?: string
  client?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}

interface SearchResultItem {
  id: string
  type: 'project' | 'approval' | 'template'
  title: string
  description?: string
  status?: string
  client_name?: string
  project_id?: string
  deadline?: string
  created_at: string
  metadata?: Record<string, unknown>
}

interface SearchFilterResponse {
  results: SearchResultItem[]
  total: number
  page: number
  limit: number
  facets?: {
    status: Record<string, number>
  }
}

function normalizeSearchTerm(term: string): string {
  return term.trim().replace(/\s+/g, ' ').toLowerCase()
}

function buildSearchPattern(term: string): string {
  const normalized = normalizeSearchTerm(term)
  if (!normalized) return ''
  const escaped = normalized.replace(/[%_\\]/g, '\\$&')
  return `%${escaped}%`
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

    let params: SearchFilterParams = {}
    const url = new URL(req.url)
    if (req.method === 'GET') {
      params = {
        q: url.searchParams.get('q') ?? undefined,
        entity_type: (url.searchParams.get('entity_type') as SearchFilterParams['entity_type']) ?? undefined,
        status: url.searchParams.get('status') ?? undefined,
        project_id: url.searchParams.get('project_id') ?? undefined,
        client: url.searchParams.get('client') ?? undefined,
        date_from: url.searchParams.get('date_from') ?? undefined,
        date_to: url.searchParams.get('date_to') ?? undefined,
        page: Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10)),
        limit: Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20', 10))),
      }
    } else {
      try {
        params = await req.json()
      } catch {
        params = {}
      }
    }

    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const offset = (page - 1) * limit
    const searchTerm = params.q?.trim()
    const searchPattern = searchTerm ? buildSearchPattern(searchTerm) : ''
    const statusFilter = Array.isArray(params.status)
      ? params.status
      : params.status
        ? [params.status]
        : undefined

    const results: SearchResultItem[] = []
    let total = 0

    const entityTypes = params.entity_type
      ? [params.entity_type]
      : (['projects', 'approvals'] as const)

    for (const entityType of entityTypes) {
      if (entityType === 'projects') {
        let query = supabase
          .from('projects')
          .select('id, title, description, status, client_name, created_at', { count: 'exact' })
          .eq('user_id', user.id)

        if (searchPattern) {
          query = query.or(`title.ilike.${searchPattern},description.ilike.${searchPattern},client_name.ilike.${searchPattern}`)
        }
        if (statusFilter?.length) {
          query = query.in('status', statusFilter)
        }
        if (params.client) {
          query = query.ilike('client_name', `%${params.client}%`)
        }
        if (params.date_from) {
          query = query.gte('created_at', params.date_from)
        }
        if (params.date_to) {
          query = query.lte('created_at', params.date_to)
        }

        const { data: rows, count } = await query
          .order('updated_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (rows) {
          results.push(
            ...rows.map((r: { id: string; title: string; description?: string; status: string; client_name?: string; created_at: string }) => ({
              id: r.id,
              type: 'project' as const,
              title: r.title,
              description: r.description,
              status: r.status,
              client_name: r.client_name,
              created_at: r.created_at,
            }))
          )
          total += count ?? 0
        }
      }

      if (entityType === 'approvals') {
        let query = supabase
          .from('approval_requests')
          .select('id, title, instructions, status, project_id, deadline, created_at', { count: 'exact' })
          .eq('user_id', user.id)

        if (searchPattern) {
          query = query.or(`title.ilike.${searchPattern},instructions.ilike.${searchPattern}`)
        }
        if (statusFilter?.length) {
          query = query.in('status', statusFilter)
        }
        if (params.project_id) {
          query = query.eq('project_id', params.project_id)
        }
        if (params.date_from) {
          query = query.gte('created_at', params.date_from)
        }
        if (params.date_to) {
          query = query.lte('created_at', params.date_to)
        }

        const { data: rows, count } = await query
          .order('updated_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (rows) {
          results.push(
            ...rows.map((r: { id: string; title: string; instructions?: string; status: string; project_id?: string; deadline?: string; created_at: string }) => ({
              id: r.id,
              type: 'approval' as const,
              title: r.title,
              description: r.instructions,
              status: r.status,
              project_id: r.project_id,
              deadline: r.deadline,
              created_at: r.created_at,
            }))
          )
          total += count ?? 0
        }
      }

      if (entityType === 'templates') {
        try {
          const templatesTable = supabase.from('templates')
          let query = templatesTable
            .select('id, title, description, created_at', { count: 'exact' })
            .eq('user_id', user.id)

          if (searchPattern) {
            query = query.or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
          }

          const { data: rows, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

          if (rows) {
            results.push(
              ...rows.map((r: { id: string; title: string; description?: string; created_at: string }) => ({
                id: r.id,
                type: 'template' as const,
                title: r.title,
                description: r.description,
                created_at: r.created_at,
              }))
            )
            total += count ?? 0
          }
        } catch {
          // templates table may not exist
        }
      }
    }

    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const paginatedResults = results.slice(0, limit)

    const response: SearchFilterResponse = {
      results: paginatedResults,
      total,
      page,
      limit,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
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
