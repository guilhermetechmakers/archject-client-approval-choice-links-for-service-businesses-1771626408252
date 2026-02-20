import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchAdminUsers,
  updateUserRole,
  inviteUser,
} from '@/services/admin-usersService'
import type { ListUsersParams, UpdateRoleRequest, InviteUserRequest } from '@/types/admin-users'

const QUERY_KEY = ['admin-users']

export function useAdminUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchAdminUsers(params),
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateRoleRequest) => updateUserRole(request),
    onSuccess: () => {
      toast.success('Role updated successfully')
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to update role')
    },
  })
}

export function useInviteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: InviteUserRequest) => inviteUser(request),
    onSuccess: () => {
      toast.success('Invitation sent successfully')
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to invite user')
    },
  })
}
