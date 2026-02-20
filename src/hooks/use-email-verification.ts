import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { resendVerificationEmail } from '@/services/email-verificationService'

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerificationEmail(email),
    onSuccess: () => {
      toast.success('Verification email sent. Please check your inbox.')
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to resend verification email')
    },
  })
}
