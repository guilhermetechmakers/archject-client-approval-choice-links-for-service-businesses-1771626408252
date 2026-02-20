import { useState } from 'react'
import { Search, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'

const faqs = [
  { q: 'How do I create an approval request?', a: 'Go to Dashboard → New Approval and follow the wizard.' },
  { q: 'Can clients modify their selection?', a: 'Yes, until the deadline, if you enable that setting.' },
  { q: 'How do I export approval records?', a: 'Go to Exports & Records and create a new export.' },
]

export function HelpPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-h1 font-bold">Help Center</h1>
          <p className="text-body text-muted-foreground mt-4">
            Search our knowledge base or browse FAQs
          </p>
          <div className="relative mt-8 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                FAQ
              </CardTitle>
              <CardDescription>Frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-b border-border pb-4 last:border-0">
                  <p className="font-medium">{faq.q}</p>
                  <p className="text-caption text-muted-foreground mt-1">{faq.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Submit a support request</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground mb-4">
                Need help? Reach out to our support team.
              </p>
              <Button>Contact support</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
