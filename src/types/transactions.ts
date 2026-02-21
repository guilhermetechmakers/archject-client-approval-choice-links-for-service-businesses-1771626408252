/** Transaction type: invoice, payment, refund, or subscription change */
export type TransactionType = 'invoice' | 'payment' | 'refund' | 'subscription_change'

/** Transaction status */
export type TransactionStatus = 'paid' | 'pending' | 'failed' | 'refunded' | 'cancelled'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  reference_id: string
  amount_cents: number
  currency: string
  status: TransactionStatus
  description?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
  total: number
}

export interface TransactionsFilters {
  search?: string
  type?: TransactionType
  status?: TransactionStatus
  page?: number
  pageSize?: number
  sortBy?: 'created_at' | 'amount_cents' | 'reference_id'
  sortOrder?: 'asc' | 'desc'
}

export interface ExportTransactionsRequest {
  format: 'csv' | 'json'
  startDate?: string
  endDate?: string
  type?: TransactionType
  status?: TransactionStatus
}
