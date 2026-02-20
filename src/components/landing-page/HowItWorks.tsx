import { PenLine, Send, FileCheck, ArrowRight } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { cn } from '@/lib/utils'

const steps = [
  {
    step: 1,
    icon: PenLine,
    title: 'Create',
    description:
      'Build your approval request with options, media, and settings.',
  },
  {
    step: 2,
    icon: Send,
    title: 'Send',
    description: 'Share a branded link via email or copy to clipboard.',
  },
  {
    step: 3,
    icon: FileCheck,
    title: 'Record',
    description: 'Get timestamped decisions with full audit trail.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-card scroll-mt-20">
      <div className="container">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h1 font-bold">How it works</h2>
          <p className="mt-4 text-body text-muted-foreground">
            Three simple steps to get client approvals
          </p>
        </ScrollReveal>

        <div className="mt-16 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-4">
          {steps.map((item, i) => (
            <div key={item.step} className="flex items-center">
              <div
                className={cn(
                  'relative flex flex-col items-center text-center',
                  'animate-fade-in-up'
                )}
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-2xl',
                    'bg-primary text-primary-foreground shadow-lg',
                    'transition-all duration-300 hover:scale-105 hover:shadow-xl'
                  )}
                >
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-h2 font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mt-4 text-h3 font-medium">{item.title}</h3>
                <p className="mt-2 text-body text-muted-foreground max-w-xs">
                  {item.description}
                </p>
              </div>
              {item.step < 3 && (
                <div className="hidden md:flex mx-2 lg:mx-4 flex-shrink-0 text-primary/50" aria-hidden>
                  <ArrowRight className="h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
