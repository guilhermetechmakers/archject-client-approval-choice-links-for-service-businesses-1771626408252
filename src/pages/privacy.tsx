import { LandingHeader } from '@/components/layout/landing-header'
import { LandingFooter } from '@/components/layout/landing-footer'
import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />
      <main
        className="flex-1 container py-8 md:py-16"
        role="main"
        aria-label="Privacy Policy"
      >
        <div className="mx-auto max-w-3xl">
          {/* Page header with icon */}
          <header className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
                  'bg-primary/10 text-primary'
                )}
                aria-hidden
              >
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                Privacy Policy
              </h1>
            </div>
            <p className="text-body text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </header>

          <Card className="overflow-hidden border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-popover">
            <CardContent className="p-6 md:p-8">
              <article
                className={cn(
                  'prose prose-archject max-w-none',
                  'prose-headings:text-foreground prose-p:text-foreground',
                  'prose-a:text-primary prose-a:no-underline hover:prose-a:underline'
                )}
              >
                {/* Section 1 - h2 with h3 subsections for proper hierarchy */}
                <section aria-labelledby="info-collect">
                  <h2
                    id="info-collect"
                    className="text-h2 font-semibold text-foreground mt-0 mb-4 scroll-mt-24"
                  >
                    1. Information We Collect
                  </h2>
                  <h3 className="text-h3 font-medium text-foreground mt-6 mb-2">
                    1.1 Personal Information
                  </h3>
                  <p className="text-body text-foreground">
                    We collect information you provide directly, including
                    account details, approval data, and communication records.
                  </p>
                  <h3 className="text-h3 font-medium text-foreground mt-6 mb-2">
                    1.2 Usage Data
                  </h3>
                  <p className="text-body text-foreground">
                    We automatically collect usage data such as how you interact
                    with our platform to improve our services.
                  </p>
                </section>

                {/* Section 2 - h2 with h3 subsections */}
                <section aria-labelledby="how-we-use" className="mt-12">
                  <h2
                    id="how-we-use"
                    className="text-h2 font-semibold text-foreground mt-0 mb-4 scroll-mt-24"
                  >
                    2. How We Use Your Information
                  </h2>
                  <h3 className="text-h3 font-medium text-foreground mt-6 mb-2">
                    2.1 Service Provision
                  </h3>
                  <p className="text-body text-foreground">
                    We use your information to provide our services and maintain
                    your account.
                  </p>
                  <h3 className="text-h3 font-medium text-foreground mt-6 mb-2">
                    2.2 Platform Improvement
                  </h3>
                  <p className="text-body text-foreground">
                    We analyze usage patterns to improve the platform and
                    communicate with you about updates.
                  </p>
                </section>

                {/* Section 3 */}
                <section aria-labelledby="data-security" className="mt-12">
                  <h2
                    id="data-security"
                    className="text-h2 font-semibold text-foreground mt-0 mb-4 scroll-mt-24"
                  >
                    3. Data Security
                  </h2>
                  <p className="text-body text-foreground">
                    We implement industry-standard security measures to protect
                    your data, including encryption and access controls.
                  </p>
                </section>

                {/* Section 4 */}
                <section aria-labelledby="contact" className="mt-12">
                  <h2
                    id="contact"
                    className="text-h2 font-semibold text-foreground mt-0 mb-4 scroll-mt-24"
                  >
                    4. Contact
                  </h2>
                  <p className="text-body text-foreground">
                    For privacy-related inquiries, contact us at{' '}
                    <a
                      href="mailto:privacy@archject.com"
                      className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    >
                      privacy@archject.com
                    </a>
                    .
                  </p>
                </section>
              </article>
            </CardContent>
          </Card>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
