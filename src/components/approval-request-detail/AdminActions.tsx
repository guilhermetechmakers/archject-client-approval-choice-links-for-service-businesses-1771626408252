import {
  Mail,
  Link2Off,
  Copy,
  FileText,
  Receipt,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AdminActionsProps {
  onSendReminder?: () => void
  onRevokeLink?: () => void
  onDuplicateRequest?: () => void
  onConvertToChangeOrder?: () => void
  onConvertToInvoice?: () => void
  isSendingReminder?: boolean
  isRevoking?: boolean
  isDuplicating?: boolean
  isRevoked?: boolean
  className?: string
}

export function AdminActions({
  onSendReminder,
  onRevokeLink,
  onDuplicateRequest,
  onConvertToChangeOrder,
  onConvertToInvoice,
  isSendingReminder = false,
  isRevoking = false,
  isDuplicating = false,
  isRevoked = false,
  className,
}: AdminActionsProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-popover hover:-translate-y-0.5',
        'border-l-4 border-l-primary/30',
        className
      )}
    >
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
        <CardDescription>
          Send reminder, revoke link, duplicate request, convert to change-order or invoice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {onSendReminder && (
            <Button
              variant="outline"
              onClick={onSendReminder}
              disabled={isSendingReminder || isRevoked}
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <Mail className="h-4 w-4" />
              {isSendingReminder ? 'Sending...' : 'Send Reminder'}
            </Button>
          )}
          {onRevokeLink && (
            <Button
              variant="outline"
              onClick={onRevokeLink}
              disabled={isRevoking || isRevoked}
              className={cn(
                'transition-all duration-200 hover:scale-[1.02] hover:shadow-md',
                isRevoked && 'opacity-50'
              )}
            >
              <Link2Off className="h-4 w-4" />
              {isRevoked ? 'Revoked' : isRevoking ? 'Revoking...' : 'Revoke Link'}
            </Button>
          )}
          {onDuplicateRequest && (
            <Button
              variant="outline"
              onClick={onDuplicateRequest}
              disabled={isDuplicating}
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <Copy className="h-4 w-4" />
              {isDuplicating ? 'Duplicating...' : 'Duplicate Request'}
            </Button>
          )}
          {(onConvertToChangeOrder || onConvertToInvoice) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                >
                  Convert
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {onConvertToChangeOrder && (
                  <DropdownMenuItem onClick={onConvertToChangeOrder}>
                    <FileText className="h-4 w-4" />
                    Change Order
                  </DropdownMenuItem>
                )}
                {onConvertToInvoice && (
                  <DropdownMenuItem onClick={onConvertToInvoice}>
                    <Receipt className="h-4 w-4" />
                    Invoice
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
