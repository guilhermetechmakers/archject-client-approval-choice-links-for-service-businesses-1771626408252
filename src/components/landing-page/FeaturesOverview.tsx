import { Link2, Clock, FileText, Download, type LucideIcon } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollReveal } from './ScrollReveal'
import { cn } from '@/lib/utils'

const features: {
  icon: LucideIcon
  title: string
  description: string
  bentoClass?: string
}[] = [
  {
    icon: Link2,
    title: 'Branded Links',
    description:
      'Send clients beautiful, branded approval links that reflect your business.',
    bentoClass: 'lg:col-span-2',
  },
  {
    icon: Clock,
    title: 'Time-stamped Approvals',
    description:
      'Every decision is timestamped and legally robust for audit trails.',
    bentoClass: 'lg:col-span-1',
  },
  {
    icon: FileText,
    title: 'Templates',
    description: 'Reusable approval templates to speed up your workflow.',
    bentoClass: 'lg:col-span-1',
  },
  {
    icon: Download,
    title: 'Exports',
    description: 'Export approval records to PDF or CSV for your records.',
    bentoClass: 'lg:col-span-2',
  },
]

export function FeaturesOverview() {
  return (
    <section
      id="features"
      className="py-24 scroll-mt-20"
      aria-labelledby="features-heading"
    >
      <div className="container">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 id="features-heading" className="text-h1 font-bold">
            Built for service businesses
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Everything you need to streamline client approvals
          </p>
        </ScrollReveal>

        {/* Bento-style asymmetric grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className={cn(
                'group transition-all duration-300',
                'hover:shadow-modal hover:-translate-y-1 hover:border-primary/20',
                'animate-fade-in-up',
                feature.bentoClass
              )}
              style={{
                animationDelay: `${i * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              <CardHeader className="h-full flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-h3">{feature.title}</CardTitle>
                <CardDescription className="flex-1">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
