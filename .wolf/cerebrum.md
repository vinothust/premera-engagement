# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-06-12

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

## Key Learnings

- **Project:** ust-premera-engagement — UST × Premera status-reporting portal (Vite + React 19 + TS + Tailwind 3 + react-router-dom + lucide-react).
- **Routing:** `src/App.tsx` holds the `<Routes>` + responsive TopBar (co-brand + nav strip + live clock + Admin link). Pages: `/program`, `/tower`, `/wave`, `/feedback`, `/admin`. `/` redirects to `/program`.
- **Editable content model:** ALL slide content lives in `src/data/portalData.ts` (`PortalData`, seeded by `DEFAULT_PORTAL_DATA`). Served via `PortalDataContext` (localStorage key `ustpremera_portaldata_v1`). Slides read from `usePortalData()`; the Admin page edits a `structuredClone` draft and commits via `save()`. The `<<placeholder>>` fields are just default strings in this seed.
- **RAG status model** is separate and pure in `src/data/status.ts` (`StatusKey`, `STATUS`, `LEGEND_ORDER`) so it has no React/data deps.
- **API contract:** `/API.md` documents the backend that replaces the localStorage store — the `PortalData` shape IS the API schema; swapping requires only editing `PortalDataContext` (load→GET /portal, save→PUT /portal).
- **Build config gotchas:** `tsconfig.app.json` has `noUnusedLocals` + `verbatimModuleSyntax` — use `import { type X }` for type-only imports and never leave unused imports (e.g. stray `import React`).
- **Lint gotcha:** a file that exports a component AND a hook/constant trips `react-refresh/only-export-components`; add `// eslint-disable-next-line react-refresh/only-export-components` above the non-component export (used in PortalDataContext).

## Responsive patterns used

- Wide tables: wrap in `.card overflow-x-auto` + inner `min-w-[...]` so they scroll on mobile instead of crushing.
- WaveModel Gantt: CSS-grid with `OUTER` template; whole grid wrapped in `overflow-x-auto` + `min-w-[980px]`.
- `.slide` padding and all slide H1s scale down at `<640px`; `SlideHeader` stacks `flex-col md:flex-row`.
- Nav strip is `overflow-x-auto no-scrollbar`; live clock hidden `<sm`, brand subtitle hidden `<lg`.

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->
- [2026-06-12] Mobile responsiveness: do NOT make wide tables/grids "responsive" with `overflow-x-auto` + `min-w-[...]` — the user counts horizontal scrolling as NOT fitting the mobile view. Instead REFLOW to a single column: render a `<table className="hidden md:table">` for desktop AND a `md:hidden` stacked-card layout for mobile. Applied to MilestoneTable, IssuesTable, ProgramLevel workstreams. For the WaveModel Gantt (inherently wide) keep the grid `hidden lg:block` and render a `lg:hidden` card list where each row's bar/line/segs become month-span chips via `monthSpan(start,end)`.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
