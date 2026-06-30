import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/i18n'
import { trustUniversities } from '@/lib/universities'

export function LandingFooter() {
  const { locale } = useLocale()

  return (
    <footer className="border-t border-ink/5 bg-ink py-12 text-white/80">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <Logo inverted />
          <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
            <div>
              <p className="font-semibold text-white">Producto</p>
              <Link to="/app" className="mt-2 block hover:text-white">
                {t(locale, 'nav.demo')}
              </Link>
            </div>
            <div>
              <p className="font-semibold text-white">Legal</p>
              <span className="mt-2 block">Términos · Privacidad</span>
            </div>
            <div>
              <p className="font-semibold text-white">Contacto</p>
              <a href="mailto:hola@alivia-ai.com" className="mt-2 block hover:text-white">
                hola@alivia-ai.com
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-sm text-white/50">{t(locale, 'footer.copyright')}</p>
      </Container>
    </footer>
  )
}

export function TrustStrip() {
  const { locale } = useLocale()

  return (
    <section id="trust" className="border-y border-ink/5 bg-white py-10 sm:py-12">
      <Container>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-plum/60">
          {t(locale, 'trust.title')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {trustUniversities.map((u) => (
            <div
              key={u.short}
              className="flex h-11 w-28 items-center justify-center grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 sm:h-14 sm:w-36"
              title={u.name}
            >
              <img
                src={u.src}
                alt={u.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed text-plum/50">
          {t(locale, 'trust.disclaimer')}
        </p>
      </Container>
    </section>
  )
}
