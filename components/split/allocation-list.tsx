import { Hash } from 'lucide-react'

import type { AllocationPreview } from '@/hooks/useSplitForm'
import { formatWalletAddress } from '@/lib/utils'

type AllocationListProps = {
  items: AllocationPreview[]
  emptyLabel?: string
}

export function AllocationList({ items, emptyLabel = 'No preview' }: AllocationListProps) {
  if (!items.length) {
    return <div className="text-sm text-textMuted">{emptyLabel}</div>
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.address}-${index}`}
          className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-text">
              <Hash className="h-3.5 w-3.5 text-primary" />
              {item.address ? formatWalletAddress(item.address) : `Recipient ${index + 1}`}
            </div>
            <div className="text-xs text-textMuted">
              Share {item.share || '0'} · {item.pctLabel}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm text-text">{item.amountLabel} ETH</div>
          </div>
        </div>
      ))}
    </div>
  )
}

