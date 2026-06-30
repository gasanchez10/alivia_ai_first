import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Mic, Radio, Sparkles, Moon, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { navFamilies } from '@/lib/navigation'
import { dashboardStats } from '@/lib/mock-app-data'
import { getManagementPlans } from '@/lib/mock-management-plans-store'
import { AppCard } from '@/components/app/AppCard'

const statLinks = [
  { icon: Radio, label: 'Inteligencia diaria', value: `${dashboardStats.briefingCount} novedades`, to: '/app/briefing' },
  { icon: Mic, label: 'Clínico', value: `${dashboardStats.encountersPending} pendientes`, to: '/app/ronda' },
  { icon: BookOpen, label: 'Biblioteca', value: `${dashboardStats.libraryCount} papers`, to: '/app/biblioteca' },
]

export function DashboardPage() {
  const { user } = useAuth()
  const modules = navFamilies.filter((f) => f.id !== 'home')
  const plans = getManagementPlans()
  const pendingPlanItems = plans.reduce(
    (sum, p) => sum + p.items.filter((i) => !i.completed).length,
    0,
  )
  const previewItems = plans
    .flatMap((p) => p.items.filter((i) => !i.completed).map((i) => ({ ...i, plan: p })))
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink md:text-3xl">
        Hola, {user?.name?.split(' ')[0] ?? 'residente'}
      </h1>
      <p className="mt-1 text-plum/70">
        {user?.year ?? 'R2'} · {user?.specialty ?? 'Medicina interna'} ·{' '}
        {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {statLinks.map((s) => (
          <Link key={s.label} to={s.to}>
            <AppCard hover className="h-full">
              <s.icon className="text-violet" size={24} />
              <p className="mt-3 text-sm text-plum/60">{s.label}</p>
              <p className="font-semibold text-ink">{s.value}</p>
            </AppCard>
          </Link>
        ))}
      </div>

      <AppCard className="mt-8 border-violet/20 bg-gradient-to-r from-violet/5 to-plum/5">
        <div className="flex items-start gap-3">
          <Sparkles className="shrink-0 text-violet" size={24} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-ink">Planes de manejo pendientes</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2 py-0.5 text-xs font-bold text-violet">
                <Moon size={12} />
                {pendingPlanItems} ítems
              </span>
            </div>
            <p className="mt-1 text-sm text-plum/80">
              Afirmaciones citadas por paciente — prioriza y marca al cerrar cada plan.
            </p>
            <ul className="mt-3 space-y-1.5">
              {previewItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm text-plum/85">
                  <CheckCircle2 size={14} className="shrink-0 text-plum/40" />
                  <span className="line-clamp-1">{item.claim}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/app/tareas"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet"
            >
              Ver planes de manejo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </AppCard>

      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Módulos</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {modules.map((family) => {
          const Icon = family.icon
          return (
            <Link key={family.id} to={family.path}>
              <AppCard hover>
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-violet" />
                  <span className="font-medium text-ink">{family.label}</span>
                </div>
                <p className="mt-1 text-sm text-plum/65">{family.description}</p>
              </AppCard>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
