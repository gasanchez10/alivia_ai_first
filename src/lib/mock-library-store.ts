import { libraryPapers, encounterPubMedResults, type LibraryPaper, type PubMedResult } from '@/lib/mock-app-data'
import type { LibrarySearchContext } from '@/lib/library-search-context'

const SAVED_KEY = 'alivia.mock.savedPmids'
const LIBRARY_KEY = 'alivia.mock.libraryPapers'

function loadSavedPmids(): Set<string> {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function persistSavedPmids(set: Set<string>) {
  localStorage.setItem(SAVED_KEY, JSON.stringify([...set]))
}

function loadStoredLibrary(): LibraryPaper[] | null {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY)
    return raw ? (JSON.parse(raw) as LibraryPaper[]) : null
  } catch {
    return null
  }
}

function saveLibrary(papers: LibraryPaper[]) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(papers))
  window.dispatchEvent(new Event('alivia-library-updated'))
}

export function getSavedPmids(): Set<string> {
  return loadSavedPmids()
}

export function isPmidSaved(pmid: string): boolean {
  return loadSavedPmids().has(pmid)
}

export function ensurePmidSaved(pmid: string) {
  const set = loadSavedPmids()
  if (!set.has(pmid)) {
    set.add(pmid)
    persistSavedPmids(set)
  }
}

export function toggleSavedPmid(pmid: string): boolean {
  const set = loadSavedPmids()
  if (set.has(pmid)) {
    set.delete(pmid)
  } else {
    set.add(pmid)
  }
  persistSavedPmids(set)
  return set.has(pmid)
}

export function getLibraryPapers(): LibraryPaper[] {
  const stored = loadStoredLibrary()
  if (!stored) {
    saveLibrary(libraryPapers)
    return libraryPapers
  }
  return stored
}

export function addPapersFromPubMed(
  results: PubMedResult[],
  source: string,
  searchContext?: LibrarySearchContext,
): number {
  const selected = results.filter((r) => r.selected)
  if (selected.length === 0) return 0

  const papers = getLibraryPapers()
  const existingPmids = new Set(papers.map((p) => p.pmid))
  let added = 0

  for (const paper of selected) {
    ensurePmidSaved(paper.pmid)
    const existing = papers.find((p) => p.pmid === paper.pmid)
    if (existing) {
      if (searchContext && !existing.searchContext) {
        existing.searchContext = searchContext
      }
      continue
    }

    papers.unshift({
      id: `lib-${paper.pmid}`,
      title: paper.title,
      journal: paper.journal,
      pmid: paper.pmid,
      doi: paper.doi,
      read: false,
      savedAt: 'Hoy',
      tags: ['Ronda', source],
      excerpt:
        paper.abstract.length > 160
          ? `${paper.abstract.slice(0, 157)}…`
          : paper.abstract,
      searchContext,
    })
    existingPmids.add(paper.pmid)
    added++
  }

  if (added > 0 || searchContext) saveLibrary(papers)
  return added
}

/** Sincroniza papers recién marcados en el flujo de ronda. */
export function syncNewlySelectedPapers(
  articles: PubMedResult[],
  alreadySyncedPmids: string[],
  source: string,
  searchContext?: LibrarySearchContext,
): string[] {
  const selected = articles.filter((a) => a.selected)
  const pending = selected.filter((a) => !alreadySyncedPmids.includes(a.pmid))
  if (pending.length > 0) {
    addPapersFromPubMed(pending, source, searchContext)
  } else if (searchContext && selected.length > 0) {
    addPapersFromPubMed(selected, source, searchContext)
  }
  return [...new Set([...alreadySyncedPmids, ...selected.map((a) => a.pmid)])]
}

export function setPaperReadStatus(id: string, read: boolean) {
  const papers = getLibraryPapers()
  const next = papers.map((p) => (p.id === id ? { ...p, read } : p))
  saveLibrary(next)
}

export function addPaperToLibrary(params: {
  pmid: string
  uploadFileName?: string
}): LibraryPaper | null {
  const pmid = params.pmid.trim()
  if (!pmid) return null

  const papers = getLibraryPapers()
  const existing = papers.find((p) => p.pmid === pmid)
  if (existing) return existing

  const fromPubMed = encounterPubMedResults.find((r) => r.pmid === pmid)
  const item: LibraryPaper = fromPubMed
    ? {
        id: `lib-${pmid}`,
        title: fromPubMed.title,
        journal: fromPubMed.journal,
        pmid,
        doi: fromPubMed.doi,
        read: false,
        savedAt: 'Hoy',
        tags: params.uploadFileName ? ['Subido', 'Biblioteca'] : ['Biblioteca'],
        excerpt:
          fromPubMed.abstract.length > 160
            ? `${fromPubMed.abstract.slice(0, 157)}…`
            : fromPubMed.abstract,
        searchContext: {
          sourceLabel: 'Biblioteca · subida manual',
          clinicalQuestion: `Revisión del artículo PMID ${pmid}`,
          patientLabel: 'Paper añadido a tu biblioteca',
          pmids: [pmid],
          origin: 'ronda',
        },
      }
    : {
        id: `lib-${pmid}`,
        title: params.uploadFileName?.replace(/\.[^.]+$/, '') ?? `Artículo PMID ${pmid}`,
        journal: 'Subido',
        pmid,
        read: false,
        savedAt: 'Hoy',
        tags: ['Subido'],
        excerpt: params.uploadFileName
          ? `Archivo subido: ${params.uploadFileName}. Vinculado a PMID ${pmid}.`
          : `Paper añadido manualmente (PMID ${pmid}).`,
        searchContext: {
          sourceLabel: 'Biblioteca · subida manual',
          clinicalQuestion: `¿Qué aporta el artículo PMID ${pmid}?`,
          patientLabel: 'Paper añadido a tu biblioteca',
          pmids: [pmid],
          origin: 'ronda',
        },
      }

  ensurePmidSaved(pmid)
  saveLibrary([item, ...papers])
  return item
}
