import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_PORTAL_DATA, type PortalData } from '../data/portalData'
import { apiFetch } from '../lib/api'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'ustpremera_portaldata_v6'

interface Ctx {
  data: PortalData
  loading: boolean
  error: string | null
  save: (next: PortalData) => void
  reset: () => void
}

const PortalDataContext = createContext<Ctx | null>(null)

function loadCache(): PortalData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_PORTAL_DATA, ...(JSON.parse(raw) as PortalData) }
  } catch { /* ignore corrupt storage */ }
  return DEFAULT_PORTAL_DATA
}

function persist(d: PortalData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) } catch { /* ignore */ }
}

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const { loading: authLoading, token } = useAuth()
  const [data, setData]   = useState<PortalData>(loadCache)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [etag, setEtag]   = useState<string | null>(null)

  // Fetch from API once auth is resolved; re-fetch if token changes
  useEffect(() => {
    if (authLoading) return
    setLoading(true)
    apiFetch('/portal')
      .then(async res => {
        const et = res.headers.get('ETag')
        if (et) setEtag(et)
        const json = await res.json() as PortalData
        setData(json)
        persist(json)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [authLoading, token])

  // Optimistically update local state; persist to API in background
  const save = useCallback((next: PortalData) => {
    setData(next)
    persist(next)
    const headers: Record<string, string> = {}
    if (etag) headers['If-Match'] = etag
    apiFetch('/portal', { method: 'PUT', body: JSON.stringify(next), headers })
      .then(async res => {
        const et = res.headers.get('ETag')
        if (et) setEtag(et)
        const json = await res.json() as PortalData
        setData(json)
        persist(json)
      })
      .catch((err: Error) => setError(err.message))
  }, [etag])

  const reset = useCallback(() => {
    apiFetch('/portal/reset', { method: 'POST' })
      .then(async res => {
        const json = await res.json() as PortalData
        setData(json)
        setEtag(null)
        persist(json)
        setError(null)
      })
      .catch(() => {
        setData(DEFAULT_PORTAL_DATA)
        persist(DEFAULT_PORTAL_DATA)
      })
  }, [])

  const value = useMemo(
    () => ({ data, loading, error, save, reset }),
    [data, loading, error, save, reset],
  )
  return <PortalDataContext.Provider value={value}>{children}</PortalDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortalData(): Ctx {
  const ctx = useContext(PortalDataContext)
  if (!ctx) throw new Error('usePortalData must be used within a PortalDataProvider')
  return ctx
}
