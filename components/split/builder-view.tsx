'use client'

import { motion } from 'framer-motion'
import { MinusCircle, PlusCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { AllocationList } from '@/components/split/allocation-list'
import { RatioBar } from '@/components/split/ratio-bar'
import { StatusPill } from '@/components/status/status-pill'
import { useSplitForm } from '@/hooks/useSplitForm'
import { modeLabel } from '@/lib/utils'

export function BuilderView() {
  const {
    draft,
    validation,
    setMode,
    addRecipient,
    removeRecipient,
    updateRecipient,
    applyEvenSplit,
  } = useSplitForm()

  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel px-4 py-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-textMuted">Split Builder</div>
            <h1 className="mt-2 text-2xl font-semibold">Recipients</h1>
          </div>
          <StatusPill label={validation.summary} tone={validation.ready ? 'ready' : 'invalid'} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setMode('even')
              applyEvenSplit()
            }}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              draft.mode === 'even'
                ? 'bg-primary text-white'
                : 'border border-white/8 bg-white/4 text-textMuted'
            }`}
          >
            Even Split
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              draft.mode === 'custom'
                ? 'bg-secondary text-slate-950'
                : 'border border-white/8 bg-white/4 text-textMuted'
            }`}
          >
            Custom Split
          </button>
        </div>

        <div className="mt-4 rounded-3xl border border-white/8 bg-white/4 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{modeLabel(draft.mode)}</div>
            <Sparkles className="h-4 w-4 text-secondary" />
          </div>
          <div className="mt-3">
            <RatioBar shares={draft.recipients.map((item) => item.share)} />
          </div>
        </div>
      </motion.section>

      <section className="space-y-3">
        {draft.recipients.map((recipient, index) => (
          <motion.div
            key={recipient.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Recipient {index + 1}</div>
              <button
                type="button"
                onClick={() => removeRecipient(recipient.id)}
                className="rounded-full text-textMuted transition hover:text-danger"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <label className="block rounded-2xl border border-white/8 bg-white/4 px-3 py-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-textMuted">Address</div>
                <input
                  value={recipient.address}
                  onChange={(event) => updateRecipient(recipient.id, 'address', event.target.value)}
                  placeholder="0x..."
                  className="mt-2 w-full bg-transparent text-sm text-text outline-none placeholder:text-textMuted/40"
                />
              </label>

              <label className="block rounded-2xl border border-white/8 bg-white/4 px-3 py-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-textMuted">Share</div>
                <input
                  value={recipient.share}
                  onChange={(event) => updateRecipient(recipient.id, 'share', event.target.value)}
                  inputMode="numeric"
                  placeholder="1"
                  disabled={draft.mode === 'even'}
                  className="mt-2 w-full bg-transparent text-lg font-semibold text-text outline-none placeholder:text-textMuted/40 disabled:text-textMuted"
                />
              </label>
            </div>
          </motion.div>
        ))}
      </section>

      <button
        type="button"
        onClick={addRecipient}
        className="flex w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-primary/50 bg-primary/10 px-4 py-4 text-sm font-semibold text-primary"
      >
        <PlusCircle className="h-4 w-4" />
        Add Recipient
      </button>

      <section className="panel px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Validation</div>
            <div className="mt-1 text-sm text-textMuted">
              {validation.allocationCount} recipients · {validation.totalShares.toString()} shares
            </div>
          </div>
          <StatusPill label={validation.ready ? 'Ready' : 'Invalid'} tone={validation.ready ? 'ready' : 'invalid'} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {validation.errors.length ? (
            validation.errors.slice(0, 4).map((error) => (
              <span key={error} className="rounded-full bg-danger/10 px-3 py-1 text-xs text-danger">
                {error}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs text-success">
              Ready
            </span>
          )}
        </div>
      </section>

      <section className="panel px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Estimated Result</div>
          <Link href="/review" className="text-sm text-primary">
            Review
          </Link>
        </div>
        <div className="mt-4">
          <AllocationList items={validation.allocations} />
        </div>
      </section>
    </div>
  )
}

