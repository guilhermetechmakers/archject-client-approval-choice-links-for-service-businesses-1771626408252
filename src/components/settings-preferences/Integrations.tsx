import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, HardDrive, CreditCard, Plug } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IntegrationItem {
  id: string
  name: string
  type: 'email' | 'storage' | 'payment'
  description: string
  connected: boolean
}

const INTEGRATIONS: IntegrationItem[] = [
  { id: '1', name: 'Email provider', type: 'email', description: 'SendGrid, Resend, or SMTP', connected: false },
  { id: '2', name: 'Cloud storage', type: 'storage', description: 'Google Drive, Dropbox, S3', connected: false },
  { id: '3', name: 'Payment gateways', type: 'payment', description: 'Stripe, PayPal', connected: false },
]

const typeIcons = {
  email: Mail,
  storage: HardDrive,
  payment: CreditCard,
}

export function Integrations() {
  return (
    <Card className="rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-primary" />
          Integrations
        </CardTitle>
        <CardDescription>
          Manage connected apps (email provider, storage, payment gateways)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {INTEGRATIONS.map((integration) => {
            const Icon = typeIcons[integration.type]
            return (
              <div
                key={integration.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4 transition-all',
                  'hover:shadow-md hover:border-primary/30'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-caption text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {integration.connected ? (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Not connected
                    </Badge>
                  )}
                  <Button
                    variant={integration.connected ? 'outline' : 'default'}
                    size="sm"
                    className="transition-all hover:scale-[1.02]"
                    aria-label={integration.connected ? `Configure ${integration.name}` : `Connect ${integration.name}`}
                  >
                    {integration.connected ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <Plug className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-h3 font-medium">Need another integration?</h3>
          <p className="text-body text-muted-foreground mt-2 max-w-sm mx-auto">
            Contact support to request integrations with your favorite tools.
          </p>
          <Button variant="outline" className="mt-4" aria-label="Request new integration from support">
            Request integration
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
