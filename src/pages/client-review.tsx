import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const mockOptions = [
  { id: '1', title: 'Option A', description: 'Modern white cabinets', cost: '$2,500' },
  { id: '2', title: 'Option B', description: 'Classic wood finish', cost: '$3,200' },
  { id: '3', title: 'Option C', description: 'Custom design', cost: '$4,000' },
]

export function ClientReviewPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-card">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-h1 font-bold mt-4">Thank you!</h1>
            <p className="text-body text-muted-foreground mt-2">
              Your approval has been recorded with a timestamp. You can download
              your receipt below.
            </p>
            <Button className="mt-6">Download receipt</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card py-6">
        <div className="container">
          <h1 className="text-h2 font-bold text-primary">Archject</h1>
          <p className="text-caption text-muted-foreground mt-1">
            Kitchen Renovation • Cabinet Selection
          </p>
        </div>
      </header>

      <main className="container py-12">
        <div className="flex items-center gap-2 text-caption text-muted-foreground mb-8">
          <Clock className="h-4 w-4" />
          Deadline: Feb 25, 2025
        </div>

        <p className="text-body mb-8">
          Please select your preferred cabinet option below and confirm your
          choice.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-300 ${
                selected === option.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:shadow-popover'
              }`}
              onClick={() => setSelected(option.id)}
            >
              <CardHeader>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
                <p className="text-body font-medium text-primary">{option.cost}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-body">
              I confirm my selection and consent to this approval.
            </span>
          </label>
          <Button
            size="lg"
            disabled={!selected}
            onClick={() => setConfirmed(true)}
          >
            Confirm approval
          </Button>
        </div>
      </main>
    </div>
  )
}
