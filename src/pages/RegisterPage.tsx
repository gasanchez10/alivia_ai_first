import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { LocaleProvider, useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'
import { mockRegister } from '@/lib/auth'
import { t, yearOptions } from '@/lib/i18n'

function RegisterForm() {
  const { locale } = useLocale()
  const { refresh } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialty: 'Medicina interna',
    year: 'R1',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await mockRegister(form)
      refresh()
      navigate('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet/5 to-surface p-6 dark:from-ink dark:to-bone">
      <div className="w-full max-w-md rounded-2xl border border-lilac/30 bg-surface p-8 shadow-lg dark:border-lilac/20 dark:shadow-none">
        <Link to="/">
          <Logo className="justify-center" />
        </Link>
        <h1 className="mt-6 text-center font-display text-2xl font-semibold text-ink">
          {t(locale, 'auth.register.title')}
        </h1>
        <p className="mt-2 text-center text-xs text-plum/60">{t(locale, 'auth.mockNote')}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            placeholder={t(locale, 'auth.name')}
            className="w-full rounded-xl border border-lilac/40 px-4 py-3"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder={t(locale, 'auth.email')}
            className="w-full rounded-xl border border-lilac/40 px-4 py-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder={t(locale, 'auth.password')}
            className="w-full rounded-xl border border-lilac/40 px-4 py-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
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
              placeholder="Especialidad"
              className="rounded-xl border border-lilac/40 px-4 py-3"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {t(locale, 'auth.register.submit')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-plum">
          {t(locale, 'auth.hasAccount')}{' '}
          <Link to="/login" className="font-semibold text-violet">
            {t(locale, 'auth.login.submit')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export function RegisterPage() {
  return (
    <LocaleProvider>
      <RegisterForm />
    </LocaleProvider>
  )
}
