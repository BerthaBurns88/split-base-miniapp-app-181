import { cn } from '@/lib/utils'

type RatioBarProps = {
  shares: string[]
}

const fills = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-warning', 'bg-danger']

export function RatioBar({ shares }: RatioBarProps) {
  const numericShares = shares.map((item) => Number(item || '0'))
  const total = numericShares.reduce((sum, value) => sum + value, 0)

  return (
    <div className="overflow-hidden rounded-full bg-white/6 p-1">
      <div className="flex h-3 w-full gap-1">
        {numericShares.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className={cn('h-full rounded-full', fills[index % fills.length], !total && 'flex-1')}
            style={{
              width: total ? `${(value / total) * 100}%` : undefined,
              flex: total ? undefined : 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

