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


## 2026-10-23 · Calendar feedback supersedes collapsed route default

Tim explicitly chose vivid original distance colors and initially expanded long-distance routes. Keep the React calendar with latest-year default plus an explicit all-years view, and place selected-day feedback beside its year. Summary remains a simple chronological archive, with six groups per page and segmented period selection. This supersedes the earlier muted calendar and collapsed/on-demand route default; source SVG/data generation stays unchanged.


## 2026-10-23 · Split overview and per-activity journal

After evaluating the ambiguous map/year/table interaction, Tim approved independent 足迹 / 日志 / 统计 roles. The journal uses URL-backed year/month/day/place filters, ten entries per page, responsive single-line records and explicit detail navigation. Overview shows approximate places, single selected records show route outlines. Preserve the local privacy-friendly map stack rather than adding third-party street tiles. Run and VirtualRun are both running entries for journal completeness. Existing summary aggregation remains unchanged in this scope; review its legacy Run-only count separately.


## 2026-10-23 · Journal all-years and complementary map views

Tim requested all years by default, clear filtering, distance categories and the previously arranged GPS sketches. Retain geographic overview and add paginated route sketches as complementary views rather than replacing geography. Use the existing public decoded summary paths only; independent sketch scale is labelled. Place count must match its filtered list, including records without GPS when the place is known. Distance mode groups measured distances into exhaustive non-overlapping bands rather than exact-distance equality or race-title classification. This supersedes the prior latest-year journal default, not the calendar default. No new Production release authorization.


## 2026-10-23 · Overlaid map replaces journal sketches

Tim explicitly corrected the interpretation of GPS route display: one geographic map with all selected tracks overlaid, default all years, filtered by year selection. Remove the journal sketch gallery and its styles. Keep the same public paths and MapLibre geography. Fit combined path bounds, render all matching routes independently of list pagination, and split long paths into overlapping vertex chunks solely to stay within GPU segment limits without dropping source points. No data or deployment changes.


## 2026-10-23 · Running-specific sunlight orange

Tim approved the displayed orange mock, including an orange Scond wordmark. Keep the shared cross-site structure/typography while giving running its own energetic accent. Separate vivid graphic/brand orange from darker text orange for legibility, keep map fills quiet, and preserve calendar distance colors. LogMap and RunMap now share a small mapPalette utility because MapLibre requires literal colors. No new dependencies, data pipeline or backend changes.


## 2026-11-06 · 当前状态与历史交付分离

仅整理文档和只读核对：CURRENT 保留有效状态，原 CURRENT（含已有未提交改动）与旧 BACKLOG 完整移入 [归档](archive/2026-11-06-state-history.md)。README/PROJECT 只指向当前事实源，历史发布与测试不作本轮通过声明。

[现场核对](archive/2026-11-06-reconciliation.md)确认恢复数据的 Git 部署已替换先前隔离前端发布；本地与公开远端分叉，不直接对齐或推送。此记录不授权修复、发布、同步、修改 TimOS 或改变部署关系。后续操作仍按当前明确授权分别判断。
