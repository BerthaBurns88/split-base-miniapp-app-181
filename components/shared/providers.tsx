'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'

import { SplitFormProvider } from '@/hooks/useSplitForm'
import { wagmiConfig } from '@/lib/wagmi'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SplitFormProvider>{children}</SplitFormProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

