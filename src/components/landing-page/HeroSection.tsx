import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--primary),0.15),transparent)]" />
        <div
          className="absolute -top-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
      </div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
            Client approvals,{' '}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              simplified
            </span>
          </h1>
          <p className="mt-6 text-body-l text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Replace clunky email threads with branded, auditable choice links. Get timestamped,
            legally robust client decisions with minimal friction.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Button
              asChild
              size="lg"
              className="text-base h-12 px-8 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/signup">Sign up free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base h-12 px-8 border-2 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/demo">Request demo</Link>
            </Button>
          </div>

          {/* Hero image/video placeholder - decorative illustration */}
          <div className="mt-16 relative animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative mx-auto max-w-4xl rounded-2xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-sm overflow-hidden">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-4">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
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
