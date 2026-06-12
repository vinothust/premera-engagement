# UST × Premera Engagement Portal — Backend API Specification

This document is the contract for the backend that powers the Engagement Portal. The
frontend (Vite + React) currently reads and writes all report content through a single
in-browser store ([`src/context/PortalDataContext.tsx`](src/context/PortalDataContext.tsx))
backed by `localStorage`. The backend described here is a **drop-in replacement** for that
store: implement these endpoints and the Admin page can `PUT` data and the slides can `GET`
it, with no change to the visual components.

- **Frontend data shape (source of truth):** [`src/data/portalData.ts`](src/data/portalData.ts)
- **Status enum:** [`src/data/status.ts`](src/data/status.ts)
- **Admin editor (the write client):** [`src/pages/Admin.tsx`](src/pages/Admin.tsx)

---

## 1. Conventions

| Item | Value |
|------|-------|
| Base URL | `https://api.<env>.premera-ust.example/v1` |
| Protocol | HTTPS only |
| Format | JSON (`Content-Type: application/json`) |
| Encoding | UTF-8 |
| Dates | Report dates are free-text strings (e.g. `"4/1/2025"`), exactly as shown on slides. Audit timestamps are ISO-8601 UTC. |
| IDs | Server-generated, opaque, stable strings (UUID v4 recommended). The client also generates UUIDs for new rows; the server may keep or replace them but must return the canonical id. |
| Versioning | URL path (`/v1`). Breaking changes → `/v2`. |

### Environments
- `dev` — local / integration
- `stg` — UAT for Premera + UST reviewers
- `prod` — live portal

---

## 2. Authentication & Authorization

Two audiences:

| Role | Capability | Endpoints |
|------|-----------|-----------|
| **Viewer** (Premera / UST stakeholders) | Read report data, submit feedback | `GET /portal*`, `POST /feedback` |
| **Editor / Admin** (delivery leads) | Full read + write of all report content | all endpoints |

**Recommended:** OAuth2 / OIDC (Azure AD is the natural fit for Premera) issuing JWT bearer
tokens. Authorize by role claim:

```
Authorization: Bearer <jwt>
```

- `GET` report endpoints: require `viewer` or `admin`.
- `POST/PUT/PATCH/DELETE` report endpoints: require `admin`.
- All write actions should be written to an **audit log** (who, when, what changed).

Return `401` when the token is missing/invalid, `403` when the role is insufficient.

---

## 3. Data Model

The canonical document is `PortalData`. These are the exact TypeScript interfaces the
frontend consumes — mirror them server-side.

```ts
type StatusKey = 'onTrack' | 'atRisk' | 'complete' | 'delayed' | 'notStarted'

interface MilestoneRow {
  id: string
  label: string
  due: string        // free text, e.g. "1/16/2025" (may be empty)
  revised: string    // free text (may be empty)
  status: StatusKey
}

interface MilestoneSection {
  id: string
  title: string      // e.g. "Critical Transition Milestones"
  rows: MilestoneRow[]
}

interface IssueRow {
  id: string
  issue: string             // "Issue / Risk / Dependency" text
  mitigations: string[]     // "Mitigation Plan / Next Steps" bullets
  date: string              // free text, e.g. "2/24"
  status: StatusKey
}

interface TowerGoLive {
  id: string
  name: string              // "ITO" | "BPO" | ...
  goLive: string            // free text date
  status: StatusKey
}

type WorkstreamIcon =
  | 'share2' | 'userCog' | 'arrowLeftRight'
  | 'truck' | 'building2' | 'shieldCheck' | 'clipboardCheck'

interface Workstream {
  id: string
  icon: WorkstreamIcon
  name: string
  status: StatusKey
  accomplishments: string[]
  activities: string[]
}

interface PortalData {
  asOf: string              // slide header "AS OF" pill, e.g. "DD/MM/YYYY"
  program: {
    levelLabel: string      // e.g. "<<Program Level>>"
    workstreams: Workstream[]
    towers: TowerGoLive[]
    milestones: MilestoneSection[]
    issues: IssueRow[]
  }
  tower: {
    levelLabel: string      // e.g. "<<Tower Level>>"
    accomplishments: string[]
    activities: string[]
    milestones: MilestoneSection[]
    keyActivities: MilestoneSection[]
    issues: IssueRow[]
  }
}
```

### Status enum reference

| `StatusKey` | Label | Dot colour |
|-------------|-------|-----------|
| `onTrack` | On Track | `#1aa260` (green) |
| `atRisk` | At Risk | `#f2b705` (amber) |
| `complete` | Complete | `#8e44ad` (purple) |
| `delayed` | Delayed | `#e0392b` (red) |
| `notStarted` | Not Started | `#b0b6bd` (grey) |

The server should **reject** any `status` value outside this set with `422`.

---

## 4. Endpoints

### 4.1 Whole-document (minimum viable backend)

Implementing just these two endpoints makes the entire portal work.

#### `GET /portal`
Returns the full `PortalData` snapshot. Consumed on app load by the slides.

```http
GET /v1/portal
Authorization: Bearer <jwt>
```
**200 OK**
```json
{
  "asOf": "06/12/2026",
  "program": { "levelLabel": "Program", "workstreams": [ ... ], "towers": [ ... ], "milestones": [ ... ], "issues": [ ... ] },
  "tower":   { "levelLabel": "ITO Tower", "accomplishments": [ ... ], "activities": [ ... ], "milestones": [ ... ], "keyActivities": [ ... ], "issues": [ ... ] }
}
```

#### `PUT /portal`
Replaces the full document. This is exactly what the Admin **Save** button sends.

```http
PUT /v1/portal
Authorization: Bearer <jwt>
Content-Type: application/json

{ "asOf": "...", "program": { ... }, "tower": { ... } }
```
**200 OK** → returns the saved document (with any server-canonicalised ids).
**422** → validation error (see §5).

> Concurrency: support optimistic locking via an `ETag`/`If-Match` header or a top-level
> `version` integer to prevent two editors clobbering each other.

---

### 4.2 Meta

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `GET` | `/portal/meta` | — | `{ "asOf": "..." }` |
| `PUT` | `/portal/meta` | `{ "asOf": "..." }` | Update the as-of date only |

---

### 4.3 Program Level — granular (optional, for fine-grained editing)

Base: `/portal/program`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/portal/program` | Full program block |
| `PUT` | `/portal/program` | Replace program block |
| `GET` | `/portal/program/workstreams` | List workstreams |
| `POST` | `/portal/program/workstreams` | Create workstream → `201` + created object |
| `PUT` | `/portal/program/workstreams/{id}` | Update workstream |
| `DELETE` | `/portal/program/workstreams/{id}` | Remove workstream → `204` |
| `GET/POST` | `/portal/program/towers` | List / create tower go-live rows |
| `PUT/DELETE` | `/portal/program/towers/{id}` | Update / delete |
| `GET/POST` | `/portal/program/milestones` | List / create milestone sections |
| `PUT/DELETE` | `/portal/program/milestones/{sectionId}` | Update / delete a section (with its rows) |
| `GET/POST` | `/portal/program/issues` | List / create issues |
| `PUT/DELETE` | `/portal/program/issues/{id}` | Update / delete |

#### Example — create a workstream
```http
POST /v1/portal/program/workstreams
Content-Type: application/json

{
  "icon": "shieldCheck",
  "name": "Information Security",
  "status": "onTrack",
  "accomplishments": ["Completed SOC2 gap assessment"],
  "activities": ["Finalize IAM cutover runbook"]
}
```
**201 Created**
```json
{ "id": "b2f1...", "icon": "shieldCheck", "name": "Information Security", "status": "onTrack", "accomplishments": ["..."], "activities": ["..."] }
```

---

### 4.4 Tower Level — granular (optional)

Base: `/portal/tower`

| Method | Path | Description |
|--------|------|-------------|
| `GET/PUT` | `/portal/tower` | Read / replace tower block |
| `PUT` | `/portal/tower/accomplishments` | Replace the accomplishments string list |
| `PUT` | `/portal/tower/activities` | Replace the planned-activities string list |
| `GET/POST` | `/portal/tower/milestones` | Milestone sections (Key Milestones) |
| `PUT/DELETE` | `/portal/tower/milestones/{sectionId}` | Update / delete |
| `GET/POST` | `/portal/tower/key-activities` | Milestone sections (Key Activities) |
| `PUT/DELETE` | `/portal/tower/key-activities/{sectionId}` | Update / delete |
| `GET/POST` | `/portal/tower/issues` | Issues |
| `PUT/DELETE` | `/portal/tower/issues/{id}` | Update / delete |

> The Tower report is produced **once for ITO and once for BPO**. Recommended: add a
> `tower` path/query segment — e.g. `/portal/tower/{towerKey}` where `towerKey ∈ {ito, bpo}` —
> so each tower has its own document. The current frontend renders a single tower; when the
> backend is multi-tower, add a tower switcher and pass the key through to `GET /portal`.

---

### 4.5 Feedback (Feedback-to-UST page)

The Feedback page currently keeps submissions in component state. Back it with:

```ts
interface FeedbackEntry {
  id: string
  rating: number            // 1–5
  area: string              // e.g. "Information Technology"
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  subject: string
  details: string
  submittedBy?: string      // from auth token if available
  createdAt: string         // ISO-8601
}
```

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/feedback` | Submit feedback → `201` + created entry |
| `GET` | `/feedback` | List entries (newest first). Supports `?area=`, `?limit=`, `?cursor=` |
| `GET` | `/feedback/summary` | `{ "count": 12, "average": 4.4 }` for the log header |

#### Example
```http
POST /v1/feedback
Content-Type: application/json

{ "rating": 5, "area": "Information Technology", "priority": "Medium",
  "subject": "Faster P2 turnaround", "details": "EDI gateway incident handled well." }
```
**201 Created** → full `FeedbackEntry` with `id` + `createdAt`.

---

## 5. Validation

Reject with `422 Unprocessable Entity` and the error envelope (§6) when:

- `status` ∉ the five `StatusKey` values.
- `icon` ∉ the seven `WorkstreamIcon` values.
- `rating` ∉ `1..5`.
- `priority` ∉ the four priority values.
- Required string fields (`name`, `issue`, `subject`) are empty after trim.
- A `PUT /portal` body is missing `program` or `tower`.

Free-text date fields (`due`, `revised`, `date`, `goLive`, `asOf`) are intentionally
**not** format-validated — they render verbatim on the slides.

---

## 6. Error format

All errors use one envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "status must be one of onTrack, atRisk, complete, delayed, notStarted",
    "field": "program.workstreams[2].status",
    "requestId": "req_8f2c..."
  }
}
```

| HTTP | `code` | When |
|------|--------|------|
| 400 | `BAD_REQUEST` | Malformed JSON |
| 401 | `UNAUTHENTICATED` | Missing/invalid token |
| 403 | `FORBIDDEN` | Authenticated but not `admin` |
| 404 | `NOT_FOUND` | Unknown id |
| 409 | `CONFLICT` | Optimistic-lock/version mismatch |
| 422 | `VALIDATION_ERROR` | Failed a rule in §5 |
| 500 | `INTERNAL` | Unexpected server error |

---

## 7. Frontend integration

To switch the app from `localStorage` to this API, change only the data layer — no slide
component changes:

1. In [`src/context/PortalDataContext.tsx`](src/context/PortalDataContext.tsx):
   - Replace `load()` with `await fetch(`${BASE}/portal`)` on mount (show a loading state).
   - In `save(next)`, `await fetch(`${BASE}/portal`, { method: 'PUT', body: JSON.stringify(next) })`.
   - Keep `localStorage` as an offline cache / optimistic fallback if desired.
2. Add an auth token provider (e.g. MSAL for Azure AD) and attach the bearer header in a
   small `apiFetch` wrapper.
3. Point the base URL at an env var: add `VITE_API_BASE_URL` to `.env` and read
   `import.meta.env.VITE_API_BASE_URL`.

The Admin page already produces a complete `PortalData` object on **Save**, so wiring
`save()` to `PUT /portal` is sufficient for full round-trip editing. The Admin **Export /
Import** buttons (JSON) are useful for seeding the database in lower environments.

---

## 8. Suggested implementation

- **Stack:** any — the contract is language-agnostic. Natural fits: .NET (Premera-aligned),
  Node/Express, or FastAPI.
- **Persistence:** a single JSON/document store (Cosmos DB, MongoDB, or a Postgres `jsonb`
  column) maps 1:1 to `PortalData`. Relational tables are only needed if you want row-level
  history/audit.
- **Audit:** persist every write to an append-only `audit_log` (actor, timestamp, diff).
- **Caching:** `GET /portal` is read-heavy and small — cache with a short TTL and bust on write.
- **OpenAPI:** generate a Swagger/OpenAPI 3 spec from these endpoints for client codegen and
  the UAT reviewers.

---

## 9. Quick endpoint index

```
GET    /v1/portal
PUT    /v1/portal
GET    /v1/portal/meta
PUT    /v1/portal/meta

GET    /v1/portal/program
PUT    /v1/portal/program
GET    /v1/portal/program/workstreams
POST   /v1/portal/program/workstreams
PUT    /v1/portal/program/workstreams/{id}
DELETE /v1/portal/program/workstreams/{id}
GET    /v1/portal/program/towers
POST   /v1/portal/program/towers
PUT    /v1/portal/program/towers/{id}
DELETE /v1/portal/program/towers/{id}
GET    /v1/portal/program/milestones
POST   /v1/portal/program/milestones
PUT    /v1/portal/program/milestones/{sectionId}
DELETE /v1/portal/program/milestones/{sectionId}
GET    /v1/portal/program/issues
POST   /v1/portal/program/issues
PUT    /v1/portal/program/issues/{id}
DELETE /v1/portal/program/issues/{id}

GET    /v1/portal/tower
PUT    /v1/portal/tower
PUT    /v1/portal/tower/accomplishments
PUT    /v1/portal/tower/activities
GET    /v1/portal/tower/milestones
POST   /v1/portal/tower/milestones
PUT    /v1/portal/tower/milestones/{sectionId}
DELETE /v1/portal/tower/milestones/{sectionId}
GET    /v1/portal/tower/key-activities
POST   /v1/portal/tower/key-activities
PUT    /v1/portal/tower/key-activities/{sectionId}
DELETE /v1/portal/tower/key-activities/{sectionId}
GET    /v1/portal/tower/issues
POST   /v1/portal/tower/issues
PUT    /v1/portal/tower/issues/{id}
DELETE /v1/portal/tower/issues/{id}

POST   /v1/feedback
GET    /v1/feedback
GET    /v1/feedback/summary
```
