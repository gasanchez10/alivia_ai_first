import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { LocaleProvider, useLocale } from '@/context/LocaleContext'
import { useAuth } from '@/context/AuthContext'
import { mockLogin } from '@/lib/auth'
import { t } from '@/lib/i18n'

function LoginForm() {
  const { locale } = useLocale()
  const { refresh } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await mockLogin(email, password)
      refresh()
      navigate('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-lilac-50 to-white p-6">
      <div className="w-full max-w-md rounded-2xl border border-lilac/30 bg-white p-8 shadow-lg">
        <Link to="/">
          <Logo className="justify-center" />
        </Link>
        <h1 className="mt-6 text-center font-display text-2xl font-semibold text-ink">
          {t(locale, 'auth.login.title')}
        </h1>
        <p className="mt-2 text-center text-xs text-plum/60">{t(locale, 'auth.mockNote')}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            type="email"
            placeholder={t(locale, 'auth.email')}
            className="w-full rounded-xl border border-lilac/40 px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder={t(locale, 'auth.password')}
            className="w-full rounded-xl border border-lilac/40 px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {t(locale, 'auth.login.submit')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-plum">
          {t(locale, 'auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-violet">
            {t(locale, 'auth.register.submit')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export function LoginPage() {
  return (
    <LocaleProvider>
      <LoginForm />
    </LocaleProvider>
  )
}
