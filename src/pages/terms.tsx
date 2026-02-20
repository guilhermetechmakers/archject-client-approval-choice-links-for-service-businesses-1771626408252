import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 container py-16">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <h1 className="text-h1 font-bold">Terms of Service</h1>
          <p className="text-body text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-h2 font-semibold mt-12">1. Acceptance</h2>
          <p className="text-body">
            By using Archject, you agree to these terms. If you do not agree,
            do not use our services.
          </p>

          <h2 className="text-h2 font-semibold mt-8">2. Service Description</h2>
          <p className="text-body">
            Archject provides client approval and choice link services for
            service businesses.
          </p>

          <h2 className="text-h2 font-semibold mt-8">3. User Responsibilities</h2>
          <p className="text-body">
            You are responsible for the accuracy of data you provide and for
            complying with applicable laws.
          </p>

          <h2 className="text-h2 font-semibold mt-8">4. Contact</h2>
          <p className="text-body">
            For terms-related inquiries, contact us at legal@archject.com.
          </p>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
