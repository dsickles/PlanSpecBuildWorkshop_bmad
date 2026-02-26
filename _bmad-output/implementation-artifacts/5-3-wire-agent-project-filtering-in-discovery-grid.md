# Story 5.3: Wire Agent Project Filtering in Discovery Grid

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want Agent Studio to show only relevant agents when I filter by a specific project,
so that unrelated tools are hidden in Focus Mode and I see a clean, project-scoped view.

## Acceptance Criteria

1. **Given** the `DiscoveryGrid` filtering logic, **When** no project filter is active (Browse Mode), **Then** all agents display regardless of their `projects` field.
2. **And** when a project filter is active (Focus Mode), only agents whose `projects` array includes the active project slug are displayed.
3. **And** agents with no `projects` field or an empty `projects` array are hidden in Focus Mode.
4. **And** Domain/Tech Stack filtering continues to apply on top of project filtering using the existing OR logic (cross-column consistency).

## Tasks / Subtasks

- [x] Task 1: Verify and Refine Filtering Logic (AC: 1, 2, 3)
  - [x] Inspect `src/components/custom/DiscoveryGrid.tsx` and confirm `article.projects.includes(activeProject)` logic for agents.
  - [x] Ensure that agents with no project association (empty array) are correctly hidden in Focus Mode.
- [x] Task 2: Advanced Test Coverage (AC: 4)
  - [x] Update `src/components/custom/__tests__/DiscoveryGrid.test.tsx` with specific test cases for:
    - [x] Shared agents visible in Browse Mode.
    - [x] Shared agents correctly filtered in Focus Mode (positive and negative cases).
    - [x] Domain/Tech filters applied correctly to the remaining agent set.
- [x] Task 3: Regression Testing
  - [x] Verify that filtering in the Blueprints and Build Lab columns remains unaffected and follows the existing `projectSlug` matching.
- [x] Task 4: Pre-Review Validation
  - [x] Subtask 4.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask 4.2: Execute all tests (`npm test`) and ensure 100% pass rate.
  - [x] Subtask 4.3: Verify `git status --porcelain` and ensure all changed files are documented.

## Dev Notes

- **Architecture Compliance:**
  - Adheres to "Shared Agent Studio Items (FR19)" in `architecture.md`.
  - Maintains "Speed is Trust" NFR2 (<100ms filtering) by performing all filtering in the client-side `useMemo` of `DiscoveryGrid.tsx`.
- **Source Tree Components:**
  - `src/components/custom/DiscoveryGrid.tsx` (Logic)
  - `src/components/custom/__tests__/DiscoveryGrid.test.tsx` (Verification)
- **Testing Standards:**
  - Focus on unit tests for `DiscoveryGrid` to verify the React state filtering logic.
  - Use `useFilterState` hooks in tests to simulate different URL parameter states.

### Project Structure Notes

- Note: Story 5.2 already updated the Zod schema and content parser to support the `projects` field. 
- Some initial filtering logic was introduced in Story 5.2 to unblock verification; this story (5.3) focuses on complete wiring, hardening, and comprehensive test coverage.

### References

- [Source: epics.md#Story-5.3]
- [Source: architecture.md#Shared-Agent-Studio-Items-(FR19)]
- [Source: prd.md#FR19]
- [Source: implementation-artifacts/5-2-update-content-parser-for-shared-agents.md]

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

- Refined project filtering logic in `DiscoveryGrid.tsx` with null-safety for `projects` array.
- Expanded `DiscoveryGrid.test.tsx` to 8 tests, specifically adding scenarios for:
  - Truly shared agents (no project) being hidden in Focus Mode.
  - Combined filtering logic: agents must match BOTH active project AND Domain/Tech filters when both are active.
- Verified that cross-column consistency is maintained.

### File List

- `src/components/custom/DiscoveryGrid.tsx`
- `src/components/custom/__tests__/DiscoveryGrid.test.tsx`

## Senior Developer Review (Adversarial)

**Reviewer:** Senior Dev AI
**Date:** 2026-02-25

### 🔴 CRITICAL ISSUES
- **None.**

### 🟡 MEDIUM ISSUES
1. ✅ **[Fixed] [Performance] Non-memoized Error Filtering:** Moved error filtering into `useMemo` block.
2. ✅ **[Fixed] [Test Quality] Missing Error Rendering Coverage:** Added comprehensive test case for multi-column error rendering.
3. ✅ **[Fixed] [Process] Git Status Discrepancies:** Fully documented all changed files.
4. ✅ **[Fixed] [Code Quality] Fragile React Keys:** Switched to unique `_filePath` as React keys.

### 🟢 LOW ISSUES
1. ✅ **[Fixed] [Code Quality] Inconsistent Null Safety:** Applied consistent optional chaining across all filter logic.
2. ✅ **[Fixed] [Messy FS] Phantom Test File:** Deleted anomalous file from `src/lib/__tests__`.

### File List
- `src/components/custom/DiscoveryGrid.tsx`
- `src/components/custom/__tests__/DiscoveryGrid.test.tsx`
- `src/lib/schema.ts`
- `src/lib/content-parser.ts`
- `src/lib/content-utils.ts`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
