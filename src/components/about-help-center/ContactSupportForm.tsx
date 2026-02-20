import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Paperclip, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const issueTypes = [
  { value: 'technical', label: 'Technical issue' },
  { value: 'billing', label: 'Billing & subscription' },
  { value: 'feature', label: 'Feature request' },
  { value: 'account', label: 'Account & security' },
  { value: 'other', label: 'Other' },
] as const

const schema = z.object({
  issueType: z.enum(['technical', 'billing', 'feature', 'account', 'other']),
  description: z.string().min(10, 'Please provide at least 10 characters'),
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

interface ContactSupportFormProps {
  onSubmit?: (data: FormData & { attachment?: File }) => Promise<void>
}

export function ContactSupportForm({ onSubmit }: ContactSupportFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { issueType: 'technical' },
  })

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      if (onSubmit) {
        await onSubmit({ ...data, attachment: attachment ?? undefined })
      } else {
        const { supabase } = await import('@/lib/supabase')
        if (supabase) {
          const { error } = await supabase.functions.invoke('contact-support', {
            body: {
              issue_type: data.issueType,
              description: data.description,
              email: data.email,
            },
          })
          if (error) throw error
        } else {
          await new Promise((r) => setTimeout(r, 800))
        }
      }
      toast.success('Support request submitted. We\'ll get back to you soon.')
      reset()
      setAttachment(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription>
          Issue type, description, attach file, and submit. We typically respond within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issueType">Issue type</Label>
            <select
              id="issueType"
              {...register('issueType')}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-body',
                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                errors.issueType && 'border-destructive'
              )}
            >
              {issueTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-caption text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your issue or question..."
              rows={4}
              {...register('description')}
              className={cn(
                'resize-none',
                errors.description && 'border-destructive'
              )}
            />
            {errors.description && (
              <p className="text-caption text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Attach file (optional)</Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Paperclip className="h-4 w-4" />
                {attachment ? attachment.name : 'Choose file'}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 hover:scale-[1.02] transition-transform"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
