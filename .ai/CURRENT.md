# Current State

Last updated: 2026-07-03

## Active Sprint

AI project onboarding and stabilization.

## Current State

- The repository is a customized fork of `running_page`.
- The app displays running/activity stats, a map, yearly summaries, tables, and generated SVG summaries.
- Frontend source is under `src/`.
- Data sync and SVG generation scripts are under `run_page/`.
- Personal/generated activity data exists in `run_page/data.db`, `src/static/activities.json`, `GPX_OUT/`, `activities/`, and `assets/`.
- `PRIVACY_MODE` is enabled in `src/utils/const.ts`.
- Git branch at onboarding: `master`.
- Git worktree before onboarding edits: clean.

## Recent Changes

- Added AI project memory files:
  - `AGENTS.md`
  - `.ai/PROJECT.md`
  - `.ai/CURRENT.md`
  - `.ai/DECISIONS.md`
  - `.ai/BACKLOG.md`

## Known Issues And Risks

- No test files were found during onboarding.
- README TODO still lists tests as incomplete.
- `pnpm run lint` and `pnpm run check` can modify files automatically.
- `pnpm run clean` and `pnpm run data:clean` delete local activity outputs and must not be run without explicit confirmation.
- GitHub Actions currently has a step that uses `git add .` inside CI. Treat workflow edits carefully.
- Public activity output can reveal personal routes and habits.

## Validation Status

- Onboarding inspection completed by reading README files, package/config files, key source files, workflow config, TODO markers, Git history, Git status, and source tree.
- No build or tests were run because this onboarding task only adds documentation and project memory files.

## Deployment Status

- Vercel config exists in `vercel.json`.
- GitHub Pages workflow exists via `.github/workflows/run_data_sync.yml`.
- No deployment was performed during onboarding.

## Next Suggested Task

Decide the next small sprint item before coding. Best first candidates:

1. Run a clean `pnpm run build` baseline.
2. Review privacy exposure of generated public data and map settings.
3. Add minimal smoke validation for the frontend.


## 2026-10-23 · Running visual refinement · Local preview

Tim requested a full desktop/mobile polish after palette alignment, particularly navigation icons, mixed Chinese/English labels, map colors/borders, selection controls and charts. Implemented against the last reviewed public release source in `/private/tmp/scond-publish-20261023/run-build` (the local repository has older activity data and four older layout components). Only 22 scoped frontend TS/TSX/CSS files were copied back. Existing `.ai/CURRENT.md` changes preserved. No activity JSON, database, SVG source assets, environment files, privacy settings, dependencies, synchronization or production data were changed.

- Shared restrained Scond wordmark, Chinese navigation (主页/足迹/统计/文章), line theme icon, consistent header on Summary, serif page headings and calmer typography. Mobile introduction now uses a legible theme color instead of near-white hardcoded text.
- Year controls moved above the map with a native accessible select and quiet 全部 selection. No actual checkbox inputs exist in these routes. Map geography and route strokes are separate; subdued land/visited colors, 0.55px boundaries, correct theme initialization, no repeated worlds, balanced overview and smaller controls. Removed obsolete mobile fullscreen button's 64px margin/inversion, which caused the giant block. Kept existing privacy-mode map and route data. Country disclosure remains initially collapsed as on Production.
- Replaced downscaled multi-year SVG calendar with a readable yearly activity calendar using the already-loaded public activity array. All years remain available; cumulative totals plus annual distance/count/active days are shown. Local-date grouping, leap days, distance bands, native horizontal scrolling on mobile, day selection and route action supported. Long-distance route mosaic remains available in an expandable section and loads only on demand. Generated source assets are unchanged; visible legacy SVG labels are translated and semantic colors retained.
- Summary keeps its run-only aggregation and year/month/week/day/life modes. Chinese period labels and accurate 配速 labels; responsive three/two/one-column layout without heavy shadows; sparse horizontal grid, numeric chart data, rounded bars, readable tooltips, no chart animation. Reuses existing time parser for multi-day duration strings. Selection now returns to the actual map section when offscreen, respecting reduced motion. Table sorting uses stable keys, copy-on-sort and keyboard controls; missing pace keeps column alignment. Removed an existing unused destructured variable exposed by focused lint.
- Verified: isolated Vite production build; ESLint for all changed TS/TSX; Prettier for rewritten files (copy-only utils/const retain existing formatting). Existing outdated Browserslist/large-bundle warnings remain. Playwright checked `/` and `/summary` at 320/390/768/1280px in light/dark: no document overflow, no blank shell/framework overlay, no captured page errors. Screenshots reviewed after map settled (early canvas screenshots were rejected). Tested year filter, table state over theme change, keyboard record selection, country/city filter, 366-day 2024 calendar, day selection/route action, horizontal calendar scroll, long-distance SVG, weekly/day/life/month views, tooltip, theme persistence and zoom controls. Physical iPhone/Safari and non-privacy lights mode were not tested.
- Preview: http://127.0.0.1:5193/ (isolated no-env build using previously published assets; production visitor script absent), opened in-app. Evidence: `/private/tmp/run-polish-home-{390,1280}-{light,dark}.png`, `/private/tmp/run-polish-summary-{390,1280}-{light,dark}.png`, `/private/tmp/run-polish-calendar-mobile.png`; source manifest `/private/tmp/run-polish-source-manifest.json`.
- No Git push or Production deployment. This is a local design review; do not publish the repository's older data snapshot over the current live site. Prepare any later release against the latest public data and verify independently.


## 2026-10-23 · Calendar and summary review follow-up · Local preview

- Tim requested an all-years calendar option while retaining the latest-year default, original vivid distance colors, long-distance routes expanded by default, and paginated summary with a better period switch.
- Calendar defaults to 2026 for the current public dataset, with 全部年份 showing 2026–2017 newest first. Metrics reflect the chosen scope. Day feedback and route action appear directly below the selected year's grid. Restored original generator semantics: <=10 km cyan #4DD2FF, >10 and <20 km yellow-to-red interpolation using the complete daily distance range, >=20 km red. The route SVG renderer preserves its original vivid colors; generated assets remain untouched. Routes are expanded initially and can be collapsed.
- Summary uses compact 年/月/周/日/月度足迹 segments. Year/month/week/day show six groups per page with previous/next/jump controls and page status; switching periods resets page 1. Pagination returns focus/scroll to the list start and honors reduced motion. Existing aggregation remains unchanged. Corrected the chart distance interface to match the numeric values already used by the chart.
- Verification: focused ESLint and Prettier passed; isolated Vite build passed (existing Browserslist age/bundle warnings). Playwright checked latest-year default, all ten years/3652 days, bright color bands, default open SVG, nearby day feedback, six groups/page, next/last-page behavior, reset on period switch, life view without pagination, light/dark and no overflow at 320/390/1280px. No captured page errors. Physical devices were not tested. Screenshots under /private/tmp/run-feedback-*.png; manifest /private/tmp/run-feedback-source-manifest.json.
- Five frontend files and scoped notes saved locally. Existing unrelated CURRENT changes preserved. Preview remains http://127.0.0.1:5193/ with last reviewed public assets. No push, deployment, data, environment, privacy or dependency changes. Any later release must preserve the latest Production dataset instead of uploading the older local repository snapshot.
