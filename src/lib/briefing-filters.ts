import type { BriefingFeedItem, BriefingPaper } from '@/lib/mock-briefing'

export const BRIEFING_TYPE_FILTERS = ['Todo', 'Guías', 'Congresos', 'Papers'] as const
export type BriefingTypeFilter = (typeof BRIEFING_TYPE_FILTERS)[number]

const SPECIALTY_SEP = ' · '

export function splitBriefingSpecialties(specialty: string): string[] {
  return specialty
    .split(SPECIALTY_SEP)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function collectBriefingSpecialties(
  items: Array<{ specialty: string }>,
): string[] {
  const set = new Set<string>()
  for (const item of items) {
    for (const s of splitBriefingSpecialties(item.specialty)) {
      set.add(s)
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'es'))
}

/** Vacío o todas seleccionadas = sin filtro. */
export function matchesBriefingSpecialties(
  itemSpecialty: string,
  selected: string[],
  allSpecialties: string[],
): boolean {
  if (selected.length === 0 || selected.length === allSpecialties.length) {
    return true
  }
  const itemTags = splitBriefingSpecialties(itemSpecialty)
  return itemTags.some((tag) => selected.includes(tag))
}

export function matchesBriefingType(
  item: BriefingFeedItem,
  filter: BriefingTypeFilter,
): boolean {
  if (filter === 'Todo') return true
  if (filter === 'Guías') return item.type === 'guide'
  if (filter === 'Congresos') return item.type === 'congress'
  if (filter === 'Papers') return item.type === 'paper'
  return false
}

export function filterBriefingFeed(
  items: BriefingFeedItem[],
  typeFilter: BriefingTypeFilter,
  specialtyFilter: string[],
  allSpecialties: string[],
): BriefingFeedItem[] {
  return items.filter(
    (item) =>
      matchesBriefingType(item, typeFilter) &&
      matchesBriefingSpecialties(item.specialty, specialtyFilter, allSpecialties),
  )
}

export function filterBriefingPapers(
  papers: BriefingPaper[],
  specialtyFilter: string[],
  allSpecialties: string[],
): BriefingPaper[] {
  return papers.filter((paper) =>
    matchesBriefingSpecialties(paper.specialty, specialtyFilter, allSpecialties),
  )
}

export function resolveDefaultSpecialtyFilters(
  userSpecialty: string | undefined,
  available: string[],
): string[] {
  if (userSpecialty && available.includes(userSpecialty)) {
    return [userSpecialty]
  }
  return []
}

export function specialtyFilterLabel(selected: string[], allSpecialties: string[]): string {
  if (selected.length === 0 || selected.length === allSpecialties.length) {
    return 'Todas'
  }
  if (selected.length === 1) {
    return selected[0]
  }
  return `${selected.length} seleccionadas`
}

export function specialtyFilterSummary(
  selected: string[],
  allSpecialties: string[],
): string {
  if (selected.length === 0 || selected.length === allSpecialties.length) {
    return 'todas las especialidades'
  }
  if (selected.length === 1) {
    return selected[0]
  }
  return selected.join(', ')
}
