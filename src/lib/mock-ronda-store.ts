import {
  encounterClinicalTerms,
  encounterPubMedResults,
  encounterTranscript,
  type ClinicalTerm,
  type PubMedResult,
} from '@/lib/mock-app-data'

export type RondaInputMode = 'record' | 'upload' | 'text'

export interface RondaStudyMaterial {
  patient: string
  managementItems: { claim: string; pmid: string }[]
  specialistQuestion: string
  taskSummary: string
  answerDraft: string
  readings: { title: string; pmid: string; minutes: number }[]
  quiz: string
  quizMinutes: number
}

export interface RondaSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'completed'
  step: number
  inputMode: RondaInputMode
  inputText: string
  hasInput: boolean
  uploadedFile: string | null
  clinicalTerms: ClinicalTerm[]
  articles: PubMedResult[]
  papersPage: number
  studyMaterial?: RondaStudyMaterial
  librarySyncedPmids: string[]
  studySynced: boolean
}

const RONDAS_KEY = 'alivia.mock.rondas'
const ACTIVE_RONDA_KEY = 'alivia.mock.activeRondaId'

function loadRondas(): RondaSession[] {
  try {
    const raw = localStorage.getItem(RONDAS_KEY)
    return raw ? (JSON.parse(raw) as RondaSession[]) : []
  } catch {
    return []
  }
}

function saveRondas(sessions: RondaSession[]) {
  localStorage.setItem(RONDAS_KEY, JSON.stringify(sessions))
}

export function getActiveRondaId(): string | null {
  return localStorage.getItem(ACTIVE_RONDA_KEY)
}

export function setActiveRondaId(id: string) {
  localStorage.setItem(ACTIVE_RONDA_KEY, id)
}

export function listRondaSessions(): RondaSession[] {
  return loadRondas().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

export function deriveRondaTitle(inputText: string, hasInput: boolean): string {
  if (!hasInput || !inputText.trim()) return 'Nueva ronda'
  const first = inputText.trim().split('\n')[0].replace(/^[^:]+:\s*/, '')
  const line = first.trim() || inputText.trim().split('\n')[0]
  return line.length > 52 ? `${line.slice(0, 49)}…` : line
}

export function createEmptyRondaSession(): RondaSession {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: 'Nueva ronda',
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    step: 1,
    inputMode: 'record',
    inputText: '',
    hasInput: false,
    uploadedFile: null,
    clinicalTerms: encounterClinicalTerms.map((t) => ({ ...t })),
    articles: encounterPubMedResults.map((a) => ({ ...a })),
    papersPage: 1,
    librarySyncedPmids: [],
    studySynced: false,
  }
}

export function getRondaSession(id: string): RondaSession | undefined {
  return loadRondas().find((s) => s.id === id)
}

export function upsertRondaSession(session: RondaSession): RondaSession {
  const sessions = loadRondas()
  const idx = sessions.findIndex((s) => s.id === session.id)
  const next = { ...session, updatedAt: new Date().toISOString() }
  if (idx >= 0) sessions[idx] = next
  else sessions.push(next)
  saveRondas(sessions)
  return next
}

export function deleteRondaSession(id: string) {
  const sessions = loadRondas().filter((s) => s.id !== id)
  saveRondas(sessions)
  if (getActiveRondaId() === id) {
    localStorage.removeItem(ACTIVE_RONDA_KEY)
  }
}

export function getOrCreateActiveRonda(): RondaSession {
  const activeId = getActiveRondaId()
  if (activeId) {
    const existing = getRondaSession(activeId)
    if (existing) return existing
  }
  const created = createEmptyRondaSession()
  upsertRondaSession(created)
  setActiveRondaId(created.id)
  return created
}

export function sessionToDraftInput(session: RondaSession) {
  return {
    step: session.step,
    inputMode: session.inputMode,
    inputText: session.inputText,
    hasInput: session.hasInput,
    uploadedFile: session.uploadedFile,
    clinicalTerms: session.clinicalTerms,
    articles: session.articles,
    papersPage: session.papersPage,
    studyMaterial: session.studyMaterial,
    librarySyncedPmids: session.librarySyncedPmids,
    studySynced: session.studySynced,
    status: session.status,
    title: session.title,
  }
}

export function buildSessionFromState(
  id: string,
  base: Pick<RondaSession, 'createdAt' | 'librarySyncedPmids' | 'studySynced' | 'studyMaterial'>,
  state: {
    step: number
    inputMode: RondaInputMode
    inputText: string
    hasInput: boolean
    uploadedFile: string | null
    clinicalTerms: ClinicalTerm[]
    articles: PubMedResult[]
    papersPage: number
    status: RondaSession['status']
  },
): RondaSession {
  const title = deriveRondaTitle(state.inputText || encounterTranscript, state.hasInput)
  return {
    id,
    title,
    createdAt: base.createdAt,
    updatedAt: new Date().toISOString(),
    status: state.status,
    step: state.step,
    inputMode: state.inputMode,
    inputText: state.inputText,
    hasInput: state.hasInput,
    uploadedFile: state.uploadedFile,
    clinicalTerms: state.clinicalTerms,
    articles: state.articles,
    papersPage: state.papersPage,
    studyMaterial: base.studyMaterial,
    librarySyncedPmids: base.librarySyncedPmids,
    studySynced: base.studySynced,
  }
}
