import { useQuery } from '@tanstack/react-query'
import { Receipt } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/loading-success-pages'

const mockOrders = [
  { id: 'INV-001', date: '2025-02-15', amount: '$29.00', status: 'Paid' },
  { id: 'INV-002', date: '2025-01-15', amount: '$29.00', status: 'Paid' },
]

async function fetchOrders() {
  await new Promise((r) => setTimeout(r, 300))
  return mockOrders
}

export function OrdersPage() {
  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  })

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-h1 font-bold">Order & Transaction History</h1>
          <p className="text-body text-muted-foreground mt-1">
            View invoices, payments, and refunds
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

  const hasOrders = orders && orders.length > 0

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-h1 font-bold">Order & Transaction History</h1>
        <p className="text-body text-muted-foreground mt-1">
          View invoices, payments, and refunds
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Your payment history</CardDescription>
          </div>
          <Input placeholder="Filter..." className="max-w-sm" />
        </CardHeader>
        <CardContent>
          {!hasOrders ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              role="status"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-h3 font-semibold mt-4">No transactions yet</h3>
              <p className="text-body text-muted-foreground mt-2 max-w-md">
                Your payment history will appear here once you make a purchase.
              </p>
              <Button asChild className="mt-6">
                <a href="/pricing">View pricing</a>
              </Button>
            </div>
          ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-caption text-muted-foreground">{order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{order.amount}</span>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-caption text-success">
                    {order.status}
                  </span>
                  <Button variant="outline" size="sm">
                    View invoice
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
