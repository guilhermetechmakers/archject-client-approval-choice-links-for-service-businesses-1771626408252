import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navSections = [
  { hash: 'features', label: 'Features' },
  { hash: 'how-it-works', label: 'How it works' },
  { hash: 'pricing', label: 'Pricing' },
  { hash: 'testimonials', label: 'Testimonials' },
]

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const basePath = location.pathname === '/' ? '/' : location.pathname
  const hashLink = (hash: string) => `${basePath}#${hash}`

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container flex h-16 min-h-[44px] items-center justify-between">
        <h1 className="m-0 flex shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-h2 font-bold text-primary transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1 -m-1"
            aria-label="Archject home"
          >
            Archject
          </Link>
        </h1>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {navSections.map(({ hash, label }) => (
            <Link
              key={hash}
              to={hashLink(hash)}
              className="text-body text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md py-2 px-1 -mx-1"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            className="text-body text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md py-2 px-1 -mx-1"
          >
            Log in
          </Link>
          <Link
            to="/request-demo"
            className="text-body text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md py-2 px-1 -mx-1"
          >
            Request demo
          </Link>
          <Button
            asChild
            size="sm"
            className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            <Link to="/signup">Sign up free</Link>
          </Button>
        </nav>

        {/* Mobile: hamburger + drawer */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            asChild
            size="sm"
            className="min-h-[44px] min-w-[44px] hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Link to="/signup">Sign up</Link>
          </Button>
          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="min-h-[44px] min-w-[44px]"
              >
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
                <nav
                  className="flex flex-col gap-6"
                  aria-label="Mobile navigation"
                >
                  {navSections.map(({ hash, label }) => (
                    <Link
                      key={hash}
                      to={hashLink(hash)}
                      onClick={() => setMobileOpen(false)}
                      className="text-body font-medium text-foreground hover:text-primary transition-colors py-3 min-h-[44px] flex items-center"
                    >
                      {label}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-body font-medium text-foreground hover:text-primary transition-colors py-3 min-h-[44px] flex items-center"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/request-demo"
                    onClick={() => setMobileOpen(false)}
                    className="text-body font-medium text-foreground hover:text-primary transition-colors py-3 min-h-[44px] flex items-center"
                  >
                    Request demo
                  </Link>
                  <Button asChild className="mt-4 min-h-[44px]">
                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                      Sign up free
                    </Link>
                  </Button>
                </nav>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
