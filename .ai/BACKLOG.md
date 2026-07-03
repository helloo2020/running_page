# Backlog

Keep this lightweight. Move only selected work into `.ai/CURRENT.md` when Tim confirms it belongs to the active sprint.

## P0

- Name: Privacy review
  - Description: Review which generated files and UI states expose GPS routes, cities, activity times, and heart-rate data.
  - Status: Proposed

- Name: Baseline build check
  - Description: Run `pnpm run build` and record whether the current app builds cleanly before new feature work.
  - Status: Proposed

## P1

- Name: Minimal frontend smoke validation
  - Description: Add or document a small validation path for the main page so future UI edits can be checked quickly.
  - Status: Proposed

- Name: CI staging safety
  - Description: Review the GitHub Actions `git add .` step and consider narrowing generated-file staging if it causes noisy or risky commits.
  - Status: Proposed

- Name: Map/privacy settings cleanup
  - Description: Clarify `PRIVACY_MODE`, lights mode, map fallback behavior, and whether Tim wants public map details.
  - Status: Proposed

## P2

- Name: Upstream sync policy
  - Description: Decide whether this fork should track upstream `running_page` closely or prioritize Tim-specific stability.
  - Status: Proposed

- Name: Provider support review
  - Description: Revisit additional activity providers only if Tim has a real data source and clear value.
  - Status: Proposed
