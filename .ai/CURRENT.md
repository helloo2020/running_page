# Current State

Last updated: 2026-10-23

## 2026-10-23 · Keep sync repair released and verified

- Tim explicitly authorized releasing the running sync repair and catching up the existing public running page and TimOS cloud snapshot. Only `run-scond-me` is linked to this upstream repository; TimOS app/server code, Life, credentials, permissions and schedules were not changed.
- Initial logs identified a silently skipped empty-route activity. The empty-route fix recovered an older historical activity; it did not yet resolve the reported missing recent run. A freshness audit then confirmed that the intended indoor run was returned and accepted by Keep, but some heart-rate samples lacked `timestamp`, causing another swallowed parsing error. Do not mistake the older empty-route failure for the complete incident cause.
- Empty decoded routes now retain valid activity metrics without generating GPS/elevation data. Untimed heart-rate samples are skipped for point attachment, preserving the separately supplied activity average. Batch parse failures abort before database/JSON persistence instead of reporting success. Doubtful-record filtering is unchanged.
- Ten synthetic offline regressions pass locally and in the production workflow; previous source reproduces both the empty-route index error and indoor heart-rate missing-key error. Tests hide expected fixture errors from production logs. The existing workflow runs them before Keep sync, and emits only candidate freshness/filter summaries without credentials or coordinates.
- Released code commits: `9451fde`, `ae4da99`, `5549c5d`; existing sync generated `353f764` and `6cc4a55`. Final Run `39885893507` succeeded, including GitHub Pages build/deploy. The run-scond-me production deployment for the recovered data is `dpl_GBv426vAmpLnwrq3mVDfzoUaQYEL`, READY. Previous deployments remain available for rollback.
- Used the verified TimOS project's existing `/api/sync-running?cron=1` job to catch up, without reading its secret. Read-only database verification confirmed the intended recent indoor activity; Chrome's authenticated TimOS home visibly updated its last-run date and summaries. The original regular schedule remains enabled. No real raw activity payloads, account details, secrets or generated data were manually added to the repair commits.

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
