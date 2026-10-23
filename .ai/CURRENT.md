# Current State

Last updated: 2026-10-23

## 2026-10-23 · Keep empty-route sync repair (local candidate)

- Tim reported that yesterday's run was missing from the TimOS home module. Read-only checks confirmed that both upstream scheduling and the TimOS 06:00 import were enabled and ran. The upstream log showed one new Keep activity skipped by an index error while the workflow still reported success.
- The outdoor GPX path assumed an encoded route contained at least one decoded point. The parser now preserves activity metrics when the decoded route is empty, without inventing route or elevation data. Batch parsing errors and unusable duration now fail the sync before writing the database/activities JSON instead of silently returning success.
- Added seven synthetic, offline regression cases covering missing/encoded-empty/valid routes, batch inclusion, malformed routes, invalid duration, and no data overwrite on collection failure. The existing Keep workflow runs these before real sync. No secrets or personal records were used in tests.
- Local verification passed. Upstream push, workflow execution, existing public running-page updates, and TimOS cloud catch-up remain pending explicit release authorization. No production settings or data have been changed by this repair.

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
