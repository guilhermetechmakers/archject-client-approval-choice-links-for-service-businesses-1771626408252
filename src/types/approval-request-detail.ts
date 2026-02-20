export interface ApprovalRequestDetail {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'active' | 'pending' | 'approved' | 'revoked' | 'expired'
  created_at: string
  updated_at: string
  deadline?: string
  sent_at?: string
  recipients?: string[]
  project_name?: string
}

export interface SelectionSnapshot {
  id: string
  option_id: string
  option_title: string
  option_description?: string
  selected_by: string
  selected_at: string
  cost?: string
}

export interface AuditTrailEntry {
  id: string
  action: string
  timestamp: string
  ip_address?: string
  user_agent?: string
  actor?: string
  details?: string
}

export interface Comment {
  id: string
  content: string
  author: string
  author_email?: string
  created_at: string
  resolved: boolean
  flagged: boolean
  parent_id?: string
  replies?: Comment[]
}

export interface ApprovalRequestDetailResponse {
  request: ApprovalRequestDetail
  selections: SelectionSnapshot[]
  audit_trail: AuditTrailEntry[]
  comments: Comment[]
}
