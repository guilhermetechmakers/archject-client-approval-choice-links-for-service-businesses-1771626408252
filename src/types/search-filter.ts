export type SearchEntityType = 'projects' | 'approvals' | 'templates'

export type SearchResultType = 'project' | 'approval' | 'template'

export interface SearchFilterParams {
  q?: string
  entity_type?: SearchEntityType
  status?: string | string[]
  project_id?: string
  client?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}

export interface SearchResultItem {
  id: string
  type: SearchResultType
  title: string
  description?: string
  status?: string
  client_name?: string
  project_id?: string
  deadline?: string
  created_at: string
  metadata?: Record<string, unknown>
}

export interface SearchFilterResponse {
  results: SearchResultItem[]
  total: number
  page: number
  limit: number
  facets?: {
    status: Record<string, number>
  }
}
