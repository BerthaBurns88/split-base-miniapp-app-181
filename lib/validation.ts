import { isAddress } from 'viem'

import type { SplitDraft } from '@/hooks/useSplitForm'
import { calculateAllocations, parseAmountToWei } from '@/lib/utils'

export type ValidationResult = {
  ready: boolean
  status: 'ready' | 'invalid'
  summary: string
  errors: string[]
  allocationCount: number
  totalShares: bigint
  allocations: ReturnType<typeof calculateAllocations>
}

export const validateDraft = (draft: SplitDraft): ValidationResult => {
  const addresses = draft.recipients.map((item) => item.address.trim())
  const shares = draft.recipients.map((item) => item.share.trim())
  const errors: string[] = []

  if (!draft.amount || !parseAmountToWei(draft.amount) || Number(draft.amount) <= 0) {
    errors.push('Amount invalid')
  }

  if (!addresses.length) {
    errors.push('Add recipient')
  }

  addresses.forEach((address, index) => {
    if (!address) {
      errors.push(`Recipient ${index + 1} empty`)
      return
    }

    if (!isAddress(address)) {
      errors.push(`Recipient ${index + 1} invalid`)
    }
  })

  const numericShares = shares.map((share, index) => {
    if (!share || !/^\d+$/.test(share)) {
      errors.push(`Share ${index + 1} invalid`)
      return 0n
    }

    const value = BigInt(share)
    if (value <= 0n) {
      errors.push(`Share ${index + 1} invalid`)
    }
    return value
  })

  if (addresses.length !== shares.length) {
    errors.push('Count mismatch')
  }

  const totalShares = numericShares.reduce((sum, current) => sum + current, 0n)
  if (totalShares <= 0n) {
    errors.push('Shares total 0')
  }

  const allocations = calculateAllocations(draft.amount, shares, addresses)

  return {
    ready: errors.length === 0,
    status: errors.length === 0 ? 'ready' : 'invalid',
    summary: errors.length === 0 ? 'Ready' : errors[0] ?? 'Invalid',
    errors,
    allocationCount: allocations.length,
    totalShares,
    allocations,
  }
}

export const getRatioStatus = (draft: SplitDraft) => {
  const shareSet = new Set(draft.recipients.map((item) => item.share || '0'))
  return shareSet.size === 1 ? 'Even Split' : 'Custom Split'
}

