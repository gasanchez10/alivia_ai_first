import type { LucideIcon } from 'lucide-react'
import { Container, Section } from '@/components/ui/Container'
import { useLocale } from '@/context/LocaleContext'
import { t, type Locale } from '@/lib/i18n'
import {
  briefingFeatures,
  briefingImage,
  libraryFeatures,
  libraryImage,
  orbitAngles,
  polarPosition,
} from '@/lib/library-briefing'
import { cn } from '@/lib/utils'

const ORBIT_RADIUS = 44
const STAGGER = ['0s', '0.4s', '0.8s', '1.2s', '1.6s']

function FeatureOrbit({
  centerImage,
  centerAlt,
  features,
  ringClass,
}: {
  centerImage: string
  centerAlt: string
  features: { label: string; icon: LucideIcon }[]
  ringClass: string
}) {
  const angles = orbitAngles(features.length)

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(100%,22rem)] overflow-visible">
      {/* Decorative rings — sit between center and satellites */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lilac/25"
        aria-hidden
      />

      {/* Center circle */}
      <div
        className={cn(
          'orbit-ring absolute left-1/2 top-1/2 z-10 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white shadow-xl',
          ringClass,
        )}
      >
        <img src={centerImage} alt={centerAlt} className="h-full w-full object-cover opacity-90" />
      </div>

      {/* Satellites on outer ring */}
      {features.map((f, i) => {
        const pos = polarPosition(angles[i], ORBIT_RADIUS)
        const Icon = f.icon
        return (
          <div
            key={f.label}
            className="feature-orbit absolute z-20 w-[4.5rem]"
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: STAGGER[i % STAGGER.length],
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white shadow-md ring-2 ring-violet/15 sm:h-14 sm:w-14">
                <Icon className="text-violet" size={20} aria-hidden />
              </div>
              <span className="w-full text-center text-[10px] font-semibold leading-tight text-plum">
                {f.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProductBlock({
  locale,
  eyebrowKey,
  titleKey,
  bodyKey,
  variant,
  centerImage,
  centerAlt,
  features,
  reverse,
}: {
  locale: Locale
  eyebrowKey: string
  titleKey: string
  bodyKey: string
  variant: 'library' | 'briefing'
  centerImage: string
  centerAlt: string
  features: { label: string; icon: LucideIcon }[]
  reverse?: boolean
}) {
  const isLibrary = variant === 'library'

  return (
    <div
      className={cn(
        'grid items-center gap-10 overflow-visible rounded-3xl border p-6 sm:p-10 lg:grid-cols-2 lg:gap-12',
        isLibrary
          ? 'border-lilac/30 bg-gradient-to-br from-white to-lilac-50'
          : 'border-violet/20 bg-gradient-to-br from-violet/5 to-plum/5',
      )}
    >
      <div className={cn(reverse && 'lg:order-2')}>
        <p className="text-xs font-bold tracking-widest text-mauve">{t(locale, eyebrowKey)}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {t(locale, titleKey)}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-plum/85 sm:text-lg">
          {t(locale, bodyKey)}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {features.map((f) => (
            <li
              key={f.label}
              className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-plum shadow-sm ring-1 ring-black/5"
            >
              {f.label}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn('overflow-visible px-2 py-4 sm:px-4', reverse && 'lg:order-1')}>
        <FeatureOrbit
          centerImage={centerImage}
          centerAlt={centerAlt}
          features={features}
          ringClass={isLibrary ? 'ring-violet/30' : 'ring-plum/30'}
        />
      </div>
    </div>
  )
}

export function LibraryBriefing() {
  const { locale } = useLocale()
  const isEs = locale === 'es'

  return (
    <Section id="producto-biblioteca" className="overflow-visible">
      <Container className="space-y-8 overflow-visible sm:space-y-10">
        <ProductBlock
          locale={locale}
          eyebrowKey="library.eyebrow"
          titleKey="library.title"
          bodyKey="library.body"
          variant="library"
          centerImage={libraryImage}
          centerAlt={
            isEs
              ? 'Residente revisando artículos médicos en su biblioteca'
              : 'Resident reviewing medical papers in their library'
          }
          features={libraryFeatures[locale]}
        />
        <ProductBlock
          locale={locale}
          eyebrowKey="briefing.eyebrow"
          titleKey="briefing.title"
          bodyKey="briefing.body"
          variant="briefing"
          centerImage={briefingImage}
          centerAlt={
            isEs
              ? 'Briefing diario con congresos y guías clínicas'
              : 'Daily briefing with congresses and clinical guidelines'
          }
          features={briefingFeatures[locale]}
          reverse
        />
      </Container>
    </Section>
  )
}
