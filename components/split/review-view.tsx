'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, RotateCcw, Send, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { formatEther, type Address } from 'viem'
import { base } from 'wagmi/chains'
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import { AllocationList } from '@/components/split/allocation-list'
import { StatusPill } from '@/components/status/status-pill'
import { useRecentSplits } from '@/hooks/useRecentSplits'
import { useSplitForm } from '@/hooks/useSplitForm'
import { BASE_DATA_SUFFIX } from '@/lib/attribution'
import { SPLIT_CONTRACT_ADDRESS, splitAbi } from '@/lib/contract'
import { formatWalletAddress, parseAmountToWei } from '@/lib/utils'

const baseExplorer = 'https://basescan.org/tx/'

export function ReviewView() {
  const { address, chainId, isConnected } = useAccount()
  const publicClient = usePublicClient({ chainId: base.id })
  const { draft, validation, resetDraft } = useSplitForm()
  const { saveRecent } = useRecentSplits()
  const [precheck, setPrecheck] = useState<{ ready: boolean; message: string }>({
    ready: false,
    message: 'Review',
  })
  const [submitError, setSubmitError] = useState('')
  const [savedHash, setSavedHash] = useState<string | null>(null)

  const amountWei = useMemo(() => parseAmountToWei(draft.amount), [draft.amount])
  const recipients = useMemo(() => draft.recipients.map((item) => item.address.trim()), [draft.recipients])
  const typedRecipients = recipients as readonly Address[]
  const shares = useMemo(() => draft.recipients.map((item) => BigInt(item.share || '0')), [draft.recipients])

  const { data: txHash, writeContractAsync, isPending } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  useEffect(() => {
    let ignore = false

    const runPrecheck = async () => {
      if (!validation.ready) {
        setPrecheck({ ready: false, message: validation.summary })
        return
      }

      if (!isConnected || !address) {
        setPrecheck({ ready: false, message: 'Connect wallet' })
        return
      }

      if (chainId !== base.id) {
        setPrecheck({ ready: false, message: 'Wrong Network' })
        return
      }

      if (!publicClient || !amountWei) {
        setPrecheck({ ready: false, message: 'Amount invalid' })
        return
      }

      try {
        await publicClient.simulateContract({
          address: SPLIT_CONTRACT_ADDRESS,
          abi: splitAbi,
          functionName: 'split',
          args: [typedRecipients, shares],
          account: address,
          value: amountWei,
          dataSuffix: BASE_DATA_SUFFIX,
        })

        if (!ignore) {
          setPrecheck({ ready: true, message: `Ready · ${BASE_DATA_SUFFIX.slice(0, 10)}...` })
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof Error ? error.message.split('\n')[0] || 'Simulation failed' : 'Simulation failed'
          setPrecheck({ ready: false, message })
        }
      }
    }

    void runPrecheck()

    return () => {
      ignore = true
    }
  }, [address, amountWei, chainId, isConnected, publicClient, shares, typedRecipients, validation.ready, validation.summary])

  useEffect(() => {
    if (!isSuccess || !txHash || savedHash === txHash) return

    saveRecent({
      title: `Split ${draft.recipients.length}`,
      amount: draft.amount,
      txHash,
      mine: true,
      draft,
    })
    setSavedHash(txHash)
  }, [draft, isSuccess, saveRecent, savedHash, txHash])

  const status = isPending || isConfirming ? 'Pending' : isSuccess ? 'Success' : isError ? 'Failed' : 'Review'
  const canSubmit = validation.ready && precheck.ready && !isPending && !isConfirming

  const handleConfirm = async () => {
    if (!amountWei) return
    setSubmitError('')

    try {
      await writeContractAsync({
        address: SPLIT_CONTRACT_ADDRESS,
        abi: splitAbi,
        functionName: 'split',
        args: [typedRecipients, shares],
        value: amountWei,
        chainId: base.id,
        dataSuffix: BASE_DATA_SUFFIX,
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? /rejected/i.test(error.message)
            ? 'Wallet rejected'
            : error.message.split('\n')[0]
          : 'Transaction failed'
      setSubmitError(message)
    }
  }

  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel overflow-hidden"
      >
        <div className="bg-panel-gradient px-4 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-textMuted">Review & Result</div>
              <h1 className="mt-2 text-2xl font-semibold">Confirm Split</h1>
            </div>
            <StatusPill
              label={status}
              tone={
                status === 'Success'
                  ? 'success'
                  : status === 'Failed'
                    ? 'failed'
                    : status === 'Pending'
                      ? 'pending'
                      : precheck.ready
                        ? 'ready'
                        : 'invalid'
              }
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/6 p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-textMuted">Total</div>
              <div className="mt-2 font-mono text-2xl">{draft.amount || '0.00'}</div>
              <div className="text-xs text-textMuted">ETH</div>
            </div>
            <div className="rounded-2xl bg-white/6 p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-textMuted">Wallet</div>
              <div className="mt-2 text-base font-semibold">
                {isConnected ? formatWalletAddress(address ?? '') : 'Not connected'}
              </div>
              <div className="text-xs text-textMuted">{chainId === base.id ? 'Base' : 'Wrong Network'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Precheck</div>
              <ShieldCheck className="h-4 w-4 text-secondary" />
            </div>
            <div className="mt-3 text-lg font-semibold">{precheck.message}</div>
            <div className="mt-1 text-sm text-textMuted">
              {validation.ready ? `${validation.allocations.length} recipients` : 'Fix invalid inputs before submit'}
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Estimated Receive</div>
              <div className="text-xs text-textMuted">{amountWei ? `${formatEther(amountWei)} ETH` : '0 ETH'}</div>
            </div>
            <AllocationList items={validation.allocations} />
          </div>

          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-[26px] bg-primary px-5 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-primary/40"
          >
            <Send className="h-4 w-4" />
            Confirm Split
          </button>

          {submitError ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {submitError}
            </div>
          ) : null}

          {receiptError ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {receiptError.message}
            </div>
          ) : null}

          {(txHash || isSuccess || isError) && (
            <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Result</div>
                {isError ? (
                  <AlertTriangle className="h-4 w-4 text-danger" />
                ) : (
                  <StatusPill
                    label={status}
                    tone={status === 'Success' ? 'success' : status === 'Failed' ? 'failed' : 'pending'}
                  />
                )}
              </div>

              <div className="mt-4 space-y-3">
                {txHash ? (
                  <a
                    href={`${baseExplorer}${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm"
                  >
                    <span className="truncate pr-3">{txHash}</span>
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </a>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/builder"
                    className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-center text-sm text-text"
                  >
                    Reuse Setup
                  </Link>
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-text"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start New Split
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  )
}
