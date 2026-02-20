import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAdminAnalytics, exportAnalyticsReport } from '@/services/admin-analyticsService'
import type { ExportReportRequest } from '@/types/admin-analytics'

const QUERY_KEY = ['admin-analytics']

export function useAdminAnalytics() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchAdminAnalytics,
  })
}

export function useExportAdminAnalytics() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: ExportReportRequest) => {
      const result = await exportAnalyticsReport(request)
      if (result instanceof Blob) {
        const url = URL.createObjectURL(result)
        const a = document.createElement('a')
        a.href = url
        a.download = `admin-analytics-export.${request.format}`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const blob = new Blob(
          [JSON.stringify(result.data, null, 2)],
          { type: 'application/json' }
        )
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `admin-analytics-export.${request.format}`
        a.click()
        URL.revokeObjectURL(url)
      }
    },
    onSuccess: (_, variables) => {
      toast.success(`Report exported as ${variables.format.toUpperCase()}`)
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => {
      toast.error('Failed to export report')
    },
  })
}
