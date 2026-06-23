import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { devLogin, setApiToken } from '../lib/api'

const TOKEN_KEY = 'ustpremera_token'
const ROLE_KEY  = 'ustpremera_role'
const SUB_KEY   = 'ustpremera_sub'

interface AuthCtx {
  token: string | null
  role: string | null
  sub: string | null
  isAdmin: boolean
  loading: boolean
  login: (sub: string, role: 'viewer' | 'admin') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole]   = useState<string | null>(null)
  const [sub, setSub]     = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY)
    const storedRole = (sessionStorage.getItem(ROLE_KEY) as 'viewer' | 'admin' | null) ?? 'admin'
    const storedSub = sessionStorage.getItem(SUB_KEY) ?? 'dev@premera.com'

    if (stored) {
      setApiToken(stored)
      setToken(stored)
      setRole(sessionStorage.getItem(ROLE_KEY))
      setSub(sessionStorage.getItem(SUB_KEY))
    }

    // Always refresh token for current backend on startup.
    // Falls back to stored token when backend/auth is unavailable.
    devLogin(storedSub, storedRole)
      .then(data => {
        sessionStorage.setItem(TOKEN_KEY, data.token)
        sessionStorage.setItem(ROLE_KEY,  data.role)
        sessionStorage.setItem(SUB_KEY,   data.sub)
        setToken(data.token)
        setRole(data.role)
        setSub(data.sub)
      })
      .catch(() => {
        if (!stored) {
          setApiToken(null)
          setToken(null)
          setRole(null)
          setSub(null)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (sub: string, role: 'viewer' | 'admin') => {
    const data = await devLogin(sub, role)
    sessionStorage.setItem(TOKEN_KEY, data.token)
    sessionStorage.setItem(ROLE_KEY,  data.role)
    sessionStorage.setItem(SUB_KEY,   data.sub)
    setToken(data.token)
    setRole(data.role)
    setSub(data.sub)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(ROLE_KEY)
    sessionStorage.removeItem(SUB_KEY)
    setApiToken(null)
    setToken(null)
    setRole(null)
    setSub(null)
  }, [])

  const value = useMemo(
    () => ({ token, role, sub, isAdmin: role === 'admin', loading, login, logout }),
    [token, role, sub, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
