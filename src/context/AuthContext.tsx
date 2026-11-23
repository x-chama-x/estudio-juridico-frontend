import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from '../services/api'
import type { Usuario } from '../types/auth'

interface AuthContextValue {
  usuario: Usuario | null
  cargando: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCargando(false)
      return
    }
    api
      .get<Usuario>('/auth/me')
      .then((res) => setUsuario(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCargando(false))
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post<{ token: string; usuario: Usuario }>('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUsuario(res.data.usuario)
  }

  function logout() {
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}