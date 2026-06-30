import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 md:px-8', className)}>{children}</div>
  )
}

export function Section({
  id,
  children,
  className,
  alt,
}: {
  id?: string
  children: ReactNode
  className?: string
  alt?: boolean
}) {
  return (
    <section
      id={id}
      className={cn('py-[var(--section-pad)]', alt ? 'bg-lilac-50' : 'bg-white', className)}
    >
      {children}
    </section>
  )
}
