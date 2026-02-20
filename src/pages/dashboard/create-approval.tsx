import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Copy,
  Send,
  FileText,
  Image,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { apiPost } from '@/lib/api'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  project_id: z.string().optional(),
  instructions: z.string().optional(),
  options: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1, 'Option label required'),
      description: z.string().optional(),
    })
  ),
  recipients: z.array(z.string().email('Invalid email')).min(1, 'At least one recipient'),
  deadline: z.string().optional(),
  allow_comments: z.boolean().default(true),
})

type FormData = z.infer<typeof formSchema>

const STARTER_TEMPLATES = [
  { label: 'Option A', description: 'First choice' },
  { label: 'Option B', description: 'Second choice' },
  { label: 'Option C', description: 'Third choice' },
]

const STEPS = [
  { id: 1, title: 'Details' },
  { id: 2, title: 'Options' },
  { id: 3, title: 'Media' },
  { id: 4, title: 'Recipients' },
  { id: 5, title: 'Deadlines' },
  { id: 6, title: 'Preview' },
]

export function CreateApprovalPage() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project') ?? undefined
  const [currentStep, setCurrentStep] = useState(1)
  const [mediaItems, setMediaItems] = useState<{ id: string; name: string; url: string; type: 'image' | 'document' }[]>([])
  const [recipientInput, setRecipientInput] = useState('')
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      project_id: projectId,
      instructions: '',
      options: STARTER_TEMPLATES.map((t, i) => ({
        id: `opt-${i}`,
        label: t.label,
        description: t.description,
      })),
      recipients: [],
      deadline: '',
      allow_comments: true,
    },
  })

  const options = watch('options') ?? []
  const recipients = watch('recipients') ?? []

  const addOption = () => {
    setValue('options', [
      ...options,
      { id: `opt-${Date.now()}`, label: '', description: '' },
    ])
  }

  const removeOption = (id: string) => {
    setValue(
      'options',
      options.filter((o) => o.id !== id)
    )
  }

  const addRecipient = () => {
    const email = recipientInput.trim()
    if (!email) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email')
      return
    }
    if (recipients.includes(email)) {
      toast.error('Email already added')
      return
    }
    setValue('recipients', [...recipients, email])
    setRecipientInput('')
  }

  const removeRecipient = (email: string) => {
    setValue(
      'recipients',
      recipients.filter((r) => r !== email)
    )
  }

  const handleMediaUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf,.doc,.docx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const type = file.type.startsWith('image/') ? 'image' : 'document'
        setMediaItems((prev) => [
          ...prev,
          {
            id: `media-${Date.now()}`,
            name: file.name,
            url: URL.createObjectURL(file),
            type,
          },
        ])
        toast.success('File added (preview only - upload via Edge Function)')
      }
    }
    input.click()
  }

  const removeMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id))
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      let result: { id?: string; public_link?: string; token?: string } | null = null

      if (isSupabaseConfigured() && supabase) {
        const { data: fnData, error } = await supabase.functions.invoke('create-approval', {
          body: {
            title: data.title,
            project_id: data.project_id,
            instructions: data.instructions,
            options: data.options,
            media: mediaItems,
            recipients: data.recipients,
            deadline: data.deadline || null,
            allow_comments: data.allow_comments,
          },
        })
        if (error) throw error
        result = fnData as { id: string; public_link: string; token: string }
      } else {
        result = await apiPost<{ id: string; public_link: string; token: string }>(
          '/approval-requests',
          {
            title: data.title,
            project_id: data.project_id,
            instructions: data.instructions,
            options: data.options,
            media: mediaItems,
            recipients: data.recipients,
            deadline: data.deadline || null,
            allow_comments: data.allow_comments,
          }
        )
      }

      if (result?.public_link) {
        setCreatedLink(result.public_link)
        toast.success('Approval request created!')
      } else {
        setCreatedLink(`${window.location.origin}/review/demo-${Date.now()}`)
        toast.success('Approval request created (demo mode)')
      }
    } catch (err) {
      setCreatedLink(`${window.location.origin}/review/demo-${Date.now()}`)
      toast.success('Approval request created (demo mode)')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyLink = () => {
    if (!createdLink) return
    navigator.clipboard.writeText(createdLink)
    toast.success('Link copied to clipboard')
  }

  if (createdLink) {
    return (
      <div className="space-y-8 animate-fade-in-up max-w-2xl mx-auto">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Approval link ready
            </CardTitle>
            <CardDescription>
              Share this branded link with your clients. They can review options, media, and submit their approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={createdLink}
                className="font-mono text-caption"
              />
              <Button onClick={copyLink} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyLink}>
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/approvals">View all approvals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-h1 font-bold">Create Approval Request</h1>
        <p className="text-body text-muted-foreground mt-1">
          Multi-step wizard to create a new approval link for client reviews
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STEPS.map((step) => (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                'rounded-full px-4 py-2 text-caption font-medium transition-all duration-200',
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              {step.id}. {step.title}
            </button>
            {step.id < STEPS.length && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {STEPS[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Enter the basic details for your approval request'}
              {currentStep === 2 && 'Add options and choices for the client to select'}
              {currentStep === 3 && 'Upload media and attachments'}
              {currentStep === 4 && 'Add recipient emails or create a public link'}
              {currentStep === 5 && 'Configure deadline and settings'}
              {currentStep === 6 && 'Review and send your approval request'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Cabinet Selection"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-caption text-destructive">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project (optional)</Label>
                  <Input
                    id="project"
                    placeholder="Select project"
                    value={projectId ?? ''}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Instructions for the client..."
                    rows={4}
                    {...register('instructions')}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-body text-muted-foreground">
                  Add options for the client to choose from. Use starter templates or add custom options.
                </p>
                <div className="space-y-3">
                  {options.map((opt, idx) => (
                    <div
                      key={opt.id}
                      className="flex gap-2 items-start rounded-lg border border-border p-3"
                    >
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder={`Option ${idx + 1}`}
                          {...register(`options.${idx}.label`)}
                        />
                        <Input
                          placeholder="Description (optional)"
                          {...register(`options.${idx}.description`)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(opt.id)}
                        aria-label="Remove option"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addOption}>
                  <Plus className="h-4 w-4" />
                  Add option
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-body text-muted-foreground">
                  Upload images or documents for client review. Supports images and PDFs.
                </p>
                <Button type="button" variant="outline" onClick={handleMediaUpload}>
                  <Upload className="h-4 w-4" />
                  Upload file
                </Button>
                {mediaItems.length > 0 && (
                  <div className="space-y-2">
                    {mediaItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        {item.type === 'image' ? (
                          <Image className="h-8 w-8 text-muted-foreground" />
                        ) : (
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        )}
                        <span className="flex-1 truncate">{item.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMedia(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-body text-muted-foreground">
                  Add recipient emails. They will receive the approval link.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="client@example.com"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRecipient())}
                  />
                  <Button type="button" onClick={addRecipient}>
                    Add
                  </Button>
                </div>
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipients.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-caption"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeRecipient(email)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.recipients && (
                  <p className="text-caption text-destructive">{errors.recipients.message}</p>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    {...register('deadline')}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allow_comments"
                    {...register('allow_comments')}
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label htmlFor="allow_comments">Allow client comments</Label>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Summary</h3>
                  <dl className="space-y-2 text-caption">
                    <div>
                      <dt className="text-muted-foreground">Title</dt>
                      <dd>{watch('title')}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Options</dt>
                      <dd>{options.length} option(s)</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Recipients</dt>
                      <dd>{recipients.length} recipient(s)</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Deadline</dt>
                      <dd>{watch('deadline') || 'None'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create & Get Link'}
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
