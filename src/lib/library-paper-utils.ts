import type { LibraryPaper, PubMedResult } from '@/lib/mock-app-data'
import { encounterPubMedResults } from '@/lib/mock-app-data'
import type { EvidenceToolkitContext } from '@/lib/evidence-toolkit'

export function resolveLibraryPaperDoi(paper: LibraryPaper): string {
  if (paper.doi) return paper.doi
  return encounterPubMedResults.find((r) => r.pmid === paper.pmid)?.doi ?? ''
}

export function filterLibraryPapers(papers: LibraryPaper[], query: string): LibraryPaper[] {
  const q = query.trim().toLowerCase()
  if (!q) return papers
  return papers.filter((p) => {
    const doi = resolveLibraryPaperDoi(p).toLowerCase()
    return p.title.toLowerCase().includes(q) || doi.includes(q)
  })
}

export function libraryPaperToPubMed(paper: LibraryPaper): PubMedResult {
  const full = encounterPubMedResults.find((r) => r.pmid === paper.pmid)
  if (full) return { ...full, selected: true }
  return {
    id: paper.id,
    title: paper.title,
    authors: '—',
    journal: paper.journal,
    pmid: paper.pmid,
    doi: resolveLibraryPaperDoi(paper) || '—',
    year: new Date().getFullYear(),
    studyType: 'Artículo',
    citations: 0,
    relevance: 85,
    openAccess: false,
    abstract: paper.excerpt,
    selected: true,
  }
}

export function contextFromLibraryPapers(papers: LibraryPaper[]): EvidenceToolkitContext {
  const withCtx = papers.find((p) => p.searchContext)
  if (withCtx?.searchContext) {
    return {
      patientLabel: withCtx.searchContext.patientLabel,
      clinicalQuestion: withCtx.searchContext.clinicalQuestion,
      sourceLabel: withCtx.searchContext.sourceLabel,
    }
  }
  const primary = papers[0]
  return {
    sourceLabel: 'Biblioteca · papers guardados',
    clinicalQuestion: primary
      ? `¿Qué implica clínicamente "${primary.title.slice(0, 55)}…"?`
      : 'Revisión de papers guardados',
    patientLabel: 'Papers de tu biblioteca',
  }
}

export function pubMedFromLibraryPapers(papers: LibraryPaper[]): PubMedResult[] {
  return papers.map(libraryPaperToPubMed)
}

export interface StructuredPaperSummary {
  question: string
  methods: string
  findings: string
  takeaway: string
  limitations: string
}

export function buildPaperSummary(paper: LibraryPaper): StructuredPaperSummary {
  const ctx = paper.searchContext
  return {
    question:
      ctx?.clinicalQuestion ??
      `¿Qué evidencia aporta este estudio sobre ${paper.title.slice(0, 60)}?`,
    methods: `Revisión del artículo en ${paper.journal} (PMID ${paper.pmid}). ${paper.excerpt}`,
    findings: paper.excerpt,
    takeaway: ctx
      ? `Aplicable al caso: ${ctx.patientLabel}. Usar al responder: ${ctx.clinicalQuestion}`
      : 'Integrar hallazgos al plan clínico citando PMID en ronda o exposición.',
    limitations: 'Interpretar junto con guías locales y perfil del paciente. Ver texto completo en PubMed.',
  }
}
