import { Link } from 'react-router-dom'
import { MoreVertical, Pencil, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { ProjectDetail } from '@/types/project-detail'

interface ProjectHeaderProps {
  project: ProjectDetail
  onEdit?: () => void
  onArchive?: () => void
  isArchiving?: boolean
}

export function ProjectHeader({
  project,
  onEdit,
  onArchive,
  isArchiving,
}: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <Link
          to="/dashboard/projects"
          className="text-caption text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to projects
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-h1 font-bold">{project.title}</h1>
          <Badge
            variant="secondary"
            className={cn(
              'rounded-full px-2.5 py-0.5 text-caption font-medium transition-colors',
              project.status === 'active' && 'bg-primary/10 text-primary',
              project.status === 'archived' && 'bg-muted text-muted-foreground',
              project.status === 'completed' && 'bg-success/10 text-success'
            )}
          >
            {project.status}
          </Badge>
        </div>
        {project.client_name && (
          <p className="text-body text-muted-foreground">{project.client_name}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Project actions">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              Edit project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onArchive}
              disabled={isArchiving || project.status === 'archived'}
              className="text-muted-foreground"
            >
              <Archive className="h-4 w-4" />
              {project.status === 'archived' ? 'Archived' : 'Archive project'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
