import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchTransactions,
  exportTransactions,
} from '@/services/transactionsService'
import type { TransactionsFilters, ExportTransactionsRequest } from '@/types/transactions'

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const

export function useTransactions(filters?: TransactionsFilters) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, filters],
    queryFn: () => fetchTransactions(filters),
  })
}

export function useExportTransactions() {
  return useMutation({
    mutationFn: (request: ExportTransactionsRequest) => exportTransactions(request),
    onMutate: () => {
      toast.loading('Exporting transactions...', { id: 'transactions-export' })
    },
    onSuccess: (blob, variables) => {
      toast.dismiss('transactions-export')
      const ext = variables.format === 'csv' ? 'csv' : 'json'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-export.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Transactions exported successfully')
    },
    onError: (err) => {
      toast.dismiss('transactions-export')
      toast.error(err instanceof Error ? err.message : 'Export failed')
    },
  })
}
