import { presentations as seedPresentations, type Presentation } from '@/lib/mock-app-data'
import type { LibrarySearchContext } from '@/lib/library-search-context'

const PRESENTATIONS_KEY = 'alivia.mock.presentations'

function load(): Presentation[] {
  try {
    const raw = localStorage.getItem(PRESENTATIONS_KEY)
    return raw ? (JSON.parse(raw) as Presentation[]) : seedPresentations
  } catch {
    return seedPresentations
  }
}

function save(items: Presentation[]) {
  localStorage.setItem(PRESENTATIONS_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('alivia-presentations-updated'))
  window.dispatchEvent(new Event('alivia-library-updated'))
}

export function getPresentations(): Presentation[] {
  const stored = localStorage.getItem(PRESENTATIONS_KEY)
  if (!stored) {
    save(seedPresentations)
    return seedPresentations
  }
  return load()
}

export function addPresentationFromSearch(params: {
  title: string
  pmid: string
  slideCount: number
  searchContext: LibrarySearchContext
}): Presentation {
  const item: Presentation = {
    id: `pr-${crypto.randomUUID().slice(0, 8)}`,
    title: params.title,
    slides: params.slideCount,
    updatedAt: 'Hoy',
    status: 'listo',
    pmid: params.pmid,
    searchContext: params.searchContext,
  }
  const next = [item, ...getPresentations()]
  save(next)
  return item
}
