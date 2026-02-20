export type ProjectStatus = 'active' | 'archived' | 'completed'

export type ApprovalRequestStatus = 'sent' | 'pending' | 'approved' | 'declined'

export interface ProjectDetail {
  id: string
  user_id: string
  title: string
  description?: string
  status: ProjectStatus
  client_name?: string
  created_at: string
  updated_at: string
}

export interface ApprovalRequestSummary {
  id: string
  project_id: string
  title: string
  status: ApprovalRequestStatus
  deadline?: string
  response_count: number
  total_recipients: number
  created_at: string
}

export interface TimelineEvent {
  id: string
  project_id: string
  type: 'approval_sent' | 'approval_approved' | 'approval_declined' | 'file_uploaded' | 'comment_added'
  title: string
  description?: string
  created_at: string
  metadata?: Record<string, unknown>
}

export interface ProjectFile {
  id: string
  project_id: string
  name: string
  url: string
  size?: number
  version?: number
  uploaded_at: string
}

export interface ClientContact {
  id: string
  project_id: string
  name: string
  email: string
  phone?: string
  last_response_at?: string
}

export interface ProjectDetailResponse {
  project: ProjectDetail
  approval_requests: ApprovalRequestSummary[]
  timeline: TimelineEvent[]
  files: ProjectFile[]
  contacts: ClientContact[]
}
