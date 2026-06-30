import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Headphones,
  MessageSquare,
  Presentation,
  HelpCircle,
  Sparkles,
  Play,
  Download,
  Send,
  Check,
  X,
  RotateCcw,
  History,
  Loader2,
} from 'lucide-react'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import type { PubMedResult } from '@/lib/mock-app-data'
import {
  buildGlobalQuizFeedback,
  buildPodcastScript,
  buildPresentationTitle,
  buildQuizFromPapers,
  estimateSlideCount,
  mockChatReply,
  perQuestionFeedback,
  PODCAST_LOCALES,
  PODCAST_VERSIONS,
  QUIZ_QUESTION_COUNT,
  type ChatMessage,
  type EvidenceToolkitContext,
  type PodcastLocale,
  type PodcastVersion,
} from '@/lib/evidence-toolkit'
import { addPresentationFromSearch } from '@/lib/mock-presentations-store'
import { savePodcastFromSearch } from '@/lib/mock-podcasts-store'
import { contextFromEvidence } from '@/lib/library-search-context'
import { saveQuizAttempt, saveStoredQuiz, findStoredQuizByContext, type StoredQuiz } from '@/lib/mock-quizzes-store'
import { QuizHistoryPanel } from '@/components/app/evidence/QuizHistoryPanel'
import { downloadPresentation } from '@/lib/presentation-download'
import { downloadPodcast } from '@/lib/podcast-download'
import { addNotification } from '@/lib/mock-notifications-store'
import { cn } from '@/lib/utils'

const PRESENTATION_GENERATION_MS = 1800

type ToolkitPanel = 'presentation' | 'quiz' | 'podcast' | 'chat' | null

const panels: { id: ToolkitPanel; label: string; icon: typeof Presentation }[] = [
  { id: 'presentation', label: 'Presentación', icon: Presentation },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'podcast', label: 'Podcast', icon: Headphones },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
]

interface EvidenceToolkitProps {
  context: EvidenceToolkitContext
  papers: PubMedResult[]
  className?: string
}

type QuizView = 'take' | 'history'

export function EvidenceToolkit({ context, papers, className }: EvidenceToolkitProps) {
  const [panel, setPanel] = useState<ToolkitPanel>(null)
  const [quizView, setQuizView] = useState<QuizView>('take')
  const [presentationDone, setPresentationDone] = useState(false)
  const [presentationLoading, setPresentationLoading] = useState(false)
  const [presentationTitle, setPresentationTitle] = useState('')

  const [podcastLocale, setPodcastLocale] = useState<PodcastLocale>('es')
  const [podcastVersion, setPodcastVersion] = useState<PodcastVersion>('lite')
  const [podcastGenerated, setPodcastGenerated] = useState(false)
  const [podcastPlaying, setPodcastPlaying] = useState(false)

  const [storedQuiz, setStoredQuiz] = useState<StoredQuiz | null>(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [quizRevealed, setQuizRevealed] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizResults, setQuizResults] = useState<
    { questionId: string; correct: boolean; selected: number; message: string }[]
  >([])
  const [globalFeedback, setGlobalFeedback] = useState('')

  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Contexto cargado: ${context.patientLabel}. Pregunta clínica: "${context.clinicalQuestion}". Puedo responder usando ${papers.length} artículo(s) seleccionado(s).`,
    },
  ])

  const quizItems = useMemo(() => buildQuizFromPapers(papers, context), [papers, context])
  const currentQuiz = quizItems[quizIndex]
  const podcastContent = buildPodcastScript(context, papers, podcastLocale, podcastVersion)
  const slideCount = estimateSlideCount(papers.length)

  useEffect(() => {
    setStoredQuiz(null)
    setQuizIndex(0)
    setQuizAnswer(null)
    setQuizRevealed(false)
    setQuizAnswers([])
    setQuizFinished(false)
    setQuizScore(0)
    setQuizResults([])
    setGlobalFeedback('')
    setPresentationDone(false)
    setPresentationLoading(false)
    setPodcastGenerated(false)
    setPodcastPlaying(false)
    setQuizView('take')
  }, [context.clinicalQuestion, context.patientLabel, papers.map((p) => p.pmid).join(',')])

  if (papers.length === 0) return null

  const generatePresentation = async () => {
    if (presentationLoading) return
    setPresentationLoading(true)
    setPresentationDone(false)

    await new Promise((resolve) => window.setTimeout(resolve, PRESENTATION_GENERATION_MS))

    const title = buildPresentationTitle(context.clinicalQuestion)
    const searchContext = contextFromEvidence(context, papers)
    addPresentationFromSearch({
      title,
      pmid: papers[0].pmid,
      slideCount,
      searchContext,
    })
    addNotification({
      title: 'Presentación lista',
      message: `Tu presentación "${title}" ya está disponible.`,
      href: '/app/biblioteca/presentaciones',
      type: 'presentation',
    })
    setPresentationTitle(title)
    setPresentationDone(true)
    setPresentationLoading(false)
    setPanel('presentation')
  }

  const downloadPresentationFile = () => {
    const title = presentationTitle || buildPresentationTitle(context.clinicalQuestion)
    downloadPresentation({
      title,
      clinicalQuestion: context.clinicalQuestion,
      patientLabel: context.patientLabel,
      papers: papers.map((p) => ({ title: p.title, pmid: p.pmid, journal: p.journal })),
      slideCount,
    })
  }

  const ensureStoredQuiz = (): StoredQuiz => {
    if (storedQuiz) return storedQuiz
    const existing = findStoredQuizByContext({
      sourceLabel: context.sourceLabel,
      clinicalQuestion: context.clinicalQuestion,
      pmids: papers.map((p) => p.pmid),
    })
    if (existing) {
      setStoredQuiz(existing)
      return existing
    }
    const quiz: StoredQuiz = {
      id: `quiz-${crypto.randomUUID().slice(0, 8)}`,
      sourceLabel: context.sourceLabel,
      patientLabel: context.patientLabel,
      clinicalQuestion: context.clinicalQuestion,
      pmids: papers.map((p) => p.pmid),
      questions: quizItems,
      createdAt: new Date().toISOString(),
    }
    saveStoredQuiz(quiz)
    setStoredQuiz(quiz)
    return quiz
  }

  const submitQuizAnswer = () => {
    if (quizAnswer === null || !currentQuiz) return
    setQuizRevealed(true)
    const nextAnswers = [...quizAnswers, quizAnswer]
    setQuizAnswers(nextAnswers)
  }

  const goToNextQuizQuestion = () => {
    if (quizIndex < quizItems.length - 1) {
      setQuizIndex((i) => i + 1)
      setQuizAnswer(null)
      setQuizRevealed(false)
      return
    }

    const quiz = ensureStoredQuiz()
    const results = quizItems.map((q, i) => {
      const selected = quizAnswers[i]
      const correct = selected === q.correct
      return {
        questionId: q.id,
        correct,
        selected,
        message: perQuestionFeedback(correct, q.explanation),
      }
    })

    const score = results.filter((r) => r.correct).length
    const feedback = buildGlobalQuizFeedback(score, QUIZ_QUESTION_COUNT, context)
    setQuizScore(score)
    setQuizResults(results)
    setGlobalFeedback(feedback)
    setQuizFinished(true)

    saveQuizAttempt({
      id: `attempt-${crypto.randomUUID().slice(0, 8)}`,
      quizId: quiz.id,
      score,
      total: QUIZ_QUESTION_COUNT,
      answers: results.map((r) => r.selected),
      perQuestionFeedback: results,
      globalFeedback: feedback,
      completedAt: new Date().toISOString(),
    })
  }

  const resetQuiz = () => {
    setQuizIndex(0)
    setQuizAnswer(null)
    setQuizRevealed(false)
    setQuizAnswers([])
    setQuizFinished(false)
    setQuizScore(0)
    setQuizResults([])
    setGlobalFeedback('')
    setStoredQuiz(null)
    setQuizView('take')
  }

  const startNewQuizAttempt = () => {
    setStoredQuiz(null)
    setQuizIndex(0)
    setQuizAnswer(null)
    setQuizRevealed(false)
    setQuizAnswers([])
    setQuizFinished(false)
    setQuizScore(0)
    setQuizResults([])
    setGlobalFeedback('')
    setQuizView('take')
  }

  const sendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const reply: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: mockChatReply(text, context, papers),
    }
    setChatMessages((m) => [...m, userMsg, reply])
    setChatInput('')
  }

  const downloadPodcastFile = () => {
    downloadPodcast({
      context,
      script: podcastContent.script,
      locale: podcastLocale,
      version: podcastVersion,
      durationMin: podcastContent.durationMin,
      pmids: papers.map((p) => p.pmid),
    })
  }

  const openPanel = (id: ToolkitPanel) => {
    setPanel(panel === id ? null : id)
    if (id === 'presentation' && !presentationDone && !presentationLoading) void generatePresentation()
    if (id === 'quiz' && !storedQuiz) ensureStoredQuiz()
  }

  return (
    <AppCard className={cn('border-violet/20 bg-gradient-to-br from-violet/5 to-white', className)}>
      <div className="flex items-start gap-2">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-violet" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-mauve">
            Herramientas desde esta búsqueda
          </p>
          <p className="mt-1 text-sm text-plum/70">
            {papers.length} artículo(s) · {context.sourceLabel} · contexto del paciente incluido
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {panels.map((p) => {
          const Icon = p.icon
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => openPanel(p.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition',
                panel === p.id
                  ? 'bg-violet text-white shadow-sm'
                  : 'bg-white text-plum ring-1 ring-lilac/40 hover:ring-violet/30',
              )}
            >
              <Icon size={16} />
              {p.label}
            </button>
          )
        })}
      </div>

      {panel === 'presentation' && (
        <div className="mt-4 space-y-3">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-plum to-violet p-5 text-white">
            {presentationLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-plum/75 backdrop-blur-[2px]">
                <Loader2 size={32} className="animate-spin text-white" />
                <p className="mt-3 text-sm font-medium">Generando presentación…</p>
                <p className="mt-1 text-xs text-white/75">Esto puede tardar unos segundos</p>
              </div>
            )}
            <p className="text-xs opacity-80">Diapositiva 1 · {slideCount} slides</p>
            <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
              {context.clinicalQuestion}
            </h3>
            <p className="mt-2 text-sm opacity-90">{context.patientLabel}</p>
            <p className="mt-4 text-xs opacity-75">
              Fuentes: {papers.map((p) => `PMID ${p.pmid}`).join(' · ')}
            </p>
          </div>
          {presentationLoading && (
            <p className="flex items-center gap-2 text-sm text-plum/70">
              <Loader2 size={16} className="animate-spin text-violet" />
              Cargando diapositivas con citas…
            </p>
          )}
          {presentationDone && !presentationLoading && (
            <p className="flex items-center gap-1.5 text-sm text-green-700">
              <Check size={16} /> Presentación guardada · revisa la campana de notificaciones o{' '}
              <Link to="/app/biblioteca/presentaciones" className="font-semibold text-violet hover:underline">
                Presentaciones
              </Link>
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              className="!px-4 !py-2 text-sm"
              onClick={downloadPresentationFile}
              disabled={presentationLoading || !presentationDone}
            >
              <Download size={16} /> Descargar presentación
            </Button>
            <Button
              variant="secondary"
              className="!px-4 !py-2 text-sm"
              onClick={() => void generatePresentation()}
              disabled={presentationLoading}
            >
              {presentationLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generando…
                </>
              ) : (
                'Regenerar'
              )}
            </Button>
          </div>
          <p className="text-xs text-plum/50">
            Descarga un archivo HTML con diapositivas listo para imprimir o presentar.
          </p>
        </div>
      )}

      {panel === 'quiz' && quizView === 'history' && (
        <QuizHistoryPanel
          context={context}
          papers={papers}
          onBack={() => setQuizView('take')}
          onNewAttempt={startNewQuizAttempt}
        />
      )}

      {panel === 'quiz' && quizView === 'take' && !quizFinished && currentQuiz && (
        <div className="mt-4 rounded-xl border border-lilac/30 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase text-plum/50">
              Pregunta {quizIndex + 1} de {QUIZ_QUESTION_COUNT}
            </p>
            <button
              type="button"
              onClick={() => setQuizView('history')}
              className="text-xs font-semibold text-violet hover:underline"
            >
              Ver cuestionarios
            </button>
          </div>
          <p className="mt-2 text-sm font-medium text-ink">{currentQuiz.question}</p>
          <div className="mt-3 space-y-2">
            {currentQuiz.options.map((opt, i) => {
              const isCorrect = i === currentQuiz.correct
              const isSelected = quizAnswer === i
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={quizRevealed}
                  onClick={() => setQuizAnswer(i)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition',
                    !quizRevealed && isSelected && 'border-violet bg-violet/5 ring-1 ring-violet/20',
                    !quizRevealed && !isSelected && 'hover:border-violet/40',
                    quizRevealed && isCorrect && 'border-green-400 bg-green-50',
                    quizRevealed && isSelected && !isCorrect && 'border-red-300 bg-red-50',
                  )}
                >
                  {opt}
                  {quizRevealed && isCorrect && <Check className="ml-auto shrink-0 text-green-600" size={16} />}
                  {quizRevealed && isSelected && !isCorrect && (
                    <X className="ml-auto shrink-0 text-red-500" size={16} />
                  )}
                </button>
              )
            })}
          </div>

          {quizRevealed && (
            <div
              className={cn(
                'mt-3 rounded-lg p-3 text-sm',
                quizAnswer === currentQuiz.correct
                  ? 'bg-green-50 text-green-900'
                  : 'bg-amber-50 text-amber-900',
              )}
            >
              <p className="font-semibold">
                {quizAnswer === currentQuiz.correct ? 'Correcto' : 'Incorrecto'}
              </p>
              <p className="mt-1">{currentQuiz.explanation}</p>
              <p className="mt-2 font-mono text-xs text-violet">PMID {currentQuiz.pmid}</p>
            </div>
          )}

          <div className="mt-4">
            {!quizRevealed ? (
              <Button onClick={submitQuizAnswer} disabled={quizAnswer === null}>
                Verificar respuesta
              </Button>
            ) : (
              <Button onClick={goToNextQuizQuestion}>
                {quizIndex < quizItems.length - 1 ? 'Siguiente pregunta' : 'Ver resultado global'}
              </Button>
            )}
          </div>
        </div>
      )}

      {panel === 'quiz' && quizView === 'take' && quizFinished && (
        <div className="mt-4 space-y-4 rounded-xl border border-lilac/30 bg-white p-4">
          <p className="text-xs font-bold uppercase text-plum/50">Resultado global</p>
          <p className="text-2xl font-display font-semibold text-ink">
            {quizScore}/{QUIZ_QUESTION_COUNT}
          </p>
          <p className="text-sm leading-relaxed text-plum/90">{globalFeedback}</p>
          <div className="space-y-2">
            {quizResults.map((result, i) => (
              <div
                key={result.questionId}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm',
                  result.correct ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900',
                )}
              >
                <span className="font-semibold">P{i + 1}:</span> {result.message}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={resetQuiz}>
              <RotateCcw size={16} /> Reintentar
            </Button>
            <Button variant="secondary" onClick={() => setQuizView('history')}>
              <History size={16} /> Ver cuestionarios
            </Button>
          </div>
        </div>
      )}

      {panel === 'podcast' && (
        <div className="mt-4 space-y-4 rounded-xl bg-violet/5 p-4">
          <p className="text-sm font-semibold text-ink">Podcast · responde la pregunta clínica</p>

          <div>
            <p className="text-xs font-bold uppercase text-plum/50">Idioma</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PODCAST_LOCALES.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    setPodcastLocale(loc.id)
                    setPodcastGenerated(false)
                    setPodcastPlaying(false)
                  }}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition',
                    podcastLocale === loc.id
                      ? 'bg-violet text-white'
                      : 'bg-white text-plum ring-1 ring-lilac/40',
                  )}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-plum/50">Versión</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PODCAST_VERSIONS.map((ver) => (
                <button
                  key={ver.id}
                  type="button"
                  onClick={() => {
                    setPodcastVersion(ver.id)
                    setPodcastGenerated(false)
                    setPodcastPlaying(false)
                  }}
                  className={cn(
                    'rounded-xl px-4 py-2 text-left text-sm transition ring-1',
                    podcastVersion === ver.id
                      ? 'bg-violet text-white ring-violet'
                      : 'bg-white text-plum ring-lilac/40',
                  )}
                >
                  <span className="font-semibold">{ver.label}</span>
                  <span className={cn('mt-0.5 block text-xs', podcastVersion === ver.id ? 'text-white/80' : 'text-plum/60')}>
                    {ver.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            className="!px-4 !py-2"
            onClick={() => {
              savePodcastFromSearch({
                locale: podcastLocale,
                version: podcastVersion,
                durationMin: podcastContent.durationMin,
                script: podcastContent.script,
                searchContext: contextFromEvidence(context, papers),
              })
              setPodcastGenerated(true)
              setPodcastPlaying(false)
            }}
          >
            <Sparkles size={16} /> Generar podcast
          </Button>

          {podcastGenerated && (
            <>
              <p className="text-xs text-plum/60">
                ~{podcastContent.durationMin} min · {PODCAST_LOCALES.find((l) => l.id === podcastLocale)?.label} ·{' '}
                {podcastVersion === 'lite' ? 'Lite' : 'Full'}
              </p>
              <p className="text-sm leading-relaxed text-plum/85">{podcastContent.script}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  className="!px-4 !py-2"
                  onClick={() => setPodcastPlaying((p) => !p)}
                >
                  <Play size={16} />
                  {podcastPlaying ? 'Pausar' : 'Reproducir'}
                </Button>
                <Button className="!px-4 !py-2" onClick={downloadPodcastFile}>
                  <Download size={16} /> Descargar podcast
                </Button>
                {podcastPlaying && (
                  <div className="h-1.5 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-lilac/30">
                    <div className="h-full w-1/4 animate-pulse rounded-full bg-violet" />
                  </div>
                )}
              </div>
              <p className="text-xs text-plum/50">
                Descarga el audio (.wav) y el guion (.txt) con idioma, versión y PMIDs.
              </p>
            </>
          )}
        </div>
      )}

      {panel === 'chat' && (
        <div className="mt-4 space-y-3">
          <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-lilac/30 bg-white p-3">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm',
                  m.role === 'user' ? 'ml-8 bg-violet/10 text-ink' : 'mr-4 bg-bone/80 text-plum/90',
                )}
              >
                {m.role === 'user' ? 'Tú: ' : 'Alivia: '}
                {m.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              placeholder="Pregunta sobre el caso o los artículos…"
              className="min-w-0 flex-1 rounded-xl border border-lilac/40 px-3 py-2 text-sm focus:border-violet/40 focus:outline-none focus:ring-2 focus:ring-violet/20"
            />
            <Button variant="secondary" className="!px-3" onClick={sendChat} aria-label="Enviar">
              <Send size={18} />
            </Button>
          </div>
          <p className="text-xs text-plum/50">
            El chat usa solo el paciente, la pregunta y los {papers.length} papers seleccionados.
          </p>
        </div>
      )}
    </AppCard>
  )
}
