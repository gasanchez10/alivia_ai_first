import {
  encounterPlan,
  encounterStudyPlan,
  type PubMedResult,
} from '@/lib/mock-app-data'
import { addPapersFromPubMed } from '@/lib/mock-library-store'
import type { LibrarySearchContext } from '@/lib/library-search-context'
import { addManagementPlanFromRonda } from '@/lib/mock-management-plans-store'
import {
  upsertRondaSession,
  type RondaSession,
  type RondaStudyMaterial,
} from '@/lib/mock-ronda-store'

export function buildStudyMaterial(selected: PubMedResult[]): RondaStudyMaterial {
  return {
    patient: encounterPlan.patient,
    managementItems: encounterPlan.items.filter((item) =>
      selected.some((a) => a.pmid === item.pmid),
    ),
    specialistQuestion: encounterPlan.specialistQuestion,
    taskSummary: encounterStudyPlan.taskSummary,
    answerDraft: encounterStudyPlan.answerDraft,
    readings: encounterStudyPlan.readings.filter((r) =>
      selected.some((a) => a.pmid === r.pmid),
    ),
    quiz: encounterStudyPlan.quiz,
    quizMinutes: encounterStudyPlan.quizMinutes,
  }
}

/** Papers seleccionados → biblioteca; planes → material de estudio. */
export function syncRondaOutputs(session: RondaSession, selected: PubMedResult[]): RondaSession {
  const material = buildStudyMaterial(selected)
  const searchContext: LibrarySearchContext = {
    sourceLabel: `Ronda · ${session.title}`,
    clinicalQuestion: material.specialistQuestion,
    patientLabel: material.patient,
    pmids: selected.map((a) => a.pmid),
    origin: 'ronda',
  }
  addPapersFromPubMed(selected, session.title, searchContext)
  const syncedPmids = [
    ...new Set([...session.librarySyncedPmids, ...selected.map((a) => a.pmid)]),
  ]

  let next: RondaSession = {
    ...session,
    status: 'completed',
    studyMaterial: material,
    librarySyncedPmids: syncedPmids,
  }

  if (!session.studySynced) {
    addManagementPlanFromRonda(next, material, selected)
    next = { ...next, studySynced: true }
  }

  return upsertRondaSession(next)
}
