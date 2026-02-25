# Story 3.4: Implement "Clear Filter" Mechanics

Status: review

## Story

As a User,
I want the ability to explicitly dismiss all my active filters,
so that I can easily return to the full, unadulterated portfolio view in one click.

## Acceptance Criteria

1. **Given** active filters in the interface, **When** clicking the "Clear Filters" button in the filter bar, **Then** a single-click action executes a purge of all `?project=`, `?domain=`, and `?tech=` parameters from the URL simultaneously, restoring the full data view.
2. **Given** no active filters, **When** viewing the filter bar, **Then** the "Clear Filters" button should not be visible.
3. **Given** an active project filter, **When** viewing the filter bar, **Then** the button should be styled as a small, muted-red ghost button (`border-red-500/30`, `text-red-400`, `bg-red-500/5`) positioned after the last project pill.

## Tasks / Subtasks

- [x] Task 1: Update `useFilterState` Hook (AC: 1)
  - [x] Subtask 1.1: Add a `clearAllFilters` function to the `useFilterState` hook in `src/hooks/useFilterState.ts`.
  - [x] Subtask 1.2: This function should clear `project`, `domain`, and `tech` parameters while preserving shallow routing (`{ scroll: false }`).
- [x] Task 2: Implement "Clear Filter" Button in `FilterBar` (AC: 1, 2, 3)
  - [x] Subtask 2.1: Add the "✕ Clear Filter" button to `src/components/custom/FilterBar.tsx`.
  - [x] Subtask 2.2: Position it inline in the Projects row, immediately following the project filter pills.
  - [x] Subtask 2.3: Apply the "Tinted Neutrality" red styling (`border-red-500/30`, `text-red-400`, `bg-red-500/5`).
  - [x] Subtask 2.4: Implement conditional visibility: only render the button if `activeProject` is not null or `activeDomains`/`activeTech` are not empty.
- [x] Task 3: Testing & Quality Assurance
  - [x] Subtask 3.1: Verify button appears/disappears correctly based on filter state.
  - [x] Subtask 3.2: Verify single-click clears all three filter categories and restores the full grid.
  - [x] Subtask 3.3: Ensure `npm run lint` and `npm test` pass.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

- [ ] Review Follow-ups (AI)
  - [x] [AI-Review] Fix accessibility: Add `aria-label` to "Clear Filter" button (Severity: Medium)
  - [x] [AI-Review] Cleanup: Remove outdated "expected to FAIL" comments in `FilterBar.test.tsx` (Severity: Low)
  - [ ] [AI-Review] UX Alignment: Move "Clear Filter" button to a more global position or ensure it doesn't look isolated when only secondary filters are active (Severity: Medium)
  - [x] [AI-Review] Refactor: Extract "Tinted Neutrality" red button styles to a shared utility or constant (Severity: Low)

## Dev Notes

- **Architecture Compliance:**
  - Stick to URL query parameters for state (per decision matrix).
  - Use `window.history.replaceState` or Next.js `router.push` via the hook to avoid full page reloads.
  - Button styling must follow the exact hex/tint patterns in the UX spec to preserve "Linear Purist" aesthetic.

- **Component Structure:**
  - Logic belongs in `src/components/custom/FilterBar.tsx` and `src/hooks/useFilterState.ts`.

- **References:**
  - [Source: _bmad-output/planning-artifacts/ux-design-specification.md#5.-The-Clear-Filter-Pattern]
  - [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

- Renamed `clearFilters` to `clearAllFilters` in `useFilterState.ts` and updated implementation to match requested logic.
- Implemented "Clear Filter" button in `FilterBar.tsx` with conditional visibility for Project, Domain, and Tech filters.
- Applied "Tinted Neutrality" red styling to the "Clear Filter" button.
- Added comprehensive unit tests in `src/components/custom/__tests__/FilterBar.test.tsx`.
- Updated existing tests in `src/hooks/__tests__/useFilterState.test.tsx`.
- Verified all acceptance criteria are met and all tests pass.

### File List

- `src/hooks/useFilterState.ts` (Modified)
- `src/components/custom/FilterBar.tsx` (Modified)
- `src/components/custom/__tests__/FilterBar.test.tsx` (New)
- `src/hooks/__tests__/useFilterState.test.tsx` (Modified)
- `_bmad-output/implementation-artifacts/3-4-implement-clear-filter-mechanics.md` (Modified)

## Senior Developer Review (AI)

**Outcome:** Changes Requested (4 findings)
**Date:** 2026-02-25

### Action Items

- [x] [Medium] Add `aria-label="Clear all filters"` to the "Clear Filter" button in `FilterBar.tsx`. Icon-only or icon-heavy buttons MUST be accessible to screen readers.
- [x] [Low] Remove stale comments in `FilterBar.test.tsx` (lines 65, 81) that refer to previous failing states. Clean tests are as important as clean code.
- [ ] [Medium] Re-evaluate "Clear Filter" button placement. Currently, it lives in the "Projects" row but triggers if *any* filter is active. If only "Tech" is filtered, the button appears in a row otherwise showing "All" selected, which is confusing.
- [x] [Low] Consider extracting the red ghost button styles (border-red-500/30, etc.) into a reusable utility.

### Criticality Breakdown
- High: 0
- Medium: 2
- Low: 2
