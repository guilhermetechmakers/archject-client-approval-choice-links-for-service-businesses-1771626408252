import { Mail, Phone, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ClientContact } from '@/types/project-detail'

interface ClientContactsProps {
  contacts: ClientContact[]
  isLoading?: boolean
}

function formatLastResponse(dateStr?: string) {
  if (!dateStr) return 'No response yet'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export function ClientContacts({ contacts, isLoading }: ClientContactsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!contacts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Client Contacts
          </CardTitle>
          <CardDescription>Contacts for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-h3 font-medium mb-1">No contacts</h3>
            <p className="text-body text-muted-foreground max-w-sm">
              Add client contacts to send approval requests and track responses.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Client Contacts
        </CardTitle>
        <CardDescription>Contacts for this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-popover"
            >
              <p className="font-medium">{contact.name}</p>
              <div className="mt-2 flex flex-col gap-1 text-caption text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {contact.email}
                </span>
                {contact.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {contact.phone}
                  </span>
                )}
                <span
                  className={cn(
                    'mt-1',
                    contact.last_response_at ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  Last response: {formatLastResponse(contact.last_response_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
