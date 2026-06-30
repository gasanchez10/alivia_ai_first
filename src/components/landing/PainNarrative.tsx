import { Container, Section } from '@/components/ui/Container'
import { useLocale } from '@/context/LocaleContext'
import { painScenes, t } from '@/lib/i18n'
import { painVignetteImages } from '@/lib/pain-images'

function PainCard({
  time,
  scene,
  body,
  image,
  alt,
  tall,
}: {
  time: string
  scene: string
  body: string
  image: string
  alt: string
  tall?: boolean
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 ${
        tall ? 'min-h-[320px] sm:min-h-[360px]' : 'min-h-[340px] sm:min-h-[380px]'
      }`}
    >
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lilac">{time}</p>
        <h3 className="mt-2 text-xl font-semibold leading-snug">{scene}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{body}</p>
      </div>
    </article>
  )
}

export function PainNarrative() {
  const { locale } = useLocale()
  const scenes = painScenes[locale]
  const isEs = locale === 'es'

  const vignettes = scenes.map((s, idx) => ({
    ...s,
    image: painVignetteImages[idx].src,
    alt: isEs ? painVignetteImages[idx].altEs : painVignetteImages[idx].altEn,
  }))

  return (
    <Section id="producto" className="!bg-bone">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            {t(locale, 'pain.title')}
          </h2>
          <p className="mt-4 text-lg text-plum/80">{t(locale, 'pain.subtitle')}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vignettes.slice(0, 3).map((v, i) => (
            <PainCard key={i} {...v} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {vignettes.slice(3).map((v, i) => (
            <PainCard key={i} {...v} tall />
          ))}
        </div>
      </Container>
    </Section>
  )
}
