import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  incidentId?: string
}

export function ErrorPage({ incidentId }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-8xl font-bold text-destructive">500</h1>
      <h2 className="text-h1 font-bold mt-4">Something went wrong</h2>
      <p className="text-body text-muted-foreground mt-2 text-center max-w-md">
        We&apos;re sorry, but something went wrong on our end. Please try again
        or contact support if the problem persists.
      </p>
      {incidentId && (
        <p className="text-caption text-muted-foreground mt-4">
          Incident ID: {incidentId}
        </p>
      )}
      <div className="mt-8 flex gap-4">
        <Button onClick={() => window.location.reload()}>Try again</Button>
        <Button variant="outline" asChild>
          <a href="/help">Contact support</a>
        </Button>
      </div>
    </div>
  )
}
