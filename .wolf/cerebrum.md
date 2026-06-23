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
- **API contract:** `/API.md` is STALE (written before the `program.ito`/`program.bpo` split and before `IssueRow.riskActions`/`needsPremeraAttention` existed). `/api_requirements.md` (2026-06-16) is the current ground-truth spec — it also covers two gaps API.md never addressed: the Feedback page log (currently in-memory only, lost on refresh) and the QuickFeedback thumbs-up/down widget (currently per-browser localStorage `ustpremera_quickfeedback_v1`). Re-derive from source before trusting either doc — they will drift again as portalData.ts evolves.
- **Build config gotchas:** `tsconfig.app.json` has `noUnusedLocals` + `verbatimModuleSyntax` — use `import { type X }` for type-only imports and never leave unused imports (e.g. stray `import React`).
- **Lint gotcha:** a file that exports a component AND a hook/constant trips `react-refresh/only-export-components`; add `// eslint-disable-next-line react-refresh/only-export-components` above the non-component export (used in PortalDataContext).

## Responsive patterns used

- Wide tables: wrap in `.card overflow-x-auto` + inner `min-w-[...]` so they scroll on mobile instead of crushing.
- WaveModel Gantt: CSS-grid with `OUTER` template; whole grid wrapped in `overflow-x-auto` + `min-w-[980px]`.
- `.slide` padding and all slide H1s scale down at `<640px`; `SlideHeader` stacks `flex-col md:flex-row`.
- Nav strip is `overflow-x-auto no-scrollbar`; live clock hidden `<sm`, brand subtitle hidden `<lg`.

## Do-Not-Repeat

- [2026-06-23] AG-Grid cell renderers run in a SEPARATE React root (`flushSyncWorkAcrossRoots_impl` visible in stack traces). Neither `useNavigate()` NOR `useContext(CustomContext)` work there — both return the default value or throw. The ONLY correct mechanism for passing functions/data to cell renderers is AG-Grid's own `context` prop: `<AgGridReact context={{ navigate }} />` and read via `({ context }: ICellRendererParams) => context?.navigate?.('/risks')`. No hooks needed.
- [2026-06-23] MUI AccordionSummary renders as a `<button>`. NEVER put interactive elements (buttons, links, QuickFeedback) inside AccordionSummary — nested buttons are invalid HTML and cause React to bail. Put all interactive content (status dot, QuickFeedback, action-required button) at the top of AccordionDetails instead.
- [2026-06-22] QuickFeedback popup in AG-Grid cells: do NOT use `fixed` position rendered inside the component — AG-Grid applies `transform: translateZ(0)` on rows which creates a new containing block and breaks `fixed`. Use `ReactDOM.createPortal(popup, document.body)` to escape the transform, then use `fixed` with viewport coords from `getBoundingClientRect()`. Also add `window.addEventListener('scroll', close, true)` to close on scroll instead of drifting.

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->
- [2026-06-23] Backend strips `needsPremeraAttention` from `Workstream` objects (not in backend schema) but preserves it on `IssueRow`. Do NOT rely on `Workstream.needsPremeraAttention` being present after an API round-trip. Derive it from `ws.status === 'atRisk' || ws.status === 'delayed'` in cell renderers instead.
- [2026-06-23] `erasableSyntaxOnly` is enabled in tsconfig. Do NOT use TypeScript parameter property shorthand (`public readonly x: T` in constructors) — declare class fields separately and assign in the body. Applies to any `class` added to the codebase.
- [2026-06-23] AG-Grid `themeQuartz.withParams()`: the correct border param is `borderColor`, NOT `rowBorderColor`. Using `rowBorderColor` is a TS2561 error in ag-grid-community v35.
- [2026-06-12] Mobile responsiveness: do NOT make wide tables/grids "responsive" with `overflow-x-auto` + `min-w-[...]` — the user counts horizontal scrolling as NOT fitting the mobile view. Instead REFLOW to a single column: render a `<table className="hidden md:table">` for desktop AND a `md:hidden` stacked-card layout for mobile. Applied to MilestoneTable, IssuesTable, ProgramLevel workstreams. For the WaveModel Gantt (inherently wide) keep the grid `hidden lg:block` and render a `lg:hidden` card list where each row's bar/line/segs become month-span chips via `monthSpan(start,end)`.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
- [2026-06-22] Operational Area table migrated from MUI Accordion to AG-Grid Community v35. Module registry: `AllCommunityModule`. Theming via `themeQuartz.withParams()`. Inline accordion expansion implemented via AG-Grid Full Width Rows (`isFullWidthRow` + `fullWidthCellRenderer`) — Community edition supports this; Master Detail is Enterprise-only. Row data is interleaved: `WorkstreamRow[]` + inserted `DetailRow` entries for expanded rows. `ExpandContext` (React.createContext) propagates `toggleExpand` into cell renderers since they live outside React tree. Mobile view keeps MUI Accordion.
