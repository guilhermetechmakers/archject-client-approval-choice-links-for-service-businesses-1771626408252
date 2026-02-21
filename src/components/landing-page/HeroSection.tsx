import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="hero-heading"
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 opacity-90 hero-gradient-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgb(var(--primary)_/_0.15),transparent_50%)]" />
        {/* Morphing blob shapes */}
        <div
          className={cn(
            'absolute -top-1/2 -right-1/4 h-[600px] w-[600px] rounded-full',
            'bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl animate-blob-morph'
          )}
          style={{ animationDuration: '8s' }}
        />
        <div
          className={cn(
            'absolute -bottom-1/4 -left-1/4 h-[400px] w-[400px] rounded-full',
            'bg-gradient-to-tr from-primary/15 to-primary/5 blur-3xl animate-blob-morph'
          )}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full',
            'bg-primary/10 blur-3xl animate-float'
          )}
        />
      </div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up"
            style={{ animationFillMode: 'both' }}
          >
            Client approvals,{' '}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              simplified
            </span>
          </h1>
          <p
            className="mt-6 text-body-l text-muted-foreground max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            Replace clunky email threads with branded, auditable choice links. Get
            timestamped, legally robust client decisions with minimal friction.
          </p>
          <div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            <Button
              asChild
              size="lg"
              className={cn(
                'text-base h-12 px-8',
                'bg-gradient-to-r from-primary to-primary/90',
                'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
                'hover:scale-[1.03] active:scale-[0.98]',
                'transition-all duration-300'
              )}
            >
              <Link to="/signup" aria-label="Sign up for free account">
                Sign up free
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(
                'text-base h-12 px-8 border-2',
                'hover:border-primary/50 hover:bg-primary/5',
                'hover:scale-[1.03] active:scale-[0.98]',
                'transition-all duration-300'
              )}
            >
              <Link to="/request-demo" aria-label="Request a product demo">
                Request demo
              </Link>
            </Button>
          </div>

          {/* Hero image/video placeholder - decorative illustration */}
          <div
            className="mt-16 relative animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
            aria-hidden="true"
          >
            <div className="relative mx-auto max-w-4xl rounded-2xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-hero-card hover:-translate-y-0.5">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                <div className="text-center text-muted-foreground">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-4 transition-transform duration-300 hover:scale-110">
                    <Zap
                      className="h-8 w-8 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-caption">Approval workflow preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
