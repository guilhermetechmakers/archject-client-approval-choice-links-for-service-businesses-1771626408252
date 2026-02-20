import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AdminDashboardMetrics {
  activeUsers: number
  linksSent: number
  approvals: number
  templatesCount: number
  trendUsers: number
  trendLinks: number
  trendApprovals: number
}

interface UsageDataPoint {
  name: string
  users: number
  links: number
  approvals?: number
}

interface AdminAuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type?: string
  resource_id?: string
  details?: Record<string, unknown>
  ip_address?: string
  created_at: string
}

interface AdminAnalyticsResponse {
  metrics: AdminDashboardMetrics
  usageData: UsageDataPoint[]
  auditLogs: AdminAuditLog[]
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
    let action = url.searchParams.get('action') ?? 'dashboard'
    let body: Record<string, unknown> = {}
    if (req.method === 'POST') {
      try {
        body = await req.json()
        action = (body.action as string) ?? action
      } catch {
        // Use default action
      }
    }

    if (action === 'dashboard') {
      const { data: analyticsRows } = await supabase
        .from('admin_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)

      const metrics: AdminDashboardMetrics = {
        activeUsers: 24,
        linksSent: 156,
        approvals: 89,
        templatesCount: 12,
        trendUsers: 2,
        trendLinks: 12,
        trendApprovals: 8,
      }

      const usageData: UsageDataPoint[] = [
        { name: 'Jan', users: 12, links: 45, approvals: 28 },
        { name: 'Feb', users: 15, links: 62, approvals: 35 },
        { name: 'Mar', users: 18, links: 78, approvals: 42 },
      ]

      const { data: auditLogs } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      const response: AdminAnalyticsResponse = {
        metrics,
        usageData,
        auditLogs: (auditLogs ?? []) as AdminAuditLog[],
      }

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'export') {
      const format = body.format ?? 'json'
      const startDate = body.startDate as string | undefined
      const endDate = body.endDate as string | undefined

      const { data: analyticsRows } = await supabase
        .from('admin_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      let exportData = analyticsRows ?? []
      if (startDate) {
        exportData = exportData.filter((r: { created_at: string }) => r.created_at >= startDate)
      }
      if (endDate) {
        exportData = exportData.filter((r: { created_at: string }) => r.created_at <= endDate)
      }

      if (format === 'csv') {
        const headers = ['id', 'title', 'description', 'status', 'created_at', 'updated_at']
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
            'Content-Disposition': 'attachment; filename="admin-analytics-export.csv"',
          },
        })
      }

      return new Response(JSON.stringify(exportData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="admin-analytics-export.json"',
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
