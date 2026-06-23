const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/v1'

let _token: string | null = null

export function setApiToken(t: string | null): void {
  _token = t
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export async function apiFetch(path: string, opts: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (_token) headers['Authorization'] = `Bearer ${_token}`
  Object.assign(headers, opts.headers as Record<string, string> | undefined)

  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  if (!res.ok) {
    let code = String(res.status)
    let message = res.statusText
    try {
      const body = await res.clone().json() as { error?: { code?: string; message?: string } }
      code = body.error?.code ?? code
      message = body.error?.message ?? message
    } catch { /* ignore parse error */ }
    throw new ApiError(res.status, code, message)
  }
  return res
}

export async function devLogin(
  sub: string,
  role: 'viewer' | 'admin',
): Promise<{ token: string; sub: string; role: string }> {
  const res = await fetch(`${BASE}/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sub, role }),
  })
  if (!res.ok) throw new Error(`Dev login failed: ${res.status}`)
  const data = await res.json() as { token: string; sub: string; role: string }
  setApiToken(data.token)
  return data
}
