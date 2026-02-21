import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { HelpCircle, ArrowLeft, AlertCircle, RotateCcw, Home } from 'lucide-react'
import { toast } from 'sonner'
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
import type { KnowledgeArticle } from '@/components/about-help-center/SearchableKnowledgeBase'
import type { FAQItem } from '@/components/about-help-center/FAQSection'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

function HelpCenterSkeleton() {
  return (
    <main className="flex-1 container py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
          <Skeleton className="h-12 w-full max-w-md rounded-md" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  )
}

export interface HelpCenterData {
  articles: KnowledgeArticle[]
  faqs: FAQItem[]
}

async function fetchHelpCenterData(): Promise<HelpCenterData> {
  // Replace with apiGet<HelpCenterData>('/help-center') when backend is ready
  return Promise.resolve({ articles: [], faqs: [] })
}

export default function HelpCenterPage() {
  useEffect(() => {
    document.title = 'Help Center | Archject — Client Approval & Choice Links'
    return () => {
      document.title = 'Archject — Client Approval & Choice Links'
    }
  }, [])

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['help-center'],
    queryFn: fetchHelpCenterData,
    staleTime: 5 * 60 * 1000,
  })

  const handleRetry = () => {
    refetch().catch(() => {
      toast.error('Failed to load help center. Please try again.')
    })
  }

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
    const errorMessage =
      error instanceof Error ? error.message : 'We couldn\'t load the help center. Please try again.'
    return (
      <div className="min-h-screen flex flex-col">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-border shadow-card">
            <CardContent className="flex flex-col items-center text-center py-12 px-6">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-4"
                aria-hidden
              >
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-h1 font-bold text-foreground">Something went wrong</h2>
              <p className="mt-2 text-body text-muted-foreground" role="alert">
                {errorMessage}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleRetry}
                  disabled={isRefetching}
                  className="min-h-[44px] gap-2"
                  aria-label={isRefetching ? 'Retrying...' : 'Try again'}
                >
                  <RotateCcw className="h-4 w-4" />
                  {isRefetching ? 'Retrying...' : 'Try again'}
                </Button>
                <Button asChild variant="outline" className="min-h-[44px] gap-2" aria-label="Go to home page">
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    Go home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <LandingFooter />
      </div>
    )
  }

  const articles = data?.articles ?? []
  const faqs = data?.faqs ?? []

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
                className="inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                aria-label="Back to home page"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
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
                className="inline-flex items-center gap-2 text-caption text-primary hover:underline mt-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                aria-label="Reset your password"
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
              <SearchableKnowledgeBase articles={articles} />
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <FAQSection items={faqs} />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div id="contact-support">
                <ContactSupportForm />
              </div>
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
