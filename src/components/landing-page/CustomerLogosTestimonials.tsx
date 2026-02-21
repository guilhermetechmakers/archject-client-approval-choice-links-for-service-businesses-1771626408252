import { Quote, MessageCircle, RefreshCw } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollReveal } from './ScrollReveal'
import { cn } from '@/lib/utils'

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
}

export interface CustomerLogosTestimonialsProps {
  testimonials?: Testimonial[]
  logos?: string[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

const defaultTestimonials: Testimonial[] = [
  {
    quote:
      'Archject transformed how we handle client approvals. No more chasing emails—everything is timestamped and professional.',
    author: 'Sarah Chen',
    role: 'Principal, Acme Design',
    company: 'Acme Design',
  },
  {
    quote:
      'The branded links make us look polished. Clients love the clear interface and we love the audit trail.',
    author: 'Marcus Webb',
    role: 'Creative Director, Studio XYZ',
    company: 'Studio XYZ',
  },
  {
    quote:
      'We switched from spreadsheets to Archject and cut approval time in half. The export to PDF is a lifesaver.',
    author: 'Elena Rodriguez',
    role: 'Project Manager, Build Co',
    company: 'Build Co',
  },
]

const defaultLogos = ['Acme Design', 'Studio XYZ', 'Build Co', 'Design Studio', 'Architects Plus']

function TestimonialsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </div>
  )
}

function EmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="mx-auto max-w-2xl border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <MessageCircle className="h-8 w-8" aria-hidden />
        </div>
        <h3 className="text-h2 font-semibold text-foreground">No testimonials yet</h3>
        <p className="mt-2 max-w-sm text-body text-muted-foreground">
          Customer stories will appear here once they&apos;re available.
        </p>
        {onRetry && (
          <Button variant="outline" className="mt-6" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="mx-auto max-w-2xl border-destructive/30">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <RefreshCw className="h-8 w-8" aria-hidden />
        </div>
        <h3 className="text-h2 font-semibold text-foreground">Failed to load testimonials</h3>
        <p className="mt-2 max-w-sm text-body text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        {onRetry && (
          <Button className="mt-6" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function CustomerLogosTestimonials({
  testimonials = defaultTestimonials,
  logos = defaultLogos,
  isLoading = false,
  isError = false,
  onRetry,
}: CustomerLogosTestimonialsProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const hasTestimonials = testimonials.length > 0
  const hasLogos = logos.length > 0

  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 bg-card scroll-mt-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2
            id="testimonials-heading"
            className="text-h1 font-bold text-foreground"
          >
            Trusted by teams
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Architects, designers, and agencies use Archject every day
          </p>
        </ScrollReveal>

        {/* Customer logos */}
        {hasLogos && (
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            {logos.map((name) => (
              <div
                key={name}
                className="flex h-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-4 py-3 md:px-6 bg-muted border border-border text-muted-foreground font-medium text-caption transition-all duration-300 hover:border-primary/30 hover:text-foreground hover:shadow-card"
              >
                {name}
              </div>
            ))}
          </div>
        )}

        {/* Testimonials carousel */}
        <div
          className="mt-12 md:mt-16"
          role="region"
          aria-roledescription="Testimonials carousel"
          aria-label="Customer testimonials"
        >
          {isLoading ? (
            <TestimonialsSkeleton />
          ) : isError ? (
            <ErrorState onRetry={onRetry} />
          ) : !hasTestimonials ? (
            <EmptyState onRetry={onRetry} />
          ) : (
            <>
              <Carousel
                setApi={setApi}
                opts={{ align: 'center', loop: true }}
                plugins={[plugin.current]}
                className="mx-auto max-w-2xl"
              >
                <CarouselContent className="-ml-0">
                  {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.author} className="pl-0">
                      <Card className="relative overflow-hidden rounded-2xl border-border bg-background shadow-card transition-all duration-300 hover:shadow-popover hover:-translate-y-0.5">
                        <CardContent className="relative p-6 md:p-8">
                          <Quote
                            className="absolute -top-2 left-6 h-10 w-10 text-primary/20"
                            aria-hidden
                          />
                          <blockquote className="relative text-body-l text-foreground/90 italic">
                            &ldquo;{testimonial.quote}&rdquo;
                          </blockquote>
                          <footer className="mt-6 flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                              {testimonial.author.charAt(0)}
                            </div>
                            <div>
                              <cite className="font-semibold not-italic text-foreground">
                                {testimonial.author}
                              </cite>
                              <p className="text-caption text-muted-foreground">
                                {testimonial.role}
                              </p>
                            </div>
                          </footer>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Carousel indicators */}
              <div
                className="mt-8 flex justify-center gap-2"
                role="tablist"
                aria-label="Testimonial navigation"
              >
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => api?.scrollTo(i)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full p-2 transition-colors duration-300 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-selected={i === current}
                    role="tab"
                  >
                    <span
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        i === current
                          ? 'w-8 bg-primary'
                          : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      )}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
