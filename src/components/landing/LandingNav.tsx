import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useLocale } from '@/context/LocaleContext'
import { t } from '@/lib/i18n'

const navLinks = [
  { href: '#ronda', key: 'nav.howItWorks' },
  { href: '#producto', key: 'nav.product' },
  { href: '#precios', key: 'nav.pricing' },
  { href: '#faq', key: 'nav.faq' },
]

export function LandingNav() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const scrollTo = (href: string) => {
    setOpen(false)
    if (!isLanding) return
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-surface/90 backdrop-blur-md dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => scrollTo(l.href)}
              className="text-[15px] text-plum/80 hover:text-plum"
            >
              {t(locale, l.key)}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-plum hover:bg-lilac-50 dark:hover:bg-white/10"
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>
          <Link to="/login" className="text-[15px] font-medium text-plum hover:text-violet">
            {t(locale, 'nav.login')}
          </Link>
          <Link to="/register">
            <Button>{t(locale, 'nav.join')}</Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/5 bg-surface px-5 py-4 md:hidden dark:border-white/10">
          {navLinks.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => scrollTo(l.href)}
              className="block w-full py-2 text-left text-plum"
            >
              {t(locale, l.key)}
            </button>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/login" className="py-2 text-plum" onClick={() => setOpen(false)}>
              {t(locale, 'nav.login')}
            </Link>
            <Link to="/register" onClick={() => setOpen(false)}>
              <Button className="w-full">{t(locale, 'nav.join')}</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
