import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

import { BASE_DATA_SUFFIX } from '@/lib/attribution'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [coinbaseWallet({ appName: 'Split' }), injected()],
  dataSuffix: BASE_DATA_SUFFIX,
  transports: {
    [base.id]: http(),
  },
})
