import { useState } from 'react'
import { Container, Section } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useLocale } from '@/context/LocaleContext'
import { countryOptions, t, yearOptions } from '@/lib/i18n'
import { submitWaitlist } from '@/lib/waitlist'

export function WaitlistForm() {
  const { locale } = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    country: 'Colombia',
    city: '',
    university: '',
    year: 'R1',
    specialty: 'Medicina interna',
    whatsapp: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await submitWaitlist(form)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error')
    }
  }

  if (status === 'success') {
    return (
      <Section id="waitlist" className="!bg-violet/5">
        <Container>
          <div className="mx-auto max-w-lg rounded-2xl border border-violet/20 bg-white p-8 text-center shadow-sm">
            <p className="text-2xl">🎉</p>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
              {t(locale, 'form.success')}
            </h2>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section id="waitlist" className="!bg-violet/5">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-ink">{t(locale, 'form.title')}</h2>
            <p className="mt-2 text-plum/80">{t(locale, 'form.subtitle')}</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <input
              required
              type="email"
              placeholder="tu.correo@universidad.edu.co"
              className="w-full rounded-xl border border-lilac/40 px-4 py-3 text-ink outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className="rounded-xl border border-lilac/40 px-4 py-3"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                {countryOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                required
                placeholder={locale === 'es' ? 'Ciudad' : 'City'}
                className="rounded-xl border border-lilac/40 px-4 py-3"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <input
              required
              placeholder={locale === 'es' ? 'Universidad / Hospital' : 'University / Hospital'}
              className="w-full rounded-xl border border-lilac/40 px-4 py-3"
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className="rounded-xl border border-lilac/40 px-4 py-3"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              >
                {yearOptions.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <input
                placeholder={locale === 'es' ? 'Especialidad' : 'Specialty'}
                className="rounded-xl border border-lilac/40 px-4 py-3"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-plum">
              <input
                type="checkbox"
                checked={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.checked })}
              />
              WhatsApp
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? '...' : t(locale, 'form.submit')}
            </Button>
            <p className="text-center text-xs text-plum/60">
              {locale === 'es' ? 'Demo: datos guardados en localStorage' : 'Demo: data stored in localStorage'}
            </p>
          </form>
        </div>
      </Container>
    </Section>
  )
}
