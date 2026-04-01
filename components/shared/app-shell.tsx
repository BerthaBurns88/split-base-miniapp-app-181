import { BottomNav } from '@/components/shared/bottom-nav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[420px] px-3 pb-28 pt-4">
      {children}
      <BottomNav />
    </div>
  )
}

