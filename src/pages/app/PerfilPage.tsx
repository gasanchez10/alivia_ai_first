import { Link } from 'react-router-dom'
import { Crown, Mail, GraduationCap, CreditCard, Shield } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { profilePlan } from '@/lib/mock-app-data'

export function PerfilPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader section="Cuenta" title="Perfil" description="Datos, plan y verificación institucional." />

      <AppCard className="mb-4">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet text-2xl font-bold text-white">
            {user?.name?.charAt(0) ?? 'A'}
          </span>
          <div>
            <h2 className="font-semibold text-ink">{user?.name ?? 'Residente demo'}</h2>
            <p className="flex items-center gap-1.5 text-sm text-plum/70">
              <Mail size={14} /> {user?.email ?? 'demo@universidad.edu.co'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-plum/70">
              <GraduationCap size={14} /> {user?.year ?? 'R2'} · {user?.specialty ?? 'Medicina interna'}
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard className="mb-4 border-violet/25 bg-gradient-to-br from-violet/5 to-plum/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="text-violet" size={20} />
              <p className="font-semibold text-ink">{profilePlan.name}</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-violet">{profilePlan.price}</p>
            <p className="text-sm text-plum/60">Renueva el {profilePlan.renews}</p>
          </div>
          <Button variant="secondary">Gestionar plan</Button>
        </div>
        <ul className="mt-4 space-y-1.5">
          {profilePlan.features.map((f) => (
            <li key={f} className="text-sm text-plum/80">
              · {f}
            </li>
          ))}
        </ul>
      </AppCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <AppCard>
          <Shield className="text-violet" size={22} />
          <p className="mt-2 font-semibold text-ink">Verificación</p>
          <p className="mt-1 text-sm text-plum/70">Correo @universidad verificado</p>
          <span className="mt-2 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
            Activo
          </span>
        </AppCard>
        <AppCard>
          <CreditCard className="text-violet" size={22} />
          <p className="mt-2 font-semibold text-ink">Facturación</p>
          <p className="mt-1 text-sm text-plum/70">Sin método de pago (demo)</p>
          <Link to="/register" className="mt-2 inline-block text-sm font-semibold text-violet hover:underline">
            Configurar
          </Link>
        </AppCard>
      </div>
    </div>
  )
}
