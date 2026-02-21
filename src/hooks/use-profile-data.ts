import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'
import type { ApiError } from '@/lib/api'

export interface TeamMember {
  id: string
  email: string
  role: string
  status: string
}

export interface BillingInfo {
  plan: string
  status: string
  nextBillingDate?: string
}

export interface ApiKey {
  id: string
  name: string
  lastUsed?: string
}

function is404(error: unknown): boolean {
  return (
    error != null &&
    typeof error === 'object' &&
    'status' in error &&
    (error as { status?: number }).status === 404
  )
}

async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await apiGet<TeamMember[] | unknown>('/profile/team')
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (is404(error)) return []
    throw error
  }
}

async function fetchBillingInfo(): Promise<BillingInfo | null> {
  try {
    const data = await apiGet<BillingInfo | null | unknown>('/profile/billing')
    if (data && typeof data === 'object' && 'plan' in data) {
      return data as BillingInfo
    }
    return null
  } catch (error) {
    if (is404(error)) return null
    throw error
  }
}

async function fetchApiKeys(): Promise<ApiKey[]> {
  try {
    const data = await apiGet<ApiKey[] | unknown>('/profile/api-keys')
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (is404(error)) return []
    throw error
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ApiError).message
  }
  return 'Something went wrong. Please try again.'
}

const TEAM_QUERY_KEY = ['profile', 'team']
const BILLING_QUERY_KEY = ['profile', 'billing']
const API_KEYS_QUERY_KEY = ['profile', 'api-keys']

export function useProfileTeam() {
  return useQuery({
    queryKey: TEAM_QUERY_KEY,
    queryFn: fetchTeamMembers,
    retry: 1,
  })
}

export function useProfileBilling() {
  return useQuery({
    queryKey: BILLING_QUERY_KEY,
    queryFn: fetchBillingInfo,
    retry: 1,
  })
}

export function useProfileApiKeys() {
  return useQuery({
    queryKey: API_KEYS_QUERY_KEY,
    queryFn: fetchApiKeys,
    retry: 1,
  })
}
