import { supabase } from '@/lib/supabase'
import type {
  AdminAnalyticsResponse,
  AdminDashboardMetrics,
  UsageDataPoint,
  AdminAuditLog,
  ExportReportRequest,
} from '@/types/admin-analytics'

const MOCK_METRICS: AdminDashboardMetrics = {
  activeUsers: 24,
  linksSent: 156,
  approvals: 89,
  templatesCount: 12,
  trendUsers: 2,
  trendLinks: 12,
  trendApprovals: 8,
}

const MOCK_USAGE_DATA: UsageDataPoint[] = [
  { name: 'Jan', users: 12, links: 45, approvals: 28 },
  { name: 'Feb', users: 15, links: 62, approvals: 35 },
  { name: 'Mar', users: 18, links: 78, approvals: 42 },
]

const MOCK_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: '1',
    user_id: 'user-1',
    action: 'user_role_updated',
    resource_type: 'user',
    resource_id: 'user-2',
    details: { role: 'Member', previousRole: 'Viewer' },
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    action: 'settings_updated',
    resource_type: 'organization',
    details: { setting: 'billing_email' },
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    action: 'user_invited',
    resource_type: 'user',
    details: { email: 'new@company.com' },
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

const MOCK_RESPONSE: AdminAnalyticsResponse = {
  metrics: MOCK_METRICS,
  usageData: MOCK_USAGE_DATA,
  auditLogs: MOCK_AUDIT_LOGS,
}

/**
 * Fetches admin dashboard analytics from Supabase Edge Function.
 * Falls back to mock data when Supabase is not configured.
 */
export async function fetchAdminAnalytics(): Promise<AdminAnalyticsResponse> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { data, error } = await supabase.functions.invoke<AdminAnalyticsResponse>(
        'admin-analytics',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )
      if (error) throw new Error(error.message ?? 'Failed to fetch analytics')
      if (data) return data
    }
  }
  return MOCK_RESPONSE
}

/**
 * Exports analytics report in CSV or JSON format.
 * Uses Supabase Edge Function when configured, otherwise returns mock export.
 */
export async function exportAnalyticsReport(
  request: ExportReportRequest
): Promise<Blob | { data: AdminAnalyticsResponse }> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { data, error } = await supabase.functions.invoke('admin-analytics', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: { action: 'export', ...request },
      })
      if (!error && data) {
        if (request.format === 'csv' && typeof data === 'string') {
          return new Blob([data], { type: 'text/csv' })
        }
        if (request.format === 'json' && typeof data === 'object') {
          return new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
          })
        }
      }
    }
  }

  return {
    data: MOCK_RESPONSE,
  }
}
