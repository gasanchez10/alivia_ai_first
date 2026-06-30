import { useEffect, useState } from 'react'
import { AlertTriangle, Check, Sparkles, X } from 'lucide-react'
import { Container, Section } from '@/components/ui/Container'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/i18n'
import { vsComparison, vsGenericImage } from '@/lib/vs-comparison'
import { cn } from '@/lib/utils'

const CYCLE_MS = 5000

export function VsGenericAI() {
  const { locale } = useLocale()
  const rows = vsComparison[locale]
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const isEs = locale === 'es'
  const current = rows[active]
  const Icon = current.icon

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % rows.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [paused, rows.length])

  return (
    <Section alt id="comparacion">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            {t(locale, 'vs.title')}
          </h2>
          <p className="mt-4 text-lg text-plum/80">{t(locale, 'vs.subtitle')}</p>
        </div>

        <div
          className="mt-12 overflow-hidden rounded-3xl border border-lilac/30 bg-white shadow-lg"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Task pills */}
          <div className="flex gap-2 overflow-x-auto border-b border-lilac/20 bg-bone/50 px-4 py-3 sm:flex-wrap sm:justify-center sm:px-6">
            {rows.map((row, i) => (
              <button
                key={row.task}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-xs font-semibold transition-all sm:text-sm',
                  active === i
                    ? 'bg-violet text-white shadow-md shadow-violet/25'
                    : 'bg-white text-plum ring-1 ring-lilac/40 hover:ring-violet/30',
                )}
              >
                <span
                  className={cn(
                    'h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2',
                    active === i ? 'ring-white/50' : 'ring-lilac/30',
                  )}
                >
                  <img src={row.image} alt="" className="h-full w-full object-cover opacity-85" />
                </span>
                {row.task}
              </button>
            ))}
          </div>

          {/* Feature spotlight: description + image */}
          <div className="grid md:grid-cols-2">
            <div
              key={`copy-${active}`}
              className="vs-slide-in flex flex-col justify-center border-b border-lilac/20 bg-gradient-to-br from-ink to-plum p-6 sm:p-8 md:border-b-0 md:border-r"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/30">
                  <Icon className="text-lilac" size={18} aria-hidden />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-lilac">
                  {active + 1} / {rows.length}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                {current.task}
              </h3>
              <p className="mt-2 text-base font-medium text-violet-200">{current.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-[15px]">
                {current.description}
              </p>
            </div>

            <div className="relative min-h-[240px] overflow-hidden bg-ink sm:min-h-[280px]">
              <img
                key={current.image}
                src={current.image}
                alt={current.imageAlt}
                className="vs-slide-in absolute inset-0 h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-ink/10 md:bg-gradient-to-l md:from-ink/25 md:via-ink/10 md:to-transparent" />
            </div>
          </div>

          {/* Split comparison */}
          <div className="relative grid gap-0 md:grid-cols-2">
            <div
              key={`others-${active}`}
              className="vs-slide-in relative border-b border-lilac/20 md:border-b-0 md:border-r"
            >
              <div className="absolute inset-0 overflow-hidden" aria-hidden>
                <img
                  src={vsGenericImage}
                  alt=""
                  className="h-full w-full object-cover opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gray-50/94" />
              </div>
              <div className="relative p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gray-200 grayscale opacity-80">
                    <img src={vsGenericImage} alt="" className="h-full w-full object-cover opacity-90" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      {isEs ? 'Otras IA' : 'Other AI'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isEs ? 'Genéricas · sin flujo clínico' : 'Generic · no clinical workflow'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-red-100">
                  <X className="mt-0.5 shrink-0 text-red-400" size={20} />
                  <p className="text-base font-medium text-plum/80">{current.others}</p>
                </div>
              </div>
            </div>

            <div key={`alivia-${active}`} className="vs-slide-in relative">
              <div className="absolute inset-0 overflow-hidden" aria-hidden>
                <img
                  src={current.image}
                  alt=""
                  className="h-full w-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-violet/90 to-plum/85" />
              </div>
              <div className="relative p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/60 opacity-90 shadow-lg">
                    <img src={current.image} alt="" className="h-full w-full object-cover opacity-85" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Alivia</p>
                    <p className="text-xs text-lilac">
                      {isEs ? 'Hecha para residentes · LATAM' : 'Built for residents · LATAM'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-lg">
                  <Check className="mt-0.5 shrink-0 text-green-600" size={20} />
                  <p className="text-base font-semibold text-ink">{current.alivia}</p>
                </div>
                <Sparkles
                  className="absolute right-4 top-4 text-white/35"
                  size={24}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-lilac/20 bg-white px-4 py-3 sm:px-6">
            <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-violet/20">
              <img src={current.image} alt="" className="h-full w-full object-cover opacity-85" />
            </span>
            <span className="line-clamp-1 text-sm font-medium text-plum">{current.tagline}</span>
            <div className="ml-auto flex shrink-0 gap-1">
              {rows.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${isEs ? 'Tarea' : 'Task'} ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    active === i ? 'w-6 bg-violet' : 'w-1.5 bg-lilac',
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Matrix */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-lilac/30 bg-white shadow-sm">
          <div className="hidden bg-lilac-50 px-4 py-3 text-xs font-semibold text-plum sm:grid sm:grid-cols-[auto_1fr_1fr_1fr] sm:text-sm">
            <span className="w-10" />
            <span>{isEs ? 'Tarea' : 'Task'}</span>
            <span>{isEs ? 'Otras IA' : 'Other AI'}</span>
            <span className="text-violet">Alivia</span>
          </div>
          {rows.map((row, i) => (
            <button
              key={row.task}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'w-full border-t border-lilac/20 px-4 py-4 text-left transition-colors sm:grid sm:grid-cols-[auto_1fr_1fr_1fr] sm:items-center sm:gap-2 sm:py-3',
                active === i ? 'bg-violet/5' : 'hover:bg-bone/50',
              )}
            >
              <div className="flex items-start gap-3 sm:contents">
                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-lilac/40 sm:h-9 sm:w-9">
                  <img src={row.image} alt="" className="h-full w-full object-cover opacity-85" />
                </span>
                <div className="min-w-0 flex-1 sm:col-span-1">
                  <span className="font-medium text-ink">{row.task}</span>
                  <p className="mt-0.5 line-clamp-2 text-xs text-plum/60 sm:hidden">
                    {row.tagline}
                  </p>
                </div>
              </div>
              <span className="mt-2 flex items-start gap-1 text-xs text-plum/65 sm:mt-0 sm:text-sm">
                {row.others.toLowerCase().includes('no') && !row.others.includes('invent') ? (
                  <X size={14} className="mt-0.5 shrink-0 text-red-400" />
                ) : (
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" />
                )}
                {row.others}
              </span>
              <span className="mt-1 flex items-start gap-1 text-xs font-medium text-ink sm:mt-0 sm:text-sm">
                <Check size={14} className="mt-0.5 shrink-0 text-green-600" />
                {row.alivia}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-plum/60">
          {isEs
            ? 'Toca una tarea para ver la comparación · rota automáticamente cada 5 s'
            : 'Tap a task to compare · auto-rotates every 5 s'}
        </p>
      </Container>
    </Section>
  )
}
