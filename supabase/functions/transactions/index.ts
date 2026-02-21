import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface Transaction {
  id: string
  user_id: string
  type: string
  reference_id: string
  amount_cents: number
  currency: string
  status: string
  description?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

interface TransactionsResponse {
  transactions: Transaction[]
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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    let action = url.searchParams.get('action') ?? 'list'
    let body: Record<string, unknown> = {}
    if (req.method === 'POST') {
      try {
        body = await req.json()
        action = (body.action as string) ?? action
      } catch {
        // Use default
      }
    }

    if (action === 'list') {
      const search = (body.search ?? url.searchParams.get('search')) as string | undefined
      const type = (body.type ?? url.searchParams.get('type')) as string | undefined
      const status = (body.status ?? url.searchParams.get('status')) as string | undefined
      const page = Math.max(1, parseInt(String(body.page ?? url.searchParams.get('page') ?? 1), 10))
      const pageSize = Math.min(50, Math.max(1, parseInt(String(body.pageSize ?? url.searchParams.get('pageSize') ?? 10), 10)))
      const sortBy = (body.sortBy ?? url.searchParams.get('sortBy') ?? 'created_at') as string
      const sortOrder = ((body.sortOrder ?? url.searchParams.get('sortOrder') ?? 'desc') as string) as 'asc' | 'desc'

      let query = supabaseAdmin
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

      if (type) query = query.eq('type', type)
      if (status) query = query.eq('status', status)
      if (search) {
        query = query.or(`reference_id.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const validSortColumns = ['created_at', 'amount_cents', 'reference_id']
      const orderColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at'

      const { data: rows, error, count } = await query
        .order(orderColumn, { ascending: sortOrder === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const transactions = (rows ?? []) as Transaction[]
      const total = count ?? 0

      const response: TransactionsResponse = { transactions, total }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'export') {
      const format = body.format ?? 'json'
      const startDate = body.startDate as string | undefined
      const endDate = body.endDate as string | undefined
      const type = body.type as string | undefined
      const status = body.status as string | undefined

      let query = supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (type) query = query.eq('type', type)
      if (status) query = query.eq('status', status)
      if (startDate) query = query.gte('created_at', startDate)
      if (endDate) query = query.lte('created_at', endDate)

      const { data: rows, error } = await query

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const exportData = rows ?? []

      if (format === 'csv') {
        const headers = ['id', 'type', 'reference_id', 'amount_cents', 'currency', 'status', 'description', 'created_at']
        const csvRows = [
          headers.join(','),
          ...exportData.map((r: Record<string, unknown>) =>
            headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')
          ),
        ]
        return new Response(csvRows.join('\n'), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="transactions-export.csv"',
          },
        })
      }

      return new Response(JSON.stringify(exportData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="transactions-export.json"',
        },
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
