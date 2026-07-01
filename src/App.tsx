import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AppLayout } from '@/components/app/AppLayout'
import { DashboardPage } from '@/pages/app/DashboardPage'
import { BriefingPage } from '@/pages/app/BriefingPage'
import { EncuentroPage } from '@/pages/app/EncuentroPage'
import { BibliotecaPage } from '@/pages/app/BibliotecaPage'
import { TareasPage } from '@/pages/app/TareasPage'
import { TrendingPage } from '@/pages/app/TrendingPage'
import { PerfilPage } from '@/pages/app/PerfilPage'
import { AyudaPage } from '@/pages/app/AyudaPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-plum">
        Cargando...
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="briefing" element={<BriefingPage />} />
        <Route path="briefing/citados" element={<TrendingPage />} />
        <Route path="trending" element={<Navigate to="/app/briefing/citados" replace />} />
        <Route path="ronda" element={<EncuentroPage />} />
        <Route path="encuentro" element={<Navigate to="/app/ronda" replace />} />
        <Route path="consulta" element={<Navigate to="/app/ronda" replace />} />
        <Route path="biblioteca/:section?" element={<BibliotecaPage />} />
        <Route path="presentaciones" element={<Navigate to="/app/biblioteca/presentaciones" replace />} />
        <Route path="cuestionario" element={<Navigate to="/app/biblioteca/cuestionarios" replace />} />
        <Route path="tareas" element={<TareasPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="ayuda" element={<AyudaPage />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
