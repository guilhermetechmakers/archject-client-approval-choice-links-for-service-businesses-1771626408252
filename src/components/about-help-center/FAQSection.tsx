import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FAQItem {
  id: string
  question: string
  answer: string
}

const defaultFaqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create an approval request?',
    answer:
      'Go to Dashboard → New Approval and follow the wizard. You can add options, media, set a deadline, and invite recipients. Once created, share the unique link with your clients.',
  },
  {
    id: '2',
    question: 'Can clients modify their selection?',
    answer:
      'Yes, until the deadline, if you enable that setting. You can toggle "Allow changes" when creating an approval request. After the deadline, selections are locked.',
  },
  {
    id: '3',
    question: 'How do I export approval records?',
    answer:
      'Go to Exports & Records in the dashboard and create a new export. You can filter by date range, project, or status. Exports are available in CSV and PDF formats.',
  },
  {
    id: '4',
    question: 'What happens if a client doesn\'t respond by the deadline?',
    answer:
      'You can send reminders from the approval detail page. If they still don\'t respond, the approval remains pending. You can extend the deadline or mark it as expired.',
  },
  {
    id: '5',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot password" on the login page, enter your email, and we\'ll send you a reset link. The link expires in 1 hour for security.',
  },
]

export function FAQSection({ items = defaultFaqs }: { items?: FAQItem[] }) {
  const faqs = items ?? defaultFaqs
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)
  const isEmpty = faqs.length === 0

  return (
    <Card className="border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
        <CardDescription className="text-muted-foreground">
          Common questions with collapsible answers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isEmpty ? (
          <div
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="rounded-full bg-muted p-4 mb-4">
              <HelpCircle className="h-12 w-12 text-muted-foreground" aria-hidden />
            </div>
            <h4 className="text-h3 font-semibold text-foreground mb-2">No FAQs yet</h4>
            <p className="text-body text-muted-foreground mb-6 max-w-sm">
              We&apos;re adding frequently asked questions. Contact support if you need help.
            </p>
            <Button
              asChild
              variant="default"
              size="lg"
              className="min-h-[44px] px-6"
              aria-label="Contact support for help"
            >
              <a href="#contact-support">Contact support</a>
            </Button>
          </div>
        ) : (
          faqs.map((faq) => (
            <Collapsible
              key={faq.id}
              open={openId === faq.id}
              onOpenChange={(open) => setOpenId(open ? faq.id : null)}
            >
              <div
                className={cn(
                  'rounded-lg border border-border transition-all duration-200',
                  openId === faq.id && 'border-primary/30 bg-primary/5'
                )}
              >
                <CollapsibleTrigger
                  className={cn(
                    'flex w-full items-center justify-between gap-4 px-4 py-3 text-left min-h-[44px]',
                    'hover:bg-accent/50 transition-colors rounded-lg',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  )}
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-trigger-${faq.id}`}
                >
                  <span className="text-body font-medium text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                      openId === faq.id && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </CollapsibleTrigger>
                <CollapsibleContent id={`faq-answer-${faq.id}`} aria-labelledby={`faq-trigger-${faq.id}`}>
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-caption text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}
      </CardContent>
    </Card>
  )
}
