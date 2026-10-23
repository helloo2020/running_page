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


## 2026-10-23 · Public display name

Tim requested all visible Tim labels on the running site use Scond. The shared SVG renderer replaces the standalone name in generated chart text, covering route mosaic, month-of-life and legacy calendars without modifying generated source assets or activity data. Vite build, focused ESLint/Prettier passed; browser verified both route and month-of-life labels read Scond with no visible Tim matches. Preview http://127.0.0.1:5193/. No push or Production release.


## 2026-10-23 · Running visual refinement · Production release

Tim explicitly requested formal publication after reviewing the visual refinement, all-years/vivid calendar, default-open long routes, summary pagination/segments and Scond display name. Published all three scoped frontend commits (6ee04d7, 35d0e45, a00493e) against the last reviewed Production data/assets.

- Production deployment: `dpl_D2GYL9ddDdKH5wZQGBMRYHmnYhPY`, READY, https://run-scond-83i7ozfp9-zenjurygmailcoms-projects.vercel.app, aliased https://run.scond.me/; original project `prj_vRMznol05XSKfeNIYpz3XIlIoCsh` / team `team_E9Gcxmx5eLAWc9AYaxCbzoYQ`. Previous deployment/rollback reference `dpl_3YVJLQoXVVRavypVA2j53H8Tyi9d`. Vercel connector confirmed alias and READY after CLI upload. No Git push.
- Isolated source `/private/tmp/run-polish-release-20261023`; uploaded only 26 reviewed static build/config files in `/private/tmp/run-polish-upload-20261023`, manifest `/private/tmp/run-polish-upload-manifest.json`. Existing visit-counter script restored from previous release. No source data, credentials, environment files, dependency folders, backups or notes uploaded. Existing public compiled activities hash `b0c4ba86ff4147780dc2a4ef54dabb00e8f48f0319d7ac1128fb67f9201f44ca` matched a fresh download from current Production before release. Generated SVG assets unchanged. Local older repository activity snapshot was not deployed.
- Release build passed; existing Browserslist-age/bundle-size warnings remain. Live browser verified default 2026, all ten calendar years, routes open, Scond SVG name, six summary groups/page, next page, reset on period switch, month-of-life name, dark toggle, no page overflow at 320/390/1280px and no JavaScript page exceptions. Only console resource errors were the deliberately blocked visit-counter script to avoid inflating counts during testing. Physical devices not newly tested. Screenshots `/private/tmp/run-live-release-calendar.png` and `/private/tmp/run-live-release-summary.png`.
- Source repository retains unrelated pre-existing CURRENT notes unstaged. Homepage, reading and blog were not deployed in this release.

## 2026-10-23 · Separate running journal · Local development

Tim approved splitting per-activity browsing into a 日志 page, keeping 足迹 as lifetime overview and 统计 as period aggregates. He added month selection near the list and asked for one-line phone records wherever possible. This is development/local preview authorization, not a new Production release.

- Added `/log` and header navigation. Defaults to latest available running year (2026), newest first, ten records/page, previous/next/jump; year/month changes reset pagination/selection. Month buttons show only available months plus 全部月份, laid out on desktop and horizontally scrollable on phones. Changing year resets the month strip scroll. URL parameters preserve filters/page/selection across reload/back. Date/city/type entries from the homepage now navigate to filtered logs. Homepage map year control and conditional full log table removed; independent calendar year/all-years selection remains.
- Map above list shows approximate existing activity locations with nearby markers grouped by screen distance; numbers are activity counts and location buttons remain available below the map. Select one record to display its route with start/end labels, scale and explicit route-outline wording. Missing routes/positions have honest empty feedback; records without coordinates remain in the list. Uses existing local geography and public paths only, no new basemap provider, no new data exposure. Removes the homepage geography zoom cutoff so zooming no longer hides all geography.
- Phone rows fit one line at 320/390px: date, place, distance, pace; desktop adds duration. Selecting a row expands secondary detail and an explicit 查看路线 action; selection alone does not force-scroll. Empty state, keyboard selection, year/all-years labels, reduced-motion scrolling, loading feedback and deep links supported. Running includes both existing Run and VirtualRun types, so 2026 retains all 84 records rather than losing 30 VirtualRun entries; no source activity data changed. Existing summary aggregation not changed in this scope. Current dataset has no non-running types, so redundant activity-type controls are hidden.
- Verification: Vite production build passed, focused ESLint and Prettier passed. Playwright verified 320/390/768/1280px without document overflow (phone rows 48px, desktop 56px), default/latest record, ten rows, last page four rows and disabled next, month/year reset, marker/place filtering, URL reload, keyboard expand, missing routes, two records on calendar date, marathon entry, summary regression, light/dark, no page exceptions. In-app browser preview open at http://127.0.0.1:5193/log. Screenshots `/private/tmp/run-log-ready-mobile.png`, `run-log-ready-list.png`, `run-log-map-settled.png`, `run-log-final-route.png`, `run-log-approved-dark.png`. Early blank-map captures rejected in favor of rendered geography. Physical devices and full accessibility compliance not tested.
- Optional full `tsc --noEmit` still reports five pre-existing diagnostics in RunMap filter typing, YearStat variable typing and utils GeoJSON typing. Compared against the unchanged published release source at `/private/tmp/run-polish-release-20261023`: final diagnostics are identical, no new errors. Logs `/private/tmp/run-log-types-{baseline,final}.txt`. Code saved but left uncommitted under project no-commit-on-failed-check rule; no push/deployment. Existing unrelated CURRENT changes preserved.
- Source manifest `/private/tmp/run-log-source-manifest.json`; nine frontend files saved, no generated assets, activities, env, dependencies or backend changes. Preview uses the current public dataset; repository dataset is still older and must not overwrite Production. A future static release must add `/log` -> `/index.html` to its upload-package rewrites (repository vercel.json already has SPA catch-all), restore the existing visit-counter script from the last release, and verify direct `/log` refresh.


## 2026-10-23 · Journal review adjustments · Local preview

- Implemented Tim's review: default all years, visible clear-filter action below map, removed 概略位置 · 数字为次数, place counts sorted descending and labelled 次. Counts now include every record in the matching place group (729 total across groups; Shenzhen 592) rather than counting only coordinates (previously 447 Shenzhen) while the list included more. Geographic representative points still come only from existing coordinates in that group; location labels are not upgraded/invented.
- Added 地点 / 轨迹 switch. Ten independently scaled GPS sketches per gallery page, latest first, filter-aware; click selects the route and its corresponding list page. Returning retains gallery page. Existing 足迹 mosaic preserved. Current public data has 460 drawable paths, 269 records without a drawable path; all 729 remain in the list. No additional personal data sources, external tiles, dependencies or data writes.
- 时间 / 距离 segmented control defaults to time. Distance bands <5, [5,10), [10,21.0975), [21.0975,42.195), >=42.195 km yield 286/281/146/15/1 records, sum729. Exact boundary checks verified one band each, no overlap. Clear restores all-years/time/all records; mode switches clear hidden month/distance filters. Phone rows remain one line.
- Validation: focused ESLint/Prettier and isolated Vite build passed. Browser plugin unavailable; used existing Playwright CLI. Verified page identity/nonblank/no overlay, no fresh console/page exceptions, actual filters/clear, month URL reload, ranking count equality/descending order, gallery next/previous/select/return, light/dark and screenshots. Widths320/390/768/1280 have no document overflow, phone rows48px and desktop56px. Existing build warnings only. Optional full TypeScript diagnostics still exactly match the five baseline errors; no new diagnostics. No physical-device/Safari/full accessibility audit. Transient HMR missing-component errors during file creation disappeared on reload; final runs clean.
- Evidence in /private/tmp/run-log-refined-{mobile,distance-mobile,routes-mobile,routes-desktop,dark}.png; build log run-log-refined-build.txt, type comparison run-log-types-refined.txt. Source manifest run-log-refined-source-manifest.json. Preview http://127.0.0.1:5193/log. Saved focused source and notes, preserving earlier journal work and unrelated CURRENT changes. No commit/push/deployment; existing failed optional baseline type check remains documented. Future releases must retain latest Production activity data rather than the older local repo snapshot.


## 2026-10-23 · Compact journal filter labels

Tim approved the shorter distance labels (<5 km / 5 km+ / 10 km+ / 半马+ / 全马+) and requested both 全部月份 and 全部距离 become 全部. Implemented the copy and selected-only exact range note; range boundaries/data unchanged. Focused ESLint/Prettier and Vite build passed. Browser verified both reset labels, range note appearing/disappearing, 10 km+ still146 records and 320/390/1280px without document overflow; no page exceptions. Screenshot /private/tmp/run-log-short-labels.png. Saved two frontend files, preserved prior work. Existing type-check baseline limitations remain; no commit/push/Production deployment. Preview http://127.0.0.1:5193/log.


## 2026-10-23 · Correct journal route interpretation

- Replaced the misinterpreted separate route sketch gallery with all GPS routes overlaid on one map. Default `/log` now chooses routes/all years; explicit `map=places` retains the place view. Existing `map=routes` links work. Year/month/distance/place filters apply to map and list; list pagination does not limit map routes. Single-row selection shows its route with return to the overlay. Original Footprint SVG untouched. Removed only the newly authored obsolete RouteGallery source and dedicated styles.
- All years renders460 drawable routes;2026 renders51 of84 records;2026October renders3. Records without GPS remain in the list. Fit bounds includes every route point and allows zoom below0 on narrow displays. GPS routes naturally appear as tiny traces at world scale. Clicking a drawn line supports record selection. No new provider, source data, credentials or data generation.
- Very long paths initially triggered MapLibre's vertex-segment warning; split rendering into <=2000-point chunks with one shared endpoint, preserving every coordinate and visual continuity. Final fresh browser run has no page exceptions, console errors or warnings. Focused ESLint/Prettier and Vite build passed. Full optional TypeScript check matches the same five pre-existing baseline diagnostics exactly.
- Browser verified460 remains when list goes to page2;2026 count51 persists on reload; month,clear,place/routes toggle,record/detail return,light/dark and320/390/1280px without horizontal overflow. Final screenshots waited for map/theme loading to complete; initial transition captures rejected. Evidence /private/tmp/run-log-overlay-{desktop,mobile,2026,dark}.png, run-log-overlay-build.txt, run-log-types-overlay.txt. No physical-device/Safari verification.
- Saved3frontend files, removed the obsolete local-only component, appended scoped notes while preserving earlier work. No commit/push/Production deployment. Existing type baseline remains documented. Future release must retain current Production activity data. Preview http://127.0.0.1:5193/log.


## 2026-10-23 · Orange palette implementation · Local preview

- Implemented the chosen generated mock's palette, including Scond wordmark, active nav, route strokes, selected filters, chart bars and place values across Footprint/Log/Summary. Light map: sand#f1e9dc, ocean#f3f7f9, thin borders#d5ccbe, routes#e87536. Small text#ba4d1b and peach selection#fff1e7. Dark warm-gray/orange, theme-color updated consistently in startup HTML/hook. Both maps use mapPalette utility. No image assets regenerated.
- Kept existing layout/data/semantic cyan-yellow-red calendar colors. Fixed map canvas edge backdrop mismatch and dark start-marker text contrast. Source index.html updated only for the dark theme-color literal; preserved the production visit-counter script rather than copying the isolated preview HTML.
- Focused ESLint/Prettier and final Vite build passed. Optional full TypeScript check still the same5baseline errors (line numbers shifted only), no new diagnostics. Browser in-app verification:2026/51tracks,clear/460tracks,theme toggles,Footprint+Summary navigation/month-week switch,calendar colors, no overflow at320/390/1280CSSpx. No product-tab console errors/warnings. Desktop/mobile viewport checks used a local-only iframe QA harness; helper observation error did not affect product page. Physical devices/full accessibility not audited.
- Design QA passed within color-only scope: /private/tmp/run-polish-20261023/design-qa.md. Evidence /private/tmp/run-orange-{desktop-final,inapp-final,mobile,dark,footprint,summary}.png. Generated reference remains /Users/tim/.codex/generated_images/01a167a7-13b3-72d3-8f42-21020be49373/exec-36847060-bfc4-4cfd-99ec-22dc8dfaaf64.png. Live geographic paths preserved rather than matching generated map inaccuracies.
- Saved7scoped frontend files plus notes; preserved previous journal work and unrelated CURRENT notes. No commit/push/Production deployment. Preview http://127.0.0.1:5193/log. No activity assets, environment or dependencies changed. Future release must preserve latest Production public data, not the older repository snapshot.


## 2026-10-23 · Journal and orange theme · Production release

- Tim explicitly requested formal publication of the reviewed journal and orange theme. Published to the existing run-scond-me project/team and run.scond.me domain. Deployment dpl_2h8Rv4Znm99RGGseeA8HbWNW2fqG is READY, alias confirmed by Vercel connector. URL: https://run-scond-31xhxbi1o-zenjurygmailcoms-projects.vercel.app. Rollback reference: dpl_D2GYL9ddDdKH5wZQGBMRYHmnYhPY. No other site deployed.
- Before publication, resolved all five old TypeScript diagnostics with three small changes: explicitly typed MapLibre filter tuples; separate formatted elevation string; typed imported GeoJSON feature collection. Full tsc --noEmit, focused ESLint and Vite production build passed. Old non-blocking Browserslist and chunk-size warnings remain.
- Source assembled from the verified preview, retaining the current Production public dataset rather than older repository activities. Restored the existing public visit-counter script, added /log and retained /summary SPA rewrites. Only 26 reviewed static files uploaded; no env, dependencies, private source files, QA harness/report or project notes. Public activity chunk SHA256 remains b0c4ba86ff4147780dc2a4ef54dabb00e8f48f0319d7ac1128fb67f9201f44ca; original SVG file hashes unchanged.
- Release source /private/tmp/run-journal-release-20261023; upload /private/tmp/run-journal-upload-20261023; manifest /private/tmp/run-journal-upload-manifest.json. HTTP verification /private/tmp/run-journal-live-http.json: 28 resources/routes returned200 and expected hashes, including direct /log, /log?year=2026 and /summary.
- In-app live checks passed: default all-years460tracks/729records/10rows;2026 gives51tracks/84records; clear restores all;10km+146records; Summary week266groups/45pages; vivid calendar colors and expanded long-distance routes retained; light/dark branding and no console errors/warnings. Desktop1280 no overflow. Screenshot /private/tmp/run-journal-live-final.png. Prior local320/390/1280 responsive checks passed; no physical-device or Safari claim.
- Source files saved without generated-data changes. No Git push; existing unrelated CURRENT notes preserved.
- Post-release phone-width390 iframe inspection of the actual production /log also passed visually; screenshot /private/tmp/run-journal-live-mobile.png. Local-only QA frame closed.
