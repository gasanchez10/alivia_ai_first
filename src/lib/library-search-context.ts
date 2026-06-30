import type { EvidenceToolkitContext } from '@/lib/evidence-toolkit'
import type { PubMedResult } from '@/lib/mock-app-data'
import type { StoredQuiz } from '@/lib/mock-quizzes-store'

export type SearchOrigin = 'ronda' | 'consulta'

export interface LibrarySearchContext {
  sourceLabel: string
  clinicalQuestion: string
  patientLabel: string
  pmids: string[]
  origin: SearchOrigin
}

export function searchOriginPath(origin: SearchOrigin): string {
  return origin === 'consulta' ? '/app/consulta' : '/app/ronda'
}

export function contextFromEvidence(
  context: EvidenceToolkitContext,
  papers: PubMedResult[],
): LibrarySearchContext {
  const origin: SearchOrigin = context.sourceLabel.toLowerCase().includes('consulta')
    ? 'consulta'
    : 'ronda'
  return {
    sourceLabel: context.sourceLabel,
    clinicalQuestion: context.clinicalQuestion,
    patientLabel: context.patientLabel,
    pmids: papers.map((p) => p.pmid),
    origin,
  }
}

export function contextFromQuiz(quiz: StoredQuiz): LibrarySearchContext {
  return {
    sourceLabel: quiz.sourceLabel,
    clinicalQuestion: quiz.clinicalQuestion,
    patientLabel: quiz.patientLabel,
    pmids: quiz.pmids,
    origin: quiz.sourceLabel.toLowerCase().includes('consulta') ? 'consulta' : 'ronda',
  }
}

export function librarySectionPath(section: string): string {
  if (section === 'papers') return '/app/biblioteca'
  return `/app/biblioteca/${section}`
}
