import type { EvidenceToolkitContext } from '@/lib/evidence-toolkit'
import type { PubMedResult } from '@/lib/mock-app-data'
import type { StoredQuiz } from '@/lib/mock-quizzes-store'

export type SearchOrigin = 'ronda'

export interface LibrarySearchContext {
  sourceLabel: string
  clinicalQuestion: string
  patientLabel: string
  pmids: string[]
  origin: SearchOrigin
}

export function searchOriginPath(_origin: SearchOrigin = 'ronda'): string {
  return '/app/ronda'
}

export function contextFromEvidence(
  context: EvidenceToolkitContext,
  papers: PubMedResult[],
): LibrarySearchContext {
  const origin: SearchOrigin = 'ronda'
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
    origin: 'ronda',
  }
}

export function librarySectionPath(section: string): string {
  if (section === 'papers') return '/app/biblioteca'
  return `/app/biblioteca/${section}`
}
