import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CreateApprovalCTAProps {
  projectId: string
  className?: string
}

export function CreateApprovalCTA({ projectId, className }: CreateApprovalCTAProps) {
  const createUrl = `/dashboard/approvals/new?project=${projectId}`

  return (
    <Button asChild className={cn('transition-all duration-200 hover:scale-[1.02]', className)}>
      <Link to={createUrl}>
        <Plus className="h-5 w-5" />
        Create Approval Request
      </Link>
    </Button>
  )
}
