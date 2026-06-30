import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getSession, mockLogout, type User } from '@/lib/auth'

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  refresh: () => void
  logout: () => void
}>({ user: null, loading: true, refresh: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = () => setUser(getSession())

  useEffect(() => {
    refresh()
    setLoading(false)
  }, [])

  const logout = () => {
    mockLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
