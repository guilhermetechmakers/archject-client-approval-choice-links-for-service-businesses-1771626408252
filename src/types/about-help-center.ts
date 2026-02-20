export interface AboutHelpCenter {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface SupportRequest {
  id: string
  user_id: string | null
  issue_type: 'technical' | 'billing' | 'feature' | 'account' | 'other'
  description: string
  email: string
  status: 'open' | 'in_progress' | 'resolved'
  created_at: string
  updated_at: string
}
