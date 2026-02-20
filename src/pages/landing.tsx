import { Link } from 'react-router-dom'
import { Check, Link2, Clock, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'

const features = [
  {
    icon: Link2,
    title: 'Branded Links',
    description: 'Send clients beautiful, branded approval links that reflect your business.',
  },
  {
    icon: Clock,
    title: 'Time-stamped Approvals',
    description: 'Every decision is timestamped and legally robust for audit trails.',
  },
  {
    icon: FileText,
    title: 'Templates',
    description: 'Reusable approval templates to speed up your workflow.',
  },
  {
    icon: Download,
    title: 'Exports',
    description: 'Export approval records to PDF or CSV for your records.',
  },
]

const steps = [
  { step: 1, title: 'Create', description: 'Build your approval request with options, media, and settings.' },
  { step: 2, title: 'Send', description: 'Share a branded link via email or copy to clipboard.' },
  { step: 3, title: 'Record', description: 'Get timestamped decisions with full audit trail.' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Client approvals,{' '}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  simplified
                </span>
              </h1>
              <p className="mt-6 text-body-l text-muted-foreground">
                Replace clunky email threads with branded, auditable choice links. Get timestamped,
                legally robust client decisions with minimal friction.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="text-base">
                  <Link to="/signup">Sign up free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/demo">Request demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Bento Grid */}
        <section id="features" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h1 font-bold">Built for service businesses</h2>
              <p className="mt-4 text-body text-muted-foreground">
                Everything you need to streamline client approvals
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <Card
                  key={feature.title}
                  className="animate-fade-in-up transition-all duration-300 hover:shadow-modal"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-h3">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-card">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h1 font-bold">How it works</h2>
              <p className="mt-4 text-body text-muted-foreground">
                Three simple steps to get client approvals
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-h2 font-bold">
                      {item.step}
                    </div>
                    <h3 className="mt-4 text-h3 font-medium">{item.title}</h3>
                    <p className="mt-2 text-body text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  {item.step < 3 && (
                    <div className="absolute right-0 top-7 hidden h-0.5 w-full bg-border md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section id="pricing" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h1 font-bold">Simple pricing</h2>
              <p className="mt-4 text-body text-muted-foreground">
                Start free, scale as you grow
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials placeholder */}
        <section className="py-24 bg-card">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h1 font-bold">Trusted by teams</h2>
              <p className="mt-4 text-body text-muted-foreground">
                Architects, designers, and agencies use Archject every day
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-muted-foreground">
                {['Acme Design', 'Studio XYZ', 'Build Co'].map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container">
            <Card className="mx-auto max-w-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <h2 className="text-h1 font-bold">Ready to get started?</h2>
                <p className="mt-4 text-body text-muted-foreground">
                  Create your free account and send your first approval link today.
                </p>
                <Button asChild size="lg" className="mt-8">
                  <Link to="/signup">Sign up free</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
