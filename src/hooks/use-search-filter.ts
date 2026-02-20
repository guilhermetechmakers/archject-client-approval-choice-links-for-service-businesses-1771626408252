import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { SearchFilterParams, SearchFilterResponse } from '@/types/search-filter'

const QUERY_KEY = ['search-filter']

async function invokeSearchFilter(params: SearchFilterParams): Promise<SearchFilterResponse> {
  if (!isSupabaseConfigured() || !supabase) {
    return { results: [], total: 0, page: params.page ?? 1, limit: params.limit ?? 20 }
  }

  const { data, error } = await supabase.functions.invoke<SearchFilterResponse>('search-filter', {
    body: params,
  })

  if (error) {
    throw new Error(error.message ?? 'Search failed')
  }

  return data ?? { results: [], total: 0, page: 1, limit: 20 }
}

export function useSearchFilter(params: SearchFilterParams) {
  const enabled = !!params.q?.trim() || !!params.status || !!params.project_id || !!params.entity_type

  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => invokeSearchFilter(params),
    enabled,
    staleTime: 30_000,
  })
}
