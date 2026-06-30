import type { QuizQuestion } from '@/lib/mock-app-data'

const QUIZZES_KEY = 'alivia.mock.quizzes'
const ATTEMPTS_KEY = 'alivia.mock.quizAttempts'

export interface StoredQuiz {
  id: string
  sourceLabel: string
  patientLabel: string
  clinicalQuestion: string
  pmids: string[]
  questions: QuizQuestion[]
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  score: number
  total: number
  answers: number[]
  perQuestionFeedback: {
    questionId: string
    correct: boolean
    selected: number
    message: string
  }[]
  globalFeedback: string
  completedAt: string
}

function loadQuizzes(): StoredQuiz[] {
  try {
    const raw = localStorage.getItem(QUIZZES_KEY)
    return raw ? (JSON.parse(raw) as StoredQuiz[]) : []
  } catch {
    return []
  }
}

function loadAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    return raw ? (JSON.parse(raw) as QuizAttempt[]) : []
  } catch {
    return []
  }
}

function saveQuizzes(items: StoredQuiz[]) {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('alivia-quizzes-updated'))
  window.dispatchEvent(new Event('alivia-library-updated'))
}

function saveAttempts(items: QuizAttempt[]) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('alivia-quizzes-updated'))
  window.dispatchEvent(new Event('alivia-library-updated'))
}

export function getStoredQuizzes(): StoredQuiz[] {
  return loadQuizzes()
}

export function getQuizAttempts(quizId?: string): QuizAttempt[] {
  const all = loadAttempts()
  return quizId ? all.filter((a) => a.quizId === quizId) : all
}

function pmidsKey(pmids: string[]): string {
  return [...pmids].sort().join(',')
}

export function findStoredQuizByContext(params: {
  sourceLabel: string
  clinicalQuestion: string
  pmids: string[]
}): StoredQuiz | undefined {
  const key = pmidsKey(params.pmids)
  return loadQuizzes().find(
    (q) =>
      q.sourceLabel === params.sourceLabel &&
      q.clinicalQuestion === params.clinicalQuestion &&
      pmidsKey(q.pmids) === key,
  )
}

export function saveStoredQuiz(quiz: StoredQuiz): StoredQuiz {
  const next = [quiz, ...loadQuizzes().filter((q) => q.id !== quiz.id)]
  saveQuizzes(next)
  return quiz
}

export function saveQuizAttempt(attempt: QuizAttempt): QuizAttempt {
  const next = [attempt, ...loadAttempts()]
  saveAttempts(next)
  return attempt
}
