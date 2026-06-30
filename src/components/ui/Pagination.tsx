import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const DEFAULT_PAGE_SIZE = 5

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, total)

  const pages = getPageNumbers(safePage, totalPages)

  return (
    <nav
      aria-label="Paginación"
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}
    >
      <p className="text-sm text-plum/60">
        Mostrando <strong className="text-ink">{start}</strong>–<strong className="text-ink">{end}</strong>{' '}
        de <strong className="text-ink">{total}</strong>
      </p>

      <div className="flex items-center gap-1">
        <PageButton
          aria-label="Página anterior"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft size={18} />
        </PageButton>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-plum/40">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              active={p === safePage}
              onClick={() => onPageChange(p)}
              aria-label={`Página ${p}`}
              aria-current={p === safePage ? 'page' : undefined}
            >
              {p}
            </PageButton>
          ),
        )}

        <PageButton
          aria-label="Página siguiente"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          <ChevronRight size={18} />
        </PageButton>
      </div>
    </nav>
  )
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ...rest
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition',
        active && 'bg-violet text-white shadow-sm',
        !active && !disabled && 'text-plum hover:bg-violet/10 hover:text-violet',
        disabled && 'cursor-not-allowed text-plum/30',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

function getPageNumbers(current: number, total: number): Array<number | '…'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 3) {
    return [1, 2, 3, 4, '…', total]
  }
  if (current >= total - 2) {
    return [1, '…', total - 3, total - 2, total - 1, total]
  }
  return [1, '…', current - 1, current, current + 1, '…', total]
}
