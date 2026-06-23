# API Changes Required — swagger.json vs Current Execution

Generated: 2026-06-23
Compared: `swagger.json` (target API) → current frontend source (`src/`)

---

## TL;DR

The `swagger.json` is well-aligned with `api_requirements.md`. The problem is the **frontend
makes zero API calls** — all three storage points are still client-only (localStorage /
in-memory). The sections below document every delta that must be closed before the frontend
can talk to the backend described in swagger.json.

---

## 1. swagger.json vs api_requirements.md — Differences

### 1a. Endpoints in swagger NOT in api_requirements.md (addons — fine to keep)

| Endpoint | Note |
|---|---|
| `GET /health` | Liveness check — standard ops addition |
| `POST /auth/dev-login` | Dev JWT stub — §3 mentions auth but doesn't define a dev login route; swagger formalises it |

### 1b. Endpoints in api_requirements.md §13 MISSING from swagger.json

None. Every endpoint from the spec index is present in swagger.

### 1c. Schema deltas

All core schemas (`PortalData`, `ProgramTab`, `TowerBlock`, `IssueRow`, `RiskAction`,
`MilestoneRow`, `MilestoneSection`, `TowerGoLive`, `Workstream`, `FeedbackEntry`,
`QuickFeedbackEntry`, `AuditEntry`) match the TypeScript types in `src/data/portalData.ts`
and `api_requirements.md §4`.

One minor gap: swagger's `TowerBlock` schema marks `keyActivities` as **required** — confirm
the backend seed includes it even when empty (`[]`) so the frontend never receives a missing
field.

---

## 2. Current Frontend vs swagger.json — What Needs Changing

### 2a. PortalDataContext.tsx — still pure localStorage

**File:** `src/context/PortalDataContext.tsx`

| What | Current | Required by swagger |
|---|---|---|
| `load()` | reads `localStorage` key `ustpremera_portaldata_v6` | `GET /v1/portal` with `Authorization: Bearer <token>` |
| `save(next)` | writes `localStorage` | `PUT /v1/portal` — body: full `PortalData`; support `If-Match` / `ETag` for optimistic locking (swagger returns `ETag` on both GET and PUT) |
| `reset()` | restores `DEFAULT_PORTAL_DATA` constant in-memory | `POST /v1/portal/reset` |

**Required changes:**
```
- Add async load on mount: await fetch(`${BASE}/portal`, { headers: { Authorization } })
- Add loading/error state so pages don't render stale data
- save() → PUT /v1/portal; store returned ETag, send If-Match on next PUT (handle 409 Conflict)
- reset() → POST /v1/portal/reset
- Keep localStorage as offline cache / optimistic fallback (optional but recommended per §11)
- Add VITE_API_BASE_URL env var; read via import.meta.env.VITE_API_BASE_URL
```

---

### 2b. QuickFeedback.tsx — still pure localStorage

**File:** `src/components/QuickFeedback.tsx`

| What | Current | Required by swagger |
|---|---|---|
| `readEntry(itemId)` | `localStorage` `ustpremera_quickfeedback_v1[itemId]` | `GET /v1/quick-feedback/{itemId}` → `QuickFeedbackEntry \| null` |
| `writeEntry(itemId, vote, comment)` | writes `localStorage` | `PUT /v1/quick-feedback/{itemId}` — body: `{ vote, comment? }` |
| `deleteEntry(itemId)` | deletes from `localStorage` | `DELETE /v1/quick-feedback/{itemId}` |

**Required changes:**
```
- Replace all three helpers with async fetch calls
- On mount: GET /v1/quick-feedback/{itemId} to hydrate initial vote state
  (currently reads synchronously from localStorage; needs useEffect + loading guard)
- handleUp / handleDown / submitComment: await PUT or DELETE before updating local state
- Error handling: if PUT/DELETE fails, revert optimistic state
```

---

### 2c. Feedback.tsx — in-memory only, no persistence

**File:** `src/pages/Feedback.tsx`

| What | Current | Required by swagger |
|---|---|---|
| `submit()` | pushes to `useState<Entry[]>` — **lost on reload** | `POST /v1/feedback` — body: `FeedbackInput` |
| Log panel population | empty until user submits in current session | `GET /v1/feedback` on mount — `FeedbackListResponse { entries[], nextCursor? }` |
| Average rating | computed from in-memory `log` | `GET /v1/feedback/summary` → `{ count, average }` |
| `AREAS` dropdown | hardcoded constant in the file | `GET /v1/feedback/areas` → `string[]` (keep constant as fallback) |
| `Entry` type | `{ rating, area, subject, details }` | Missing: **`priority`** (required by `FeedbackInput`), plus `id` and `createdAt` on the response shape |

**Required changes:**
```
- Update local Entry type to include priority (it's already collected by the form's
  <select> but never stored in log state)
- submit(): POST /v1/feedback with { rating, area, priority, subject, details }
  → on 201, prepend returned FeedbackEntry to log
- useEffect on mount: GET /v1/feedback → populate log; GET /v1/feedback/summary → set avg
- Load AREAS from GET /v1/feedback/areas; fall back to hardcoded constant on error
- Handle 422 (validation error) — surface to user
```

---

### 2d. Auth — no bearer token anywhere

swagger.json applies `bearerAuth` globally (all endpoints except `/health` and
`/auth/dev-login` require `Authorization: Bearer <jwt>`). The frontend has no auth concept.

**Required changes:**
```
- Add a token provider (MSAL for Azure AD is the recommended path per api_requirements.md §3)
- Wrap all fetch calls in an apiFetch(path, opts) helper that:
    1. Reads the current token from auth context
    2. Attaches Authorization: Bearer <token> header
    3. On 401, triggers re-authentication flow
    4. On 403, shows "insufficient permissions" UI
- Admin page: gate write actions on role === 'admin' (from JWT claim)
- Dev shortcut: POST /v1/auth/dev-login with { sub, role } → store returned token
  (for local testing only — never ship to prod)
```

---

### 2e. Environment variable — missing

**Required addition:**
```
# .env.development
VITE_API_BASE_URL=http://localhost:3000/v1

# .env.production
VITE_API_BASE_URL=http://your-server:8083/v1
```

Read in code as `import.meta.env.VITE_API_BASE_URL` (exposed by Vite automatically for
`VITE_` prefixed vars).

---

## 3. No-Change Items

These areas of the frontend match the swagger shapes and need no modification once the data
layer is wired:

| Component | Why no change needed |
|---|---|
| All slide pages (`ProgramLevel`, `TowerLevel`, `Risks`, `WaveModel`) | Read from `usePortalData()` — once context calls the API, slides get live data automatically |
| `IssuesTable`, `MilestoneTable`, `RiskActionsModal`, `StatusDot` | Pure render components; no storage awareness |
| `Admin.tsx` Export / Import JSON buttons | Already produce/consume the exact `PortalData` shape — usable as-is for seeding via `PUT /v1/portal` |
| `src/data/status.ts` | `StatusKey` enum matches swagger exactly |

---

## 4. Implementation Order (Recommended)

1. **Add env var + apiFetch helper** (unblocks everything else)
2. **Wire PortalDataContext** — highest impact; all slide pages get live data immediately
3. **Wire Feedback.tsx** — closes the data-loss gap (submissions currently vanish on reload)
4. **Wire QuickFeedback.tsx** — makes votes shared across browsers/users
5. **Add auth** — can be mocked with `/auth/dev-login` during development; replace with
   MSAL/OIDC before production deploy

---

## 5. swagger.json Additions to Consider

These are currently in swagger but have no frontend counterpart yet:

| Endpoint | Frontend use case |
|---|---|
| `GET /audit` | Admin page "change history" panel — not yet built |
| `GET /quick-feedback` (admin, all votes) | Admin dashboard showing flagged rows — not yet built |
| `GET /feedback/summary` | Already used by Feedback.tsx log panel (see §2c) |
| Granular program/tower endpoints (`/workstreams/{id}`, `/issues/{id}`, etc.) | Admin page currently saves the whole document via `PUT /portal`; granular endpoints are available for future fine-grained edits without a page re-read |
