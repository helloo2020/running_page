# Decision Log

## 2026-10-23 · Preserve runs with empty decoded GPS and fail incomplete syncs

Tim requested a fix for missing runs in TimOS. Keep may supply an encoded route that decodes to an empty list; date/distance/duration remain valid facts and should be imported without a fabricated route or elevation. Parsing failures must abort before database/JSON persistence so the scheduler cannot silently label incomplete imports successful. Tests use synthetic activity payloads and replace local configuration/database imports to avoid personal data or account access. Release and real sync remain separate authorized actions.

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

## 2026-10-23 · Untimed indoor heart-rate samples cannot invalidate a run

The release audit found a second malformed-input case on the reported indoor activity: individual heart-rate samples can omit their timestamp. Ignore those samples for attaching heart rate to GPS points while preserving Keep's separately reported average and all valid activity facts. Preserve the existing doubtful-activity filter. Real workflow, cloud snapshot and authenticated home verification are required before declaring this incident fixed; an older recovered activity or successful scheduler invocation alone is insufficient.

## 2026-10-23 · Reproducible CI checks with synthetic GPX data

Pin Black/Ruff and explicitly target Python 3.11 formatting across the supported CI matrix. Run static checks and Keep regressions before the GPX smoke test. The GPX check uses the real parser, SQLite persistence and JSON generation in a disposable code-only copy, with synthetic coordinates and a stubbed reverse geocoder; assert output facts and repeat-run deduplication instead of rescanning personal activity data or relying on external geocoding. Production sync behavior and notification settings remain unchanged.
