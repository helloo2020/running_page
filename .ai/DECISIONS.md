# Decision Log

Append only. Format: date, decision, reason, impact.

## 2026-07-03

Decision: Adopt project-level AI memory files using Tim's AI project system template.

Reason: The project is already customized and contains personal activity data, so future AI work needs stable context, safety rules, and a small-task workflow.

Impact: Future agents should read `AGENTS.md`, `.ai/PROJECT.md`, `.ai/CURRENT.md`, and `.ai/DECISIONS.md` before development.

## 2026-07-03

Decision: Treat activity outputs and generated data as personal data by default.

Reason: Running data can reveal routes, locations, dates, heart rate, and habits.

Impact: Agents should avoid reading, printing, rewriting, deleting, or committing raw activity data unless the task explicitly requires it and Tim has authorized the action.

## 2026-07-03

Decision: Do not run destructive data cleanup commands without explicit confirmation.

Reason: The project contains local generated activity outputs and a SQLite database that may be difficult to recreate safely.

Impact: Commands such as `pnpm run clean` and `pnpm run data:clean` require explicit Tim confirmation before execution.


## 2026-10-23 · Shared Scond palette

Use homepage palette version `scond-palette-2026-10-23` in local theme definitions, keeping each project's existing framework and content structure. Default to light and preserve explicit dark preference in each origin independently. Charts, maps and share images participate in the same theme; semantic multi-series colors and source photographs remain distinct. No cross-domain theme service, dependency upgrade or backend/schema changes. Production publication requires separate explicit authorization.


## 2026-10-23 · Same-tab navigation and home return

Tim approved same-tab navigation between scond.me, blog.scond.me, read.scond.me and run.scond.me. Keep explicit visible `主页` links to https://scond.me/ on subsite primary surfaces and standalone reading shares; preserve them on narrow viewports. Keep `首页`/`跑步首页` scoped to their own subsite so return targets stay unambiguous. This does not merge apps or expand data permissions. Formal Production publication was authorized in this chat.


## 2026-10-23 · Running visual refinement implementation

Local preview decision: keep MapLibre/Recharts and the existing public data pipeline. Separate polygon outlines from route strokes so geography can use thin borders independently. Move year selection out of the map. Render the activity calendar as a readable React view of existing public activity data instead of shrinking an entire multi-year SVG; retain all years, day-to-route selection and the original long-distance SVG as an on-demand disclosure. Use Chinese interface labels and the shared Scond header across home and summary. No new backend, dependency, geography source or private-data access. Production release still requires explicit authorization; this iteration awaits Tim's visual review.
