import { supabase } from '@/lib/supabase'
import type {
  AdminUsersResponse,
  UpdateRoleRequest,
  InviteUserRequest,
  ListUsersParams,
} from '@/types/admin-users'

const MOCK_USERS: AdminUsersResponse = {
  users: [
    {
      id: '1',
      email: 'john@company.com',
      full_name: 'John Doe',
      role: 'Admin',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: '2',
      email: 'jane@company.com',
      full_name: 'Jane Smith',
      role: 'Member',
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
  ],
  total: 2,
}

/**
 * Fetches admin user list from Supabase Edge Function.
 * Falls back to mock data when Supabase is not configured.
 */
export async function fetchAdminUsers(
  params: ListUsersParams = {}
): Promise<AdminUsersResponse> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { data, error } = await supabase.functions.invoke<AdminUsersResponse>(
        'admin-users',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: {
            action: 'list',
            search: params.search ?? '',
            page: params.page ?? 1,
            pageSize: params.pageSize ?? 10,
          },
        }
      )

      if (error) throw new Error(error.message ?? 'Failed to fetch users')
      if (data) return data
    }
  }

  return MOCK_USERS
}

/**
 * Updates a user's role via Supabase Edge Function.
 */
export async function updateUserRole(request: UpdateRoleRequest): Promise<void> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { error } = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: { action: 'update_role', ...request },
      })
      if (!error) return
      throw new Error(error.message ?? 'Failed to update role')
    }
  }
  throw new Error('Not authenticated')
}

/**
 * Invites a user via Supabase Edge Function.
 */
export async function inviteUser(request: InviteUserRequest): Promise<void> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { error } = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: { action: 'invite', ...request },
      })
      if (!error) return
      throw new Error(error.message ?? 'Failed to invite user')
    }
  }
  throw new Error('Not authenticated')
}
