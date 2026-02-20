import { Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
        <div className="mt-16 relative min-h-[200px]">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.author}
              className={`transition-all duration-500 ease-in-out ${
                i === activeIndex
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 absolute inset-x-0 top-0 translate-x-8 pointer-events-none'
              }`}
              aria-hidden={i !== activeIndex}
            >
              <div className="mx-auto max-w-2xl">
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
              </div>
            </div>
          ))}

          {/* Carousel indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
