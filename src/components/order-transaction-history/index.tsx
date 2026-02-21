/**
 * Order / Transaction History
 *
 * Page listing invoices, payments, refunds, and subscription changes
 * for admin and billing contacts.
 */

import { useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronUp,
  Receipt,
  Search,
  Download,
  ArrowUpDown,
  FileText,
  CreditCard,
  RotateCcw,
  RefreshCw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ErrorState } from '@/components/loading-success-pages'
import { useTransactions, useExportTransactions } from '@/hooks/use-transactions'
import { useDebounce } from '@/hooks/use-debounce'
import type { Transaction, TransactionType, TransactionStatus } from '@/types/transactions'

const TRANSACTION_TYPES: { value: TransactionType; label: string; icon: typeof FileText }[] = [
  { value: 'invoice', label: 'Invoice', icon: FileText },
  { value: 'payment', label: 'Payment', icon: CreditCard },
  { value: 'refund', label: 'Refund', icon: RotateCcw },
  { value: 'subscription_change', label: 'Subscription', icon: RefreshCw },
]

const STATUS_VARIANTS: Record<TransactionStatus, 'success' | 'secondary' | 'destructive' | 'warning' | 'outline'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'destructive',
  refunded: 'secondary',
  cancelled: 'outline',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

function formatType(type: TransactionType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function TypeBadge({ type }: { type: TransactionType }) {
  const config = TRANSACTION_TYPES.find((t) => t.value === type)
  const Icon = config?.icon ?? FileText
  return (
    <Badge variant="secondary" className="gap-1">
      <Icon className="h-3 w-3" />
      {formatType(type)}
    </Badge>
  )
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const variant = STATUS_VARIANTS[status] ?? 'outline'
  return <Badge variant={variant}>{status}</Badge>
}

export function OrderTransactionHistory() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: true }])

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError, refetch } = useTransactions({
    search: debouncedSearch || undefined,
    type: typeFilter === 'all' ? undefined : typeFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    pageSize,
    sortBy: sorting[0]?.id as 'created_at' | 'amount_cents' | 'reference_id' | undefined,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  })

  const exportMutation = useExportTransactions()

  const transactions = data?.transactions ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'reference_id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label={`Sort by reference ${column.getIsSorted() === 'asc' ? '(ascending)' : column.getIsSorted() === 'desc' ? '(descending)' : ''}`}
        >
          Reference
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.reference_id}</p>
          {row.original.description && (
            <p className="text-caption text-muted-foreground truncate max-w-[200px]">
              {row.original.description}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <TypeBadge type={row.original.type} />,
    },
    {
      accessorKey: 'amount_cents',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label={`Sort by amount ${column.getIsSorted() === 'asc' ? '(ascending)' : column.getIsSorted() === 'desc' ? '(descending)' : ''}`}
        >
          Amount
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {formatAmount(row.original.amount_cents, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          aria-label={`Sort by date ${column.getIsSorted() === 'asc' ? '(ascending)' : column.getIsSorted() === 'desc' ? '(descending)' : ''}`}
        >
          Date
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="text-right font-semibold">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            className="transition-transform hover:scale-[1.02]"
            aria-label={`View invoice ${row.original.reference_id}`}
          >
            View invoice
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleExport = (format: 'csv' | 'json') => {
    exportMutation.mutate({
      format,
      type: typeFilter === 'all' ? undefined : typeFilter,
      status: statusFilter === 'all' ? undefined : statusFilter,
    })
  }

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-h1 font-bold">Order & Transaction History</h1>
          <p className="text-body text-muted-foreground mt-1">
            View invoices, payments, refunds, and subscription changes
          </p>
        </div>
        <ErrorState
          heading="Failed to load transactions"
          description="There was a problem loading your order history. Please try again."
          retryLabel="Try again"
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <nav
        className="flex items-center gap-2 text-caption text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link to="/dashboard/overview" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span className="text-muted-foreground" aria-hidden>/</span>
        <span className="text-foreground font-medium">Orders</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold">Order & Transaction History</h1>
          <p className="text-body text-muted-foreground mt-1">
            View invoices, payments, refunds, and subscription changes
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={exportMutation.isPending}
              aria-label="Export transactions"
              aria-haspopup="menu"
              className="transition-transform hover:scale-[1.02]"
            >
              <Download className="h-5 w-5" aria-hidden />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" aria-label="Export format options">
            <DropdownMenuItem
              onClick={() => handleExport('csv')}
              aria-label="Export as CSV"
            >
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport('json')}
              aria-label="Export as JSON"
            >
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="rounded-2xl border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-modal">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transactions
          </CardTitle>
          <CardDescription>
            Search and filter your payment history
          </CardDescription>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Search by reference or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
                aria-label="Search transactions"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v as TransactionType | 'all')
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[160px]" aria-label="Filter by type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {TRANSACTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as TransactionStatus | 'all')
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[140px]" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[120px]" aria-label="Items per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <OrderTransactionHistorySkeleton />
          ) : !transactions.length ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border-2 border-dashed border-border bg-muted/30"
              role="status"
              aria-label="No transactions"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Receipt className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="text-h3 font-semibold mt-4 text-foreground">
                No transactions yet
              </h3>
              <p className="text-body text-muted-foreground mt-2 max-w-sm">
                Your payment history will appear here once you make a purchase or subscription change.
              </p>
              <Button asChild className="mt-6 min-h-[44px]" aria-label="View pricing">
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table aria-label="Transactions table">
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                          key={headerGroup.id}
                          className="hover:bg-transparent border-b bg-muted/30 sticky top-0 z-10"
                        >
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className={cn(
                                'font-semibold',
                                header.id === 'actions' && 'text-right'
                              )}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="transition-colors hover:bg-accent/50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                cell.column.id === 'actions' && 'text-right'
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="md:hidden space-y-4">
                {transactions.map((tx) => (
                  <Card
                    key={tx.id}
                    className="rounded-2xl border-border transition-all duration-300 hover:shadow-modal hover:border-primary/20"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{tx.reference_id}</p>
                          {tx.description && (
                            <p className="text-caption text-muted-foreground truncate">
                              {tx.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <TypeBadge type={tx.type} />
                            <StatusBadge status={tx.status} />
                            <span className="text-caption text-muted-foreground">
                              {formatDate(tx.created_at)}
                            </span>
                          </div>
                          <p className="font-medium mt-2">
                            {formatAmount(tx.amount_cents, tx.currency)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 min-h-[44px] min-w-[44px]"
                          aria-label={`View invoice ${tx.reference_id}`}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-caption text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, total)} of {total} transactions
                  </p>
                  <nav className="flex gap-2" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={!hasPrevPage}
                      aria-label="Previous page"
                      className="min-h-[44px] min-w-[44px] transition-transform hover:scale-[1.02]"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={!hasNextPage}
                      aria-label="Next page"
                      className="min-h-[44px] min-w-[44px] transition-transform hover:scale-[1.02]"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        <Button asChild variant="outline" className="transition-transform hover:scale-[1.02]">
          <Link to="/dashboard/admin" aria-label="Admin dashboard">
            Admin Dashboard
          </Link>
        </Button>
        <Button asChild variant="outline" className="transition-transform hover:scale-[1.02]">
          <Link to="/dashboard/admin/users" aria-label="User management">
            User Management
          </Link>
        </Button>
      </div>
    </div>
  )
}

function OrderTransactionHistorySkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading transactions">
      <div className="hidden md:block rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table aria-hidden>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-muted/30">
                <TableHead><Skeleton className="h-4 w-24 skeleton-shimmer" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16 skeleton-shimmer" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20 skeleton-shimmer" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16 skeleton-shimmer" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20 skeleton-shimmer" /></TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24 skeleton-shimmer" />
                      <Skeleton className="h-3 w-32 skeleton-shimmer" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full skeleton-shimmer" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 skeleton-shimmer" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-14 rounded-full skeleton-shimmer" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 skeleton-shimmer" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24 skeleton-shimmer" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-4 space-y-3"
          >
            <Skeleton className="h-4 w-32 skeleton-shimmer" />
            <Skeleton className="h-3 w-48 skeleton-shimmer" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full skeleton-shimmer" />
              <Skeleton className="h-5 w-14 rounded-full skeleton-shimmer" />
            </div>
            <Skeleton className="h-4 w-20 skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}
