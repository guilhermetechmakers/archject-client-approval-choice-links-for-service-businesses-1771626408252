export interface ApprovalOption {
  id: string
  label: string
  description?: string
}

export interface ApprovalMediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'document'
  size?: number
}

export interface CreateApprovalFormData {
  title: string
  project_id?: string
  instructions?: string
  options: ApprovalOption[]
  media: ApprovalMediaItem[]
  recipients: string[]
  deadline?: string
  allow_comments: boolean
}

export interface CreateApprovalResponse {
  id: string
  public_link: string
  token: string
}
