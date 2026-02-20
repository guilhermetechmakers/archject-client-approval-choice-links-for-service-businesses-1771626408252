import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { HelpCircle, ArrowLeft } from 'lucide-react'
import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'
import { ScrollReveal } from '@/components/landing-page/ScrollReveal'
import {
  SearchableKnowledgeBase,
  FAQSection,
  ContactSupportForm,
  ChangelogRoadmap,
  LiveChatBot,
} from '@/components/about-help-center'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

function HelpCenterSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 border-b border-border" />
      <main className="flex-1 container py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-12 w-full max-w-md" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </main>
    </div>
  )
}

function fetchHelpCenterData() {
  return Promise.resolve({
    articles: [],
    faqs: [],
  })
}

export default function HelpCenterPage() {
  useEffect(() => {
    document.title = 'Help Center | Archject — Client Approval & Choice Links'
    return () => {
      document.title = 'Archject — Client Approval & Choice Links'
    }
  }, [])

  const { isLoading, isError, refetch } = useQuery({
    queryKey: ['help-center'],
    queryFn: fetchHelpCenterData,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingHeader />
        <HelpCenterSkeleton />
        <LandingFooter />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center text-center py-12">
              <h2 className="text-h1 font-bold">Something went wrong</h2>
              <p className="mt-2 text-body text-muted-foreground">
                We couldn&apos;t load the help center. Please try again.
              </p>
              <Button onClick={() => refetch()} className="mt-6">
                Try again
              </Button>
              <Button asChild variant="outline" className="mt-3">
                <Link to="/">Go home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <LandingFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24 hero-gradient-bg">
          <div className="container relative">
            <ScrollReveal>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HelpCircle className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-h1 font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    Help Center
                  </h1>
                  <p className="text-body text-muted-foreground mt-1">
                    Documentation, onboarding guides, FAQs, and support
                  </p>
                </div>
              </div>
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-2 text-caption text-primary hover:underline mt-4"
              >
                Forgot your password? Reset it here
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Content */}
        <section className="container py-12 md:py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            <ScrollReveal delay={100}>
              <SearchableKnowledgeBase />
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <FAQSection />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <ContactSupportForm />
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <ChangelogRoadmap />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <LandingFooter />
      <LiveChatBot />
    </div>
  )
}
