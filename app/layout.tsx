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
      <head>
        <meta name="base:app_id" content="69cce0411aacdcc17b255184" />
        <meta
          name="talentapp:project_verification"
          content="5a98f1beba25f1dc6ebaa75939a7a17144f0b89f0dc11d96531b4f64a5f6db7c0e58f95306c69c717dcc72210fc0975787d32278a992c1bb05349fc3a0eb8646"
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
