import type { Metadata } from 'next'

import './globals.css'
import { AppShell } from '@/components/shared/app-shell'
import { Providers } from '@/components/shared/providers'

export const metadata: Metadata = {
  title: 'Split',
  description:
    'Instant ETH split mini app on Base for teams, collaborators, and shared settlements.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}

