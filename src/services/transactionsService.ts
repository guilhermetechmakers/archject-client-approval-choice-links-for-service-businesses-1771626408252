import { supabase } from '@/lib/supabase'
import type {
  Transaction,
  TransactionsResponse,
  TransactionsFilters,
  ExportTransactionsRequest,
} from '@/types/transactions'

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    user_id: 'user-1',
    type: 'invoice',
    reference_id: 'INV-001',
    amount_cents: 2900,
    currency: 'USD',
    status: 'paid',
    description: 'Pro plan - February 2025',
    created_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    type: 'payment',
    reference_id: 'PAY-002',
    amount_cents: 2900,
    currency: 'USD',
    status: 'paid',
    description: 'Payment for INV-001',
    created_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    type: 'invoice',
    reference_id: 'INV-002',
    amount_cents: 2900,
    currency: 'USD',
    status: 'paid',
    description: 'Pro plan - January 2025',
    created_at: new Date(Date.now() - 45 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 24 * 3600000).toISOString(),
  },
]

const MOCK_RESPONSE: TransactionsResponse = {
  transactions: MOCK_TRANSACTIONS,
  total: MOCK_TRANSACTIONS.length,
}

/**
 * Fetches transactions (invoices, payments, refunds, subscription changes) from Supabase Edge Function.
 * Falls back to mock data when Supabase is not configured.
 */
export async function fetchTransactions(
  filters?: TransactionsFilters
): Promise<TransactionsResponse> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { data, error } = await supabase.functions.invoke<TransactionsResponse>(
        'transactions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: { action: 'list', ...filters },
        }
      )
      if (error) throw new Error(error.message ?? 'Failed to fetch transactions')
      if (data) return data
    }
  }
  return MOCK_RESPONSE
}

/**
 * Exports transactions in CSV or JSON format.
 */
export async function exportTransactions(
  request: ExportTransactionsRequest
): Promise<Blob> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: { action: 'export', ...request },
      })
      if (!error && data) {
        if (request.format === 'csv' && typeof data === 'string') {
          return new Blob([data], { type: 'text/csv' })
        }
        return new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        })
      }
    }
  }

  const exportData = MOCK_RESPONSE.transactions
  if (request.format === 'csv') {
    const headers = ['id', 'type', 'reference_id', 'amount_cents', 'currency', 'status', 'description', 'created_at']
    const csvRows = [
      headers.join(','),
      ...exportData.map((r) =>
        headers.map((h) => `"${String((r as unknown as Record<string, unknown>)[h] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ]
    return new Blob([csvRows.join('\n')], { type: 'text/csv' })
  }
  return new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  })
}
