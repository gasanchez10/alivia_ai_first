import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { BRIEFING_TYPE_FILTERS, type BriefingTypeFilter } from '@/lib/briefing-filters'
import { SpecialtyMultiSelect } from '@/components/app/briefing/SpecialtyMultiSelect'

interface BriefingFilterBarProps {
  typeFilter?: BriefingTypeFilter
  onTypeFilterChange?: (filter: BriefingTypeFilter) => void
  specialtyFilter: string[]
  onSpecialtyFilterChange: (filter: string[]) => void
  specialties: string[]
  showTypeFilter?: boolean
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-1.5 text-sm font-medium transition',
        active
          ? 'bg-violet text-white shadow-sm'
          : 'bg-white text-plum ring-1 ring-lilac/40 hover:ring-violet/30',
      )}
    >
      {children}
    </button>
  )
}

export function BriefingFilterBar({
  typeFilter,
  onTypeFilterChange,
  specialtyFilter,
  onSpecialtyFilterChange,
  specialties,
  showTypeFilter = true,
}: BriefingFilterBarProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 sm:flex-row sm:items-center',
        showTypeFilter ? 'sm:justify-between' : 'sm:justify-end',
      )}
    >
      {showTypeFilter && typeFilter && onTypeFilterChange && (
        <div className="flex flex-wrap gap-2">
          {BRIEFING_TYPE_FILTERS.map((f) => (
            <FilterPill
              key={f}
              active={typeFilter === f}
              onClick={() => onTypeFilterChange(f)}
            >
              {f}
            </FilterPill>
          ))}
        </div>
      )}

      <SpecialtyMultiSelect
        specialties={specialties}
        selected={specialtyFilter}
        onChange={onSpecialtyFilterChange}
        className="shrink-0 sm:ml-auto"
      />
    </div>
  )
}
