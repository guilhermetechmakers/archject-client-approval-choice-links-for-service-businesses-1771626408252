import { supabase } from '@/lib/supabase'
import type { ResendVerificationResponse } from '@/types/email-verification'

/**
 * Resends verification email via Supabase Edge Function.
 * Server-side logic runs in the Edge Function; client only invokes it.
 */
export async function resendVerificationEmail(
  email: string
): Promise<ResendVerificationResponse> {
  if (!email?.trim()) {
    throw new Error('Email is required')
  }

  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase.functions.invoke<ResendVerificationResponse>(
    'resend-verification',
    {
      method: 'POST',
      body: { email: email.trim() },
    }
  )

  if (error) {
    throw new Error(error.message ?? 'Failed to resend verification email')
  }

  if (!data?.success) {
    throw new Error('Failed to resend verification email')
  }

  return data
}
