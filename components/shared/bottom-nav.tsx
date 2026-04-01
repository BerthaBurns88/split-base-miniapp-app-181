'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ReceiptText, ScrollText, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/builder', label: 'Builder', icon: Sparkles },
  { href: '/review', label: 'Review', icon: ReceiptText },
  { href: '/templates', label: 'Templates', icon: ScrollText },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[min(420px,calc(100%-24px))]">
      <div className="panel flex items-center justify-between px-3 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-w-[72px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] transition',
                active ? 'bg-white/8 text-text' : 'text-textMuted',
              )}
            >
              <Icon className={cn('h-4 w-4', active && 'text-primary')} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

