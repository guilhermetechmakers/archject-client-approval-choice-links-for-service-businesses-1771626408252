import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <h2 className="text-h1 font-bold mt-4">Page not found</h2>
      <p className="text-body text-muted-foreground mt-2 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
      <div className="mt-12 w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>
    </div>
  )
}
