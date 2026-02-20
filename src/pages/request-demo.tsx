import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LandingHeader } from '@/components/layout/landing-header'
import { Footer } from '@/components/landing-page'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export function RequestDemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    if (!name?.trim() || !email?.trim()) {
      toast.error('Please fill in your name and email')
      return
    }

    setIsSubmitting(true)
    try {
      // Placeholder: In production, call Edge Function or API with formData
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
      toast.success('Demo request received! We\'ll be in touch soon.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 py-16 md:py-24">
        <div className="container max-w-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-body text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {submitted ? (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="flex flex-col items-center text-center py-16">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-h1 font-bold">Thanks for your interest!</h1>
                <p className="mt-4 text-body text-muted-foreground">
                  We&apos;ve received your demo request and will get back to you
                  within 24 hours.
                </p>
                <Button asChild className="mt-8">
                  <Link to="/">Return home</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-h1">Request a demo</CardTitle>
                <CardDescription>
                  Tell us about your team and we&apos;ll show you how Archject
                  can streamline your client approvals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      disabled={isSubmitting}
                      className="transition-all duration-200 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      disabled={isSubmitting}
                      className="transition-all duration-200 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (optional)</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Your company"
                      disabled={isSubmitting}
                      className="transition-all duration-200 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your approval workflow needs..."
                      rows={4}
                      disabled={isSubmitting}
                      className="transition-all duration-200 focus:border-primary resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Request demo'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default RequestDemoPage
