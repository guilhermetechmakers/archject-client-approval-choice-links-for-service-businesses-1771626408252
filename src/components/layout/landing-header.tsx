import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-h2 font-bold text-primary">Archject</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/#features"
            className="text-body text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            to="/#how-it-works"
            className="text-body text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            to="/#pricing"
            className="text-body text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            to="/login"
            className="text-body text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Button asChild>
            <Link to="/signup">Sign up free</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
