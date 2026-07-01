import { ChevronLeft, ChevronRight, Compass, X } from 'lucide-react'
import { useTutorial } from '@/context/TutorialContext'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function TutorialGuide() {
  const {
    enabled,
    step,
    stepIndex,
    total,
    isFirst,
    isLast,
    disable,
    enable,
    next,
    prev,
  } = useTutorial()

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={enable}
        className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-lilac/40 bg-white px-4 py-2 text-sm font-semibold text-violet shadow-lg ring-1 ring-black/5 transition hover:bg-violet/5"
        aria-label="Reactivar guía interactiva"
      >
        <Compass size={16} />
        Ver guía
      </button>
    )
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-40 bg-ink/25 backdrop-blur-[1px]"
        aria-hidden
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-lilac/30 bg-white/95 p-4 shadow-[0_-8px_32px_rgba(32,13,36,0.12)] backdrop-blur-md sm:p-5"
        role="dialog"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-body"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-mauve">
                Guía · {step.section} · {stepIndex + 1}/{total}
              </p>
              <h2 id="tutorial-title" className="mt-1 font-display text-lg font-semibold text-ink">
                {step.title}
              </h2>
              <p id="tutorial-body" className="mt-2 text-sm leading-relaxed text-plum/85">
                {step.body}
              </p>
            </div>
            <button
              type="button"
              onClick={disable}
              className="shrink-0 rounded-full p-2 text-plum/50 hover:bg-lilac-50 hover:text-plum"
              aria-label="Cerrar guía"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-lilac-50">
            <div
              className="h-full rounded-full bg-violet transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / total) * 100}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              className={cn('gap-1', isFirst && 'invisible')}
              onClick={prev}
              disabled={isFirst}
            >
              <ChevronLeft size={16} />
              Anterior
            </Button>

            <button
              type="button"
              onClick={disable}
              className="text-xs font-semibold text-plum/55 underline-offset-2 hover:text-violet hover:underline"
            >
              Ocultar guía
            </button>

            <Button type="button" className="gap-1" onClick={isLast ? disable : next}>
              {isLast ? 'Finalizar' : 'Siguiente'}
              {!isLast && <ChevronRight size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
