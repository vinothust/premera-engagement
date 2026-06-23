# UST × Premera Engagement Portal — Architecture & Flow

> Deployment target: Linux server · All services run as Docker containers on the same host

```mermaid
flowchart TD
    UST["UST Delivery Lead\n(Admin)"]
    PRE["Premera Stakeholder\n(Viewer — Status Finder)"]

    subgraph AAD["Azure Active Directory  ·  Premera Tenant  ·  External"]
        AUTH["OIDC / OAuth 2.0\nIssues JWT\nrole: admin  |  role: viewer"]
    end

    subgraph LINUX["Linux Server  ·  Docker Host"]

        subgraph FRONT["Container: premera-ui  ·  Nginx"]
            direction LR
            PG["/program  ·  /tower  ·  /wave\n/risks  ·  /feedback\n─────────────────────\nRead-only status view\nBoth roles"]
            ADM["/admin\n─────────────────\nContent CMS\nUST only  ·  role=admin"]
        end

        subgraph API["Container: premera-api"]
            direction TB
            R1["GET  /v1/portal\nServes full programme data"]
            R2["PUT  /v1/portal\nPOST /v1/portal/reset\nAdmin Save & Reset  ·  role=admin"]
            R3["POST /v1/feedback\nGET  /v1/feedback + /summary + /areas"]
            R4["PUT  /v1/quick-feedback/{rowId}\nPer-row thumbs up / down votes"]
            R5["GET  /v1/audit\nChange history  ·  role=admin"]
        end

        subgraph CACHE["Container: premera-redis"]
            RD[("Redis\nGET /portal response\nTTL: 30 s\nbust on every PUT /portal")]
        end

        subgraph DB["Container: premera-db"]
            PG2[("PostgreSQL  or  MongoDB\n─────────────────────\nportal_data\n  → full PortalData document\nfeedback_entries\n  → rating, area, priority, subject\nquick_feedback\n  → per-row votes + comments\naudit_log\n  → immutable change history")]
        end

    end

    %% --- Port legend (external → internal) ---
    FRONT -.->|"host :80 → container :80\nhost :443 → container :80"| FRONT
    API -.->|"host :8080 → container :8080"| API
    CACHE -.->|"localhost :6379  (internal only)"| CACHE
    DB -.->|"localhost :5432 PostgreSQL\nlocalhost :27017 MongoDB\n(internal only — not exposed)"| DB

    %% --- Authentication ---
    UST -->|"1  login"| AUTH
    PRE -->|"1  login"| AUTH
    AUTH -->|"2  JWT Bearer token"| FRONT

    %% --- Status pages ---
    PG -->|"3  load programme data"| R1
    PG -->|"4  submit feedback"| R3
    PG -->|"5  vote on row"| R4

    %% --- Admin screen ---
    ADM -->|"3  load current data"| R1
    ADM -->|"6  save / reset content"| R2
    ADM -->|"7  view change history"| R5

    %% --- API ↔ Cache ---
    R1 <-->|"cache read / write\nlocalhost :6379"| RD
    R2 -->|"bust cache on write"| RD

    %% --- API → DB ---
    R1 -->|"read  ·  localhost :5432 / :27017"| PG2
    R2 -->|"write + append audit"| PG2
    R3 -->|"read / write"| PG2
    R4 -->|"read / write"| PG2
    R5 -->|"read"| PG2
```

## Port Reference

| Container | Service | Host Port | Container Port | Accessible from |
|---|---|---|---|---|
| `premera-ui` | Nginx (HTTP) | **80** | 80 | Public internet |
| `premera-ui` | Nginx (HTTPS) | **443** | 80 | Public internet |
| `premera-api` | REST API | **8080** | 8080 | Internal / behind reverse proxy |
| `premera-redis` | Redis | — | **6379** | `localhost` only (not exposed) |
| `premera-db` | PostgreSQL | — | **5432** | `localhost` only (not exposed) |
| `premera-db` | MongoDB | — | **27017** | `localhost` only (not exposed) |

> DB and Redis ports are **not published** to the host — only the API container reaches them over the Docker internal network.

## Role Permissions

| Action | Premera Viewer | UST Admin |
|---|:---:|:---:|
| View status pages (`/program`, `/tower`, `/wave`, `/risks`) | ✓ | ✓ |
| Submit feedback form | ✓ | ✓ |
| Vote thumbs up / down on milestone & issue rows | ✓ | ✓ |
| Access `/admin` CMS | — | ✓ |
| Save / reset programme content | — | ✓ |
| View audit log | — | ✓ |

## Docker Compose Services

```yaml
services:
  premera-ui:       # Nginx + React SPA build
    ports: ["80:80", "443:80"]

  premera-api:      # REST API (.NET / Node / FastAPI)
    ports: ["8080:8080"]
    depends_on: [premera-db, premera-redis]
    environment:
      - DATABASE_URL=postgresql://user:pass@premera-db:5432/premera
        # or MONGO_URI=mongodb://premera-db:27017/premera
      - REDIS_URL=redis://premera-redis:6379
      - AZURE_AD_TENANT_ID=<tenant-id>
      - AZURE_AD_AUDIENCE=api://premera-ust-portal
      - CORS_ORIGIN=https://<server-domain>

  premera-db:       # PostgreSQL or MongoDB
    # no host ports — internal only

  premera-redis:    # Redis
    # no host ports — internal only
```
