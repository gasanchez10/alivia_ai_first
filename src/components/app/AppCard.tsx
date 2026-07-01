import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AppCard({
  children,
  className,
  hover,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-lilac/30 bg-white p-5 shadow-sm',
        hover && 'transition hover:border-violet/25 hover:shadow-md',
        className,
      )}
    >
      {children}
    </div>
  )
}
