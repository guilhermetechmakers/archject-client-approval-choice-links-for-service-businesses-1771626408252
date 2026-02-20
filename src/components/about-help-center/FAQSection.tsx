import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Common questions with collapsible answers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((faq) => (
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
                  'flex w-full items-center justify-between gap-4 px-4 py-3 text-left',
                  'hover:bg-accent/50 transition-colors rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
              >
                <span className="text-body font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                    openId === faq.id && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-0">
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}
