'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { emptyDraft, STORAGE_KEYS } from '@/lib/utils'
import { validateDraft } from '@/lib/validation'

export type SplitMode = 'even' | 'custom'

export type RecipientInput = {
  id: string
  address: string
  share: string
}

export type AllocationPreview = {
  address: string
  share: string
  amountWei: bigint
  amountLabel: string
  pctLabel: string
}

export type SplitDraft = {
  amount: string
  mode: SplitMode
  recipients: RecipientInput[]
}

type SplitFormContextValue = {
  draft: SplitDraft
  validation: ReturnType<typeof validateDraft>
  setAmount: (value: string) => void
  setMode: (mode: SplitMode) => void
  addRecipient: () => void
  removeRecipient: (id: string) => void
  updateRecipient: (id: string, key: 'address' | 'share', value: string) => void
  applyEvenSplit: () => void
  replaceDraft: (value: SplitDraft) => void
  resetDraft: () => void
}

const SplitFormContext = createContext<SplitFormContextValue | null>(null)

const recipientFactory = (share = '1'): RecipientInput => ({
  id: crypto.randomUUID(),
  address: '',
  share,
})

export function SplitFormProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<SplitDraft>(() => emptyDraft())

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.draft)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as SplitDraft
      if (parsed?.recipients?.length) {
        setDraft(parsed)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEYS.draft)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draft))
  }, [draft])

  const validation = useMemo(() => validateDraft(draft), [draft])

  const value = useMemo<SplitFormContextValue>(
    () => ({
      draft,
      validation,
      setAmount: (amount) => setDraft((current) => ({ ...current, amount })),
      setMode: (mode) =>
        setDraft((current) => {
          if (mode === 'even') {
            return {
              ...current,
              mode,
              recipients: current.recipients.map((item) => ({ ...item, share: '1' })),
            }
          }

          return { ...current, mode }
        }),
      addRecipient: () =>
        setDraft((current) => ({
          ...current,
          recipients: [
            ...current.recipients,
            recipientFactory(current.mode === 'even' ? '1' : ''),
          ],
        })),
      removeRecipient: (id) =>
        setDraft((current) => {
          if (current.recipients.length <= 2) return current
          return {
            ...current,
            recipients: current.recipients.filter((item) => item.id !== id),
          }
        }),
      updateRecipient: (id, key, value) =>
        setDraft((current) => ({
          ...current,
          recipients: current.recipients.map((item) =>
            item.id === id
              ? {
                  ...item,
                  [key]: key === 'share' ? value.replace(/[^\d]/g, '') : value.trim(),
                }
              : item,
          ),
        })),
      applyEvenSplit: () =>
        setDraft((current) => ({
          ...current,
          mode: 'even',
          recipients: current.recipients.map((item) => ({ ...item, share: '1' })),
        })),
      replaceDraft: (value) =>
        setDraft({
          ...value,
          recipients: value.recipients.map((item) => ({
            ...item,
            id: item.id || crypto.randomUUID(),
          })),
        }),
      resetDraft: () => setDraft(emptyDraft()),
    }),
    [draft, validation],
  )

  return <SplitFormContext.Provider value={value}>{children}</SplitFormContext.Provider>
}

export const useSplitForm = () => {
  const context = useContext(SplitFormContext)
  if (!context) {
    throw new Error('useSplitForm must be used within SplitFormProvider')
  }
  return context
}

