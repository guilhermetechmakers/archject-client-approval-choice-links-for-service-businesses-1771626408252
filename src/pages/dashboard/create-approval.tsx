import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const steps = [
  { id: 1, title: 'Details' },
  { id: 2, title: 'Options' },
  { id: 3, title: 'Media' },
  { id: 4, title: 'Recipients' },
  { id: 5, title: 'Settings' },
  { id: 6, title: 'Review' },
]

export function CreateApprovalPage() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-h1 font-bold">Create Approval Request</h1>
        <p className="text-body text-muted-foreground mt-1">
          Multi-step wizard to create a new approval link
        </p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`rounded-full px-4 py-2 text-caption font-medium transition-colors ${
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {step.id}. {step.title}
            </button>
            {step.id < steps.length && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep}: {steps[currentStep - 1]?.title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Enter the basic details for your approval request'}
            {currentStep === 2 && 'Add options and choices for the client to select'}
            {currentStep === 3 && 'Upload media and attachments'}
            {currentStep === 4 && 'Add recipient emails or create a public link'}
            {currentStep === 5 && 'Configure deadline, comments, and other settings'}
            {currentStep === 6 && 'Review and send your approval request'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Cabinet Selection" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input id="project" placeholder="Select project" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Input id="instructions" placeholder="Instructions for the client" />
              </div>
            </>
          )}
          {currentStep !== 1 && (
            <p className="text-muted-foreground">
              Option builder, media uploader, recipient entry, and settings panels
              would be implemented here.
            </p>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={() => setCurrentStep((s) => s + 1)}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button asChild>
                <Link to="/dashboard/approvals">Save & Send</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
