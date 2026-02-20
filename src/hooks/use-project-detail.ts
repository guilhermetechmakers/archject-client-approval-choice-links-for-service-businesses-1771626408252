import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPatch } from '@/lib/api'
import type { ProjectDetailResponse, ProjectDetail } from '@/types/project-detail'

const QUERY_KEY = ['project-detail']

function getMockProjectDetail(projectId: string): ProjectDetailResponse {
  return {
    project: {
      id: projectId,
      user_id: 'user-1',
      title: 'Kitchen Renovation',
      description: 'Full kitchen remodel with new cabinets and countertops',
      status: 'active',
      client_name: 'Smith Residence',
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-02-18T14:30:00Z',
    },
    approval_requests: [
      {
        id: 'ar-1',
        project_id: projectId,
        title: 'Cabinet Selection',
        status: 'pending',
        deadline: '2025-02-25',
        response_count: 1,
        total_recipients: 2,
        created_at: '2025-02-10T09:00:00Z',
      },
      {
        id: 'ar-2',
        project_id: projectId,
        title: 'Flooring Options',
        status: 'approved',
        deadline: '2025-02-20',
        response_count: 2,
        total_recipients: 2,
        created_at: '2025-02-05T11:00:00Z',
      },
      {
        id: 'ar-3',
        project_id: projectId,
        title: 'Color Palette',
        status: 'sent',
        deadline: '2025-03-01',
        response_count: 0,
        total_recipients: 2,
        created_at: '2025-02-18T14:00:00Z',
      },
    ],
    timeline: [
      {
        id: 'te-1',
        project_id: projectId,
        type: 'approval_sent',
        title: 'Color Palette sent',
        description: 'Approval request sent to 2 recipients',
        created_at: '2025-02-18T14:00:00Z',
      },
      {
        id: 'te-2',
        project_id: projectId,
        type: 'approval_approved',
        title: 'Flooring Options approved',
        description: 'All recipients approved',
        created_at: '2025-02-15T16:30:00Z',
      },
      {
        id: 'te-3',
        project_id: projectId,
        type: 'file_uploaded',
        title: 'Floor plan v2 uploaded',
        created_at: '2025-02-12T10:00:00Z',
      },
    ],
    files: [
      {
        id: 'f-1',
        project_id: projectId,
        name: 'Floor plan v2.pdf',
        url: '#',
        size: 2450000,
        version: 2,
        uploaded_at: '2025-02-12T10:00:00Z',
      },
      {
        id: 'f-2',
        project_id: projectId,
        name: 'Cabinet options.jpg',
        url: '#',
        size: 890000,
        version: 1,
        uploaded_at: '2025-02-10T09:00:00Z',
      },
    ],
    contacts: [
      {
        id: 'c-1',
        project_id: projectId,
        name: 'John Smith',
        email: 'john@smithresidence.com',
        phone: '+1 555-0123',
        last_response_at: '2025-02-18T14:00:00Z',
      },
      {
        id: 'c-2',
        project_id: projectId,
        name: 'Jane Smith',
        email: 'jane@smithresidence.com',
        last_response_at: '2025-02-15T16:30:00Z',
      },
    ],
  }
}

export function useProjectDetail(projectId: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID required')
      try {
        return await apiGet<ProjectDetailResponse>(`/projects/${projectId}`)
      } catch {
        return getMockProjectDetail(projectId)
      }
    },
    enabled: !!projectId,
  })
}

export function useUpdateProject(projectId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ProjectDetail>) => {
      if (!projectId) throw new Error('Project ID required')
      return apiPatch<ProjectDetail>(`/projects/${projectId}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useArchiveProject(projectId: string | undefined) {
  return useUpdateProject(projectId)
}
