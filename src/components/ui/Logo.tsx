import { cn } from '@/lib/utils'

export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill="url(#alivia-mark-bg)" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui,sans-serif"
        fontSize="22"
        fontWeight="700"
      >
        ia
      </text>
      <circle cx="30" cy="11" r="4.5" fill="white" />
      <defs>
        <linearGradient id="alivia-mark-bg" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E3FF3" />
          <stop offset="1" stopColor="#5A3360" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Logo({
  className,
  inverted,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={40} />
      <span
        className={cn(
          'font-display text-[1.65rem] font-semibold tracking-tight leading-none',
          inverted ? 'text-white' : 'text-ink',
        )}
      >
        alivia
      </span>
    </div>
  )
}
