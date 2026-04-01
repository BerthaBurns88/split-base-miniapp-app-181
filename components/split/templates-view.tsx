'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Clock3, Layers2 } from 'lucide-react'
import { useState } from 'react'

import { StatusPill } from '@/components/status/status-pill'
import { useRecentSplits } from '@/hooks/useRecentSplits'
import { useSplitForm } from '@/hooks/useSplitForm'

type Tab = 'all' | 'templates' | 'recent'

export function TemplatesView() {
  const [tab, setTab] = useState<Tab>('all')
  const { templates, recent } = useRecentSplits()
  const { replaceDraft } = useSplitForm()

  const showTemplates = tab === 'all' || tab === 'templates'
  const showRecent = tab === 'all' || tab === 'recent'

  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel px-4 py-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-textMuted">Templates & Recent</div>
            <h1 className="mt-2 text-2xl font-semibold">Reuse Flow</h1>
          </div>
          <StatusPill label="Reusable" tone="success" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/5 p-1">
          {(['all', 'templates', 'recent'] as Tab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-2xl px-3 py-2 text-sm capitalize transition ${
                tab === item ? 'bg-primary text-white' : 'text-textMuted'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </motion.section>

      {showTemplates ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Layers2 className="h-4 w-4 text-secondary" />
              Templates
            </div>
            <div className="text-xs text-textMuted">Horizontal</div>
          </div>

          <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
            {templates.map((template) => (
              <div key={template.id} className="panel min-w-[280px] flex-1 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-textMuted">Template</div>
                    <div className="mt-2 text-2xl font-semibold">{template.title}</div>
                  </div>
                  <StatusPill label={template.label} tone={template.label === 'Even Split' ? 'success' : 'warning'} />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div className="text-sm text-textMuted">{template.amountHint}</div>
                  <button
                    type="button"
                    onClick={() => replaceDraft(template.draft)}
                    className="rounded-2xl bg-secondary px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Reuse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showRecent ? (
        <section className="panel px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock3 className="h-4 w-4 text-primary" />
              Recent
            </div>
            <div className="text-xs text-textMuted">{recent.length} saved</div>
          </div>

          <div className="mt-4 space-y-3">
            {recent.length ? (
              recent.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-textMuted">
                        {item.amount} ETH · {item.draft.recipients.length} recipients
                      </div>
                    </div>
                    <StatusPill label={item.mine ? 'Mine' : 'Recent'} tone="success" />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-textMuted">{new Date(item.createdAt).toLocaleString()}</div>
                    <button
                      type="button"
                      onClick={() => replaceDraft(item.draft)}
                      className="flex items-center gap-1 rounded-2xl border border-white/8 px-4 py-2 text-sm text-text"
                    >
                      Reuse
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {item.txHash ? (
                    <a
                      href={`https://basescan.org/tx/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-xs text-primary"
                    >
                      View Tx
                    </a>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 px-4 py-8 text-center">
                <div className="text-sm text-textMuted">No local history yet</div>
                <Link href="/review" className="mt-3 inline-flex text-sm text-primary">
                  Review
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  )
}

