import { useEffect, useMemo, useState } from 'react'
import { Check, X, RotateCcw, Sparkles, ChevronLeft, History } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import {
  getQuizAttempts,
  getStoredQuizzes,
  type QuizAttempt,
  type StoredQuiz,
} from '@/lib/mock-quizzes-store'
import { QUIZ_QUESTION_COUNT } from '@/lib/evidence-toolkit'
import { Pagination } from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'

const ATTEMPTS_PAGE_SIZE = 4

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function CuestionarioPage() {
  const [quizzes, setQuizzes] = useState<StoredQuiz[]>(() => getStoredQuizzes())
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getQuizAttempts())
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [viewAttemptId, setViewAttemptId] = useState<string | null>(null)
  const [listPage, setListPage] = useState(1)

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])

  useEffect(() => {
    const refresh = () => {
      setQuizzes(getStoredQuizzes())
      setAttempts(getQuizAttempts())
    }
    window.addEventListener('alivia-quizzes-updated', refresh)
    return () => window.removeEventListener('alivia-quizzes-updated', refresh)
  }, [])

  useEffect(() => {
    setListPage(1)
  }, [attempts.length])

  const sortedAttempts = useMemo(
    () =>
      [...attempts].sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      ),
    [attempts],
  )

  const listStart = (listPage - 1) * ATTEMPTS_PAGE_SIZE
  const paginatedAttempts = sortedAttempts.slice(listStart, listStart + ATTEMPTS_PAGE_SIZE)

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId)
  const viewAttempt = attempts.find((a) => a.id === viewAttemptId)
  const viewQuiz = viewAttempt ? quizzes.find((q) => q.id === viewAttempt.quizId) : undefined
  const questions = activeQuiz?.questions ?? []
  const q = questions[qIndex]
  const isLast = qIndex === questions.length - 1

  const startQuiz = (id: string) => {
    setActiveQuizId(id)
    setViewAttemptId(null)
    setQIndex(0)
    setSelected(null)
    setRevealed(false)
    setAnswers([])
  }

  const submit = () => {
    if (selected === null || !q) return
    setRevealed(true)
    setAnswers((prev) => [...prev, selected])
  }

  const next = () => {
    if (isLast) {
      setActiveQuizId(null)
      setQIndex(0)
      setSelected(null)
      setRevealed(false)
      setAnswers([])
      return
    }
    setQIndex((i) => i + 1)
    setSelected(null)
    setRevealed(false)
  }

  if (viewAttempt && viewQuiz) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          section="Estudio"
          title={`Intento · ${formatDate(viewAttempt.completedAt)}`}
          description={`${viewQuiz.sourceLabel} · ${viewAttempt.score}/${viewAttempt.total} correctas`}
        />
        <AppCard>
          <p className="text-sm text-plum/75">{viewQuiz.clinicalQuestion}</p>
          <p className="mt-4 text-sm font-semibold text-ink">Feedback global</p>
          <p className="mt-2 text-sm text-plum/90">{viewAttempt.globalFeedback}</p>
          <div className="mt-4 space-y-2">
            {viewAttempt.perQuestionFeedback.map((r, i) => (
              <div
                key={r.questionId}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm',
                  r.correct ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900',
                )}
              >
                <span className="font-semibold">P{i + 1}:</span> {r.message}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setViewAttemptId(null)}>
              <ChevronLeft size={18} /> Volver al listado
            </Button>
            <Button variant="secondary" onClick={() => startQuiz(viewQuiz.id)}>
              <RotateCcw size={18} /> Repetir
            </Button>
          </div>
        </AppCard>
      </div>
    )
  }

  if (activeQuiz && q) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          section="Estudio"
          title={activeQuiz.sourceLabel}
          description={`Pregunta ${qIndex + 1}/${questions.length} · ${QUIZ_QUESTION_COUNT} preguntas`}
          action={
            <button
              type="button"
              onClick={() => setActiveQuizId(null)}
              className="text-sm font-semibold text-violet hover:underline"
            >
              Cancelar
            </button>
          }
        />

        <AppCard>
          <p className="text-sm text-plum/70">{activeQuiz.clinicalQuestion}</p>
          <h2 className="mt-4 text-lg font-semibold leading-snug text-ink">{q.question}</h2>
          <div className="mt-6 space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct
              const isSelected = selected === i
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={revealed}
                  onClick={() => setSelected(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                    !revealed && isSelected && 'border-violet bg-violet/5 ring-1 ring-violet/20',
                    !revealed && !isSelected && 'border-lilac/30 hover:border-violet/30',
                    revealed && isCorrect && 'border-green-500 bg-green-50',
                    revealed && isSelected && !isCorrect && 'border-red-300 bg-red-50',
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lilac-50 text-xs font-bold text-plum">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {revealed && isCorrect && <Check className="ml-auto text-green-600" size={18} />}
                  {revealed && isSelected && !isCorrect && <X className="ml-auto text-red-500" size={18} />}
                </button>
              )
            })}
          </div>

          {revealed && (
            <div className="mt-4 rounded-xl bg-bone/70 p-4">
              <div className="flex items-center gap-2 text-violet">
                <Sparkles size={18} />
                <p className="text-sm font-semibold text-ink">
                  {selected === q.correct ? 'Correcto' : 'Incorrecto'}
                </p>
              </div>
              <p className="mt-2 text-sm text-plum/85">{q.explanation}</p>
              <p className="mt-2 text-xs font-medium text-violet">PMID {q.pmid}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {!revealed ? (
              <Button onClick={submit} disabled={selected === null}>
                Verificar respuesta
              </Button>
            ) : (
              <Button onClick={next}>
                {isLast ? (
                  <>
                    <RotateCcw size={18} /> Terminar ·{' '}
                    {[
                      ...answers,
                      ...(revealed && selected !== null ? [selected] : []),
                    ].filter((a, i) => a === questions[i]?.correct).length}
                    /{questions.length}
                  </>
                ) : (
                  'Siguiente pregunta'
                )}
              </Button>
            )}
          </div>
        </AppCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        section="Estudio"
        title="Cuestionarios"
        description={`Historial de intentos · ${QUIZ_QUESTION_COUNT} preguntas con feedback por pregunta y global.`}
      />

      {sortedAttempts.length === 0 ? (
        <AppCard className="border-dashed border-violet/30 bg-violet/5">
          <p className="text-sm text-plum/80">
            Aún no hay intentos guardados. Genera un quiz desde La Ronda al seleccionar papers.
          </p>
        </AppCard>
      ) : (
        <div className="space-y-4">
          {sortedAttempts.length > ATTEMPTS_PAGE_SIZE && (
            <Pagination
              page={listPage}
              pageSize={ATTEMPTS_PAGE_SIZE}
              total={sortedAttempts.length}
              onPageChange={setListPage}
            />
          )}

          {paginatedAttempts.map((attempt) => {
            const quiz = quizzes.find((q) => q.id === attempt.quizId)
            if (!quiz) return null
            return (
              <AppCard key={attempt.id} hover>
                <p className="text-xs font-bold uppercase tracking-widest text-mauve">{quiz.sourceLabel}</p>
                <h3 className="mt-2 font-semibold text-ink">
                  Intento · {formatDate(attempt.completedAt)}
                </h3>
                <p className="mt-1 text-sm text-plum/60">
                  {attempt.score}/{attempt.total} correctas · {quiz.patientLabel}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-plum/75">{quiz.clinicalQuestion}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="!px-4 !py-2 text-sm"
                    onClick={() => setViewAttemptId(attempt.id)}
                  >
                    <History size={16} /> Ver feedback
                  </Button>
                  <Button className="!px-4 !py-2 text-sm" onClick={() => startQuiz(quiz.id)}>
                    Repetir
                  </Button>
                </div>
              </AppCard>
            )
          })}

          {sortedAttempts.length > ATTEMPTS_PAGE_SIZE && (
            <Pagination
              page={listPage}
              pageSize={ATTEMPTS_PAGE_SIZE}
              total={sortedAttempts.length}
              onPageChange={setListPage}
            />
          )}
        </div>
      )}
    </div>
  )
}
