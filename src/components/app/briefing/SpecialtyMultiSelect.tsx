import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { specialtyFilterLabel } from '@/lib/briefing-filters'

interface SpecialtyMultiSelectProps {
  specialties: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export function SpecialtyMultiSelect({
  specialties,
  selected,
  onChange,
  className,
}: SpecialtyMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const allSelected = selected.length === 0 || selected.length === specialties.length
  const label = specialtyFilterLabel(selected, specialties)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const toggleAll = () => {
    onChange([])
  }

  const toggleOne = (specialty: string) => {
    if (allSelected) {
      onChange([specialty])
      return
    }
    if (selected.includes(specialty)) {
      const next = selected.filter((s) => s !== specialty)
      onChange(next)
    } else {
      const next = [...selected, specialty]
      onChange(next.length === specialties.length ? [] : next)
    }
  }

  const isChecked = (specialty: string) =>
    allSelected || selected.includes(specialty)

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex min-w-[11rem] items-center justify-between gap-2 rounded-xl border border-lilac/40 bg-white px-3.5 py-2 text-sm font-medium text-plum shadow-sm transition hover:border-violet/30 hover:ring-1 hover:ring-violet/20',
          open && 'border-violet/40 ring-1 ring-violet/20',
        )}
      >
        <span className="truncate">
          <span className="text-plum/50">Especialidad · </span>
          {label}
        </span>
        <ChevronDown
          size={16}
          className={cn('shrink-0 text-plum/50 transition', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable
          className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-lilac/40 bg-white py-2 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={allSelected}
            onClick={toggleAll}
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-violet/5"
          >
            <span
              className={cn(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                allSelected ? 'border-violet bg-violet text-white' : 'border-lilac/60 bg-white',
              )}
            >
              {allSelected && <Check size={12} strokeWidth={3} />}
            </span>
            <span className="font-medium text-ink">Todas</span>
          </button>

          <div className="my-1 border-t border-lilac/30" />

          {specialties.map((specialty) => {
            const checked = isChecked(specialty)
            return (
              <button
                key={specialty}
                type="button"
                role="option"
                aria-selected={checked && !allSelected}
                onClick={() => toggleOne(specialty)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-violet/5"
              >
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                    checked ? 'border-violet bg-violet text-white' : 'border-lilac/60 bg-white',
                  )}
                >
                  {checked && <Check size={12} strokeWidth={3} />}
                </span>
                <span className="text-plum">{specialty}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
