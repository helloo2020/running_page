# Project Agent Rules

Before development, read these files in order:

1. `.ai/PROJECT.md`
2. `.ai/CURRENT.md`
3. `.ai/DECISIONS.md`

Then check `git status --short` and protect unrelated user changes.

## Project Commands

- Install frontend deps: `pnpm install`
- Start local app: `pnpm run dev`
- Build frontend: `pnpm run build`
- Lint frontend: `pnpm run lint`
- Format/check project files: `pnpm run check`
- Install Python deps: `pip install -r requirements.txt`
- Generate SVGs from local DB: `python3 run_page/gen_svg.py --from-db`

`pnpm run lint` and `pnpm run check` can rewrite files. Use them intentionally and inspect the diff.

## Safety Rules

- Do not read or print `.env`, secrets, tokens, `config.yaml`, or GitHub secret values unless Tim explicitly authorizes it.
- Treat `run_page/data.db`, `src/static/activities.json`, `GPX_OUT/`, `TCX_OUT/`, `FIT_OUT/`, `activities/`, and generated SVG/PNG outputs as personal activity data.
- Do not run `pnpm run clean`, `pnpm run data:clean`, or any command that deletes activity outputs unless Tim explicitly asks.
- Do not use `git add .`. Stage only files related to the current task.
- Never commit `node_modules/`, `dist/`, `.vercel/`, `.next/`, `.venv/`, secrets, generated backups, or build output.
- Never deploy Production unless Tim explicitly asks for production deployment.

## Product Rules

- Keep this a simple personal running homepage. Favor privacy, reliability, and maintainability over feature expansion.
- For new features, first answer: who needs it, whether it belongs to the current sprint, the smallest useful version, and data/privacy/deployment risks.
- For small copy fixes or scoped UI bugs, proceed after reading project memory and related code.


## Visual polish request · 2026-10-23

Tim wants run.scond.me to match scond.me consistently on desktop and especially mobile: restrained forest-green/near-white light/dark palette, coherent navigation icons, Chinese interface labels, refined map fills and boundaries, selection controls and charts. Keep the public activity/route data and privacy mode intact. The current comprehensive refinement is a local preview awaiting visual review, not a Production release authorization.


## Calendar and summary preferences · 2026-10-23

Tim wants the calendar to default to the latest year (currently 2026), with an explicit 全部年份 option. Preserve the original vivid cyan/yellow/red distance colors so long runs stand out; do not replace them with a muted green scale. Long-distance routes are expanded by default. Summary must paginate year/month/week/day records (six per page in this iteration), particularly week/day, and use compact segmented period controls rather than the previous dropdown. Keep this iteration local until separately authorized for Production.

- 2026-10-23: Public running-site display name is Scond throughout, including generated chart text. Do not show Tim as the athlete name in the UI.


## Journal direction · 2026-10-23

Tim approved a separate Chinese 日志 destination: map above, list below; latest available year defaults to 2026 today, newest first, ten entries per page. Add month selection near the list; this iteration uses available-month buttons, desktop flat and mobile horizontally scrollable. Prioritize one-line phone records, use two lines only when necessary. Keep lifetime 足迹 and period 统计 separate; remove the overview map's year switch but retain calendar year/all-years controls. Calendar/city/type links should open relevant journal filters. Clicking a record should not unexpectedly scroll phone users to the top. No Production authorization is implied by this development request.


## Journal review refinement · 2026-10-23

- Tim's latest preference overrides the latest-year default: `/log` defaults to 全部年份, latest records first, ten list rows per page. Keep 清除筛选 below the map on desktop and phone; it restores all records/time browsing while preserving the map presentation.
- Keep 地点 / 轨迹 views. The latter restores individually arranged GPS route sketches using existing public summary paths, filtered with the journal and paginated. Preserve the original long-distance mosaic on 足迹. Records without a drawable GPS path stay in the list with honest missing-route feedback.
- Remove the visible 概略位置 · 数字为次数 caption. Place ranking uses total matching record count, descending, with 次 units; include records with a known place but no GPS so counts match the clicked list. Approximate markers reuse only an available point from the same existing place group. Do not infer missing cities or add an external map provider.
- Record browsing defaults to 时间 with month controls. 距离 uses exhaustive, disjoint actual-distance ranges: below 5 km; 5–10 km; 10 km–half marathon; half–full marathon; full marathon and above. Include lower bounds, exclude upper bounds, use 21,097.5 / 42,195 meters as exact marathon thresholds. These are distance bands, not claims of race completion. Switching browse mode clears hidden month/distance filters. Preserve one-line phone records and latest-first ordering in every band.

- 2026-10-23 journal filter copy: both month/distance reset buttons read 全部. Approved distance labels: <5 km, 5 km+, 10 km+, 半马+, 全马+. Keep exact underlying disjoint boundaries; show only the selected band’s precise range below the strip, with no long permanent explanation.


## Journal overlaid GPS map clarification · 2026-10-23

Tim clarified that 跑步轨迹 means all GPS routes overlaid on one geographic map, not separately arranged sketch cards. This supersedes the journal gallery decision. Default `/log` shows all years and the route overlay; selecting a year (e.g.2026) draws only matching routes and fits their combined bounds. Month/distance/place filters also apply, while ten-row list pagination must never reduce map route coverage. Keep explicit 地点 alternative and single-record route inspection with return to the combined map. Existing 足迹 long-distance SVG stays independent. Use only existing public GPS data and local geography; retain records with missing GPS in the list.


## Approved running sunlight-orange palette · 2026-10-23

Tim selected the generated sunlight-orange + pale-sand map preview and explicitly requested the Scond wordmark also become orange. Running's palette now supersedes the earlier forest-green accent for this application only. Use #e87536 for brand/routes/chart emphasis, deeper #ba4d1b for small light-mode text, pale peach selected backgrounds, pale sand land and cool pale blue-gray ocean. Dark mode uses warm charcoal and softer orange. Preserve existing white editorial layout, navigation and functions. Keep the vivid cyan/yellow/red distance heatmap semantics. Map geometry and data come from real existing sources, never generated mock pixels. This authorizes local implementation, not Production publication.
