import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOOLTIP_WIDTH = 288
const GAP = 10

interface FeatureTooltipProps {
  label: string
  description: string
  moreInfoLabel: string
}

export function FeatureTooltip({ label, description, moreInfoLabel }: FeatureTooltipProps) {
  const [hovering, setHovering] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipId = useId()

  const visible = hovering || pinned

  const updatePosition = useCallback(() => {
    const el = buttonRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const spaceRight = window.innerWidth - rect.right - GAP
    const anchorY = rect.top + rect.height / 2

    if (spaceRight >= TOOLTIP_WIDTH) {
      setCoords({ top: anchorY, left: rect.right + GAP })
      return
    }

    setCoords({ top: anchorY, left: Math.max(GAP, rect.left - TOOLTIP_WIDTH - GAP) })
  }, [])

  useEffect(() => {
    if (!visible) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [visible, updatePosition])

  useEffect(() => {
    if (!pinned) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPinned(false)
    }
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      const tooltip = document.getElementById(tooltipId)
      if (buttonRef.current?.contains(target) || tooltip?.contains(target)) return
      setPinned(false)
      setHovering(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [pinned, tooltipId])

  const show = () => {
    setHovering(true)
    updatePosition()
  }

  const hide = () => {
    if (!pinned) setHovering(false)
  }

  const tooltip =
    visible &&
    createPortal(
      <div
        id={tooltipId}
        role="tooltip"
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          width: TOOLTIP_WIDTH,
          transform: 'translateY(-50%)',
          zIndex: 9999,
        }}
        className="rounded-xl border border-lilac/40 bg-white p-3.5 text-left text-[13px] font-normal leading-relaxed text-plum shadow-2xl"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {description}
      </div>,
      document.body,
    )

  return (
    <>
      <span className="inline-flex items-start gap-1.5 text-plum/90">
        <span className="leading-snug">{label}</span>
        <button
          ref={buttonRef}
          type="button"
          className={cn(
            'mt-0.5 inline-flex shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/30',
            visible ? 'text-violet' : 'text-violet/45 hover:text-violet',
          )}
          aria-expanded={visible}
          aria-describedby={visible ? tooltipId : undefined}
          aria-label={`${moreInfoLabel}: ${label}`}
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
          onClick={() => setPinned((v) => !v)}
        >
          <Info size={15} strokeWidth={2.25} aria-hidden />
        </button>
      </span>
      {tooltip}
    </>
  )
}
