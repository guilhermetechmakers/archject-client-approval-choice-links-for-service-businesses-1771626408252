import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PasswordStrengthResult } from '@/lib/password-strength'

export interface PasswordStrengthMeterProps {
  result: PasswordStrengthResult
  showChecks?: boolean
  className?: string
  id?: string
}

export function PasswordStrengthMeter({
  result,
  showChecks = true,
  className,
  id,
}: PasswordStrengthMeterProps) {
  const progressColor =
    result.color === 'destructive'
      ? 'bg-destructive'
      : result.color === 'warning'
        ? 'bg-warning'
        : result.color === 'info'
          ? 'bg-info'
          : 'bg-success'

  return (
    <div id={id} className={cn('space-y-2', className)} role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'text-caption font-medium transition-colors duration-200',
            result.strength === 0 && 'text-muted-foreground',
            result.strength === 1 && 'text-destructive',
            result.strength === 2 && 'text-warning',
            result.strength === 3 && 'text-info',
            result.strength === 4 && 'text-success'
          )}
        >
          {result.label}
        </span>
        <div className="h-2 flex-1 max-w-[120px] overflow-hidden rounded-full bg-secondary">
          <div
            className={cn('h-full transition-all duration-300 ease-out', progressColor)}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>
      {showChecks && result.checks.length > 0 && (
        <ul className="space-y-1.5" aria-label="Password requirements">
          {result.checks.map((check) => (
            <li
              key={check.id}
              className={cn(
                'flex items-center gap-2 text-caption transition-colors duration-200',
                check.met ? 'text-success' : 'text-muted-foreground'
              )}
            >
              {check.met ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span>{check.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
