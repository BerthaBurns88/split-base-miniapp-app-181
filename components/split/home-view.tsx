'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock3, Layers3, Plus } from 'lucide-react'

import { AllocationList } from '@/components/split/allocation-list'
import { RatioBar } from '@/components/split/ratio-bar'
import { StatusPill } from '@/components/status/status-pill'
import { WalletPanel } from '@/components/wallet/wallet-panel'
import { useRecentSplits } from '@/hooks/useRecentSplits'
import { useSplitForm } from '@/hooks/useSplitForm'
import { formatAmountLabel, modeLabel } from '@/lib/utils'
import { getRatioStatus } from '@/lib/validation'

export function HomeView() {
  const { draft, validation, setAmount } = useSplitForm()
  const { recent, templates } = useRecentSplits()

  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel overflow-hidden"
      >
        <div className="bg-panel-gradient px-4 pb-5 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-textMuted">app-181</div>
              <h1 className="mt-2 text-3xl font-semibold">Split</h1>
            </div>
            <StatusPill label={validation.ready ? 'Ready' : 'Invalid'} tone={validation.ready ? 'ready' : 'invalid'} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/6 p-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-textMuted">Amount</div>
              <div className="mt-2 font-mono text-lg">{formatAmountLabel(draft.amount)}</div>
            </div>
            <div className="rounded-2xl bg-white/6 p-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-textMuted">Recipients</div>
              <div className="mt-2 font-mono text-lg">{draft.recipients.length}</div>
            </div>
            <div className="rounded-2xl bg-white/6 p-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-textMuted">Mode</div>
              <div className="mt-2 text-sm font-semibold">{draft.mode === 'even' ? 'Even' : 'Custom'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="rounded-[26px] border border-white/8 bg-white/4 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-text">Amount</div>
              <div className="text-xs text-textMuted">ETH</div>
            </div>
            <input
              value={draft.amount}
              onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              placeholder="0.00"
              className="mt-3 w-full bg-transparent font-mono text-4xl font-semibold text-text outline-none placeholder:text-textMuted/40"
            />
          </div>

          <div className="grid grid-cols-[1.3fr,0.7fr] gap-3">
            <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Recipients</span>
                <Link href="/builder" className="text-xs text-primary">
                  Edit
                </Link>
              </div>
              <div className="mt-3 text-3xl font-semibold">{draft.recipients.length}</div>
              <div className="mt-1 text-sm text-textMuted">{modeLabel(draft.mode)}</div>
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <div className="text-sm font-semibold">Ratio</div>
              <div className="mt-3 text-lg font-semibold">{getRatioStatus(draft)}</div>
              <div className="mt-1 text-xs text-textMuted">{validation.summary}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Ratio Status</div>
              <StatusPill label={getRatioStatus(draft)} tone={draft.mode === 'even' ? 'success' : 'warning'} />
            </div>
            <div className="mt-3">
              <RatioBar shares={draft.recipients.map((item) => item.share)} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Preview</div>
              <Link href="/review" className="text-xs text-primary">
                Review
              </Link>
            </div>
            <AllocationList items={validation.allocations.slice(0, 3)} />
          </div>

          <Link
            href="/review"
            className="flex items-center justify-between rounded-[26px] bg-primary px-5 py-4 text-base font-semibold text-white"
          >
            <span>Split Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.section>

      <WalletPanel />

      <section className="grid grid-cols-[1.1fr,0.9fr] gap-3">
        <Link href="/templates" className="panel px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Templates</div>
            <Layers3 className="h-4 w-4 text-secondary" />
          </div>
          <div className="mt-3 text-2xl font-semibold">{templates.length}</div>
          <div className="mt-1 text-sm text-textMuted">Reusable</div>
        </Link>

        <Link href="/builder" className="panel px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Builder</div>
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-2xl font-semibold">Live</div>
          <div className="mt-1 text-sm text-textMuted">Custom Split</div>
        </Link>
      </section>

      <section className="panel px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Recent</div>
          <Clock3 className="h-4 w-4 text-textMuted" />
        </div>
        <div className="mt-4 space-y-3">
          {recent.length ? (
            recent.slice(0, 2).map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/8 bg-white/4 px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{item.title}</div>
                  <StatusPill label="Reusable" tone="success" />
                </div>
                <div className="mt-2 text-sm text-textMuted">
                  {item.amount} ETH · {item.draft.recipients.length} recipients
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-3 py-5 text-sm text-textMuted">
              Save one successful split to reuse here.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

