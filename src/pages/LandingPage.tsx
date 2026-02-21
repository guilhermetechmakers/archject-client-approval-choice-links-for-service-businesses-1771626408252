import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LandingHeader } from '@/components/layout/landing-header'
import {
  HeroSection,
  FeaturesOverview,
  HowItWorks,
  PricingTeaser,
  CustomerLogosTestimonials,
  Footer,
} from '@/components/landing-page'
import { useLandingPage } from '@/hooks/use-landing-page'
import { AlertCircle, Home } from 'lucide-react'

const SEO = {
  title: 'Archject — Client Approval & Choice Links for Service Businesses',
  description:
    'Replace clunky email threads with branded, auditable choice links. Get timestamped, legally robust client decisions with minimal friction.',
}

function LandingPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background" aria-busy="true" aria-label="Loading page">
      <div className="h-16 border-b border-border">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <main className="flex-1" role="main">
        <section className="py-24 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-4">
              <Skeleton className="h-12 rounded-lg w-3/4 mx-auto skeleton-shimmer" />
              <Skeleton className="h-4 rounded w-full max-w-xl mx-auto skeleton-shimmer" />
              <Skeleton className="h-4 rounded w-full max-w-2xl mx-auto skeleton-shimmer" />
              <div className="flex justify-center gap-4 mt-8">
                <Skeleton className="h-12 w-32 rounded-lg skeleton-shimmer" />
                <Skeleton className="h-12 w-32 rounded-lg skeleton-shimmer" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-12 w-12 rounded-lg skeleton-shimmer" />
                    <Skeleton className="h-5 rounded w-2/3 skeleton-shimmer" />
                    <Skeleton className="h-4 rounded w-full skeleton-shimmer" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <div className="h-64 border-t border-border">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    </div>
  )
}

function LandingPageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-6" role="main">
        <Card
          className="max-w-md w-full border-border bg-card shadow-modal"
          role="alert"
          aria-live="assertive"
          aria-labelledby="landing-error-heading"
          aria-describedby="landing-error-description"
        >
          <CardContent className="flex flex-col items-center text-center py-12">
            <div
              className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4"
              aria-hidden
            >
              <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
            </div>
            <h2 id="landing-error-heading" className="text-h1 font-bold text-foreground">
              Something went wrong
            </h2>
            <p
              id="landing-error-description"
              className="mt-2 text-body text-muted-foreground"
            >
              We couldn&apos;t load the page. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={onRetry}
                className="min-h-[44px] min-w-[44px]"
                aria-label="Retry loading the page"
              >
                Try again
              </Button>
              <Button asChild variant="outline" className="min-h-[44px] min-w-[44px]">
                <Link to="/" aria-label="Go to home page">
                  <Home className="mr-2 h-4 w-4" aria-hidden />
                  Go home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export function LandingPage() {
  const { isLoading, isError, refetch } = useLandingPage()
  const location = useLocation()

  useEffect(() => {
    document.title = SEO.title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', SEO.description)
  }, [])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location.hash])

  if (isLoading) {
    return <LandingPageSkeleton />
  }

  if (isError) {
    return <LandingPageError onRetry={() => refetch()} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="skip-link focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      <LandingHeader />
      <main id="main-content" className="flex-1" role="main">
        <HeroSection />
        <FeaturesOverview />
        <HowItWorks />
        <PricingTeaser />
        <CustomerLogosTestimonials />

        {/* CTA Section */}
        <section
          className="py-24"
          aria-labelledby="cta-heading"
        >
          <div className="container">
            <Card className="mx-auto max-w-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:shadow-modal hover:-translate-y-0.5">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <h2 id="cta-heading" className="text-h1 font-bold text-foreground">
                  Ready to get started?
                </h2>
                <p className="mt-4 text-body text-muted-foreground">
                  Create your free account and send your first approval link today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-[44px] hover:scale-[1.02] transition-transform duration-200"
                  >
                    <Link to="/signup" aria-label="Sign up for free account">
                      Sign up free
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-h-[44px] hover:scale-[1.02] transition-transform duration-200"
                  >
                    <Link to="/request-demo" aria-label="Request a product demo">
                      Request demo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
