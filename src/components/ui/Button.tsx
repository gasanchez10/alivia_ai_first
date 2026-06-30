import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all',
        variant === 'primary' && 'bg-violet text-white hover:bg-violet-600 shadow-md shadow-violet/20',
        variant === 'secondary' && 'border border-lilac bg-white text-plum hover:bg-lilac-50',
        variant === 'ghost' && 'text-plum hover:bg-lilac-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
