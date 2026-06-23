# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-06-23T06:41:17.673Z
> Files: 42 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `.gitignore` — Git ignore rules (~68 tok)
- `api_changes.md` — API Changes Required — swagger.json vs Current Execution (~1945 tok)
- `api_requirements.md` — Current, ground-truth API build spec (endpoints/payloads/responses) covering PortalData, feedback log, and quick-feedback votes (~5982 tok)
- `API.md` — STALE backend API spec; predates ito/bpo program split, riskActions, needsPremeraAttention — superseded by `api_requirements.md` (~3477 tok)
- `architecture-diagram-prompt.md` — UST × Premera Engagement Portal — Architecture & Flow (~1136 tok)
- `CLAUDE.md` — OpenWolf (~57 tok)
- `demo-seed.json` (~14037 tok)
- `DEPLOY.md` — Deployment Guide — UST × Premera Engagement Portal (~1365 tok)
- `eslint.config.js` — ESLint flat configuration (~169 tok)
- `index.html` — ust-premera-engagement (~100 tok)
- `package-lock.json` — npm lock file (~27290 tok)
- `package.json` — Node.js package manifest (~207 tok)
- `README.md` — Project documentation (~607 tok)
- `tsconfig.app.json` (~177 tok)
- `tsconfig.json` — TypeScript configuration (~34 tok)
- `tsconfig.node.json` (~169 tok)
- `vite.config.ts` — Vite build configuration (~46 tok)

## .claude/

- `settings.json` (~441 tok)

## .claude/rules/

- `openwolf.md` (~313 tok)

## src/

- `App.css` — Styles: 8 rules, 6 media queries (~826 tok)
- `App.tsx` — NAV (~1524 tok)
- `index.css` — Styles: 11 rules, 9 vars (~486 tok)
- `main.tsx` (~127 tok)

## src/components/

- `ChevronBanner.tsx` — Dark chevron banner with an overlapping circular icon badge (Tower slide). (~278 tok)
- `IssuesTable.tsx` — isAtRisk — renders table (~1387 tok)
- `Legend.tsx` — Legend (~160 tok)
- `MilestoneTable.tsx` — MilestoneTable — renders table (~1074 tok)
- `QuickFeedback.tsx` — STORAGE_KEY (~1764 tok)
- `RiskActionsModal.tsx` — ACTION_STATUS — renders table (~2651 tok)
- `RiskSummaryBanner.tsx` — RiskSummaryBanner (~432 tok)
- `SlideHeader.tsx` — SlideHeader (~295 tok)
- `StatusDot.tsx` — StatusDot (~122 tok)

## src/context/

- `PortalDataContext.tsx` — Replace the full dataset and persist it (used by the Admin page Save). (~480 tok)

## src/data/

- `portalData.ts` — Central, editable content model for the portal. (~8428 tok)
- `status.ts` — Shared RAG status model for all status-reporting slides. (~217 tok)

## src/lib/

- `api.ts` — Exports setApiToken, ApiError, apiFetch, devLogin (~482 tok)

## src/pages/

- `Admin.tsx` — ICON_MAP (~11556 tok)
- `Feedback.tsx` — AREAS — renders form (~2030 tok)
- `ProgramLevel.tsx` — isDetailRow (~5708 tok)
- `Risks.tsx` — isAtRisk — renders table (~3146 tok)
- `TowerLevel.tsx` — BulletList (~650 tok)
- `WaveModel.tsx` — MONTHS (~4213 tok)
