import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_PORTAL_DATA, type PortalData } from '../data/portalData'

const STORAGE_KEY = 'ustpremera_portaldata_v2'

interface Ctx {
  data: PortalData
  /** Replace the full dataset and persist it (used by the Admin page Save). */
  save: (next: PortalData) => void
  /** Restore the seeded defaults. */
  reset: () => void
}

const PortalDataContext = createContext<Ctx | null>(null)

function load(): PortalData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_PORTAL_DATA, ...(JSON.parse(raw) as PortalData) }
  } catch {
    /* ignore corrupt storage */
  }
  return DEFAULT_PORTAL_DATA
}

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortalData>(load)

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* storage may be unavailable (private mode) — UI still works in-memory */
    }
  }, [data])

  const save = useCallback((next: PortalData) => setData(next), [])
  const reset = useCallback(() => setData(DEFAULT_PORTAL_DATA), [])

  const value = useMemo(() => ({ data, save, reset }), [data, save, reset])
  return <PortalDataContext.Provider value={value}>{children}</PortalDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortalData(): Ctx {
  const ctx = useContext(PortalDataContext)
  if (!ctx) throw new Error('usePortalData must be used within a PortalDataProvider')
  return ctx
}
