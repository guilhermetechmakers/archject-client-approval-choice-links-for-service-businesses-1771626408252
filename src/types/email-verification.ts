export interface EmailVerificationPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ResendVerificationResponse {
  success: boolean
  message: string
}

export interface ResendVerificationError {
  error: string
}
