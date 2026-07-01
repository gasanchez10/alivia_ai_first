import { Mic, Tags, Search, FileCheck, ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/Container'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/i18n'
import { publicUrl } from '@/lib/utils'

const STEP_ICONS = [Mic, Tags, Search, FileCheck]
const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const

const encounterImages = {
  bedside: publicUrl('/images/encounter/bedside-rounds.jpg'),
  study: publicUrl('/images/encounter/study-coffee.jpg'),
}

export function EncounterSection() {
  const { locale } = useLocale()

  return (
    <Section id="ronda" alt>
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-widest text-mauve">
            {t(locale, 'encounter.eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
            {t(locale, 'encounter.title')}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-plum/85">
            {t(locale, 'encounter.body')}
          </p>
          <p className="mt-4 text-base leading-relaxed text-plum/70">
            {t(locale, 'encounter.body2')}
          </p>
        </div>

        {/* Visual journey: bedside → study night */}
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <figure className="group relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-lilac/30">
            <img
              src={encounterImages.bedside}
              alt={t(locale, 'encounter.image.bedside.caption')}
              className="aspect-[4/3] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-lilac">
                {t(locale, 'encounter.image.bedside')}
              </span>
              <p className="mt-1 text-sm font-medium leading-snug text-white sm:text-base">
                {t(locale, 'encounter.image.bedside.caption')}
              </p>
            </figcaption>
          </figure>

          <div className="hidden items-center justify-center lg:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 text-violet">
              <ArrowRight size={22} aria-hidden />
            </div>
          </div>

          <figure className="group relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-lilac/30">
            <img
              src={encounterImages.study}
              alt={t(locale, 'encounter.image.study.caption')}
              className="aspect-[4/3] w-full object-cover object-center opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-lilac">
                {t(locale, 'encounter.image.study')}
              </span>
              <p className="mt-1 text-sm font-medium leading-snug text-white sm:text-base">
                {t(locale, 'encounter.image.study.caption')}
              </p>
            </figcaption>
          </figure>
        </div>

        {/* Steps */}
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEP_KEYS.map((key, i) => {
            const Icon = STEP_ICONS[i]
            return (
              <li
                key={key}
                className="relative rounded-2xl border border-lilac/30 bg-white p-5 shadow-sm transition hover:border-violet/20 hover:shadow-md"
              >
                <span className="text-[10px] font-bold tabular-nums text-plum/40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10">
                  <Icon className="text-violet" size={20} aria-hidden />
                </div>
                <h3 className="mt-3 font-semibold text-ink">
                  {t(locale, `encounter.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-plum/75">
                  {t(locale, `encounter.${key}.body`)}
                </p>
              </li>
            )
          })}
        </ol>
      </Container>
    </Section>
  )
}
