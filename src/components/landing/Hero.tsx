import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, FileText, Play, Radio, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/i18n'
import { getWaitlistCount } from '@/lib/waitlist'
import { publicUrl } from '@/lib/utils'

const HERO_BG = publicUrl('/images/hero-background.jpg')
const HERO_BRIEFING = publicUrl('/images/hero-briefing.jpg')

const briefingItems = {
  es: [
    { type: 'guide' as const, label: 'Guía actualizada', title: 'MinSalud 2024 — Anticoagulación en FA', tag: 'Nueva' },
    { type: 'congress' as const, label: 'Próximo congreso', title: 'ACC Scientific Sessions · 29 mar – 1 abr', tag: 'Chicago' },
    { type: 'guide' as const, label: 'Guía ESC', title: 'Diabetes y enfermedad cardiovascular 2024', tag: 'PMID' },
  ],
  en: [
    { type: 'guide' as const, label: 'Updated guideline', title: 'MinSalud 2024 — Anticoagulation in AF', tag: 'New' },
    { type: 'congress' as const, label: 'Upcoming congress', title: 'ACC Scientific Sessions · Mar 29 – Apr 1', tag: 'Chicago' },
    { type: 'guide' as const, label: 'ESC Guideline', title: 'Diabetes & cardiovascular disease 2024', tag: 'PMID' },
  ],
}

export function Hero() {
  const { locale } = useLocale()
  const [count, setCount] = useState(247)
  const isEs = locale === 'es'
  const items = briefingItems[locale]

  useEffect(() => {
    setCount(getWaitlistCount())
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-[min(100vh,960px)] flex-col justify-center overflow-hidden"
    >
      {/* Atmospheric background — separate from floating visual */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 kenburns">
          <img
            src={HERO_BG}
            alt=""
            className="h-full w-full object-cover object-center opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-white/96 via-45% to-white/50 lg:via-white/90 lg:to-white/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/50 lg:to-transparent" />
      </div>

      <Container className="relative z-10 py-16 sm:py-24 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">
              {t(locale, 'hero.eyebrow')}
            </p>
            <h1 className="mt-4 font-display text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.1rem]">
              {t(locale, 'hero.title')}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-700 sm:text-xl">
              {t(locale, 'hero.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/register">
                <Button className="min-w-[200px] shadow-lg shadow-violet/25">
                  {t(locale, 'hero.cta.primary')}
                </Button>
              </Link>
              <Link to="/app">
                <Button variant="secondary" className="min-w-[200px] !border-white/80 !bg-white/85 backdrop-blur">
                  <Play size={18} />
                  {t(locale, 'hero.cta.secondary')}
                </Button>
              </Link>
            </div>

            <div className="mt-8 space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/85 px-4 py-2 text-sm shadow-sm backdrop-blur">
                <Sparkles size={16} className="text-violet" />
                <span className="text-plum">
                  {t(locale, 'hero.counter.prefix')}{' '}
                  <strong className="tabular-nums text-ink">{count}</strong>{' '}
                  {t(locale, 'hero.counter.suffix')}
                </span>
              </p>
              <p className="text-sm text-gray-600">{t(locale, 'hero.trust')}</p>
            </div>
          </div>

          {/* Briefing visual — guides & congresses */}
          <div className="relative lg:col-span-7">
            <div className="relative mx-auto max-w-xl lg:max-w-none lg:pl-2">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-plum/20 ring-1 ring-white/60 lg:-rotate-1">
                <img
                  src={HERO_BRIEFING}
                  alt={
                    isEs
                      ? 'Guías clínicas actualizadas y próximos congresos médicos'
                      : 'Updated clinical guidelines and upcoming medical conferences'
                  }
                  className="aspect-[4/3] w-full object-cover object-center opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <div className="absolute left-0 right-0 top-4 flex justify-center sm:top-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-plum shadow-sm backdrop-blur">
                    <Radio size={14} className="text-violet" />
                    {isEs ? 'EL BRIEFING' : 'THE BRIEFING'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lilac">
                    {isEs ? 'Guías · Congresos · Evidencia nueva' : 'Guidelines · Congresses · New evidence'}
                  </p>
                  <p className="mt-2 max-w-md text-lg font-semibold leading-snug text-white">
                    {isEs
                      ? 'Lo más relevante de tu especialidad, cada mañana.'
                      : 'What matters in your specialty, every morning.'}
                  </p>
                </div>
              </div>

              {/* Floating briefing feed */}
              <div className="absolute -bottom-4 left-3 right-3 sm:-bottom-6 sm:left-6 sm:right-6 lg:-left-4 lg:w-[92%]">
                <div className="rounded-2xl border border-white/80 bg-white/95 p-2 shadow-2xl shadow-violet/15 backdrop-blur-md">
                  <div className="rounded-xl bg-gradient-to-br from-violet/5 to-plum/5 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-plum">
                        {isEs ? 'Tu resumen de hoy' : "Today's digest"}
                      </span>
                      <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-bold text-violet">
                        {isEs ? '12 min audio' : '12 min audio'}
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/[0.04]"
                        >
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              item.type === 'congress' ? 'bg-mauve/15 text-mauve' : 'bg-violet/10 text-violet'
                            }`}
                          >
                            {item.type === 'congress' ? (
                              <Calendar size={16} />
                            ) : (
                              <FileText size={16} />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-plum/50">
                              {item.label}
                            </p>
                            <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                          </div>
                          <span className="shrink-0 rounded-md bg-lilac-50 px-2 py-0.5 text-[10px] font-semibold text-mauve">
                            {item.tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
