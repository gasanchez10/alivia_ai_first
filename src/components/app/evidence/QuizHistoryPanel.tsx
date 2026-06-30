import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { PubMedResult } from '@/lib/mock-app-data'
import type { EvidenceToolkitContext } from '@/lib/evidence-toolkit'
import {
  getQuizAttempts,
  getStoredQuizzes,
  type QuizAttempt,
  type StoredQuiz,
} from '@/lib/mock-quizzes-store'
import { cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/Pagination'

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

function optionLabel(options: string[], index: number): string {
  return options[index] ?? `Opción ${index + 1}`
}

interface QuizHistoryPanelProps {
  context: EvidenceToolkitContext
  papers: PubMedResult[]
  onBack: () => void
  onNewAttempt: () => void
}

export function QuizHistoryPanel({ context, papers, onBack, onNewAttempt }: QuizHistoryPanelProps) {
  const [quizzes, setQuizzes] = useState<StoredQuiz[]>(() => getStoredQuizzes())
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getQuizAttempts())
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const refresh = () => {
      setQuizzes(getStoredQuizzes())
      setAttempts(getQuizAttempts())
    }
    window.addEventListener('alivia-quizzes-updated', refresh)
    return () => window.removeEventListener('alivia-quizzes-updated', refresh)
  }, [])

  const currentPmids = useMemo(() => new Set(papers.map((p) => p.pmid)), [papers])

  const relatedQuizzes = useMemo(
    () =>
      quizzes.filter(
        (q) =>
          q.pmids.some((p) => currentPmids.has(p)) ||
          (q.clinicalQuestion === context.clinicalQuestion &&
            q.sourceLabel === context.sourceLabel),
      ),
    [quizzes, currentPmids, context.clinicalQuestion, context.sourceLabel],
  )

  const relatedAttempts = useMemo(() => {
    const quizIds = new Set(relatedQuizzes.map((q) => q.id))
    return attempts
      .filter((a) => quizIds.has(a.quizId))
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
  }, [relatedQuizzes, attempts])

  const paginatedAttempts = useMemo(() => {
    const start = (page - 1) * ATTEMPTS_PAGE_SIZE
    return relatedAttempts.slice(start, start + ATTEMPTS_PAGE_SIZE)
  }, [relatedAttempts, page])

  useEffect(() => {
    setPage(1)
    setExpandedAttemptId(null)
  }, [relatedAttempts.length, context.clinicalQuestion, context.sourceLabel, papers.map((p) => p.pmid).join(',')])

  const selectedAttempt = attempts.find((a) => a.id === expandedAttemptId)
  const selectedQuiz = selectedAttempt
    ? quizzes.find((q) => q.id === selectedAttempt.quizId)
    : undefined

  if (selectedAttempt && selectedQuiz) {
    return (
      <div className="mt-4 space-y-4 rounded-xl border border-lilac/30 bg-white p-4">
        <button
          type="button"
          onClick={() => setExpandedAttemptId(null)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-violet hover:underline"
        >
          <ChevronLeft size={16} /> Volver al listado
        </button>

        <div>
          <p className="text-xs font-bold uppercase text-plum/50">{selectedQuiz.sourceLabel}</p>
          <h3 className="mt-1 font-semibold text-ink">
            Intento · {formatDate(selectedAttempt.completedAt)}
          </h3>
          <p className="mt-1 text-sm text-plum/70">
            {selectedAttempt.score}/{selectedAttempt.total} correctas
          </p>
        </div>

        <div className="rounded-xl bg-violet/5 p-4">
          <p className="text-xs font-bold uppercase text-plum/50">Feedback global</p>
          <p className="mt-2 text-sm leading-relaxed text-plum/90">{selectedAttempt.globalFeedback}</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase text-plum/50">Respuestas y feedback por pregunta</p>
          {selectedQuiz.questions.map((q, i) => {
            const result = selectedAttempt.perQuestionFeedback.find((r) => r.questionId === q.id)
            const selectedIdx = result?.selected ?? selectedAttempt.answers[i]
            return (
              <div
                key={q.id}
                className={cn(
                  'rounded-xl border p-3 text-sm',
                  result?.correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50',
                )}
              >
                <p className="font-medium text-ink">
                  P{i + 1}. {q.question}
                </p>
                <p className="mt-2 text-plum/80">
                  <span className="font-semibold">Tu respuesta:</span>{' '}
                  {optionLabel(q.options, selectedIdx)}
                </p>
                {!result?.correct && (
                  <p className="mt-1 text-plum/80">
                    <span className="font-semibold">Correcta:</span>{' '}
                    {optionLabel(q.options, q.correct)}
                  </p>
                )}
                <p className="mt-2 text-plum/85">{result?.message ?? q.explanation}</p>
                <p className="mt-1 font-mono text-xs text-violet">PMID {q.pmid}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4 rounded-xl border border-lilac/30 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History size={18} className="text-violet" />
          <div>
            <p className="text-sm font-semibold text-ink">Intentos de esta búsqueda</p>
            <p className="text-xs text-plum/60">{context.sourceLabel}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="!px-3 !py-2 text-sm" onClick={onNewAttempt}>
            Nuevo intento
          </Button>
          <Button variant="secondary" className="!px-3 !py-2 text-sm" onClick={onBack}>
            Volver al quiz
          </Button>
        </div>
      </div>

      <p className="text-sm text-plum/75">{context.clinicalQuestion}</p>

      {relatedAttempts.length === 0 ? (
        <p className="text-sm text-plum/70">
          Aún no hay intentos completados. Responde el quiz para ver tu historial aquí.
        </p>
      ) : (
        <div className="space-y-3">
          {relatedAttempts.length > ATTEMPTS_PAGE_SIZE && (
            <Pagination
              page={page}
              pageSize={ATTEMPTS_PAGE_SIZE}
              total={relatedAttempts.length}
              onPageChange={setPage}
            />
          )}

          {paginatedAttempts.map((attempt, i) => (
            <button
              key={attempt.id}
              type="button"
              onClick={() => setExpandedAttemptId(attempt.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-lilac/30 px-4 py-3 text-left hover:bg-bone/40"
            >
              <div>
                <p className="font-medium text-ink">
                  Intento {(page - 1) * ATTEMPTS_PAGE_SIZE + i + 1} · {formatDate(attempt.completedAt)}
                </p>
                <p className="mt-0.5 text-sm text-plum/60">
                  {attempt.score}/{attempt.total} correctas
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-violet">Ver detalle</span>
            </button>
          ))}

          {relatedAttempts.length > ATTEMPTS_PAGE_SIZE && (
            <Pagination
              page={page}
              pageSize={ATTEMPTS_PAGE_SIZE}
              total={relatedAttempts.length}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  )
}
