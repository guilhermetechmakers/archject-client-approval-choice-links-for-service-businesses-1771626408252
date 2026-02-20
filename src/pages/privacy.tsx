import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 container py-16">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <h1 className="text-h1 font-bold">Privacy Policy</h1>
          <p className="text-body text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-h2 font-semibold mt-12">1. Information We Collect</h2>
          <p className="text-body">
            We collect information you provide directly, including account
            details, approval data, and communication records.
          </p>

          <h2 className="text-h2 font-semibold mt-8">2. How We Use Your Information</h2>
          <p className="text-body">
            We use your information to provide our services, improve the
            platform, and communicate with you.
          </p>

          <h2 className="text-h2 font-semibold mt-8">3. Data Security</h2>
          <p className="text-body">
            We implement industry-standard security measures to protect your
            data.
          </p>

          <h2 className="text-h2 font-semibold mt-8">4. Contact</h2>
          <p className="text-body">
            For privacy-related inquiries, contact us at privacy@archject.com.
          </p>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
