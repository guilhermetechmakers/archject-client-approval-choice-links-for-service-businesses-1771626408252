import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchSettingsPreferences,
  updateSettingsPreferences,
} from '@/services/settings-preferencesService'
import type { UpdateSettingsPreferencesRequest } from '@/types/settings-preferences'

const QUERY_KEY = ['settings-preferences']

export function useSettingsPreferences() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchSettingsPreferences,
  })
}

export function useUpdateSettingsPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateSettingsPreferencesRequest) =>
      updateSettingsPreferences(request),
    onSuccess: () => {
      toast.success('Settings saved successfully')
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to save settings')
    },
  })
}
