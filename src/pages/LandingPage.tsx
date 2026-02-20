import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { AlertCircle } from 'lucide-react'

function LandingPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 border-b border-border animate-pulse" />
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="h-12 bg-muted rounded-lg w-3/4 mx-auto animate-pulse" />
              <div className="h-4 bg-muted rounded w-full max-w-xl mx-auto animate-pulse" />
              <div className="h-4 bg-muted rounded w-full max-w-2xl mx-auto animate-pulse" />
              <div className="flex justify-center gap-4 mt-8">
                <div className="h-12 w-32 bg-muted rounded-lg animate-pulse" />
                <div className="h-12 w-32 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-muted mb-4" />
                    <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <div className="h-64 border-t border-border animate-pulse" />
    </div>
  )
}

function LandingPageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center text-center py-12">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-h1 font-bold">Something went wrong</h2>
            <p className="mt-2 text-body text-muted-foreground">
              We couldn&apos;t load the page. Please try again.
            </p>
            <Button onClick={onRetry} className="mt-6">
              Try again
            </Button>
            <Button asChild variant="outline" className="mt-3">
              <Link to="/">Go home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export function LandingPage() {
  const { isLoading, isError, refetch } = useLandingPage()

  if (isLoading) {
    return <LandingPageSkeleton />
  }

  if (isError) {
    return <LandingPageError onRetry={() => refetch()} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesOverview />
        <HowItWorks />
        <PricingTeaser />
        <CustomerLogosTestimonials />

        {/* CTA Section */}
        <section className="py-24">
          <div className="container">
            <Card className="mx-auto max-w-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:shadow-modal hover:-translate-y-0.5">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <h2 className="text-h1 font-bold">Ready to get started?</h2>
                <p className="mt-4 text-body text-muted-foreground">
                  Create your free account and send your first approval link today.
                </p>
                <Button asChild size="lg" className="mt-8 hover:scale-[1.02] transition-transform">
                  <Link to="/signup">Sign up free</Link>
                </Button>
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
