import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const plans = [
  { id: 'free', name: 'Free', price: '$0', features: ['5 approvals/month', 'Basic templates'] },
  { id: 'pro', name: 'Pro', price: '$29/mo', features: ['Unlimited approvals', 'All templates', 'Priority support'] },
  { id: 'team', name: 'Team', price: '$99/mo', features: ['Everything in Pro', 'Team collaboration', 'API access'] },
]

export function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-6">
        <div className="container">
          <Link to="/" className="text-h2 font-bold text-primary">
            Archject
          </Link>
        </div>
      </header>

      <main className="flex-1 container py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-h1 font-bold text-center">Checkout</h1>
          <p className="text-body text-muted-foreground text-center mt-2">
            Select your plan and complete payment
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-h3 font-medium mb-4">Plan Selector</h2>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all ${
                      selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-h2 font-bold">{plan.price}</p>
                        <ul className="mt-2 space-y-1 text-caption text-muted-foreground">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {selectedPlan === plan.id && (
                        <Check className="h-6 w-6 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Billing & Payment</CardTitle>
                <CardDescription>Enter your payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card">Card number</Label>
                  <Input id="card" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exp">Expiry</Label>
                    <Input id="exp" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo">Promo code</Label>
                  <Input id="promo" placeholder="Enter code" />
                </div>
                <Button className="w-full" size="lg">
                  Complete order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
