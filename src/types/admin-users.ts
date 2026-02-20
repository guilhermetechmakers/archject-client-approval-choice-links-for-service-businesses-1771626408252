export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  last_sign_in_at?: string
}

export interface AdminUsersResponse {
  users: AdminUser[]
  total: number
}

export interface UpdateRoleRequest {
  userId: string
  role: 'Admin' | 'Member' | 'Viewer'
}

export interface InviteUserRequest {
  email: string
  role?: 'Admin' | 'Member' | 'Viewer'
}

export interface ListUsersParams {
  search?: string
  page?: number
  pageSize?: number
}
