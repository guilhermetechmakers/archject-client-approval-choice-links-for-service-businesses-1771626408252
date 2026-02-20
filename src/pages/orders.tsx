import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const mockOrders = [
  { id: 'INV-001', date: '2025-02-15', amount: '$29.00', status: 'Paid' },
  { id: 'INV-002', date: '2025-01-15', amount: '$29.00', status: 'Paid' },
]

export function OrdersPage() {
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
          <div className="space-y-4">
            {mockOrders.map((order) => (
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
        </CardContent>
      </Card>
    </div>
  )
}
