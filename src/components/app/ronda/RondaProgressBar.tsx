import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Mic, Tags, Search, FileCheck, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RondaStep {
  id: number
  label: string
  title: string
  description: string
  icon: LucideIcon
}

export const rondaSteps: RondaStep[] = [
  {
    id: 1,
    label: 'Entrada',
    title: 'Tu entrada',
    description:
      'Graba la ronda en vivo, sube un archivo de audio o pega el texto del caso. Todo se convierte en texto para el siguiente paso.',
    icon: Mic,
  },
  {
    id: 2,
    label: 'Términos',
    title: 'Términos clínicos',
    description:
      'Alivia analiza el texto y genera términos MeSH (violeta) y no MeSH (verde azulado). Puedes agregar, quitar o corregir antes de buscar en PubMed.',
    icon: Tags,
  },
  {
    id: 3,
    label: 'Papers',
    title: 'Selección de papers',
    description:
      'Revisa los artículos sugeridos y marca solo los que quieres usar para responder la tarea y fundamentar los planes.',
    icon: Search,
  },
  {
    id: 4,
    label: 'Planes',
    title: 'Planes de manejo y estudio',
    description:
      'Con las fuentes elegidas, genera el plan citado para el paciente o caso y tu plan de estudio con lecturas y quiz.',
    icon: FileCheck,
  },
]

const TOOLTIP_WIDTH = 260

function StepNode({
  step,
  currentStep,
  onSelect,
}: {
  step: RondaStep
  currentStep: number
  onSelect: (id: number) => void
}) {
  const [hovering, setHovering] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipId = useId()

  const done = currentStep > step.id
  const active = currentStep === step.id
  const Icon = step.icon

  const updatePosition = useCallback(() => {
    const el = buttonRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setCoords({
      top: rect.top - 10,
      left: rect.left + rect.width / 2,
    })
  }, [])

  useEffect(() => {
    if (!hovering) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [hovering, updatePosition])

  const tooltip =
    hovering &&
    createPortal(
      <div
        id={tooltipId}
        role="tooltip"
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          width: TOOLTIP_WIDTH,
          transform: 'translate(-50%, -100%)',
          zIndex: 9999,
        }}
        className="rounded-xl border border-lilac/40 bg-white p-3.5 text-left shadow-xl"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <p className="text-sm font-semibold text-ink">{step.title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-plum/80">{step.description}</p>
        <div
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-lilac/40 bg-white"
          aria-hidden
        />
      </div>,
      document.body,
    )

  return (
    <>
      <div className="flex flex-1 flex-col items-center">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => onSelect(step.id)}
          aria-current={active ? 'step' : undefined}
          aria-describedby={hovering ? tooltipId : undefined}
          onMouseEnter={() => {
            setHovering(true)
            updatePosition()
          }}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => {
            setHovering(true)
            updatePosition()
          }}
          onBlur={() => setHovering(false)}
          className={cn(
            'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/40 focus-visible:ring-offset-2',
            active && 'border-violet bg-violet text-white shadow-md shadow-violet/25',
            done && !active && 'border-green-500 bg-green-50 text-green-700',
            !active && !done && 'border-lilac/50 bg-white text-plum/50 hover:border-violet/40 hover:text-violet',
          )}
        >
          {done && !active ? <Check size={18} strokeWidth={2.5} /> : <Icon size={18} />}
        </button>
        <span
          className={cn(
            'mt-2 text-center text-xs font-medium',
            active && 'text-violet',
            done && !active && 'text-green-700',
            !active && !done && 'text-plum/50',
          )}
        >
          {step.label}
        </span>
      </div>
      {tooltip}
    </>
  )
}

interface RondaProgressBarProps {
  step: number
  onStepChange: (step: number) => void
}

export function RondaProgressBar({ step, onStepChange }: RondaProgressBarProps) {
  const progress =
    rondaSteps.length > 1 ? ((step - 1) / (rondaSteps.length - 1)) * 100 : 0

  return (
    <nav aria-label="Progreso de La Ronda" className="mb-8 pt-2">
      <div className="relative px-2">
        <div
          className="absolute left-6 right-6 top-5 h-1 rounded-full bg-lilac/30"
          aria-hidden
        />
        <div
          className="absolute left-6 top-5 h-1 rounded-full bg-violet transition-all duration-300 ease-out"
          style={{ width: `calc((100% - 3rem) * ${progress / 100})` }}
          aria-hidden
        />
        <ol className="relative flex justify-between">
          {rondaSteps.map((s) => (
            <li key={s.id} className="flex flex-1 justify-center">
              <StepNode step={s} currentStep={step} onSelect={onStepChange} />
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-4 text-center text-xs text-plum/50">
        Paso {step} de {rondaSteps.length} · pasa el cursor sobre cada paso para ver qué hace
      </p>
    </nav>
  )
}
