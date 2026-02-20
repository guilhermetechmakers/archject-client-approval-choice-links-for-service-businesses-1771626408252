import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#pricing', label: 'Pricing' },
]

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <span className="text-h2 font-bold text-primary">Archject</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-body text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="text-body text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Button asChild size="sm" className="hover:scale-[1.02] transition-transform">
            <Link to="/signup">Sign up free</Link>
          </Button>
        </nav>

        {/* Mobile: hamburger + drawer */}
        <div className="flex md:hidden items-center gap-2">
          <Button asChild size="sm">
            <Link to="/signup">Sign up</Link>
          </Button>
          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent
              showClose={false}
              className={cn(
                'fixed right-0 top-0 left-auto h-full w-[min(320px,85vw)] max-w-[85vw]',
                'rounded-none rounded-l-lg border-l border-border',
                'translate-x-0 translate-y-0'
              )}
            >
              <div className="flex flex-col h-full pt-16">
                <DialogTitle className="sr-only">Navigation menu</DialogTitle>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-body font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-body font-medium text-foreground hover:text-primary transition-colors py-2"
                  >
                    Log in
                  </Link>
                  <Button asChild className="mt-4">
                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                      Sign up free
                    </Link>
                  </Button>
                </nav>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
