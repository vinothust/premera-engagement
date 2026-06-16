# Memory

> Chronological action log. Hooks and AI append to this file automatically.
> Old sessions are consolidated by the daemon weekly.

## Session: 2026-06-16

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 08:15 | Added RiskAction type + needsPremeraAttention/riskActions to IssueRow + seeded sample data | portalData.ts | done | ~200 |
| 08:16 | Created RiskActionsModal component (modal for issue risk actions) | RiskActionsModal.tsx | done | ~450 |
| 08:17 | Created RiskSummaryBanner component (amber banner with counts → /risks) | RiskSummaryBanner.tsx | done | ~120 |
| 08:18 | Updated IssuesTable with Actions button column on amber/red rows | IssuesTable.tsx | done | ~300 |
| 08:19 | Created consolidated Risks page grouped by ITO/BPO/Tower | Risks.tsx | done | ~500 |
| 08:20 | Added /risks route + "Risks & Actions" nav link | App.tsx | done | ~50 |
| 08:21 | Added RiskSummaryBanner to Program and Tower pages | ProgramLevel.tsx, TowerLevel.tsx | done | ~50 |

## Session: 2026-06-12 11:16

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 11:24 | Created src/data/status.ts | — | ~1347 |
| 11:25 | Created src/components/StatusDot.tsx | — | ~113 |
| 11:25 | Created src/components/Legend.tsx | — | ~160 |
| 11:25 | Created src/components/SlideHeader.tsx | — | ~266 |
| 11:25 | Created src/components/MilestoneTable.tsx | — | ~508 |
| 11:25 | Edited src/components/MilestoneTable.tsx | added 1 import(s) | ~33 |
| 11:25 | Edited src/components/MilestoneTable.tsx | 3→3 lines | ~37 |
| 11:25 | Edited src/components/MilestoneTable.tsx | 3→3 lines | ~14 |
| 11:26 | Created src/components/IssuesTable.tsx | — | ~435 |
| 11:26 | Created src/components/ChevronBanner.tsx | — | ~278 |
| 11:26 | Created src/pages/TowerLevel.tsx | — | ~705 |
| 11:27 | Created src/pages/ProgramLevel.tsx | — | ~1647 |
| 11:28 | Created src/pages/WaveModel.tsx | — | ~3100 |
| 11:29 | Edited src/pages/WaveModel.tsx | expanded (+19 lines) | ~844 |
| 11:30 | Created src/pages/Feedback.tsx | — | ~2051 |
| 11:30 | Created src/main.tsx | — | ~92 |
| 11:30 | Created src/App.tsx | — | ~864 |
| 11:31 | Edited src/pages/Feedback.tsx | 2→2 lines | ~32 |
| 11:31 | Edited src/pages/Feedback.tsx | inline fix | ~10 |
| 11:31 | Edited src/index.css | 9→11 lines | ~60 |
| 11:31 | Edited src/index.css | CSS: border, border | ~197 |
| 11:33 | designqc: captured 0 screenshots (0KB, ~0 tok) | C:/Program Files/Git/program, C:/Program Files/Git/tower, C:/Program Files/Git/wave, C:/Program Files/Git/feedback | ready for eval | ~0 |
| 11:33 | designqc: captured 6 screenshots (277KB, ~15000 tok) | /program, /tower, /wave, /feedback | ready for eval | ~0 |
| 11:33 | designqc: captured 6 screenshots (293KB, ~15000 tok) | /tower | ready for eval | ~0 |
| 11:34 | designqc: captured 4 screenshots (251KB, ~10000 tok) | /wave | ready for eval | ~0 |
| 11:34 | designqc: captured 5 screenshots (188KB, ~12500 tok) | /feedback | ready for eval | ~0 |
| 11:34 | designqc: captured 6 screenshots (293KB, ~15000 tok) | /tower | ready for eval | ~0 |
| 11:35 | designqc: captured 4 screenshots (251KB, ~10000 tok) | /wave | ready for eval | ~0 |
| 11:36 | Session end: 21 writes across 14 files (status.ts, StatusDot.tsx, Legend.tsx, SlideHeader.tsx, MilestoneTable.tsx) | 7 reads | ~14905 tok |
| 11:41 | Created src/data/status.ts | — | ~217 |
| 11:41 | Created src/data/portalData.ts | — | ~2654 |
| 11:41 | Created src/context/PortalDataContext.tsx | — | ~461 |
| 11:42 | Edited src/components/MilestoneTable.tsx | 10→10 lines | ~87 |
| 11:42 | Edited src/components/MilestoneTable.tsx | 2→2 lines | ~22 |
| 11:42 | Edited src/components/MilestoneTable.tsx | 2→2 lines | ~32 |
| 11:42 | Edited src/components/IssuesTable.tsx | 2→2 lines | ~25 |
| 11:42 | Edited src/components/IssuesTable.tsx | 2→2 lines | ~31 |
| 11:42 | Edited src/components/SlideHeader.tsx | 18→18 lines | ~246 |
| 11:43 | Created src/pages/ProgramLevel.tsx | — | ~1442 |
| 11:43 | Created src/pages/TowerLevel.tsx | — | ~745 |
| 11:44 | Created src/pages/Admin.tsx | — | ~5447 |
| 11:44 | Edited src/main.tsx | 11→14 lines | ~104 |
| 11:45 | Created src/App.tsx | — | ~1273 |
| 11:45 | Edited src/index.css | modified media() | ~134 |
| 11:45 | Edited src/pages/WaveModel.tsx | CSS: sm, sm | ~212 |
| 11:46 | Edited src/pages/WaveModel.tsx | 6→7 lines | ~20 |
| 11:47 | Edited src/context/PortalDataContext.tsx | modified usePortalData() | ~30 |
| 11:49 | Created API.md | — | ~3709 |
| 11:50 | designqc: captured 2 screenshots (57KB, ~5000 tok) | /admin | ready for eval | ~0 |
| 11:50 | designqc: captured 5 screenshots (261KB, ~12500 tok) | /program | ready for eval | ~0 |
| 11:51 | Session end: 40 writes across 18 files (status.ts, StatusDot.tsx, Legend.tsx, SlideHeader.tsx, MilestoneTable.tsx) | 8 reads | ~35439 tok |
| 11:55 | Created src/components/MilestoneTable.tsx | — | ~918 |
| 11:55 | Created src/components/IssuesTable.tsx | — | ~790 |
| 11:56 | Created src/pages/ProgramLevel.tsx | — | ~1674 |
| 11:56 | Edited src/pages/ProgramLevel.tsx | "mt-3 grid grid-cols-1 xs:" → "mt-3 grid grid-cols-1 sm:" | ~23 |
| 11:56 | Edited src/pages/TowerLevel.tsx | reduced (-6 lines) | ~155 |
| 11:57 | Edited src/pages/WaveModel.tsx | CSS: lg | ~43 |
| 11:57 | Edited src/pages/WaveModel.tsx | expanded (+53 lines) | ~771 |
| 11:57 | Edited src/pages/WaveModel.tsx | CSS: start, end | ~92 |
| 11:58 | designqc: captured 6 screenshots (300KB, ~15000 tok) | /program | ready for eval | ~0 |
| 11:59 | designqc: captured 6 screenshots (366KB, ~15000 tok) | /wave | ready for eval | ~0 |
| 11:59 | designqc: captured 6 screenshots (306KB, ~15000 tok) | /tower | ready for eval | ~0 |
| 12:00 | Session end: 48 writes across 18 files (status.ts, StatusDot.tsx, Legend.tsx, SlideHeader.tsx, MilestoneTable.tsx) | 8 reads | ~39910 tok |

## Session: 2026-06-16 11:42

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-06-16 13:29

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 13:40 | Edited src/data/portalData.ts | expanded (+12 lines) | ~105 |
| 13:40 | Edited src/data/portalData.ts | 8→8 lines | ~272 |
| 13:40 | Edited src/data/portalData.ts | 9→9 lines | ~275 |
| 13:40 | Edited src/data/portalData.ts | 6→6 lines | ~264 |
| 13:41 | Created src/components/RiskActionsModal.tsx | — | ~1809 |
| 13:41 | Created src/components/RiskSummaryBanner.tsx | — | ~430 |
| 13:41 | Created src/components/IssuesTable.tsx | — | ~1289 |
| 13:42 | Created src/pages/Risks.tsx | — | ~1871 |
| 13:42 | Edited src/App.tsx | added 1 import(s) | ~114 |
| 13:42 | Edited src/App.tsx | 4→5 lines | ~83 |
| 13:42 | Edited src/pages/ProgramLevel.tsx | added 1 import(s) | ~128 |
| 13:43 | Edited src/pages/ProgramLevel.tsx | 3→5 lines | ~70 |
| 13:43 | Edited src/pages/TowerLevel.tsx | added 1 import(s) | ~110 |
| 13:43 | Edited src/pages/TowerLevel.tsx | 7→9 lines | ~85 |
| 13:45 | Session end: 14 writes across 8 files (portalData.ts, RiskActionsModal.tsx, RiskSummaryBanner.tsx, IssuesTable.tsx, Risks.tsx) | 6 reads | ~14203 tok |
| 14:02 | Created src/components/QuickFeedback.tsx | — | ~1510 |
| 14:03 | Edited src/components/IssuesTable.tsx | added 1 import(s) | ~74 |
| 14:03 | Edited src/components/IssuesTable.tsx | 2→2 lines | ~50 |
| 14:03 | Edited src/components/IssuesTable.tsx | 4→7 lines | ~98 |
| 14:03 | Edited src/components/IssuesTable.tsx | 5→6 lines | ~87 |
| 14:03 | Edited src/components/MilestoneTable.tsx | added 1 import(s) | ~49 |
| 14:04 | Edited src/components/MilestoneTable.tsx | "text-center font-semibold" → "text-center font-semibold" | ~25 |
| 14:04 | Edited src/components/MilestoneTable.tsx | 3→6 lines | ~90 |
| 14:04 | Edited src/components/MilestoneTable.tsx | 3→4 lines | ~64 |
| 14:04 | Edited src/pages/ProgramLevel.tsx | added 1 import(s) | ~72 |
| 14:04 | Edited src/pages/ProgramLevel.tsx | 2→2 lines | ~52 |
| 14:04 | Edited src/pages/ProgramLevel.tsx | 3→6 lines | ~91 |
| 14:04 | Edited src/pages/ProgramLevel.tsx | 4→7 lines | ~106 |
| 14:05 | Edited src/pages/ProgramLevel.tsx | 2→2 lines | ~50 |
| 14:05 | Edited src/pages/ProgramLevel.tsx | 3→6 lines | ~91 |
| 14:07 | Session end: 29 writes across 10 files (portalData.ts, RiskActionsModal.tsx, RiskSummaryBanner.tsx, IssuesTable.tsx, Risks.tsx) | 7 reads | ~18508 tok |
| 14:10 | Edited src/components/IssuesTable.tsx | 3→4 lines | ~94 |
| 14:10 | Edited src/components/IssuesTable.tsx | 7→7 lines | ~95 |
| 14:11 | Edited src/components/MilestoneTable.tsx | 1→2 lines | ~49 |
| 14:11 | Edited src/components/MilestoneTable.tsx | 6→6 lines | ~85 |
| 14:11 | Edited src/pages/ProgramLevel.tsx | 4→5 lines | ~130 |
| 14:11 | Edited src/pages/ProgramLevel.tsx | 8→8 lines | ~116 |
| 14:11 | Edited src/pages/ProgramLevel.tsx | 2→3 lines | ~75 |
| 14:11 | Edited src/pages/ProgramLevel.tsx | 6→6 lines | ~85 |
| 14:13 | Session end: 37 writes across 10 files (portalData.ts, RiskActionsModal.tsx, RiskSummaryBanner.tsx, IssuesTable.tsx, Risks.tsx) | 7 reads | ~19310 tok |
| 14:30 | Session end: 37 writes across 10 files (portalData.ts, RiskActionsModal.tsx, RiskSummaryBanner.tsx, IssuesTable.tsx, Risks.tsx) | 7 reads | ~19310 tok |
