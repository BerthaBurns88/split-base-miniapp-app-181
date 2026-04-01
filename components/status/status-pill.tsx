import { cn, statusTone } from '@/lib/utils'

type StatusPillProps = {
  label: string
  tone?: 'ready' | 'invalid' | 'pending' | 'success' | 'failed' | 'warning'
}

export function StatusPill({ label, tone = 'ready' }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-1.5 text-xs text-text',
        tone === 'invalid' && 'text-danger',
      )}
    >
      <span className={cn('status-dot', statusTone(tone))} />
      {label}
    </span>
  )
}

