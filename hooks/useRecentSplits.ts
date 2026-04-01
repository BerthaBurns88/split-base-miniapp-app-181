'use client'

import { useEffect, useMemo, useState } from 'react'

import type { SplitDraft } from '@/hooks/useSplitForm'
import { STORAGE_KEYS } from '@/lib/utils'

export type RecentSplit = {
  id: string
  title: string
  amount: string
  txHash?: string
  createdAt: string
  mine: boolean
  draft: SplitDraft
}

export type SplitTemplate = {
  id: string
  title: string
  label: string
  amountHint: string
  draft: SplitDraft
}

const templateDraft = (shares: string[]): SplitDraft => ({
  amount: '',
  mode: shares.every((value) => value === shares[0]) ? 'even' : 'custom',
  recipients: shares.map((share, index) => ({
    id: `template-${index}`,
    address: '',
    share,
  })),
})

export const SPLIT_TEMPLATES: SplitTemplate[] = [
  {
    id: 'fifty-fifty',
    title: '50 / 50',
    label: 'Even Split',
    amountHint: '2 wallets',
    draft: templateDraft(['1', '1']),
  },
  {
    id: 'seventy-twenty-ten',
    title: '70 / 20 / 10',
    label: 'Custom Split',
    amountHint: '3 wallets',
    draft: templateDraft(['70', '20', '10']),
  },
]

export function useRecentSplits() {
  const [recent, setRecent] = useState<RecentSplit[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.recent)
      if (!raw) return
      setRecent(JSON.parse(raw) as RecentSplit[])
    } catch {
      window.localStorage.removeItem(STORAGE_KEYS.recent)
    }
  }, [])

  const saveRecent = (entry: Omit<RecentSplit, 'id' | 'createdAt'>) => {
    const nextEntry: RecentSplit = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    setRecent((current) => {
      const next = [nextEntry, ...current].slice(0, 6)
      window.localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(next))
      return next
    })
  }

  return useMemo(
    () => ({
      recent,
      saveRecent,
      templates: SPLIT_TEMPLATES,
    }),
    [recent],
  )
}

