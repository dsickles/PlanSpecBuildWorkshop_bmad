# Story 11.1: UI Layout Refinement (Expand Button & Empty States)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want the expand/collapse controls to be placed intuitively and for empty states to stay visually "quiet",
so that the interface feels professional and consistent across all filter states.

## Acceptance Criteria

1. **Given** a Blueprint group in the grid, **when** viewing the header, **then** the `[Expand All] / [Collapse All]` button is positioned on the far right of the column.
2. **Given** a filter state with 0 results, **when** the fallback cards appear, **then** no status pill (e.g., "Concept") is displayed in the fallback header.

## Tasks / Subtasks

- [x] Reposition Expand/Collapse controls in `BlueprintGroup` (AC: 1)
  - [x] Move `toggleAll` button to the right-aligned action area in `blueprint-group.tsx`.
- [x] Refine Empty State Fallback UI (AC: 2)
  - [x] Remove `StatusPill` from `FallbackCard` in `project-card.tsx`.
  - [x] Remove `StatusPill` from `BlueprintErrorRow` in `blueprint-group.tsx`.
- [x] Verify Implementation
  - [x] Update and run unit tests for `ProjectCard` and `BlueprintGroup`.
  - [x] Manually verify UI changes in the browser.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` (or equivalent) and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- Repositioning the expand/collapse button should maintain the "Linear Purist" aesthetic.
- Removing status pills from fallbacks ensures they don't draw unnecessary attention when no content is present.
- Use existing `IconButton` or standard button patterns for the repositioned control.

### Project Structure Notes

- Files to touch:
  - `src/components/content/project-card.tsx`
  - `src/components/content/blueprint-group.tsx`
  - `src/components/content/__tests__/ProjectCard.test.tsx`
  - `src/components/content/__tests__/BlueprintGroup.test.tsx`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 11.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Local UI State]

## Dev Agent Record

### Agent Model Used

Antigravity (Custom BMAD Agent)

### Debug Log References

### Completion Notes List

- Restructured `BlueprintGroup` header into a two-row layout:
  - Row 1: Project display name and primary action icons (Overview, Focus).
  - Row 2: Document count (left) and `[Expand All] / [Collapse All]` button (right) perfectly aligned horizontally.
- Reverted button text styling to use brackets and standard casing (e.g., `[Expand All]`) based on user feedback.
- Removed `StatusPill` from `FallbackCard` and `BlueprintErrorRow` for a quieter empty state UI.
- Updated `ProjectCardHeader` to make `status` an optional prop.
- Verified all layout changes with updated unit tests and verified linting.

### File List

- `src/components/content/project-card.tsx`
- `src/components/content/blueprint-group.tsx`
- `src/components/content/__tests__/ProjectCard.test.tsx`
- `src/components/content/__tests__/BlueprintGroup.test.tsx`
