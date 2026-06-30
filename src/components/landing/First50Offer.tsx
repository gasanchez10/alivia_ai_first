import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Crown, ShieldCheck, Sparkles } from 'lucide-react'
import { Container, Section } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useLocale } from '@/context/LocaleContext'
import { t, type Locale } from '@/lib/i18n'
import { getFounderOfferStats } from '@/lib/waitlist'
import { cn } from '@/lib/utils'

const RECENT_JOINS: Record<Locale, string[]> = {
  es: [
    'Andrea · Javeriana reservó cupo hace 3 h',
    'Diego · UNAM reservó cupo hace 6 h',
    'Camila · U. de Chile reservó cupo ayer',
    'Mateo · UBA reservó cupo hace 2 días',
  ],
  en: [
    'Andrea · Javeriana claimed a spot 3 h ago',
    'Diego · UNAM claimed a spot 6 h ago',
    'Camila · U. de Chile claimed a spot yesterday',
    'Mateo · UBA claimed a spot 2 days ago',
  ],
}

function fill(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    template,
  )
}

function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

export function First50Offer() {
  const { locale } = useLocale()
  const [stats, setStats] = useState(() => getFounderOfferStats())
  const [tickerIdx, setTickerIdx] = useState(0)
  const [tickerVisible, setTickerVisible] = useState(true)
  const animatedRemaining = useAnimatedNumber(stats.remaining)

  const recentJoins = RECENT_JOINS[locale]
  const fillPct = (stats.claimed / stats.total) * 100

  useEffect(() => {
    setStats(getFounderOfferStats())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerVisible(false)
      setTimeout(() => {
        setTickerIdx((i) => (i + 1) % recentJoins.length)
        setTickerVisible(true)
      }, 280)
    }, 4200)
    return () => clearInterval(interval)
  }, [recentJoins.length])

  return (
    <Section alt className="offer-section relative overflow-hidden !bg-ink">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="offer-glow absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet/40 blur-3xl" />
        <div className="offer-glow absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-plum/50 blur-3xl [animation-delay:1.5s]" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet/90 via-plum/85 to-ink/95" />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-lilac backdrop-blur">
              <Crown size={14} aria-hidden />
              {t(locale, 'offer.eyebrow')}
            </p>

            <h2 className="mt-5 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-[2rem]">
              {t(locale, 'offer.title')}
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85 lg:mx-0">
              {t(locale, 'offer.body')}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/90 ring-1 ring-white/15">
                <ShieldCheck size={16} className="text-lilac" aria-hidden />
                {t(locale, 'offer.verified')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1.5 text-sm font-medium text-amber-100 ring-1 ring-amber-300/30">
                <Sparkles size={14} aria-hidden />
                {t(locale, 'offer.lifetime')}
              </span>
            </div>

            <Link to="/register" className="mt-8 inline-block">
              <Button
                variant="secondary"
                className="group min-w-[220px] !border-white !bg-white !text-violet shadow-xl shadow-black/30 ring-2 ring-white/40 hover:!bg-bone hover:!text-violet"
              >
                {t(locale, 'offer.cta')}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Button>
            </Link>
          </div>

          {/* Live meter */}
          <div className="offer-meter mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/25 backdrop-blur-md sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-lilac">
                  {t(locale, 'offer.spotsLabel')}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {fill(t(locale, 'offer.spotsRemaining'), {
                    count: stats.remaining,
                    total: stats.total,
                  })}
                </p>
              </div>
              <p
                className="font-display text-5xl font-semibold tabular-nums leading-none text-white sm:text-6xl"
                aria-live="polite"
              >
                {animatedRemaining}
              </p>
            </div>

            <div className="mt-6">
              <div className="h-3 overflow-hidden rounded-full bg-white/15">
                <div
                  className="offer-progress h-full rounded-full bg-gradient-to-r from-lilac via-white to-amber-200"
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-medium text-white/60">
                {fill(t(locale, 'offer.spotsClaimed'), {
                  claimed: stats.claimed,
                  total: stats.total,
                })}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-10 gap-1.5" aria-hidden>
              {Array.from({ length: stats.total }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 rounded-full transition-colors duration-500',
                    i < stats.claimed
                      ? 'bg-white shadow-sm shadow-white/30'
                      : 'bg-white/20 offer-slot-open',
                  )}
                />
              ))}
            </div>

            {stats.remaining <= 15 && (
              <p className="offer-urgency mt-5 text-center text-sm font-medium text-amber-200">
                {t(locale, 'offer.urgency')}
              </p>
            )}

            <div
              className={cn(
                'mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-white/75 transition-opacity duration-300 sm:text-sm',
                tickerVisible ? 'opacity-100' : 'opacity-0',
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              {recentJoins[tickerIdx]}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
