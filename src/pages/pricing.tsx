import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started',
    features: ['Up to 5 approvals/month', 'Branded links', 'Basic exports', 'Email support'],
    cta: 'Get started',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For growing teams',
    features: [
      'Unlimited approvals',
      'Templates',
      'PDF & CSV exports',
      'Priority support',
      'Custom branding',
    ],
    cta: 'Start free trial',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$79',
    period: '/mo',
    description: 'For agencies & studios',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Advanced custom branding',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact sales',
    href: '/demo',
    highlighted: false,
  },
]

export function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-h1 font-bold">Pricing</h1>
            <p className="mt-4 text-body text-muted-foreground">
              Simple, transparent pricing. Start free and scale as you grow.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative transition-all duration-300 hover:shadow-modal hover:-translate-y-1 ${
                  tier.highlighted
                    ? 'border-primary/50 shadow-lg ring-2 ring-primary/20'
                    : 'hover:border-primary/20'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-caption font-medium text-primary-foreground">
                    Most popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <h2 className="text-h2 font-semibold">{tier.name}</h2>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-muted-foreground">{tier.period}</span>
                    )}
                  </div>
                  <p className="text-caption text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-body">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={tier.highlighted ? 'default' : 'outline'}
                    className="w-full mt-6"
                  >
                    <Link to={tier.href}>{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}

export default PricingPage
