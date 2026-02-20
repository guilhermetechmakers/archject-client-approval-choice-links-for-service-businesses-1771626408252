import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'

export function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 container py-16">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <h1 className="text-h1 font-bold">Cookie Policy</h1>
          <p className="text-body text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-h2 font-semibold mt-12">Cookie Categories</h2>
          <p className="text-body">
            We use essential cookies for authentication, preference cookies for
            settings, and analytics cookies to improve our service.
          </p>

          <h2 className="text-h2 font-semibold mt-8">Opt-out Controls</h2>
          <p className="text-body">
            You can manage cookie preferences in your browser settings or through
            our preference center.
          </p>

          <h2 className="text-h2 font-semibold mt-8">Contact</h2>
          <p className="text-body">
            For cookie-related inquiries, contact us at privacy@archject.com.
          </p>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
