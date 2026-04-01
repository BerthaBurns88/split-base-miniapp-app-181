'use client'

import { useEffect, useState } from 'react'
import { ArrowRightLeft, CheckCircle2, Plug2, Wallet } from 'lucide-react'
import { base } from 'wagmi/chains'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

import { StatusPill } from '@/components/status/status-pill'
import { cn, formatWalletAddress } from '@/lib/utils'

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Action failed'

export function WalletPanel() {
  const { address, chain, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [isConnected, chain?.id])

  const wrongNetwork = Boolean(isConnected && chain?.id !== base.id)

  return (
    <section className="panel soft-ring overflow-hidden">
      <div className="bg-panel-gradient px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-textMuted">Wallet</div>
            <div className="mt-2 text-lg font-semibold text-text">
              {isConnected ? formatWalletAddress(address ?? '') : 'Ready to connect'}
            </div>
          </div>
          <StatusPill
            label={!isConnected ? 'Ready' : wrongNetwork ? 'Wrong Network' : 'Connected'}
            tone={!isConnected ? 'warning' : wrongNetwork ? 'invalid' : 'success'}
          />
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        {!isConnected ? (
          <div className="grid grid-cols-2 gap-3">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                type="button"
                onClick={() => {
                  setError('')
                  connect(
                    { connector },
                    {
                      onError: (err) => setError(getErrorMessage(err)),
                    },
                  )
                }}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-text transition hover:bg-white/8"
              >
                <span>{connector.name}</span>
                <Plug2 className="h-4 w-4 text-primary" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-textMuted"
            >
              Disconnect
            </button>
            <button
              type="button"
              onClick={() =>
                switchChainAsync({ chainId: base.id }).catch((err) => setError(getErrorMessage(err)))
              }
              disabled={!wrongNetwork || isSwitching}
              className={cn(
                'flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm transition',
                wrongNetwork
                  ? 'bg-primary text-white'
                  : 'border border-success/35 bg-success/10 text-success',
              )}
            >
              {wrongNetwork ? (
                <>
                  <ArrowRightLeft className="h-4 w-4" />
                  Switch Base
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Base
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-textMuted">
          <Wallet className="h-4 w-4" />
          Base only
        </div>

        {error ? <div className="text-sm text-danger">{error}</div> : null}
        {isPending ? <div className="text-sm text-warning">Pending</div> : null}
      </div>
    </section>
  )
}
