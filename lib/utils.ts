import { clsx } from 'clsx'
import { formatEther, parseEther } from 'viem'

import type { AllocationPreview, SplitDraft, SplitMode } from '@/hooks/useSplitForm'

export const STORAGE_KEYS = {
  draft: 'split:draft:v1',
  recent: 'split:recent:v1',
}

export const emptyDraft = (): SplitDraft => ({
  amount: '',
  mode: 'even',
  recipients: [
    { id: crypto.randomUUID(), address: '', share: '1' },
    { id: crypto.randomUUID(), address: '', share: '1' },
  ],
})

export const formatWalletAddress = (value: string) => {
  if (!value) return 'Not connected'
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

export const formatAmountLabel = (value: string | bigint) => {
  if (typeof value === 'string') {
    if (!value) return '0.0000'
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed.toFixed(4) : '0.0000'
  }

  return Number.parseFloat(formatEther(value)).toFixed(4)
}

export const parseAmountToWei = (amount: string) => {
  if (!amount || Number.isNaN(Number(amount))) {
    return null
  }

  try {
    return parseEther(amount)
  } catch {
    return null
  }
}

export const calculateAllocations = (
  amount: string,
  shares: string[],
  addresses: string[],
): AllocationPreview[] => {
  const totalWei = parseAmountToWei(amount)
  const numericShares = shares.map((share) => BigInt(share || '0'))
  const totalShares = numericShares.reduce((sum, current) => sum + current, 0n)

  if (!totalWei || totalShares <= 0n) {
    return addresses.map((address, index) => ({
      address,
      share: shares[index] || '0',
      amountWei: 0n,
      amountLabel: '0.0000',
      pctLabel: '0%',
    }))
  }

  return numericShares.map((share, index) => {
    const allocationWei = (totalWei * share) / totalShares
    const percentage = Number((share * 10_000n) / totalShares) / 100

    return {
      address: addresses[index],
      share: shares[index],
      amountWei: allocationWei,
      amountLabel: formatAmountLabel(allocationWei),
      pctLabel: `${percentage.toFixed(2)}%`,
    }
  })
}

export const cn = (...values: Array<string | false | null | undefined>) => clsx(values)

export const modeLabel = (mode: SplitMode) =>
  mode === 'even' ? 'Even Split' : 'Custom Split'

export const statusTone = (status: string) => {
  switch (status) {
    case 'ready':
    case 'success':
      return 'bg-success'
    case 'warning':
    case 'pending':
      return 'bg-warning'
    case 'failed':
    case 'invalid':
      return 'bg-danger'
    default:
      return 'bg-primary'
  }
}

