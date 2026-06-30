import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageHeader({
  section,
  title,
  description,
  action,
  className,
}: {
  section: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-mauve">{section}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-plum/75">{description}</p>}
      </div>
      {action}
    </div>
  )
}
