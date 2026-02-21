/**
 * Password strength calculation and validation utilities.
 * Returns strength 0-4 (weak to strong) and validation messages.
 */

export type PasswordStrength = 0 | 1 | 2 | 3 | 4

export interface PasswordStrengthResult {
  strength: PasswordStrength
  score: number
  label: string
  color: 'destructive' | 'warning' | 'info' | 'success'
  checks: PasswordCheck[]
}

export interface PasswordCheck {
  id: string
  label: string
  met: boolean
}

const STRENGTH_LABELS: Record<PasswordStrength, string> = {
  0: 'Very weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
}

const STRENGTH_COLORS: Record<PasswordStrength, PasswordStrengthResult['color']> = {
  0: 'destructive',
  1: 'destructive',
  2: 'warning',
  3: 'info',
  4: 'success',
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  const checks: PasswordCheck[] = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { id: 'number', label: 'One number', met: /\d/.test(password) },
    { id: 'special', label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const metCount = checks.filter((c) => c.met).length
  const strength = Math.min(4, Math.floor((metCount / 5) * 4)) as PasswordStrength

  return {
    strength,
    score: (strength / 4) * 100,
    label: STRENGTH_LABELS[strength],
    color: STRENGTH_COLORS[strength],
    checks,
  }
}

export function isPasswordStrongEnough(password: string): boolean {
  const { checks } = getPasswordStrength(password)
  return checks.every((c) => c.met)
}

/** Minimum requirements: 8+ chars, uppercase, lowercase, number */
export function meetsMinimumPasswordRequirements(password: string): boolean {
  const { checks } = getPasswordStrength(password)
  const lengthOk = checks.find((c) => c.id === 'length')?.met ?? false
  const uppercaseOk = checks.find((c) => c.id === 'uppercase')?.met ?? false
  const lowercaseOk = checks.find((c) => c.id === 'lowercase')?.met ?? false
  const numberOk = checks.find((c) => c.id === 'number')?.met ?? false
  return lengthOk && uppercaseOk && lowercaseOk && numberOk
}
