import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPatch } from '@/lib/api'
import type {
  ApprovalRequestDetailResponse,
  Comment,
} from '@/types/approval-request-detail'
import { getMockApprovalRequestDetail } from '@/lib/mock-approval-detail'

const QUERY_KEY = ['approval-request-detail']

export function useApprovalRequestDetail(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await apiGet<ApprovalRequestDetailResponse>(
          `/approval-requests/${id}`
        )
      } catch {
        if (id) return getMockApprovalRequestDetail(id)
        throw new Error('Approval request ID is required')
      }
    },
    enabled: !!id,
  })
}

export function useSendReminder(id: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiPost(`/approval-requests/${id}/remind`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] })
    },
  })
}

export function useRevokeLink(id: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiPost(`/approval-requests/${id}/revoke`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] })
    },
  })
}

export function useDuplicateRequest(id: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiPost(`/approval-requests/${id}/duplicate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] })
    },
  })
}

export function useAddComment(id: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { content: string; parent_id?: string }) =>
      apiPost(`/approval-requests/${id}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] })
    },
  })
}

export function useUpdateComment(requestId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      commentId,
      ...updateData
    }: Partial<Comment> & { commentId: string }) =>
      apiPatch(`/approval-requests/${requestId}/comments/${commentId}`, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, requestId] })
    },
  })
}
