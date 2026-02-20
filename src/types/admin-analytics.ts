export interface AdminAnalytics {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface AdminAuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type?: string
  resource_id?: string
  details?: Record<string, unknown>
  ip_address?: string
  created_at: string
}

export interface AdminDashboardMetrics {
  activeUsers: number
  linksSent: number
  approvals: number
  templatesCount: number
  trendUsers: number
  trendLinks: number
  trendApprovals: number
}

export interface UsageDataPoint {
  name: string
  users: number
  links: number
  approvals?: number
}

export interface AdminAnalyticsResponse {
  metrics: AdminDashboardMetrics
  usageData: UsageDataPoint[]
  auditLogs: AdminAuditLog[]
}

export interface ExportReportRequest {
  format: 'csv' | 'json'
  startDate?: string
  endDate?: string
}
