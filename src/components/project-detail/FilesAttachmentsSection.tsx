import { FileText, Image, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProjectFile } from '@/types/project-detail'

interface FilesAttachmentsSectionProps {
  files: ProjectFile[]
  isLoading?: boolean
  onUpload?: () => void
}

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FilesAttachmentsSection({
  files,
  isLoading,
  onUpload,
}: FilesAttachmentsSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Files & Attachments
            </CardTitle>
            <CardDescription>Upload, previews, and versioning</CardDescription>
          </div>
          <Button size="sm" onClick={onUpload}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!files.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-h3 font-medium mb-1">No files yet</h3>
            <p className="text-body text-muted-foreground mb-4 max-w-sm">
              Upload floor plans, images, or documents for client review.
            </p>
            <Button onClick={onUpload}>
              <Upload className="h-4 w-4" />
              Upload file
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => {
              const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-popover"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {isImage ? (
                      <Image className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-caption text-muted-foreground">
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      {file.version && (
                        <span className={cn(file.version > 1 && 'text-primary')}>
                          v{file.version}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
