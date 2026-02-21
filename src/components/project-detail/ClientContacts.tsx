import { Mail, Phone, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ClientContact } from '@/types/project-detail'

const ICON_SIZE = {
  header: 'h-5 w-5',
  empty: 'h-10 w-10',
  inline: 'h-4 w-4',
} as const

interface ClientContactsProps {
  contacts: ClientContact[]
  isLoading?: boolean
  searchQuery?: string
  onAddContact?: () => void
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

function filterContacts(contacts: ClientContact[], searchQuery?: string): ClientContact[] {
  if (!searchQuery?.trim()) return contacts
  const q = searchQuery.trim().toLowerCase()
  return contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone?.toLowerCase().includes(q) ?? false)
  )
}

export function ClientContacts({
  contacts,
  isLoading,
  searchQuery,
  onAddContact,
}: ClientContactsProps) {
  const filteredContacts = filterContacts(contacts, searchQuery)

  if (isLoading) {
    return (
      <Card
        className="rounded-lg border-border bg-card shadow-card"
        role="status"
        aria-label="Loading client contacts"
      >
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded-md bg-muted" aria-hidden />
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted mt-2" aria-hidden />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-muted"
                aria-hidden
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!contacts.length && !searchQuery) {
    return (
      <Card
        className="rounded-lg border-border bg-card shadow-card"
        role="region"
        aria-labelledby="client-contacts-heading"
      >
        <CardHeader>
          <CardTitle
            id="client-contacts-heading"
            className="flex items-center gap-2"
          >
            <Users className={ICON_SIZE.header} aria-hidden />
            Client Contacts
          </CardTitle>
          <CardDescription>Contacts for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 px-4 text-center"
            role="status"
            aria-live="polite"
            aria-label="No contacts. Add client contacts to send approval requests and track responses."
          >
            <div className="rounded-full bg-muted p-4 mb-4">
              <Users className={cn(ICON_SIZE.empty, 'text-muted-foreground')} aria-hidden />
            </div>
            <h3 className="text-h3 font-medium text-foreground mb-1">No contacts</h3>
            <p className="text-body text-muted-foreground mb-6 max-w-sm">
              Add client contacts to send approval requests and track responses.
            </p>
            <Button
              variant="default"
              onClick={() => onAddContact?.()}
              className="rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Add your first client contact"
            >
              Add contact
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="rounded-lg border-border bg-card shadow-card"
      role="region"
      aria-labelledby="client-contacts-heading"
    >
      <CardHeader>
        <CardTitle
          id="client-contacts-heading"
          className="flex items-center gap-2"
        >
          <Users className={ICON_SIZE.header} aria-hidden />
          Client Contacts
        </CardTitle>
        <CardDescription>Contacts for this project</CardDescription>
      </CardHeader>
      <CardContent>
        {!filteredContacts.length && searchQuery ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 px-4 text-center"
            role="status"
            aria-live="polite"
            aria-label="No matching contacts. Try adjusting your search."
          >
            <div className="rounded-full bg-muted p-4 mb-4">
              <Users className={cn(ICON_SIZE.empty, 'text-muted-foreground')} aria-hidden />
            </div>
            <h3 className="text-h3 font-medium text-foreground mb-1">No matching contacts</h3>
            <p className="text-body text-muted-foreground max-w-sm">
              Try adjusting your search to find contacts.
            </p>
          </div>
        ) : (
          <ul className="space-y-4 list-none p-0 m-0" role="list">
            {filteredContacts.map((contact) => (
              <li key={contact.id}>
                <div
                  className="rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-popover hover:-translate-y-0.5"
                  role="article"
                  aria-label={`Contact: ${contact.name}, ${contact.email}${contact.phone ? `, ${contact.phone}` : ''}`}
                >
                  <p className="font-medium">{contact.name}</p>
                  <div className="mt-2 flex flex-col gap-1 text-caption text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Mail className={cn(ICON_SIZE.inline, 'shrink-0')} aria-hidden />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-2">
                        <Phone className={cn(ICON_SIZE.inline, 'shrink-0')} aria-hidden />
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
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
