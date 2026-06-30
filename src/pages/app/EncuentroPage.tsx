import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Mic,
  MicOff,
  Upload,
  FileText,
  FileCheck,
  GraduationCap,
  Check,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { RondaProgressBar } from '@/components/app/ronda/RondaProgressBar'
import { ClinicalTermsEditor } from '@/components/app/ronda/ClinicalTermsEditor'
import { PubMedPaperCard } from '@/components/app/ronda/PubMedPaperCard'
import { RondaSessionBar } from '@/components/app/ronda/RondaSessionBar'
import { EvidenceToolkit } from '@/components/app/evidence/EvidenceToolkit'
import { Button } from '@/components/ui/Button'
import { DEFAULT_PAGE_SIZE, Pagination } from '@/components/ui/Pagination'
import { syncNewlySelectedPapers } from '@/lib/mock-library-store'
import {
  buildSessionFromState,
  createEmptyRondaSession,
  deleteRondaSession,
  deriveRondaTitle,
  getOrCreateActiveRonda,
  getRondaSession,
  listRondaSessions,
  setActiveRondaId,
  upsertRondaSession,
  type RondaInputMode,
  type RondaSession,
  type RondaStudyMaterial,
} from '@/lib/mock-ronda-store'
import {
  encounterClinicalTerms,
  encounterPlan,
  encounterPubMedResults,
  encounterTranscript,
  type ClinicalTerm,
} from '@/lib/mock-app-data'
import { rondaEvidenceContext } from '@/lib/evidence-toolkit'
import { contextFromEvidence } from '@/lib/library-search-context'
import { buildStudyMaterial, syncRondaOutputs } from '@/lib/ronda-sync'
import { cn } from '@/lib/utils'

const inputModes: { id: RondaInputMode; label: string; icon: typeof Mic }[] = [
  { id: 'record', label: 'Grabar', icon: Mic },
  { id: 'upload', label: 'Subir audio', icon: Upload },
  { id: 'text', label: 'Escribir', icon: FileText },
]

function applySessionToState(session: RondaSession) {
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
    createdAt: session.createdAt,
  }
}

export function EncuentroPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const hydrated = useRef(false)
  const outputsSynced = useRef(false)

  const [sessionId, setSessionId] = useState('')
  const [sessions, setSessions] = useState<RondaSession[]>([])
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState('')
  const [status, setStatus] = useState<RondaSession['status']>('draft')
  const [librarySyncedPmids, setLibrarySyncedPmids] = useState<string[]>([])
  const [studySynced, setStudySynced] = useState(false)
  const [studyMaterial, setStudyMaterial] = useState<RondaStudyMaterial | undefined>()

  const [step, setStep] = useState(1)
  const [inputMode, setInputMode] = useState<RondaInputMode>('record')
  const [recording, setRecording] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [hasInput, setHasInput] = useState(false)
  const [articles, setArticles] = useState(encounterPubMedResults)
  const [clinicalTerms, setClinicalTerms] = useState<ClinicalTerm[]>(encounterClinicalTerms)
  const [papersPage, setPapersPage] = useState(1)

  const loadSession = useCallback((session: RondaSession) => {
    const s = applySessionToState(session)
    setSessionId(session.id)
    setActiveRondaId(session.id)
    setStep(s.step)
    setInputMode(s.inputMode)
    setInputText(s.inputText)
    setHasInput(s.hasInput)
    setUploadedFile(s.uploadedFile)
    setClinicalTerms(s.clinicalTerms)
    setArticles(s.articles)
    setPapersPage(s.papersPage)
    setStudyMaterial(s.studyMaterial)
    setLibrarySyncedPmids(s.librarySyncedPmids)
    setStudySynced(s.studySynced)
    setStatus(s.status)
    setCreatedAt(s.createdAt)
    setLastSaved(session.updatedAt)
    outputsSynced.current = s.step === 4 && s.studySynced
  }, [])

  useEffect(() => {
    const active = getOrCreateActiveRonda()
    loadSession(active)
    setSessions(listRondaSessions())
    hydrated.current = true
  }, [loadSession])

  const persistDraft = useCallback(() => {
    if (!sessionId || !hydrated.current) return
    const session = buildSessionFromState(
      sessionId,
      { createdAt, librarySyncedPmids, studySynced, studyMaterial },
      {
        step,
        inputMode,
        inputText,
        hasInput,
        uploadedFile,
        clinicalTerms,
        articles,
        papersPage,
        status: status === 'completed' && step < 4 ? 'draft' : status,
      },
    )
    const saved = upsertRondaSession(session)
    setLastSaved(saved.updatedAt)
    setSessions(listRondaSessions())
  }, [
    sessionId,
    createdAt,
    librarySyncedPmids,
    studySynced,
    studyMaterial,
    step,
    inputMode,
    inputText,
    hasInput,
    uploadedFile,
    clinicalTerms,
    articles,
    papersPage,
    status,
  ])

  useEffect(() => {
    if (!hydrated.current) return
    const timer = window.setTimeout(persistDraft, 350)
    return () => window.clearTimeout(timer)
  }, [persistDraft])

  const displayText = hasInput ? inputText || encounterTranscript : ''
  const selectedArticles = articles.filter((a) => a.selected)
  const rondaTitle = deriveRondaTitle(inputText || encounterTranscript, hasInput)

  const papersTotalPages = Math.max(1, Math.ceil(articles.length / DEFAULT_PAGE_SIZE))
  const safePapersPage = Math.min(papersPage, papersTotalPages)

  const paginatedArticles = useMemo(() => {
    const start = (safePapersPage - 1) * DEFAULT_PAGE_SIZE
    return articles.slice(start, start + DEFAULT_PAGE_SIZE)
  }, [articles, safePapersPage])

  const materialForDisplay =
    studyMaterial ?? (step === 4 ? buildStudyMaterial(selectedArticles) : undefined)

  const evidenceContext = rondaEvidenceContext(
    rondaTitle,
    materialForDisplay?.patient ?? encounterPlan.patient,
    materialForDisplay?.specialistQuestion ?? encounterPlan.specialistQuestion,
  )

  const syncLibraryFromSelection = useCallback(
    (nextArticles: typeof articles) => {
      const title = deriveRondaTitle(inputText || encounterTranscript, hasInput)
      const ctx = rondaEvidenceContext(
        title,
        materialForDisplay?.patient ?? encounterPlan.patient,
        materialForDisplay?.specialistQuestion ?? encounterPlan.specialistQuestion,
      )
      const searchContext = contextFromEvidence(
        ctx,
        nextArticles.filter((a) => a.selected),
      )
      const synced = syncNewlySelectedPapers(
        nextArticles,
        librarySyncedPmids,
        title,
        searchContext,
      )
      if (synced.length !== librarySyncedPmids.length) {
        setLibrarySyncedPmids(synced)
      }
    },
    [hasInput, inputText, librarySyncedPmids, materialForDisplay],
  )

  const toggleArticle = (id: string) => {
    setArticles((prev) => {
      const target = prev.find((a) => a.id === id)
      const selectedCount = prev.filter((a) => a.selected).length
      if (target?.selected && selectedCount <= 1) return prev
      const next = prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
      syncLibraryFromSelection(next)
      return next
    })
  }

  const finalizeInput = (text: string) => {
    setInputText(text)
    setHasInput(true)
    setRecording(false)
    setClinicalTerms(encounterClinicalTerms.map((t) => ({ ...t })))
    setStep(2)
  }

  const handleFileUpload = (file: File | undefined) => {
    if (!file) return
    setUploadedFile(file.name)
    finalizeInput(encounterTranscript)
  }

  const goToPapersStep = () => {
    setPapersPage(1)
    setStep(3)
  }

  const goToPlansStep = () => {
    outputsSynced.current = false
    setStep(4)
  }

  useEffect(() => {
    if (step !== 4 || !sessionId || outputsSynced.current) return
    const session = getRondaSession(sessionId)
    if (!session) return
    const selected = articles.filter((a) => a.selected)
    const updated = syncRondaOutputs(session, selected)
    loadSession(updated)
    outputsSynced.current = true
  }, [step, sessionId, articles, loadSession])

  const startNewRonda = () => {
    const created = createEmptyRondaSession()
    upsertRondaSession(created)
    setActiveRondaId(created.id)
    loadSession(created)
    setSessions(listRondaSessions())
    outputsSynced.current = false
    setRecording(false)
  }

  const switchRonda = (id: string) => {
    const session = getRondaSession(id)
    if (session) loadSession(session)
  }

  const deleteRonda = (id: string) => {
    const session = getRondaSession(id)
    if (!session) return
    const confirmed = window.confirm(
      `¿Eliminar la ronda "${session.title}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    const wasActive = id === sessionId
    deleteRondaSession(id)
    const remaining = listRondaSessions()
    setSessions(remaining)

    if (!wasActive) return

    if (remaining.length > 0) {
      loadSession(remaining[0])
      setActiveRondaId(remaining[0].id)
    } else {
      startNewRonda()
    }
  }

  const canAdvanceFromInput =
    inputMode === 'text' ? inputText.trim().length > 20 : hasInput

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        section="Clínico"
        title="La Ronda"
        description="Tu progreso se guarda automáticamente. Los papers elegidos van a la biblioteca y los planes a tu material de estudio."
      />

      <RondaSessionBar
        sessions={sessions}
        activeId={sessionId}
        lastSaved={lastSaved}
        onSelect={switchRonda}
        onNew={startNewRonda}
        onDelete={deleteRonda}
      />

      <RondaProgressBar step={step} onStepChange={setStep} />

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {inputModes.map((mode) => {
              const Icon = mode.icon
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setInputMode(mode.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                    inputMode === mode.id
                      ? 'bg-violet text-white shadow-sm'
                      : 'bg-white text-plum ring-1 ring-lilac/40 hover:ring-violet/30',
                  )}
                >
                  <Icon size={16} />
                  {mode.label}
                </button>
              )
            })}
          </div>

          {inputMode === 'record' && (
            <AppCard className="text-center">
              <button
                type="button"
                onClick={() => setRecording((r) => !r)}
                className={cn(
                  'mx-auto flex h-24 w-24 items-center justify-center rounded-full transition-all',
                  recording
                    ? 'animate-pulse bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-violet text-white shadow-lg shadow-violet/30 hover:scale-105',
                )}
              >
                {recording ? <MicOff size={36} /> : <Mic size={36} />}
              </button>
              <p className="mt-4 font-semibold text-ink">
                {recording ? 'Grabando… (simulación)' : 'Toca para grabar la ronda'}
              </p>
              <p className="mt-1 text-sm text-plum/60">
                Consentimiento del paciente o modo enseñanza · sin datos identificables
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {recording && (
                  <>
                    <Button variant="secondary" onClick={() => setRecording(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => finalizeInput(encounterTranscript)}>
                      Finalizar y transcribir
                    </Button>
                  </>
                )}
              </div>
            </AppCard>
          )}

          {inputMode === 'upload' && (
            <AppCard>
              <input
                ref={fileRef}
                type="file"
                accept="audio/*,.mp3,.m4a,.wav,.webm"
                className="sr-only"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
              <div className="flex flex-col items-center py-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet/10 text-violet">
                  <Upload size={28} />
                </span>
                <p className="mt-4 font-semibold text-ink">Sube una grabación existente</p>
                <p className="mt-1 max-w-sm text-sm text-plum/60">
                  MP3, M4A, WAV o WebM. Alivia transcribe y continúa con el mismo flujo.
                </p>
                <Button className="mt-6" variant="secondary" onClick={() => fileRef.current?.click()}>
                  Elegir archivo
                </Button>
                {uploadedFile && (
                  <p className="mt-3 text-sm text-green-700">
                    <Check size={14} className="mr-1 inline" />
                    {uploadedFile} · transcrito
                  </p>
                )}
              </div>
            </AppCard>
          )}

          {inputMode === 'text' && (
            <AppCard>
              <p className="text-xs font-bold uppercase tracking-widest text-mauve">
                Texto del caso o de la ronda
              </p>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pega la nota de evolución, el resumen del caso o la conversación con el especialista…"
                rows={8}
                className="mt-3 w-full resize-y rounded-xl border border-lilac/40 bg-white px-4 py-3 text-sm leading-relaxed text-plum/90 placeholder:text-plum/40 focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/20"
              />
              <p className="mt-2 text-xs text-plum/50">
                No hace falta grabar: con el texto bastará para extraer términos y buscar evidencia.
              </p>
              <Button
                className="mt-4"
                disabled={!canAdvanceFromInput}
                onClick={() => finalizeInput(inputText.trim())}
              >
                Continuar con este texto
              </Button>
            </AppCard>
          )}

          {recording && inputMode === 'record' && (
            <AppCard className="border-dashed border-violet/30 bg-violet/5">
              <p className="text-xs font-bold uppercase tracking-widest text-mauve">Transcripción en vivo</p>
              <p className="mt-3 text-sm leading-relaxed text-plum/85 italic">{encounterTranscript}</p>
            </AppCard>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <AppCard>
            <p className="text-xs font-bold uppercase tracking-widest text-mauve">Texto de entrada</p>
            <p className="mt-2 text-sm leading-relaxed text-plum/85">{displayText}</p>
          </AppCard>
          <AppCard>
            <p className="text-xs font-bold uppercase tracking-widest text-mauve">
              Términos clínicos detectados
            </p>
            <p className="mt-1 text-sm text-plum/60">
              Revisa, quita o agrega términos antes de buscar en PubMed. MeSH y no MeSH se muestran con colores distintos.
            </p>
            <div className="mt-4">
              <ClinicalTermsEditor terms={clinicalTerms} onChange={setClinicalTerms} />
            </div>
            <Button
              className="mt-4"
              disabled={clinicalTerms.length === 0}
              onClick={goToPapersStep}
            >
              Buscar papers en PubMed <ChevronRight size={18} />
            </Button>
          </AppCard>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <AppCard className="!p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-mauve">
              Papers sugeridos · elige cuáles usar
            </p>
            <p className="mt-1 text-sm text-plum/60">
              <strong className="text-ink">{articles.length}</strong> artículos encontrados · los
              seleccionados se guardan en{' '}
              <Link to="/app/biblioteca" className="font-semibold text-violet hover:underline">
                tu biblioteca
              </Link>
            </p>
          </AppCard>

          <Pagination
            page={safePapersPage}
            pageSize={DEFAULT_PAGE_SIZE}
            total={articles.length}
            onPageChange={setPapersPage}
          />

          <div className="space-y-3">
            {paginatedArticles.map((a) => (
              <PubMedPaperCard
                key={a.id}
                paper={a}
                selected={!!a.selected}
                onToggle={() => toggleArticle(a.id)}
              />
            ))}
          </div>

          <Pagination
            page={safePapersPage}
            pageSize={DEFAULT_PAGE_SIZE}
            total={articles.length}
            onPageChange={setPapersPage}
          />

          <EvidenceToolkit context={evidenceContext} papers={selectedArticles} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-plum/60">
              <strong className="text-ink">{selectedArticles.length}</strong> de {articles.length}{' '}
              seleccionados
              {selectedArticles.length === 0 && (
                <span className="text-amber-700"> · selecciona al menos uno</span>
              )}
            </p>
            <Button disabled={selectedArticles.length === 0} onClick={goToPlansStep}>
              Generar planes con fuentes seleccionadas
            </Button>
          </div>
        </div>
      )}

      {step === 4 && materialForDisplay && (
        <div className="space-y-4">
          <AppCard className="border-green-200/50 bg-green-50/30">
            <div className="flex flex-wrap items-center gap-2 text-sm text-green-800">
              <BookmarkCheck size={18} />
              <span>
                Guardado · <strong>{rondaTitle}</strong>
              </span>
            </div>
            <p className="mt-2 text-sm text-green-900/80">
              {selectedArticles.length} papers en tu biblioteca · plan de manejo en{' '}
              <Link to="/app/tareas" className="font-semibold text-violet hover:underline">
                Planes de manejo
              </Link>
            </p>
          </AppCard>

          <AppCard>
            <div className="flex items-center gap-2">
              <FileCheck size={18} className="text-violet" />
              <p className="text-xs font-bold uppercase tracking-widest text-mauve">Plan de manejo</p>
            </div>
            <p className="mt-1 text-sm text-plum/60">Para el paciente o el caso clínico</p>
            <p className="mt-2 font-semibold text-ink">{materialForDisplay.patient}</p>
            <ul className="mt-4 space-y-3">
              {materialForDisplay.managementItems.map((item, i) => (
                <li key={i} className="rounded-xl bg-bone/60 p-4">
                  <p className="text-sm leading-relaxed text-plum/90">{item.claim}</p>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
                  >
                    PMID {item.pmid} <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </AppCard>

          <AppCard className="border-amber-200/50 bg-amber-50/30">
            <p className="text-xs font-bold text-amber-800">Pregunta / tarea del especialista</p>
            <p className="mt-1 text-sm text-amber-900">{materialForDisplay.specialistQuestion}</p>
          </AppCard>

          <EvidenceToolkit context={evidenceContext} papers={selectedArticles} />

          <AppCard className="border-green-200/60 bg-green-50/30">
            <div className="flex items-center gap-2 text-green-800">
              <GraduationCap size={18} />
              <p className="text-xs font-bold uppercase tracking-widest">Plan de estudio</p>
            </div>
            <p className="mt-1 text-sm text-plum/70">{materialForDisplay.taskSummary}</p>
            <p className="mt-3 text-sm leading-relaxed text-plum/90">{materialForDisplay.answerDraft}</p>
            <ul className="mt-4 space-y-2">
              {materialForDisplay.readings.map((r) => (
                <li
                  key={r.pmid}
                  className="flex items-center justify-between rounded-xl bg-white p-3 text-sm"
                >
                  <span>{r.title}</span>
                  <span className="text-xs text-plum/50">~{r.minutes} min</span>
                </li>
              ))}
              <li className="flex items-center justify-between rounded-xl bg-white p-3 text-sm">
                <span>{materialForDisplay.quiz}</span>
                <span className="text-xs text-plum/50">~{materialForDisplay.quizMinutes} min</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-plum/70">
              Tiempo estimado:{' '}
              <strong>
                {materialForDisplay.readings.reduce((sum, r) => sum + r.minutes, 0) +
                  materialForDisplay.quizMinutes}{' '}
                min
              </strong>
            </p>
          </AppCard>
        </div>
      )}
    </div>
  )
}
