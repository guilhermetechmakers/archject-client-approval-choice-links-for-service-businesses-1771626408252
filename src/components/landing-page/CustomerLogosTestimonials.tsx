import { Quote } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ScrollReveal } from './ScrollReveal'

const testimonials = [
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

const logos = ['Acme Design', 'Studio XYZ', 'Build Co', 'Design Studio', 'Architects Plus']

export function CustomerLogosTestimonials() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <section className="py-24 bg-card">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h1 font-bold">Trusted by teams</h2>
          <p className="mt-4 text-body text-muted-foreground">
            Architects, designers, and agencies use Archject every day
          </p>
        </ScrollReveal>

        {/* Customer logos */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12">
          {logos.map((name) => (
            <div
              key={name}
              className="flex h-12 items-center justify-center rounded-lg px-6 py-3 bg-background/50 border border-border text-muted-foreground font-medium text-caption transition-all duration-300 hover:border-primary/30 hover:text-foreground"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Testimonials carousel */}
        <div
          className="mt-16"
          role="region"
          aria-roledescription="Testimonials carousel"
          aria-label="Customer testimonials"
        >
          <Carousel
            setApi={setApi}
            opts={{ align: 'center', loop: true }}
            plugins={[plugin.current]}
            className="mx-auto max-w-2xl"
          >
            <CarouselContent className="-ml-0">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.author} className="pl-0">
                  <div className="relative rounded-2xl border border-border bg-background p-8 shadow-card">
                    <Quote className="absolute -top-2 left-6 h-10 w-10 text-primary/20" />
                    <blockquote className="relative text-body-l text-foreground/90 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <footer className="mt-6 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <cite className="font-semibold not-italic">{testimonial.author}</cite>
                        <p className="text-caption text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </footer>
                  </div>
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
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full p-2 transition-colors duration-300 hover:bg-muted-foreground/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-selected={i === current}
                role="tab"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
