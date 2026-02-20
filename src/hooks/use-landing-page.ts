import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'
import type { LandingPageConfig } from '@/types/landing-page'

const DEFAULT_CONFIG: LandingPageConfig = {
  title: 'Archject',
  description: 'Client approvals, simplified',
  status: 'active',
}

async function fetchLandingPageConfig(): Promise<LandingPageConfig> {
  try {
    const data = await apiGet<LandingPageConfig>('/landing-page')
    return data ?? DEFAULT_CONFIG
  } catch {
    return DEFAULT_CONFIG
  }
}

export function useLandingPage() {
  return useQuery({
    queryKey: ['landing-page'],
    queryFn: fetchLandingPageConfig,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
