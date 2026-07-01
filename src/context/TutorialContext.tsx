import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tutorialSteps, type TutorialStep } from '@/lib/tutorial-steps'

const DISABLED_KEY = 'alivia.tutorial.disabled'
const STEP_KEY = 'alivia.tutorial.step'

interface TutorialContextValue {
  enabled: boolean
  stepIndex: number
  step: TutorialStep
  total: number
  isFirst: boolean
  isLast: boolean
  disable: () => void
  enable: () => void
  next: () => void
  prev: () => void
  goTo: (index: number) => void
}

const TutorialContext = createContext<TutorialContextValue | null>(null)

function readDisabled(): boolean {
  try {
    return localStorage.getItem(DISABLED_KEY) === 'true'
  } catch {
    return false
  }
}

function readStepIndex(): number {
  try {
    const raw = localStorage.getItem(STEP_KEY)
    const n = raw ? parseInt(raw, 10) : 0
    if (Number.isNaN(n) || n < 0) return 0
    return Math.min(n, tutorialSteps.length - 1)
  } catch {
    return 0
  }
}

function stepPathMatches(pathname: string, stepPath: string): boolean {
  if (stepPath === '/app') return pathname === '/app' || pathname === '/app/'
  return pathname === stepPath || pathname.startsWith(`${stepPath}/`)
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [enabled, setEnabled] = useState(() => !readDisabled())
  const [stepIndex, setStepIndex] = useState(readStepIndex)

  const step = tutorialSteps[stepIndex]
  const total = tutorialSteps.length

  const persistStep = useCallback((index: number) => {
    setStepIndex(index)
    try {
      localStorage.setItem(STEP_KEY, String(index))
    } catch {
      /* ignore */
    }
  }, [])

  const navigateToStep = useCallback(
    (index: number) => {
      const target = tutorialSteps[index]
      if (!target) return
      persistStep(index)
      if (!stepPathMatches(location.pathname, target.path)) {
        navigate(target.path)
      }
    },
    [location.pathname, navigate, persistStep],
  )

  const disable = useCallback(() => {
    setEnabled(false)
    try {
      localStorage.setItem(DISABLED_KEY, 'true')
      localStorage.setItem(STEP_KEY, String(stepIndex))
    } catch {
      /* ignore */
    }
  }, [stepIndex])

  const enable = useCallback(() => {
    setEnabled(true)
    try {
      localStorage.removeItem(DISABLED_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const next = useCallback(() => {
    const nextIndex = Math.min(stepIndex + 1, total - 1)
    navigateToStep(nextIndex)
  }, [navigateToStep, stepIndex, total])

  const prev = useCallback(() => {
    const prevIndex = Math.max(stepIndex - 1, 0)
    navigateToStep(prevIndex)
  }, [navigateToStep, stepIndex])

  const goTo = useCallback(
    (index: number) => {
      navigateToStep(Math.max(0, Math.min(index, total - 1)))
    },
    [navigateToStep, total],
  )

  useEffect(() => {
    if (!enabled) return
    if (!stepPathMatches(location.pathname, step.path)) {
      navigate(step.path)
    }
  }, [enabled, location.pathname, navigate, step.path])

  const value = useMemo(
    () => ({
      enabled,
      stepIndex,
      step,
      total,
      isFirst: stepIndex === 0,
      isLast: stepIndex === total - 1,
      disable,
      enable,
      next,
      prev,
      goTo,
    }),
    [disable, enable, enabled, goTo, next, prev, step, stepIndex, total],
  )

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>
}

export function useTutorial() {
  const ctx = useContext(TutorialContext)
  if (!ctx) throw new Error('useTutorial must be used within TutorialProvider')
  return ctx
}
