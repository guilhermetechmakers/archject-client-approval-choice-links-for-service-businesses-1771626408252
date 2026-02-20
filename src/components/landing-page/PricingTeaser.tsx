import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollReveal } from './ScrollReveal'

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started',
    features: ['Up to 5 approvals/month', 'Branded links', 'Basic exports'],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For growing teams',
    features: ['Unlimited approvals', 'Templates', 'PDF & CSV exports', 'Priority support'],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$79',
    period: '/mo',
    description: 'For agencies & studios',
    features: ['Everything in Pro', 'Team collaboration', 'Custom branding', 'API access'],
    cta: 'Contact sales',
    highlighted: false,
  },
]

export function PricingTeaser() {
  return (
    <section id="pricing" className="py-24 scroll-mt-20">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h1 font-bold">Simple pricing</h2>
          <p className="mt-4 text-body text-muted-foreground">
            Start free, scale as you grow
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <Card
              key={tier.name}
              className={`relative transition-all duration-300 hover:shadow-modal hover:-translate-y-1 ${
                tier.highlighted
                  ? 'border-primary/50 shadow-lg ring-2 ring-primary/20'
                  : 'hover:border-primary/20'
              } animate-fade-in-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-caption font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <h3 className="text-h2 font-semibold">{tier.name}</h3>
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
                  <Link to="/pricing">{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/pricing">View full pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
