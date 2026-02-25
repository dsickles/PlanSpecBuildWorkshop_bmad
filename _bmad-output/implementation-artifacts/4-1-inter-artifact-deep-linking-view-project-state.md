# Story 4.1: Inter-Artifact Deep Linking ("View Project State")

Status: review

## Story

As a User,
I want to click the "Layers" icon on an artifact card to instantly establish a "View Project State" that hides all unrelated documents,
so that I can focus entirely on the interrelated PRDs, Architecture docs, and Prototypes for a specific project.

## Acceptance Criteria

1. **Given** an artifact card rendered within the `DashboardGrid`, **When** a user interacts with the explicit "Layers" action, **Then** the application performs a shallow push (reusing the Epic 3 routing mechanics) to update the URL `searchParams` with the artifact's `parent_project` slug.
2. **Given** the URL updated with a `project` parameter, **Then** the grid must instantly filter to display only artifacts sharing that specific project slug, hiding all unrelated portfolio content without requiring a new page load.
3. **Given** Focus Mode entry via the "Layers" icon, **Then** it must produce identical state to selecting a project pill in the filter bar.
4. **Given** Focus Mode entry, **Then** it should auto-expand the Blueprint document cards for that project (reusing existing Focus Mode logic if it exists).

## Tasks / Subtasks

- [x] Task 1: Update `BlueprintGroup` and `DiscoveryGrid` (AC: 1, 3)
  - [x] Subtask 1.1: Add the "Layers/Stack" icon (using Lucide `Layers`) to the `BlueprintGroup` header and Prototype cards.
  - [x] Subtask 1.2: Implement the click handler for the Layers icon to update the URL `project` slug via `setProject`.
  - [x] Subtask 1.3: Apply styling: `text-zinc-500`, brightens to `text-zinc-50` on hover.
- [x] Task 2: Verify Focus Mode Integration (AC: 2, 4)
  - [x] Subtask 2.1: Ensure `useFilterState` correctly handles the shallow push and the grid re-renders.
  - [x] Subtask 2.2: Verify that auto-expansion of document rows works when `project` param is set via the Layers icon.
- [x] Task 3: Testing & Quality Assurance
  - [x] Subtask 3.1: Add unit tests for `BlueprintGroup` and `DiscoveryGrid` click interaction.
  - [x] Subtask 3.2: Manually verify the "Layers" icon transitions the UI to Focus Mode for the correct project.
  - [x] Subtask 3.3: Ensure `npm run lint` and `npm test` pass.

## Dev Notes

- **Architecture Compliance:**
  - Reuse the routing mechanics from Epic 3 (Next.js `searchParams`).
  - Agent cards do NOT get a Layers icon (per UX spec).
  - Blueprints project-level header card gets the Layers icon on the right.
  - Prototype cards get the Layers icon in the card header row on the right.
  - **UX Update:** Document rows stay expanded after clearing Focus Mode (decided during code review).

- **References:**
  - [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Story-4.1]
  - [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1]

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

- Added `onLayersClick` prop to `BlueprintGroup` and rendered the `Layers` icon in the group header.
- Wired up `onLayersClick` in `DiscoveryGrid` for both `BlueprintGroup` and prototype `ProjectCard`s to call `setProject` from `useFilterState`.
- Updated `BlueprintGroup` to accept a `projectTitle` prop, avoiding brittle regex-based title generation.
- Modified `content-parser.ts` to include `projectTitle` in `ParsedArticle` by reading the project's `index.md`.
- Verified that clicking the "Layers" icon correctly establishes Focus Mode (updates URL, filters grid, and auto-expands documents).
- Confirmed with Sally (UX) that document rows should *not* auto-collapse when clearing filters (Architecture updated).
- Added unit tests for `BlueprintGroup` and `DiscoveryGrid` covering the new functionality.
- Successfully ran `npm run lint` and `npm test`.

### File List

- `src/components/content/blueprint-group.tsx` (Modified)
- `src/components/custom/DiscoveryGrid.tsx` (Modified)
- `src/lib/content-parser.ts` (Modified)
- `src/app/page.tsx` (Modified)
- `src/components/content/__tests__/BlueprintGroup.test.tsx` (Modified)
- `src/components/custom/__tests__/DiscoveryGrid.test.tsx` (Modified)
- `_bmad-output/planning-artifacts/architecture.md` (Modified)
