import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Download, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TemplateLibraryProps {
  templateIds?: string[]
  onImport?: (file: File) => void
  onExport?: () => void
  onCreateDefault?: () => void
}

const MOCK_TEMPLATES = [
  { id: '1', name: 'Standard Approval', description: 'Default approval template', created_at: new Date().toISOString() },
  { id: '2', name: 'Design Review', description: 'For design feedback workflows', created_at: new Date().toISOString() },
  { id: '3', name: 'Contract Sign-off', description: 'Legal document approval', created_at: new Date().toISOString() },
]

export function TemplateLibrary({
  onImport,
  onExport,
  onCreateDefault,
}: TemplateLibraryProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const templates = MOCK_TEMPLATES

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/json' && onImport) {
      onImport(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImport) onImport(file)
  }

  return (
    <Card className="rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Template Library
        </CardTitle>
        <CardDescription>
          Manage default templates and import/export templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateDefault}
            className="transition-all hover:scale-[1.02] hover:shadow-md"
            aria-label="Add default template"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add default template
          </Button>
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="sr-only"
              onChange={handleFileSelect}
              aria-label="Import template from JSON file"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="transition-all hover:scale-[1.02] hover:shadow-md"
              aria-label="Import template from JSON file"
            >
              <Upload className="h-4 w-4" aria-hidden />
              Import
            </Button>
          </>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="transition-all hover:scale-[1.02] hover:shadow-md"
            aria-label="Export templates"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export
          </Button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-body font-medium">Drag and drop JSON template file</p>
          <p className="text-caption text-muted-foreground mt-1">or click Import to browse</p>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-2xl border border-border p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="text-h3 font-medium">No templates yet</h3>
            <p className="text-body text-muted-foreground mt-2 max-w-sm mx-auto">
              Create your first default template or import one to get started.
            </p>
            <Button
              className="mt-4"
              onClick={onCreateDefault}
              aria-label="Add your first template"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add template
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-caption font-medium text-muted-foreground">Default templates</p>
            <div className="grid gap-2">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:shadow-md hover:border-primary/30"
                >
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-caption text-muted-foreground">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
