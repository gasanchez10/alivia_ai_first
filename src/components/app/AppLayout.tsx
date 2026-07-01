import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/ui/Logo'
import { FamilySubNav } from '@/components/app/FamilySubNav'
import { NotificationsBell } from '@/components/app/NotificationsBell'
import { TutorialGuide } from '@/components/app/tutorial/TutorialGuide'
import { TutorialProvider, useTutorial } from '@/context/TutorialContext'
import { useAuth } from '@/context/AuthContext'
import { getFamilyForPath, isFamilyActive, navFamilies } from '@/lib/navigation'
import { cn } from '@/lib/utils'

function AppLayoutInner() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { enabled: tutorialOn } = useTutorial()

  const activeFamily = getFamilyForPath(location.pathname)
  const showSubNav = activeFamily?.children && activeFamily.children.length > 1

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-bone">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-lilac/30 bg-white transition-transform lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-lilac/20 px-4 py-4">
          <Link to="/app" onClick={() => setSidebarOpen(false)}>
            <Logo />
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Principal">
          {navFamilies.map((family) => {
            const Icon = family.icon
            const active = isFamilyActive(family, location.pathname)
            return (
              <NavLink
                key={family.id}
                to={family.path}
                end={family.id === 'home'}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-violet/10 text-violet'
                    : 'text-plum hover:bg-lilac-50',
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 2} aria-hidden />
                {family.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-lilac/20 p-4">
          <Link
            to="/app/perfil"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-lilac-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet text-sm font-bold text-white">
              {user?.name?.charAt(0) ?? 'A'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
              <p className="truncate text-xs text-plum/60">Perfil y plan</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-plum hover:bg-lilac-50 hover:text-violet"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-end border-b border-lilac/20 bg-white px-4 py-3">
          <button type="button" className="mr-auto lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-1">
            <Link
              to="/app/ayuda"
              className="rounded-full p-2 text-plum hover:bg-lilac-50"
              title="Ayuda"
            >
              <HelpCircle size={20} />
            </Link>
            <NotificationsBell />
          </div>
        </header>

        {showSubNav && activeFamily?.children && (
          <div className="border-b border-lilac/20 bg-white px-4 md:px-6">
            <FamilySubNav items={activeFamily.children} />
          </div>
        )}

        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 md:p-6',
            tutorialOn && 'pb-52 sm:pb-48',
          )}
        >
          <Outlet />
        </main>
      </div>

      <TutorialGuide />
    </div>
  )
}

export function AppLayout() {
  return (
    <TutorialProvider>
      <AppLayoutInner />
    </TutorialProvider>
  )
}
